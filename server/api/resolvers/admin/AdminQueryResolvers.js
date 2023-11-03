const {GraphQLError} = require('graphql')

const {
    UserReport,
    PostReport,
    CommentReport,
    User,
    Post,
    Comment,
    Like,
} = require('../../../models')

const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');

module.exports = {
    Query: {
        async getAllUserReports(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new GraphQLError('You is not Admin')
            }

            const reports = await UserReport.findAll()

            return reports
        },

        async getAllPostReports(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new GraphQLError('You is not Admin')
            }

            const reports = await PostReport.findAll()

            return reports
        },

        async getAllCommentReports(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new GraphQLError('You is not Admin')
            }

            const reports = await CommentReport.findAll()

            return reports
        },

        async exportUsersData(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new GraphQLError('You is not Admin')
            }

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, '../../csv-exports/users.csv'),
                )

                const csvStream = csv.format({headers: true})
                csvStream.pipe(writeStream)

                const users = await User.findAll(
                    {
                        where: {role: 2},
                        attributes: [
                            'id', 'name', 'email', 'dateOfBirth', 'from',
                            'avatar', 'wallpaper', 'banned', 'createdAt',
                        ],
                    })
                users.map((user) => {
                    csvStream.write(user.dataValues)
                })
                csvStream.end();

                return {
                    csvLink: process.env.BASE_URL +
                         process.env.PORT + '/csv-exports/users.csv',
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },

        async exportPostsData(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }
            if (user.role !== 1) {
                throw new GraphQLError('You is not Admin')
            }

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, '../../csv-exports/posts.csv'),
                )
                const csvStream = csv.format({headers: true})
                csvStream.pipe(writeStream)

                const posts = await Post.findAll({raw: true})
                const data = posts.map(async (post) => {
                    const commentsCount = await Comment.count(
                        {where: {postId: post.id}})
                    const likesCount = await Like.count(
                        {where: {postId: post.id}})
                    console.log(likesCount);
                    csvStream.write({
                        id: post.id,
                        content: post.content,
                        authorId: post.userId,
                        comments: commentsCount,
                        likes: likesCount,
                        createdAt: post.createdAt,
                    })
                })
                Promise.all(data).then(() => {
                    csvStream.end()
                })

                return {
                    csvLink: process.env.BASE_URL +
                         process.env.PORT + '/csv-exports/posts.csv',
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
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
