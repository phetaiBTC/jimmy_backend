import { hashSync, compareSync } from 'bcrypt'

export const genHash = (plainTextPassword: string) => {
  return hashSync(plainTextPassword, 10) as string
}

export const compareHash = (plainTextPassword: string, HashedPassword: string) => {
  return compareSync(plainTextPassword,HashedPassword)as boolean
}
