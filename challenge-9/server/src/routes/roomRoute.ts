import express from "express";
import RoomModel from "../models/room.model";
const router = express.Router()

router.get('/:roomName',async (req,res)=>{
    console.log(req.params);
    
    let {roomName} = req.params
    console.log(roomName);
    
    try {
        const room = await RoomModel.findOne({roomName})
    res.status(200).json({status:'success',message:'room found',data:room})
    return
    } catch (error) {
        console.log(error);
        res.status(400).json({status:'failed',message:'room Not found'})
        return
    }
})

export default router