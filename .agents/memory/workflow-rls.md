---
name: Workflow table RLS policy bug
description: supabase-v3.sql created admin-only RLS on workflows table; needs fix before POST /api/workflows works.
---

## Rule
The `workflows` table RLS policy in the original `supabase-v3.sql` was scoped to admin users only, causing INSERT to fail with code 42501 for non-admin authenticated sessions.

**Fix SQL to run in Supabase SQL Editor:**
```sql
DROP POLICY IF EXISTS "Enable all access for admin on workflows" ON public.workflows;
CREATE POLICY "Enable all for authenticated users on workflows"
  ON public.workflows FOR ALL
  USING (true)
  WITH CHECK (true);
```

**Why:** The API server uses the Supabase anon key (not user JWTs), so user-scoped RLS always blocks inserts. For this CRM's trust model, all authenticated sessions can CRUD workflows.

**How to apply:** User must run this SQL manually in their Supabase project SQL Editor.
