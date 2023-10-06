const {Op} = require('sequelize')
const {Post, Comment} = require('../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
    Mutation: {
        async createComment(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError(
                    'You must login to create a comment',
                )
            } else if (user.role !== 2) {
                throw new ApolloError('You cannot comment into this post')
            }
            const {content, postId, parentId = 0} = args.input
            if (parentId !== 0) {
                const parentCmt = await Comment.findByPk(parentId)
                if (!parentCmt) {
                    throw new ApolloError('Comment is not exist')
                }
                if (parentCmt.dataValues.parentId !== 0) {
                    throw new ApolloError('You cannot reply this comment')
                }
            }
            const post = await Post.findByPk(postId)
            if (post) {
                const result = await post.createComment({
                    content,
                    userId: user.id,
                    parentId,
                })
                return result
            } else {
                throw new ApolloError('Post is not exist')
            }
        },

        async deleteComment(_, args, {user = null}) {
            const {commentId} = args.input

            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }

            const deletedComment = await Comment.findByPk(commentId)
            if (!deletedComment) throw new ApolloError('Comment is not exist')

            if (
                user.role === 1 ||
                deletedComment.dataValues.userId === user.id
            ) {
                await Comment.destroy({
                    where: {
                        [Op.or]: [
                            {
                                id: commentId,
                            }, {
                                parentId: commentId,
                            },
                        ],
                    },
                })
                return {
                    message: 'Comment deleted',
                }
            } else {
                throw new ApolloError('Cannot delete this comment')
            }
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
