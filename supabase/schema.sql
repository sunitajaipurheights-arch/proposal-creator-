-- ============================================================
--  Jaipur Heights — Proposal Studio  |  Supabase schema
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- ============================================================

-- 1) Proposals table -----------------------------------------
create table if not exists public.proposals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default 'Untitled Proposal',
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists proposals_user_id_idx on public.proposals (user_id);
create index if not exists proposals_updated_at_idx on public.proposals (updated_at desc);

-- 2) Row Level Security: each user sees only their own rows ---
alter table public.proposals enable row level security;

drop policy if exists "own proposals - select" on public.proposals;
create policy "own proposals - select" on public.proposals
  for select using (auth.uid() = user_id);

drop policy if exists "own proposals - insert" on public.proposals;
create policy "own proposals - insert" on public.proposals
  for insert with check (auth.uid() = user_id);

drop policy if exists "own proposals - update" on public.proposals;
create policy "own proposals - update" on public.proposals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own proposals - delete" on public.proposals;
create policy "own proposals - delete" on public.proposals
  for delete using (auth.uid() = user_id);

-- 3) Storage bucket for photos -------------------------------
insert into storage.buckets (id, name, public)
values ('proposal-photos', 'proposal-photos', true)
on conflict (id) do update set public = true;

-- Public read (needed because photo URLs are embedded in the proposal).
drop policy if exists "photos - public read" on storage.objects;
create policy "photos - public read" on storage.objects
  for select using (bucket_id = 'proposal-photos');

-- Authenticated users can upload into their own folder (path prefix = their uid).
drop policy if exists "photos - authed insert" on storage.objects;
create policy "photos - authed insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'proposal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "photos - authed delete" on storage.objects;
create policy "photos - authed delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'proposal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
