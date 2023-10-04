const userResolvers = require('../api/resolvers/user')

const parent = null
const context = null

const Query = userResolvers.Query
const Mutation = userResolvers.Mutation

beforeEach(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('User Resolvers:', () => {
    test('get all users', async () => {
        const args = {}
        const expected = [
            {
                'id': 3,
                'name': 'User1',
                'email': 'user1@test.com',
            },
            {
                'id': 4,
                'name': 'User2',
                'email': 'user2@test.com',
            },
            {
                'id': 5,
                'name': 'User3',
                'email': 'user3@test.com',
            },
            {
                'id': 6,
                'name': 'User4',
                'email': 'user4@test.com',
            },
        ]
        const getAllUsersSpy = jest.spyOn(Query, 'getAllUsers')
        const actual = await getAllUsersSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('get one user', async () => {
        const args = {
            input: {
                userId: 3,
            },
        }
        const expected = {
            'id': 3,
            'name': 'User1',
            'email': 'user1@test.com',
        }
        const getOneUserSpy = jest.spyOn(Query, 'getOneUser')
        const actual = await getOneUserSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('get one user failed - user not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        const getOneUserSpy = jest.spyOn(Query, 'getOneUser')
        const actual = getOneUserSpy(parent, args, context)
        expect(actual).rejects.toThrow('User is not exist')
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
            'token': expect.any(String),
            'role': 2,
        }
        const loginSpy = jest.spyOn(Mutation, 'login')
        const actual = await loginSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('login - password incorrect', async () => {
        const args = {
            input: {
                email: 'user1@test.com',
                password: '123456789',
            },
        }
        const loginSpy = jest.spyOn(Mutation, 'login')
        const actual = loginSpy(parent, args, context)
        expect(actual).rejects.toThrow('Invalid credentials')
    })

    test('login - email incorrect', async () => {
        const args = {
            input: {
                email: 'user10@test.com',
                password: '12345678',
            },
        }
        const loginSpy = jest.spyOn(Mutation, 'login')
        const actual = loginSpy(parent, args, context)
        expect(actual).rejects.toThrow('Invalid credentials')
    })

    test('register', async () => {
        const args = {
            input: {
                name: 'testUser',
                email: 'testRegister@test.com',
                password: '12345678',
            },
        }
        const expected = {
            id: 7,
            name: 'testUser',
            email: 'testRegister@test.com',
        }
        const registerSpy = jest.spyOn(Mutation, 'register')
        const actual = await registerSpy(parent, args, context)
        expect(actual).toMatchObject(expected)
    })

    test('register - email existed', async () => {
        const args = {
            input: {
                name: 'testUser',
                email: 'user1@test.com',
                password: '12345678',
            },
        }
        const registerSpy = jest.spyOn(Mutation, 'register')
        const actual = registerSpy(parent, args, context)
        expect(actual).rejects.toThrow('User existed')
    })
})
