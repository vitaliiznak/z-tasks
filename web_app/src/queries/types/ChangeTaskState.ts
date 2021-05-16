/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeTaskState
// ====================================================

export interface ChangeTaskState_taskChangeState {
  __typename: "Task";
  id: string;
}

export interface ChangeTaskState {
  taskChangeState: ChangeTaskState_taskChangeState;
}

export interface ChangeTaskStateVariables {
  id: string;
  state: string;
}
