const {gql} = require('graphql-tag')

const userType = require('./user.graphql')
const adminType = require('./admin.graphql')
const commonType = require('./common.graphql')

const {DateTime, Date} = require('graphql-scalars')

const rootType = gql`
    scalar DateTime
    scalar Date

    scalar Upload

    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
`

module.exports = [
    DateTime,
    Date,
    rootType,
    userType,
    adminType,
    commonType,
]
