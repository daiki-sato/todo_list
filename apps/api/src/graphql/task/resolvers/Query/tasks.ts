import { listTasks } from "../../../../service";
import { taskPbToGql } from "../../converter";
import type { QueryResolvers } from "./../../../types.generated";

export const tasks: NonNullable<QueryResolvers['tasks']> = async (
  _parent,
  _arg,
  _ctx,
) => {
  const tasks = await listTasks();
  return tasks.map((t) => taskPbToGql(t));
};
