import { Router } from "express";
import { requireAuth } from "../middlewares/rbac";
import { getClient } from "../lib/supabase";

const router = Router();

router.use(requireAuth);

router.get("/summary", async (req, res) => {
  try {
    const db = getClient(req);

    // In a real application, you'd aggregate MRR from an orders or subscriptions table,
    // pipeline value from leads, etc. For this prototype, we'll calculate mock stats
    // or aggregate from leads/orders.
    
    // Calculate pipeline value (assuming leads have an associated deal size, or just count * 1000)
    const { count: leadsCount, error: leadsError } = await db
      .from("leads")
      .select("*", { count: 'exact', head: true })
      .neq("status", "lost");

    // Calculate closed deals for win rate
    const { count: wonLeads, error: wonError } = await db
      .from("leads")
      .select("*", { count: 'exact', head: true })
      .eq("status", "won");

    // Calculate MRR from orders (assuming all orders are recurring for this dashboard demo)
    const { data: orders, error: ordersError } = await db
      .from("orders")
      .select("amount")
      .eq("status", "paid");

    if (leadsError || wonError || ordersError) {
      req.log.error({ leadsError, wonError, ordersError }, "Error fetching analytics data");
      return res.status(500).json({ error: "Failed to load analytics" });
    }

    const totalMrr = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
    const pipelineValue = (leadsCount || 0) * 5000; // Mock: $5k per active lead
    const winRate = leadsCount && leadsCount > 0 ? ((wonLeads || 0) / leadsCount) * 100 : 0;

    return res.json({
      mrr: totalMrr,
      pipelineValue,
      winRate: Math.round(winRate * 100) / 100,
    });
  } catch (error: any) {
    req.log.error({ error }, "Error fetching analytics summary");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
