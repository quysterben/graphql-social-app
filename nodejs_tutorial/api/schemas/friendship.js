const {gql} = require('apollo-server-express')

module.exports = gql`

    type Friendship {
      id: Int
      user: User!
      status: Int!
    }

    type Friend {
      id: Int!
      user: User!
    }

    type FriendRequest {
      id: Int!
      user: User!
    }

    extend type Query {
      getAllFriends(userId: Int!): [Friend!]
      getAllFriendsRequest: [FriendRequest!]
      getFriendStatus(userId: Int!): Friendship!
    }

    extend type Mutation {
      sendFriendRequest(userId: Int!): SendFriendRequestResponse!
      acceptFriendRequest(friendshipId: Int!): AcceptFriendRequestResponse!
      declinedFriendRequest(friendshipId: Int!): DeclinedFriendRequestResponse!
      unFriend(userId: Int!): UnfriendResponse!
    }

    type SendFriendRequestResponse {
      id: Int!
      status: Int!
    }

    type AcceptFriendRequestResponse {
      message: String!
    }

    type DeclinedFriendRequestResponse {
      message: String!
    }

    type UnfriendResponse {
      message: String!
    }

`
