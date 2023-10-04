const {AuthenticationError, ApolloError} = require('apollo-server-express')
const {GarphQLUpload} = require('graphql-upload')

const {uploadImages} = require('../middlewares/image')

const {Image, Post} = require('../../models')

module.exports = {
    Upload: {GarphQLUpload},
    Mutation: {
        async uploadImages(_, {files, postId}, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to create a post')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot create post')
            }

            const post = await Post.findByPk(postId)
            if (!post) {
                throw new ApolloError('Post is not existed')
            } else if (post.dataValues.userId !== user.id) {
                throw new ApolloError('Not your post')
            }

            const imageUrls = await uploadImages(files)

            imageUrls.map(async (url) => {
                await Image.create({
                    postId: postId,
                    imageUrl: url,
                })
            })

            return {
                message: 'upload success',
            }
        },
    },
}
