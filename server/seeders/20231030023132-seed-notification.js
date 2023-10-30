'use strict';

const seeders = [
    {
        userToNotify: 4,
        userWhoTriggered: 3,
        eventType: 'post',
        objectId: 1,
        seenByUser: false,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        userToNotify: 3,
        userWhoTriggered: 4,
        eventType: 'post',
        objectId: 1,
        seenByUser: true,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        userToNotify: 4,
        userWhoTriggered: 3,
        eventType: 'like',
        objectId: 2,
        seenByUser: true,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
    {
        userToNotify: 4,
        userWhoTriggered: 3,
        eventType: 'comment',
        objectId: 2,
        seenByUser: false,
        createdAt: new Date('2022-12-21T01:00:00.000Z'),
        updatedAt: new Date('2022-12-21T01:00:00.000Z'),
    },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notifications', seeders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  },
};
