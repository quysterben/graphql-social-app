'use strict';
const {
    Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PostImage extends Model {
        static associate(models) {
            PostImage.belongsTo(models.Post, {foreignKey: 'postId', as: 'post'})
        }
    }
    PostImage.init({
        imageUrl: DataTypes.STRING,
        postId: DataTypes.INTEGER,
        publicId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'PostImage',
    });
    return PostImage;
};
