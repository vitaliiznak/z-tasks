import { gql } from 'apollo-server'

export default gql`
  enum TaskStateEnum {
    TODO,
    IN_PROGRESS,
    IN_REVIEW,
    DONE
  }
  
  enum TaskPriorityEnum {
    LOW
    MEDIUM
    HIGH,
    CRITICAL
  }
  
  input TaskListFilterInput {
    assigners: [ID]
    createdBy: [ID]
    priorities: [TaskPriorityEnum]
    searchTitle: String
    searchDescription: String
    isArchived: Boolean
    board: ID
  }

  input TaskCountFilterInput {
    assigners: [ID]
    createdBy: [ID]
    priorities: [TaskPriorityEnum]
    searchTitle: String
    searchDescription: String
    isArchived: Boolean
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    priority: TaskPriorityEnum!
    state: TaskStateEnum!,
    attachments: [FileAttachment]!
    assigners: [User]!
    createdBy: User!
    isArchived: Boolean!
    createdAt: DateTime!
  }

  input TaskCreateInput {
    board: ID!
    title: String!, 
    description: String,
    priority: TaskPriorityEnum!
    attachments: [UploadWrapper]!
    assigners: [ID]
  }

  input TaskUpdateInput {
    title: String, 
    description: String,
    priority: TaskPriorityEnum
    assignersAdd: [ID]
    assignersRemove: [ID]
  }
 
  extend type Mutation {
    taskCreate(
      input: TaskCreateInput!
    ): Task!  @auth
    taskUpdate( 
      id: ID!,
      input: TaskUpdateInput!
    ): Task!  @auth
    taskRemove( id: ID! ): ID!  @auth

    taskArchive( id: ID! ): Task!  @auth
    taskUnarchive( id: ID! ): Task!  @auth
    taskChangeState( id: ID!, state: String! ): Task!  @auth
  }
  

  extend type Query {
    taskCount(filter:TaskCountFilterInput): NonNegativeInt  @auth
    taskGetList(filter:TaskListFilterInput): [Task]! @auth
    taskGetById(id: ID!): Task @auth
  }

`
