import pg from 'pg'
import bluebird from 'bluebird'

const pool = new pg.Pool({
  Promise: bluebird,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
})
const schema = process.env.DATABASE_SCHEMA

interface PollVlientWithAuxProps extends pg.PoolClient {
  isSetup: boolean
}

async function getConnection() {
  const client = await pool.connect() as PollVlientWithAuxProps
  if (!client.isSetup) {
    await client.query(`SET search_path TO ${schema}`)
    client.isSetup = true
  }
  return client
}
export async function executeWithConnection(fn: (client: pg.PoolClient) => any): Promise<any> {
  const client = await getConnection() as pg.PoolClient
  let result
  try {
    result = fn(client)
    return await result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    console.error(error.stack)

    throw error
  } finally {
    client.release()
  }
}

export default {}
