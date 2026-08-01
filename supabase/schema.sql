-- Supabase SQL Editor에서 실행하세요.
-- Table Editor > SQL > New query 에 붙여넣고 Run

create table if not exists public.entries (
  id text primary key,
  category text not null check (category in ('herb', 'anatomy')),
  created_at bigint not null,
  updated_at bigint not null,
  name text not null default '',
  -- 본초학 필드
  properties text not null default '',
  efficacy text not null default '',
  components text not null default '',
  prescriptions text not null default '',
  notes text not null default '',
  -- 해부학 필드
  subtype text check (subtype is null or subtype in ('muscle', 'nerve', 'bone', 'vessel')),
  location text not null default '',
  innervation text not null default '',
  function_text text not null default '',
  clinical text not null default '',
  -- 공통
  image text
);

create index if not exists entries_category_idx on public.entries (category);
create index if not exists entries_updated_at_idx on public.entries (updated_at desc);

alter table public.entries enable row level security;

create policy "entries_select_anon"
  on public.entries for select
  to anon, authenticated
  using (true);

create policy "entries_insert_anon"
  on public.entries for insert
  to anon, authenticated
  with check (true);

create policy "entries_update_anon"
  on public.entries for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "entries_delete_anon"
  on public.entries for delete
  to anon, authenticated
  using (true);
