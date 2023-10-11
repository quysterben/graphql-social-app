const {AuthenticationError, ApolloError} = require('apollo-server-express')

const {User} = require('../../../models')

module.exports = {
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
            if (!bannedUser) throw new ApolloError('User is not exist')

            if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === true
            ) throw new ApolloError('You cannot ban this user')

            await User.update({banned: true}, {
                where: {
                    id: userId,
                },
            })
            const result = await User.findByPk(userId)
            return result
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
            }

            if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === false
            ) throw new ApolloError('You cannot unban this user')

            await User.update({banned: false}, {
                where: {
                    id: userId,
                },
            })
            const result = await User.findByPk(userId)
            return result
        },
    },
}
