import { Router, type IRouter } from "express";
import { getClient } from "../lib/supabase";
import {
  CreateLeadBody,
  UpdateLeadBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leads", async (req, res) => {
  const db = getClient(req);
  const { data, error } = await db.from("leads").select("*").order("created_at", { ascending: false });
  if (error) {
    req.log.error({ error }, "Failed to list leads");
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.post("/leads", async (req, res) => {
  const body = CreateLeadBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("leads")
    .insert(body)
    .select()
    .single();
  if (error) {
    req.log.error({ error }, "Failed to create lead");
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

router.get("/leads/:id", async (req, res) => {
  const { id } = req.params;
  const db = getClient(req);
  const { data, error } = await db
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    return res.status(404).json({ error: "Lead not found" });
  }
  return res.json(data);
});

router.patch("/leads/:id", async (req, res) => {
  const { id } = req.params;
  const body = UpdateLeadBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("leads")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) {
    req.log.error({ error }, "Failed to update lead");
    return res.status(500).json({ error: error?.message ?? "Not found" });
  }
  return res.json(data);
});

export default router;
