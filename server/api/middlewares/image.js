const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary')
const {ApolloError} = require('apollo-server-express')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports.uploadImages = async (files) => {
    if (!files) {
        throw new ApolloError('No image providd')
    }

    const imageUrls = files.map(async (file) => {
        const {createReadStream, filename} = await file.file
        const stream = createReadStream()
        const pathName = path.join(__dirname, `../Upload/${filename}`)
        await stream.pipe(fs.createWriteStream(pathName))
        const imageUrl =
        await cloudinary.v2.uploader.upload(pathName, {folder: 'res/images'})
        fs.unlinkSync(pathName)
        return imageUrl.url
    })

    const result = await Promise.all(imageUrls)
    return result
    }

module.exports.destroyImages = async (imageUrl) => {
    if (!imageUrl) {
        throw new ApolloError('No image url')
    }
    const imageRemoved = await cloudinary.v2.uploader.destroy(imageUrl)
    return imageRemoved
}
