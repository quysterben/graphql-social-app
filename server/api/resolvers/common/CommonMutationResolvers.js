const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const moment = require('moment');
const {extractPublicId} = require('cloudinary-build-url')

const {GarphQLUpload} = require('graphql-upload')
const {GraphQLError} = require('graphql')

const {uploadImages, destroyImages} = require('../../middlewares/image')
const {User} = require('../../../models');

const {
    registerSchema,
    loginSchema,
    updateUserSchema,
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
                throw new GraphQLError('User existed')
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
                throw new GraphQLError('Invalid credentials')
            }
            if (user.dataValues.banned === true) {
                throw new GraphQLError('User banned')
            }
            user.isOnline = true;
            await user.save()

            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({id: user.id, role: user.role}
                    , 'secret')
                return {...user.toJSON(), token}
            }
            throw new GraphQLError('Invalid credentials')
        },

        async logout(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }

            const logoutUser = await User.findByPk(user.id)

            if (!logoutUser) throw new GraphQLError('User is not exist')

            logoutUser.isOnline = false;
            logoutUser.save();

            return {message: 'Logout success'}
        },

        async deleteUser(root, args, {user = null}) {
            const {userId} = args.input
            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }

            const deletedUser = await User.findByPk(userId)

            if (!deletedUser) throw new GraphQLError('User is not exist')
            if (!deletedUser.dataValues.role === 1) {
                throw new GraphQLError('Cannot delete this user')
            }

            if (user.role !== 1 || userId !== user.id) {
                throw new GraphQLError('Cannot delete this user')
            }

            await deletedUser.destroy()
            return {
                message: 'User deleted',
            }
        },

        async updateUser(root, args, {user = null}) {
            try {
                await updateUserSchema.validate(args.input, {abortEarly: false})
            } catch (err) {
                throw err.errors
            }

            const {userId, name, dateOfBirth, from} = args.input

            if (!user) {
                throw new GraphQLError('You must login to use this API')
            }
            if (user.id !== userId) {
                throw new GraphQLError('Cannot update this userdata')
            }

            const date = moment(dateOfBirth, 'DD/MM/YYYY')
            if (!date.isValid()) {
                throw new GraphQLError('Date is not valid')
            }

            await User.update({
                name: name,
                dateOfBirth: dateOfBirth,
                from: from,
            }, {
                where: {
                    id: userId,
                },
            })

            const response = await User.findByPk(userId)

            return response
        },

        async uploadAvatar(_, {file}, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to upload avatar')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot upload avatar')
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
                throw new GraphQLError(
                    'You must login to upload wallpaper',
                )
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot upload wallpaper')
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
