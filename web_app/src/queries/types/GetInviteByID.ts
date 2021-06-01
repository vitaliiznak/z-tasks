/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInviteByID
// ====================================================

export interface GetInviteByID_inviteGetById_board {
  __typename: "Board";
  id: string;
  title: string;
}

export interface GetInviteByID_inviteGetById_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetInviteByID_inviteGetById_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetInviteByID_inviteGetById_createdBy_avatar | null;
}

export interface GetInviteByID_inviteGetById {
  __typename: "Invite";
  id: string;
  board: GetInviteByID_inviteGetById_board;
  token: string;
  state: string;
  expirationTime: any;
  description: string;
  createdBy: GetInviteByID_inviteGetById_createdBy;
  createdAt: any;
}

export interface GetInviteByID {
  inviteGetById: GetInviteByID_inviteGetById | null;
}

export interface GetInviteByIDVariables {
  id: string;
}
