import * as service from "../../../../service";
import { taskPbToGql } from "../../converter";
import type { MutationResolvers } from "./../../../types.generated";

export const createTask: NonNullable<MutationResolvers['createTask']> = async (
  _parent,
  arg,
  _ctx,
) => {
  const task = await service.createTask(arg.input);
  return { task: taskPbToGql(task) };
};
