const {GraphQLError} = require('graphql')

const isUser = (user) => {
    if (user.role != 2) {
        throw new GraphQLError('You need to be a user');
    }

    return
}

module.exports = isUser
