-- ChronoGlobe persistent event archive foundation.
-- Apply through Supabase SQL editor or the connected Supabase integration.
create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  summary text not null default '',
  event_date timestamptz,
  date_precision text not null default 'unknown'
    check (date_precision in ('exact','day','month','year','approximate','unknown')),
  location_name text,
  country_code text,
  category text not null
    check (category in ('law','markets','conflict','politics','science','culture','exploration','other')),
  importance smallint not null default 3 check (importance between 1 and 5),
  status text not null default 'developing'
    check (status in ('developing','confirmed','corrected','disputed','archived')),
  is_historical boolean not null default false,
  source_urls text[] not null default '{}',
  source_names text[] not null default '{}',
  source_published_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists events_event_date_idx on public.events (event_date desc);
create index if not exists events_category_date_idx on public.events (category, event_date desc);
create index if not exists events_importance_date_idx on public.events (importance desc, event_date desc);
create index if not exists events_status_idx on public.events (status);
create index if not exists events_source_urls_gin_idx on public.events using gin (source_urls);

create table if not exists public.event_updates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  update_type text not null check (update_type in ('created','source_added','summary_updated','status_changed','correction')),
  note text not null default '',
  previous_values jsonb,
  new_values jsonb,
  created_at timestamptz not null default now()
);
create index if not exists event_updates_event_created_idx on public.event_updates (event_id, created_at desc);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running','success','partial','failed')),
  articles_seen integer not null default 0,
  events_inserted integer not null default 0,
  events_updated integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.event_updates enable row level security;
alter table public.ingestion_runs enable row level security;

-- Public users may read the published archive. Only trusted server-side jobs
-- using the service role should write. Never expose the service-role key in the browser.
drop policy if exists "Public can read events" on public.events;
create policy "Public can read events" on public.events for select to anon, authenticated using (status in ('confirmed','archived'));
drop policy if exists "Public can read event updates" on public.event_updates;
create policy "Public can read event updates" on public.event_updates for select to anon, authenticated using (
  exists (select 1 from public.events e where e.id = event_id and e.status in ('confirmed','archived'))
);
-- No anon/authenticated write policies are created intentionally.
