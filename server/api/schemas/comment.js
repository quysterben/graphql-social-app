const {gql} = require('apollo-server-express')

module.exports = gql`

    type Comment {
        id: Int!
        content: String!
        author: User!
        post: Post!
        parentId: Int!
        createdAt: DateTime!
    }

    extend type Mutation {
        createComment(input: CreateCommentInput!): CreateCommentResponse
    }

    input CreateCommentInput {
        content: String!
        postId: Int!
        parentId: Int
    }

    type CreateCommentResponse {
        id: Int!
        content: String!
        parentId: Int!
        createdAt: DateTime!
    }

`
