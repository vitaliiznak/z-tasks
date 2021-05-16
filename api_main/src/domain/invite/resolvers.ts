import moment from 'moment'
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import InviteService from '../../services/invite'
import UserService from '../../services/user'

const inviteCount = (
  _prev,
  _req,
  { filter },
  _info,
): Promise<number> => InviteService.count(filter)

const inviteGetList = (
  _prev,
  { filter },
  { user },
  _info,
) => {
  return InviteService.getList(filter, { insureDataFromBoardOfUser: user.id })
}

const inviteGetById = (
  _prev,
  { id },
  { user },
  _info,
) => InviteService.getById(id, { insureDataFromBoardOfUser: user.id })

const inviteCreate = (
  _prev,
  {
    input:
    {
      boardId,
      description,
    },
  },
  { user },
  _info,
): Promise<any> => InviteService.create({
  boardId,
  description,
  createdBy: user.id,
})

const inviteJoinBoard = (
  _prev,
  { id, input },
  _context,
  _info,
) => InviteService.update(id, input) // TaskService.update(id)

const inviteInvalidate = (
  _prev,
  { id }, // {req, res}
  _context,
  _info,
) => InviteService.remove(id)

export default {
  Invite: {
    createdBy({ createdById }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return UserService.getById(createdById)
    },
    state({ state, expirationTime }) {
      const date = moment()
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return date.isAfter(expirationTime) ? 'EXPIRED' : state
    },
  },
  Query: {
    inviteCount,
    inviteGetList,
    inviteGetById,
    /*    job,
       jobs, */
  },
  Mutation: {
    inviteCreate,
    inviteJoinBoard,
    inviteInvalidate,
  },
}
