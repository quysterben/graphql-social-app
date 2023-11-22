'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageImage extends Model {
    static associate(models) {
      // define association here
      MessageImage.belongsTo(
        models.Message,
        {
            foreignKey: 'messageId',
            as: 'message',
        },
      )
    }
  }
  MessageImage.init({
    imageUrl: DataTypes.STRING,
    messageId: DataTypes.STRING,
    publicId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'MessageImage',
  });
  return MessageImage;
}
