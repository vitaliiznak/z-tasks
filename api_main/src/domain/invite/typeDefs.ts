import { gql } from 'apollo-server'

export default gql`
  input InviteCreateInput {
    boardId: ID!
    description: String!
    expirationTime: Date
  }

  input InviteJoinBoardInput {
    token: String!
  }

  input InviteListFilterInput {
    board: ID
    createdBy: String
    expirationTime: Date
    state: [String]
    state_NOT: [String]
  }

  input InviteCountFilterInput {
    boardId: ID
    createdBy: String
    expirationTime: Date
  }

  type Invite {
    id: ID!
    account: ID

    boardId: ID!
    token: String!
    state: String!
    description: String!
    expirationTime: DateTime!
    createdBy: User!
    createdAt: DateTime!
  }

  extend type Query {
    inviteCount(filter:InviteCountFilterInput): NonNegativeInt  @auth
    inviteGetList(filter:InviteListFilterInput): [Invite]! @auth
    inviteGetById(id: ID!): Invite @auth
  }

  extend type Mutation {
    inviteCreate(
      input: InviteCreateInput!
    ): Invite!  @auth
    inviteInvalidate( id: ID! ): ID!  @auth
    inviteJoinBoard( 
      input: InviteJoinBoardInput!
    ): Invite!
  }

`
