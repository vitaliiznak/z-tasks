import React, { ReactElement } from 'react'
import {
  ApolloProvider,
} from '@apollo/client'
import {
  ConfigProvider,
} from 'antd'
import {
  HashRouter as Router,
} from 'react-router-dom'
import MainRoutes from './Routes'
import client from '../apolloClient'
import ErrorBoundary from './ErrorBoundary'

export default (): ReactElement => (
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <Router>
        <ConfigProvider componentSize="small">
          <MainRoutes />
        </ConfigProvider>
      </Router>
    </ApolloProvider>
  </ErrorBoundary>
)
