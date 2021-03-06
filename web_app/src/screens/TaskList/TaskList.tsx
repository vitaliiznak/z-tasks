import React from 'react'
import {
  Table, Card, Tag, Tooltip, message, Button,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'

import { Link } from 'react-router-dom'
import { PRIORITY } from 'appConstants'
import { GET_TASKS, UNARCHIVE_TASK } from 'queries'
import AvatarZ from 'screens/components/AvatarZ'
import { gSelectedBoard } from 'appState/appState'
import { GetTasks } from 'queries/types/GetTasks'
import TaskItem from '../TaskItem'
import { TypeTaskFilter } from './Filter'

const auxStylesContainer = css`
max-width: 1000px;
margin-left: auto;
margin-right: auto;
`

const TaskList = ({
  title = null,
  filter = {},
  className = '',
}: {
  title?: JSX.Element | null,
  filter?: TypeTaskFilter,
  className?: string
}) => {
  const stylesContainer = `
    ${auxStylesContainer}
    ${className}
  `
  const board = gSelectedBoard()
  const { loading, data } = useQuery<GetTasks>(GET_TASKS, {
    variables: {
      filter: { ...filter, board: board!.id },
    },
  })
  const [UnarchiveTask] = useMutation(UNARCHIVE_TASK)

  const onUnarchiveTask = (id: string) => (_ev: any) => {
    UnarchiveTask({
      variables: {
        id,
      },
      refetchQueries: ['GetTasks'],
    })
      .then(() => {
        message.success('Task has been unarchived!')
      })
  }
  const columns = [
    {
      title: 'Title',
      key: 'title',
      render: ({ id, title: titleArg }: any) => (
        <div>
          <div>
            <Link type="primary" target="_blank" to={`/b/${board!.id}/tasks/${id}`}>
              <strong>{titleArg}</strong>
            </Link>
          </div>
          <small className={css`font-size: 9px;`}>
            {id}
          </small>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={PRIORITY[priority].color}>{priority}</Tag>,
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (state: string) => <Tag>{state}</Tag>,
    },
    {
      title: 'Report to',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: ({
        fullName, email, avatar, id,
      }: any) => (
        <Tooltip
          placement="topLeft"
          title={(
            <div
              className={css`
                display: flex;
              `}
            >
              <AvatarZ avatarSrc={avatar?.uri} fullName={fullName} />
              <div
                className={css`
                  padding-left: 4px;
              `}
              >
                <div>
                  <Link target="_blank" to={`/b/${board!.id}/members/${id}`}>
                    {fullName}
                  </Link>
                </div>
                <div className={css`font-size: 11px;`}>{email}</div>
              </div>
            </div>
          )}
          arrowPointAtCenter
        >
          <div>{fullName}</div>
          <div className={css`font-size: 11px;`}>{email}</div>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: string, { id, isArchived }: any) => (
        <div
          className={css`
          display: flex;
        `}
        >
          { isArchived && (
            <>
              <Button
                ghost
                size="small"
                onClick={onUnarchiveTask(id)}
                className={css`
                  margin-left: auto;
                  color: orange;
                  border-color: orange;
                  &:focus, &:focus, &:hover {
                    color: orange;
                    border-color: orange;
                  } 
              `}
              >
                Unarchive
              </Button>
              <div
                className={css`
              width: 8px;
            `}
              />
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card
      title={title}
      className={stylesContainer}
    >
      <Table
        rowKey="id"
        loading={loading}
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        columns={columns}
        dataSource={(data?.tasks || []) as any[]}
        expandable={{
          expandedRowRender: ({ id }: any) => (<TaskItem id={id} />),
          rowExpandable: () => true,
        }}
      />
    </Card>
  )
}

export default TaskList
