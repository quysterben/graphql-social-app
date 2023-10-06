'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class UserReport extends Model {
        static associate(models) {
            UserReport.belongsTo(
                models.User,
                {foreignKey: 'reportUserId', as: 'usersReportUser'},
            )
            UserReport.belongsTo(
                models.User,
                {foreignKey: 'reportedUserId', as: 'reportedUsers'},
            )
        }
    }
    UserReport.init({
        reportUserId: DataTypes.INTEGER,
        reportedUserId: DataTypes.INTEGER,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'UserReport',
    })
    return UserReport
}
