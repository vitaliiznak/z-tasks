import React, { useState } from 'react'
import {
  Form, Input, Button, message,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { CREATE_INVITE } from 'queries'
import { gSelectedBoard } from 'appState/appState'

const { TextArea } = Input

const cssFormItem = css`
  display: block;
`

const InviteNew = ({
  className = ''
}: {
  className?: string | undefined
}) => {
  const [form] = Form.useForm()
  const [invite, setInvite] = useState<any>()
  const [createInvite] = useMutation(CREATE_INVITE)
  const board = gSelectedBoard()

  const onFinish = (values: object) => {
    createInvite({
      variables: {
        input: { boardId: board!.id, ...values },
      }
      // refetchQueries: ['GetBoards', 'GetBoard'],
    }).then((res) => {
      message.success('Board has been created!')
      const inviteCreated = res.data.inviteCreate
      setInvite(inviteCreated)
      // form.resetFields()
      // onDone(res.data.board)
    })
  }

  const isLinkCreated = invite && invite.state === 'NEW'

  return isLinkCreated ? (
    <div className={className}>
      <div className={css`height: 20px;`} />
      <Form.Item
        className={cssFormItem}
      >
        <TextArea
          disabled
          value={invite.description}
          autoSize={{ minRows: 2, maxRows: 7 }}
        />

      </Form.Item>
      <p className={css`padding-bottom: 12px;`}>
        Send the link and the token to a person you would like to invite
        <br />
        <br />
        <p>
          Invitation link:
          <br />
          <strong className={css`font-size:11px;`}>
            {`${window.location.protocol}//${window.location.host}/p/invites/${invite.id}`}
          </strong>
          <br />
          Token:
          <br />
          <strong className={css`font-size:11px;`}>
            {invite.token}
          </strong>
        </p>
      </p>
      <div className={css`display: flex; justify-content: space-between;`}>
        <Button size="middle" danger ghost type="primary" htmlType="submit">Generate new link</Button>
        <Button size="middle" ghost type="primary" htmlType="submit">Copy link & token</Button>
      </div>
    </div>

  ) : (

    <Form
      className={className}
      scrollToFirstError
      form={form}
      onFinish={onFinish}
      initialValues={{
        description: '',
      }}
    >
      <h4>
        Add some invitation text for receiver
        <br />
        ( Hi, welcome to our board ... )
      </h4>
      <Form.Item
        name={['description']}
        label=""
        rules={[{ required: true, min: 3, message: 'Invitation text is required' }]}
        className={cssFormItem}
      >
        <TextArea
          autoSize={{ minRows: 2, maxRows: 7 }}
        />
      </Form.Item>
      <div className={css`display: flex; justify-content: flex-end;`}>
        <Button size="middle" ghost type="primary" htmlType="submit">Generate invitation link</Button>
      </div>
    </Form>
  )
}

export default InviteNew
