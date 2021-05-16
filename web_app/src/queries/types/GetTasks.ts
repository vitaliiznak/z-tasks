/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskListFilterInput, TaskPriorityEnum, TaskStateEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTasks
// ====================================================

export interface GetTasks_tasks_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetTasks_tasks_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetTasks_tasks_createdBy_avatar | null;
}

export interface GetTasks_tasks_assigners {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
}

export interface GetTasks_tasks_attachments {
  __typename: "FileAttachment";
  uri: string;
  filename: string;
  mimetype: string;
  encoding: string;
  ext: string;
}

export interface GetTasks_tasks {
  __typename: "Task";
  id: string;
  title: string;
  description: string;
  priority: TaskPriorityEnum;
  state: TaskStateEnum;
  isArchived: boolean;
  createdBy: GetTasks_tasks_createdBy;
  assigners: (GetTasks_tasks_assigners | null)[];
  attachments: (GetTasks_tasks_attachments | null)[];
}

export interface GetTasks {
  tasks: (GetTasks_tasks | null)[];
}

export interface GetTasksVariables {
  filter?: TaskListFilterInput | null;
}
