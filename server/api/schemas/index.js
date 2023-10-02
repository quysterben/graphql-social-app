const {gql} = require('apollo-server-express')
const userType = require('./user')
const postType = require('./post')
const commentType = require('./comment')
const likeType = require('./like')
const friendshipType = require('./friendship')
const imageType = require('./image')

const {DateTime} = require('graphql-scalars')

const rootType = gql`
    scalar DateTime

    type Query {
        root: String
    }
    type Mutation {
        root: String
    }

`

module.exports = [
  DateTime,
  rootType,
  userType,
  postType,
  commentType,
  likeType,
  friendshipType,
  imageType,
]
