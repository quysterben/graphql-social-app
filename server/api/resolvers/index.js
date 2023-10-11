const AdminResolvers = require('./admin')
const UserResolvers = require('./user')
const CommonResolvers = require('./common')

module.exports = [
    AdminResolvers,
    UserResolvers,
    CommonResolvers,
]
