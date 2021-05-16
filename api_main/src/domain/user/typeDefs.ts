import { gql } from 'apollo-server'

export default gql`
  type User {
    id: ID!
    fullName: String!
    email: EmailAddress!
    avatar: FileAttachment
  }


  extend type Query {
    userGetList: [User]!  @auth
    userGetById(id: ID): User @auth
  }

`
