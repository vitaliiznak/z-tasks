import { gql } from 'apollo-server'

export default gql`
  type Board {
    id: ID!
    title: String!
    description: String!
    membersCount: NonNegativeInt!
    members: [User]!
    createdBy: User!
    createdAt: DateTime!
  }

  input BoardCreateInput {
    title: String!
  }

  input BoardUpdateInput {
    title: String
  }

  input BoardAddMemberInput {
    title: String
  }

  input BoardCountFilterInput {
    createdBy: String
  }

  input BoardListFilterInput {
    createdBy: String
  }

  extend type Mutation {
    boardCreate(
      input: BoardCreateInput!
    ): Board!  @auth
    boardUpdate( 
      id: ID!,
      input: BoardUpdateInput!
    ): Board!  @auth
    boardRemove( id: ID! ): ID!  @auth
  }
  

  extend type Query {
    boardCount(filter:BoardCountFilterInput): NonNegativeInt  @auth
    boardGetList(filter:BoardListFilterInput): [Board]! @auth
    boardGetById(id: ID!): Board @auth
  }

`
