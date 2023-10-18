'use strict'

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', [{
                name: 'Admin1',
                email: 'admin1@test.com',
                role: 1,
                password: await bcrypt.hash('12345678', 10),
                createdAt: new Date('2022-12-21T01:00:00.000Z'),
                updatedAt: new Date('2022-12-21T01:00:00.000Z'),
            }, {
                name: 'Admin2',
                email: 'admin2@test.com',
                role: 1,
                password: await bcrypt.hash('12345678', 10),
                createdAt: new Date('2022-12-21T01:00:00.000Z'),
                updatedAt: new Date('2022-12-21T01:00:00.000Z'),
            }, {
                name: 'User1',
                email: 'user1@test.com',
                role: 2,
                password: await bcrypt.hash('12345678', 10),
                dateOfBirth: '17/10/2002',
                from: 'Ha Noi',
                createdAt: new Date('2022-12-21T01:00:00.000Z'),
                updatedAt: new Date('2022-12-21T01:00:00.000Z'),
            }, {
                name: 'User2',
                email: 'user2@test.com',
                role: 2,
                password: await bcrypt.hash('12345678', 10),
                dateOfBirth: '12/8/2002',
                from: 'HCM',
                createdAt: new Date('2022-12-21T01:00:00.000Z'),
                updatedAt: new Date('2022-12-21T01:00:00.000Z'),
            }, {
                name: 'User3',
                email: 'user3@test.com',
                role: 2,
                dateOfBirth: '10/5/2002',
                from: 'USA',
                password: await bcrypt.hash('12345678', 10),
                createdAt: new Date('2022-12-21T01:00:00.000Z'),
                updatedAt: new Date('2022-12-21T01:00:00.000Z'),
            }, {
                name: 'User4',
                email: 'user4@test.com',
                role: 2,
                password: await bcrypt.hash('12345678', 10),
                createdAt: new Date('2022-12-21T01:00:00.000Z'),
                updatedAt: new Date('2022-12-21T01:00:00.000Z'),
            }], {})
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', null, {})
    },
}
