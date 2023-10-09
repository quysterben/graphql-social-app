const {AuthenticationError, ApolloError} = require('apollo-server-express')

const {
    User, Post, Comment,
    UserReport, PostReport, CommentReport} = require('../../models')

const reportSchema = require('../validation/report.validation')

module.exports = {
    Mutation: {
        async reportUser(_, args, {user = null}) {
            try {
                await reportSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 2) {
                throw new ApolloError('You is not User')
            }

            const {reportedUserId, description} = args.input

            if (reportedUserId === user.id) {
                throw new ApolloError('Cannot report yourself')
            }

            const reportedUser = await User.findByPk(reportedUserId)

            if (!reportedUser) throw new ApolloError('User is not exist')
            if (reportedUser.dataValues.role === 1) {
                throw new ApolloError('Cannot report this user')
            }

            return await UserReport.create({
                reportUserId: user.id,
                reportedUserId: reportedUserId,
                description: description,
            })
        },
        async reportPost(_, args, {user = null}) {
            try {
                await reportSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 2) {
                throw new ApolloError('You is not User')
            }

            const {reportedPostId, description} = args.input

            const reportedPost = await Post.findByPk(reportedPostId)

            if (!reportedPost) throw new ApolloError('Post is not exist')
            if (reportedPost.dataValues.userId === user.id) {
                throw new ApolloError('Cannot report your post')
            }

            return await PostReport.create({
                reportUserId: user.id,
                reportedPostId: reportedPostId,
                description: description,
            })
        },
        async reportComment(_, args, {user = null}) {
            try {
                await reportSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 2) {
                throw new ApolloError('You is not User')
            }

            const {reportedCommentId, description} = args.input

            const reportedComment = await Comment.findByPk(reportedCommentId)

            if (!reportedComment) throw new ApolloError('Comment is not exist')
            if (reportedComment.dataValues.userId === user.id) {
                throw new ApolloError('Cannot report your comment')
            }

            return await CommentReport.create({
                reportUserId: user.id,
                reportedCommentId: reportedCommentId,
                description: description,
            })
        },
    },

    UserReport: {
        async reportedUser(report) {
            return await report.getReportedUsers()
        },
    },

    PostReport: {
        async reportedPost(report) {
            return await report.getReportedPosts()
        },
    },

    CommentReport: {
        async reportedComment(report) {
            return await report.getReportedComments()
        },
    },
}
