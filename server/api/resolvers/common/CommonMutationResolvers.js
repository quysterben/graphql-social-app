const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {GarphQLUpload} = require('graphql-upload')

const {
    AuthenticationError,
    ApolloError,
} = require('apollo-server-express')

const {uploadImages, destroyImages} = require('../../middlewares/image')

const {User} = require('../../../models');

const {extractPublicId} = require('cloudinary-build-url')

const {
    registerSchema,
    loginSchema,
} = require('../../validation/auth.validation')

module.exports = {
    Upload: {
        GarphQLUpload,
    },

    Mutation: {
        async register(root, args, context) {
            try {
                await registerSchema.validate(args.input, {abortEarly: false})
            } catch (err) {
                throw err.errors
            }

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
            try {
                await loginSchema.validate(args.input, {abortEarly: false})
            } catch (err) {
                throw err.errors
            }

            const {email, password} = args.input
            const user = await User.findOne({where: {email}})
            if (!user) {
                throw new AuthenticationError('Invalid credentials')
            }
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

            if (user.role !== 1 || userId !== user.id) {
                throw new ApolloError('Cannot delete this user')
            }

            await deletedUser.destroy()
            return {
                message: 'User deleted',
            }
        },

        async uploadAvatar(_, {file}, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to upload avatar')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot upload avatar')
            }

            const currentUser = await User.findByPk(user.id)
            if (currentUser.dataValues.avatar) {
                await destroyImages(
                    extractPublicId(currentUser.dataValues.avatar),
                )
            }
            const images = await uploadImages([file])
            await User.update({avatar: images[0].url}, {
                where: {
                    id: user.id,
                },
            })
            return await User.findByPk(user.id)
        },

        async uploadWallpaper(_, {file}, {user = null}) {
            if (!user) {
                throw new AuthenticationError(
                    'You must login to upload wallpaper',
                )
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot upload wallpaper')
            }

            const currentUser = await User.findByPk(user.id)
            if (currentUser.dataValues.wallpaper) {
                await destroyImages(
                    extractPublicId(currentUser.dataValues.wallpaper),
                )
            }
            const images = await uploadImages([file])
            await User.update({wallpaper: images[0].url}, {
                where: {
                    id: user.id,
                },
            })
            return await User.findByPk(user.id)
        },
    },
}
