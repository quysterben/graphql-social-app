const friendshipResolvers = require('../api/resolvers/friendship')

const parent = null
const context = {
  user: {
    id: 3,
    role: 2,
  },
}

describe('Friendship Resolvers:', () => {
  it('send friend request', async () => {
    const expected = {

    }
    const args = {
      userId: 5,
    }
    const received = await friendshipResolvers.Mutation.sendFriendRequest(
        parent,
        args,
        context,
    )
    expect(received).toMatchObject(expected)
  })

  it('get all friend request', async () => {
    const expected = [{
      'createdAt': expect.any(Date),
      'id': 3,
      'status': '1',
      'updatedAt': expect.any(Date),
      'user1_id': 6,
      'user2_id': 3,
    }]
    const args = {}
    const received =
      await friendshipResolvers.Query.getAllFriendsRequest(
          parent,
          args,
          context,
      )
    expect(received).toMatchObject(expected)
  })

  it('get all friends', async () => {
    const expected = [
      {
        'id': 1,
        'user_id': 4,
      },
    ]
    const args = {
      userId: 3,
    }
    const received =
      await friendshipResolvers.Query.getAllFriends(parent, args, context)
    expect(received).toMatchObject(expected)
  })

  it('get friend status', async () => {
    const expected = {
      id: 1,
      user_id: 4,
      status: '2',
    }
    const args = {
      userId: 4,
    }
    const received =
      await friendshipResolvers.Query.getFriendStatus(parent, args, context)
    expect(received).toMatchObject(expected)
  })

  it('accept friend request', async () => {
    const expected = {
      message: 'Friend request accepted',
    }
    const args = {
      friendshipId: 3,
    }
    const received =
      await friendshipResolvers.Mutation.acceptFriendRequest(
          parent,
          args,
          context,
      )
    expect(received).toMatchObject(expected)
  })

  it('unfriend', async () => {
    const expected = {
      message: 'Unfriend user success',
    }
    const args = {
      userId: 6,
    }
    const received =
      await friendshipResolvers.Mutation.unFriend(
          parent,
          args,
          context,
      )
    expect(received).toMatchObject(expected)
  })
})
