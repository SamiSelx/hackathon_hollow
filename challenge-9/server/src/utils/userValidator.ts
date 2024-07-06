import Joi from 'joi'

export const userValidator = Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().required(),
    room:Joi.string()
})