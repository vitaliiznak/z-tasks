import React, { useState } from 'react'
import {
  Table, Card, Tooltip, Button, Modal,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { Link, useHistory } from 'react-router-dom'
import { REMOVE_BOARD } from 'queries'
import AvatarZ from 'screens/components/AvatarZ'
import { gBoards, gSelectedBoard } from 'appState/appState'
import { RemoveBoard } from 'queries/types/RemoveBoard'
import BoardNew from './BoardNew'

const { confirm } = Modal

const auxStylesContainer = css`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`
export default ({
  title = null,
  className = '',
}: {
  title?: JSX.Element | null,
  className?: string
}) => {
  const history = useHistory()

  const [modalNewBoardConfig, setModalNewBoardConfig] = useState<any>(null)
  const [removeBoard] = useMutation<RemoveBoard>(REMOVE_BOARD)

  const board = gSelectedBoard()
  const boards = gBoards()

  const onRemove = (id: string) => (_ev: any) => {
    confirm({
      title: 'Do you want to delete these board?',
      icon: <ExclamationCircleOutlined />,
      content: 'All your tasks and comunications will be deleted',
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        removeBoard({
          variables: {
            id,
          },
          refetchQueries: ['GetBoards', 'GetBoard'],
        })
      },
    })
  }

  const columns = [
    {
      title: 'Title',
      key: 'title',
      render: ({ id, title: titleArg }: any) => (
        <div>
          <div>
            <Link type="primary" target="_blank" to={`/b/${id}`}>
              <strong>{titleArg}</strong>
            </Link>
          </div>
          <small className={css`font-size: 9px;`}>
            {id}
          </small>
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
                  <Link target="_blank" to={`/b/${board?.id}/members/${id}`}>
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: ({ id }: any) => (
        <div className={css`display:flex;justify-content: flex-end;`}>
          <Tooltip
            placement="topRight"
            title="delete board"
            arrowPointAtCenter
          >
            <Button danger ghost onClick={onRemove(id)}>
              Remove
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  const stylesContainer = `${auxStylesContainer} ${className}`
  return (
    <>
      { Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setModalNewBoardConfig(null)
          }}
          title="Create board"
          visible
          width={340}
          footer={null}
        >
          <BoardNew
            onDone={({ id }: any) => {
              history.push(`/boards/${id}`)
              setModalNewBoardConfig(null)
            }}
            footer={() => (
              <div className={css`display: flex; justify-content: space-between;`}>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    setModalNewBoardConfig(null)
                  }}
                  htmlType="reset"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  ghost
                  htmlType="submit"
                >
                  Create
                </Button>
              </div>
            )}
          />
        </Modal>
      )}

      <Card
        title={(
          <div className={css`display: flex; padding-bottom: 18px;justify-content:space-between;`}>
            {title}
            <Button
              size="large"
              type="primary"
              ghost
              onClick={() => {
                setModalNewBoardConfig({})
              }}
              className={css`margin-left: auto;`}
            >
              Create new board
            </Button>
          </div>
        )}
        className={stylesContainer}
      >
        <Table
          rowKey="id"
          loading={!boards}
          pagination={{
            hideOnSinglePage: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          columns={columns}
          dataSource={boards || []}
        /*   expandable={{
            expandedRowRender: ({id}: any) => (<TaskItem id={id}/>),
            rowExpandable: () => true,
          }} */
        />
      </Card>
    </>
  )
}
