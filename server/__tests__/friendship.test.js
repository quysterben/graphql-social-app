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

beforeEach(() => {})

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
        const sendFriendRequestSpy = jest.spyOn(Mutation, 'sendFriendRequest')
        const actual = await sendFriendRequestSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('send friend request failed - user not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        const sendFriendRequestSpy = jest.spyOn(Mutation, 'sendFriendRequest')
        const actual = sendFriendRequestSpy(parent, args, context)
        expect(actual).rejects.toThrow('User is not exist')
    })

    test('send friend request failed - send to current user', async () => {
        const args = {
            input: {
                userId: 3,
            },
        }
        const sendFriendRequestSpy = jest.spyOn(Mutation, 'sendFriendRequest')
        const actual = sendFriendRequestSpy(parent, args, context)
        expect(actual).rejects.toThrow('You cannot send friend request')
    })

    test('send friend request failed - friend request sent', async () => {
        const args = {
            input: {
                userId: 4,
            },
        }
        const sendFriendRequestSpy = jest.spyOn(Mutation, 'sendFriendRequest')
        const actual = sendFriendRequestSpy(parent, args, context)
        expect(actual).rejects.toThrow('You cannot send friend request')
    })

    test('get all friend request', async () => {
        const args = {}
        const expected = [
            {
                'id': 3,
                'status': '1',
                'user1Id': 6,
                'user2Id': 3,
            },
        ]
        const getAllFriendsRequestSpy = jest.spyOn(
            Query,
            'getAllFriendsRequest',
        )
        const actual = await getAllFriendsRequestSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
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
        const getAllFriendsSpy = jest.spyOn(Query, 'getAllFriends')
        const actual = await getAllFriendsSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
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
        const getFriendStatusSpy = jest.spyOn(Query, 'getFriendStatus')
        const actual = await getFriendStatusSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('get friend status failed - user not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        const getFriendStatusSpy = jest.spyOn(Query, 'getFriendStatus')
        const actual = getFriendStatusSpy(parent, args, context)
        expect(actual).rejects.toThrow('User is not exist')
    })

    test('get friend status failed - get current user friend status',
        async () => {
            const args = {
                input: {
                    userId: 3,
                },
            }
            const getFriendStatusSpy = jest.spyOn(Query, 'getFriendStatus')
            const actual = getFriendStatusSpy(parent, args, context)
            expect(actual).rejects.toThrow('You cannot check friend status')
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
        const acceptFriendRequestSpy = jest.spyOn(
            Mutation,
            'acceptFriendRequest',
        )
        const actual = await acceptFriendRequestSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('accept friend request failed - friend request not exist',
        async () => {
            const args = {
                input: {
                    friendshipId: 100,
                },
            }
            const acceptFriendRequestSpy = jest.spyOn(
                Mutation,
                'acceptFriendRequest',
            )
            const actual = acceptFriendRequestSpy(parent, args, context)
            expect(actual).rejects.toThrow('Friend request is not exist')
        },
    )

    test('accept friend request failed - accept invalid friend request',
        async () => {
            const args = {
                input: {
                    friendshipId: 1,
                },
            }
            const acceptFriendRequestSpy = jest.spyOn(
                Mutation,
                'acceptFriendRequest',
            )
            const actual = acceptFriendRequestSpy(parent, args, context)
            expect(actual).rejects
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
        const unFriendSpy = jest.spyOn(Mutation, 'unFriend')
        const actual = await unFriendSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('unfriend failed - user not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        const unFriendSpy = jest.spyOn(Mutation, 'unFriend')
        const actual = unFriendSpy(parent, args, context)
        expect(actual).rejects.toThrow('User is not exist')
    })

    test('unfriend failed - unfriend current user', async () => {
        const args = {
            input: {
                userId: 3,
            },
        }
        const unFriendSpy = jest.spyOn(Mutation, 'unFriend')
        const actual = unFriendSpy(parent, args, context)
        expect(actual).rejects.toThrow('User cannot be unfiend')
    })

    test('unfriend failed - unfriend not friend user', async () => {
        const args = {
            input: {
                userId: 5,
            },
        }
        const unFriendSpy = jest.spyOn(Mutation, 'unFriend')
        const actual = unFriendSpy(parent, args, context)
        expect(actual).rejects.toThrow('Friendship is not exist')
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
        const declinedFriendRequestSpy = jest.spyOn(
            Mutation,
            'declinedFriendRequest',
        )
        const actual = await declinedFriendRequestSpy(
            parent, args,
            {
                user: {
                    id: 5,
                    role: 2,
                },
            })
        expect(actual).toMatchObject(expected)
    })

    test('decline friend request failed - Invalid friendship', async () => {
        const args = {
            input: {
                friendshipId: 1,
            },
        }
        const declinedFriendRequestSpy = jest.spyOn(
            Mutation,
            'declinedFriendRequest',
        )
        const actual = declinedFriendRequestSpy(parent, args, context)

        expect(actual).rejects.toThrow('You cannot decline this request')
    })

    test('decline friend request failed - Friendship is not exist',
        async () => {
            const args = {
                input: {
                    friendshipId: 100,
                },
            }
            const declinedFriendRequestSpy = jest.spyOn(
                Mutation,
                'declinedFriendRequest',
            )
            const actual = declinedFriendRequestSpy(parent, args, context)

            expect(actual).rejects.toThrow('Friend request is not exist')
        },
    )
})
