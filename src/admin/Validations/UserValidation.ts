import Joi from 'joi'

export const userValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})
export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})