const {gql} = require('apollo-server-express')

module.exports = gql`

    type Like {
        id: Int!
        postId: Int!
        userId: Int!
        createdAt: String!
    }

`
