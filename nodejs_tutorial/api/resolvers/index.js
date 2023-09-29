const userResolvers = require('./user')
const postResolvers = require('./post')
const commentResolvers = require('./comment')
const likeResolvers = require('./like')
const friendshipResolvers = require('./friendship')
const imageResolvers = require('./image')

module.exports = [
  userResolvers,
  postResolvers,
  commentResolvers,
  likeResolvers,
  friendshipResolvers,
  imageResolvers,
]
