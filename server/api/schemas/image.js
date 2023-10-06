const {gql} = require('apollo-server-express')

module.exports = gql`
    scalar Upload

    type Image {
        id: Int!,
        imageUrl: String!
    }

    type SuccessMessage {
        message: String
    }

    extend type Mutation {
        uploadImages(files: [Upload]!, postId: Int!): SuccessMessage

        uploadAvatar(file: Upload!): User!

        uploadWallpaper(file: Upload!): User!
    }

`
