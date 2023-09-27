const {Friendship, User} = require('../../models')

const {ApolloError} = require('apollo-server-express');
const {Op} = require('sequelize');

// const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
  Query: {
    async getAllFriends(_, {userId}, context) {
      const friendship = await Friendship.findAll({
        where: {
          status: 2,
          [Op.or]: [
            {
              user1_id: userId,
            },
            {
              user2_id: userId,
            },
          ],
        },
      },
      )

      const result = friendship.map((param) => {
        return {
          id: param.dataValues.id,
          user_id: param.dataValues.user1_id === userId ?
          param.dataValues.user2_id :
          param.dataValues.user1_id,
        }
      })

      return result
    },
    async getAllFriendsRequest(_, {userId}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to use this api')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot use this api')
      }

      return await Friendship.findAll({
        where: {
          status: 1,
          user2_id: user.id,
        },
      })
    },
    async getFriendStatus(_, {userId}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to use this api')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot use this api')
      }

      const checkUser = await User.findByPk(userId)
      if (checkUser.dataValues.role !== 2 || userId === user.id) {
        throw new ApolloError('You cannot check friend status')
      }

      const friendship = await Friendship.findOne({
        where: {
          [Op.or]: [
            {
              user1_id: user.id,
              user2_id: userId,
            }, {
              user1_id: userId,
              user2_id: user.id,
            },
          ],
        },
      })

      if (friendship) {
        const result = {
          id: friendship.dataValues.id,
          user_id: friendship.dataValues.user1_id === userId ?
            friendship.dataValues.user2_id :
            friendship.dataValues.user1_id,
          status: friendship.dataValues.status,
        }
        return result
      } else {
        const result = {
          user_id: userId,
          status: 0,
        }
        return result
      }
    },
  },

  Friend: {
    async user(friend) {
      return await User.findByPk(friend.user_id)
    },
  },

  Friendship: {
    async user(friend) {
      return await User.findByPk(friend.user_id)
    },
  },

  FriendRequest: {
    user(friendship) {
      return friendship.getFriends1()
    },
  },

  Mutation: {
    async sendFriendRequest(_, {userId}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to use this api')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot use this api')
      }

      const checkUser = await User.findByPk(userId)
      if (checkUser.dataValues.role !== 2 || userId === user.id) {
        throw new ApolloError('You cannot send friend request')
      }

      const friendship = await Friendship.findOne({
        where: {
          [Op.or]: [
            {
              user1_id: user.id,
              user2_id: userId,
            }, {
              user1_id: userId,
              user2_id: user.id,
            },
          ],
        },
      })

      if (friendship) {
        throw new ApolloError('You cannot send friend request')
      } else {
        return Friendship.create({
          user1_id: user.id,
          user2_id: userId,
          status: 1,
        })
      }
    },
    async acceptFriendRequest(_, {friendshipId}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to use this api')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot use this api')
      }

      await Friendship.update({status: 2}, {
        where: {
          id: friendshipId,
          user2_id: user.id,
          status: 1,
        },
      })

      return {
        message: 'Friend request accepted',
      }
    },
    async unFriend(_, {userId}, {user = null}) {
      if (!user) {
        throw new AuthenticationError('You must login to use this api')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot use this api')
      }
      const checkUser = await User.findByPk(userId)
      if (checkUser.dataValues.role !== 2 || userId === user.id) {
        throw new ApolloError('User cannot be unfiend')
      }

      const friendship = await Friendship.findOne({
        where: {
          status: 2,
          [Op.or]: [
            {
              user1_id: user.id,
              user2_id: userId,
            }, {
              user1_id: userId,
              user2_id: user.id,
            },
          ],
        },
      })

      if (friendship) {
        await friendship.destroy()
        return {
          message: 'Unfriend user success',
        }
      } else {
        throw new ApolloError('Friendship is not exist')
      }
    },
    async declinedFriendRequest(_, {friendshipId}, {user=null}) {
      if (!user) {
        throw new AuthenticationError('You must login to use this api')
      }
      if (user.role !== 2) {
        throw new ApolloError('You cannot use this api')
      }

      const friendship = await findByPk(friendshipId)
      if (friendship) {
        if (friendship.dataValues.user2_id !== user.id) {
          throw new ApolloError('You cannot decline this request')
        }
        if (friendship.dataValues.status !== 1) {
          throw new ApolloError('You cannot decline this request')
        }

        await friendship.destroy()
        return {
          message: 'Declined request successs',
        }
      } else {
        throw new ApolloError('No friend request')
      }
    },
  },
}
