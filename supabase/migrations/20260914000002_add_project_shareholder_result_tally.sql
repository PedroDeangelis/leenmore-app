-- Server-side results tally for a project's shareholders.
--
-- Replaces a client-side aggregation that required downloading every
-- shareholder row (62,284 rows x 25 columns for project 207) just to sum
-- shares per result option. This runs in ~140ms and returns ~18 rows.
--
-- Two details below are load-bearing; see the comments before changing them.

create or replace function public.project_shareholder_result_tally(p_project_id bigint)
returns table (
    bucket       text,
    cnt          bigint,
    total_shares numeric
)
language sql
stable
security invoker
-- Pinned search_path: every reference must be schema-qualified below, or it
-- fails at RUNTIME (not at creation).
set search_path = ''
as $$
    select
        case
            -- Truthiness, NOT "is not null". These are text columns whose empty
            -- value is '' rather than NULL (62,262 of 62,284 rows on project 207
            -- have api_recipient_contact = ''), and the JS this replaces treated
            -- '' as falsy. Using "is not null" here puts EVERY row in the
            -- __eproxy__ bucket; only 22 rows are genuinely eproxy.
            when coalesce(s.eletronic_voting, '') <> '' then '__ev__'
            when coalesce(s.api_recipient_contact, '') <> ''
             and coalesce(s.api_recipient_completion_date, '') <> '' then '__eproxy__'
            else coalesce(s.result, '__null__')
        end as bucket,
        count(*) as cnt,
        -- `shares` is comma-formatted text and is not always clean: three live
        -- rows are whitespace-padded (' 7,000 ' on project 55, '280 ' and '220 '
        -- on project 87). A bare ::numeric cast throws "invalid input syntax for
        -- type numeric" and takes down the whole results panel for those
        -- projects. JS Number() trims, so btrim restores parity and the else
        -- branch mirrors JS's `NaN || 0`.
        --
        -- trunc() is applied PER ROW inside the sum to match the per-row
        -- Math.trunc() in the JS accumulation, not to the final total.
        sum(
            case
                when btrim(replace(s.shares, ',', '')) ~ '^-?([0-9]+(\.[0-9]*)?|\.[0-9]+)$'
                    then trunc(btrim(replace(s.shares, ',', ''))::numeric)
                else 0
            end
        ) as total_shares
    from public.shareholder s
    where s.project_id = p_project_id
    group by 1;
$$;

-- security invoker (not definer): every RLS policy on shareholder is
-- "for all to public using (true)", so this grants no access the caller does
-- not already have. security definer would become a privilege-escalation path
-- the moment those policies are tightened.
grant execute on function public.project_shareholder_result_tally(bigint) to anon, authenticated;
