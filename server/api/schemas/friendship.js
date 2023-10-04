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
        getAllFriends(input: FriendRelationInput!): [Friend!]
        getAllFriendsRequest: [FriendRequest!]
        getFriendStatus(input: FriendRelationInput!): Friendship!
    }

    extend type Mutation {
        sendFriendRequest(input: FriendRelationInput!): 
            SendFriendRequestResponse!
        unFriend(input: FriendRelationInput!): UnfriendResponse!
        acceptFriendRequest(input: FriendshipInput!): 
            AcceptFriendRequestResponse!
        declinedFriendRequest(input: FriendshipInput!): 
            DeclinedFriendRequestResponse!
    }

    input FriendRelationInput {
        userId: Int!
    }

    input FriendshipInput {
        friendshipId: Int!
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
