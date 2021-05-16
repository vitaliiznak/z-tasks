/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInvites
// ====================================================

export interface GetInvites_inviteGetList_createdBy {
  __typename: "User";
  id: string;
}

export interface GetInvites_inviteGetList {
  __typename: "Invite";
  id: string;
  boardId: string;
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
