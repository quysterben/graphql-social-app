'use strict';

const seeders = [
    {
        conversationId: 1,
        userId: 3,
        content: 'Hello World!',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        conversationId: 1,
        userId: 4,
        content: 'Hi there!',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        conversationId: 2,
        userId: 3,
        content: 'Hello World!',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        conversationId: 2,
        userId: 4,
        content: 'Hi there!',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        conversationId: 2,
        userId: 5,
        content: 'Hello World!',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        conversationId: 2,
        userId: 6,
        content: 'Hi there!',
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Messages', seeders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  },
};
