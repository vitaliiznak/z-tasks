import React from 'react'
import {
  Button, Form, Result, Select, Spin,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import { GET_TASK, GET_USERS, UPDATE_TASK } from 'queries'
import { UpdateTask } from 'queries/types/UpdateTask'
import { GetUsers } from 'queries/types/GetUsers'
import { GetTask } from 'queries/types/GetTask'

const cssFormItem = css`
  display: block;
`

export default ({ id, onFinish } : { id: string, onFinish: Function }) => {
  const { loading: loadingTask, error: errorTask, data: dataTask } = useQuery<GetTask>(GET_TASK, { variables: { id } })
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery<GetUsers>(GET_USERS)
  const [updateTask] = useMutation<UpdateTask>(UPDATE_TASK)
  const [form] = Form.useForm()


  const onFinishAssigment = ({ assigners }: { assigners: string[] }) => {
    const initialAssigners = (dataTask?.taskGetById?.assigners || []).map(({ id: idArg }: any) => idArg)
    const assignersRemove = initialAssigners.filter((removeCadidate: string) => !assigners.includes(removeCadidate))
    const assignersAdd = assigners.filter((addCadidate: string) => !initialAssigners.includes(addCadidate))
    updateTask({
      variables: {
        id,
        input: {
          assignersAdd,
          assignersRemove,
        },
      },
      refetchQueries: ['GetTasks', 'GetTask'],
    }).then((_res) => {
      onFinish()
      form.resetFields()
    })
  }

  if (loadingTask || loadingUsers) return <Spin size="large" />
  if (errorTask || errorUsers) {
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
        extra={(
          <a href="/">
            go to main page
          </a>
        )}
      />
    )
  }
  const initialValues = {
    assigners: (dataTask?.taskGetById?.assigners || []).map(({ id: idArg }: any) => idArg),
  }
  return (
    <Form
      initialValues={initialValues}
      onFinish={onFinishAssigment}
    >
      <Form.Item
        name={['assigners']}
        label="Add/remove assigners:"
        className={cssFormItem}
      >
        <Select
          mode="multiple"
          showSearch
          placeholder="Select a person"
          optionFilterProp="label"
          filterOption={
            (input, option) => (option!.label as string)
              .toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {(dataUsers?.userGetList || [])
            .map(({ id: idArg, fullName, email }: any) => (
              <Select.Option
                key={idArg}
                value={idArg}
                label={email}
              >
                <div
                  className={css`
                          display: flex;
                        `}
                >
                  <div className="demo-option-label-item">
                    <span role="img" aria-label="USA">
                      {email}
                    </span>
                    <br />
                    {fullName}
                  </div>
                </div>
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <div
        className={css`
              display: flex;
              justify-content: flex-end;
            `}
      >
        <Button ghost htmlType="submit" type="primary">Save</Button>
      </div>
    </Form>
  )
}
