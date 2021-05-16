/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_userGetList_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetUsers_userGetList {
  __typename: "User";
  id: string;
  fullName: string;
  email: any;
  avatar: GetUsers_userGetList_avatar | null;
}

export interface GetUsers {
  userGetList: (GetUsers_userGetList | null)[];
}
