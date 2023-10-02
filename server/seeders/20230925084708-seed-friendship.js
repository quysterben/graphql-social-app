'use strict';

const seeders = [
  {
    user1_id: 3,
    user2_id: 4,
    status: 2,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
  }, {
    user1_id: 4,
    user2_id: 5,
    status: 1,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
  }, {
    user1_id: 6,
    user2_id: 3,
    status: 1,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Friendships', seeders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Friendships', null, {});
  },
};
