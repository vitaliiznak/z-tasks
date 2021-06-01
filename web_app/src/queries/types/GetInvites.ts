/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InviteListFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetInvites
// ====================================================

export interface GetInvites_inviteGetList_board {
  __typename: "Board";
  id: string;
  title: string;
}

export interface GetInvites_inviteGetList_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetInvites_inviteGetList_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetInvites_inviteGetList_createdBy_avatar | null;
}

export interface GetInvites_inviteGetList {
  __typename: "Invite";
  id: string;
  board: GetInvites_inviteGetList_board;
  token: string;
  state: string;
  expirationTime: any;
  description: string;
  createdBy: GetInvites_inviteGetList_createdBy;
  createdAt: any;
}

export interface GetInvites {
  inviteGetList: (GetInvites_inviteGetList | null)[];
}

export interface GetInvitesVariables {
  filter?: InviteListFilterInput | null;
}
