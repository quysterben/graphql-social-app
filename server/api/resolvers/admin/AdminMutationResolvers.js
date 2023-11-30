const {GraphQLError} = require('graphql')

const {User} = require('../../../models')

const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

const fs = require('fs');
const csv = require('fast-csv')

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

            const {createReadStream} = await file.file
            const stream = await createReadStream()
            const path = './api/csv-imports/user-import.csv'
            const out = fs.createWriteStream(path)
            stream.pipe(out)
            csv.parseFile(path, {headers: true})
                .on('error', (error) => console.error(error))
                .on('data', async (row) => {
                    console.log(row);
                })
                .on('end', async () => {
                    console.log('done');
                })
            return {message: 'Import users data successfully'}
        },
    },
}
