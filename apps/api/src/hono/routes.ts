import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { Task_Status } from "../__generated__/proto/task/v1/task_pb";
import { createTask, listTasks, updateTaskStatus } from "../service";

const app = new Hono();

export const CreateTaskRequestSchema = z.object({
  title: z.string(),
});

export const UpdateTaskStatusParamSchema = z.object({
  id: z.string(),
});

const taskStatuses = ["NOT_STARTED", "DONE"] as const;

export const UpdateTaskStatusSchema = z.object({
  status: z.enum(taskStatuses),
});

export const tasksRoutes = app
  .get("/", async (c) => {
    const tasks = await listTasks();
    return c.json({
      tasks: tasks.map((t) => ({ id: t.id, title: t.title, status: t.status })),
    });
  })
  .post("/", zValidator("json", CreateTaskRequestSchema), async (c) => {
    const { title } = c.req.valid("json");
    const newTask = await createTask({ title });

    return c.json({
      task: { id: newTask.id, title: newTask.title, status: newTask.status },
    });
  })
  .patch(
    "/:id/status",
    zValidator("param", UpdateTaskStatusParamSchema),
    zValidator("json", UpdateTaskStatusSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { status } = c.req.valid("json");
      const task = await updateTaskStatus({ id, status: Task_Status[status] });

      return c.json({
        task: { id: task.id, title: task.title, status: task.status },
      });
    },
  );
