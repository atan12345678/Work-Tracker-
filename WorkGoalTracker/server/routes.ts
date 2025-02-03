import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { tasks } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Get all tasks
  app.get("/api/tasks", async (_req, res) => {
    try {
      const allTasks = await db.select().from(tasks).orderBy(tasks.importance);
      res.json(allTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Create new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const [task] = await db.insert(tasks).values({
        title: req.body.title,
        subject: req.body.subject,
        dueDate: new Date(req.body.dueDate),
        importance: req.body.importance,
      }).returning();

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
      await db.delete(tasks).where(eq(tasks.id, taskId));
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Toggle task completion
  app.patch("/api/tasks/:id/toggle", async (req, res) => {
    const taskId = parseInt(req.params.id);

    try {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const [updated] = await db
        .update(tasks)
        .set({ completed: !task.completed })
        .where(eq(tasks.id, taskId))
        .returning();

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  return httpServer;
}