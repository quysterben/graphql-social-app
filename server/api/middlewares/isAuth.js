const {GraphQLError} = require('graphql')

const isAuth = (user) => {
    if (!user) {
        throw new GraphQLError('You need to be authenticated');
    }

    return
}

module.exports = isAuth
