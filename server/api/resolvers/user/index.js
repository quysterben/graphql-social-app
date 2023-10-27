const UserMutationResolvers = require('./UserMutationResolvers')
const UserQueryResolvers = require('./UserQueryResolvers')
const UserSubscriptionsResolvers = require('./UserSubcriptionsResolvers')

module.exports = {
    ...UserMutationResolvers,
    ...UserQueryResolvers,
    ...UserSubscriptionsResolvers,
}
