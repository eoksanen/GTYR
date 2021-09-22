require('dotenv').config()

export{}

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'zero') {
  MONGODB_URI = process.env.MONGODB_URI_GQL
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGO_GQ
}

module.exports = {
  MONGODB_URI,
  PORT
}