-- USERS
create table profiles (
  id uuid not null primary key, -- UUID from auth.users
  email text,
  first_name text,
  last_name text,
  street text,
  city text,
  province text
);
comment on table users is 'Profile data for each user.';
comment on column users.id is 'References the internal Supabase Auth user.';

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );