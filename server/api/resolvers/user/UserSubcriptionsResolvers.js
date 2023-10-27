const {GraphQLError} = require('graphql')

const {withFilter} = require('graphql-subscriptions')

module.exports = {
    Subscription: {
        friendRequestAdded: {
            subscribe: withFilter(
                (_, args, {user = null, pubsub}) => {
                    if (!user) throw new GraphQLError('User not found')
                    return pubsub.asyncIterator(['FRIEND_REQUEST_ADDED'])
                },
                (payload, args, {user = null}) => {
                    return payload.dataValues.user2Id == user.dataValues.id
                },
            ),
            resolve: (payload) => payload,
        },
    },
}
