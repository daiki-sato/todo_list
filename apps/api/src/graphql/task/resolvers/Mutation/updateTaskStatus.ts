import { Task_Status } from "../../../../__generated__/proto/task/v1/task_pb";
import * as services from "../../../../service";
import { taskPbToGql } from "../../converter";
import type { MutationResolvers } from "./../../../types.generated";

export const updateTaskStatus: NonNullable<MutationResolvers['updateTaskStatus']> = async (_parent, { input }, _ctx) => {
  const task = await services.updateTaskStatus({
    id: input.id,
    status: Task_Status[input.status],
  });
  return { task: taskPbToGql(task) };
};
