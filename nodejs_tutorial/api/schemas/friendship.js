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
      getFriendStatus(userId: Int!): Friendship!
    }

    extend type Mutation {
      sendFriendRequest(userId: Int!): SendFriendRequestResponse!
      acceptFriendRequest(friendshipId: Int!): String!
      unFriend(userId: Int!): String!
    }

    type SendFriendRequestResponse {
      id: Int!
      status: Int!
    }

`
