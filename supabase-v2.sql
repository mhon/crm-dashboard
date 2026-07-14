-- CRM Phase 1 Schema Additions

-- Companies table
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text,
  industry text,
  created_at timestamptz default now() not null
);

-- Leads table
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  status text not null default 'new',
  ai_score integer,
  created_at timestamptz default now() not null
);

-- Tasks table
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  due_date timestamptz,
  status text not null default 'pending',
  related_lead_id uuid references leads(id) on delete cascade,
  related_customer_id uuid references customers(id) on delete cascade,
  assigned_to uuid,
  created_at timestamptz default now() not null
);

-- Activity Timeline table
create table if not exists activity_timeline (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  description text,
  created_at timestamptz default now() not null
);

-- User Profiles table
create table if not exists user_profiles (
  id uuid primary key,
  role text not null default 'user',
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Row Level Security (RLS)
alter table companies enable row level security;
alter table leads enable row level security;
alter table tasks enable row level security;
alter table activity_timeline enable row level security;
alter table user_profiles enable row level security;

-- Policies
create policy "Allow all for authenticated" on companies for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on leads for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on tasks for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on activity_timeline for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on user_profiles for all using (auth.role() = 'authenticated');
