const {AuthenticationError, ApolloError} = require('apollo-server-express')

const {User, UserReport, PostReport, CommentReport} = require('../../models')

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

    Mutation: {
        async banUser(_, args, {user = null}) {
            const {userId} = args.input
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new ApolloError('You is not Admin')
            }

            if (userId === user.id) {
                throw new ApolloError('You cannot ban this user')
            }

            const bannedUser = await User.findByPk(userId)
            if (!bannedUser) {
                throw new ApolloError('User is not exist')
            } else if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === true
            ) {
                throw new ApolloError('You cannot ban this user')
            } else {
                await User.update({banned: true}, {
                    where: {
                        id: userId,
                    },
                })
                const result = await User.findByPk(userId)
                return result
            }
        },

        async unbanUser(_, args, {user = null}) {
            const {userId} = args.input
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new ApolloError('You is not Admin')
            }

            if (userId === user.id) {
                throw new ApolloError('You cannot unban this user')
            }

            const bannedUser = await User.findByPk(userId)
            if (!bannedUser) {
                throw new ApolloError('User is not exist')
            } else if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === false
            ) {
                throw new ApolloError('You cannot unban this user')
            } else {
                await User.update({banned: false}, {
                    where: {
                        id: userId,
                    },
                })
                const result = await User.findByPk(userId)
                return result
            }
        },
    },
}
