const {Post, Friendship, User} = require('../../../models')

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
    Query: {
        async getAllPosts(root, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            const posts = await Post.findAll()
            return posts
        },
        async getSinglePost(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            const {postId} = args.input
            const post = await Post.findByPk(postId)
            if (!post) {
                throw new ApolloError('Post is not exist')
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
        async getAllFriendsRequest(_, {}, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            return await Friendship.findAll({
                where: {
                status: 1,
                user2Id: user.id,
                },
            })
        },
        async getFriendStatus(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {userId} = args.input
            const checkUser = await User.findByPk(userId)
            if (!checkUser) {
                throw new ApolloError('User is not exist')
            }
            if (checkUser.dataValues.role !== 2 || userId === user.id) {
                throw new ApolloError('You cannot check friend status')
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
    },

    Post: {
        async author(post) {
            return await post.getAuthor()
        },
        async comments(post) {
            return await post.getComments()
        },
        async likes(post) {
            return await post.getLikes()
        },
        async images(post) {
            return await post.getImages()
        },
    },

    Comment: {
        author(comment) {
            return comment.getAuthor()
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
        user(friendship) {
        return friendship.getFriends1()
        },
    },
}
