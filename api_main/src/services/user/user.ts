import SqlString from 'sqlstring'
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../contracts/db'
import sql from '../../utils/sql'

interface TContext {
  insureDataFromBoardOfUser: string
}

interface TUser {
  id: string
  email: string
  fullName: string
  createdAt: string
  avatar: {
    uri: string
    filename: string
    mimetype: string
    encoding: string
    ext: string
  }
}

const SELECT_FIELDS = sql`
  id,
  email,
  full_name as "fullName",
  created_at as "createdAt",
  avatar as "avatar"
`
const getById = (id: string, ctx?: TContext): Promise<TUser | null> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE id = ${SqlString.escape(id)} `

  if (ctx && ctx.insureDataFromBoardOfUser) {
    whereClause = sql`
        ${whereClause}
          AND 
            ${TABLES.ACCOUNT}.id 
          IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.account
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${SqlString.escape(ctx.insureDataFromBoardOfUser)})
          )`
  }

  const sqlStr = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT} 
     ${whereClause}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

const getList = (ctx: TContext): Promise<TUser[]> => executeWithConnection(async (conn) => {
  let whereClause = sql` WHERE TRUE `

  if (ctx && ctx.insureDataFromBoardOfUser) {
    whereClause = sql`
        ${whereClause}
          AND 
            ${TABLES.ACCOUNT}.id 
          IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.account
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${SqlString.escape(ctx.insureDataFromBoardOfUser)})
          )`
  }

  const sqlQuery = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT}
      ${whereClause}
      ORDER BY ${TABLES.ACCOUNT}.created_at DESC
    `

  console.log('whereClause', sqlQuery)
  const result = await conn.query(sqlQuery)
  return result.rows
})

export default {
  getById,
  getList,
}
