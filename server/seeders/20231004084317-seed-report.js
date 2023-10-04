'use strict';

const seeders = [
    {
        reportUserId: 3,
        reportedUserId: 4,
        type: '1',
        reason: 'user report test',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        reportUserId: 3,
        reportedPostId: 2,
        type: '2',
        reason: 'post report test',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        reportUserId: 4,
        reportedCommentId: 1,
        type: '3',
        reason: 'comment report test',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Reports', seeders, {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Reports', null, {});
    },
};
