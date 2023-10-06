'use strict';

const seeders = [
    {
        reportUserId: 3,
        reportedPostId: 1,
        description: 'test report post',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        reportUserId: 4,
        reportedPostId: 2,
        description: 'test report post',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('PostReports', seeders, {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('PostReports', null, {})
    },
};
