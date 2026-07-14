import { pgTable, text, uuid, timestamp, integer, jsonb, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { customersTable } from "./existing";

export const companiesTable = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: text("industry"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true });
export type InsertCompany = typeof companiesTable.$inferInsert;
export type Company = typeof companiesTable.$inferSelect;

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companiesTable.id, { onDelete: 'set null' }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default('new'), // new, contacted, qualified, lost
  aiScore: integer("ai_score"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true });
export type InsertLead = typeof leadsTable.$inferInsert;
export type Lead = typeof leadsTable.$inferSelect;

export const tasksTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  status: text("status").notNull().default('pending'), // pending, completed
  relatedLeadId: uuid("related_lead_id").references(() => leadsTable.id, { onDelete: 'cascade' }),
  relatedCustomerId: uuid("related_customer_id").references(() => customersTable.id, { onDelete: 'cascade' }),
  assignedTo: uuid("assigned_to"), // Would reference user_profiles.id
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true, createdAt: true });
export type InsertTask = typeof tasksTable.$inferInsert;
export type Task = typeof tasksTable.$inferSelect;

export const activityTimelineTable = pgTable("activity_timeline", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: text("entity_type").notNull(), // lead, customer, company
  entityId: uuid("entity_id").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const insertActivityTimelineSchema = createInsertSchema(activityTimelineTable).omit({ id: true, createdAt: true });
export type InsertActivityTimeline = typeof activityTimelineTable.$inferInsert;
export type ActivityTimeline = typeof activityTimelineTable.$inferSelect;

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  triggerEvent: varchar("trigger_event", { length: 100 }).notNull(), // e.g., "lead_created", "status_changed"
  triggerConditions: jsonb("trigger_conditions"), // JSON describing conditions to match
  actions: jsonb("actions").notNull(), // Array of actions to perform
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workflowRuns = pgTable("workflow_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowId: uuid("workflow_id").references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // "pending", "running", "completed", "failed"
  triggerData: jsonb("trigger_data"),
  logs: jsonb("logs"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const userProfilesTable = pgTable("user_profiles", {
  id: uuid("id").primaryKey(), // maps to auth.users id
  role: text("role").notNull().default('user'), // admin, user
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const insertUserProfileSchema = createInsertSchema(userProfilesTable).omit({ createdAt: true });
export type InsertUserProfile = typeof userProfilesTable.$inferInsert;
export type UserProfile = typeof userProfilesTable.$inferSelect;
