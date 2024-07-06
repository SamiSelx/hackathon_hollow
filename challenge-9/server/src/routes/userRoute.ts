import express from 'express'
import login from '../controllers/login'
import register from '../controllers/register'
import Authorization from '../middlewares/authorization'
import updateUser from '../controllers/updateUser'

const router = express.Router()


router.post('/register',register)

router.post('/login',login)

router.get('/me',Authorization,(req,res)=>{
    const user = {
        id:req.user._id,
        username:req.user.username,
        email:req.user.email,
        room:req.user.room
    }
    res.status(200).json({status:'success',message:'User is authorized',data:user})
})

router.patch('/me',Authorization,updateUser)

export default router