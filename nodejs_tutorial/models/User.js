'use strict'

const bcrypt = require('bcryptjs')

const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {foreignKey: 'userId', as: 'posts'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  }, {
    defaultScope: {
      rawAttributes: {exclude: ['password']},
    },
  })
  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash()
  })
  User.prototype.generatePasswordHash = function() {
    if (this.password) {
      return bcrypt.hash(this.password, 10)
    }
  }
  return User
}
