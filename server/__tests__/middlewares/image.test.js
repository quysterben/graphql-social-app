const {uploadImages, destroyImages} = require('../../api/middlewares/image')

const ErrorMessageConstants =
        require('../../api/constants/ErrorMessageConstants')

beforeEach(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('image middleware', () => {
    test('Should throw error without image data', async () => {
        const files = null
        const testFunc = jest.fn(uploadImages)
        const actual = testFunc(files)
        expect(actual).rejects.toThrow(ErrorMessageConstants.NoImageProvided)
    })

    test('Should throw error without image public id', async () => {
        const imagePublicId = null
        const testFunc = jest.fn(destroyImages)
        const actual = testFunc(imagePublicId)
        expect(actual).rejects.toThrow(ErrorMessageConstants.NoImageProvided)
    })
})
