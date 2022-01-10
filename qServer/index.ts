
const { ApolloServer,
  // UserInputError, gql 
} = require('apollo-server-express')
// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
//import http from 'http';

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

const mongoosei = require('mongoose')
const jwt = require('jsonwebtoken')
const user = require('./src/models/user')
const config = require('./src/utils/config')

const requireGraphQLFile = require('require-graphql-file')

const cors = require('cors')

//const Subscription = require('./src/resolvers/Subscription')
//const Mutation = require('./src/resolvers/Mutation')
//const Query = require('./src/resolvers/Query')
const resolvers = require('./src/resolvers/resolvers')
const typeD = requireGraphQLFile('./graphql/schema')

// import { Query } from './resolvers/Query'
// import Mutation from './resolvers/Mutation'


console.log(process.env.MONGODB_URI)

const MONGODB_URI = config.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoosei.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error: { message: any; }) => {
    console.log('error connection to MongoDB:', error.message)
  })


//console.log(typeD)


async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express();
  app.use(cors())

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const httpServer = createServer(app);
  const server = new ApolloServer({ schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.SECRET
        )
        const currentUser = await user
          .findById(decodedToken.id).populate('friends')
        return { currentUser }
      }
    },
   // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
   plugins: [{
    async serverWillStart() {
      return {
        async drainServer() {
          subscriptionServer.close();
        }
      };
    }
  }],
        
  })

  const subscriptionServer = SubscriptionServer.create({
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe,
 }, {
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
 });
 
  await server.start();
  server.applyMiddleware({ app });
                  // @ts-ignore
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeD, resolvers);