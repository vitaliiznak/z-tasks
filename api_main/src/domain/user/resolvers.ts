/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import UserService from '../../services/user'

const userGetById = (
  _prev,
  { id }, // {req, res}
  { user },
  _info,
) => UserService.getById(id, { insureDataFromBoardOfUser: user.id })

const userGetList = (
  _prev,
  _args, // {req, res}
  { user },
  _info,
) => UserService.getList({ insureDataFromBoardOfUser: user.id })

export default {
  Query: {
    userGetList,
    userGetById,
  },
}
