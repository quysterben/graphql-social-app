'use strict'

const bcrypt = require('bcryptjs')

const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Post, {foreignKey: 'userId', as: 'posts'})

            User.hasMany(models.Comment, {foreignKey: 'userId', as: 'comments'})

            User.hasMany(
                models.Friendship,
                {foreignKey: 'user1Id', as: 'friends1'},
            )
            User.hasMany(
                models.Friendship,
                {foreignKey: 'user2Id', as: 'friends2'},
            )

            User.hasMany(
                models.UserReport,
                {foreignKey: 'reportUserId', as: 'usersReportsUser'},
            )
            User.hasMany(
                models.UserReport,
                {foreignKey: 'reportedUserId', as: 'reportedUsers'},
            )

            User.hasMany(
                models.PostReport,
                {foreignKey: 'reportUserId', as: 'usersReportPost'},
            )

            User.hasMany(
                models.CommentReport,
                {foreignKey: 'reportUserId', as: 'usersReportComment'},
            )
        }
    }
    User.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        role: DataTypes.INTEGER,
        dateOfBirth: DataTypes.STRING,
        from: DataTypes.STRING,
        password: DataTypes.STRING,
        avatar: DataTypes.STRING,
        wallpaper: DataTypes.STRING,
        banned: DataTypes.BOOLEAN,
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
