import React, { useState } from 'react'
import {
  Button, Card, message, Modal, Result, Spin, Tag, Tooltip, Typography,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import { PRIORITY } from 'appConstants'
import { GET_TASK, UNARCHIVE_TASK } from 'queries'
import { EditOutlined } from '@ant-design/icons'
import moment from 'moment'

import UserCart from 'screens/components/CreatedByAssignedCard'
import { GetTask } from 'queries/types/GetTask'
import TaskAddAssigneers from './TaskAddAssigneers'
import Comments from './Comments'

const { Paragraph, Title } = Typography
export default ({ id } : { id: string }) => {
  const [UnarchiveTask] = useMutation(UNARCHIVE_TASK)
  const { loading: loadingTask, error: errorTask, data: dataTask } = useQuery<GetTask>(GET_TASK, { variables: { id } })
  const [showAssigmentModal, setAssigmentModal] = useState(false)

  const onUnarchiveTask = () => {
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

  const onFinishAssigment = () => {
    setAssigmentModal(false)
    message.success('Assigment changed')
  }

  const onChangeAssigners = () => {
    setAssigmentModal(true)
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
      { showAssigmentModal && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setAssigmentModal(false)
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
              && (
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
            {moment(createdAt).fromNow()}
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
          ) : null}
        </div>
      </Card>
      <Comments task={id} isReplyAllowed={!isArchived} />
    </>
  )
}
