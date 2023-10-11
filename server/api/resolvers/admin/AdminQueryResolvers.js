const {AuthenticationError, ApolloError} = require('apollo-server-express')

const {UserReport, PostReport, CommentReport} = require('../../../models')

module.exports = {
    Query: {
        async getAllUserReports(root, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new ApolloError('You is not Admin')
            }

            const reports = await UserReport.findAll()

            return reports
        },

        async getAllPostReports(root, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new ApolloError('You is not Admin')
            }

            const reports = await PostReport.findAll()

            return reports
        },

        async getAllCommentReports(root, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new ApolloError('You is not Admin')
            }

            const reports = await CommentReport.findAll()

            return reports
        },
    },

    UserReport: {
        async reportUser(report) {
            return await report.getUsersReportUser()
        },
        async reportedUser(report) {
            return await report.getReportedUsers()
        },
    },

    PostReport: {
        async reportUser(report) {
            return await report.getUsersReportPost()
        },
        async reportedPost(report) {
            return await report.getReportedPosts()
        },
    },

    CommentReport: {
        async reportUser(report) {
            return await report.getUsersReportComment()
        },
        async reportedComment(report) {
            return await report.getReportedComments()
        },
    },
}
