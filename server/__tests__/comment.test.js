const commentResolvers = require('../api/resolvers/comment')

const parent = null
const context = {
    user: {
        id: 3,
        role: 2,
    },
}

const Mutation = commentResolvers.Mutation
let createCommentSpy

beforeEach(() => {
    createCommentSpy = jest.spyOn(Mutation, 'createComment')
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('Comment Resolvers:', () => {
    test('Create new comment', async () => {
        const expected = {
            id: 5,
            content: 'test cmt',
            userId: 3,
            parentId: 1,
            postId: 1,
        }
        const args = {
            input: {
                content: 'test cmt',
                postId: 1,
                parentId: 1,
            },
        }
        expect(await createCommentSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('Create comment fail - parent comment not exist', async () => {
        const args = {
            input: {
                content: 'test cmt',
                postId: 1,
                parentId: 10,
            },
        }
        expect(createCommentSpy(parent, args, context))
            .rejects
            .toThrow('Comment is not exist')
    })

    test('Create comment fail - post not exist', async () => {
        const args = {
            input: {
                content: 'test cmt',
                postId: 10,
            },
        }
        expect(createCommentSpy(parent, args, context))
            .rejects
            .toThrow('Post is not exist')
    })
})
