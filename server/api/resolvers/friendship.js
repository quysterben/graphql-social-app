const {Friendship, User} = require('../../models')

const {Op} = require('sequelize');

const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
    Query: {
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

    Mutation: {
        async sendFriendRequest(_, args, {user = null}) {
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
                throw new ApolloError('You cannot send friend request')
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
                throw new ApolloError('You cannot send friend request')
            }

            return await Friendship.create({
                user1Id: user.id,
                user2Id: userId,
                status: 1,
            })
        },
        async acceptFriendRequest(_, args, {user = null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {friendshipId} = args.input
            const friendship = await Friendship.findByPk(friendshipId)
            if (!friendship) {
                throw new ApolloError('Friend request is not exist')
            }
            if (
                friendship.dataValues.user2Id !== user.id &&
                friendship.dataValues.status !== '1'
            ) throw new ApolloError('You cannot accept this friend request')

            await Friendship.update({status: 2}, {
                where: {
                    id: friendshipId,
                    user2Id: user.id,
                    status: 1,
                },
            })
            return {
                message: 'Friend request accepted',
            }
        },
        async unFriend(_, args, {user = null}) {
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
                throw new ApolloError('User cannot be unfiend')
            }
            const friendship = await Friendship.findOne({
                where: {
                    status: 2,
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
            if (!friendship) throw new ApolloError('Friendship is not exist')
            await friendship.destroy()
            return {
                message: 'Unfriend user success',
            }
        },
        async declinedFriendRequest(_, args, {user=null}) {
            if (!user) {
                throw new AuthenticationError('You must login to use this api')
            }
            if (user.role !== 2) {
                throw new ApolloError('You cannot use this api')
            }
            const {friendshipId} = args.input
            const friendship = await Friendship.findByPk(friendshipId)
            if (friendship) throw new ApolloError('Friend request is not exist')
            if (friendship.dataValues.user2Id !== user.id) {
                throw new ApolloError('You cannot decline this request')
            }
            if (friendship.dataValues.status != 1) {
                throw new ApolloError('You cannot decline this request')
            }
            await friendship.destroy()
            return {
                message: 'Declined request success',
            }
        },
    },
}
