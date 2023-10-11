const {
    AuthenticationError,
    ApolloError,
} = require('apollo-server-express')

const {User} = require('../../../models');

module.exports = {
    Query: {
        async getAllUsers(root, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            return User.findAll({
                where: {
                    role: 2,
                },
            })
        },
        async getOneUser(_, args, {user = null}) {
            const {userId} = args.input
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }

            const result = await User.findOne({
                where: {
                    id: userId,
                    role: 2,
                },
            })
            if (!result) throw new ApolloError('User is not exist')

            return result
        },
    },
}
