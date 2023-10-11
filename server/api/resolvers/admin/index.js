const AdminMutationResolvers = require('./AdminMutationResolvers')
const AdminQueryResolvers = require('./AdminQueryResolvers')

module.exports = {
    ...AdminMutationResolvers,
    ...AdminQueryResolvers,
}
