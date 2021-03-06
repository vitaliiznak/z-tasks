import { Button, Card, Modal } from 'antd'
import React, { useState } from 'react'
import { css } from '@emotion/css'

import InviteNew from 'screens/PageInvites/InviteNew'
import MemberList from './MemberList'


export default () => {
  const [modalNewBoardConfig, setModalNewInviteConfig] = useState<any>(null)
  const onInviteNew = () => {}

  return (
    <>
      { Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setModalNewInviteConfig(null)
          }}
          visible
          width={400}
          footer={null}
        >
          <InviteNew />
        </Modal>
      ) }
      <Card
        className={
          css`
          max-width: 800px;
        `
        }
        title={(
          <div className={css`display: flex;justify-content: space-between;`}>
            <h3>Board members</h3>
            <Button
              size="large"
              type="primary"
              ghost
              className={css`margin-left: auto;`}
              onClick={() => {
                setModalNewInviteConfig({})
              }}
            >
              Invite new member
            </Button>
          </div>
        )}
      >
        <MemberList />
      </Card>
    </>
  )
}
