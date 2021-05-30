/* eslint-disable semi */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button } from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { LOGIN } from 'queries'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../../appConstants'

const cssFormItem = css`
  display: block;
`

type FormProps = React.ComponentProps<typeof Form>
export default (
  { footerButtons = undefined }: { footerButtons?: React.ReactElement },
): React.ReactElement => {
  const [error, setError] = useState<any>(null)
  const [login, { loading, data }] = useMutation(LOGIN)
  const onFinish: FormProps['onFinish'] = (variables: any) => {
    login({
      variables: {
        ...variables,
      },
    }).catch((err: any) => {
      setError(err)
    })
  }

  useEffect(() => {
    if (data?.accountLogin?.token?.length) {
      localStorage.setItem(
        AUTH_TOKEN_LOCALSTORAGE_KEY,
        data.accountLogin.token,
      )
      window.location.reload()
    }
  }, [data])

  return (
    <Form
      name="Login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      className={css`
        width: 100%;
      `}
    >
      <Form.Item
        className={cssFormItem}
        label="Emal"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          {
            type: 'email',
            message: 'not an email',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className={cssFormItem}
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      {error?.graphQLErrors?.some(
        ({ extensions }: any) => extensions?.code === 'UNAUTHENTICATED',
      ) && (
        <div
          className={css`
            color: red;
          `}
        >
          Invalid credentials
        </div>
      )}
      <div
        className={css`
          display: flex;
          width: 100%;
        `}
      >
        {footerButtons}
        <Button
          loading={loading}
          className={css`
            margin-left: auto;
          `}
          ghost
          type="primary"
          htmlType="submit"
        >
          Enter
        </Button>
      </div>
    </Form>
  )
}
