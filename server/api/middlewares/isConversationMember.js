const {GraphQLError} = require('graphql')

const isConversationMember = async (conversation, user) => {
    const members = await conversation.getConversationMembers({raw: true})
    if (!members.some((param) => param.userId === user.id)) {
        throw new GraphQLError('You are not in this conversation')
    }
    return true
}

module.exports = isConversationMember
