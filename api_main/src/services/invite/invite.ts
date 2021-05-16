import SqlString from 'sqlstring'
import moment from 'moment'
import crypto from 'crypto'
import util from 'util'

import { ApolloError } from 'apollo-server'
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../contracts/db'
import sql from '../../utils/sql'

const randomBytesP = util.promisify(crypto.randomBytes)

interface TContext {
  insureDataFromBoardOfUser: string
}

interface TInvite {
  id: string
  boardId: string
  token: string
  state: string
  description: string

  expirationTime: string
  createdById: string
  createdAt: string
}

const SELECT_FIELDS = sql`
  ${TABLES.INVITE_TO_BOARD}.id,
  ${TABLES.INVITE_TO_BOARD}.board as "boardId",
  ${TABLES.INVITE_TO_BOARD}.token,
  ${TABLES.INVITE_TO_BOARD}.state,
  ${TABLES.INVITE_TO_BOARD}.description,

  ${TABLES.INVITE_TO_BOARD}.expiration_time as "expirationTime",
  ${TABLES.INVITE_TO_BOARD}.created_by as "createdById",
  ${TABLES.INVITE_TO_BOARD}.created_at as "createdAt"
`

const getById = (id: string, ctx?: TContext): Promise<TInvite | null> => executeWithConnection(async (conn) => {
  let whereClause = sql` WHERE id = ${SqlString.escape(id)} `
  if (ctx && ctx.insureDataFromBoardOfUser) {
    whereClause = sql`
        ${whereClause}
          AND ${TABLES.INVITE_TO_BOARD}.board IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${SqlString.escape(ctx.insureDataFromBoardOfUser)})
          )`
  }

  const sqlStr = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.INVITE_TO_BOARD} 
      ${whereClause}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

type TFilter = {
  createdBy: string[],
  board: string
  state: string[]
  state_NOT: string[]
}
const getList = (filter: TFilter, ctx?: TContext): Promise<TInvite[]> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  console.log('\n\n\n\n filter', filter)

  if (ctx && ctx.insureDataFromBoardOfUser) {
    whereClause = sql`
        ${whereClause}
          AND ${TABLES.INVITE_TO_BOARD}.board IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${SqlString.escape(ctx.insureDataFromBoardOfUser)})
          )`
  }

  if (filter && filter.createdBy && filter.createdBy.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.created_by
      IN(${filter.createdBy.map((el) => SqlString.escape(el)).join(', ')})`
  }

  if (filter && filter.createdBy && filter.createdBy.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.board
      IN(
        ${filter.createdBy.map((el) => SqlString.escape(el)).join(', ')})`
  }

  if (filter && filter.state_NOT) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.state NOT IN (${filter.state_NOT.map((el) => SqlString.escape(el)).join(', ')})`
  }

  if (filter && filter.state) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.state IN (${filter.state.map((el) => SqlString.escape(el)).join(', ')})`
  }

  const sqlQuery = sql`
      SELECT
      ${SELECT_FIELDS}
      FROM ${TABLES.INVITE_TO_BOARD}
      ${whereClause}
      ORDER BY ${TABLES.INVITE_TO_BOARD}.created_at DESC
        `

  const result = await conn.query(sqlQuery)
  return result.rows
})

type TFilterCount = TFilter
const count = (filter: TFilterCount): Promise<number> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (filter && filter.board) {
    whereClause = sql`
    ${whereClause}
    AND ${TABLES.INVITE_TO_BOARD}.board
    IN(
      ${[filter.board].map((el) => SqlString.escape(el)).join(', ')})`
  }

  if (filter && filter.createdBy && filter.createdBy.length) {
    whereClause = sql`
    ${whereClause}
    AND ${TABLES.INVITE_TO_BOARD}.board
    IN(
      ${filter.createdBy.map((el) => SqlString.escape(el)).join(', ')})`
  }

  const sqlQuery = sql`
    SELECT
      COUNT(${TABLES.INVITE_TO_BOARD}.id) as count
      FROM ${TABLES.INVITE_TO_BOARD}
      ${whereClause}
    `

  const result = await conn.query(sqlQuery)
  return result.rows.length ? result.rows[0].count : null
})

const create = ({
  boardId,
  expirationTime = moment().add(30, 'minutes').format(),
  createdBy,
  description,
}: {
  boardId: string,
  createdBy: string,
  expirationTime?: string,
  description?: string
}): Promise<TInvite> => executeWithConnection(
  async (conn) => {
    const tokenBuff = await randomBytesP(8)
    const token = tokenBuff.toString('hex')
    const insertKeys = ['board', 'token', 'created_by']
    const InviteToBoardInsertRow = [
      SqlString.escape(boardId),
      SqlString.escape(token),
      SqlString.escape(createdBy),
    ]

    if (expirationTime) {
      insertKeys.push('expiration_time')
      InviteToBoardInsertRow.push(SqlString.escape(expirationTime))
    }
    if (description) {
      insertKeys.push('description')
      InviteToBoardInsertRow.push(SqlString.escape(description))
    }

    const InviteToBoardInsertValues = [InviteToBoardInsertRow.join(', ')]
    const sqlStrInvite = sql`
          INSERT INTO ${TABLES.INVITE_TO_BOARD}  
          ( 
            ${insertKeys.join(', ')}
          )
          VALUES ${InviteToBoardInsertValues.map((row) => `( ${row} )`).join(', ')}
          RETURNING ${SELECT_FIELDS};
        `
    let qyertSqlStrInviteResult
    try {
      qyertSqlStrInviteResult = await conn.query(sqlStrInvite)
    } catch (err) {
      if (err.toString().includes('duplicate') && err.toString().includes('duplicate')) {
        throw new ApolloError(err.toString(), 'DUPLICATED_TITLE')
      }
      throw err
    }
    const { rows: [insertedInvite] } = qyertSqlStrInviteResult

    return getById(insertedInvite.id)
  },
)

const update = (
  id: string, {
    title,
    description,
  }: {
    title?: string,
    description?: string
  },
): Promise<TInvite> => executeWithConnection(async (conn) => {
  const set: Array<string> = []
  if (title !== undefined) {
    set.push(sql`title = ${SqlString.escape(title)}`)
  }

  if (description !== undefined) {
    set.push(sql`description = ${SqlString.escape(description)}`)
  }

  if (set.length) {
    const sqlStr = sql` 
          UPDATE ${TABLES.BOARD}  
          SET  
            ${set.join(',')} 
          WHERE id = ${SqlString.escape(id)} 
          RETURNING ${SELECT_FIELDS}; 
        `
    await conn.query(sqlStr)
  }

  return getById(id)
})

const remove = (id: string): Promise<string> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
      DELETE FROM ${TABLES.BOARD}
      WHERE id = ${SqlString.escape(id)};
    `
  await conn.query(sqlStr)
  return id
})

export default {
  getById,
  getList,
  count,

  update,
  create,
  remove,
}
