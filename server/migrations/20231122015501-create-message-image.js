'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessageImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      messageId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Messages',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      publicId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MessageImages');
  },
};
