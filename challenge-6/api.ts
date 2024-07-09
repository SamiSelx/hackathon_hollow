import express,{Express,Request,Response} from 'express'
import { configDotenv } from 'dotenv'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import formsRouter from './routes/forms'

configDotenv()
const api : Express = express()

api.listen(3000,()=> {
     console.log("it's working")    
})
api.use(express.static('public'));
api.set('view engine', 'ejs')
api.use(express.json())
api.use(cookieParser())
api.get('/',(req:Request,res:Response) =>{
     console.log('home page ')
     res.render('home',{name :'hiki'})
})
api.use('/forms',formsRouter)
api.use('/auth',authRouter)
