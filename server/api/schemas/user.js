const {gql} = require('apollo-server-express')

module.exports = gql` 
    type User {
        id: Int!
        name: String!
        email: String!
    }

    extend type Query {
        getAllUsers: [User!]
        getOneUser(input: GetOneUserInput!): User!
    }

    extend type Mutation {
        register(input: RegisterInput!): RegisterResponse
        login(input: LoginInput!): LoginResponse
    }

    input GetOneUserInput {
        userId: Int!
    }
    
    input RegisterInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type RegisterResponse {
        id: Int!
        name: String!
        email: String!
    }

    type LoginResponse {
        id: Int!
        name: String!
        email: String!
        token: String!
        role: Int!
    }
`
