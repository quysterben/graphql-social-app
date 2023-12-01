const {GraphQLError} = require('graphql')
const ErrorMessageConstants = require('../constants/ErrorMessageConstants')

const isConversationMember = async (conversation, user) => {
    const members = await conversation.getConversationMembers({
        where: {
            id: user.id,
        },
    })
    if (members.length === 0) {
        throw new GraphQLError(ErrorMessageConstants.IsNotConversationMember)
    }
    return true
}

module.exports = isConversationMember
