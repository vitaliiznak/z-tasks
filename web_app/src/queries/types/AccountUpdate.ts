/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AccountUpdate
// ====================================================

export interface AccountUpdate_accountUpdate_avatar {
  __typename: "FileAttachment";
  uri: string;
  filename: string;
  mimetype: string;
  encoding: string;
  ext: string;
}

export interface AccountUpdate_accountUpdate {
  __typename: "Account";
  id: string;
  fullName: string;
  email: any;
  avatar: AccountUpdate_accountUpdate_avatar | null;
}

export interface AccountUpdate {
  accountUpdate: AccountUpdate_accountUpdate;
}

export interface AccountUpdateVariables {
  id: string;
  update: AccountUpdateInput;
}
