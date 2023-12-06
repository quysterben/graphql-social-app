/* eslint-disable new-cap */
const express = require('express')

const {createServer} = require('http')
const {ApolloServer} = require('@apollo/server')
const {graphqlUploadExpress} = require('graphql-upload')

const {WebSocketServer} = require('ws')
const {useServer} = require('graphql-ws/lib/use/ws')
const {expressMiddleware} = require('@apollo/server/express4')
const {ApolloServerPluginDrainHttpServer} =
    require('@apollo/server/plugin/drainHttpServer')
const {makeExecutableSchema} = require('@graphql-tools/schema')

const cors = require('cors')
const bodyParser = require('body-parser')
bodyParser.json({limit: '10mb', extended: true, type: 'application/json'})

const typeDefs = require('./schemas')
const resolvers = require('./resolvers')
const context = require('./contexts')

const schema = makeExecutableSchema({typeDefs, resolvers})

const app = express()
app.use('/csv-exports', express.static('./api/csv-exports'))
app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10})) // 10mb
app.use(bodyParser.urlencoded({extended: true}));

const httpServer = createServer(app)

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
});

const serverCleanup = useServer(
    {
        schema,
        context: async (ctx, msg, args) => {
            return await context.socketAuth(ctx)
        },
    },
    wsServer,
);

const startServer = async () => {
    const apolloServer = new ApolloServer({
        schema,
        uploads: false,
        csrfPrevention: false,
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    })

    await apolloServer.start()

    app.use('/api', cors(),
        bodyParser.json(),
        expressMiddleware(apolloServer, {context: context.auth}));
}

startServer()


module.exports = httpServer
