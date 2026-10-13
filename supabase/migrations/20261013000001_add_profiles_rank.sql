-- Free-text rank (직급) for worker profiles. Edited on the admin user page
-- (/dashboard/user/:id) and read by the storage server to fill the
-- [worker_rank] shortcode in custom documents (Email to worker, 맞춤 문서).
--
-- Applied to the production project via the Supabase MCP on 2026-10-13. The
-- dev project (.env.dev) needs it run in its SQL editor.

alter table public.profiles add column if not exists rank text;
