-- ============================================================
-- HUBEKS HIMSI — Supabase Database Setup Script
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Enable UUID extension (required for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the media_partners table
CREATE TABLE IF NOT EXISTS public.media_partners (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT        NOT NULL,
  type          TEXT,
  contact_person TEXT,
  phone         TEXT,
  email         TEXT,
  mou_url       TEXT,
  status        TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.media_partners ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Only authenticated users can SELECT (read)
CREATE POLICY "authenticated_select_media_partners"
  ON public.media_partners
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. RLS Policy: Only authenticated users can INSERT
CREATE POLICY "authenticated_insert_media_partners"
  ON public.media_partners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. RLS Policy: Only authenticated users can UPDATE
CREATE POLICY "authenticated_update_media_partners"
  ON public.media_partners
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. RLS Policy: Only authenticated users can DELETE
CREATE POLICY "authenticated_delete_media_partners"
  ON public.media_partners
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- STORAGE BUCKET SETUP
-- Storage buckets cannot be created via SQL.
-- Follow these steps in the Supabase Dashboard:
--
-- 1. Go to Storage → New Bucket
-- 2. Name: mou-files
-- 3. Public: YES (so files can be accessed via public URL)
-- 4. Click "Create Bucket"
--
-- Then add this Storage Policy:
-- 5. Go to Storage → Policies → mou-files bucket
-- 6. Add new policy for authenticated users:
--    - Operation: INSERT, SELECT, UPDATE, DELETE
--    - Roles: authenticated
--    - Policy expression: true
-- ============================================================

-- ============================================================
-- MEMBERS TABLE SETUP (Feature: Members Management + Birthday Reminder)
-- ============================================================

-- 8. Create the members table
CREATE TABLE IF NOT EXISTS public.members (
  id            UUID   PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT   NOT NULL,
  nim           TEXT,
  division      TEXT,
  position      TEXT,
  phone         TEXT,
  email         TEXT,
  birth_date    DATE   NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Enable RLS on members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 10. RLS: authenticated users can SELECT members
CREATE POLICY "authenticated_select_members"
  ON public.members
  FOR SELECT
  TO authenticated
  USING (true);

-- 11. RLS: authenticated users can INSERT members
CREATE POLICY "authenticated_insert_members"
  ON public.members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 12. RLS: authenticated users can UPDATE members
CREATE POLICY "authenticated_update_members"
  ON public.members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 13. RLS: authenticated users can DELETE members
CREATE POLICY "authenticated_delete_members"
  ON public.members
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- BIRTHDAY HELPER: Query members with birthday today
-- Use this in Supabase SQL Editor or as an RPC function:
-- ============================================================
-- SELECT * FROM members
-- WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
--   AND EXTRACT(DAY FROM birth_date)   = EXTRACT(DAY FROM CURRENT_DATE);

-- Optional: Verify both tables
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('media_partners', 'members', 'programs')
ORDER BY table_name, ordinal_position;

-- ============================================================
-- PROGRAMS TABLE SETUP (Feature: Program Kerja HUBEKS)
-- ============================================================

-- 14. Create the programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id            UUID   PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT   NOT NULL,
  description   TEXT,
  tujuan        TEXT,
  sasaran       TEXT,
  target        TEXT,
  pelaksanaan   TEXT,
  status        TEXT   DEFAULT 'planned',
  start_date    DATE,
  end_date      DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Enable RLS on programs
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 16. RLS: authenticated users can SELECT programs
CREATE POLICY "authenticated_select_programs"
  ON public.programs
  FOR SELECT
  TO authenticated
  USING (true);

-- 17. RLS: authenticated users can INSERT programs
CREATE POLICY "authenticated_insert_programs"
  ON public.programs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 18. RLS: authenticated users can UPDATE programs
CREATE POLICY "authenticated_update_programs"
  ON public.programs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 19. RLS: authenticated users can DELETE programs
CREATE POLICY "authenticated_delete_programs"
  ON public.programs
  FOR DELETE
  TO authenticated
  USING (true);
