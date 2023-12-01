const {GraphQLError} = require('graphql');

const ErrorMessageConstants = require('../constants/ErrorMessageConstants');

const isAuth = (user) => {
    if (!user) {
        throw new GraphQLError(ErrorMessageConstants.NotAuthenticated);
    }
}

module.exports = isAuth
