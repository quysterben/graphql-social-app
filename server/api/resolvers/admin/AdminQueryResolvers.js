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
        async exportUsersData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, '../../csv-exports/users.csv'),
                )

                const csvStream = csv.format({headers: true, writeBOM: true})
                csvStream.pipe(writeStream)

                const users = await User.findAll(
                    {
                        where: {role: 'user'},
                        attributes: [
                            'id', 'name', 'email', 'dateOfBirth', 'from',
                            'avatar', 'wallpaper', 'banned',
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
            isAuth(user)
            isAdmin(user)

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, '../../csv-exports/posts.csv'),
                )
                const csvStream = csv.format({headers: true, writeBOM: true})
                csvStream.pipe(writeStream)

                const posts = await Post.findAll({raw: true})
                const data = posts.map(async (post) => {
                    const commentsCount = await Comment.count(
                        {where: {postId: post.id}})
                    const likesCount = await Like.count(
                        {where: {postId: post.id}})
                    csvStream.write({
                        id: post.id,
                        content: post.content,
                        authorId: post.userId,
                        comments: commentsCount,
                        likes: likesCount,
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
        async exportUserReportsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, '../../csv-exports/userReports.csv'),
                )
                const csvStream = csv.format({headers: true, writeBOM: true})
                csvStream.pipe(writeStream)

                const reports = await UserReport.findAll({raw: true})
                const data = reports.map(async (report) => {
                    const reportedUser = await User.findByPk(
                        report.reportedUserId,
                        {raw: true},
                    )
                    const reportUser = await User.findByPk(
                        report.reportUserId,
                        {raw: true},
                    )
                    csvStream.write({
                        id: report.id,
                        reportedUserId: reportedUser.id,
                        reportedUsername: reportedUser.name,
                        reportedUserEmail: reportedUser.email,
                        reportUserId: reportUser.id,
                        reportUserName: reportUser.name,
                        reportUserEmail: reportUser.email,
                        description: report.description,
                    })
                })
                Promise.all(data).then(() => {
                    csvStream.end()
                })

                return {
                    csvLink: process.env.BASE_URL + process.env.PORT +
                    '/csv-exports/userReports.csv',
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportPostReportsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, '../../csv-exports/postReports.csv'),
                )
                const csvStream = csv.format({headers: true, writeBOM: true})
                csvStream.pipe(writeStream)

                const reports = await PostReport.findAll({raw: true})
                const data = reports.map(async (report) => {
                    const reportedPost = await Post.findByPk(
                        report.reportedPostId,
                        {raw: true},
                    )
                    const reportUser = await User.findByPk(
                        report.reportUserId,
                        {raw: true},
                    )
                    csvStream.write({
                        id: report.id,
                        reportUserId: reportUser.id,
                        reportUsername: reportUser.name,
                        reportUserEmail: reportUser.email,
                        reportedPostId: reportedPost.id,
                        reportedPostContent: reportedPost.content,
                        reportedUserId: reportedPost.userId,
                        description: report.description,
                    })
                })
                Promise.all(data).then(() => {
                    csvStream.end()
                })

                return {
                    csvLink: process.env.BASE_URL + process.env.PORT +
                    '/csv-exports/postReports.csv',
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportCommentReportsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const writeStream = fs.createWriteStream(
                    path.join(__dirname,
                        '../../csv-exports/commentReports.csv'),
                )
                const csvStream = csv.format({headers: true, writeBOM: true})
                csvStream.pipe(writeStream)

                const reports = await CommentReport.findAll({raw: true})
                const data = reports.map(async (report) => {
                    const reportedComment = await Comment.findByPk(
                        report.reportedCommentId,
                        {raw: true},
                    )
                    const reportUser = await User.findByPk(
                        report.reportUserId,
                        {raw: true},
                    )
                    csvStream.write({
                        id: report.id,
                        reportUserId: reportUser.id,
                        reportUsername: reportUser.name,
                        reportUserEmail: reportUser.email,
                        reportedCommentId: reportedComment.id,
                        reportedCommentContent: reportedComment.content,
                        postId: reportedComment.postId,
                        reportedUserId: reportedComment.userId,
                        description: report.description,
                    })
                })
                Promise.all(data).then(() => {
                    csvStream.end()
                })

                return {
                    csvLink: process.env.BASE_URL + process.env.PORT +
                    '/csv-exports/commentReports.csv',
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
