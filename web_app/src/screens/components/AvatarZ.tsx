import React from 'react'
import { Avatar as AvatarAntd } from 'antd'
import { css } from '@emotion/css'

type TypePropsAvatar = React.ComponentProps<typeof AvatarAntd> & {
  avatarSrc?: string,
  fullName?: string
}
export default ({
  className = '',
  children,
  avatarSrc,
  fullName = '',
  src = avatarSrc ? `${process.env.REACT_APP_STORAGE_URI}/${avatarSrc}` : undefined,
  ...props
}: TypePropsAvatar) => {
  const stylesContainer = `${css`
      background-color: #f56a00 !important; 
      vertical-align: middle;
    `} ${className}`

  return (
    <AvatarAntd
      className={stylesContainer}
      src={src}
      shape="square"
      size="small"
      gap={2}
      {...props}
    >
      {fullName.substring(0, 2)}
      {children}
      BLABLA
    </AvatarAntd>
  )
}
