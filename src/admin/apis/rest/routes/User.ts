import { Router, Request, Response } from 'express'
import { isAdmin } from '@/plugins/passport'
import userController from '../controller/userController'
import { adminSignIn } from '../../../../middlewares/auth'
import { userValidator, logins } from '@/admin/Validator/UserValidator'
const router: Router = Router()
router.route('/admin-login')
  .post(logins, adminSignIn, userController.login)
export default router