import { css } from '@emotion/css'
import {
  Button, Card, Modal, Select,
} from 'antd'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import BoardNew from 'screens/PageBoardList/BoardNew'
import { gBoards } from 'appState/appState'

const { Option } = Select

const stylesBoardSelect = css`
width: 100% !important; 
margin-bottom: 10px;
height: 58px !important;
& .ant-select-arrow {
  top: 45%;
}
& .anticon {
  font-weight: 900 !important;
  color: #fff;
};

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
    padding-left: 4px;
    height: 100%;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
`


function SelectDashboard() {
  const history = useHistory()
  const [modalNewBoardConfig, setModalNewBoardConfig] = useState<any>(null)
  const boards = gBoards()

  return (
    <Card
      size="default"
      title={<h2>Select existent or create new board</h2>}
      className={css`max-width: 500px;`}
    >
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
      <Select
        showSearch
        placeholder="Select board"
        onChange={(value:string) => history.push(`/b/${value}`)}
        className={stylesBoardSelect}
        size="large"
      >
        {(boards || []).map(
          (board: any) => (
            <Option
              key={board.id}
              value={board.id}
              className={stylesBoardOption}
            >
              <div>{board.title}</div>
            </Option>
          ),
        )}
      </Select>

      <Button
        onClick={() => {
          setModalNewBoardConfig({})
        }}
        icon={<PlusOutlined />}
        type="primary"
        ghost
        size="large"
        block
      >
        Create new board
      </Button>
    </Card>
  )
}

export default SelectDashboard
