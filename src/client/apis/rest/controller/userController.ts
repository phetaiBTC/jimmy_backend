import { Request, Response } from 'express'
import { loginToken, signToken } from '@/utils/jwt'
import Users from '@/models/Users'
import { genHash } from '@/utils/bcrypt'
const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      // console.log(auth)
      const token = signToken(auth)
      res.status(200).json({ token })
    } catch (e: any) {
      throw new Error(e)
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
    const { page, perPage, search }: any = req.query
    try {
      const isPage = parseInt(page)
      const isPerPage = parseInt(perPage)
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
      // const mapper = await Promise.all(
      //     userList.map((i: any) => {
      //         return {
      //             _id: i._id,
      //             fullName: i.fullName,
      //             address: i.village + ', ' + i.districtId.name + ", " + i.districtId.provinceId.name,
      //             email: i.email,
      //             mobile: i.mobile,
      //             role: i.role,
      //             createdAt: moment(i.createdAt).locale('lo').format('YYYY-MMM-DD')
      //         }
      //     })
      // )
      res.status(200).json({ info: userList, countTotal })

    } catch (e) {
      console.error(e)
      res.status(501).json(e)
    }
  },
  // Useralogin: async (req: Request, res: Response) => {
  //   const { email, password } = req.body

  // },
  UserLogin: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      const accessToken = signToken(auth)
      res.status(200).json({ accessToken })
    } catch (e) {
      res.status(501).send(e)
    }
  }
}
export default userController