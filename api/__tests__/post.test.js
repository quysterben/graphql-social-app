const postResolvers = require('../api/resolvers/post')

const parent = null
const context = null

describe('Post Resolvers:', () => {
  it('get all posts', async () => {
    const expected = [
      {
        'id': 1,
        'title': 'Test1',
        'content': 'This is test post',
        'userId': 3,
        'createdAt': new Date('2022-12-21T01:00:00.000Z'),
        'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
      },
      {
        'id': 2,
        'title': 'Test2',
        'userId': 4,
        'content': 'This is test post',
        'createdAt': new Date('2022-12-21T01:00:00.000Z'),
        'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
      },
      {
        'id': 3,
        'title': 'Test3',
        'userId': 3,
        'content': 'This is test post',
        'createdAt': new Date('2022-12-21T01:00:00.000Z'),
        'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
      },
    ]
    const received = await postResolvers.Query.getAllPosts(parent, {}, context)
    expect(received).toMatchObject(expected)
  })

  it('get one post', async () => {
    const expected = {
      'id': 1,
      'title': 'Test1',
      'content': 'This is test post',
      'userId': 3,
      'createdAt': new Date('2022-12-21T01:00:00.000Z'),
      'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
    }
    const args = {
      postId: 1,
    }
    const received =
      await postResolvers.Query.getSinglePost(parent, args, context)

    expect(received).toMatchObject(expected)
  })
})
