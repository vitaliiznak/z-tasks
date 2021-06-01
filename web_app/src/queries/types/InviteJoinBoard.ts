/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InviteJoinBoardInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: InviteJoinBoard
// ====================================================

export interface InviteJoinBoard_inviteJoinBoard_board {
  __typename: "Board";
  id: string;
  title: string;
}

export interface InviteJoinBoard_inviteJoinBoard_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface InviteJoinBoard_inviteJoinBoard_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: InviteJoinBoard_inviteJoinBoard_createdBy_avatar | null;
}

export interface InviteJoinBoard_inviteJoinBoard {
  __typename: "Invite";
  id: string;
  board: InviteJoinBoard_inviteJoinBoard_board;
  token: string;
  state: string;
  expirationTime: any;
  description: string;
  createdBy: InviteJoinBoard_inviteJoinBoard_createdBy;
  createdAt: any;
}

export interface InviteJoinBoard {
  inviteJoinBoard: InviteJoinBoard_inviteJoinBoard | null;
}

export interface InviteJoinBoardVariables {
  input: InviteJoinBoardInput;
}
