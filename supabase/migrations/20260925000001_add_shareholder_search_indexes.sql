-- Indexes for the admin Shareholder Search page (/dashboard/shareholder-search).
--
-- The page looks a person up across every project by an exact match on
-- date_of_birth_code or registration, then loads that person's submissions.
-- Measured on the shareholder table at 1.45M rows:
--
--   idx_shareholder_registration / idx_shareholder_date_of_birth_code
--     Neither column had a btree index (registration only appeared inside the
--     tsvector GIN, which an equality filter cannot use).
--     `where date_of_birth_code = '...' or registration = '...'` was a Parallel
--     Seq Scan ("Rows Removed by Filter: 724418" per worker) at ~2,417ms per
--     search. With both indexes the planner uses a BitmapOr of index scans.
--
--   idx_submission_shareholder_id
--     The report loads submissions with `shareholder_id in (...)`; submission
--     only had an index on project_id, so this was a Seq Scan over 163k rows.
--
-- NOTE: these were applied with CREATE INDEX CONCURRENTLY, which cannot run
-- inside a transaction block. If you replay this file through a migration
-- runner that wraps statements in a transaction, either strip CONCURRENTLY
-- (takes a write-blocking lock for ~30-90s on this table size) or run each
-- statement outside the transaction.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shareholder_registration
    ON public.shareholder USING btree (registration);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shareholder_date_of_birth_code
    ON public.shareholder USING btree (date_of_birth_code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submission_shareholder_id
    ON public.submission USING btree (shareholder_id);
