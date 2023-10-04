'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            reportUserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Users',
                    },
                    key: 'id',
                },
                allowNull: false,
            },
            reportedUserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Users',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
            reportedPostId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Posts',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
            reportedCommentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Comments',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
            type: {
                // eslint-disable-next-line new-cap
                type: Sequelize.ENUM(1, 2, 3),
                allowNull: false,
            },
            reason: {
                type: Sequelize.STRING,
                allowNull: false,
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
        await queryInterface.dropTable('Reports')
    },
}
