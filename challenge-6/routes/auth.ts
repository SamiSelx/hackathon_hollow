import express,{ Router,Request,Response } from "express";
import { Register,Login } from "../google_form_project/controllers/authController";
const router:Router = express.Router()
router.route('/sign-up')
.get((req:Request,res:Response)=>{
     res.status(301).render('auth/signup')
})
.post(Register)
router.route('/login')
.get((req:Request,res:Response)=>{
     console.log('request came')
     res.status(301).render('auth/login')
})
.post(Login)
export default router