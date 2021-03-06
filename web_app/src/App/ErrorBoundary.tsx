/* eslint-disable react/prop-types */
import React from 'react'
import { Result, Button } from 'antd'
import ContactSupport from 'globalNotifications/ContactSupport'

export default class ErrorBoundary extends React.Component {
  state = { error: undefined }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(__error: any, __errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { error } = this.state
    const { children } = this.props
    if (error) {
      // You can render any custom fallback UI
      return (
        <Result
          status="error"
          title="There are some problems with the system."
          extra={(
            <Button
              onClick={() => {
                window.location.reload()
              }}
              type="primary"
              key="console"
            >
              Reload
            </Button>
          )}
        >
          <ContactSupport error={error} />
        </Result>
      )
    }

    return children
  }
}
