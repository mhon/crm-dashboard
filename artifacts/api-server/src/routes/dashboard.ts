import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res) => {
  const [customersRes, ordersRes] = await Promise.all([
    supabase.from("customers").select("id, created_at"),
    supabase.from("orders").select("id, amount, status"),
  ]);

  if (customersRes.error) {
    req.log.error({ error: customersRes.error }, "Failed to fetch customers for summary");
    return res.status(500).json({ error: customersRes.error.message });
  }
  if (ordersRes.error) {
    req.log.error({ error: ordersRes.error }, "Failed to fetch orders for summary");
    return res.status(500).json({ error: ordersRes.error.message });
  }

  const customers = customersRes.data ?? [];
  const orders = ordersRes.data ?? [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const new_customers_this_month = customers.filter(
    (c) => c.created_at >= startOfMonth
  ).length;

  const total_revenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  return res.json({
    total_customers: customers.length,
    total_orders: orders.length,
    total_revenue,
    new_customers_this_month,
  });
});

router.get("/dashboard/recent-orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    req.log.error({ error }, "Failed to fetch recent orders");
    return res.status(500).json({ error: error.message });
  }

  const orders = (data ?? []).map((row: Record<string, unknown>) => {
    const customers = row["customers"] as { name?: string } | null;
    const { customers: _c, ...rest } = row;
    return { ...rest, customer_name: customers?.name ?? null };
  });

  return res.json(orders);
});

router.get("/dashboard/order-status-breakdown", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("status");

  if (error) {
    req.log.error({ error }, "Failed to fetch order status breakdown");
    return res.status(500).json({ error: error.message });
  }

  const breakdown = { pending: 0, paid: 0, shipped: 0 };
  for (const row of data ?? []) {
    const s = row.status as keyof typeof breakdown;
    if (s in breakdown) breakdown[s]++;
  }

  return res.json(breakdown);
});

export default router;
