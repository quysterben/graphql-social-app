'use strict';

const seeders = [
    {
        isGroup: false,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        name: 'TestChatGroup',
        isGroup: true,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Conversations', seeders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Conversations', null, {});
  },
};
