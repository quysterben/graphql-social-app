'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Friendships', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        user1Id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: 'Users',
                },
                key: 'id',
            },
        },
        user2Id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: 'Users',
                },
                key: 'id',
            },
        },
        status: {
            allowNull: false,
            // eslint-disable-next-line new-cap
            type: Sequelize.ENUM(1, 2, 3),
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Friendships');
    },
};
