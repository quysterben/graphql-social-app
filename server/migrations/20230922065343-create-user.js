'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dateOfBirth: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            from: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            wallpaper: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            role: {
                type: Sequelize.INTEGER,
                defaultValue: 2,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            banned: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            isOnline: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users')
    },
}
