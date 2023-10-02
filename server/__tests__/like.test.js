const likeResolvers = require('../api/resolvers/like')

const parent = null
const context = {
  user: {
    id: 4,
    role: 2,
  },
}

describe('Like Resolvers:', () => {
  it('Like post', async () => {
    const expected = {
      id: 5,
      postId: 1,
    }
    const args = {
      postId: 1,
    }
    const received =
         await likeResolvers.Mutation.likePost(parent, args, context)
    expect(received).toMatchObject(expected)
  })

  it('Dislike post', async () => {
    const args = {
      postId: 1,
    }
    const received =
      await likeResolvers.Mutation.likePost(parent, args, context)
    expect(received).toBeNull()
  })
})
