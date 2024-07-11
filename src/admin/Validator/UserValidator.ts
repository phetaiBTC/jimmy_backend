import { Request, Response, NextFunction } from "express"
import { userValidation, login } from '@/admin/Validations/UserValidation'
export const userValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userValidation.validateAsync(req.body)
  } catch (e:any) {
    return res.status(400).json({ error: e.details[0].message })
  }
  next()
}
export const logins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login.validateAsync(req.body)
  } catch (e:any) {
    return res.status(400).json({ error: e.details[0].message })
  }
  next()
}