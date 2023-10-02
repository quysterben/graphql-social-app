const {User} = require('../../models')
const jwt = require('jsonwebtoken')
const {AuthenticationError} = require('apollo-server-express')

const verifyToken = async (token) => {
  try {
    if (!token) return null
    const {id} = jwt.verify(token, 'secret')
    const user = await User.findByPk(id)
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

