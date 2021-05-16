import React, { useState } from 'react'
import {
  Card, Button, Modal, Space
} from 'antd'
import { css } from '@emotion/css'
import {
  NavLink, Redirect, Route, Switch, useRouteMatch
} from 'react-router-dom'

import InviteNew from './InviteNew'
import InviteList from './InviteList'

const auxStylesContainer = css`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`
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

export default ({
  className = '',
}: {
  className?: string
}) => {
  const [modalNewBoardConfig, setModalNewInviteConfig] = useState<any>(null)
  const match = useRouteMatch()

  const stylesContainer = `${auxStylesContainer} ${className}`
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
      )}
      <Card
        title={(
          <div
            className={css`
              margin-bottom: 10px;
            `}
          >
            <div
              className={css`
                display: flex; 
                padding-bottom: 18px;
                justify-content:space-between;
              `}
            >
              <h3>Invites</h3>
              <Button
                size="large"
                type="primary"
                ghost
                onClick={() => {
                  setModalNewInviteConfig({})
                }}
                className={css`margin-left: auto;`}
              >
                Create invitation
              </Button>
            </div>
            <Space>
              <NavLink
                activeClassName={stylesActiveTabLink}
                className={stylesTabLink}
                to={`${match.url}/active`}
              >
                Active
              </NavLink>
              <NavLink
                activeClassName={stylesActiveTabLink}
                className={stylesTabLink}
                to={`${match.url}/used-and-expired`}
              >
                Used & expired
              </NavLink>
            </Space>
          </div>
        )}
        className={stylesContainer}
      >
        <Switch>
          <Route
            exact
            path={`${match.url}/active`}
            render={() => (
              <InviteList
                filter={{
                  state: ['NEW']
                }}
              />
            )}
          />
          <Route
            exact
            path={`${match.url}/used-and-expired`}
            render={() => (
              <InviteList
                filter={{
                  state_NOT: ['NEW']
                }}
              />
            )}
          />
          <Route
            exact
            render={() => (
              <Redirect to={`${match.url}/active`} />
            )}
          />
        </Switch>

      </Card>
    </>
  )
}
