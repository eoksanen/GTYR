import { gql  } from '@apollo/client'


const USER_DETAILS = gql`

fragment UserDetails on User {
        id
        username
        name
  }
`

export const USER_ADDED = gql`
  subscription {
    userAdded {
      ...UserDetails
    }
  },
   ${USER_DETAILS}
`

export const USER_REMOVED = gql`
subscription {
  userRemoved {
    ...UserDetails
  }
}
${USER_DETAILS}
`