'use strict';

const seeders = [
  {
    imageUrl: 'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1696231419/res/images/h1x099lbffa3jpapulwj.jpg',
    postId: 1,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
  },
  {
    imageUrl: 'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1696231418/res/images/e13p4s8kqqk3tqqz4vd1.webp',
    postId: 1,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
  },
  {
    imageUrl: 'https://res.cloudinary.com/dp9bf5rvm/image/upload/v1696231418/res/images/xf1gbv5j6uboowger8gj.jpg',
    postId: 2,
    createdAt: new Date('2022-12-21T01:00:00.000Z'),
    updatedAt: new Date('2022-12-21T01:00:00.000Z'),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Images', seeders, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {})
  },
};
