const friendshipResolvers = require('../api/resolvers/friendship')

const parent = null
const context = {
    user: {
        id: 3,
        role: 2,
    },
}

const Query = friendshipResolvers.Query
const Mutation = friendshipResolvers.Mutation

let sendFriendRequestSpy
let getAllFriendsRequestSpy
let getAllFriendsSpy
let getFriendStatusSpy
let acceptFriendRequestSpy
let declinedFriendRequestSpy
let unFriendSpy

beforeEach(() => {
    sendFriendRequestSpy = jest.spyOn(Mutation, 'sendFriendRequest')
    getAllFriendsRequestSpy = jest.spyOn(Query, 'getAllFriendsRequest')
    getAllFriendsSpy = jest.spyOn(Query, 'getAllFriends')
    getFriendStatusSpy = jest.spyOn(Query, 'getFriendStatus')
    acceptFriendRequestSpy = jest.spyOn(Mutation, 'acceptFriendRequest')
    declinedFriendRequestSpy = jest.spyOn(Mutation, 'declinedFriendRequest')
    unFriendSpy = jest.spyOn(Mutation, 'unFriend')
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('Friendship Resolvers:', () => {
    test('send friend request', async () => {
        const expected = {}
        const args = {
            input: {
                userId: 5,
            },
        }
        expect(await sendFriendRequestSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('send friend request failed - user is not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        expect(sendFriendRequestSpy(parent, args, context))
            .rejects
            .toThrow('User is not exist')
    })

    test('send friend request failed - send to current user', async () => {
        const args = {
            input: {
                userId: 3,
            },
        }
        expect(sendFriendRequestSpy(parent, args, context))
            .rejects
            .toThrow('You cannot send friend request')
    })

    test('send friend request failed - friend request sent', async () => {
        const args = {
            input: {
                userId: 4,
            },
        }
        expect(sendFriendRequestSpy(parent, args, context))
            .rejects
            .toThrow('You cannot send friend request')
    })

    test('get all friend request', async () => {
        const expected = [
            {
                'id': 3,
                'status': '1',
                'user1Id': 6,
                'user2Id': 3,
            },
        ]
        const args = {}
        expect(await getAllFriendsRequestSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('get all friends', async () => {
        const expected = [
            {
                'id': 1,
                'userId': 4,
            },
        ]
        const args = {
            input: {
                userId: 3,
            },
        }
        expect(await getAllFriendsSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('get friend status', async () => {
        const expected = {
            id: 1,
            userId: 4,
            status: '2',
        }
        const args = {
            input: {
                userId: 4,
            },
        }
        expect(await getFriendStatusSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('get friend status failed - user is not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        expect(getFriendStatusSpy(parent, args, context))
            .rejects
            .toThrow('User is not exist')
    })

    test('get friend status failed - get current user friend status',
        async () => {
            const args = {
                input: {
                    userId: 3,
                },
            }
            expect(getFriendStatusSpy(parent, args, context))
                .rejects
                .toThrow('You cannot check friend status')
        },
    )

    test('accept friend request', async () => {
        const expected = {
            message: 'Friend request accepted',
        }
        const args = {
            input: {
                friendshipId: 3,
            },
        }
        expect(await acceptFriendRequestSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('accept friend request failed - friend request is not exist',
        async () => {
            const args = {
                input: {
                    friendshipId: 100,
                },
            }
            expect(acceptFriendRequestSpy(parent, args, context))
                .rejects
                .toThrow('Friend request is not exist')
        },
    )

    test('accept friend request failed - accept invalid friend request',
        async () => {
            const args = {
                input: {
                    friendshipId: 1,
                },
            }
            expect(acceptFriendRequestSpy(parent, args, context))
                .rejects
                .toThrow('You cannot accept this friend request')
        },
    )

    test('unfriend', async () => {
        const expected = {
            message: 'Unfriend user success',
        }
        const args = {
            input: {
                userId: 6,
            },
        }
        expect(await unFriendSpy(parent, args, context)).toMatchObject(expected)
    })

    test('unfriend failed - user is not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        expect(unFriendSpy(parent, args, context))
            .rejects
            .toThrow('User is not exist')
    })

    test('unfriend failed - unfriend current user', async () => {
        const args = {
            input: {
                userId: 3,
            },
        }
        expect(unFriendSpy(parent, args, context))
            .rejects
            .toThrow('User cannot be unfiend')
    })

    test('unfriend failed - unfriend not friend user', async () => {
        const args = {
            input: {
                userId: 5,
            },
        }
        expect(unFriendSpy(parent, args, context))
            .rejects
            .toThrow('Friendship is not exist')
    })

    test('decline friend request', async () => {
        const args = {
            input: {
                friendshipId: 2,
            },
        }
        const expected = {
            message: 'Declined request success',
        }
        expect(await declinedFriendRequestSpy(
            parent, args,
            {
                user: {
                    id: 5,
                    role: 2,
                },
            }))
            .toMatchObject(expected)
    })

    test('decline friend request failed - Invalid friendship', async () => {
        const args = {
            input: {
                friendshipId: 1,
            },
        }
        expect(declinedFriendRequestSpy(parent, args, context))
            .rejects
            .toThrow('You cannot decline this request')
    })

    test('decline friend request failed - Friendship is not exist',
        async () => {
            const args = {
                input: {
                    friendshipId: 100,
                },
            }
            expect(declinedFriendRequestSpy(parent, args, context))
                .rejects
                .toThrow('Friend request is not exist')
        },
    )
})
