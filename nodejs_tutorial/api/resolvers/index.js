const userResolvers = require('./user')
const postResolvers = require('./post')
const commentResolvers = require('./comment')
const likeResolvers = require('./like')

module.exports = [userResolvers, postResolvers, commentResolvers, likeResolvers]
