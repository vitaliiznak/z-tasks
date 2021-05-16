/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskUpdateInput, TaskPriorityEnum, TaskStateEnum } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTask
// ====================================================

export interface UpdateTask_taskUpdate_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface UpdateTask_taskUpdate_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: UpdateTask_taskUpdate_createdBy_avatar | null;
}

export interface UpdateTask_taskUpdate_assigners {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
}

export interface UpdateTask_taskUpdate_attachments {
  __typename: "FileAttachment";
  uri: string;
  filename: string;
  mimetype: string;
  encoding: string;
  ext: string;
}

export interface UpdateTask_taskUpdate {
  __typename: "Task";
  id: string;
  title: string;
  description: string;
  priority: TaskPriorityEnum;
  state: TaskStateEnum;
  isArchived: boolean;
  createdBy: UpdateTask_taskUpdate_createdBy;
  assigners: (UpdateTask_taskUpdate_assigners | null)[];
  attachments: (UpdateTask_taskUpdate_attachments | null)[];
}

export interface UpdateTask {
  taskUpdate: UpdateTask_taskUpdate;
}

export interface UpdateTaskVariables {
  id: string;
  input: TaskUpdateInput;
}
