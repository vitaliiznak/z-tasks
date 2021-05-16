import React from 'react'
import {
  Form, Input, Button
} from 'antd'
import { css } from '@emotion/css'
import { useLocation } from 'react-router-dom'

const { TextArea } = Input

const cssFormItem = css`
  display: block;
`

const Invite = ({
  className = ''
}: {
  className?: string | undefined
}) => {
  const location = useLocation()

  return (
    <div>
      here
    </div>
  )
}

export default Invite
