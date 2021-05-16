import { makeVar } from '@apollo/client'
import { accountMe } from 'queries/types/accountMe'


export const gSelectedBoard = makeVar<{
  id: string
  title: string
} | null>(null)

export const gUserMe = makeVar<accountMe['accountMe'] | null>(null)


export const gBoards = makeVar<any | null>(null)
