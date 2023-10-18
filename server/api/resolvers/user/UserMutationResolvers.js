const {Op} = require('sequelize')
const {
    Image,
    Post,
    Comment,
    Friendship,
    User,
    Like,
    UserReport,
    PostReport,
    CommentReport,
} = require('../../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')
const {GarphQLUpload} = require('graphql-upload')
const {uploadImages} = require('../../middlewares/image')


const postSchema = require('../../validation/post.validation')
const commentSchema = require('../../validation/comment.validation')
const reportSchema = require('../../validation/report.validation')

module.exports = {
    Upload: {
        GarphQLUpload,
    },

    Mutation: {
        async createPost(_, args, {user = null}) {
            try {
                await postSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to create a post')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot create post')
            }

            const {content} = args.input

            return await Post.create({
                userId: user.id,
                content,
            })
        },
        async deletePost(_, args, {user = null}) {
            const {postId} = args.input

            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }

            const deletedPost = await Post.findByPk(postId)

            if (!deletedPost) throw new ApolloError('Post is not exist')

            if (user.role === 1 || deletedPost.dataValues.userId === user.id) {
                throw new ApolloError('Cannot delete this post')
            }

            await deletedPost.destroy()
            return {
                message: 'Post deleted',
            }
        },
        async editPost(_, args, {user = null}) {
            try {
                await postSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            const {postId, content} = args.input

            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }

            const post = await Post.findByPk(postId)
            if (!post) throw new ApolloError('Post is not exist')
            if (post.dataValues.userId !== user.id) {
                throw new ApolloError('Cannot edit this post')
            }

            await Post.update(
                {
                 content: content,
                }, {
                    where: {
                        id: postId,
                    },
                },
            )
            return await Post.findByPk(postId)
        },
        async uploadPostImages(_, {files, postId}, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to create a post')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot create post')
            }

            const post = await Post.findByPk(postId)
            if (!post) {
                throw new ApolloError('Post is not existed')
            }
            if (post.dataValues.userId !== user.id) {
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
        async createComment(_, args, {user = null}) {
            try {
                await commentSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError(
                    'You must login to create a comment',
                )
            }
            if (user.role !== 2) {
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
            if (!post) throw new ApolloError('Post is not exist')
            const result = await post.createComment({
                content,
                userId: user.id,
                parentId,
            })
            return result
        },
        async deleteComment(_, args, {user = null}) {
            const {commentId} = args.input

            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }

            const deletedComment = await Comment.findByPk(commentId)
            if (!deletedComment) throw new ApolloError('Comment is not exist')

            if (
                user.role !== 1 ||
                deletedComment.dataValues.userId !== user.id
            ) throw new ApolloError('Cannot delete this comment')

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
        },
        async editComment(_, args, {user = null}) {
            try {
                await commentSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }


            const {commentId, content} = args.input
            const comment = await Comment.findByPk(commentId)
            if (!comment) throw new ApolloError('Comment is not exist')
            if (comment.dataValues.userId !== user.id) {
                throw new ApolloError('Cannot edit this comment')
            }

            await Comment.update(
                {content: content}, {
                    where: {
                        id: commentId,
                    },
                },
            )
            return await Comment.findByPk(commentId)
        },
        async sendFriendRequest(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) {
                throw new ApolloError('User is not exist')
            }
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                throw new ApolloError('You cannot send friend request')
            }
            const friendship = await Friendship.findOne({
                where: {
                [Op.or]: [
                    {
                    user1Id: user.id,
                    user2Id: userId,
                    }, {
                    user1Id: userId,
                    user2Id: user.id,
                    },
                ],
                },
            })
            if (friendship) {
                throw new ApolloError('You cannot send friend request')
            }

            return await Friendship.create({
                user1Id: user.id,
                user2Id: userId,
                status: 1,
            })
        },
        async acceptFriendRequest(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {friendshipId} = args.input
            const friendship = await Friendship.findByPk(friendshipId)
            if (!friendship) {
                throw new ApolloError('Friend request is not exist')
            }
            if (
                friendship.dataValues.user2Id !== user.id &&
                friendship.dataValues.status !== '1'
            ) throw new ApolloError('You cannot accept this friend request')

            await Friendship.update({status: 2}, {
                where: {
                    id: friendshipId,
                    user2Id: user.id,
                    status: 1,
                },
            })
            return {
                message: 'Friend request accepted',
            }
        },
        async unFriend(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) {
                throw new ApolloError('User is not exist')
            }
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                throw new ApolloError('User cannot be unfiend')
            }
            const friendship = await Friendship.findOne({
                where: {
                    status: 2,
                    [Op.or]: [
                        {
                        user1Id: user.id,
                        user2Id: userId,
                        }, {
                        user1Id: userId,
                        user2Id: user.id,
                        },
                    ],
                },
            })
            if (!friendship) throw new ApolloError('Friendship is not exist')
            await friendship.destroy()
            return {
                message: 'Unfriend user success',
            }
        },
        async declinedFriendRequest(_, args, {user=null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {friendshipId} = args.input
            const friendship = await Friendship.findByPk(friendshipId)
            if (!friendship) {
                throw new ApolloError('Friend request is not exist')
            }
            if (friendship.dataValues.user2Id !== user.id &&
                friendship.dataValues.user1Id !== user.id
            ) {
                throw new ApolloError('You cannot decline this request')
            }
            if (friendship.dataValues.status != 1) {
                throw new ApolloError('You cannot decline this request')
            }
            await friendship.destroy()
            return {
                message: 'Declined request success',
            }
        },
        async reportUser(_, args, {user = null}) {
            try {
                await reportSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 2) {
                throw new ApolloError('You is not User')
            }

            const {reportedUserId, description} = args.input

            if (reportedUserId === user.id) {
                throw new ApolloError('Cannot report yourself')
            }

            const reportedUser = await User.findByPk(reportedUserId)

            if (!reportedUser) throw new ApolloError('User is not exist')
            if (reportedUser.dataValues.role === 1) {
                throw new ApolloError('Cannot report this user')
            }

            return await UserReport.create({
                reportUserId: user.id,
                reportedUserId: reportedUserId,
                description: description,
            })
        },
        async reportPost(_, args, {user = null}) {
            try {
                await reportSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 2) {
                throw new ApolloError('You is not User')
            }

            const {reportedPostId, description} = args.input

            const reportedPost = await Post.findByPk(reportedPostId)

            if (!reportedPost) throw new ApolloError('Post is not exist')
            if (reportedPost.dataValues.userId === user.id) {
                throw new ApolloError('Cannot report your post')
            }

            return await PostReport.create({
                reportUserId: user.id,
                reportedPostId: reportedPostId,
                description: description,
            })
        },
        async reportComment(_, args, {user = null}) {
            try {
                await reportSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            if (!user) {
                throw new AuthenticationError('You must login to use this API')
            }
            if (user.role !== 2) {
                throw new ApolloError('You is not User')
            }

            const {reportedCommentId, description} = args.input

            const reportedComment = await Comment.findByPk(reportedCommentId)

            if (!reportedComment) throw new ApolloError('Comment is not exist')
            if (reportedComment.dataValues.userId === user.id) {
                throw new ApolloError('Cannot report your comment')
            }

            return await CommentReport.create({
                reportUserId: user.id,
                reportedCommentId: reportedCommentId,
                description: description,
            })
        },
    },
}
