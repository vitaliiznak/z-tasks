import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_COMMENTS } from 'queries'
import { css } from '@emotion/css'
import { Tooltip } from 'antd'
import { HashLink } from 'react-router-hash-link'
import { GetComments } from 'queries/types/GetComments'
import Comment from './Comment'

interface TCommentsProps {
  isArchived: boolean
  boardId: string
  filter: {
    task: string
    createdBy?: string
  }
}

const CommentsList = ({ filter, boardId, isArchived }: TCommentsProps) => {
  const { data: commentsQueryData } = useQuery<GetComments>(GET_COMMENTS, {
    variables: {
      filter,
      withReplies: {
        limit: 20,
      },
    },
  })
  if (!commentsQueryData) return null
  const { commentGetList: comments } = commentsQueryData
  const commentsMap = comments.reduce((accum: any, comment: any) => {
    if (!comment.previous) {
      return {
        ...accum,
        [comment.id]: {
          ...comment,
          replies: [],
        },
      }
    }
    const topComment = accum[comment.previous] || {}
    return {
      ...accum,
      [comment.id]: {
        ...comment,
        replies: [],
      },
      [comment.previous]: {
        ...topComment,
        id: comment.previous,
        replies: [...(topComment.replies || []), comment.id],
      },
    }
  }, {})

  const commentsToShow = Object.values(commentsMap)
  return !commentsToShow.length
    ? <div className={css`text-align: center;`}>no comments yet</div>
    : (
      <>
        {commentsToShow.map((comment: any) => (
          <div
            id={comment.id}
            key={comment.id}
          >
            <Comment
              linkAuthor={`/b/${boardId}/members/${comment.createdBy.id}`}
              comment={{
                ...comment,
                content: (
                  <p>
                    {commentsMap[comment.previous]
                      ? (
                        <div className={css`margin-right: 10px;`}>
                          <Tooltip title={<HashLink smooth to={`#${commentsMap[comment.previous]?.id}`}>go to comment</HashLink>}>
                            @
                            {commentsMap[comment.previous]?.createdBy.fullName}
                          </Tooltip>
                        </div>
                      )
                      : ''}
                    {comment.content}
                  </p>
                ),
              }}
              isArchived={isArchived}
              className={css`
          margin-left: ${comment.previous ? '20px' : '0'};
        `}
            />
          </div>
        ))}
      </>
    )
}

export default CommentsList
