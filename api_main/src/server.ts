import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import { merge } from 'lodash'
import cors from 'cors'
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload'

import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive'
import jwt from 'jsonwebtoken'
import {
  DateResolver,
  DateTimeResolver,
  TimeResolver,
  UtcOffsetResolver,
  EmailAddressResolver,
  NegativeFloatResolver,
  NegativeIntResolver,
  NonNegativeFloatResolver,
  NonNegativeIntResolver,
  NonPositiveFloatResolver,
  NonPositiveIntResolver,
  PhoneNumberResolver,
  PositiveFloatResolver,
  PositiveIntResolver,
  PostalCodeResolver,
  UnsignedFloatResolver,
  UnsignedIntResolver,
  URLResolver,
  BigIntResolver,
  LongResolver,
  GUIDResolver,
  HexColorCodeResolver,
  HSLResolver,
  HSLAResolver,
  IPv4Resolver,
  IPv6Resolver,
  ISBNResolver,
  MACResolver,
  PortResolver,
  RGBResolver,
  RGBAResolver,
  USCurrencyResolver,
  CurrencyResolver,
  JSONResolver,
  JSONObjectResolver,
  ObjectIDResolver,
  ByteResolver,
} from 'graphql-scalars'
import path from 'path'
import AccountService from './services/account'

import { typeDefs as AccountDefs, resolvers as AccountResolvers } from './domain/account'
import { typeDefs as UserDefs, resolvers as UserResolvers } from './domain/user'
import { typeDefs as TaskDefs, resolvers as TaskResolvers } from './domain/task'
import { typeDefs as InviteDefs, resolvers as InviteResolvers } from './domain/invite'
import { typeDefs as CommentDefs, resolvers as CommentResolvers } from './domain/comment'
import { typeDefs as BoardDefs, resolvers as BoardResolvers } from './domain/board'
import { AuthDirective, EnsureuserIsBoardMemberDirective } from './directives/Auth'
import type { TAccountWithToken } from './services/account/account'

// import authRoutes from "./routes/auth";
// Construct a schema, using GraphQL schema language

/*
input UploadWrapper {
  uid: ID!
  lastModified: DateTime
  name: String
  type: String
  originFileObj: Upload!
}
*/

export type TAuthorizedUser = TAccountWithToken

const typeDefs = [
  gql`
    directive @auth(
      requires: String,
    ) on FIELD_DEFINITION

    scalar ValidateString
    scalar ValidateNumber
    
    scalar Date
    scalar Time
    scalar DateTime
    scalar UtcOffset
    scalar EmailAddress
    scalar NegativeFloat
    scalar NegativeInt
    scalar NonNegativeFloat
    scalar NonNegativeInt
    scalar NonPositiveFloat
    scalar NonPositiveInt
    scalar PhoneNumber
    scalar PositiveFloat
    scalar PositiveInt
    scalar PostalCode
    scalar UnsignedFloat
    scalar UnsignedInt
    scalar URL
    scalar ObjectID
    scalar BigInt
    scalar Long
    scalar GUID
    scalar HexColorCode
    scalar HSL
    scalar HSLA
    scalar IPv4
    scalar IPv6
    scalar ISBN
    scalar MAC
    scalar Port
    scalar RGB
    scalar RGBA
    scalar USCurrency
    scalar Currency
    scalar JSON
    scalar JSONObject
    scalar Byte

    input UploadWrapper {
      uid: ID!
      name: String!
      type: String!
      originFileObj: Upload!
    }

    type FileAttachment {
      uri: String!,
      filename: String!,
      mimetype:  String!,
      encoding:  String!,
      ext:  String!
    }

    type Query {
      _empty: String
    }

    type Mutation {
      _empty: String
    }
  `,
  constraintDirectiveTypeDefs,
  AccountDefs,
  TaskDefs,
  UserDefs,
  CommentDefs,
  BoardDefs,
  InviteDefs,
  // DestinationsDefs
]
const resolvers = merge(
  {
    ObjectID: ObjectIDResolver,

    Date: DateResolver,
    Time: TimeResolver,
    DateTime: DateTimeResolver,
    UtcOffset: UtcOffsetResolver,

    NonPositiveInt: NonPositiveIntResolver,
    PositiveInt: PositiveIntResolver,
    NonNegativeInt: NonNegativeIntResolver,
    NegativeInt: NegativeIntResolver,
    NonPositiveFloat: NonPositiveFloatResolver,
    PositiveFloat: PositiveFloatResolver,
    NonNegativeFloat: NonNegativeFloatResolver,
    NegativeFloat: NegativeFloatResolver,
    UnsignedFloat: UnsignedFloatResolver,
    UnsignedInt: UnsignedIntResolver,
    BigInt: BigIntResolver,
    Long: LongResolver,

    EmailAddress: EmailAddressResolver,
    URL: URLResolver,
    PhoneNumber: PhoneNumberResolver,
    PostalCode: PostalCodeResolver,

    GUID: GUIDResolver,

    HexColorCode: HexColorCodeResolver,
    HSL: HSLResolver,
    HSLA: HSLAResolver,
    RGB: RGBResolver,
    RGBA: RGBAResolver,

    IPv4: IPv4Resolver,
    IPv6: IPv6Resolver,
    MAC: MACResolver,
    Port: PortResolver,

    ISBN: ISBNResolver,

    USCurrency: USCurrencyResolver,
    Currency: CurrencyResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    Byte: ByteResolver
  },
  AccountResolvers,
  TaskResolvers,
  UserResolvers,
  CommentResolvers,
  BoardResolvers,
  InviteResolvers,
)

const contextServer = async (context) => {
  // get the user token from the headers
  const bearer = context.req.headers.authorization
  if (!bearer) {
    return context
  }
  const token = bearer.replace(/^(Bearer )/, '')
  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    // console.error(err)
    return context
  }

  const user = await AccountService.getById(decoded.data.id)

  if (!user) {
    return context
  }
  const userToContext: TAccountWithToken = { ...user, token }
  return { user: userToContext, ...context }
}

/* const schemaAux = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: AuthDirective,
  },

  inheritResolversFromInterfaces: true
});

const transformedSchema = transformSchema(schemaAux, [constraintDirective()]) */

// Provide resolver functions for your schema fields
const server = new ApolloServer({
  schemaDirectives: {
    auth: AuthDirective,
    ensureuserIsBoardMemberDirective: EnsureuserIsBoardMemberDirective,
    // constraint: constraintDirective()
  },
  typeDefs,

  resolvers,

  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20,
  },
  dataSources: () => ({}),
  context: contextServer,
})

const app = express()
// app.use("/auth", authRoutes);
app.use(express.static(path.join(__dirname, '../public')))
app.use('/storage', express.static(path.join(__dirname, '../uploads')))
app.use(cors())
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => console.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))

export default {}
