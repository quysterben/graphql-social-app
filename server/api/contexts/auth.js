const {User} = require('../../models')
const jwt = require('jsonwebtoken')
const {AuthenticationError, ApolloError} = require('apollo-server-express')

const verifyToken = async (token) => {
    try {
        if (!token) return null
        const {id} = jwt.verify(token, 'secret')
        const user = await User.findByPk(id)
        if (!user) throw new ApolloError('User is not exist')
        if (user.dataValues.banned === true) {
            throw new ApolloError('User banned')
        }
        return user
    } catch (error) {
        throw new AuthenticationError(error.message)
    }
}

const auth = async ({req}) => {
    const token = (req.headers && req.headers.authorization) || ''
    const user = await verifyToken(token)
    return {user}
}

module.exports = auth

