import { Router, Request, Response } from 'express'
import { isUser } from '@/plugins/passport'
import userController from '../controller/userController'
import { customerSignIn } from '../../../../middlewares/auth'
import uploadImage from '@/service/formidable'
import { adminSignIn } from '../../../../middlewares/auth'
import { isAdmin } from '@/plugins/passport'
const router: Router = Router()

// router.route('/user-login')
//   .post(userSignIn, userController.login)
// router.route('/upload-image')
//   .post(uploadImage)
router.route('/user-register')
  .post(userController.UserRegister)
router.route('/user-login')
  .post(adminSignIn, userController.login)
router.route('/get-users')
  .get(isAdmin,userController.getUsers)


export default router