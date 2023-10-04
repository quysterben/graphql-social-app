'use strict';
const {
    Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate(models) {
            Image.belongsTo(models.Post, {foreignKey: 'postId', as: 'post'})
        }
    }
    Image.init({
        imageUrl: DataTypes.STRING,
        postId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Image',
    });
    return Image;
};
