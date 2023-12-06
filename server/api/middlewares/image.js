const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary')
const {GraphQLError} = require('graphql')
const {v4: uuidv4} = require('uuid');

const ErrorMessageConstants = require('../constants/ErrorMessageConstants');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports.uploadImages = async (files) => {
    if (!files) {
        throw new GraphQLError(ErrorMessageConstants.NoImageProvided)
    }

    const storeUpload = async ({stream}) => {
        const uuid = uuidv4()
        const pathName = path.join(__dirname, `../Upload/${uuid}`)
        return new Promise((resolve, reject) =>
            stream
                .pipe(fs.createWriteStream(pathName))
                .on('finish', () => resolve({pathName}))
                .on('error', reject),
        )
    }

    const processUpload = async (upload) => {
        const {createReadStream} = await upload;
        const stream = createReadStream();
        const file = await storeUpload({stream});
        return file;
      };

    const images = files.map(async (image) => {
        const upload = await processUpload(image.file)
        const pathName = upload.pathName
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
        throw new GraphQLError(ErrorMessageConstants.NoImageProvided)
    }
    const imageRemoved = await cloudinary.v2.uploader.destroy(imagePublicId)
    return imageRemoved
}
