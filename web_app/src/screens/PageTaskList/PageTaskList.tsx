import React, { useState } from 'react'
import { css } from '@emotion/css'
import { gSelectedBoard } from 'appState/appState'
import TaskList from '../TaskList'
import TaskNew from '../TaskNew'
import Filter from '../TaskList/Filter'

const styleDisplayNone = css`display: none;`

type FilterProps = React.ComponentProps<typeof Filter>
export default () => {
  const board = gSelectedBoard()
  const [filter, setFilter] = useState({})
  const onFilter: FilterProps['onFilter'] = (values) => {
    setFilter({ ...values })
  }

  return (
    <div className={
      css`
        max-width: 800px;
      `
    }
    >
      <TaskNew boardId={board!.id} className={styleDisplayNone} />
      <div className={css`height: 10px;`} />
      <TaskList
        title={
          (
            <>
              <h3>Archived tasks</h3>
              <Filter onFilter={onFilter} />
            </>
          )
        }
        filter={{ ...filter, isArchived: true }}
      />
    </div>
  )
}
