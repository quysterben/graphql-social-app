/* eslint-disable max-len */
const {withFilter} = require('graphql-subscriptions')
const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')

const {Conversation} = require('../../../models')
const {GraphQLError} = require('graphql')

module.exports = {
    Subscription: {
        friendRequestAdded: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['FRIEND_REQUEST_ADDED'])
                },
                (payload, args, {user = null}) => {
                    return payload.dataValues.user2Id == user.dataValues.id
                },
            ),
            resolve: (payload) => payload,
        },
        notificationAdded: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['NOTIFICATION_ADDED'])
                },
                (payload, args, {user = null}) => {
                    return payload.dataValues.userToNotify ===
                        user.dataValues.id
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        conversationCreated: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['CONVERSATION_CREATED'])
                },
                async (payload, args, {user = null}) => {
                    const members = await payload.getConversationMembers({raw: true})
                    const memberIds = members.map((member) => member.userId)
                    return memberIds.includes(user.dataValues.id)
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        messageAdded: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['MESSAGE_SENT'])
                },
                async (payload, args, {user = null}) => {
                    const {conversationId} = args
                    try {
                        // Check if conversation exists
                        const conversation = await Conversation.findByPk(conversationId)
                        if (!conversation) {
                            throw new GraphQLError('Conversation not found')
                        }

                        // Check if user is a member of the conversation
                        const members = await conversation.getConversationMembers({raw: true})
                        const memberIds = members.map((member) => member.userId)

                        return conversationId === payload.dataValues.conversationId &&
                            memberIds.includes(user.dataValues.id)
                    } catch (err) {
                        throw new GraphQLError(err.message)
                    }
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
    },
}
