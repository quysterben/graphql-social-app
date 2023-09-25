'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comments', [{
      content: 'This is test comment',
      userId: 3,
      postId: 1,
      parentId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      content: 'This is test comment1',
      userId: 3,
      postId: 1,
      parentId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      content: 'This is test comment2',
      userId: 3,
      postId: 1,
      parentId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      content: 'This is test comment',
      userId: 4,
      postId: 2,
      parentId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      content: 'This is test comment',
      userId: 3,
      postId: 1,
      parentId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {})
  },
}
