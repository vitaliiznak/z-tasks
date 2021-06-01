/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InviteCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInvite
// ====================================================

export interface CreateInvite_inviteCreate_board {
  __typename: "Board";
  id: string;
  title: string;
}

export interface CreateInvite_inviteCreate_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface CreateInvite_inviteCreate_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: CreateInvite_inviteCreate_createdBy_avatar | null;
}

export interface CreateInvite_inviteCreate {
  __typename: "Invite";
  id: string;
  board: CreateInvite_inviteCreate_board;
  token: string;
  state: string;
  expirationTime: any;
  description: string;
  createdBy: CreateInvite_inviteCreate_createdBy;
  createdAt: any;
}

export interface CreateInvite {
  inviteCreate: CreateInvite_inviteCreate;
}

export interface CreateInviteVariables {
  input: InviteCreateInput;
}
