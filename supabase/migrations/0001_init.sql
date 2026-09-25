-- Gap and Gain: initial schema
-- Run with `supabase db push` (Supabase CLI) or paste into the SQL editor
-- of your Supabase project.

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  goals text[] not null default '{}',
  gains text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists daily_entries_user_id_date_idx
  on public.daily_entries (user_id, date desc);

alter table public.daily_entries enable row level security;

create policy "Users can view their own entries"
  on public.daily_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.daily_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.daily_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.daily_entries for delete
  using (auth.uid() = user_id);
