import React from 'react'
import { css } from '@emotion/css'
import { gSelectedBoard } from 'appState/appState'
import CommentsList from './CommentsList'
import AddComment from './AddComment'

const Comments = ({ task, isArchived = true }: { task: string, isArchived?: boolean }) => {
  const board = gSelectedBoard()
  return (
    <div
      className={css`
        padding-left: 40px;
    `}
    >
      <h3>Comments</h3>
      <AddComment isArchived={isArchived} task={task} />
      <CommentsList boardId={board!.id} filter={{ task }} isArchived={isArchived} />
    </div>
  )
}

export default Comments
