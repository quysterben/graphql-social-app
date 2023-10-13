'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: 'Users',
                },
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts')
    },
}
