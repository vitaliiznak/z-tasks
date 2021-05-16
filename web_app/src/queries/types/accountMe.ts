/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: accountMe
// ====================================================

export interface accountMe_accountMe_avatar {
  __typename: "FileAttachment";
  uri: string;
  filename: string;
}

export interface accountMe_accountMe {
  __typename: "Account";
  id: string;
  fullName: string;
  email: any;
  avatar: accountMe_accountMe_avatar | null;
}

export interface accountMe {
  accountMe: accountMe_accountMe;
}
