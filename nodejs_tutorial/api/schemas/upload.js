const {gql} = require('apollo-server-express')

module.exports = gql`
   scalar Upload
   type Query {
      _:String
   }
   type Mutation {
      _:String
   }

   type SuccessMessage {
      message: String
   }

   extend type Mutation {
      uploadImages(files: [Upload]!, postId: Int!): SuccessMessage
   }

`
