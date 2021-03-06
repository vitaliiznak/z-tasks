import React, { useState } from 'react'
import {
  Table, Tooltip, Tag,
} from 'antd'
import { css } from '@emotion/css'
import { Link } from 'react-router-dom'
import AvatarZ from 'screens/components/AvatarZ'
import { useQuery } from '@apollo/client'
import moment from 'moment'


import { GET_INVITES } from 'queries'
import { GetInvites } from 'queries/types/GetInvites'
import { gSelectedBoard } from 'appState/appState'

const InviteList = ({
  className = '',
  filter = {}
}: {
  className?: string,
  filter?: object
}) => {
  const board = gSelectedBoard()
  const { loading, data } = useQuery<GetInvites>(GET_INVITES, {
    variables: {
      filter: {
        board: board!.id,
        ...filter
      },
    },
  })

  const columns = [
    {
      title: 'State',
      key: 'state',
      render: ({ state }: any) => (
        <div>
          <Tag>
            {state}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Expiration time',
      key: 'expirationTime',
      render: ({ expirationTime }: any) => (
        <div>
          {moment(expirationTime).format('DD/MM/YYYY, h:mm')}
        </div>
      ),
    },
    {
      title: 'Token',
      key: 'token',
      dataIndex: 'token'
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: ({
        fullName, email, avatar, id,
      }: any) => (
        <Tooltip
          placement="topRight"
          title={(
            <div
              className={css`
                display: flex;
              `}
            >
              <AvatarZ avatarSrc={avatar?.uri} fullName={fullName} />
              <div
                className={css`
                  padding-left: 4px;
              `}
              >
                <div>
                  <Link target="_blank" to={`/b/${board!.id}/members/${id}`}>
                    {fullName}
                  </Link>
                </div>
                <div className={css`font-size: 11px;`}>{email}</div>
              </div>
            </div>
          )}
          arrowPointAtCenter
        >
          <div>{fullName}</div>
          <div className={css`font-size: 11px;`}>{email}</div>
        </Tooltip>
      ),
    }
  ]

  return (
    <>
      <Table
        className={className}
        loading={loading}
        rowKey="id"
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        columns={columns}
        dataSource={data && data.inviteGetList ? data.inviteGetList as any[] : []}
        expandable={{
          expandedRowRender: ({ id, description }) => {
            console.log('@link', `${window.location.protocol}//${window.location.host}/p/invites/${1}`)
            return (
              <div className={css`padding: 8px;`}>
                <span className={css`font-size: 14px;padding-right: 8px;`}>Invitation link: </span>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`/p/invites/${id}`}
                >
                  {`${window.location.protocol}//${window.location.host}/p/invites/${id}`}
                </Link>
                <div className={css`font-size: 14px;padding-top: 8px;`}>Invitation message:</div>
                <p>
                  { description }
                </p>
              </div>
            )
          }
        }}
      />

    </>
  )
}


export default InviteList
