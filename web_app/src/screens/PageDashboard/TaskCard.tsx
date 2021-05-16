import React from 'react'
import {
  Card, Tag, Tooltip, Typography,
} from 'antd'
import { css } from '@emotion/css'
import { Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
import { PRIORITY } from 'appConstants'
import UserCart from 'screens/components/CreatedByAssignedCard'
import { gSelectedBoard } from 'appState/appState'

const { Paragraph, Title } = Typography


export default ({
  index,
  task: {
    id,
    title,
    priority,
    createdBy,
    assigners,
    description,
  },
} : {
  index: number
  task: {
    id: string
    title: string
    priority: string
    createdBy: any
    assigners: any[]
    description: string,
    isArchived: boolean
  }
}) => {
  const board = gSelectedBoard()
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className={css`margin: 8px 8px 8px 8px;position: relative;`}>
            <div
              className={css`
                display: flex; 
                justify-content: space-between;
                padding-top: 18px;
              `}
            >
              <div>
                <Tooltip title="open in new tab">
                  <Link
                    target="_blank"
                    to={`/b/${board!.id}/tasks/${id}`}
                  >
                    <Title level={5}>{title}</Title>
                  </Link>
                </Tooltip>
                <Tag color={PRIORITY[priority].color}>{priority}</Tag>
              </div>
              <div
                className={
                  css`
                  width: 8px;`
                }
              />
              <div
                className={
                  css`
                    max-width: 94px;
                    padding-right: 4px;`
                }
              >
                <h6>Report to:</h6>
                <UserCart {...createdBy} />
                <br />
                <h6>Assigners:</h6>
                {assigners.map(({
                  fullName, email, id: idAssigner, avatar,
                }: any) => (
                  <UserCart
                    key={id}
                    {...{
                      fullName,
                      email,
                      id: idAssigner,
                      avatar,
                    }}
                  />
                ))}
              </div>
            </div>
            <Paragraph
              ellipsis={{ rows: 3 }}
              copyable
            >
              {description}
            </Paragraph>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
