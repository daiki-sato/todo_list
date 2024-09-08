/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { CreateTaskPayload } from './task/resolvers/CreateTaskPayload';
import    { createTask as Mutation_createTask } from './task/resolvers/Mutation/createTask';
import    { updateTaskStatus as Mutation_updateTaskStatus } from './task/resolvers/Mutation/updateTaskStatus';
import    { tasks as Query_tasks } from './task/resolvers/Query/tasks';
import    { Task } from './task/resolvers/Task';
import    { UpdateTaskStatusPayload } from './task/resolvers/UpdateTaskStatusPayload';
    export const resolvers: Resolvers = {
      Query: { tasks: Query_tasks },
      Mutation: { createTask: Mutation_createTask,updateTaskStatus: Mutation_updateTaskStatus },
      
      CreateTaskPayload: CreateTaskPayload,
Task: Task,
UpdateTaskStatusPayload: UpdateTaskStatusPayload
    }