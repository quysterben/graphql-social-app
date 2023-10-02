'use strict';

const seeders = [{
  postId: 1,
  userId: 3,
  createdAt: new Date('2022-12-21T01:00:00.000Z'),
  updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
  postId: 2,
  userId: 3,
  createdAt: new Date('2022-12-21T01:00:00.000Z'),
  updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
  postId: 3,
  userId: 3,
  createdAt: new Date('2022-12-21T01:00:00.000Z'),
  updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}, {
  postId: 2,
  userId: 4,
  createdAt: new Date('2022-12-21T01:00:00.000Z'),
  updatedAt: new Date('2022-12-21T01:00:00.000Z'),
}]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Likes', seeders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Likes', null, {});
  },
};
