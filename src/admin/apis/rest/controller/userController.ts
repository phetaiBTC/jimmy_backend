import { Request, Response } from 'express'
import { signToken } from '@/utils/jwt'
import Users from '@/models/Users'
import { genHash } from '@/utils/bcrypt'
const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      const accessToken = signToken(auth)
      res.status(200).json({ accessToken })
    } catch (e) {
      res.send(e)
    }
  }
}
export default userController