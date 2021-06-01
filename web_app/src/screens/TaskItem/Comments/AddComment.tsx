import React from 'react'
import {
  Comment, Form, Button, Input, message, Tooltip,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { CREATE_COMMENT, CREATE_REPLY_COMMENT } from 'queries'
import AvatarZ from 'screens/components/AvatarZ'
import { gUserMe } from 'appState/appState'

const { TextArea } = Input
type FormProps = React.ComponentProps<typeof Form>
const AddComment = ({
  task,
  previous,
  isArchived,
  onFinish: onFinishArg = () => {},
}:
{
  task?: string,
  isArchived?: boolean,
  previous?: string,
  onFinish?: () => void
}) => {
  const [form] = Form.useForm()
  const [createComment, {
    loading: mutationCreateLoading,
    error: mutationError,
  }] = useMutation(CREATE_COMMENT)
  const [createReplyComment, {
    loading: mutationReplyLoading,
    error: mutationReplyError,
  }] = useMutation(CREATE_REPLY_COMMENT)
  const accountMe = gUserMe()

  const successMessageFn = () => {
    message.success('Comment added')
    form.resetFields()
    onFinishArg()
  }

  const onFinish: FormProps['onFinish'] = (values: any) => {
    if (previous) {
      createReplyComment({
        variables: {
          input: {
            content: values.comment,
            task,
            previous,
          },
        },
        refetchQueries: ['GetComments'],
      }).then(successMessageFn)
    } else if (task) {
      createComment({
        variables: {
          input: {
            content: values.comment,
            task,
          },
        },
        refetchQueries: ['GetComments'],
      }).then(successMessageFn)
    }
  }

  return (
    <Comment
      avatar={(
        <AvatarZ
          avatarSrc={accountMe?.avatar?.uri}
          fullName={accountMe?.fullName}
        />
      )}
      content={(
        <Form form={form} onFinish={onFinish}>

          {isArchived
            ? (
              <Tooltip title="You can not comment on archived task">
                <Form.Item>
                  <TextArea disabled autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
              </Tooltip>
            )
            : (
              <Form.Item name="comment" rules={[{ required: true }]}>
                <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            )}

          <Form.Item
            className={
              css`
            & .ant-form-item-control-input-content { 
              display: flex; justify-content: flex-end;
            }
          `
            }
          >
            {isArchived
              ? (
                <Tooltip title="You can not comment on archived task">
                  <Button
                    disabled
                    ghost
                    type="primary"
                  >
                    Send
                  </Button>
                </Tooltip>
              )
              : (
                <Button
                  htmlType="submit"
                  loading={mutationCreateLoading || mutationReplyLoading}
                  ghost
                  type="primary"
                >
                  Send
                </Button>
              )}

          </Form.Item>
        </Form>
      )}
    />
  )
}

export default AddComment
