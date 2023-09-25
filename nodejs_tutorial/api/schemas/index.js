const {gql} = require('apollo-server-express')
const userType = require('./user')
const postType = require('./post')
const commentType = require('./comment')
const likeType = require('./like')

const rootType = gql`

    type Query {
        root: String
    }
    type Mutation {
        root: String
    }

`

module.exports = [rootType, userType, postType, commentType, likeType]
