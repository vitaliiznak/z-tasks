/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_accountLogin {
  __typename: "Account";
  id: string;
  email: any;
  fullName: string;
  token: string | null;
}

export interface Login {
  accountLogin: Login_accountLogin | null;
}

export interface LoginVariables {
  email: any;
  password: string;
}
