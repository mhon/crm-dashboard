import { Router } from "express";
import { getClient } from "../lib/supabase";

const router = Router();

/**
 * GET /api/search?q=<query>&limit=<number>
 * 
 * Unified search across all CRM modules. Returns results grouped by category.
 * Each result includes: id, title, description, category, url (client-side route).
 */
router.get("/search", async (req, res) => {
  const q = ((req.query.q as string) ?? "").trim();
  const limit = Math.min(Number(req.query.limit) || 8, 25);

  if (!q) {
    return res.json({ results: [] });
  }

  const db = getClient(req);
  const pattern = `%${q}%`;

  try {
    // Run all searches in parallel for speed
    const [
      customersRes,
      ordersRes,
      leadsRes,
      tasksRes,
      companiesRes,
      workflowsRes,
    ] = await Promise.all([
      // Customers: search name and email
      db
        .from("customers")
        .select("id, name, email, phone")
        .or(`name.ilike.${pattern},email.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(limit),

      // Orders: search product_name
      db
        .from("orders")
        .select("id, product_name, amount, status, customer_id")
        .ilike("product_name", pattern)
        .order("created_at", { ascending: false })
        .limit(limit),

      // Leads: search name and email
      db
        .from("leads")
        .select("id, name, email, status, ai_score")
        .or(`name.ilike.${pattern},email.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(limit),

      // Tasks: search title and description
      db
        .from("tasks")
        .select("id, title, description, status, due_date")
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(limit),

      // Companies: search name, domain, industry
      db
        .from("companies")
        .select("id, name, domain, industry")
        .or(`name.ilike.${pattern},domain.ilike.${pattern},industry.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(limit),

      // Workflows: search name and description
      db
        .from("workflows")
        .select("id, name, description, is_active")
        .or(`name.ilike.${pattern},description.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    // Merge all results with category labels
    const results: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      url: string;
      meta?: Record<string, unknown>;
    }> = [];

    // Customers
    for (const c of customersRes.data ?? []) {
      results.push({
        id: c.id,
        title: c.name,
        description: c.email + (c.phone ? ` · ${c.phone}` : ""),
        category: "Customers",
        url: `/customers/${c.id}`,
      });
    }

    // Orders
    for (const o of ordersRes.data ?? []) {
      results.push({
        id: o.id,
        title: o.product_name,
        description: `$${Number(o.amount).toLocaleString()} · ${o.status}`,
        category: "Orders",
        url: `/orders`,
        meta: { status: o.status },
      });
    }

    // Leads
    for (const l of leadsRes.data ?? []) {
      results.push({
        id: l.id,
        title: l.name,
        description: `${l.email} · ${l.status}${l.ai_score != null ? ` · Score: ${l.ai_score}` : ""}`,
        category: "Leads",
        url: `/leads`,
        meta: { status: l.status, aiScore: l.ai_score },
      });
    }

    // Tasks
    for (const t of tasksRes.data ?? []) {
      results.push({
        id: t.id,
        title: t.title,
        description: (t.description ?? "No description") + ` · ${t.status}`,
        category: "Tasks",
        url: `/tasks`,
        meta: { status: t.status },
      });
    }

    // Companies
    for (const co of companiesRes.data ?? []) {
      results.push({
        id: co.id,
        title: co.name,
        description: [co.industry, co.domain].filter(Boolean).join(" · ") || "Company",
        category: "Companies",
        url: `/companies`,
      });
    }

    // Workflows
    for (const w of workflowsRes.data ?? []) {
      results.push({
        id: w.id,
        title: w.name,
        description: (w.description ?? "Workflow") + ` · ${w.is_active ? "Active" : "Inactive"}`,
        category: "Workflows",
        url: `/workflows`,
        meta: { isActive: w.is_active },
      });
    }

    return res.json({ results });
  } catch (error: any) {
    req.log.error({ error }, "Search failed");
    return res.status(500).json({ error: "Search failed" });
  }
});

export default router;
