/* eslint-disable max-len */
const {Op} = require('sequelize')
const {
    Post,
    Friendship,
    User,
    Comment,
    Notification,
    Conversation,
} = require('../../../models')

const {GraphQLError} = require('graphql')

const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')
const isConversationMember = require('../../middlewares/isConversationMember')

module.exports = {
    Query: {
        async getAllPosts(root, args, {user = null}) {
            isAuth(user)
            const posts = await Post.findAll({
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return posts
        },
        async getPostsOfUser(root, args, {user = null}) {
            isAuth(user)
            const {userId} = args.input
            const owner = await User.findByPk(userId)
            if (!owner) {
                throw new GraphQLError('User is not exist')
            }

            const posts = await Post.findAll({
                where: {
                    userId: userId,
                },
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return posts
        },
        async getSinglePost(_, args, {user = null}) {
            isAuth(user)
            const {postId} = args.input
            const post = await Post.findByPk(postId)
            if (!post) {
                throw new GraphQLError('Post is not exist')
            }
            return post
        },
        async getAllFriends(_, args, {user = null}) {
            isAuth(user)
            const {userId} = args.input
            const friendship = await Friendship.findAll({
                where: {
                    status: 2,
                    [Op.or]: [
                        {
                            user1Id: userId,
                        },
                        {
                            user2Id: userId,
                        },
                    ],
                },
            })
            const result = friendship.map((param) => {
                return {
                    id: param.dataValues.id,
                    userId: param.dataValues.user1Id === userId ?
                    param.dataValues.user2Id :
                    param.dataValues.user1Id,
                }
            })
            return result
        },
        async getAllFriendRequests(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            return await Friendship.findAll({
                where: {
                    [Op.or]: [{
                        status: 1,
                    }, {
                        status: 2,
                    }],
                    user2Id: user.id,
                },
            })
        },
        async getFriendStatus(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) {
                throw new GraphQLError('User is not exist')
            }
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                return {
                    userId: userId,
                    status: null,
                }
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
                const result = {
                    id: friendship.dataValues.id,
                    from: friendship.dataValues.user1Id,
                    userId: friendship.dataValues.user1Id === userId ?
                        friendship.dataValues.user1Id :
                        friendship.dataValues.user2Id,
                    status: friendship.dataValues.status,
                }
                return result
            }

            const result = {
                userId: userId,
                status: 0,
            }
            return result
        },
        async getNotifications(_, args, {user = null}) {
            isAuth(user)
            isUser(user)

            const notifications = await Notification.findAll({
                where: {
                    userToNotify: user.id,
                },
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return notifications
        },
        async searchUsers(_, args, {user = null}) {
            isAuth(user)
            const result = await User.findAll({
                where: {
                    name: {
                        [Op.like]: `%${args.searchQuery}%`,
                    },
                    id: {
                        [Op.ne]: user.id,
                    },
                    role: {
                        [Op.ne]: '1',
                    },
                },
            })
            return result
        },
        async searchFriends(_, args, {user = null}) {
            isAuth(user)
            isUser(user)

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
            })

            const friends = friendship.map((param) => {
                return {
                    id: param.dataValues.id,
                    userId: param.dataValues.user1Id === user.id ?
                    param.dataValues.user2Id :
                    param.dataValues.user1Id,
                    searchQuery: args.searchQuery,
                }
            })

            const result = friends.map(async (param) => {
                return await User.findOne({
                    where: {
                        id: param.userId,
                        name: {
                            [Op.like]: `%${args.searchQuery}%`,
                        },
                    },
                })
            })

            return result
        },
        async searchPosts(_, args, {user = null}) {
            isAuth(user)
            const result = await Post.findAll({
                where: {
                    content: {
                        [Op.like]: `%${args.searchQuery}%`,
                    },
                },
            })
            return result
        },
        // Messenger
        async getAllConversations(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            const conversations = await user.getConversations({
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return conversations
        },
        async getConversationInfo(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            const conversationId = args.conversationId
            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) {
                throw new GraphQLError('Conversation is not exist')
            }

            await isConversationMember(conversation, user)

            return conversation
        },
        async getConversationMessages(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            const conversationId = args.conversationId
            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) {
                throw new GraphQLError('Conversation is not exist')
            }

            await isConversationMember(conversation, user)
            return await conversation.getMessages()
        },
    },

    Post: {
        async author(post) {
            return await post.getAuthor()
        },
        async comments(post) {
            const comments = await post.getComments({
                where: {
                    parentId: 0,
                },
                order: [
                    ['createdAt', 'ASC'],
              ],
            })
            return comments
        },
        async likes(post) {
            return await post.getLikes()
        },
        async images(post) {
            return await post.getImages()
        },
    },

    Like: {
        async user(like) {
            return await like.getUser()
        },
    },

    Comment: {
        async author(comment) {
            return await comment.getAuthor()
        },
        async childrenComments(comment) {
            return await Comment.findAll({
                where: {
                    parentId: comment.dataValues.id,
                },
                order: [
                    ['createdAt', 'ASC'],
              ],
            })
        },
    },

    ChildrenComment: {
        async author(comment) {
            return await comment.getAuthor()
        },
    },

    Friend: {
        async user(friend) {
            return await User.findByPk(friend.userId)
        },
    },

    Friendship: {
        async user(friend) {
            return await User.findByPk(friend.userId)
        },
    },

    FriendRequest: {
        async user(friendship) {
            return friendship.getFriends1()
        },
    },

    Notification: {
        async toNotify(notification) {
            return await notification.getToNotify()
        },
        async triggered(notification) {
            return await notification.getTriggered()
        },
    },

    Conversation: {
        async lastMessage(conversation) {
            const result = await conversation.getMessages({order: [
                ['createdAt', 'DESC'],
            ], limit: 1})

            return result[0]
        },
        async members(conversation) {
            const members = await conversation.getConversationMembers()
            const result = Promise.all( members.map(async (param) => {
                const member = await User.findByPk(param.userId)
                return member
            }))
            return result
        },
    },

    Message: {
        async author(message) {
            return await message.getAuthor()
        },
        async seenBy(message) {
            const seenUserIds = await message.getSeenUsers()
            const result = Promise.all(seenUserIds.map(async (param) => {
                const member = await User.findByPk(param.userId)
                return {
                    user: member,
                    seenAt: param.createdAt,
                }
            }))
            return result
        },
    },
}
