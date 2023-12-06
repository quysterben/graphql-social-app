/* eslint-disable max-len */
const {GraphQLError} = require('graphql')

const {User, Post, Comment, Like, PostReport, CommentReport, UserReport} = require('../../../models')

const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

const {importUserDataSchema} = require('../../validation/importData.validation')
const postSchema = require('../../validation/post.validation')

const fs = require('node:fs');
const csv = require('fast-csv')
const {parseFile} = require('@fast-csv/parse')
const path = require('path')
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid');
const moment = require('moment');

const ErrorMessageConstants = require('../../constants/ErrorMessageConstants')

const defaultPassword = '12345678'

module.exports = {
    Mutation: {
        async banUser(_, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            const {userId} = args.input
            if (userId === user.id) {
                throw new GraphQLError(ErrorMessageConstants.ActionFailed)
            }

            const bannedUser = await User.findByPk(userId)
            if (!bannedUser) throw new GraphQLError(ErrorMessageConstants.UserNotExist)

            if (
                bannedUser.role == 'admin' ||
                bannedUser.banned === true
            ) throw new GraphQLError(ErrorMessageConstants.ActionFailed)

            bannedUser.banned = true
            await bannedUser.save()
            return bannedUser
        },
        async unbanUser(_, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            const {userId} = args.input
            if (userId === user.id) {
                throw new GraphQLError(ErrorMessageConstants.ActionFailed)
            }

            const bannedUser = await User.findByPk(userId)
            if (!bannedUser) {
                throw new GraphQLError(ErrorMessageConstants.UserNotExist)
            }
            if (
                bannedUser.role == 1 ||
                bannedUser.banned === false
            ) throw new GraphQLError(ErrorMessageConstants.ActionFailed)

            bannedUser.banned = false
            await bannedUser.save()
            return bannedUser
        },
        async importUsersData(_, {file}, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const {createReadStream, filename} = await file.file
                const stream = createReadStream()
                const pathName = `../../Upload/${filename}`
                const out = fs.createWriteStream(path.join(__dirname, pathName))
                await stream.pipe(out)

                const readData = async () => {
                    return new Promise((resolve, reject) => {
                        const data = []
                        parseFile(path.join(__dirname, pathName), {headers: true})
                        .on('error', (error) => reject(error))
                        .on('data', (row) => data.push(row))
                        .on('end', () => resolve(data))
                    })
                }

                const data = await readData()
                let imports = 0
                let errors = 0

                await Promise.all(data.map(async (user) => {
                    try {
                        await importUserDataSchema.validate(user, {abortEarly: true})
                        const checkUser = await User.findOne({where: {email: user.email}})
                        if (checkUser) {
                            errors++
                            return
                        }
                        imports++
                        const newUser = await User.create({
                            name: user.name,
                            email: user.email,
                            password: await bcrypt.hash(defaultPassword, 10),
                            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
                            from: user.from,
                            banned: user.banned === 'TRUE' ? true : false,
                        })
                        return newUser
                    } catch (err) {
                        errors++
                    }
                }))

                fs.unlinkSync(path.join(__dirname, pathName))
                console.log('Imported: ', imports);
                console.log('Errors: ', errors);

                return {
                    imported: imports,
                    errors: errors,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async importPostsData(_, {file}, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const {createReadStream, filename} = await file.file
                const stream = createReadStream()
                const pathName = `../../Upload/${filename}`
                const out = fs.createWriteStream(path.join(__dirname, pathName))
                await stream.pipe(out)

                const readData = async () => {
                    return new Promise((resolve, reject) => {
                        const data = []
                        parseFile(path.join(__dirname, pathName), {headers: true})
                        .on('error', (error) => reject(error))
                        .on('data', (row) => {
                            data.push(row)
                        })
                        .on('end', () => resolve(data))
                    })
                }

                const data = await readData()
                let imports = 0
                let errors = 0

                await Promise.all(data.map(async (post) => {
                    try {
                        await postSchema.validate(post, {abortEarly: false})
                        const user = await User.findByPk(post.authorId)
                        if (!user) {
                            errors++
                            return
                        }
                        imports++
                        await user.createPost({content: post.content})
                    } catch (err) {
                        errors++
                    }
                }))
                fs.unlinkSync(path.join(__dirname, pathName))
                console.log('Imported: ', imports);
                console.log('Errors: ', errors);

                return {
                    imported: imports,
                    errors: errors,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportUsersData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const uuid = uuidv4()
                const currTime = moment().format('YYYY-MM-DD-HH-mm-ss')
                                    .toString()
                const fileName = `users-${currTime}-${uuid}.csv`
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, `../../csv-exports/${fileName}`),
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
                         process.env.PORT + `/csv-exports/${fileName}`,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportPostsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const uuid = uuidv4()
                const currTime = moment().format('YYYY-MM-DD-HH-mm-ss')
                                    .toString()
                const fileName = `posts-${currTime}-${uuid}.csv`
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, `../../csv-exports/${fileName}`),
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
                         process.env.PORT + `/csv-exports/${fileName}`,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportUserReportsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const uuid = uuidv4()
                const currTime = moment().format('YYYY-MM-DD-HH-mm-ss')
                                    .toString()
                const fileName = `user-reports-${currTime}-${uuid}.csv`
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, `../../csv-exports/${fileName}`),
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
                    `/csv-exports/${fileName}`,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportPostReportsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const uuid = uuidv4()
                const currTime = moment().format('YYYY-MM-DD-HH-mm-ss')
                                    .toString()
                const fileName = `post-reports-${currTime}-${uuid}.csv`
                const writeStream = fs.createWriteStream(
                    path.join(__dirname, `../../csv-exports/${fileName}`),
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
                    `/csv-exports/${fileName}`,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async exportCommentReportsData(root, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            try {
                const uuid = uuidv4()
                const currTime = moment().format('YYYY-MM-DD-HH-mm-ss')
                                    .toString()
                const fileName = `comment-reports-${currTime}-${uuid}.csv`
                const writeStream = fs.createWriteStream(
                    path.join(__dirname,
                        `../../csv-exports/${fileName}`),
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
                    `/csv-exports/${fileName}`,
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
    },
}
