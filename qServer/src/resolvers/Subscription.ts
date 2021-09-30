export{}
const mutation = require('./mutation.ts')

const { AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()


  const Subscription = {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(['USER_ADDED'])
    }
}


module.exports = Subscription