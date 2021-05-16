/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBoard
// ====================================================

export interface GetBoard_board_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetBoard_board_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetBoard_board_createdBy_avatar | null;
}

export interface GetBoard_board {
  __typename: "Board";
  id: string;
  title: string;
  description: string;
  createdBy: GetBoard_board_createdBy;
}

export interface GetBoard {
  board: GetBoard_board | null;
}

export interface GetBoardVariables {
  id: string;
}
