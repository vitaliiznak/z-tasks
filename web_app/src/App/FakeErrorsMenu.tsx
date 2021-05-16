import React, { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { css } from '@emotion/css'
import { useLazyQuery, gql } from '@apollo/client'

const NOT_EXISTING_QUERY = gql`
    query notExistingQuery {
        getIng {
            id
        }
    }
  `
export default () => {
  const [errorTreeNode, makeError] = useState<any>(null)
  const [notExistingQuery, { loading, data, error }] = useLazyQuery(NOT_EXISTING_QUERY)
  return (
    <div className={css`
        margin-top: auto;
        & button {
        margin: 8px 0;
        }
        `}
    >
      {errorTreeNode}
      <Tooltip title="For testing purposes" color="orange">
        <Button
          block
          ghost
          danger
          onClick={() => {
            notExistingQuery()
          }}
        >
          Make Graphql Error
        </Button>
      </Tooltip>
      <Tooltip title="For testing purposes" color="orange">
        <Button
          block
          ghost
          danger
          onClick={() => {
            makeError({ error: 'error here' })
          }}
        >
          Make Tree Render Error
        </Button>
      </Tooltip>
    </div>
  )
}
