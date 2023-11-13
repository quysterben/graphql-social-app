/* eslint-disable max-len */
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
    Notification,
    sequelize,
    Conversation,
} = require('../../../models')

const {GraphQLError} = require('graphql')
const {GarphQLUpload} = require('graphql-upload')

const {uploadImages, destroyImages} = require('../../middlewares/image')
const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')

const postSchema = require('../../validation/post.validation')
const commentSchema = require('../../validation/comment.validation')
const reportSchema = require('../../validation/report.validation')
const conversationNameSchema = require('../../validation/message.validation')

module.exports = {
    Upload: {
        GarphQLUpload,
    },

    Mutation: {
        async createPost(_, args, {user = null, pubsub}) {
            try {
                await postSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            isAuth(user)
            const {content} = args.input

            try {
                const result = await sequelize.transaction(async () => {
                    const result = await Post.create({
                        userId: user.id,
                        content,
                    })

                    // Notification to all friends
                    const friendship = await Friendship.findAll({
                        where: {
                            status: 2,
                            [Op.or]: [
                                {
                                    user1Id: user.id,
                                },
                                {
                                    user2Id: user.id,
                                },
                            ],
                        },
                        raw: true,
                    })
                    const friends = friendship.map((param) => {
                        return {
                            id: param.id,
                            userId: param.user1Id === user.id ?
                            param.user2Id :
                            param.user1Id,
                        }
                    })
                    Promise.all(friends.map(async (friend) => {
                        const data = await Notification.create({
                            userToNotify: friend.userId,
                            userWhoTriggered: user.id,
                            eventType: 'post',
                            objectId: result.dataValues.id,
                            seenByUser: false,
                        })
                        pubsub.publish(['NOTIFICATION_ADDED'], data)
                    }))

                    return result
                })
                return result
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async deletePost(_, args, {user = null}) {
            isAuth(user)
            const {postId} = args.input

            try {
                await sequelize.transaction(async () => {
                    const deletedPost = await Post.findByPk(postId)
                    if (!deletedPost) throw new GraphQLError('Post is not exist')
                    if (user.role === 2 &&
                        deletedPost.dataValues.userId !== user.id) {
                        throw new GraphQLError('Cannot delete this post')
                    }

                    // Clear images in cloudinary
                    const deletedImages = await Image.findAll({where: {
                        postId: postId,
                    }})
                    Promise.all( deletedImages.map(async (image) => {
                        await destroyImages(image.dataValues.publicId)
                    }))

                    await Notification.destroy({
                        where: {
                            eventType: 'post',
                            objectId: postId,
                        },
                    })

                    await deletedPost.destroy()

                    return {
                        message: 'Post deleted',
                    }
                })
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async editPost(_, args, {user = null}) {
            try {
                await postSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            isAuth(user)
            const {postId, content} = args.input

            const post = await Post.findByPk(postId)
            if (!post) throw new GraphQLError('Post is not exist')
            if (post.dataValues.userId !== user.id) {
                throw new GraphQLError('Cannot edit this post')
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
            isAuth(user)
            isUser(user)

            const post = await Post.findByPk(postId)
            if (!post) throw new GraphQLError('Post is not existed')
            if (post.dataValues.userId !== user.id) throw new GraphQLError('Not your post')

            // Upload image to cloud
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
        async likePost(_, args, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)
            const {postId} = args.input

            const like = await Like.findOne({
                where: {
                    postId: postId,
                    userId: user.id,
                },
            })

            // Dislike
            if (like) {
                try {
                    like.destroy()
                    const notification = await Notification.findOne({
                        where: {
                            userWhoTriggered: user.id,
                            eventType: 'like',
                            objectId: postId,
                        },
                    })
                    if (notification) {
                        notification.destroy()
                    }
                    return null
                } catch (err) {
                    throw new GraphQLError('Cannot unlike this post')
                }
            }

            // Like
            const post = await Post.findByPk(postId)
            if (post) {
                if (post.dataValues.userId !== user.id) {
                    // Notification to post's author
                    const data = await Notification.create({
                        userToNotify: post.dataValues.userId,
                        userWhoTriggered: user.id,
                        eventType: 'like',
                        objectId: postId,
                        seenByUser: false,
                    })
                    pubsub.publish(['NOTIFICATION_ADDED'], data)
                }

                return await post.createLike({
                    userId: user.id,
                    postId,
                })
            }
            throw new GraphQLError('Unable to like this post')
        },
        async createComment(_, args, {user = null, pubsub}) {
            try {
                await commentSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            isAuth(user)
            isUser(user)

            const {content, postId, parentId = 0} = args.input
            // Reply Comment
            if (parentId !== 0) {
                const parentCmt = await Comment.findByPk(parentId)
                if (!parentCmt) {
                    throw new GraphQLError('Comment is not exist')
                }
                if (parentCmt.dataValues.parentId !== 0) {
                    throw new GraphQLError('You cannot reply this comment')
                }
            }

            // Create Comment
            const post = await Post.findByPk(postId)
            if (!post) throw new GraphQLError('Post is not exist')
            const result = await post.createComment({
                content,
                userId: user.id,
                parentId,
            })

            if (parentId === 0 && post.dataValues.userId !== user.id) {
                // Notification to post's author
                const data = await Notification.create({
                    userToNotify: post.dataValues.userId,
                    userWhoTriggered: user.id,
                    eventType: 'comment',
                    objectId: postId,
                    seenByUser: false,
                })
                pubsub.publish(['NOTIFICATION_ADDED'], data)
            } else {
                // Notification to comment's author
                const parentComment = await Comment.findByPk(parentId)
                const childComments = await Comment.findAll({
                    where: {
                        parentId: parentId,
                    },
                    raw: true,
                })
                const filterArray = childComments.filter((obj, index) => {
                    return (
                        index ===
                        childComments.findIndex(
                            (o) => obj.userId === o.userId,
                        )
                    );
                  });
                filterArray.map(async (comment) => {
                    if (comment.userId !== user.id) {
                        const data = await Notification.create({
                            userToNotify: comment.userId,
                            userWhoTriggered: user.id,
                            eventType: 'reply',
                            objectId: postId,
                            seenByUser: false,
                        })
                        pubsub.publish(['NOTIFICATION_ADDED'], data)
                    }
                })
                if (parentComment &&
                    parentComment.dataValues.userId !== user.id) {
                    const data = await Notification.create({
                        userToNotify: parentComment.dataValues.userId,
                        userWhoTriggered: user.id,
                        eventType: 'reply',
                        objectId: postId,
                        seenByUser: false,
                    })
                    pubsub.publish(['NOTIFICATION_ADDED'], data)
                }
            }

            return result
        },
        async deleteComment(_, args, {user = null}) {
            isAuth(user)

            const {commentId} = args.input

            const deletedComment = await Comment.findByPk(commentId)
            if (!deletedComment) throw new GraphQLError('Comment is not exist')

            if (
                user.role === 2 &&
                deletedComment.dataValues.userId !== user.id
            ) throw new GraphQLError('Cannot delete this comment')

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

            isAuth(user)
            const {commentId, content} = args.input

            const comment = await Comment.findByPk(commentId)
            if (!comment) throw new GraphQLError('Comment is not exist')
            if (comment.dataValues.userId !== user.id) {
                throw new GraphQLError('Cannot edit this comment')
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
        async sendFriendRequest(_, args, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)

            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) {
                throw new GraphQLError('User is not exist')
            }
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                throw new GraphQLError('You cannot send friend request')
            }

            // Check if user already send friend request
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
                throw new GraphQLError('You cannot send friend request')
            }

            // Create friend request
            const result = await Friendship.create({
                user1Id: user.id,
                user2Id: userId,
                status: 1,
            })

            // Notification to user
            pubsub.publish(['FRIEND_REQUEST_ADDED'], result)

            return result
        },
        async acceptFriendRequest(_, args, {user = null}) {
            isAuth(user)
            isUser(user)

            const {friendshipId} = args.input
            const friendship = await Friendship.findByPk(friendshipId)
            if (!friendship) {
                throw new GraphQLError('Friend request is not exist')
            }
            if (
                friendship.dataValues.user2Id !== user.id &&
                friendship.dataValues.status !== '1'
            ) throw new GraphQLError('You cant accept this friend request')

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
            isAuth(user)
            isUser(user)

            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) throw new GraphQLError('User is not exist')
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                throw new GraphQLError('User cannot be unfiend')
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
            if (!friendship) throw new GraphQLError('Friendship is not exist')
            await friendship.destroy()
            return {
                message: 'Unfriend user success',
            }
        },
        async declinedFriendRequest(_, args, {user=null}) {
            isAuth(user)
            isUser(user)

            const {friendshipId} = args.input
            const friendship = await Friendship.findByPk(friendshipId)
            // Check if friendrequest is not exist
            if (!friendship) throw new GraphQLError('Friend request is not exist')

            // Check if user is not receiver
            if (friendship.dataValues.user2Id !== user.id &&
                friendship.dataValues.user1Id !== user.id
            ) throw new GraphQLError('You cannot decline this request')

            if (friendship.dataValues.status != 1) throw new GraphQLError('You cannot decline this request')
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

            isAuth(user)
            isUser(user)

            const {reportedUserId, description} = args.input

            if (reportedUserId === user.id) {
                throw new GraphQLError('Cant report yourself')
            }

            const reportedUser = await User.findByPk(reportedUserId)

            if (!reportedUser) throw new GraphQLError('User is not exist')
            if (reportedUser.dataValues.role === 1) {
                throw new GraphQLError('Cant report this user')
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

            isAuth(user)
            isUser(user)

            const {reportedPostId, description} = args.input

            const reportedPost = await Post.findByPk(reportedPostId)
            if (!reportedPost) throw new GraphQLError('Post is not exist')
            if (reportedPost.dataValues.userId == user.id) throw new GraphQLError('Cant report your post')

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

            isAuth(user)
            isUser(user)

            const {reportedCommentId, description} = args.input
            const reportedComment = await Comment.findByPk(reportedCommentId)
            if (!reportedComment) throw new GraphQLError('Comment is not exist')
            if (reportedComment.dataValues.userId === user.id) {
                throw new GraphQLError('Cant report your comment')
            }

            return await CommentReport.create({
                reportUserId: user.id,
                reportedCommentId: reportedCommentId,
                description: description,
            })
        },
        async seenAllNotifications(_, args, {user = null}) {
            isAuth(user)
            isUser(user)

            await Notification.update(
                {seenByUser: true},
                {where: {userToNotify: user.id}},
            )

            return {
                message: 'Seen notification success',
            }
        },
        async seenOneNotification(_, args, {user = null}) {
            isAuth(user)
            isUser(user)

            const {notificationId} = args.input
            await Notification.update(
                {seenByUser: true},
                {where: {userToNotify: user.id, id: notificationId}},
            )

            return {
                message: 'Seen notification success',
            }
        },

        // Message
        async createNewConversation(_, args, {user = null}) {
            isAuth(user)
            isUser(user)

            const {name, members} = args.input

            // Check members valid !
            members.forEach((member) => {
                if (member === user.id) {
                    throw new GraphQLError('You cannot add yourself')
                }
                const checkUser = User.findByPk(member)
                if (!checkUser) throw new GraphQLError('User is not exist')
            })

            if (members.length === 1) {
                const conversation = await Conversation.create({
                    isGroup: false,
                })
                // Add other user to conversation
                await conversation.createConversationMember({
                    userId: members[0],
                })
                // Add self to conversation
                await conversation.createConversationMember({
                    userId: user.id,
                })

                return conversation
            } else {
                try {
                    await conversationNameSchema.validate(args.input)
                } catch (err) {
                    throw err.errors
                }

                const conversation = await Conversation.create({
                    isGroup: true,
                    name: name,
                })
                // Add other user to conversation
                members.forEach(async (member) => {
                    await conversation.createConversationMember({
                        userId: member,
                    })
                })
                // Add self to conversation
                await conversation.createConversationMember({
                    userId: user.id,
                })

                return conversation
            }
        },
    },
}
