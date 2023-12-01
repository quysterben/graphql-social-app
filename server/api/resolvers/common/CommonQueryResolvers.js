const {ApolloError} = require('@apollo/server/errors')
const ErrorMessageConstants = require('../../constants/ErrorMessageConstants')

const {User} = require('../../../models');

const isAuth = require('../../middlewares/isAuth');

module.exports = {
    Query: {
        async getAllUsers(root, args, {user = null}) {
            isAuth(user)
            return await User.findAll({
                where: {
                    role: 'user',
                },
            })
        },
        async getOneUser(_, args, {user = null}) {
            isAuth(user)
            const {userId} = args.input
            const result = await User.findOne({
                where: {
                    id: userId,
                    role: 'user',
                },
            })
            if (!result) {
                throw new ApolloError(ErrorMessageConstants.UserNotExist)
            }
            return result
        },
    },
}
