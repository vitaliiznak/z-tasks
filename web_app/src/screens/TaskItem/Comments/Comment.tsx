import React, { ReactElement, useState } from 'react'
import { Comment as CommentAntd, Tooltip, Button } from 'antd'
import moment from 'moment'
import { css } from '@emotion/css'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import AvatarZ from 'screens/components/AvatarZ'
import AddComment from './AddComment'

const Comment = ({
  isReplyAllowed,
  className,
  linkAuthor,
  comment: {
    id,
    createdBy,
    content,
    createdAt,

  },
}:
{
  className?: string,
  isReplyAllowed: boolean,
  linkAuthor: string,
  comment: {
    id: string,
    content: string | ReactElement | undefined
    createdAt: string
    createdBy: {
      id: string
      fullName: string
      avatar: {
        uri: string
      }
    }
  }
}) => {
  const [isReplyActive, setReplyActive] = useState(false)

  const onReply = (_ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setReplyActive(true)
  }

  const onReplyClose = (_ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setReplyActive(false)
  }

  return (
    <div className={className}>
      <CommentAntd
        className={
          css`
          & .ant-comment-actions{
              display:flex;
              justify-content: flex-end;
          }`
        }
        avatar={(
          <AvatarZ
            avatarSrc={createdBy.avatar.uri}
            fullName={createdBy.fullName}
          />
        )}
        author={(
          <Link target="_blank" to={linkAuthor}>
            {createdBy.fullName}
          </Link>
        )}
        content={(
          <pre>
            {content}
          </pre>
        )}
        datetime={(
          <Tooltip title={moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(createdAt).fromNow()}</span>
          </Tooltip>
        )}
        actions={[
          isReplyAllowed
            ? isReplyActive
              ? (
                <Button key="replyTo" size="small" type="text" onClick={onReplyClose}>
                  <CloseOutlined />
                </Button>
              )
              : <Button key="replyTo" size="small" type="text" onClick={onReply}>Reply</Button>
            : null,
        ]}
      />
      <div className={
        css`
          padding-left: 32px;
          display: ${isReplyActive ? 'block' : 'none'};
        `
      }
      >
        <AddComment previous={id} onFinish={() => { setReplyActive(false) }} />
      </div>
    </div>
  )
}

export default Comment