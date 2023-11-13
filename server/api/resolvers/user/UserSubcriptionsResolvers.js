/* eslint-disable max-len */
const {withFilter} = require('graphql-subscriptions')
const isAuth = require('../../middlewares/isAuth')
const isUser = require('../../middlewares/isUser')

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
                    console.log(memberIds);
                    return memberIds.includes(user.dataValues.id)
                },
            ),
            resolve: (payload) => {
                return payload
            },
        },
    },
}
