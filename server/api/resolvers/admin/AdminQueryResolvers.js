const {
    UserReport,
    PostReport,
    CommentReport,
} = require('../../../models')

const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

module.exports = {
    Query: {
        async getAllUserReports(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)
            return await UserReport.findAll()
        },
        async getAllPostReports(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)
            return await PostReport.findAll()
        },
        async getAllCommentReports(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)
            return await CommentReport.findAll()
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
