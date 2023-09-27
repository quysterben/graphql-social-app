const {Friendship, User} = require('../../models')

const {ApolloError} = require('apollo-server-express');
const {Op} = require('sequelize');

// const {AuthenticationError, ApolloError} = require('apollo-server-express')

module.exports = {
  Query: {
    async getAllFriends(_, {userId}, context) {
      return await Friendship.findAll({
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

      return await Friendship.findOne({
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
    },
  },

  Friendship: {
    user1(friendship) {
      return friendship.getFriends1()
    },
    user2(friendship) {
      return friendship.getFriends2()
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
  },
}
