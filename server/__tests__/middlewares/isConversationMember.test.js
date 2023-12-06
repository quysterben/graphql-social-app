const isConversationMember =
                    require('../../api/middlewares/isConversationMember')

const ErrorMessageConstants =
                    require('../../api/constants/ErrorMessageConstants')

beforeEach(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('isConversationMember middleware', () => {
    test('Should return true with conversation member data', () => {
        const user = {
            id: 3,
            name: 'user1',
        }
        const conversation = {
            getConversationMembers: jest.fn().mockReturnValue([
                {
                    id: 3,
                    name: 'user1',
                },
            ]),
        }
        const testFuncSpy = jest.fn(isConversationMember)
        const actual = testFuncSpy(conversation, user)
        expect(actual).resolves.toBe(true)
    })

    test('Should throw error with non-conversation member data', () => {
        const user = {
            id: 3,
            name: 'user1',
        }
        const conversation = {
            getConversationMembers: jest.fn().mockReturnValue([]),
        }
        const testFuncSpy = jest.fn(isConversationMember)
        const actual = testFuncSpy(conversation, user)
        expect(actual).rejects.toThrow(
            ErrorMessageConstants.IsNotConversationMember,
        )
    })
})
