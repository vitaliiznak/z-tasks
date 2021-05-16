import React, { useState, ReactElement } from 'react'
import {
  Button, Divider, Layout, Modal, Select, Spin, Tooltip,
  Avatar as AvatarAntd
} from 'antd'
import {
  Link,
  NavLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'
import { css } from '@emotion/css'
import { PlusOutlined } from '@ant-design/icons'

import AvatarZ from 'screens/components/AvatarZ'
import BoardNew from 'screens/PageBoardList/BoardNew'
import { gBoards, gSelectedBoard, gUserMe } from 'appState/appState'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../appConstants'
import FakeErrorsMenu from './FakeErrorsMenu'


const { Option } = Select

const cssSider = css`
  position: fixed;
  left: 0;
  height: 100vh;
  max-width: 200px !important;
  min-width: 100px !important;
  & .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }`

const cssStickyMenu = css`
  overflow-y: auto;
  position: sticky;
  margin-top: 44px;
  top: 0;`

const cssLogo = css`
  overflow-y: auto;
  position: absolute;
  top: 0;
  right:0;
  width: 100%;
  display: flex;

  padding-top:8px;
  padding-top:8px;
  padding-right:10px;
  justify-content: center;
  align-items: center;
  font-size:18px;
`

const cssMenuItem = css`
  display: block;
  padding:  8px 8px 10px 18px;
`
const cssActiveClassName = css`
  border-right: 2px solid #1890ff;
`

const stylesBoardSelect = css`
width: 100% !important; 
margin-bottom: 10px;
height: 58px !important;

& .ant-select-selector {

};
& .anticon {
  font-weight: 900 !important;
};
& .ant-select-arrow {
  top: 42%;
}
& .ant-select-selector {
  height: 50px !important;
}
& .ant-select-selection-placeholder{
  line-height: 50px !important;
}
& .ant-select-selection-item, & .ant-select-selection-search {
  display: flex;
  align-items: center;
}
`
const stylesBoardOption = css`
  overflow-x:hidden;
  padding: 10px 0 10px 20px;
  display: flex; 
  flex-wrap: nowrap;
  & div {
    height: 100%;
  }
`

const { Sider } = Layout
export default (): ReactElement => {
  const userMe = gUserMe()
  const history = useHistory()
  const isProfileRoute = useRouteMatch('/members')
  const [isProfileExpanded, setProfileExpanded] = useState(Boolean(isProfileRoute))
  const [modalNewBoardConfig, setModalNewBoardConfig] = useState<any>(null)
  const boards = gBoards()

  const cssAccountMenuContainer = css`
    display: block;
    width: 100%;
    border-right: 2px solid ${isProfileRoute ? '#1890ff' : 'transparent'} !important;
    padding-right: 8px;
    padding-left: 8px;
    display: flex;
    height:40px;
    justify-content: space-between;
    cursor: pointer;
    &:hover,
    &:focus,
    &:active {
      border-right: 2px solid ${isProfileRoute ? '#1890ff' : 'transparent'} !important;
    } 

    & span.material-icons
    {
      padding-left: 8px;
      vertical-align: bottom;
    }`


  const onLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
    window.location.reload()
  }

  const selectDropdownRender = (menu: any) => (
    <div>
      {menu}
      <Divider style={{ margin: '4px 0' }} />
      <div
        className={
          css`
            padding: 10px 8px 14px 8px;
            display: flex; 
            flex-direction:column;
            align-items:center;
            flex-wrap: nowrap;
        `
        }
      >
        <Button
          onClick={() => {
            setModalNewBoardConfig({})
          }}
          icon={<PlusOutlined />}
          type="primary"
          ghost
          size="middle"
        >
          Create new board
        </Button>
      </div>
    </div>
  )


  const selectedBoard = gSelectedBoard()
  return (
    <Sider className={cssSider} theme="light">
      { Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setModalNewBoardConfig(null)
          }}
          title="Create board"
          visible
          width={350}
          footer={null}
        >
          <BoardNew
            onDone={({ id }: any) => {
              history.push(`/boards/${id}`)
              setModalNewBoardConfig(null)
            }}
            footer={() => (
              <div className={css`
                display: flex; 
                justify-content: space-between;
                `}
              >
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
      <h1 className={cssLogo}>
        <Link to="/">
          Z-TASKS
        </Link>
      </h1>
      <div className={cssStickyMenu}>

        <Button
          type="text"
          onClick={() => {
            setProfileExpanded(!isProfileExpanded)
          }}
          className={cssAccountMenuContainer}
        >
          <div>
            <div className={css`text-align: left;`}>
              <AvatarZ
                size="default"
                fullName={userMe?.fullName}
                avatarSrc={userMe?.avatar?.uri}
                className={css`margin-right: 10px !important;`}
              />
              <strong>{userMe?.fullName || <Spin />}</strong>
            </div>
            <small>{userMe?.email}</small>
          </div>

          {isProfileExpanded
            ? (
              <span className="material-icons">
                keyboard_arrow_up
              </span>
            )
            : (
              <span className="material-icons">
                keyboard_arrow_down
              </span>
            )}
        </Button>

        {isProfileExpanded
          && (
            <div className={css`padding-left: 10px;`}>
              <NavLink
                exact
                activeClassName={cssActiveClassName}
                className={`
                  ant-menu-item
                  ${css`
                    margin-top: 4px;
                    margin-bottom: 20px;
                  `}
                  ${cssMenuItem}
                `}
                to="/account-settings"
              >
                Account Settings
              </NavLink>
              <div
                className={
                  css`padding-right: 10px;`
                }
              >
                <Button
                  ghost
                  type="primary"
                  className={css` width: 100%;`}
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}


        <Divider />
        <div className={css`
          margin-top: 20px;
          border-top: 1px solid orange;
          border-bottom: 1px solid orange;
          `}
        >
          <Tooltip title="Select board" placement="rightTop">
            <Select
              showSearch
              placeholder="Select board"
              value={selectedBoard?.id}
              defaultValue={selectedBoard?.id}
              onChange={(value:string) => history.push(`/b/${value}`)}
              onSearch={(value) => {}}
              className={stylesBoardSelect}
              size="large"
              dropdownRender={selectDropdownRender}
            >
              {(boards || []).map(
                (board: any) => (
                  <Option
                    key={board.id}
                    value={board.id}
                    className={stylesBoardOption}
                  >
                    <div
                      className={css`
                        overflow: hidden;
                        text-overflow: ellipsis;`}
                    >
                      {board.title}

                    </div>
                  </Option>
                ),
              )}
            </Select>
          </Tooltip>
          { Boolean(selectedBoard?.id) && (
            <div className={css`padding-left:12px;`}>
              <NavLink
                exact
                activeClassName={cssActiveClassName}
                className={`${cssMenuItem}`}
                to={`/b/${selectedBoard?.id}`}
              >
                Board view
              </NavLink>

              <Tooltip placement="rightTop" title="Archived tasks of the current board">
                <NavLink
                  activeClassName={cssActiveClassName}
                  className={`${cssMenuItem}`}
                  to={`/b/${selectedBoard?.id}/archive-tasks`}
                >
                  Archived tasks
                </NavLink>
              </Tooltip>
              <Divider className={css`margin-bottom: 0 !important;`} />
              <Tooltip placement="rightTop" title="Assigned to me on active board">
                <NavLink
                  activeClassName={cssActiveClassName}
                  className={`
                      ant-menu-item
                      ${cssMenuItem}
                    `}
                  to={`/b/${selectedBoard?.id}/members/${userMe?.id}/created-by`}
                >
                  Assigned to me
                </NavLink>
              </Tooltip>

              <Tooltip placement="rightTop" title="Assigned to me on active board">
                <NavLink
                  activeClassName={cssActiveClassName}
                  className={`
                        ant-menu-item
                        ${cssMenuItem}
                      `}
                  to={`/b/${selectedBoard?.id}/members/${userMe?.id}/assigned`}
                >
                  Owned by me
                </NavLink>
              </Tooltip>

              <Divider className={css`margin-bottom: 0 !important;`} />
              <NavLink
                exact
                activeClassName={cssActiveClassName}
                className={`${cssMenuItem}`}
                to={`/b/${selectedBoard?.id}/members`}
              >
                Board members
              </NavLink>
              <NavLink
                exact
                activeClassName={cssActiveClassName}
                className={`${cssMenuItem}`}
                to={`/b/${selectedBoard?.id}/invites`}
              >
                Invites to board
              </NavLink>
            </div>
          )}
        </div>

        <Divider />

        <NavLink
          activeClassName={cssActiveClassName}
          className={`${cssMenuItem}`}
          to="/boards"
        >
          Manage boards
        </NavLink>
      </div>
      <FakeErrorsMenu />
    </Sider>
  )
}
