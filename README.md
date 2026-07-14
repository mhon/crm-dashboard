# CRM Dashboard + Landing Page (SaaS-ready)

A full-stack Customer Relationship Management (CRM) web app built with **React + Vite**, **Express**, and **Supabase**, designed as a **SaaS-ready product for small businesses, resellers, and online sellers**.

Includes a **marketing landing page, demo flow, and conversion-focused UI**.

![CRM Dashboard](https://img.shields.io/badge/Stack-React%20%2B%20Vite%20%2B%20Supabase-blue)
![SaaS Ready](https://img.shields.io/badge/Product-SaaS%20Ready-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌐 Live Demo Flow

- 🏠 Landing Page → explains product value
- ▶️ Watch Demo → short video (30–40 sec) showing CRM usage
- 🔐 Login / Register → Supabase authentication
- 📊 Dashboard → CRM system (customers, orders, revenue)

## 🚀 Features

### 🧲 Landing Page (Marketing Layer)
- Hero Section:
  - "Track Customers, Orders, and Profits in One Dashboard"
  - CTA buttons: **Start Free / View Demo**
- Modern responsive UI (mobile-first)
- Sections:
  - Features overview
  - Pricing plans
  - About / Company mission
  - Footer (contact + links)
- Demo video integration (Canva / MP4 / YouTube embed)

### 🔐 Authentication
- Email/password login and registration via **Supabase Auth**
- Protected dashboard routes — unauthenticated users are redirected to login
- Session persistence across page refreshes

### 📊 CRM Dashboard
- Summary cards: total customers, total orders, total revenue, new customers this month
- Recent orders table
- Order status breakdown (pending / paid / shipped)

### 👥 Customers
- List all customers with **live search** (by name or email)
- Create, edit, and delete customers
- Customer detail page with their orders and notes

### 📦 Orders Module
- List all orders with **filter by status** (pending / paid / shipped)
- Create, edit, delete orders
- Update order status inline
- Orders linked to customers

### 📝 Notes
- Add and delete notes per customer
- Displayed on the customer detail page

- ## 💰 SaaS Monetization Model (Planned)

- Free tier (limited customers/orders)
- Pro plan
- Premium features:
  - analytics dashboard
  - export reports
  - unlimited records

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Routing | wouter |
| State / Data | TanStack Query (React Query) |
| Forms | react-hook-form + Zod |
| Backend | Express 5 (Node.js) |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| API Contract | OpenAPI 3.1 → Orval codegen |
| Package Manager | pnpm workspaces |

---

## 📁 Project Structure

```
├── artifacts/
│   ├── crm/                    # React + Vite frontend
│   │   └── src/
│   │       ├── pages/          # login, dashboard, customers, orders, customer-detail
│   │       ├── components/     # layout (sidebar), shadcn/ui components
│   │       ├── contexts/       # AuthContext (Supabase session)
│   │       └── lib/            # Supabase client
│   └── api-server/             # Express API server
│       └── src/
│           ├── routes/         # customers, orders, notes, dashboard, health
│           └── lib/            # Supabase server client, logger
├── lib/
│   ├── api-spec/               # OpenAPI spec (source of truth)
│   ├── api-client-react/       # Generated React Query hooks (Orval)
│   └── api-zod/                # Generated Zod schemas (Orval)
└── supabase-setup.sql          # SQL to bootstrap Supabase tables + RLS
```

---

## 🗄 Database Schema

Run `supabase-setup.sql` in your Supabase SQL Editor to create:

```sql
customers (id, name, email, phone, created_at)
orders    (id, customer_id, product_name, amount, status, created_at)
notes     (id, customer_id, text, created_at)
```

Row Level Security (RLS) is enabled — only authenticated users can read/write data.

---

## Getting Started

### 1. Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- A [Supabase](https://supabase.com) project

### 2. Clone the repo

```bash
git clone https://github.com/mhon/crm-dashboard.git
cd crm-dashboard
pnpm install
```

### 3. Set environment variables

Create a `.env` file or set these as environment secrets:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up Supabase tables

Run `supabase-setup.sql` in your **Supabase Dashboard → SQL Editor**.

Also go to **Authentication → Providers → Email** and ensure email sign-in is enabled.

### 5. Run the app

```bash
# Start the API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Start the frontend (port 22444)
pnpm --filter @workspace/crm run dev
```

Open [http://localhost:22444](http://localhost:22444) in your browser.

---

## 📦 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/healthz` | Health check |
| GET | `/api/customers` | List customers (supports `?search=`) |
| POST | `/api/customers` | Create customer |
| PATCH | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| GET | `/api/orders` | List orders (supports `?status=`, `?customer_id=`) |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/notes` | List notes (supports `?customer_id=`) |
| POST | `/api/notes` | Create note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/dashboard/summary` | Summary stats |
| GET | `/api/dashboard/recent-orders` | Recent orders |
| GET | `/api/dashboard/order-status-breakdown` | Status counts |

---

## Scripts

```bash
pnpm run typecheck                          # Full TypeScript check
pnpm --filter @workspace/api-spec run codegen  # Regenerate API hooks from OpenAPI spec
```

---

## 🌍 Deployment

This project is ready to deploy on [Replit](https://replit.com). Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` as deployment secrets and click **Deploy**.

For other platforms (Railway, Render, Vercel + separate API), set the same two environment variables and run `pnpm install && pnpm run build`.

---

## 📄 License

MIT
# Auto-deploy test
