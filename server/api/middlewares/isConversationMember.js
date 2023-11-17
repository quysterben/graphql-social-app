const {GraphQLError} = require('graphql')

const isConversationMember = async (conversation, user) => {
    const members = await conversation.getConversationMembers({
        where: {
            userId: user.id,
        },
        raw: true,
    })
    if (members.length === 0) {
        throw new GraphQLError('You are not a member of this conversation')
    }
    return true
}

module.exports = isConversationMember
