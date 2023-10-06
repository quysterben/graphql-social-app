const userResolvers = require('./user')
const adminResolvers = require('./admin')
const postResolvers = require('./post')
const commentResolvers = require('./comment')
const likeResolvers = require('./like')
const friendshipResolvers = require('./friendship')
const imageResolvers = require('./image')

module.exports = [
    adminResolvers,
    userResolvers,
    postResolvers,
    commentResolvers,
    likeResolvers,
    friendshipResolvers,
    imageResolvers,
]
