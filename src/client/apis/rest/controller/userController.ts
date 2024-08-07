import { Request, Response } from 'express'
import { loginToken, signToken } from '@/utils/jwt'
import Users from '@/models/Users'
import { genHash } from '@/utils/bcrypt'
import moment from 'moment'
import { find } from 'lodash'
const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      const token = signToken(auth)
      res.status(200).json({ token })
    } catch (e: any) {
      res.status(501).send(e)
    }
  },
  UserRegister: async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, role, mobile } = req.body
    try {
      const isEmail = await Users.findOne({ email })
      if (isEmail) return res.status(409).json({ message: "ອິເມວນີ້ມີຢູ່ໃນຖານຂໍ້ມູນແລ້ວ, ກະລຸນາໃຊ້ອິເມວອື່ນ" })
      const addUser = new Users({ firstName, lastName, email, password: genHash(password), role, mobile })
      await addUser.save()
      res.status(201).json({ addUser })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  getUsers: async (req: Request, res: Response) => {
    const { page, perpage, search }: any = req.query
    try {
      const isPage = parseInt(page)
      const isPerPage = parseInt(perpage)
      const userList = await Users.find({
        $and: [
          search ? {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          } : {}
        ]
      }).skip((isPage * isPerPage) - isPerPage)
        .limit(isPerPage)
      const countTotal = await Users.find({
        $and: [
          search ? {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          } : {}
        ]
      }).countDocuments()
      const mapper = await Promise.all(
        userList.map((i: any) => {
          return {
            _id: i._id,
            firstName: i.firstName,
            lastName:i.lastName,
            email: i.email,
            mobile: i.mobile,
            role: i.role,
            createdAt: moment(i.createdAt).locale('lo').format('YYYY-MMM-DD')
          }
        })
      )
      console.log("is Done")
      res.status(200).json({ info: mapper, countTotal })

    } catch (e) {
      console.error(e)
      res.status(501).json(e)
    }
  },
  delete: async (req: Request, res: Response) => {
    const { _id } = req.params
    try {
      const isId = await Users.findById(_id)
      if (!isId) return res.status(404).json({ massage: "ບໍ່ພົບ ID" })
      await Users.findByIdAndDelete(_id)
      res.status(200).json({ massage: "ລົບສຳເລັດ" })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  edit: async (req: Request, res: Response) => {
    const { _id } = req.params
    try {
      const findUser = await Users.findById(_id)
      res.status(200).json({ info: findUser })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  update: async (req: Request, res: Response) => {
    const { _id, firstName, lastName, email, password, mobile } = req.body
    try {
      const isUser = await Users.findOne({ _id, email })
      console.log(isUser)
      if (isUser) {
        const form: any = {
          firstName, lastName, password, mobile
        }
        if (password) form.password = genHash(password)
        const is_user = await Users.findByIdAndUpdate(_id, {
          $set: form
        }, { new: true })
        res.status(200).json({ is_user })
      }
      else {
        const isEmail = await Users.findOne({ email })
        if (isEmail) return res.status(409).json({ message: "ອິເມວນີ້ການໃນລະບົບແລ້ວ, ກະລຸນາໃຊ້ອິເມວອື່ນ" })
        const form: any = {
          firstName, lastName, password, mobile,email
        }
        if (password) form.password = genHash(password)
        await Users.findByIdAndUpdate(_id, {
          $set: form
        }, { new: true })
      }
    }
    catch (e) {
      res.status(501).send(e)
    }
  }
}
export default userController