const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {AuthenticationError} = require('apollo-server-express')

const {User} = require('../../models')

module.exports = {
  Mutation: {
    async register(root, args, context) {
      const {name, email, password} = args.input
      const user = await User.findOne({where: {email}})
      if (user) {
        throw new Error('User existed')
      }
      return User.create({name, email, password})
    },

    async login(root, {input}, context) {
      const {email, password} = input
      const user = await User.findOne({where: {email}})
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({id: user.id, role: user.role}, 'mySecret')
        return {...user.toJSON(), token}
      }
      throw new AuthenticationError('Invalid credentials')
    },
  },
};
