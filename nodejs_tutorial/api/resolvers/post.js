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
      return Post.create({
        userId: user.id,
        content,
        title,
      })
    },
  },

  Query: {
    async getAllPosts(root, args, context) {
      return Post.findAll()
    },
    async getSinglePost(_, {postId}, context) {
      return Post.findByPk(postId)
    },
  },

  Post: {
    author(post) {
      return post.getAuthor()
    },

    comments(post) {
      return post.getComments()
    },

    likes(post) {
      return post.getLikes()
    },

    images(post) {
      return post.getImages()
    },
  },
}
