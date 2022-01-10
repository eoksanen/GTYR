import { gql  } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CREATE_USER = gql`
mutation createUser($username: String!, $name: String!, $password: String! ) {
  createUser (
        username: $username,
        name: $name,
        password: $password
    ){ ...UserDetails
  }
}

fragment UserDetails on User {
        id
        username
        name

  }
`

export const DELETE_USER = gql`
mutation removeUser($id: String!) {
  removeUser (id: $id) {
    id
    name
    username
  }
}
`

export const TEST = gql`
  mutation test($test: String!) {
    test(test: $test)  {
      test
    }
  }
`

export const EDIT_BORN = gql`
  mutation editBorn($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo)  {
      name
      born
    }
  }
`

