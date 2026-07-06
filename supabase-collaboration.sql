-- Run this in the Supabase SQL editor to enable project collaboration.
-- It keeps invite codes secret-ish by joining through a security definer function
-- instead of letting every user read every project row.

alter table public.projects
  add column if not exists invite_code text;

create unique index if not exists projects_invite_code_key
  on public.projects (invite_code)
  where invite_code is not null;

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

alter table public.project_members enable row level security;
alter table public.projects enable row level security;
alter table public.songs enable row level security;

drop policy if exists "Members can read memberships" on public.project_members;
drop policy if exists "Users can read own memberships" on public.project_members;
create policy "Users can read own memberships"
  on public.project_members
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can add themselves as members" on public.project_members;
create policy "Users can add themselves as members"
  on public.project_members
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Members can delete memberships" on public.project_members;
drop policy if exists "Users can delete own memberships" on public.project_members;
create policy "Users can delete own memberships"
  on public.project_members
  for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Members can read projects" on public.projects;
create policy "Members can read projects"
  on public.projects
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.project_members members
      where members.project_id = projects.id
        and members.user_id = auth.uid()
    )
  );

drop policy if exists "Authenticated users can create projects" on public.projects;
create policy "Authenticated users can create projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "Members can update projects" on public.projects;
create policy "Members can update projects"
  on public.projects
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.project_members members
      where members.project_id = projects.id
        and members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.project_members members
      where members.project_id = projects.id
        and members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can delete projects" on public.projects;
create policy "Members can delete projects"
  on public.projects
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.project_members members
      where members.project_id = projects.id
        and members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can read songs" on public.songs;
create policy "Members can read songs"
  on public.songs
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.project_members members
      where members.project_id = songs.project_id
        and members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can create songs" on public.songs;
create policy "Members can create songs"
  on public.songs
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.project_members members
      where members.project_id = songs.project_id
        and members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can update songs" on public.songs;
create policy "Members can update songs"
  on public.songs
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.project_members members
      where members.project_id = songs.project_id
        and members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.project_members members
      where members.project_id = songs.project_id
        and members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can delete songs" on public.songs;
create policy "Members can delete songs"
  on public.songs
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.project_members members
      where members.project_id = songs.project_id
        and members.user_id = auth.uid()
    )
  );

create or replace function public.join_project_with_invite(join_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  matching_project_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You need to sign in first.';
  end if;

  select id
    into matching_project_id
    from public.projects
    where invite_code = upper(regexp_replace(trim(join_code), '\s+', '', 'g'))
    limit 1;

  if matching_project_id is null then
    return null;
  end if;

  insert into public.project_members (
    project_id,
    user_id,
    role
  )
  values (
    matching_project_id,
    auth.uid(),
    'editor'
  )
  on conflict (project_id, user_id) do nothing;

  return matching_project_id;
end;
$$;

grant execute on function public.join_project_with_invite(text)
  to authenticated;
