/* eslint-disable max-len */
const {GraphQLError} = require('graphql')

const {User} = require('../../../models')

const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

const {importUserDataSchema} = require('../../validation/importData.validation')
const fs = require('fs');
const csv = require('@fast-csv/parse')
const path = require('path')
const bcrypt = require('bcrypt')

const defaultPassword = '12345678'

module.exports = {
    Mutation: {
        async banUser(_, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            const {userId} = args.input
            if (userId === user.id) {
                throw new GraphQLError('You cannot ban this user')
            }

            const bannedUser = await User.findByPk(userId)
            if (!bannedUser) throw new GraphQLError('User is not exist')

            if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === true
            ) throw new GraphQLError('You cannot ban this user')

            await User.update({banned: true}, {
                where: {
                    id: userId,
                },
            })
            return await User.findByPk(userId)
        },
        async unbanUser(_, args, {user = null}) {
            isAuth(user)
            isAdmin(user)

            const {userId} = args.input
            if (userId === user.id) {
                throw new GraphQLError('You cannot unban this user')
            }

            const bannedUser = await User.findByPk(userId)
            if (!bannedUser) {
                throw new GraphQLError('User is not exist')
            }

            if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === false
            ) throw new GraphQLError('You cannot unban this user')

            await User.update({banned: false}, {
                where: {
                    id: userId,
                },
            })
            return await User.findByPk(userId)
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
                        csv.parseFile('./api/Upload/users.csv', {headers: true})
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
                await Promise.all(data.map(async (user, index) => {
                    try {
                        console.log('row: ', index);
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

                stream.destroy()
                fs.unlinkSync('./api/Upload/users.csv')

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
