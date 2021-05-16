/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTask
// ====================================================

export interface CreateTask_taskCreate {
  __typename: "Task";
  id: string;
}

export interface CreateTask {
  taskCreate: CreateTask_taskCreate;
}

export interface CreateTaskVariables {
  input: TaskCreateInput;
}
