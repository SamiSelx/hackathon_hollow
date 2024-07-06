import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/userRoute'
import roomRouter from './routes/roomRoute'
import './configs/connectDB'
import {app,httpServer} from './socket/socket'
const port = process.env.PORT

app.use(cors())

// Perse Form
app.use(express.urlencoded({extended:true}))
// Perse json
app.use(express.json())

app.use('/api/user',userRouter)
app.use('/api/room',roomRouter)


httpServer.listen(port,()=>{
    console.log(`Server Started on port ${port}`);
})
