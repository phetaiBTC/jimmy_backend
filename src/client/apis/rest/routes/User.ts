import { Router, Request, Response } from 'express'
import { isUser } from '@/plugins/passport'
import userController from '../controller/userController'
import { customerSignIn } from '../../../../middlewares/auth'
import uploadImage from '@/service/formidable'
import { adminSignIn } from '../../../../middlewares/auth'
import { isAdmin } from '@/plugins/passport'
const router: Router = Router()
router.route('/user-register')
  .post(userController.UserRegister)
router.route('/user-login')
  .post(adminSignIn,userController.login)
router.route('/get-users')
  .get(userController.getUsers)
router.route('/delete-users/:_id')
  .delete(userController.delete)
router.route('/edit-users/:_id')
  .get(userController.edit)
router.route('/update-users')
  .put(userController.update)


export default router