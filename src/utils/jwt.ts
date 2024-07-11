import Jwt from 'jsonwebtoken'

const secret: string = process.env.JWT_SECRET || 'khueher2020'

export const signToken = (user: any) => {
    return Jwt.sign({   // Generate Token
        userId: user._id
    }, secret, { expiresIn: '30d' }) // secret key
}
export const signVerificationCodeToken = (EmpID: number, verifyCode: string) => {
    return Jwt.sign({
        EmpID,
        verifyCode
    }, secret, { expiresIn: '90d' })
}

export const loginToken = (userId: String) => {
    return Jwt.sign({
        userId
    }, secret, { expiresIn: '365d' })
}