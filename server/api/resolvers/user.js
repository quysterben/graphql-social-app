const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {AuthenticationError, ApolloError} = require('apollo-server-express')

const {User} = require('../../models');

module.exports = {
    Mutation: {
        async register(root, args, context) {
            const {name, email, password} = args.input
            const user = await User.findOne({where: {email}})
            if (user) {
                throw new ApolloError('User existed')
            }
            return User.create({
                name,
                email,
                password,
            })
        },

        async login(root, args, context) {
            const {email, password} = args.input
            const user = await User.findOne({where: {email}})
            if (user.dataValues.banned === true) {
                throw new ApolloError('User banned')
            }
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({id: user.id, role: user.role}
                    , 'secret')
                return {...user.toJSON(), token}
            }
            throw new AuthenticationError('Invalid credentials')
        },

        async deleteUser(root, args, {user = null}) {
            const {userId} = args.input
            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }

            const deletedUser = await User.findByPk(userId)

            if (!deletedUser) throw new ApolloError('User is not exist')
            if (!deletedUser.dataValues.role === 1) {
                throw new ApolloError('Cannot delete this user')
            }

            if (user.role === 1 || userId === user.id) {
                await deletedUser.destroy()
                return {
                    message: 'User deleted',
                }
            } else {
                throw new ApolloError('Cannot delete this user')
            }
        },
    },

    Query: {
        async getAllUsers(root, args, context) {
            return User.findAll({
                where: {
                    role: 2,
                },
            })
        },
        async getOneUser(_, args, context) {
            const {userId} = args.input
            const user = await User.findOne({
                where: {
                    id: userId,
                    role: 2,
                },
            })
            if (!user) {
                throw new ApolloError('User is not exist')
            }
            return user
        },
    },
};
