'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserReports', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                reportUserId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'Users',
                        },
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                },
                reportedUserId: {
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
                description: {
                    allowNull: false,
                    type: Sequelize.STRING,
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
        await queryInterface.dropTable('UserReports')
    },
}
