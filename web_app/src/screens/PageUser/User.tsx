import React, { useState } from 'react'

import {
  Card, Checkbox, Result, Space, Spin,
} from 'antd'
import {
  NavLink, useRouteMatch, useParams, useLocation,
} from 'react-router-dom'
import { css } from '@emotion/css'
import { GET_USER } from 'queries'
import { useQuery } from '@apollo/client'

import TaskList from 'screens/TaskList'
import AvatarZ from 'screens/components/AvatarZ'
import { TypeTaskFilter } from 'screens/TaskList/Filter'
import { GetUser } from 'queries/types/GetUser'

const stylesTabLink = css`
  padding-bottom: 10px;
  border-bottom: 2px solid transparent;
  font-weight: 700;
  color: #1990ff;
  &:active, &:hover {
    color: #2090ff;
  }
`

const stylesActiveTabLink = css`
  border-bottom: 3px solid #1990ff;
`

export default () => {
  const { pathname } = useLocation()
  const match = useRouteMatch()
  const lastLocationPart = pathname.split('/').pop()
  const { id } = useParams<{ id: string }>()
  const { loading, data, error } = useQuery<GetUser>(GET_USER, { variables: { id } })
  const [showArchiveTasks, setShowArchivedTasks] = useState(false)

  const onShowArchivedTasks = () => {
    setShowArchivedTasks(!showArchiveTasks)
  }

  if (loading || !data?.userGetById) return <Spin size="large" />
  if (error) {
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

  const filter: TypeTaskFilter = { [lastLocationPart === 'assigned' ? 'assigners' : 'createdBy']: [id] }
  if (!showArchiveTasks) {
    filter.isArchived = false
  }

  const { userGetById: { fullName, email, avatar } } = data
  return (
    <Card className={
      css`
        max-width: 800px;
      `
    }
    >
      <div className={css`
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;
  `}
      >
        <AvatarZ
          avatarSrc={avatar?.uri}
          fullName={fullName}
        />
        <div className={css`margin-left: 8px;`}>
          {fullName}
          <br />
          {email}
        </div>
      </div>
      <div>
        <Space>
          <NavLink
            activeClassName={stylesActiveTabLink}
            className={stylesTabLink}
            to={`${match.url}/created-by`}
          >
            Created by
          </NavLink>
          <NavLink
            activeClassName={stylesActiveTabLink}
            className={stylesTabLink}
            to={`${match.url}/assigned`}
          >
            Assigned
          </NavLink>
          <Checkbox
            checked={showArchiveTasks}
            onClick={onShowArchivedTasks}
          >
            Show with archived tasks
          </Checkbox>
        </Space>
      </div>

      <TaskList
        filter={filter}
        title={null}
        className={css`
          margin-top: 30px;
        `}
      />
    </Card>
  )
}
