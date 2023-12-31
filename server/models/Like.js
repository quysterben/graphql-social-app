'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            Like.belongsTo(models.User, {foreignKey: 'userId', as: 'user'})
            Like.belongsTo(models.Post, {foreignKey: 'postId', as: 'post'})
        }
    }
    Like.init({
        postId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Like',
    })
    return Like
}
