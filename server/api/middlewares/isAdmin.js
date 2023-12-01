const {GraphQLError} = require('graphql')

const ErrorMessageConstants = require('../constants/ErrorMessageConstants')

const isAdmin = (user) => {
    if (user.role != 'admin') {
        throw new GraphQLError(ErrorMessageConstants.IsNotAdmin);
    }

    return
}

module.exports = isAdmin
