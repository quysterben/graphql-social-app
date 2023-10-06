const {gql} = require('apollo-server-express')

module.exports = gql`

    type Comment {
        id: Int!
        content: String!
        author: User!
        parentId: Int!
        createdAt: DateTime!
    }

    extend type Mutation {
        createComment(input: CreateCommentInput!): CreateCommentResponse
        deleteComment(input: SingleCommentInput!): DeleteCommentResponse
        editComment(input: EditCommentInput!): Comment!
    }

    input EditCommentInput {
        commentId: Int!
        content: String!
    }

    input SingleCommentInput {
        commentId: Int!
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

    type DeleteCommentResponse {
        message: String!
    }

`
