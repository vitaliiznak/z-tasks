import React from 'react'
import {
  Select, Form, Spin, Input, Checkbox,
} from 'antd'
import { css } from '@emotion/css'
import { useQuery } from '@apollo/client'
import { PRIORITY } from 'appConstants'
import { GET_USERS } from 'queries'
import { GetUsers } from 'queries/types/GetUsers'

const { Option } = Select

const cssFormItem = css`
  display: block;
  width: 250px;
`
export type TypeTaskFilter = {
  assigners?: string[],
  createdBy?: string[],
  priorities?: string[],
  searchTitle?: string
  searchDescription?: string
  isArchived?: boolean
}
type TypeProps = {
  // eslint-disable-next-line no-unused-vars
  onFilter?: (_filter: TypeTaskFilter)=>void
}

export default ({ onFilter = () => {} }: TypeProps) => {
  const { loading, error, data } = useQuery<GetUsers>(GET_USERS)

  const onValuesChange = (_changedValues: any, allValues: any) => {
    const {
      assigners, priorities, searchTerm, includeDescription, createdBy,
    } = allValues

    const filter: TypeTaskFilter = { assigners, priorities, createdBy }
    if (searchTerm && searchTerm.length) {
      filter.searchTitle = searchTerm
    }
    if (searchTerm && searchTerm.length && includeDescription) {
      filter.searchDescription = searchTerm
    }

    onFilter(filter)
  }

  if (loading) return <Spin />
  if (error) {
    return (
      <span>
        Error! $
        {error.message}
      </span>
    )
  }

  const users = data!.userGetList! as Array<{
    id: string;
    email: string;
    fullName: string;
  }>

  return (
    <Form
      onValuesChange={onValuesChange}
    >
      <div className={css`display: flex;`}>
        <Form.Item
          label="Report to:"
          name="createdBy"
          className={cssFormItem}
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="select authors"
            optionLabelProp="label"
          >
            {users.map(({ id, fullName, email }) => (
              <Option
                key={id}
                value={id}
                label={email}
              >
                <div className="demo-option-label-item">
                  <span role="img" aria-label="USA">
                    {email}
                  </span>
                  <br />
                  {fullName}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className={css`width: 20px;`} />

        <Form.Item
          label="Assigners"
          name="assigners"
          className={cssFormItem}
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="select one assigners"
            optionLabelProp="label"
          >
            {users.map(({ id, fullName, email }) => (
              <Option
                key={id}
                value={id}
                label={email}
              >
                <div className="demo-option-label-item">
                  <span aria-label={email}>
                    {email}
                  </span>
                  <br />
                  {fullName}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className={css`width: 20px;`} />

        <Form.Item
          label="Priorities"
          name="priorities"
          className={cssFormItem}
        >
          <Select
            mode="multiple"
            showSearch
            placeholder="filter by priorities"
            optionLabelProp="label"
          >
            {Object.entries(PRIORITY)
              .map(([key, { title }]: [string, any]) => (
                <Option key={key} value={key} label={title}>
                  <div>
                    {title}
                  </div>
                </Option>
              )) }
          </Select>
        </Form.Item>
      </div>

      <div className={css`display: flex;`}>
        <Form.Item
          label="Text search"
          name="searchTerm"
          className={cssFormItem}
        >
          <Input placeholder="Search by text" />
        </Form.Item>
        <div className={css`width: 10px;`} />
        <Form.Item
          name="includeDescription"
          className={css`display: flex; padding-top: 22px;`}
          valuePropName="checked"
        >
          <Checkbox>
            search within description
          </Checkbox>
        </Form.Item>
      </div>

    </Form>
  )
}