'use strict'

const seeders = [{
  postId: 1,
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  postId: 2,
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  postId: 3,
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  postId: 2,
  userId: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
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
