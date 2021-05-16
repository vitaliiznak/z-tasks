import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  NormalizedCacheObject,
} from '@apollo/client'
import link from './link'

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const cache = new InMemoryCache()
export default new ApolloClient<NormalizedCacheObject>({
  link,
  defaultOptions,
  cache,
  // typeDefs
})
