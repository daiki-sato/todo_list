import {
  type Task as TaskPb,
  Task_Status,
} from "../../__generated__/proto/task/v1/task_pb";
import type { Task, TaskStatus } from "../types.generated";

export function taskPbToGql(pb: TaskPb): Task {
  return {
    id: pb.id,
    title: pb.title,
    status: taskStatusMap[pb.status],
  };
}

const taskStatusMap: Record<Task_Status, TaskStatus> = {
  [Task_Status.UNSPECIFIED]: "NOT_STARTED",
  [Task_Status.NOT_STARTED]: "NOT_STARTED",
  [Task_Status.DONE]: "DONE",
};
