/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoardListFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetBoards
// ====================================================

export interface GetBoards_boards_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetBoards_boards_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetBoards_boards_createdBy_avatar | null;
}

export interface GetBoards_boards {
  __typename: "Board";
  id: string;
  title: string;
  description: string;
  createdBy: GetBoards_boards_createdBy;
}

export interface GetBoards {
  boards: (GetBoards_boards | null)[];
}

export interface GetBoardsVariables {
  filter?: BoardListFilterInput | null;
}
