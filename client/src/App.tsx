import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient, useSubscription, InMemoryCache  } from '@apollo/client'
import Notify from './components/Notify'
import Users from './components/Users'
import { User } from './types'
import UserForm from './components/UserForm'
import { ALL_USERS } from './queries/query'
import { USER_ADDED, USER_REMOVED } from './queries/subscription'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"

import './App.css';

function App() {
  //const [page, setPage] = useState('welcome')
  const [token, setToken] = useState(localStorage.getItem('zero-user-token') ? localStorage.getItem('zero-user-token') : null)
  const [errorMessage, setErrorMessage] = useState(null)
  const[ user, setUser ] = useState(null)

  const client = useApolloClient()


  const allUsers = useQuery(ALL_USERS)

  const updateCacheWith = (addedUser: User) => {
    console.log('addedUser ',addedUser)
    const includedIn = (set: { id: string }[], object: User) => 
      set.map((p: { id: string }) => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_USERS })
    console.log('Cache already updated ',includedIn(dataInStore.allUsers, addedUser))
    
    if (!includedIn(dataInStore.allUsers, addedUser)) {
      client.writeQuery({
        query: ALL_USERS,
        data: { allUsers : dataInStore.allUsers.concat(addedUser) }
      })
      
    } 
    
  }

  const updateCacheWithR = (removedUser: User) => {
    console.log('removedUser ',removedUser)



    const idToRemove = removedUser.id;
/*
cache.modify({
  // id: client.identify(removedUser),
  fields: {
    allUsers(existingUserRefs, { readField }) {
      console.log('existingUserRefs ',existingUserRefs)
      return existingUserRefs.filter(
        userRef => idToRemove !== readField('id', userRef)
      );
    },
  },
});
*/



    const includedIn = (set: { id: string }[], object: User) => 
      set.map((p: { id: string }) => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_USERS })
    console.log('redQuery ALL_USERS: ',dataInStore)
    console.log('Cache already updated ',includedIn(dataInStore.allUsers, removedUser))
    if (includedIn(dataInStore.allUsers, removedUser)) {





/*
const dataInStore = client.readQuery({ query: ALL_USERS })
*/

      const updatedUserListAfterRemove = dataInStore.allUsers.filter((user: { id: String }) => user.id !== removedUser.id)
      console.log('updatedUserListAfterRemove ',updatedUserListAfterRemove)
      client.cache.evict({
        // Often cache.evict will take an options.id property, but that's not necessary
        // when evicting from the ROOT_QUERY object, as we're doing here.
        fieldName: "allUsers",
        // No need to trigger a broadcast here, since writeQuery will take care of that.
        broadcast: false,
      });
      client.writeQuery({
        query: ALL_USERS,

        data: { allUsers: [ ...updatedUserListAfterRemove ] }
      })
      
    } 
  }

  console.log('all Users ',allUsers)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message: React.SetStateAction<null>) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useSubscription(USER_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('subscriptionData ',subscriptionData.data.userAdded)

      const addedUser = subscriptionData.data.userAdded
      //console.log(addedUser.name, 'addedSubscription')
      //notify(`${addedUser.name} added`)
      updateCacheWith(addedUser)
    }
  })

  useSubscription(USER_REMOVED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('subscriptionData ',subscriptionData.data.userRemoved)

      const removedUser = subscriptionData.data.userRemoved
      //console.log(addedUser.name, 'addedSubscription')
      //notify(`${addedUser.name} added`)
      updateCacheWithR(removedUser)
    }
  })


 if (allUsers.loading)  {
  return <div>loading...</div>
}

const padding = {
  padding: 5
}

  return (
    <div className="App">


<table className='menu'>
        <tbody>
          <tr>
            <td><Link style={padding} to="/">Home</Link></td>
            <td><Link style={padding} to="/users">users</Link></td>
            <td><Link style={padding} to="/addUser">adduser</Link></td>
            <td>      
              {token === null ?
              <Link style={padding} to="/login">login</Link> :  <p style={padding}>{user} logged in</p>}
            </td>
            <td> 
            {token === null ? null :
              <button onClick={() => logout()}>logout</button>}
            </td>
          </tr>
        </tbody>
      </table>

      <div>
      <Notify errorMessage={errorMessage} />
  </div>


    <Switch>
      <Route path="/users">
      <Users
        show={true}
        users = {allUsers.data}
        // @ts-ignore
        setError = {setErrorMessage}
      />
      </Route>
      <Route path="/addUser">
      <UserForm
        show={true}
                // @ts-ignore
        setError={notify}
        token={token}    
        updateCacheWith={updateCacheWith} 
      />

      </Route>
      <Route path="/login">
      <LoginForm
        setError={notify}
        setUser={setUser}
        setToken={setToken}
        token={token}     
      />

      </Route>
      <Route path="/">
      
      </Route>
    </Switch>


    </div>
  );
}

export default App;
