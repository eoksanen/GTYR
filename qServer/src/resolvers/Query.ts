export{}
const User = require("../models/user")

const Query = {
    me: async (root, args, context) => {

      return context.currentUser

    },
    allUsers: async () => {
      return await User.find({},{name:1, username:1})
    }
}

module.exports = Query