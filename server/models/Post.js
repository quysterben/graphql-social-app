'use strict'
const {
    Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, {foreignKey: 'userId', as: 'author'})
            Post.hasMany(models.Comment, {foreignKey: 'postId', as: 'comments'})
            Post.hasMany(models.Like, {foreignKey: 'postId', as: 'likes'})
            Post.hasMany(models.PostImage, {foreignKey: 'postId', as: 'images'})
            Post.hasMany(
                models.PostReport,
                {foreignKey: 'reportedPostId', as: 'reportedPosts'},
            )
        }
    }
    Post.init({
        content: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Post',
    })
    return Post
}
