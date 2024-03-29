import React from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import Auth from './utils/auth'

const httpLink = createHttpLink({
  uri: '/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = Auth.getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})


function App() {
  return (
    <ApolloProvider client={client}>
    <BrowserRouter>
      <>
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
        </Routes>
      </>
    </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
