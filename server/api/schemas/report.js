const {gql} = require('apollo-server-express')

module.exports = gql`

    type UserReport {
        id: Int!
        reportedUser: User!
        description: String!
    }

    type PostReport {
        id: Int!
        reportedPost: Post!
        description: String!
    }

    type CommentReport {
        id: Int!
        reportedComment: Comment!
        description: String!
    }

    extend type Mutation {
        reportUser(input: ReportUserInput!): UserReport!
        reportPost(input: ReportPostInput!): PostReport!
        reportComment(input: ReportCommentInput!): CommentReport!
    }

    input ReportUserInput {
        reportedUserId: Int!,
        description: String!,
    }

    input ReportPostInput {
        reportedPostId: Int!,
        description: String!,
    }

    input ReportCommentInput {
        reportedCommentId: Int!,
        description: String!,
    }

`
