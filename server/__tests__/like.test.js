const likeResolvers = require('../api/resolvers/like')

const parent = null
const context = {
    user: {
        id: 4,
        role: 2,
    },
}

const Mutation = likeResolvers.Mutation

beforeEach(() => {})

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
        const likeOrDislikePostSpy = jest.spyOn(Mutation, 'likePost')
        const actual = await likeOrDislikePostSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('Dislike post', async () => {
        const args = {
            input: {
                postId: 1,
            },
        }
        const likeOrDislikePostSpy = jest.spyOn(Mutation, 'likePost')
        const actual = await likeOrDislikePostSpy(parent, args, context)
        expect(actual).toBeNull()
    })

    test('Like or Dislike post failed', async () => {
        const args = {
            input: {
                postId: 100,
            },
        }
        const likeOrDislikePostSpy = jest.spyOn(Mutation, 'likePost')
        const actual = likeOrDislikePostSpy(parent, args, context)
        expect(actual).rejects.toThrow('Unable to like this post')
    })
})
