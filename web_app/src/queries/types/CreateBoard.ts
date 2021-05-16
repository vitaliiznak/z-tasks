/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoardCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateBoard
// ====================================================

export interface CreateBoard_board {
  __typename: "Board";
  id: string;
}

export interface CreateBoard {
  board: CreateBoard_board;
}

export interface CreateBoardVariables {
  input: BoardCreateInput;
}
