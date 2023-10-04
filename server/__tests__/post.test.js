const postResolvers = require('../api/resolvers/post')

const parent = null
const context = {
    user: {
        id: 3,
        role: 2,
    },
}

const Query = postResolvers.Query
const Mutation = postResolvers.Mutation

beforeEach(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('Post Resolvers:', () => {
    test('create post', async () => {
        const args = {
            input: {
                title: 'TestPost',
                content: 'ABCDEFG',
            },
        }
        const expected = {
            id: 4,
            title: 'TestPost',
            content: 'ABCDEFG',
        }
        const createPostSpy = jest.spyOn(Mutation, 'createPost')
        const actual = await createPostSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('get all posts', async () => {
        const args = {}
        const expected = [
            {
                id: 1,
                title: 'Test1',
                content: 'This is test post',
                userId: 3,
            },
            {
                id: 2,
                title: 'Test2',
                userId: 4,
                content: 'This is test post',
            },
            {
                id: 3,
                title: 'Test3',
                userId: 3,
                content: 'This is test post',
            },
            {
                id: 4,
                title: 'TestPost',
                content: 'ABCDEFG',
                userId: 3,
            },
        ]
        const getAllPostsSpy = jest.spyOn(Query, 'getAllPosts')
        const actual = await getAllPostsSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('get single post', async () => {
        const expected = {
            id: 1,
            title: 'Test1',
            content: 'This is test post',
            userId: 3,
        }
        const args = {
            input: {
                postId: 1,
            },
        }
        const getSinglePostSpy = jest.spyOn(Query, 'getSinglePost')
        const actual = await getSinglePostSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('get single post failed - post is not exist', async () => {
        const args = {
            input: {
                postId: 10,
            },
        }
        const getSinglePostSpy = jest.spyOn(Query, 'getSinglePost')
        const actual = getSinglePostSpy(parent, args, context)
        expect(actual).rejects.toThrow('Post is not exist')
    })
})
