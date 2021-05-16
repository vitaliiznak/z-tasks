/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InviteCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInvite
// ====================================================

export interface CreateInvite_inviteCreate_createdBy {
  __typename: "User";
  id: string;
}

export interface CreateInvite_inviteCreate {
  __typename: "Invite";
  id: string;
  boardId: string;
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
