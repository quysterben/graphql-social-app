const {Post} = require('../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
  Mutation: {
    async createComment(_, {content, postId, parentId = 0}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to create a comment')
      } else if (user.role !== 2) {
        throw new ApolloError('You cannot comment into this post')
      }

      const post = await Post.findByPk(postId)

      if (post) {
        return post.createComment({
          content,
          userId: user.id,
          parentId,
        })
      }
      throw new ApolloError('Unable to create a comment')
    },
  },

  Comment: {
    author(comment) {
      return comment.getAuthor()
    },
    post(comment) {
      return comment.getPost()
    },
  },
}
