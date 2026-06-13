-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- to create the required tables for the CRM app.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Customers table
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz default now() not null
);

-- Orders table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_name text not null,
  amount numeric(10, 2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped')),
  created_at timestamptz default now() not null
);

-- Notes table
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  text text not null,
  created_at timestamptz default now() not null
);

-- Row Level Security (RLS)
-- Enable RLS on all tables (authenticated users can access all rows)
alter table customers enable row level security;
alter table orders enable row level security;
alter table notes enable row level security;

-- Policies: allow all operations for authenticated users
create policy "Allow all for authenticated" on customers
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated" on orders
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated" on notes
  for all using (auth.role() = 'authenticated');

-- Sample data (optional - remove if you prefer to start empty)
insert into customers (name, email, phone) values
  ('Alice Johnson', 'alice@example.com', '+1 555-0101'),
  ('Bob Martinez', 'bob@example.com', '+1 555-0102'),
  ('Carol White', 'carol@example.com', '+1 555-0103')
on conflict (email) do nothing;
