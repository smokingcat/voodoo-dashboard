import { createApp } from 'vue'
import { createApolloProvider } from '@vue/apollo-option'
import App from './App.vue'
import router from './router'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://interview-api.voodoo-dev.io/graphql'
})

// Cache implementation
const cache = new InMemoryCache()

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

app.use(router)
app.use(apolloProvider)
app.use(ElementPlus)

app.mount('#app')
