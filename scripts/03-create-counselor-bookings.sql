-- Create counselors table
create table if not exists public.counselors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialization text not null,
  email text not null unique,
  phone text not null,
  bio text,
  available_hours jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  counselor_id uuid references public.counselors(id) on delete cascade not null,
  appointment_date timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.counselors enable row level security;
alter table public.bookings enable row level security;

-- Create policies for counselors (public read access)
create policy "counselors_select_all"
  on public.counselors for select
  to authenticated
  using (true);

-- Create policies for bookings
create policy "bookings_select_own"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "bookings_insert_own"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "bookings_update_own"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "bookings_delete_own"
  on public.bookings for delete
  using (auth.uid() = user_id);
