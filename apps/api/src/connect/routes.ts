import type { ConnectRouter } from "@connectrpc/connect";
import { TaskService } from "../__generated__/proto/task/v1/task_connect";
import {
  CreateTaskResponse,
  ListTasksResponse,
  UpdateTaskStatusResponse,
} from "../__generated__/proto/task/v1/task_pb";
import { createTask, listTasks, updateTaskStatus } from "../service";

export const routes = (router: ConnectRouter): void => {
  router.service(TaskService, {
    async listTasks(req, ctx) {
      return new ListTasksResponse({
        tasks: await listTasks(),
      });
    },
    async createTask(req, ctx) {
      return new CreateTaskResponse({
        task: await createTask(req),
      });
    },
    async updateTaskStatus(req, ctx) {
      return new UpdateTaskStatusResponse({
        task: await updateTaskStatus(req),
      });
    },
  });
};
