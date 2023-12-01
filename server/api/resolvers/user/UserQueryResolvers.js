const {Op} = require('sequelize')
const {
    Post,
    Friendship,
    User,
    Comment,
    Notification,
    Conversation,
    MessageImage,
    Message,
} = require('../../../models')

const {GraphQLError} = require('graphql')

const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')
const isConversationMember = require('../../middlewares/isConversationMember')

const ErrorMessageConstants = require('../../constants/ErrorMessageConstants')

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
                throw new GraphQLError(ErrorMessageConstants.UserNotExist)
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
                throw new GraphQLError(ErrorMessageConstants.PostNotExist)
            }
            return post
        },
        async getAllFriends(_, args, {user = null}) {
            isAuth(user)
            const {userId} = args.input
            const friendship = await Friendship.findAll({
                where: {
                    status: 'friend',
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
                    id: param.id,
                    userId: param.user1Id === userId ?
                        param.user2Id : param.user1Id,
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
                        status: 'pending',
                    }, {
                        status: 'friend',
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
                throw new GraphQLError(ErrorMessageConstants.UserNotExist)
            }
            if (checkUser.dataValues.role !== 'user' || userId === user.id) {
                throw new GraphQLError(ErrorMessageConstants.ActionFailed)
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
                    id: friendship.id,
                    from: friendship.user1Id,
                    userId: friendship.user1Id === userId ?
                        friendship.user1Id : friendship.user2Id,
                    status: friendship.status,
                }
                return result
            }

            const result = {
                userId: userId,
                status: 'none',
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
                        [Op.ne]: 'admin',
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
                    status: 'friend',
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
                    id: param.id,
                    userId: param.user1Id === user.id ?
                        param.user2Id : param.user1Id,
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
                include: [{
                    model: Message,
                    as: 'messages',
                }],
                order: [
                    [{model: Message, as: 'messages'}, 'createdAt', 'DESC'],
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
                throw new GraphQLError(
                    ErrorMessageConstants.ConversationNotExist,
                )
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
                throw new GraphQLError(
                    ErrorMessageConstants.ConversationNotExist,
                )
            }

            await isConversationMember(conversation, user)
            return await conversation.getMessages()
        },
        async getConversationMembers(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            const conversationId = args.conversationId
            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) {
                throw new GraphQLError(
                    ErrorMessageConstants.ConversationNotExist,
                )
            }
            await isConversationMember(conversation, user)

            return await conversation.getConversationMembers()
        },
        async getConversationImages(_, args, {user = null}) {
            isAuth(user)
            isUser(user)
            const conversationId = args.conversationId
            const conversation = await Conversation.findByPk(conversationId)
            if (!conversation) {
                throw new GraphQLError(
                    ErrorMessageConstants.ConversationNotExist,
                )
            }
            await isConversationMember(conversation, user)

            const messages = await conversation.getMessages({include: {
                model: MessageImage,
                as: 'messageImages',
                required: true,
            }, order: [['createdAt', 'DESC']]})

            let arr = []
            messages.map((param) => arr = arr.concat(param.messageImages))

            return arr
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
                    parentId: comment.id,
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
            return members
        },
    },

    Message: {
        async author(message) {
            return await message.getAuthor()
        },
        async seenBy(message) {
            const seenUserIds = await message.getSeenUsers()
            const result = await Promise.all(seenUserIds.map(async (param) => {
                const member = await User.findByPk(param.userId)
                return {
                    user: member,
                    seenAt: param.createdAt,
                }
            }))
            return result
        },
        async images(message) {
            return await message.getMessageImages()
        },
    },
}
