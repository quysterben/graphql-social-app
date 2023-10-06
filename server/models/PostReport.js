'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class PostReport extends Model {
        static associate(models) {
            PostReport.belongsTo(
                models.User,
                {foreignKey: 'reportUserId', as: 'usersReportPost'},
            )
            PostReport.belongsTo(
                models.Post,
                {foreignKey: 'reportedPostId', as: 'reportedPosts'},
            )
        }
    }
    PostReport.init({
        reportUserId: DataTypes.INTEGER,
        reportedPostId: DataTypes.INTEGER,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'PostReport',
    })
    return PostReport
}
