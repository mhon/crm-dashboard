import { Router, type IRouter } from "express";
import { getClient } from "../lib/supabase";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  UpdateOrderBody,
  GetOrderParams,
  UpdateOrderParams,
  DeleteOrderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (req, res) => {
  const query = ListOrdersQueryParams.parse(req.query);
  const db = getClient(req);
  let qb = db
    .from("orders")
    .select("*, customers(name)")
    .order("created_at", { ascending: false });
  if (query.status) {
    qb = qb.eq("status", query.status);
  }
  if (query.customer_id) {
    qb = qb.eq("customer_id", query.customer_id);
  }
  const { data, error } = await qb;
  if (error) {
    req.log.error({ error }, "Failed to list orders");
    return res.status(500).json({ error: error.message });
  }
  const orders = (data ?? []).map((row: Record<string, unknown>) => {
    const customers = row["customers"] as { name?: string } | null;
    const { customers: _c, ...rest } = row;
    return { ...rest, customer_name: customers?.name ?? null };
  });
  return res.json(orders);
});

router.post("/orders", async (req, res) => {
  const body = CreateOrderBody.parse(req.body);
  const insert = { ...body, status: body.status ?? "pending" };
  const db = getClient(req);
  const { data, error } = await db
    .from("orders")
    .insert(insert)
    .select()
    .single();
  if (error) {
    req.log.error({ error }, "Failed to create order");
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json({ ...data, customer_name: null });
});

router.get("/orders/:id", async (req, res) => {
  const { id } = GetOrderParams.parse(req.params);
  const db = getClient(req);
  const { data, error } = await db
    .from("orders")
    .select("*, customers(name)")
    .eq("id", id)
    .single();
  if (error || !data) {
    return res.status(404).json({ error: "Order not found" });
  }
  const customers = (data as Record<string, unknown>)["customers"] as { name?: string } | null;
  const { customers: _c, ...rest } = data as Record<string, unknown>;
  return res.json({ ...rest, customer_name: customers?.name ?? null });
});

router.patch("/orders/:id", async (req, res) => {
  const { id } = UpdateOrderParams.parse(req.params);
  const body = UpdateOrderBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("orders")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) {
    req.log.error({ error }, "Failed to update order");
    return res.status(500).json({ error: error?.message ?? "Not found" });
  }
  return res.json({ ...data, customer_name: null });
});

router.delete("/orders/:id", async (req, res) => {
  const { id } = DeleteOrderParams.parse(req.params);
  const db = getClient(req);
  const { error } = await db.from("orders").delete().eq("id", id);
  if (error) {
    req.log.error({ error }, "Failed to delete order");
    return res.status(500).json({ error: error.message });
  }
  return res.status(204).send();
});

export default router;
