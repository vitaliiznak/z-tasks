/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountSignupInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_accountSignup {
  __typename: "Account";
  id: string;
  email: any;
  fullName: string;
  token: string | null;
}

export interface SignUp {
  accountSignup: SignUp_accountSignup;
}

export interface SignUpVariables {
  input: AccountSignupInput;
}
