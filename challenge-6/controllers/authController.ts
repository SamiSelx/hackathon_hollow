import { Request,Response } from "express"
import { generateAcessToken } from "../../utils/genToken"
import bcrypt from 'bcrypt'
import { isEmailValid,checkPasswordStrength } from "../../utils/credentatilsCheck"
import { db } from "../../utils/db.server"
const Register = async (req:Request,res:Response) =>{
     const {email,password} = req.body
     if(!email || !password){
          res.status(401).send("email and password are required")
     }
     try{
          const user =await  db.user.findFirst({
               where:{
                    email
               }
          })
          if(user){
               res.status(401).send('user already exists with this email')
          }
          const strengthP : string = checkPasswordStrength(password);
          const salt =await  bcrypt.genSalt()
          const hashedP = await bcrypt.hash(password,salt)
          const newUser = await db.user.create({
               data:{
                    email,
                    password:hashedP
               }
          })
          const token = generateAcessToken(newUser.id)
          res.cookie('jwt',token,{httpOnly:false})
          res.redirect('/')
          
     }catch(error: any){
          console.log(error)
     }
}
const Login = async (req:Request,res:Response) =>{
     const {email,password} = req.body
     console.log('request came')

     try{
          if(!isEmailValid(email)){
               throw new Error('invalid email')
          }
          const user = await db.user.findFirst({
               where:{
                    email
               }
          })
          if(!user){
               throw new Error('email not found')
          }
          const auth: boolean = await bcrypt.compare(password,user.password)
          if(!auth){
               throw new Error('invalid password')
          }else{
               const token :string|undefined = generateAcessToken(user.id)
               res.cookie('jwt',token)
               res.status(201).json({ success: true, userId: user.id });
          }
     }catch(error:any){
          res.status(401).send(error)
          console.log(error)
     }
}
export {Register,Login}

