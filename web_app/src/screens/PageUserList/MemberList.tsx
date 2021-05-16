import { List } from 'antd'
import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_USERS } from 'queries'
import { Link } from 'react-router-dom'
import AvatarZ from 'screens/components/AvatarZ'
import { gSelectedBoard } from 'appState/appState'
import { GetUsers } from 'queries/types/GetUsers'


const MemberList = () => {
  const board = gSelectedBoard()
  const { loading, data } = useQuery<GetUsers>(GET_USERS)
  return (

    <List
      loading={loading}
      dataSource={data?.userGetList || []}
      pagination={{
        hideOnSinglePage: true,
        showTotal: (total) => `Total ${total} items`,
      }}
      renderItem={({
        id,
        email,
        fullName,
        avatar,
      }: any) => (
        <List.Item key={id}>
          <List.Item.Meta
            avatar={(
              <AvatarZ
                avatarSrc={avatar?.uri}
                fullName={fullName}
              />
            )}
            title={<Link to={`/b/${board!.id}/members/${id}`}>{fullName}</Link>}
            description={email}
          />
        </List.Item>
      )}
    />

  )
}

export default MemberList
