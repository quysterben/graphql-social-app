const {gql} = require('apollo-server-express')

module.exports = gql`

    type Like {
        id: Int!
        postId: Int!
        userId: Int!
        createdAt: DateTime!
    }

    extend type Mutation {
        likePost(postId: Int!): likePostResponse
    }

    type likePostResponse {
        id: Int!
        postId: Int!
    }
`
