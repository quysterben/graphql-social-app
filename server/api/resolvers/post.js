const {Post} = require('../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
    Mutation: {
        async createPost(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to create a post')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot create post')
            }

            const {title, content} = args.input

            return await Post.create({
                userId: user.id,
                content,
                title,
            })
        },
        async deletePost(_, args, {user = null}) {
            const {postId} = args.input

            if (!user) {
                throw new AuthenticationError('You must login to create a post')
            }

            const deletedPost = await Post.findByPk(postId)

            if (!deletedPost) throw new ApolloError('Post is not exist')

            if (user.role === 1 || deletedPost.dataValues.userId === user.id) {
                await deletedPost.destroy()
                return {
                    message: 'Post deleted',
                }
            } else {
                throw new ApolloError('Cannot delete this post')
            }
        },
    },

    Query: {
        async getAllPosts(root, args, context) {
            const posts = await Post.findAll()
            return posts
        },
        async getSinglePost(_, args, context) {
            const {postId} = args.input
            const post = await Post.findByPk(postId)
            if (!post) {
                throw new ApolloError('Post is not exist')
            }
            return post
        },
    },

    Post: {
        async author(post) {
            return await post.getAuthor()
        },
        async comments(post) {
            return await post.getComments()
        },
        async likes(post) {
            return await post.getLikes()
        },
        async images(post) {
            return await post.getImages()
        },
    },
}
