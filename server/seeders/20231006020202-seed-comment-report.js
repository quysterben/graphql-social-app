'use strict';

const seeders = [
    {
        reportUserId: 4,
        reportedCommentId: 1,
        description: 'test report comment',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        reportUserId: 3,
        reportedCommentId: 4,
        description: 'test report comment',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('CommentReports', seeders, {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('CommentReports', null, {})
    },
};
