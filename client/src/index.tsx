import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { setContext } from 'apollo-link-context'
import App from './App';

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'

import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { BrowserRouter as Router } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';



const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('zero-user-token')
  console.log('TOKEN ', token)
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
          // @ts-ignore
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(
    /*{
    typePolicies: {
      Query: {
        fields: {
          project: {
            merge: true,
          }
        }
      }
    }
  }*/
  ),
  link: splitLink
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
        </Router>
    </ApolloProvider>, 
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
