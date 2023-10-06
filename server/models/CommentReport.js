'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class CommentReport extends Model {
        static associate(models) {
            CommentReport.belongsTo(
                models.User,
                {foreignKey: 'reportUserId', as: 'usersReportComment'},
            )
            CommentReport.belongsTo(
                models.Comment,
                {foreignKey: 'reportedCommentId', as: 'reportedComments'},
            )
        }
    }
    CommentReport.init({
        reportUserId: DataTypes.INTEGER,
        reportedCommentId: DataTypes.INTEGER,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'CommentReport',
    })
    return CommentReport
}
