const CommonMutationResolvers = require('./CommonMutationResolvers')
const CommonQueryResolvers = require('./CommonQueryResolvers')

module.exports = {
    ...CommonMutationResolvers,
    ...CommonQueryResolvers,
}
