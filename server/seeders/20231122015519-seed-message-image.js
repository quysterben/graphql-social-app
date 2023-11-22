'use strict';

// const seeders = []

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.bulkInsert('MessageImages', seeders, {})
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('MessageImages', null, {})
    },
}
