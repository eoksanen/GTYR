import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useLazyQuery } from '@apollo/client'
import { ALL_USERS } from '../queries/query'
import { CREATE_USER } from '../queries/mutation'
import Notify from './Notify'

const UserForm = (props: { setError: (arg0: string | null) => void; show: any; token: any }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')


  const [ createUser ] = useMutation(CREATE_USER, {
    // refetchQueries: [ { query: ALL_USERS } ],
    onError: (error) => {
        props.setError(error.graphQLErrors[0] ? error.graphQLErrors[0].message : null)
    },
    /*
    update: (store, response) => {
      console.log('response mutation createUser ',response.data.createUser)
      props.updateCacheWith(response.data.createUser)
    },
    */
    
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_USERS })
      store.writeQuery({
        query: ALL_USERS,
        data: {
                  // @ts-ignore
          ...dataInStore,
                  // @ts-ignore
          allUsers: [ ...dataInStore.allUsers, response.data.createUser ]
        }
      })
    }
  })


  if (!props.show) {
    return null
  }

  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

   createUser({ variables: { username,  name, password } })
    
    console.log('create user...', createUser)
    console.log('add user...', username, name, password )

    setUsername('')
    setName('')
    setPassword('')
  }


  if(!props.token){
    return null
  }

  return (
    <div>
          <h2> Add User </h2>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
     
        <button type='submit'>create user</button>
      </form>
    </div>
  )
}

export default UserForm