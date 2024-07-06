import { Request,Response } from "express";
import UserModel from "../models/user.model";

const updateUser = async (req:Request,res:Response)=>{
    let room = req.body.room == '' ? 'global' : req.body.room
    console.log(room);
    
    if(room !== ''){
        console.log('inside update',room)
    }else console.log("gg");
    
    
   try {
    const updateUser = await UserModel.updateOne({_id:req.user._id},{room:room})
    console.log(updateUser);
    
    res.status(200).json({status:'success',message:'updated successfully'})
    return
   } catch (error) {
    console.log(error);
    res.status(400).json({status:'failed',message:'error'})
    return
   }
}

export default updateUser