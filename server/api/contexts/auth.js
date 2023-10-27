const {User} = require('../../models')
const jwt = require('jsonwebtoken')
const {GraphQLError} = require('graphql')

const {PubSub} = require('graphql-subscriptions')
const pubsub = new PubSub()

const verifyToken = async (token) => {
    try {
        if (!token) return null
        const {id} = jwt.verify(token, 'secret')
        const user = await User.findByPk(id)
        if (!user) throw new GraphQLError('User not found')
        if (user.dataValues.banned === true) {
            throw new GraphQLError('User banned')
        }
        return user
    } catch (error) {
        throw new GraphQLError(error.message)
    }
}

const socketAuth = async (ctx) => {
    if (ctx.connectionParams.Authorization) {
        const token = ctx.connectionParams.Authorization
        const user = await verifyToken(token);
        return {user, pubsub}
    }
    return {user: null, pubsub}
}

const auth = async ({req}) => {
    const token = (req.headers && req.headers.authorization) || ''
    const user = await verifyToken(token)
    return {user, pubsub}
}

module.exports = {auth, socketAuth}

