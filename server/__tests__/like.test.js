const likeResolvers = require('../api/resolvers/like')

const parent = null
const context = {
    user: {
        id: 4,
        role: 2,
    },
}

const Mutation = likeResolvers.Mutation
let likeOrDislikePostSpy

beforeEach(() => {
    likeOrDislikePostSpy = jest.spyOn(Mutation, 'likePost')
})

afterEach(() => {
    jest.restoreAllMocks()
})


describe('Like Resolvers:', () => {
    test('Like post', async () => {
        const expected = {
            id: 5,
            postId: 1,
        }
        const args = {
            input: {
                postId: 1,
            },
        }
        expect(await likeOrDislikePostSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('Dislike post', async () => {
        const args = {
            input: {
                postId: 1,
            },
        }
        expect(await likeOrDislikePostSpy(parent, args, context))
            .toBeNull()
    })

    test('Like or Dislike post failed', async () => {
        const args = {
            input: {
                postId: 100,
            },
        }
        expect(likeOrDislikePostSpy(parent, args, context))
            .rejects.toThrow('Unable to like this post')
    })
})
