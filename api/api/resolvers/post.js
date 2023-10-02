const {Post} = require('../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
  Mutation: {
    async createPost(_, {content, title}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot create post')
      }
      return await Post.create({
        userId: user.id,
        content,
        title,
      })
    },
  },

  Query: {
    async getAllPosts(root, args, context) {
      const posts = await Post.findAll()
      return posts
    },
    async getSinglePost(_, {postId}, context) {
      return await Post.findByPk(postId)
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
