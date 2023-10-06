const {gql} = require('apollo-server-express')

module.exports = gql`
    type UserReport {
        id: Int!,
        reportUser: User!,
        reportedUser: User!
    }

    type PostReport {
        id: Int!,
        reportUser: User!,
        reportedPost: Post!
    }

    type CommentReport {
        id: Int!,
        reportUser: User!,
        reportedComment: Comment!
    }

    extend type Query {
        getAllUserReports: [UserReport!]
        
        getAllPostReports: [PostReport!]

        getAllCommentReports: [CommentReport!]
    }

    extend type Mutation {    
        banUser(input: BanUserInput!): BanUserResponse
        unbanUser(input: BanUserInput!): BanUserResponse
    }

    input BanUserInput {
        userId: Int!
    }

`
