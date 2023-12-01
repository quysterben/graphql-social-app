const {GraphQLError} = require('graphql');
const ErrorMessageConstants = require('../constants/ErrorMessageConstants');

const isUser = (user) => {
    if (user.role != 'user') {
        throw new GraphQLError(ErrorMessageConstants.IsNotUser);
    }

    return
}

module.exports = isUser
