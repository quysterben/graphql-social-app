// const {GraphQLError} = require('graphql')

const {PubSub} = require('graphql-subscriptions')
const pubsub = new PubSub()

module.exports = {
    Subscription: {
        friendRequestAdded: {
            subscribe: () => pubsub.asyncIterator(['FRIEND_REQUEST_ADDED']),
        },
    },
}
