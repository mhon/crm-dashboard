import { Router, type IRouter } from "express";
import { getClient } from "../lib/supabase";
import {
  CreateCompanyBody,
  UpdateCompanyBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/companies", async (req, res) => {
  const db = getClient(req);
  const { data, error } = await db.from("companies").select("*").order("created_at", { ascending: false });
  if (error) {
    req.log.error({ error }, "Failed to list companies");
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.post("/companies", async (req, res) => {
  const body = CreateCompanyBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("companies")
    .insert(body)
    .select()
    .single();
  if (error) {
    req.log.error({ error }, "Failed to create company");
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

router.get("/companies/:id", async (req, res) => {
  const { id } = req.params;
  const db = getClient(req);
  const { data, error } = await db
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    return res.status(404).json({ error: "Company not found" });
  }
  return res.json(data);
});

router.patch("/companies/:id", async (req, res) => {
  const { id } = req.params;
  const body = UpdateCompanyBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("companies")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) {
    req.log.error({ error }, "Failed to update company");
    return res.status(500).json({ error: error?.message ?? "Not found" });
  }
  return res.json(data);
});

router.delete("/companies/:id", async (req, res) => {
  const { id } = req.params;
  const db = getClient(req);
  const { error } = await db.from("companies").delete().eq("id", id);
  if (error) {
    req.log.error({ error }, "Failed to delete company");
    return res.status(500).json({ error: error.message });
  }
  return res.status(204).send();
});

export default router;
