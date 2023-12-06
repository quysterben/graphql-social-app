const mockFileStream = {
    on: (key, callback) => {
        if (key === 'data') {
            const chunk = Buffer.from('chunk')
            callback(chunk)
        } else {
            callback()
        }

        return mockFileStream
    },
}

const mockFile = (filename, mimetype = 'image/png') => ({
    file: {
        filename,
        mimetype,
        createReadStream: () => mockFileStream,
    },
})

module.exports = mockFile
