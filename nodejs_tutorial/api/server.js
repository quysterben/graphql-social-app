const express = require('express')
const {createServer} = require('http')
const {ApolloServer} = require('apollo-server-express')
const {graphqlUploadExpress} = require('graphql-upload')
const cors = require('cors')
const typeDefs = require('./schemas')
const resolvers = require('./resolvers')
const context = require('./contexts')
const app = express()

app.use(cors())
app.use(graphqlUploadExpress())

const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: {
      settings: {
        'schema.polling.enable': false,
      },
    },
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({app, path: '/api'})
}

startServer()

const server = createServer(app)

module.exports = server
