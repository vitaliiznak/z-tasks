/* eslint-disable semi */
import React, { useState } from 'react'
import {
  Form, Input, Button, Card, Skeleton, Typography
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import { GET_INVITE_BY_ID, JOIN_BOARD } from 'queries'
import { useHistory, useParams } from 'react-router-dom'

const { Text } = Typography

const cssFormItem = css`
  display: block;
`

type FormProps = React.ComponentProps<typeof Form>
export default (
  { footerButtons = undefined }: { footerButtons?: React.ReactElement },
): React.ReactElement => {
  const history = useHistory()
  const { inviteId } = useParams<{ inviteId: string }>()
  const [errorToShow, setErrorMessage] = useState<any>('')
  const { loading, data, error } = useQuery(GET_INVITE_BY_ID, { variables: { id: inviteId } })

  const [joinBoard, { loading: loadingJoinBoard, data: joinBoardResult, error: joinBoardError }] = useMutation(JOIN_BOARD)

  const onFinish: FormProps['onFinish'] = (variables: any) => {
    joinBoard({
      variables: {
        input: { id: inviteId, ...variables },
      },
    })
      .then((res) => {
        if (!res?.data?.inviteJoinBoard) {
          setErrorMessage('The token is invalid or link has been expired')
          // throw new Error('The token is invalid or link has been expired')
        } else {
          history.push(`/b/${data?.inviteGetById?.board?.id}`)
        }
        return res
      })
      .catch((err: any) => {
        if (err?.graphQLErrors?.some(
          ({ message }: any) => message.includes('duplicate'),
        )) {
          setErrorMessage(`You already a member of ${data?.inviteGetById?.board?.title} board`)
        } else {
          setErrorMessage('Some error occurred please try again')
        }
      })
  }

  const onValuesChange = () => {
    if (errorToShow?.length) {
      setErrorMessage('')
    }
  }

  if (data?.inviteGetById?.state !== 'NEW') {
    return (
      <Skeleton
        className={css`
          max-width: 520px;
          width: 470px;
          margin: 0 auto;
          margin-top:5%;
          &  .ant-card-body {
            display:flex;
            justify-content:space-between;
            flex-direction: row;
            color: red;
          }
        `}
        loading={loading || loadingJoinBoard}
      >
        <Card
          title={(
            <div>
              <p>
                <span className={css`
                  color: red;
                  font-size: 20px;
                `}
                >
                  Invitation link has been expired or invalid
                </span>
                <br />
                please request a new one
              </p>

            </div>
          )}
        />
      </Skeleton>
    )
  }


  return (
    <Card
      className={css`
          max-width: 520px;
          width: 470px;
          margin: 0 auto;
          margin-top:5%;
          & > .ant-card-body {
            display:flex;
            justify-content:space-between;
            flex-direction: row;
          }
        `}
      title={(
        <div>
          <h2>
            Hi, you have been invited to the
            {' '}
            {data?.inviteGetById?.board?.title}
            {' '}
            board
            {' '}
          </h2>
          Invitation message
          {' '}
          <br />
          <Text type="secondary">{data?.inviteGetById?.description}</Text>
        </div>
      )}
    >
      <Form
        name="joinBoard"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        className={css`
        width: 100%;
      `}
      >
        <Form.Item
          className={cssFormItem}
          label="Access token"
          name="token"
          rules={[
            { required: true, message: 'Please input your access token!' },
          ]}
        >
          <Input />
        </Form.Item>
        <div
          className={css`
          display: flex;
          width: 100%;
        `}
        >
          <div className={css`
                  color: red;
                `}
          >
            {errorToShow}
          </div>
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
            Join the board
          </Button>
        </div>
      </Form>
    </Card>
  )
}
