import express from "express";
import RoomModel from "../models/room.modelv2";
import { joinRoom,createRoom } from "../controllers/roomControllers";
import Authorization from "../middlewares/authorization";
const router = express.Router();


// join room

router.post('/join',Authorization,joinRoom)

//create room

router.post('/create',Authorization,createRoom)

router.get("/:roomName", async (req, res) => {
  console.log(req.params);

  let { roomName } = req.params;
  console.log(roomName);

  try {
    const room = await RoomModel.findOne({ roomName });
    res
      .status(200)
      .json({ status: "success", message: "room found", data: room });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed", message: "room Not found" });
    return;
  }
});

export default router;
