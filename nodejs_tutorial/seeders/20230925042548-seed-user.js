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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Admin2',
      email: 'admin2@test.com',
      role: 1,
      password: await bcrypt.hash('12345678', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'User1',
      email: 'user1@test.com',
      role: 2,
      password: await bcrypt.hash('12345678', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'User2',
      email: 'user2@test.com',
      role: 2,
      password: await bcrypt.hash('12345678', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'User3',
      email: 'user3@test.com',
      role: 2,
      password: await bcrypt.hash('12345678', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'User4',
      email: 'user4@test.com',
      role: 2,
      password: await bcrypt.hash('12345678', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
  },
}
