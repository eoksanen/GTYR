const { ApolloServer, UserInputError, gql } = require('apollo-server')

//const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const user = require('./src/models/user')
const config = require('./src/utils/config')

//const requireGraphQLFile = require('require-graphql-file')

const Subscription = require('./src/resolvers/Subscription')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const resolvers = require('./resolvers/resolvers')
//const typeD = requireGraphQLFile('./graphql/schema')

// import { Query } from './resolvers/Query'
// import Mutation from './resolvers/Mutation'


console.log(process.env.MONGODB_URI)

const MONGODB_URI = config.MONGODB_URI

console.log('connecting to', MONGODB_URI)

user.mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


//console.log(typeD)

const server = new ApolloServer({
    typeDefs: './graphql/schema',
    resolvers,
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
    }
  })
  
  server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
  })