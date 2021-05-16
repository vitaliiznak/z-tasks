import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { css } from '@emotion/css'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { COUNT_TASKS } from 'queries'
import { gSelectedBoard } from 'appState/appState'
import { CountTasks } from 'queries/types/CountTasks'

export default () => {
  const board = gSelectedBoard()
  const { data } = useQuery<CountTasks>(COUNT_TASKS, {
    variables:
      {
        filter:
         { isArchived: true },
      },
  })
  return (
    <Droppable
      droppableId="TO_ARCHIVE"
      ignoreContainerClipping
    >
      {(provided) => (
        <div className={css`height: 250px;`}>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={css`
              height: 250px;
              border: 2px dashed orange; 
              width: 200px; 
              display: flex;
              flex-direction: column;
              justify-content:center;
              margin-top: 27px;
              margin-left: 10px;
              align-items:center;`}
          >
            Send to archive
            <br />
            <br />
            {data?.taskCount}
            {' '}
            archived tasks
            <Link
              type="primary"
              to={`/b/${board?.id}/archive-tasks`}
              className="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
            >
              Open archive

            </Link>
          </div>
        </div>
      )}
    </Droppable>
  )
}
