-- Run this in your Supabase SQL editor

create table if not exists public.cma_reports (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  subject jsonb not null,
  comps jsonb not null default '[]'::jsonb,
  market_stats jsonb not null default '{}'::jsonb,
  suggested_low integer not null default 0,
  suggested_high integer not null default 0,
  suggested_price integer not null default 0,
  client_name text,
  client_email text,
  agent_notes text
);

-- Row-level security: agents can only see their own reports
alter table public.cma_reports enable row level security;

create policy "Agents manage own reports"
  on public.cma_reports
  for all
  using (auth.uid() = agent_id)
  with check (auth.uid() = agent_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cma_reports_updated_at
  before update on public.cma_reports
  for each row execute function public.handle_updated_at();

-- Indexes for common query patterns
create index if not exists cma_reports_agent_id_idx on public.cma_reports(agent_id);
create index if not exists cma_reports_created_at_idx on public.cma_reports(created_at desc);
