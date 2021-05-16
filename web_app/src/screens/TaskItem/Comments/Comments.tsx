import React from 'react'
import { css } from '@emotion/css'
import { gSelectedBoard } from 'appState/appState'
import CommentsList from './CommentsList'
import AddComment from './AddComment'

export default ({ task, isReplyAllowed = false }: { task: string, isReplyAllowed?: boolean }) => {
  const board = gSelectedBoard()
  return (
    <div
      className={css`
        padding-left: 40px;
    `}
    >
      <h3>Comments</h3>
      <CommentsList boardId={board!.id} filter={{ task }} isReplyAllowed={isReplyAllowed} />
      {isReplyAllowed ? <AddComment task={task} /> : null}
    </div>
  )
}
