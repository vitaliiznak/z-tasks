/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_userGetById_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetUser_userGetById {
  __typename: "User";
  id: string;
  email: any;
  fullName: string;
  avatar: GetUser_userGetById_avatar | null;
}

export interface GetUser {
  userGetById: GetUser_userGetById | null;
}

export interface GetUserVariables {
  id: string;
}
