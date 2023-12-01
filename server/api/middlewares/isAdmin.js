const {GraphQLError} = require('graphql')

const ErrorMessageConstants = require('../constants/ErrorMessageConstants')

const isAdmin = (user) => {
    if (user.role != 'admin') {
        throw new GraphQLError(ErrorMessageConstants.IsNotAdmin);
    }
}

module.exports = isAdmin
