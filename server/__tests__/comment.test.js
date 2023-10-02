const commentResolvers = require('../api/resolvers/comment')

const parent = null
const context = {
  user: {
    id: 3,
    role: 2,
  },
}

describe('Comment Resolvers:', () => {
  it('Create new comment', async () => {
    const expected = {
      id: 5,
      content: 'test cmt',
      userId: 3,
      parentId: 1,
      postId: 1,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    }
    const args = {
      content: 'test cmt',
      postId: 1,
      parentId: 1,
    }
    const received =
      await commentResolvers.Mutation.createComment(parent, args, context)
    expect(received).toMatchObject(expected)
  })
})
