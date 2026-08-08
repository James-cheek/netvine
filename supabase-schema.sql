-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Then run supabase-announcements.sql for the version announcements feature

-- 1. Profiles table (auto-created on signup via trigger)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  paystack_customer_code text,
  subscription_status text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Members table
create table members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  parent_id uuid references members on delete cascade,
  name text not null,
  progress text not null default 'New',
  current_issue text default '',
  proposed_solution text default '',
  joined_date text,
  created_at timestamptz not null default now()
);

alter table members enable row level security;

create policy "Users can read own members"
  on members for select using (auth.uid() = user_id);

create policy "Users can insert own members"
  on members for insert with check (auth.uid() = user_id);

create policy "Users can update own members"
  on members for update using (auth.uid() = user_id);

create policy "Users can delete own members"
  on members for delete using (auth.uid() = user_id);

-- 3. Tracking entries table
create table tracking_entries (
  id text primary key,
  member_id uuid not null references members on delete cascade,
  date text not null,
  text text not null,
  created_at timestamptz not null default now()
);

alter table tracking_entries enable row level security;

create policy "Users can read own tracking entries"
  on tracking_entries for select
  using (exists (
    select 1 from members where members.id = tracking_entries.member_id and members.user_id = auth.uid()
  ));

create policy "Users can insert own tracking entries"
  on tracking_entries for insert
  with check (exists (
    select 1 from members where members.id = tracking_entries.member_id and members.user_id = auth.uid()
  ));

create policy "Users can delete own tracking entries"
  on tracking_entries for delete
  using (exists (
    select 1 from members where members.id = tracking_entries.member_id and members.user_id = auth.uid()
  ));
