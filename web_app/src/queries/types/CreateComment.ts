/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CommentCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateComment
// ====================================================

export interface CreateComment_commentCreate {
  __typename: "Comment";
  id: string;
}

export interface CreateComment {
  commentCreate: CreateComment_commentCreate;
}

export interface CreateCommentVariables {
  input: CommentCreateInput;
}
