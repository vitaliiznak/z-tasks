/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CommentFilterQueryInput, CommentRepliesQueryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetComments
// ====================================================

export interface GetComments_commentGetList_createdBy_avatar {
  __typename: "FileAttachment";
  uri: string;
}

export interface GetComments_commentGetList_createdBy {
  __typename: "User";
  id: string;
  fullName: string;
  avatar: GetComments_commentGetList_createdBy_avatar | null;
}

export interface GetComments_commentGetList {
  __typename: "Comment";
  id: string;
  content: string;
  createdBy: GetComments_commentGetList_createdBy;
  createdAt: any;
  previous: string | null;
}

export interface GetComments {
  commentGetList: (GetComments_commentGetList | null)[];
}

export interface GetCommentsVariables {
  filter?: CommentFilterQueryInput | null;
  withReplies?: CommentRepliesQueryInput | null;
}
