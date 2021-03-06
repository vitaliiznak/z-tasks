import React from 'react'
import {
  Card
} from 'antd'
import { css } from '@emotion/css'
import LoginForm from 'screens/LoginForm'
import SignupForm from 'screens/SignupForm'

export default () => (
  <Card
    title={(
      <div>
        <h2>
          Hi, you have been invited to one of the Z-tasks boards
          {' '}
        </h2>
        <p>
          Please login to see the invitation
        </p>
      </div>
    )}
    className={css`
        max-width: 1000px;
        width: 900px;
        margin: 0 auto;
        margin-top:5%;
        & > .ant-card-body {
          display:flex;
          justify-content:space-between;
          flex-direction: row;
        }
      `}
  >
    <Card
      title={<h2>Enter to an existing account</h2>}
      className={css`
                max-width:520px;
                width: 470px;
                flex: 0.4;
            `}
    >
      <LoginForm />
    </Card>
    <Card
      title={<h2>Create an account</h2>}
      className={css`
                max-width: 520px;
                width: 470px;
                flex: 0.4;
            `}
    >
      <SignupForm />
    </Card>
  </Card>
)
