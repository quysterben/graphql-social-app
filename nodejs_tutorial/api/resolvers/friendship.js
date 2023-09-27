const {Friendship} = require('../../models')

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

      const checkUser = await Friendship.findOne({
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

      if (checkUser) {
        return checkUser.dataValues.status;
      } else {
        return 0;
      }
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
}
