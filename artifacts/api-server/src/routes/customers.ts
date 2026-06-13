import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import {
  ListCustomersQueryParams,
  CreateCustomerBody,
  UpdateCustomerBody,
  GetCustomerParams,
  UpdateCustomerParams,
  DeleteCustomerParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/customers", async (req, res) => {
  const query = ListCustomersQueryParams.parse(req.query);
  let qb = supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (query.search) {
    qb = qb.or(`name.ilike.%${query.search}%,email.ilike.%${query.search}%`);
  }
  const { data, error } = await qb;
  if (error) {
    req.log.error({ error }, "Failed to list customers");
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.post("/customers", async (req, res) => {
  const body = CreateCustomerBody.parse(req.body);
  const { data, error } = await supabase
    .from("customers")
    .insert(body)
    .select()
    .single();
  if (error) {
    req.log.error({ error }, "Failed to create customer");
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

router.get("/customers/:id", async (req, res) => {
  const { id } = GetCustomerParams.parse(req.params);
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    return res.status(404).json({ error: "Customer not found" });
  }
  return res.json(data);
});

router.patch("/customers/:id", async (req, res) => {
  const { id } = UpdateCustomerParams.parse(req.params);
  const body = UpdateCustomerBody.parse(req.body);
  const { data, error } = await supabase
    .from("customers")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) {
    req.log.error({ error }, "Failed to update customer");
    return res.status(500).json({ error: error?.message ?? "Not found" });
  }
  return res.json(data);
});

router.delete("/customers/:id", async (req, res) => {
  const { id } = DeleteCustomerParams.parse(req.params);
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) {
    req.log.error({ error }, "Failed to delete customer");
    return res.status(500).json({ error: error.message });
  }
  return res.status(204).send();
});

export default router;
