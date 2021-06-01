import React, { ReactElement } from 'react'
import {
  Layout, Result, Spin,
} from 'antd'
import {
  Switch,
  Route,
  Redirect,
  useParams,
} from 'react-router-dom'
import { css } from '@emotion/css'
import { useQuery } from '@apollo/client'

import PageLogin from 'screens/PageEnter'
import PageUsers from 'screens/PageUserList'
import PageTasks from 'screens/PageTaskList'
import PageTask from 'screens/PageTask'
import PageUser from 'screens/PageUser'
import PageDashboard from 'screens/PageDashboard'
import PageSelectBoard from 'screens/PageSelectBoard'
import PageBoardList from 'screens/PageBoardList'
import PageInvites from 'screens/PageInvites'
import AccountSettings from 'screens/PageAccountSettings'
import { useAuthToken } from 'hooks/useAuth'
import { GET_BOARD, GET_BOARDS, GET_ME } from 'queries'
import { gBoards, gSelectedBoard, gUserMe } from 'appState/appState'
import { GetBoard } from 'queries/types/GetBoard'
import { accountMe } from 'queries/types/accountMe'
import { GetBoards } from 'queries/types/GetBoards'
import PageInviteAuthenteticated from 'screens/PageInvite'
import PageInvitePublic from 'screensPublic/PageInvite'
import SideMenu from './SideMenu'


export const BoardRoutes = (): ReactElement => {
  const { boardId } = useParams<{ boardId: string }>()
  const { loading: boardLoading, data: boardData, error: boardError } = useQuery<GetBoard>(GET_BOARD, {
    variables:
    {
      id: boardId,
    },
  })

  if (boardLoading) {
    return <Spin />
  }

  if (boardError) {
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
  if (boardData && boardId) {
    gSelectedBoard(boardData.board)
  }

  return (
    <Layout className={css`height:100vh;`}>
      <SideMenu />

      <Switch>
        <Route path="/b/:boardId/tasks/:id">
          <Layout.Content
            className={css`
              margin-right: 18px;
              margin-left: 240px;
              margin-top: 8vh;`}
          >
            <PageTask />
          </Layout.Content>
        </Route>
        <Route path="/b/:boardId/archive-tasks">
          <Layout.Content
            className={css`
              margin-right: 18px;
              max-width: 800px;
              margin-left: 240px;
              margin-top: 8vh;`}
          >
            <PageTasks />
          </Layout.Content>
        </Route>

        <Route path="/b/:boardId/members/:id">
          <Layout.Content
            className={css` margin-right: 18px;
              max-width: 800px;
              margin-left: 240px;
              margin-top: 8vh;`}
          >
            <PageUser />
          </Layout.Content>
        </Route>
        <Route path="/b/:boardId/members">
          <Layout.Content
            className={css` margin-right: 18px;
              max-width: 800px;
              margin-left: 240px;
              margin-top: 8vh;`}
          >
            <PageUsers />
          </Layout.Content>
        </Route>
        <Route path="/b/:boardId/invites">
          <Layout.Content
            className={css`
              margin-right: 18px;
              max-width: 800px;
              margin-left: 240px;
              margin-top: 8vh;`}
          >
            <PageInvites />
          </Layout.Content>
        </Route>
        <Route path={['/b/:boardId']}>
          <Layout.Content
            className={css`margin-left: 190px;`}
          >
            <PageDashboard />
          </Layout.Content>
        </Route>
        <Route
          exact
          path={['/b/:boardId/members/:id']}
          render={({ match }) => (
            <Redirect to={`${match.url}/created-by`} />
          )}
        />
      </Switch>

    </Layout>

  )
}


export const AuthenticatedRoutes = (): ReactElement => {
  const { boardId } = useParams<{ boardId: string }>()
  const { data: dataMe, error: errorMe } = useQuery<accountMe>(GET_ME)
  const { data: dataBoards, error: errorBoards } = useQuery<GetBoards>(GET_BOARDS, {
    variables: {},
  })
  if (dataMe) {
    gUserMe(dataMe.accountMe)
  }
  if (!boardId) {
    gSelectedBoard(null)
  }
  if (dataBoards) {
    gBoards(dataBoards.boards)
  }
  if (errorMe || errorBoards) {
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

  return (
    <Switch>
      <Route path="/b/:boardId">
        <BoardRoutes />
      </Route>
      <Route exact path={['/', '/login']}>
        <Redirect to="/b" />
      </Route>
      <Route>
        <Layout className={css`height:100vh;`}>
          <SideMenu />
          <Layout.Content
            className={css`margin-top: 8vh; margin-left: 240px;`}
          >
            <div className={
              css`
                max-width: 800px;
                margin-left: 5vw;
                margin-right: 18px;
              `
            }
            >
              <Switch>
                <Route exact path="/b">
                  <PageSelectBoard />
                </Route>
                <Route path="/p/invites/:inviteId">
                  <PageInviteAuthenteticated />
                </Route>
                <Route path="/account-settings">
                  <AccountSettings />
                </Route>

                <Route path="/boards">
                  <PageBoardList title={<h3>Your boards</h3>} />
                </Route>
              </Switch>
            </div>
          </Layout.Content>
        </Layout>
      </Route>


    </Switch>
  )
}

const NotAuthenticatedRoutes = () => (
  <Layout className={css`height:100vh;`}>
    <Switch>
      <Route path="/login">
        <PageLogin />
      </Route>
      <Route path="/p/invites/:inviteId">
        <Layout className={css`height:100vh;`}>
          <PageInvitePublic />
        </Layout>
      </Route>
      <Route>
        <Redirect to="/login" />
      </Route>

    </Switch>
  </Layout>
)


export default (): ReactElement => {
  const [token] = useAuthToken()
  return (
    <Switch>
      <Route>
        { token ? <AuthenticatedRoutes /> : <NotAuthenticatedRoutes /> }
      </Route>
    </Switch>
  )
}
