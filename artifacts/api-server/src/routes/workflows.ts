import { Router } from "express";
import { requireAuth } from "../middlewares/rbac";
import { getClient } from "../lib/supabase";

const router = Router();

router.use(requireAuth);

/** Transform Supabase snake_case → camelCase to match the OpenAPI Workflow schema */
function toWorkflow(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    triggerEvent: row.trigger_event,
    triggerConditions: row.trigger_conditions,
    actions: row.actions,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get("/", async (req, res) => {
  try {
    const db = getClient(req);
    const { data, error } = await db
      .from("workflows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      req.log.error({ error }, "Error fetching workflows");
      return res.status(500).json({ error: "Failed to fetch workflows" });
    }

    return res.json((data ?? []).map(toWorkflow));
  } catch (error: any) {
    req.log.error({ error }, "Error fetching workflows");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const db = getClient(req);
    const { name, description, triggerEvent, triggerConditions, actions, isActive } = req.body;

    if (!name || !triggerEvent || !actions) {
      return res.status(400).json({ error: "Missing required workflow fields" });
    }

    const { data, error } = await db
      .from("workflows")
      .insert([{
        name,
        description,
        trigger_event: triggerEvent,
        trigger_conditions: triggerConditions,
        actions,
        is_active: isActive !== undefined ? isActive : true,
      }])
      .select()
      .single();

    if (error) {
      req.log.error({ error }, "Error creating workflow");
      return res.status(500).json({ error: "Failed to create workflow" });
    }

    return res.status(201).json(data ? toWorkflow(data as Record<string, unknown>) : null);
  } catch (error: any) {
    req.log.error({ error }, "Error creating workflow");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
