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
        deleteUser(input: DeleteUserInput!): DeleteResponse
    }

    input DeleteUserInput {
        userId: Int!
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

    type BanUserResponse {
        id: Int!
        name: String!
        email: String!
        role: Int!
        banned: Boolean!
    }

    type LoginResponse {
        id: Int!
        name: String!
        email: String!
        token: String!
        role: Int!
    }

    type DeleteResponse {
        message: String!
    }
`
