const userResolvers = require('../api/resolvers/user')

const parent = null
const context = null

const Query = userResolvers.Query
const Mutation = userResolvers.Mutation

let getAllUsersSpy
let getOneUserSpy
let loginSpy
let registerSpy

beforeEach(() => {
    getAllUsersSpy = jest.spyOn(Query, 'getAllUsers')
    getOneUserSpy = jest.spyOn(Query, 'getOneUser')
    loginSpy = jest.spyOn(Mutation, 'login')
    registerSpy = jest.spyOn(Mutation, 'register')
})

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
        expect(await getAllUsersSpy(parent, args, context))
            .toMatchObject(expected)
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
        expect(await getOneUserSpy(parent, args, context))
            .toMatchObject(expected)
    })

    test('get one user failed - user is not exist', async () => {
        const args = {
            input: {
                userId: 100,
            },
        }
        expect(getOneUserSpy(parent, args, context))
            .rejects
            .toThrow('User is not exist')
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
        expect(await loginSpy(parent, args, context)).toMatchObject(expected)
    })

    test('login - password incorrect', async () => {
        const args = {
            input: {
                email: 'user1@test.com',
                password: '123456789',
            },
        }
        expect(loginSpy(parent, args, context)).rejects
            .toThrow('Invalid credentials')
    })

    test('login - email incorrect', async () => {
        const args = {
            input: {
                email: 'user10@test.com',
                password: '12345678',
            },
        }
        expect(loginSpy(parent, args, context)).rejects
            .toThrow('Invalid credentials')
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
        expect(await registerSpy(parent, args, context)).toMatchObject(expected)
    })

    test('register - email existed', async () => {
        const args = {
            input: {
                name: 'testUser',
                email: 'user1@test.com',
                password: '12345678',
            },
        }
        expect(registerSpy(parent, args, context))
            .rejects.toThrow('User existed')
    })
})
