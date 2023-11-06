const {ApolloError} = require('@apollo/server/errors')

const {User} = require('../../../models');
const isAuth = require('../../middlewares/isAuth');

module.exports = {
    Query: {
        async getAllUsers(root, args, {user = null}) {
            isAuth(user)
            return User.findAll({
                where: {
                    role: 2,
                },
            })
        },
        async getOneUser(_, args, {user = null}) {
            isAuth(user)
            const {userId} = args.input
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
