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
        // eslint-disable-next-line new-cap
        status: DataTypes.ENUM('pending', 'friend', 'block'),
    }, {
        sequelize,
        modelName: 'Friendship',
    })
    return Friendship
}
