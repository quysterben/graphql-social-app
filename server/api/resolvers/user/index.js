const UserMutationResolvers = require('./UserMutationResolvers')
const UserQueryResolvers = require('./UserQueryResolvers')

module.exports = {
    ...UserMutationResolvers,
    ...UserQueryResolvers,
}
