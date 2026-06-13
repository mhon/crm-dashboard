import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import {
  ListNotesQueryParams,
  CreateNoteBody,
  DeleteNoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/notes", async (req, res) => {
  const query = ListNotesQueryParams.parse(req.query);
  let qb = supabase.from("notes").select("*").order("created_at", { ascending: false });
  if (query.customer_id) {
    qb = qb.eq("customer_id", query.customer_id);
  }
  const { data, error } = await qb;
  if (error) {
    req.log.error({ error }, "Failed to list notes");
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.post("/notes", async (req, res) => {
  const body = CreateNoteBody.parse(req.body);
  const { data, error } = await supabase
    .from("notes")
    .insert(body)
    .select()
    .single();
  if (error) {
    req.log.error({ error }, "Failed to create note");
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

router.delete("/notes/:id", async (req, res) => {
  const { id } = DeleteNoteParams.parse(req.params);
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) {
    req.log.error({ error }, "Failed to delete note");
    return res.status(500).json({ error: error.message });
  }
  return res.status(204).send();
});

export default router;
