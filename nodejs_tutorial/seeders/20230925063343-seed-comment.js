'use strict'

const seeders = [{
  postId: 1,
  content: 'test cmt1',
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  content: 'test cmt2',
  postId: 2,
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  content: 'test cmt3',
  postId: 3,
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  content: 'test cmt4',
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
