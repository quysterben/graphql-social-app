const {withFilter} = require('graphql-subscriptions')

const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')
const isConversationMember = require('../../middlewares/isConversationMember')

const {Conversation} = require('../../../models')
const {GraphQLError} = require('graphql')

const ErrorMessageConstants = require('../../constants/ErrorMessageConstants')

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
                    return payload.user2Id == user.id
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
                    return payload.userToNotify == user.id
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        commentAdded: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['COMMENT_ADDED'])
                },
                (payload, args, {user = null}) => {
                    const {postId} = args
                    return payload.postId == postId
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        commentEdited: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['COMMENT_EDITED'])
                },
                (payload, args, {user = null}) => {
                    const {postId} = args
                    return payload.postId === postId
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        conversationUpdated: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['CONVERSATION_UPDATED'])
                },
                async (payload, args, {user = null}) => {
                    return await isConversationMember(payload, user)
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        conversationSeen: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['CONVERSATION_SEEN'])
                },
                async (payload, args, {user = null}) => {
                    return await isConversationMember(payload, user)
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
        messageUpdated: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
                    isUser(user)
                    return pubsub.asyncIterator(['MESSAGE_UPDATED'])
                },
                async (payload, args, {user = null}) => {
                    const {conversationId} = args
                        // Check if conversation exists
                        const conversation =
                            await Conversation.findByPk(conversationId)
                        if (!conversation) {
                            throw new GraphQLError(
                                ErrorMessageConstants.ConversationNotExist,
                            )
                        }

                        return conversationId === payload.conversationId &&
                            await isConversationMember(conversation, user)
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
    },
}
