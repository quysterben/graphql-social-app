const userResolvers = require('../api/resolvers/user')

const parent = null
const context = null

test('get all users', async () => {
  const expected = [
    {
      'id': 3,
      'name': 'User1',
      'email': 'user1@test.com',
      'createdAt': new Date('2022-12-21T01:00:00.000Z'),
      'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
    },
    {
      'id': 4,
      'name': 'User2',
      'email': 'user2@test.com',
      'createdAt': new Date('2022-12-21T01:00:00.000Z'),
      'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
    },
    {
      'id': 5,
      'name': 'User3',
      'email': 'user3@test.com',
      'createdAt': new Date('2022-12-21T01:00:00.000Z'),
      'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
    },
    {
      'id': 6,
      'name': 'User4',
      'email': 'user4@test.com',
      'createdAt': new Date('2022-12-21T01:00:00.000Z'),
      'updatedAt': new Date('2022-12-21T01:00:00.000Z'),
    },
  ]

  const received = await userResolvers.Query.getAllUsers()

  expect(received).toMatchObject(expected)
})

test('login', async () => {
  const args = {
    input: {
      email: 'user1@test.com',
      password: '12345678',
    },
  }

  const expected = {
    'id': 3,
    'name': 'User1',
    'email': 'user1@test.com',
    // eslint-disable-next-line max-len
    'token': expect.any(String),
    'role': 2,
  }

  const received = await userResolvers.Mutation.login(parent, args, context)
  expect(received).toMatchObject(expected)
})
