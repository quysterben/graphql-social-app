const {Post, Like} = require('../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
    Mutation: {
        async likePost(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError(
                    'You must login to like this post',
                )
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot like this post')
            }
            const {postId} = args.input
            const like = await Like.findOne({
                where: {
                    postId: postId,
                    userId: user.id,
                },
            })

            if (like) {
                await like.destroy()
                return null
            }

            const post = await Post.findByPk(postId)
            if (post) {
                return post.createLike({
                    userId: user.id,
                    postId,
                })
            }
            throw new ApolloError('Unable to like this post')
        },
    },
}
