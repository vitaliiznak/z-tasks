import React, { FunctionComponent, ReactElement } from 'react'
import {
  Form, Input, Button, message,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import { CREATE_BOARD } from 'queries'
import { CreateBoard } from 'queries/types/CreateBoard'

const cssFormItem = css`
  display: block;
`
type FormProps = React.ComponentProps<typeof Form>
export default ({
  className = '',
  onDone = (_newCreatedBoard: {
    id: string
  }) => {},
  form: formArg,
  footer: Footer = ((props?: any) => (
    <div
      className={
        css`
      display: flex;
      justify-content: flex-end;
    `
      }
    >
      <Button type="primary" htmlType="submit" ghost loading={props.saving}>
        Create
      </Button>
    </div>
  )),
}: {
  className?: string | undefined,
  form?: FormInstance<any>,
  footer?: FunctionComponent<any> | null,
  onDone?: Function
}) => {
  const [localForm] = Form.useForm()
  const form = formArg || localForm
  const [createBoard, {
    loading: loadingCreateBoard,
  }] = useMutation<CreateBoard>(CREATE_BOARD)

  const onFinish: FormProps['onFinish'] = (values) => {
    createBoard({
      variables: {
        input: values,
      },
      refetchQueries: ['GetBoards', 'GetBoard'],
    }).then((res) => {
      onDone(res.data!.board)
      message.success('Board has been created!')
      form.resetFields()
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <Form
      className={className}
      scrollToFirstError
      form={form}
      onFinish={onFinish}
      initialValues={{
        description: '',
        attachments: [],
        assigners: [],
      }}
    >
      <Form.Item
        name={['title']}
        label="Title"
        rules={[{ required: true, min: 3 }]}
        className={cssFormItem}
      >
        <Input />
      </Form.Item>
      {Footer && <Footer saving={loadingCreateBoard} /> }
    </Form>
  )
}
