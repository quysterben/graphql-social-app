'use strict'

const seeders = [{
  title: 'Test1',
  content: 'This is test post',
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  title: 'Test2',
  content: 'This is test post',
  userId: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  title: 'Test3',
  content: 'This is test post',
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
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
