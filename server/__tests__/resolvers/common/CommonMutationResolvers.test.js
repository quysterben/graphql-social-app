/* eslint-disable max-len */
const CommonMutationResolvers = require('../../../api/resolvers/common/CommonMutationResolvers')

const parent = null

beforeEach(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('CommonMutationResolvers', () => {
    test('register - should throw with invalid data', async () => {
        const args = {
            input: {
                name: '',
                email: '',
                password: '',
            },
        }
        const context = {}
        const testFunc = jest.spyOn(CommonMutationResolvers.Mutation, 'register')
        const actual = testFunc(parent, args, context)
        expect(actual).rejects.toThrow()
    })
})
