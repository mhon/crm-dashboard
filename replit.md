# CRM Dashboard

A full-stack CRM web app for managing customers, orders, and notes — backed by Supabase Auth and database.

## Run & Operate

- `pnpm --filter @workspace/crm run dev` — run the CRM frontend (port 22444, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, preview at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + wouter
- Backend: Express 5 (API server)
- Auth & DB: Supabase (auth + PostgreSQL)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/crm/` — React + Vite frontend
- `artifacts/crm/src/lib/supabase.ts` — Supabase client (uses VITE_ env vars)
- `artifacts/crm/src/contexts/AuthContext.tsx` — Auth session management
- `artifacts/crm/src/pages/` — All pages (login, dashboard, customers, orders, customer-detail)
- `artifacts/crm/src/components/layout/AppLayout.tsx` — Sidebar + layout shell
- `artifacts/api-server/src/routes/` — Express route handlers (customers, orders, notes, dashboard)
- `artifacts/api-server/src/lib/supabase.ts` — Server-side Supabase client
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `supabase-setup.sql` — SQL to run in Supabase to create tables + RLS policies

## Architecture decisions

- Supabase is used for both auth (frontend, direct) and the database (via API server).
- The frontend auth uses `@supabase/supabase-js` directly; it does NOT go through the Express API server.
- The Express API server uses the Supabase anon key server-side for all data queries.
- Vite `define` config injects `SUPABASE_URL` and `SUPABASE_ANON_KEY` secrets as `import.meta.env.VITE_SUPABASE_*` at build time — no separate VITE_ secrets needed.
- OpenAPI spec is the single contract; codegen produces both Zod validation (server) and React Query hooks (frontend).

## Product

- Dashboard: summary cards (total customers, orders, revenue, new this month) + recent orders + status breakdown
- Customers page: searchable list with create/edit/delete
- Customer detail page: customer info + their orders + notes (add/delete)
- Orders page: filterable by status, create/edit/delete + status updates
- Login page: Supabase email/password auth with protected routes

## Supabase Setup (required)

Run `supabase-setup.sql` in your Supabase SQL Editor to create:
- `customers` table (id, name, email, phone, created_at)
- `orders` table (id, customer_id, product_name, amount, status, created_at)
- `notes` table (id, customer_id, text, created_at)
- Row Level Security policies (authenticated users only)
- 3 sample customers

After running the SQL, also create a user in Supabase → Authentication → Users (or enable email signup in Auth settings).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The Vite `define` block in `vite.config.ts` injects Supabase credentials at build time — if you rotate keys, restart the CRM workflow.
- Supabase RLS must be configured — tables have `enable row level security`, so without the policies the app will get 0 rows back silently.
- The API server does NOT validate user JWTs — it uses the anon key for all Supabase queries. For production hardening, pass the user's Bearer token from the frontend and verify it server-side.

## Pointers

- See `supabase-setup.sql` for database schema and RLS setup
- See the `pnpm-workspace` skill for workspace structure details
