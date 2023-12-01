/* eslint-disable max-len */
const {GraphQLError} = require('graphql')

const {User} = require('../../../models')

const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

const {importUserDataSchema} = require('../../validation/importData.validation')
const postSchema = require('../../validation/post.validation')

const fs = require('node:fs');
const csv = require('@fast-csv/parse')
const path = require('path')
const bcrypt = require('bcrypt')

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
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === false
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
                        csv.parseFile(path.join(__dirname, pathName), {headers: true})
                        .on('error', (error) => reject(error))
                        .on('data', async (row) => {
                            data.push(row)
                        })
                        .on('end', () => resolve(data))
                    })
                }

                const data = await readData()
                let imports = 0
                let errors = 0
                await Promise.all(data.map(async (user) => {
                    try {
                        await importUserDataSchema.validate(
                            user,
                            {abortEarly: false},
                        )
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
                        csv.parseFile(path.join(__dirname, pathName), {headers: true})
                        .on('error', (error) => reject(error))
                        .on('data', async (row) => {
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
    },
}
