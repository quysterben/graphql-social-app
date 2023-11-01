const {Op} = require('sequelize')
const {
    Post,
    Friendship,
    User,
    Comment,
    Notification,
} = require('../../../models')

const {GraphQLError} = require('graphql')

module.exports = {
    Query: {
        async getAllPosts(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            const posts = await Post.findAll({
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return posts
        },
        async getPostsOfUser(root, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            const {userId} = args.input
            const owner = await User.findByPk(userId)
            if (!owner) {
                throw new GraphQLError('User is not exist')
            }

            const posts = await Post.findAll({
                where: {
                    userId: userId,
                },
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return posts
        },
        async getSinglePost(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            const {postId} = args.input
            const post = await Post.findByPk(postId)
            if (!post) {
                throw new GraphQLError('Post is not exist')
            }
            return post
        },
        async getAllFriends(_, args, context) {
            const {userId} = args.input
            const friendship = await Friendship.findAll({
                where: {
                    status: 2,
                    [Op.or]: [
                        {
                            user1Id: userId,
                        },
                        {
                            user2Id: userId,
                        },
                    ],
                },
            })
            const result = friendship.map((param) => {
                return {
                    id: param.dataValues.id,
                    userId: param.dataValues.user1Id === userId ?
                    param.dataValues.user2Id :
                    param.dataValues.user1Id,
                }
            })
            return result
        },
        async getAllFriendRequests(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot use this api')
            }
            return await Friendship.findAll({
                where: {
                    [Op.or]: [{
                        status: 1,
                    }, {
                        status: 2,
                    }],
                    user2Id: user.id,
                },
            })
        },
        async getFriendStatus(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot use this api')
            }
            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) {
                throw new GraphQLError('User is not exist')
            }
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                return {
                    userId: userId,
                    status: null,
                }
            }
            const friendship = await Friendship.findOne({
                where: {
                    [Op.or]: [
                        {
                            user1Id: user.id,
                            user2Id: userId,
                        }, {
                            user1Id: userId,
                            user2Id: user.id,
                        },
                    ],
                },
            })
            if (friendship) {
                const result = {
                    id: friendship.dataValues.id,
                    from: friendship.dataValues.user1Id,
                    userId: friendship.dataValues.user1Id === userId ?
                        friendship.dataValues.user1Id :
                        friendship.dataValues.user2Id,
                    status: friendship.dataValues.status,
                }
                return result
            }

            const result = {
                userId: userId,
                status: 0,
            }
            return result
        },
        async getNotifications(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot use this api')
            }

            const notifications = await Notification.findAll({
                where: {
                    userToNotify: user.id,
                },
                order: [
                    ['createdAt', 'DESC'],
              ],
            })
            return notifications
        },
        async searchUsers(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot use this api')
            }

            const result = await User.findAll({
                where: {
                    name: {
                        [Op.like]: `%${args.searchQuery}%`,
                    },
                    id: {
                        [Op.ne]: user.id,
                    },
                    role: {
                        [Op.ne]: '1',
                    },
                },
            })

            return result
        },
        async searchFriends(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot use this api')
            }

            const friendship = await Friendship.findAll({
                where: {
                    status: 2,
                    [Op.or]: [
                        {
                            user1Id: user.id,
                        },
                        {
                            user2Id: user.id,
                        },
                    ],
                },
            })

            const friends = friendship.map((param) => {
                return {
                    id: param.dataValues.id,
                    userId: param.dataValues.user1Id === user.id ?
                    param.dataValues.user2Id :
                    param.dataValues.user1Id,
                    searchQuery: args.searchQuery,
                }
            })

            const result = friends.map(async (param) => {
                return await User.findOne({
                    where: {
                        id: param.userId,
                        name: {
                            [Op.like]: `%${args.searchQuery}%`,
                        },
                    },
                })
            })

            return result
        },
        async searchPosts(_, args, {user = null}) {
            if (!user) {
                throw new GraphQLError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new GraphQLError('You cannot use this api')
            }

            const result = await Post.findAll({
                where: {
                    content: {
                        [Op.like]: `%${args.searchQuery}%`,
                    },
                },
            })

            return result
        },
    },

    Post: {
        async author(post) {
            return await post.getAuthor()
        },
        async comments(post) {
            const comments = await post.getComments({
                where: {
                    parentId: 0,
                },
                order: [
                    ['createdAt', 'ASC'],
              ],
            })
            return comments
        },
        async likes(post) {
            return await post.getLikes()
        },
        async images(post) {
            return await post.getImages()
        },
    },

    Like: {
        async user(like) {
            return await like.getUser()
        },
    },

    Comment: {
        async author(comment) {
            return await comment.getAuthor()
        },
        async childrenComments(comment) {
            return await Comment.findAll({
                where: {
                    parentId: comment.dataValues.id,
                },
                order: [
                    ['createdAt', 'ASC'],
              ],
            })
        },
    },

    ChildrenComment: {
        async author(comment) {
            return await comment.getAuthor()
        },
    },

    Friend: {
        async user(friend) {
            return await User.findByPk(friend.userId)
        },
    },

    Friendship: {
        async user(friend) {
            return await User.findByPk(friend.userId)
        },
    },

    FriendRequest: {
        async user(friendship) {
            return friendship.getFriends1()
        },
    },

    Notification: {
        async toNotify(notification) {
            return await notification.getToNotify()
        },
        async triggered(notification) {
            return await notification.getTriggered()
        },
    },
}
