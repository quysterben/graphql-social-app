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
        createComment(
            content: String!, postId: Int!, parentId: Int
            ): CreateCommentResponse
    }

    type CreateCommentResponse {
        id: Int!
        content: String!
        parentId: Int!
        createdAt: DateTime!
    }

`
