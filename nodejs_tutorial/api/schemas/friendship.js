const {gql} = require('apollo-server-express')

module.exports = gql`

    type Friendship {
      id: Int!
      user1: User!
      user2: User!
      status: Int!
    }

    type FriendRequest {
      id: Int!
      user: User!
    }

    extend type Query {
      getAllFriends(userId: Int!): [Friendship!]
      getAllFriendsRequest: [FriendRequest!]
      getFriendStatus(userId: Int!): Int!
    }

`
