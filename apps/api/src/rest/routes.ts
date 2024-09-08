import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  CreateTaskRequestSchema,
  UpdateTaskStatusParamSchema,
  UpdateTaskStatusSchema,
} from "../hono/routes";
import { createTask, listTasks, updateTaskStatus } from "../service";
import { Task_Status } from "../__generated__/proto/task/v1/task_pb";

const app = new OpenAPIHono();

const TaskSchema = z
  .object({
    id: z.string(),
    title: z.string(),
  })
  .openapi("Task");

const ListTasksResponseSchema = z.object({
  tasks: z.array(TaskSchema),
});

const CreateTaskResponseSchema = z.object({
  task: TaskSchema,
});

const listTasksRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    "200": {
      content: {
        "application/json": { schema: ListTasksResponseSchema },
      },
      description: "List tasks",
    },
  },
});

const createTaskRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateTaskRequestSchema },
      },
    },
  },
  responses: {
    "200": {
      content: {
        "application/json": { schema: CreateTaskResponseSchema },
      },
      description: "Create task",
    },
  },
});

const updateStatusRoute = createRoute({
  method: "put",
  path: "/{id}/status",
  request: {
    params: UpdateTaskStatusParamSchema,
    body: {
      content: {
        "application/json": { schema: UpdateTaskStatusSchema },
      },
    },
  },
  responses: {
    "200": {
      content: {
        "application/json": { schema: CreateTaskResponseSchema },
      },
      description: "Update task status",
    },
  },
});

export const tasksRoutes = app
  .openapi(listTasksRoute, async (c) => {
    const tasks = await listTasks();
    return c.json({
      tasks: tasks.map((t) => ({ id: t.id, title: t.title, status: t.status })),
    });
  })
  .openapi(createTaskRoute, async (c) => {
    const { title } = c.req.valid("json");
    const newTask = await createTask({ title });

    return c.json({
      task: { id: newTask.id, title: newTask.title, status: newTask.status },
    });
  })
  .openapi(updateStatusRoute, async (c) => {
    const { id } = c.req.valid("param");
    const { status } = c.req.valid("json");
    const task = await updateTaskStatus({ id, status: Task_Status[status] });

    return c.json({
      task: { id: task.id, title: task.title, status: task.status },
    });
  });
