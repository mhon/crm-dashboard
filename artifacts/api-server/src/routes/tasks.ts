import { Router, type IRouter } from "express";
import { getClient } from "../lib/supabase";
import {
  CreateTaskBody,
  UpdateTaskBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tasks", async (req, res) => {
  const db = getClient(req);
  const { data, error } = await db.from("tasks").select("*").order("created_at", { ascending: false });
  if (error) {
    req.log.error({ error }, "Failed to list tasks");
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.post("/tasks", async (req, res) => {
  const body = CreateTaskBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("tasks")
    .insert(body)
    .select()
    .single();
  if (error) {
    req.log.error({ error }, "Failed to create task");
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

router.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const db = getClient(req);
  const { data, error } = await db
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    return res.status(404).json({ error: "Task not found" });
  }
  return res.json(data);
});

router.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const body = UpdateTaskBody.parse(req.body);
  const db = getClient(req);
  const { data, error } = await db
    .from("tasks")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) {
    req.log.error({ error }, "Failed to update task");
    return res.status(500).json({ error: error?.message ?? "Not found" });
  }
  return res.json(data);
});

export default router;
