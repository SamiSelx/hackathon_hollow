import express from 'express'
import {login,register} from '../controllers/auth'
import { getAllUsers, getUser, updateUser } from '../controllers/userControllers'
import Authorization from '../middlewares/authorization'

const router = express.Router()


router.post('/register',register)

router.post('/login',login)

router.get('/',Authorization,getAllUsers)

router.get('/me',Authorization,getUser)

router.patch('/me',Authorization,updateUser)

export default router