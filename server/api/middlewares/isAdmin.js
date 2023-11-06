const {GraphQLError} = require('graphql')

const isAdmin = (user) => {
    if (user.role != 1) {
        throw new GraphQLError('You need to be an admin');
    }

    return
}

module.exports = isAdmin
