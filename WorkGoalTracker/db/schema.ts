import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  details: text("details").default("").notNull(),
  subject: text("subject").notNull(),
  dueDate: timestamp("due_date").notNull(),
  importance: integer("importance").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create a base schema first
const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  details: z.string().min(1, "Details are required"),
  subject: z.string().min(1, "Subject is required"),
  importance: z.number().min(1).max(5),
});

export const insertTaskSchema = createInsertSchema(tasks).merge(baseSchema);
export const selectTaskSchema = createSelectSchema(tasks);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;