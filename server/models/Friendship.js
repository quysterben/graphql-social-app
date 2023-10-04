/* eslint-disable new-cap */
'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Friendship extends Model {
        static associate(models) {
        Friendship.belongsTo(models.User,
            {foreignKey: 'user1Id', as: 'friends1'})
        Friendship.belongsTo(models.User,
            {foreignKey: 'user2Id', as: 'friends2'})
        }
    }
    Friendship.init({
        user1Id: DataTypes.INTEGER,
        user2Id: DataTypes.INTEGER,
        status: DataTypes.ENUM(1, 2, 3),
    }, {
        sequelize,
        modelName: 'Friendship',
    })
    return Friendship
}
