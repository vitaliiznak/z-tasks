import SqlString from 'sqlstring'
import util from 'util'
import bcrypt from 'bcrypt'
import faker from 'faker'
import { executeWithConnection } from '../dbConnection'
import BoardService from '../services/board'
import TaskService from '../services/task'

export const TABLES = {
  ACCOUNT: 'account',
  PROFILE: 'profile',
  TASK: 'task',
  TASK_AUDIT: 'task_audit',
  TASK_ASSIGMENT: 'task_assigment',
  BOARD_ACCOUNT: 'board_account',
  COMMENT: 'comment',
  BOARD: 'board',
}

const password = '12345'
const saltRounds = 10
const hashPFn = util.promisify(bcrypt.hash) as (data: any, salt: any) => Promise<string>

const predefinedUsersFn = async () => {
  const passwordHash = await hashPFn(password, saltRounds)
  return [[
    SqlString.escape('john@mail.com'),
    SqlString.escape('John Wash'),
    SqlString.escape(passwordHash),
  ].join(', '), [
    SqlString.escape('mike@mail.com'),
    SqlString.escape('Mike Mirrow'),
    SqlString.escape(passwordHash),
  ].join(', '),
  ]
}

const randomUserInsertValueFn = async () => {
  const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`
  const passwordHash = await hashPFn(password, saltRounds)
  return [
    SqlString.escape(faker.internet.email().toLowerCase()),
    SqlString.escape(fullName),
    SqlString.escape(passwordHash),
  ].join(', ')
}

const populateAccounts = () => executeWithConnection(async (conn) => {
  const insertValues = [
    ...await predefinedUsersFn(),
    await randomUserInsertValueFn(),
  ]

  const sqlStr = `
          INSERT INTO ${TABLES.ACCOUNT} 
          (email, full_name, password_hash)
          VALUES ${insertValues.map((row) => `( ${row} )`).join(', ')}
          ON CONFLICT (email)
            DO UPDATE
            SET 
              email = excluded.email,
              full_name = excluded.full_name,
              password_hash = excluded.password_hash
          RETURNING id, email,  full_name as fullName;
        `
  const { rows: insertedAccounts } = await conn.query(sqlStr)

  const [person1, person2] = insertedAccounts
  console.info('finish populate accounts')

  const numTasks = Array.from(Array(10), (_, i) => i)

  const board1 = await BoardService.create(
    {
      title: `${`${faker.lorem.slug()} ${1}`}`,
      createdBy: person1.id,
    },
  )

  for (const i of numTasks) {
    // eslint-disable-next-line no-await-in-loop
    await TaskService.create(
      {
        title: `${faker.lorem.slug()} ${i}`,
        description: `${faker.lorem.text()} ${i}`,
        priority: 'LOW',
        createdBy: person1.id,
        attachments: [],
        board: board1.id,
      },
    )
  }

  console.info('Populate agents')

  console.info('finish populate agents')

  console.info('Populate agents')

  console.info('finish populate agents')
})

populateAccounts()

export default populateAccounts
