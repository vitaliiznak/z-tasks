/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskPriorityEnum, TaskStateEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTask
// ====================================================

export interface GetTask_taskGetById_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetTask_taskGetById_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetTask_taskGetById_createdBy_avatar | null;
}

export interface GetTask_taskGetById_assigners {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
}

export interface GetTask_taskGetById_attachments {
  __typename: "FileAttachment";
  uri: string;
  filename: string;
  mimetype: string;
  encoding: string;
  ext: string;
}

export interface GetTask_taskGetById {
  __typename: "Task";
  id: string;
  title: string;
  description: string;
  priority: TaskPriorityEnum;
  state: TaskStateEnum;
  isArchived: boolean;
  createdBy: GetTask_taskGetById_createdBy;
  createdAt: any;
  assigners: (GetTask_taskGetById_assigners | null)[];
  attachments: (GetTask_taskGetById_attachments | null)[];
}

export interface GetTask {
  taskGetById: GetTask_taskGetById | null;
}

export interface GetTaskVariables {
  id: string;
}
