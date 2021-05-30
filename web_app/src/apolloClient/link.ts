import {
  onError,
} from '@apollo/client/link/error'

import { createUploadLink } from 'apollo-upload-client'

import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../appConstants'
import openModalRelogin from '../globalNotifications/openModalRelogin'

/* const resetToken = onError(({ networkError }) => {
  if (networkError && networkError.name === 'ServerError') {
    // remove cached token on 401 from the server
    token = null
  }
}) */

const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)}`,
  },
})

const linkErrorGeneral = onError(({ graphQLErrors, networkError }) => {
  let isPotentialExpiredToken = false
  const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
  if (graphQLErrors) {
    graphQLErrors.forEach(({
      message, locations, extensions, path,
    }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`,
      )
      if (token
        && extensions?.code === 'UNAUTHENTICATED'
        && !path?.includes('authLogin')) {
        isPotentialExpiredToken = true
      }
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }

  if (isPotentialExpiredToken && token && token.length) {
    openModalRelogin()
  }

  /*
    const grapQLUntreatedErrors = graphQLErrors?.filter(({ extensions }) => extensions?.code !== 'UNAUTHENTICATED')
    if (grapQLUntreatedErrors?.length || networkError) {
      openModalContactSupport({
        grapQLUntreatedErrors,
        networkError
      })
    }
    */
})

/* const linkErrorUnauthorized = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      openAuthModal()
    })
  }
})
 */

export default linkErrorGeneral.concat(
  // linkErrorUnauthorized.concat(
  uploadLink.concat(
    uploadLink,
  ),
  // )
)
