const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary')
const {GraphQLError} = require('graphql')
const {v4: uuidv4} = require('uuid');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports.uploadImages = async (files) => {
        if (!files) throw new GraphQLError('No image providd')

        const images = files.map(async (image) => {
            const {createReadStream} = await image.file
            const stream = await createReadStream()
            const uuid = uuidv4()
            const pathName = path.join(__dirname, `../Upload/${uuid}`)
            const output = fs.createWriteStream(pathName)
            await stream.pipe(output)
            const imageUrl = await cloudinary.v2.uploader.upload(
                pathName,
                {folder: 'res/images'},
            )
            fs.unlinkSync(pathName)
            return imageUrl
        })

        const result = await Promise.all(images)
        return result
    }

module.exports.destroyImages = async (imagePublicId) => {
    if (!imagePublicId) {
        throw new GraphQLError('No image url')
    }
    const imageRemoved = await cloudinary.v2.uploader.destroy(imagePublicId)
    return imageRemoved
}
