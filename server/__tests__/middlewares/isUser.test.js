
describe('isAuth middleware', () => {
    test('Should throw error without user data', async () => {
        const user = null
        expect(() => isAuth(user)).toThrow('You need to be authenticated')
    })

    test('Should return with user data', async () => {
        const user = {
            id: 1,
            name: 'test',
            email: 'testuser@gmail.com',
        }
        expect(isAuth(user)).toBeUndefined()
    })
})
