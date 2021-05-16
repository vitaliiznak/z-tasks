import { gql } from 'apollo-server'

export default gql`
  input CommentRepliesInput {
    request: Boolean!
    filter: CommentFilterQueryInput
  }

  input CommentCreateInput {
    content: String!
    task: ID!
    previous: ID
  }
  
  input CommentReplyCreateInput {
    content: String!
    previous: ID!
    task: ID
  }
  

  input CommentFilterQueryInput {
    task: ID
    createdBy: ID
    previous: String
  }

  input CommentRepliesQueryInput {
    limit: NonNegativeInt
  }
  
  type Comment {
    id: ID!
    content: String!
    task: Task!
    previous: ID
    createdBy: User!
    replyToUser: User
    createdAt: DateTime!
  }

  extend type Mutation {
    commentCreate(
      input: CommentCreateInput!
    ): Comment! @auth

    commentReplyCreate(
      input: CommentReplyCreateInput!
    ): Comment! @auth
   
    commentRemove( id: ID! ): ID! @auth
  }
  

  extend type Query {
    commentCount(filter:CommentFilterQueryInput): NonNegativeInt @auth
    commentGetList(filter:CommentFilterQueryInput, withReplies: CommentRepliesQueryInput): [Comment]! @auth
    commentGetById(id: ID!): Comment @auth
  }

`
