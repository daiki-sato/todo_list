import type { PlainMessage } from "@bufbuild/protobuf";
import { ulid } from "ulid";
import {
  type CreateTaskRequest,
  Database,
  Task,
  Task_Status,
  type UpdateTaskStatusRequest,
} from "./__generated__/proto/task/v1/task_pb";
import * as db from "./db";

export class NotFoundError extends Error {}

export function listTasks(): Promise<Task[]> {
  return db.listTasks();
}

export async function createTask(
  req: PlainMessage<CreateTaskRequest>,
): Promise<Task> {
  const newTask = new Task({
    id: ulid(),
    title: req.title,
    status: Task_Status.NOT_STARTED,
  });

  await db.updateTasks((db) => {
    return new Database({
      ...db,
      tasks: [...db.tasks, newTask],
    });
  });

  return newTask;
}

export async function updateTaskStatus(
  req: PlainMessage<UpdateTaskStatusRequest>,
): Promise<Task> {
  let task: Task | undefined;

  await db.updateTasks((db) => {
    return new Database({
      ...db,
      tasks: db.tasks.map((t) => {
        if (t.id === req.id) {
          task = new Task({ ...t, status: req.status });
          return task;
        }
        return t;
      }),
    });
  });

  if (task == null) {
    throw new NotFoundError(`Task with ID ${req.id} not found`);
  }

  return task;
}
