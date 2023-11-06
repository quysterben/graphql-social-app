const {withFilter} = require('graphql-subscriptions')
const isAuth = require('../../middlewares/isAuth')

module.exports = {
    Subscription: {
        friendRequestAdded: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    isAuth(user)
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
    },
}
