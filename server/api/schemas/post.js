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
        getSinglePost(input: SinglePostInput!): Post
    }

    extend type Mutation {
        createPost(input: CreatePostInput!): CreatePostResponse
        deletePost(input: SinglePostInput!): DeletePostResponse
        editPost(input: EditPostInput!): Post!
    }

    input EditPostInput {
        postId: Int!,
        title: String!
        content: String!
    }

    input SinglePostInput {
        postId: Int!
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

    type DeletePostResponse {
        message: String!
    }

`
