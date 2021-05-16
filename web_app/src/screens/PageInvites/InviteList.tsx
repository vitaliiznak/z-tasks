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


export default ({
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
          expandedRowRender: ({ description }) => (
            <div className={css`padding: 8px;`}>
              <h4>Invitation message:</h4>
              <p>
                { description }
              </p>
            </div>
          )
        }}
      />

    </>
  )
}
