const {gql} = require('apollo-server-express')

module.exports = gql`

    type Post {
        id: Int!
        title: String!
        content: String!
        author: User!
        comments: [Comment!]
        images: [Image!]
        likes: [Like!]
        createdAt: DateTime!
    }

    extend type Query {
        getAllPosts: [Post!]
        getSinglePost(input: GetSinglePostInput!): Post
    }

    input GetSinglePostInput {
        postId: Int!
    }

    extend type Mutation {
        createPost(input: CreatePostInput!): CreatePostResponse
    }

    input CreatePostInput {
        title: String!
        content: String!
    }

    type CreatePostResponse {
        id: Int!
        title: String!
        content: String!
        createdAt: DateTime!
    }

`
