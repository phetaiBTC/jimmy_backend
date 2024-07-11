import passport from 'passport'
import passportJWT from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import Users from "../models/Users"
import bcrypt from 'bcrypt'
import { authenticate } from 'passport'
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

const secret: string = process.env.JWT_SECRET || 'khueher2020'

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user)
})
// used to deserialize the user
passport.deserializeUser((_id, done) => {
  Users.findById(_id, (err: any, user: any) => {
    done(err, user)
  })
})
passport.use('isAdmin', new JwtStrategy({ // Use Strategy to find token from a user ( check Auth, return user from db )
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
}, async (payload: any, done: any) => {
  try {
    const user = await Users.findOne({ _id: payload.userId, role: 'Admin' })  // Find the user specified in token
    if (!user) {  // If user doesn't exists, handle it
      return done(null, false)
    }
    done(null, user)  // Otherwise, return the user
  } catch (err) {
    done(err, false)
  }
}))
passport.use('isUser', new JwtStrategy({ // Use Strategy to find token from a user ( check Auth, return user from db )
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
}, async (payload: any, done: any) => {
  try {
    const user = await Users.findOne({ _id: payload.userId, role: 'user' })  // Find the user specified in token
    if (!user) {  // If user doesn't exists, handle it
      return done(null, false)
    }
    done(null, user)  // Otherwise, return the user
  } catch (err) {
    done(err, false)
  }
}))

passport.use('adminSignIn', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {

    const user: any = await Users.findOne({ email })

    if (user && user.role !== 'Admin') {
      return done(null, false, { message: 'You are user can not login to admin!' })
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect email' })
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return done(null, false, { message: 'Incorrect password' })
    }
    done(null, user)
  } catch (e) {
    done(e, false)
  }
}))

passport.use('userSignIn', new LocalStrategy({
  usernameField: 'mobile',
  passwordField: 'password',
}, async (mobile, password, done) => {
  try {
    const user: any = await Users.findOne({ mobile })
    if (user && user.role !== 'user') {
      return done(null, false, { message: 'You are not a user' })
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect mobile' })
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return done(null, false, { message: 'Incorrect password' })
    }
    done(null, user)
  } catch (e) {
    done(e, false)
  }
}))
export const isAdmin = passport.authenticate('isAdmin', { session: false })

export const isUser = passport.authenticate('isUser', { session: false })

export default passport