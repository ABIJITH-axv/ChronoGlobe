-- ChronoGlobe database bootstrap for Supabase.
-- Run once in the Supabase SQL Editor. Review policies before production use.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student','teacher','researcher')),
  created_at timestamptz not null default now()
);
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  join_code text unique not null,
  created_at timestamptz not null default now()
);
create table if not exists public.classroom_members (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (classroom_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, role)
  values (new.id, case when new.raw_user_meta_data->>'role' in ('student','teacher','researcher') then new.raw_user_meta_data->>'role' else 'student' end)
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "read own favorites" on public.favorites;
create policy "read own favorites" on public.favorites for select using (auth.uid() = user_id);
drop policy if exists "insert own favorites" on public.favorites;
create policy "insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
drop policy if exists "delete own favorites" on public.favorites;
create policy "delete own favorites" on public.favorites for delete using (auth.uid() = user_id);
drop policy if exists "teacher manages own classrooms" on public.classrooms;
create policy "teacher manages own classrooms" on public.classrooms for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);
drop policy if exists "members read own memberships" on public.classroom_members;
create policy "members read own memberships" on public.classroom_members for select using (auth.uid() = user_id);
-- Classroom membership insertion is intentionally not opened to arbitrary users.
