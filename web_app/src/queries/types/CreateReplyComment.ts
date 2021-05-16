/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CommentReplyCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReplyComment
// ====================================================

export interface CreateReplyComment_commentReplyCreate {
  __typename: "Comment";
  id: string;
}

export interface CreateReplyComment {
  commentReplyCreate: CreateReplyComment_commentReplyCreate;
}

export interface CreateReplyCommentVariables {
  input: CommentReplyCreateInput;
}
