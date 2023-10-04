'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        static associate(models) {
            Report.belongsTo(
                models.User,
                {foreignKey: 'reportUserId', as: 'reportUser'},
            )
            Report.hasOne(
                models.User,
                {foreignKey: 'reportedUserId', as: 'reportedUser'},
            )
            Report.hasOne(
                models.Post,
                {foreignKey: 'reportedPostId', as: 'reportedPost'},
            )
            Report.hasOne(
                models.Comment,
                {foreignKey: 'reportedCommentId', as: 'reportedComment'},
            )
        }
    }
    Report.init({
        reportUserId: DataTypes.INTEGER,
        reportedUserId: DataTypes.INTEGER,
        reportedPostId: DataTypes.INTEGER,
        reportedCommentId: DataTypes.INTEGER,
        reason: DataTypes.STRING,
        // eslint-disable-next-line new-cap
        type: DataTypes.ENUM(1, 2, 3),
    }, {
        sequelize,
        modelName: 'Report',
    })
    return Report
}
