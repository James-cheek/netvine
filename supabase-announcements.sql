-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql

-- 1. Announcements table (only you can insert via dashboard / service key)
create table announcements (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  title text not null,
  notes text not null,
  released_at timestamptz not null default now()
);

alter table announcements enable row level security;

create policy "Anyone authenticated can read announcements"
  on announcements for select
  using (auth.role() = 'authenticated');

-- No insert/update/delete policies = only service_role or dashboard can write

-- 2. Add last_seen_version to profiles
alter table profiles
  add column if not exists last_seen_version text;

-- ============================================================
-- PUBLISHING A NEW ANNOUNCEMENT
-- ============================================================
-- When you ship an update, run this in the SQL Editor:
--
--   insert into announcements (version, title, notes) values (
--     '1.0.0',
--     'Welcome to Netvine',
--     '- Track your full network in a visual org chart
--   - Add members, set their status, log progress
--   - Everything saves automatically to the cloud'
--   );
--
-- The app picks it up on next load. Users see it once, then
-- it's dismissed until the next version.
-- ============================================================
