'use strict';

const seeders = [
    {
        user1Id: 3,
        user2Id: 4,
        status: 2,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    }, {
        user1Id: 4,
        user2Id: 5,
        status: 1,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    }, {
        user1Id: 6,
        user2Id: 3,
        status: 1,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    ]

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Friendships', seeders, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Friendships', null, {});
    },
};
