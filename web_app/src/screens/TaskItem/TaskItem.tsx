import React, { useState } from 'react'
import {
  Button, Card, message, Modal, Result, Spin, Tag, Tooltip, Typography,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import { PRIORITY } from 'appConstants'
import { ARCHIVE_TASK, GET_TASK, UNARCHIVE_TASK } from 'queries'
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import moment from 'moment'


import UserCart from 'screens/components/CreatedByAssignedCard'
import { GetTask } from 'queries/types/GetTask'
import { Link } from 'react-router-dom'
import TaskAddAssigneers from './TaskAddAssigneers'
import Comments from './Comments'

const { confirm } = Modal

const { Paragraph, Title } = Typography
const TaskItem = ({ id } : { id: string }) => {
  const [unarchiveTask] = useMutation(UNARCHIVE_TASK)
  const [archiveTask] = useMutation(ARCHIVE_TASK)
  const { loading: loadingTask, error: errorTask, data: dataTask } = useQuery<GetTask>(GET_TASK, { variables: { id } })
  const [assignTaskTaskModalParams, setAssignTaskTaskModal] = useState<{ taskId: string } | null>(null)

  const onUnarchiveTask = () => {
    unarchiveTask({
      variables: {
        id,
      },
      refetchQueries: ['GetTasks', 'GetTask'],
    })
      .then(() => {
        message.success('Task has been unarchived!')
      })
  }

  const onArchiveTask = () => {
    confirm({
      title: 'Do you want to archive this task?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Yes',
      onOk() {
        archiveTask({
          variables: {
            id,
          },
          refetchQueries: ['GetTasks', 'GetTask'],
        })
          .then(() => {
            message.success('Task has been unarchived!')
          })
      },
    })
  }

  const onFinishAssigment = () => {
    setAssignTaskTaskModal(null)
    message.success('Assigment changed')
  }

  const onChangeAssigners = () => {
    setAssignTaskTaskModal({ taskId: id })
  }

  if (loadingTask) return <Spin size="large" />
  if (errorTask) {
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

  const task = dataTask!.taskGetById
  if (!task) {
    return (
      <Result
        status="warning"
        title="No such tasks or you have not access to see it"
        extra={
          <a href="/">go to main page</a>
        }
      />
    )
  }

  const {
    title,
    description,
    priority,
    assigners,
    createdBy,
    isArchived,
    createdAt,
  } = dataTask!.taskGetById!

  return (
    <>
      { Boolean(assignTaskTaskModalParams) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setAssignTaskTaskModal(null)
          }}
          title={dataTask?.taskGetById?.title}
          visible
          footer={false}
        >
          <TaskAddAssigneers
            id={id}
            onFinish={onFinishAssigment}
          />
        </Modal>
      )}

      <Card className={css`padding: 10px 10px;`}>
        <div className={css`display: flex; justify-content: space-between;`}>
          <div>
            <Title level={3}>{title}</Title>
            <Tag color={PRIORITY[priority].color}>{priority}</Tag>
          </div>
          <div>
            <h6>Report to:</h6>
            <UserCart {...{
              fullName: createdBy.fullName,
              email: createdBy.email as string,
              id: createdBy.id,
              avatar: createdBy.avatar as any,
            }}
            />
            <br />
            <h6>
              Assigners:
              {isArchived
                ? (
                  <Tooltip title="You can not change assigners for archived task" className={css`margin-left: 8px;`}>
                    <Button disabled ghost icon={<EditOutlined />} size="small" />
                  </Tooltip>
                )
                : (
                  <Tooltip title="Change assigners" className={css`margin-left: 8px;`}>
                    <Button onClick={onChangeAssigners} ghost type="primary" icon={<EditOutlined />} size="small" />
                  </Tooltip>
                )}
            </h6>
            {assigners.map(({
              fullName, email, id: idArg, avatar,
            }: any) => (
              <UserCart
                key={id}
                {...{
                  fullName, email, id: idArg, avatar,
                }}
              />
            ))}
          </div>
        </div>
        <Paragraph>
          {description}
        </Paragraph>
        <div
          className={
            css`
              display: flex;
            `
          }
        >
          <small>
            Created
            {' '}
            {moment(createdAt).fromNow()}
            <br />
            by
            {' '}
            <Link to={`/members/${id}`}>
              {' '}
              {`${createdBy.fullName} - ${createdBy.email}` }
              {' '}
            </Link>
          </small>
          {isArchived ? (
            <Button
              ghost
              type="primary"
              className={css`
                margin-left: auto;
                color: orange;
                border-color: orange;
                &:focus, &:focus, &:hover {
                  color: orange;
                  border-color: orange;
                } 
              `}
              onClick={onUnarchiveTask}
            >
              Unarchive
            </Button>
          )
            : (
              <Button
                ghost
                type="primary"
                className={css`
                  margin-left: auto;
                  color: orange;
                  border-color: orange;
                  &:focus, &:focus, &:hover {
                    color: orange;
                    border-color: orange;
                  } 
                `}
                onClick={onArchiveTask}
              >
                Archive task
              </Button>
            )}
        </div>
      </Card>
      <Comments task={id} isArchived={isArchived} />
    </>
  )
}


export default TaskItem
