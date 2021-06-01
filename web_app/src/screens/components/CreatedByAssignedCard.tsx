
import { css } from '@emotion/css'
import { Tooltip } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import AvatarZ from './AvatarZ'

const AddComment = ({
  id,
  avatar,
  fullName,
  email,
  link = `/members/${id}`,
}: {
  id: string,
  avatar: {
    uri: string
  },
  fullName: string,
  email: string,
  link?: string

}) => {
  const ViewNameEmail = (
    <div
      className={css`
        padding-left: 4px;
        width: 100%;
      `}
    >
      <div
        className={css`
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
      `}
      >
        <Link target="_blank" to={link}>
          {fullName}
        </Link>
      </div>
      <div
        className={css`
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
        `}
      >
        {email}
      </div>
    </div>
  )

  return (
    <Tooltip
      placement="topLeft"
      title={(
        <div
          className={css`display: flex;`}
        >
          <AvatarZ
            fullName={fullName}
            avatarSrc={avatar?.uri}
          />
          {ViewNameEmail}
        </div>
      )}
    >
      <div
        className={css`
        display: flex;
        border: 1px dashed rgba(91,91,91, 0.7);
        width: 100%;
        font-size: 10px;
      `}
      >
        {ViewNameEmail}
      </div>
    </Tooltip>
  )
}


export default AddComment
