-- Indexes for the large-project path on /dashboard/project/:id.
--
-- Measured on project 207 (62,284 shareholders; shareholder table 1.45M rows / 598MB):
--
--   idx_shareholder_project_no_id
--     The shareholder list is ordered by (no, id) within a project. With only
--     idx_shareholder_project_id (project_id alone), every page scanned all 62k
--     index entries and then sorted -- batch reads at depth reported
--     "Sort Method: external merge  Disk: 3312kB" at ~127ms EACH, and the app
--     issued ~63 such batches. This composite matches the sort exactly.
--
--   idx_submission_project_id
--     submission had no index on project_id at all: fetching the 540 rows for
--     project 207 was a Seq Scan over 163,181 rows ("Rows Removed by Filter:
--     162641"), 33ms -> 0.6ms with the index.
--
-- NOTE: these were applied with CREATE INDEX CONCURRENTLY, which cannot run
-- inside a transaction block. If you replay this file through a migration
-- runner that wraps statements in a transaction, either strip CONCURRENTLY
-- (takes a write-blocking lock for ~30-90s on this table size) or run each
-- statement outside the transaction.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shareholder_project_no_id
    ON public.shareholder USING btree (project_id, no, id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submission_project_id
    ON public.submission USING btree (project_id);
