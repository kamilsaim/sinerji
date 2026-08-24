create table sin_rings (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('süresiz', 'hedefli', 'süreli', 'dua')),
  goal integer check (goal is null or goal > 0),
  deadline timestamptz,
  total_count integer not null default 0,
  participant_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table sin_ring_contributions (
  id uuid primary key default gen_random_uuid(),
  ring_id uuid not null references sin_rings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null default 1 check (amount > 0),
  created_at timestamptz not null default now()
);

create index sin_ring_contributions_ring_id_idx on sin_ring_contributions(ring_id);
create index sin_ring_contributions_user_id_idx on sin_ring_contributions(user_id);

create or replace function sin_apply_ring_contribution() returns trigger as $$
declare
  is_new_participant boolean;
begin
  select not exists (
    select 1 from sin_ring_contributions
    where ring_id = new.ring_id and user_id = new.user_id and id <> new.id
  ) into is_new_participant;

  update sin_rings
  set total_count = total_count + new.amount,
      participant_count = participant_count + case when is_new_participant then 1 else 0 end
  where id = new.ring_id;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger sin_ring_contribution_after_insert
after insert on sin_ring_contributions
for each row execute function sin_apply_ring_contribution();

alter table sin_rings enable row level security;
alter table sin_ring_contributions enable row level security;

create policy sin_rings_select_all on sin_rings
  for select using (true);

create policy sin_rings_insert_own on sin_rings
  for insert with check (auth.uid() = created_by);

create policy sin_ring_contributions_select_own on sin_ring_contributions
  for select using (auth.uid() = user_id);

create policy sin_ring_contributions_insert_own on sin_ring_contributions
  for insert with check (auth.uid() = user_id);
