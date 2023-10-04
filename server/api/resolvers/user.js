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
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({id: user.id, role: user.role}
                    , 'secret')
                return {...user.toJSON(), token}
            }
            throw new AuthenticationError('Invalid credentials')
        },

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
            if (!bannedUser) {
                throw new ApolloError('User is not exist')
            } else if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === true
            ) {
                throw new ApolloError('You cannot ban this user')
            } else {
                await User.update({banned: true}, {
                    where: {
                        id: userId,
                    },
                })
                const result = await User.findByPk(userId)
                return result
            }
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
            } else if (
                bannedUser.dataValues.role == 1 ||
                bannedUser.dataValues.banned === false
            ) {
                throw new ApolloError('You cannot unban this user')
            } else {
                await User.update({banned: false}, {
                    where: {
                        id: userId,
                    },
                })
                const result = await User.findByPk(userId)
                return result
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
