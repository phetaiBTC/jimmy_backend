import { authenticate } from 'passport'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

export const adminSignIn = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('adminSignIn', { session: false }, async (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            if (info.message === 'You are user can not login to admin!') return res.status(401).json({ message: info.message })
            if (info.message === 'Incorrect email') return res.status(401).json({ message: info.message })
            else if (info.message === 'Incorrect password') return res.status(401).json({ message: info.message })
        }
        req.logIn(user, (err) => {
            if (err) return next(err)
            next()
        })
    })(req, res, next)
}

export const userSignIn = (req: Request, res: Response, next: NextFunction) => {
    authenticate('userSignIn', { session: false }, async (err, user, info) => {
        if (err) return next(err)
        //console.log(user)
        if (!user) {
            if (info.message === 'You are not a user') return res.status(401).json({ message: info.message })
            if (info.message === 'Incorrect mobile') return res.status(401).json({ message: info.message })
            else if (info.message === 'Incorrect password') return res.status(401).json({ message: info.message })
        }
        req.logIn(user, (err) => {
            if (err) return next(err)
            next()
        })
    })(req, res, next)
}


export const customerSignIn = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('customerSignIn', { session: false }, async (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            if (info.message === 'Incorrect email') return res.status(401).json({ message: info.message })
            if (info.message === 'You have permission to login!') return res.status(401).json({ message: info.message })
            else if (info.message === 'Incorrect password') return res.status(401).json({ message: info.message })
        }
        req.logIn(user, (err) => {
            if (err) return next(err)
            next()
        })
    })(req, res, next)
}