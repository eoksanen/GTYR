import React , {useEffect} from 'react'
import {useMutation} from '@apollo/client'
import { ALL_USERS } from '../queries/query'
import { DELETE_USER, LOGIN, TEST, CREATE_USER } from '../queries/mutation'
import { User } from '../types'

interface Props  {
  users: {allUsers: User[]},
  setError: (values: string | null) => any, 
  
}

const Users = ({users, setError}: Props) => {


    const [removeUser, user] = useMutation(DELETE_USER, {
      
        //refetchQueries: [{query: ME}],
        onError: (error) => {
          console.log('ERRRROOOR', error)
          setError(error.graphQLErrors[0] ? error.graphQLErrors[0].message : null)
        },

        //refetchQueries: [{query: ALL_USERS}]

        
        update: (store, response) => {

          console.log('responce ',response)
          
          console.log('id ', response.data.removeUser.id)

/*
          store.modify({
            fields: {
              allUsers(existingUserRefs, { readField }) {
                console.log('existingUserRefs ',existingUserRefs)
                console.log('')
                return existingUserRefs.filter(
                  userRef => response.data.removeUser.id !== readField('id', userRef)
                );
              },
            },
          });
*/

/*
          const removedId = store.identify(response.data.removeUser)

          console.log('removedIdFrom apollo cache: ',removedId)
          console.log('removedUser: ',response.data.removeUser)
          const dataInStore = store.readQuery({ query: ALL_USERS })
          const updatedUserListAfterRemove = dataInStore.allUsers.filter(usr => usr.id !== response.data.removeUser.id )
      
     

          console.log('datainStore: ',dataInStore)
          console.log('updatedUserListAfterRemove: ',updatedUserListAfterRemove)
          store.evict({
            // Often cache.evict will take an options.id property, but that's not necessary
            // when evicting from the ROOT_QUERY object, as we're doing here.
            fieldName: "allUsers",
            // No need to trigger a broadcast here, since writeQuery will take care of that.
            broadcast: false,
          });
            store.writeQuery({
            query: ALL_USERS,
            data: {
             // ...dataInStore,
              allUsers: [ ...updatedUserListAfterRemove ]
            }
          })*/

          const id = response.data.removeUser.id

          store.modify({
            // @ts-ignore
            allUsers(list: User[], { readField }: any) {
              return list.filter(n => readField("id", n) !== id);
            },
          });
          
        }
        
    })

    useEffect(() => {
      if ( user.data ) {
  
        console.log('removed user id from server: ',user)
        
      }
    }, [user.data]) // eslint-disable-line

    const [ createUser ] = useMutation(CREATE_USER, {
        // refetchQueries: [ { query: ALL_USERS } ],
        onError: (error) => {
            setError(error.graphQLErrors[0] ? error.graphQLErrors[0].message : null)
        },
       /* 
        update: (store, response) => {
          updateCacheWith(user)
          
        },*/
        /*
        update: (store, response) => {
          const dataInStore = store.readQuery({ query: ALL_BOOKS })
          store.writeQuery({
            query: ALL_BOOKS,
            data: {
              ...dataInStore,
              allBooks: [ ...dataInStore.allBooks, response.data.addBook ]
            }
          })
        }*/
      })


    const deleteUser = (id: React.Key | null | undefined) => {

       removeUser({ variables: {id}})
        
        console.log('removed user id: ',id)
        
        

    }


//if(!show) return null

    return (
        <div>
            <h2>Users</h2>
            <table>
                <tbody>
                <tr>
                    <th>name</th>
                    <th>
                    username
                    </th>

                </tr>
                {users.allUsers.map((a: User ) =>
                    <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.username}</td>
                    <td><button onClick={()=>deleteUser(a.id)}>DEL</button></td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )

}

export default Users