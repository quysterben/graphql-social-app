const {AuthenticationError, ApolloError} = require('apollo-server-express')
const {GarphQLUpload} = require('graphql-upload')

const {uploadImages, destroyImages} = require('../middlewares/image')

const {Image, Post, User} = require('../../models')

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

            const images = await uploadImages(files)

            images.map(async (image) => {
                await Image.create({
                    postId: postId,
                    imageUrl: image.url,
                    publicId: image.public_id,
                })
            })

            return {
                message: 'upload success',
            }
        },
        async uploadAvatar(_, {file}, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to upload avatar')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot upload avatar')
            }

            const currentUser = await User.findByPk(user.id)
            if (currentUser.dataValues.avatar) {
                await destroyImages(currentUser.dataValues.avatar)
            }
            const images = await uploadImages([file])
            await User.update({avatar: images[0].public_id}, {
                where: {
                    id: user.id,
                },
            })
            return await User.findByPk(user.id)
        },
        async uploadWallpaper(_, {file}, {user = null}) {
            if (!user) {
                throw new AuthenticationError(
                    'You must login to upload wallpaper',
                )
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot upload wallpaper')
            }

            const currentUser = await User.findByPk(user.id)
            if (currentUser.dataValues.wallpaper) {
                await destroyImages(currentUser.dataValues.wallpaper)
            }
            const images = await uploadImages([file])
            await User.update({wallpaper: images[0].public_id}, {
                where: {
                    id: user.id,
                },
            })
            return await User.findByPk(user.id)
        },
    },
}
