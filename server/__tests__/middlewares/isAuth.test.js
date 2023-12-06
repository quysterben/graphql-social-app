const isAuth = require('../../api/middlewares/isAuth')

const ErrorMessageConstants =
                    require('../../api/constants/ErrorMessageConstants')

beforeEach(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('isAuth middleware', () => {
    test('Should throw error without user data', () => {
        const user = null
        const testFunc = jest.fn(isAuth)
        const actual = () => testFunc(user)
        expect(actual).toThrow(ErrorMessageConstants.NotAuthorized)
    })

    test('Should return with user data', () => {
        const user = {
            id: 1,
            name: 'test',
            email: 'testuser@gmail.com',
        }
        const testFunc = jest.fn(isAuth)
        const actual = testFunc(user)
        expect(actual).toBeUndefined()
    })
})
