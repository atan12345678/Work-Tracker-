import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  details: z.string().min(1, "Details are required"),
  subject: z.string().min(1, "Subject is required"), 
  dueDate: z.string().min(1, "Due date is required"),
  importance: z.number().min(1).max(5, "Importance must be between 1-5")
});

export type TaskFormData = z.infer<typeof taskSchema>;