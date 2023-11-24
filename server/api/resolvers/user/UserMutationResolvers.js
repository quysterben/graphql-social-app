/* eslint-disable max-len */
const {Op} = require('sequelize')
const {
    PostImage,
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
    ConversationMember,
} = require('../../../models')

const {GraphQLError} = require('graphql')
const {GarphQLUpload} = require('graphql-upload')
const {extractPublicId} = require('cloudinary-build-url')

const {uploadImages, destroyImages} = require('../../middlewares/image')

const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')

const postSchema = require('../../validation/post.validation')
const commentSchema = require('../../validation/comment.validation')
const reportSchema = require('../../validation/report.validation')
const conversationNameSchema = require('../../validation/message.validation')
const isConversationMember = require('../../middlewares/isConversationMember')

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
                    const deletedImages = await PostImage.findAll({where: {
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
                await PostImage.create({
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

            pubsub.publish(['COMMENT_ADDED'], result)
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
        async editComment(_, args, {user = null, pubsub}) {
            try {
                await commentSchema.validate(args.input)
            } catch (err) {
                throw err.errors
            }

            isAuth(user)
            const {commentId, content} = args.input

            await Comment.update(
                {content: content}, {
                    where: {
                        id: commentId,
                        userId: user.id,
                    },
                },
            )

            const result = await Comment.findByPk(commentId)
            pubsub.publish(['COMMENT_EDITED'], result)

            return result
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
        async createNewConversation(_, args, {user = null, pubsub}) {
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
                // Check if conversation is exist
                const checkCov = await user.getConversations({
                    where: {
                        isGroup: false,
                    },
                    include: [
                        {
                            model: ConversationMember,
                            as: 'members',
                            where: {
                                userId: members[0],
                            },
                        },
                    ],
                })
                if (checkCov.length > 0) {
                    throw new GraphQLError('Conversation is already exist')
                }

                const conversation = await Conversation.create({
                    isGroup: false,
                })

                await conversation.createMember({userId: user.id})
                // Add other user to conversation
                const member = await User.findByPk(members[0])
                await conversation.addConversationMember(member)
                const newMsg = await conversation.createMessage({
                    content: `${user.name} start conversation with ${member.name}`,
                    userId: user.id,
                    type: 'createConversation',
                })
                pubsub.publish(['MESSAGE_UPDATED'], newMsg)
                pubsub.publish(['CONVERSATION_UPDATED'], conversation)
                return conversation
            } else {
                try {
                    await conversationNameSchema.validate(args.input)
                } catch (err) {
                    console.log(err);
                    throw err.errors
                }

                const conversation = await Conversation.create({
                    isGroup: true,
                    name: name,
                })
                await conversation.createMember({userId: user.id})
                // Add other user to conversation
                members.forEach(async (member) => {
                    await conversation.createMember({userId: member})
                })
                const newMsg = await conversation.createMessage({
                    content: `${user.name} added ${members.length} members to conversation.`,
                    userId: user.id,
                    type: 'addMembers',
                })
                pubsub.publish(['MESSAGE_UPDATED'], newMsg)
                pubsub.publish(['CONVERSATION_UPDATED'], conversation)

                return conversation
            }
        },
        async sendMessage(_, args, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)
            const {conversationId, content, files} = args.input

            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) throw new GraphQLError('Conversation is not exist')
            await isConversationMember(conversation, user)

            try {
                if (files) {
                    const result = await sequelize.transaction(async () => {
                        const message = await conversation.createMessage({content: content, userId: user.id})
                        const imagesUrl = await uploadImages(files)
                        Promise.all(imagesUrl.map(async (image) => {
                            await message.createMessageImage({
                                imageUrl: image.url,
                                publicId: image.public_id,
                            })
                        }))
                        pubsub.publish(['MESSAGE_UPDATED'], message)
                        pubsub.publish(['CONVERSATION_UPDATED'], conversation)
                        return message
                    })
                    return result
                } else {
                    const message = await conversation.createMessage({content: content, userId: user.id})
                    pubsub.publish(['MESSAGE_UPDATED'], message)
                    pubsub.publish(['CONVERSATION_UPDATED'], conversation)
                    return message
                }
            } catch (err) {
                throw new GraphQLError(err.message)
            }
        },
        async seenMessage(_, args, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)
            const conversationId = args.conversationId

            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) throw new GraphQLError('Conversation is not exist')
            await isConversationMember(conversation, user)

            const newMessage = await conversation.getMessages({
                limit: 1,
                order: [['createdAt', 'DESC']],
            })
            if (newMessage.length === 0) return null
            if (newMessage[0].dataValues.userId === user.id) {
                return newMessage[0]
            }
            const seenUsers = await newMessage[0].getSeenUsers()
            if (seenUsers.some((seenUser) => seenUser.dataValues.userId === user.id)) {
                return newMessage[0]
            }
            newMessage[0].createSeenUser({userId: user.id})
            pubsub.publish(['MESSAGE_UPDATED'], newMessage[0])
            pubsub.publish(['CONVERSATION_SEEN'], conversation)
            return newMessage[0]
        },
        async changeConversationName(_, args, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)
            const {conversationId, name} = args

            try {
                await conversationNameSchema.validate(args)
            } catch (err) {
                throw err.errors
            }

            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) throw new GraphQLError('Conversation is not exist')
            if (!conversation.dataValues.isGroup) {
                throw new GraphQLError('Cannot change name of this conversation')
            }
            await isConversationMember(conversation, user)

            conversation.name = name
            await conversation.save()
            const newMsg = await conversation.createMessage({
                content: `${user.name} changed conversation name to ${name}`,
                userId: user.id,
                type: 'changeName',
            })
            pubsub.publish(['MESSAGE_UPDATED'], newMsg)
            pubsub.publish(['CONVERSATION_UPDATED'], conversation)
            return conversation
        },
        async changeConversationImage(_, {file, conversationId}, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)

            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) throw new GraphQLError('Conversation is not exist')
            await isConversationMember(conversation, user)

            if (!conversation.isGroup) throw new GraphQLError('Cannot change image of this conversation')
            if (conversation.image) await destroyImages(extractPublicId(conversation.image))

            const image = await uploadImages([file])
            conversation.image = image[0].url
            await conversation.save()
            const newMsg = await conversation.createMessage({
                content: `${user.name} changed conversation image.`,
                userId: user.id,
                type: 'changeImage',
            })
            pubsub.publish(['MESSAGE_UPDATED'], newMsg)
            pubsub.publish(['CONVERSATION_UPDATED'], conversation)

            return conversation
        },
        async addConversationMembers(_, {conversationId, newMembers}, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)

            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) throw new GraphQLError('Conversation is not exist')
            await isConversationMember(conversation, user)
            if (!conversation.isGroup) throw new GraphQLError('Cannot add member to this conversation')

            // Add new members
            newMembers.forEach(async (member) => {
                isConversationMember(conversation, {id: member})
                await conversation.createMember({
                    userId: member,
                })
            })
            const newMsg = await conversation.createMessage({
                content: `${user.name} added ${newMembers.length} members to conversation.`,
                userId: user.id,
                type: 'addMembers',
            })
            pubsub.publish(['MESSAGE_UPDATED'], newMsg)
            pubsub.publish(['CONVERSATION_UPDATED'], conversation)

            return conversation
        },
        async removeConversationMember(_, {conversationId, memberToRemove}, {user = null, pubsub}) {
            isAuth(user)
            isUser(user)

            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) throw new GraphQLError('Conversation is not exist')
            await isConversationMember(conversation, user)
            if (!conversation.isGroup) throw new GraphQLError('Cannot remove member from this conversation')

            // Remove member
            await isConversationMember(conversation, {id: memberToRemove})
            await ConversationMember.destroy({where: {
                conversationId: conversationId,
                userId: memberToRemove,
            }})
            const removedMember = await User.findByPk(memberToRemove)
            const newMsg = await conversation.createMessage({
                content: `${user.name} removed ${removedMember.name} from conversation.`,
                userId: user.id,
                type: 'removeMember',
            })
            pubsub.publish(['MESSAGE_UPDATED'], newMsg)
            pubsub.publish(['CONVERSATION_UPDATED'], conversation)

            return conversation
        },
    },
}
