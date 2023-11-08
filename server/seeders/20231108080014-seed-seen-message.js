'use strict';

const seeders = [
    {
        messageId: 1,
        userId: 4,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        messageId: 2,
        userId: 3,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SeenMessages', seeders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SeenMessages', null, {});
  },
};
