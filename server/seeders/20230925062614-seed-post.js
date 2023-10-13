'use strict'

const seeders = [{
    content: 'This is test post',
    userId: 3,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
    content: 'This is test post',
    userId: 4,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
    content: 'This is test post',
    userId: 3,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Posts', seeders, {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Posts', null, {})
    },
}
