'use strict'

const seeders = [{
    content: 'test cmt1',
    postId: 1,
    parentId: 0,
    userId: 3,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
    content: 'test cmt2',
    postId: 2,
    parentId: 0,
    userId: 3,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
    content: 'test cmt3',
    postId: 3,
    userId: 3,
    parentId: 0,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
    content: 'test cmt4',
    postId: 2,
    userId: 4,
    parentId: 2,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Comments', seeders, {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Comments', null, {})
    },
}
