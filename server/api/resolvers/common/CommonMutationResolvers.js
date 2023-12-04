const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const moment = require('moment')

const {extractPublicId} = require('cloudinary-build-url')

const nodemailer = require('nodemailer')
const {OAuth2Client} = require('google-auth-library');

const {GarphQLUpload} = require('graphql-upload')
const {GraphQLError} = require('graphql')

const {User} = require('../../../models')

const {
    registerSchema,
    loginSchema,
    updateUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require('../../validation/auth.validation')

const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')
const {uploadImages, destroyImages} = require('../../middlewares/image')

const ErrorMessageConstants = require('../../constants/ErrorMessageConstants')
const MessageConstants = require('../../constants/MessageConstants')

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
            if (user) throw new GraphQLError(ErrorMessageConstants.UserExisted)

            return await User.create({
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
                throw new GraphQLError(ErrorMessageConstants.InvalidCredentials)
            }
            console.log(user.banned);
            if (user.banned === true) {
                throw new GraphQLError('User banned')
            }

            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({id: user.id, role: user.role}
                    , 'secret')
                return {...user.toJSON(), token}
            }
            throw new GraphQLError(ErrorMessageConstants.InvalidCredentials)
        },
        async logout(root, args, {user = null}) {
            isAuth(user)

            const logoutUser = await User.findByPk(user.id)
            if (!logoutUser) {
                throw new GraphQLError(ErrorMessageConstants.UserNotExist)
            }

            logoutUser.isOnline = false
            logoutUser.save()
            return {
                message: MessageConstants.Logout,
            }
        },
        async forgotPassword(root, args, context) {
            try {
                await forgotPasswordSchema.validate(
                    args,
                    {abortEarly: false},
                )
            } catch (err) {
                throw err.errors
            }
            const user = await User.findOne({where: {email: args.email}})
            if (!user) {
                throw new GraphQLError(ErrorMessageConstants.UserNotExist)
            }

            try {
                const oauth2client = new OAuth2Client(
                    process.env.GOOGLE_MAILER_CLIENT_ID,
                    process.env.GOOGLE_MAILER_CLIENT_SECRET,
                )
                oauth2client.setCredentials({
                    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                })

                const accessToken = await oauth2client.getAccessToken()

                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.ADMIN_EMAIL_ADDRESS,
                        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                        accessToken: accessToken.token,
                    },
                })

                const resetPwToken = jwt.sign({email: args.email}
                    , 'secret-mail')

                const resetPwURL = process.env.BASE_URL +
                    process.env.CLIENT_PORT + '/reset-password/' + resetPwToken

                const mailOptions = {
                    to: args.email,
                    subject: 'Social Application - Reset Password',
                    html: `
                        <h2>Hello ${user.dataValues.name},</h2>
                        <p styles>
                            You are receiving this email because you 
                            (or someone else) have requested 
                            the reset of the password for your account.
                        </p>
                        <p>Click this link to reset your password.</p>
                        <a 
                        href="${resetPwURL}">
                            Reset Password
                        </a>
                        <p>Thank you !</p>
                    `,
                }
                await transport.sendMail(mailOptions)
                return {message: MessageConstants.EmailSent}
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        },
        async resetPassword(root, args, context) {
            try {
                await resetPasswordSchema.validate(
                    args.input,
                    {abortEarly: false},
                )
            } catch (err) {
                throw err.errors
            }

            try {
                const {email} = jwt.verify(args.input.token, 'secret-mail')

                const newPasswordHash =
                    await bcrypt.hash(args.input.password, 10)
                await User.update(
                    {password: newPasswordHash},
                    {where: {email}},
                )

                return {message: MessageConstants.PasswordReset}
            } catch {
                throw new GraphQLError(ErrorMessageConstants.TokenIsInvalid)
            }
        },
        async deleteUser(root, args, {user = null}) {
            isAuth(user)

            const {userId} = args.input
            const deletedUser = await User.findByPk(userId)

            if (!deletedUser) {
                throw new GraphQLError(ErrorMessageConstants.UserNotExist)
            }
            if (!deletedUser.role === 'user' ||
                !deletedUser.role === 'admin' ||
                !deletedUser.role === 'mod') {
                throw new GraphQLError(ErrorMessageConstants.ActionFailed)
            }

            await deletedUser.destroy()
            return {
                message: MessageConstants.UserDeleted,
            }
        },
        async updateUser(root, args, {user = null}) {
            isAuth(user)

            try {
                await updateUserSchema.validate(args.input, {abortEarly: false})
            } catch (err) {
                throw err.errors
            }

            const {userId, name, dateOfBirth, from} = args.input

            if (user.id !== userId) {
                throw new GraphQLError(ErrorMessageConstants.ActionFailed)
            }

            const date = moment(new Date(dateOfBirth), 'YYYY-MM-DD')
            if (!date.isValid()) {
                throw new GraphQLError(MessageConstants.DateInputInvalid)
            }

            user.name = name
            user.dateOfBirth = dateOfBirth
            user.from = from
            await user.save()

            return user
        },
        async uploadAvatar(_, {file}, {user = null}) {
            isAuth(user)
            isUser(user)

            if (user.avatar) {
                await destroyImages(
                    extractPublicId(user.dataValues.avatar),
                )
            }
            const images = await uploadImages([file])
            user.avatar = images[0].url
            await user.save()
            return user
        },
        async uploadWallpaper(_, {file}, {user = null}) {
            isAuth(user)
            isUser(user)

            if (user.dataValues.wallpaper) {
                await destroyImages(
                    extractPublicId(user.dataValues.wallpaper),
                )
            }
            const images = await uploadImages([file])
            user.wallpaper = images[0].url
            user.save()
            return user
        },
    },
}
