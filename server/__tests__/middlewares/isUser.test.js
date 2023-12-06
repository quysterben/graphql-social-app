const isUser = require('../../api/middlewares/isUser')
const ErrorMessageConstants =
        require('../../api/constants/ErrorMessageConstants')

describe('isUser middleware', () => {
    test('Should throw error with admin data', () => {
        const user = {
            id: 1,
            name: 'test',
            role: 'admin',
        }
        const testFunc = jest.fn(isUser)
        const actual = () => testFunc(user)
        expect(actual).toThrow(ErrorMessageConstants.IsNotUser)
    })

    test('Should return with user data', () => {
        const user = {
            id: 1,
            name: 'test',
            role: 'user',
            email: 'testuser@gmail.com',
        }
        const testFunc = jest.fn(isUser)
        const actual = testFunc(user)
        expect(actual).toBeUndefined()
    })
})
