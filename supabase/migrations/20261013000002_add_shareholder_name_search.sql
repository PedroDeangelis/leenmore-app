-- Name search for the admin Shareholder Search page (/dashboard/shareholder-search).
--
-- The page used to accept only a date_of_birth_code or registration number.
-- There is no btree on name, and `name ilike '%x%'` is a Parallel Seq Scan
-- over 1.45M rows (~2.4s). The live table already has
--
--   idx_shareholder_search ON shareholder USING gin (
--       to_tsvector('simple', coalesce(registration, '') || ' ' ||
--                             coalesce(name, '') || ' ' ||
--                             coalesce(contact_worker, '')))
--
-- (created outside this repo). GIN tsvector indexes support prefix queries,
-- so a name search is `@@ to_tsquery('simple', '홍길:*')` on exactly that
-- expression. Measured: '김민:*' (11,732 index hits) answers in ~350ms cold.
--
-- PostgREST cannot filter on an expression, so the match lives in this
-- function. It returns plain shareholder rows so the app embeds the project
-- the same way as the number search:
--   .rpc('search_shareholders_by_name', { p_name })
--   .select('*, project:project_id!inner(id,title,results,status)')
--
-- Why both conditions:
--   * the tsvector also covers contact_worker, so '김수진:*' alone returns
--     every shareholder assigned to a WORKER called 김수진. The `name ilike`
--     check removes those and only runs on the index candidates.
--   * the tsquery is built from to_tsvector('simple', p_name) lexemes so the
--     words are split and lower-cased exactly like the index. Lexemes that
--     contain tsquery syntax characters are dropped instead of quoted.
--
-- No LIMIT and no SET clause on purpose: both would stop PostgreSQL from
-- inlining the function, and inlining lets PostgREST's limit, order and
-- project filter be planned together with the index scan. The app enforces
-- the 2-character minimum; the function only repeats it as a guard.
--
-- Applied to production by hand in the SQL editor on 2026-10-13. The dev
-- project (.env.dev) still needs it if that one is used.

create or replace function public.search_shareholders_by_name(p_name text)
returns setof public.shareholder
language sql
stable
security invoker
as $$
    select s.*
    from public.shareholder s
    where length(btrim(coalesce(p_name, ''))) >= 2
      and to_tsvector('simple',
              coalesce(s.registration, '') || ' ' ||
              coalesce(s.name, '') || ' ' ||
              coalesce(s.contact_worker, ''))
          @@ to_tsquery('simple', (
              select string_agg(w || ':*', ' & ')
              from unnest(tsvector_to_array(to_tsvector('simple', p_name))) as w
              where w !~ '[''\\&|!():<*]'
          ))
      and s.name ilike '%' || regexp_replace(btrim(p_name), '([%_\\])', '\\\1', 'g') || '%';
$$;

-- security invoker, like project_shareholder_result_tally: shareholder's RLS
-- policies are "for all to public using (true)", so this grants nothing the
-- caller does not already have.
grant execute on function public.search_shareholders_by_name(text) to anon, authenticated;
