import { gql } from 'apollo-server'

export default gql`
  type Account {
    id: ID!
    fullName: String!
    email: EmailAddress!
    avatar: FileAttachment
    token: String
    createdAt: DateTime
  }

  input AccountSignupInput {
      fullName: String
      email: EmailAddress
      password: String
  }

  input AccountUpdateInput {
      fullName: String
      email: EmailAddress
      avatar: UploadWrapper
      removeAvatar: Boolean
  }

  extend type Query {

    accountMe: Account! @auth
  }


  extend type Mutation {
    accountLogin(email: EmailAddress!, password: String!): Account
    accountSignup(input: AccountSignupInput!): Account!
    accountUpdate(id: ID!, update: AccountUpdateInput!): Account! @auth
  }
`
