import express from "express";
import { joinRoom,createRoom,getRoom, leaveRoom } from "../controllers/roomControllers";
import Authorization from "../middlewares/authorization";
const router = express.Router();


// join room
router.post('/join',Authorization,joinRoom)

//create room
router.post('/create',Authorization,createRoom)

router.post('/leave',Authorization,leaveRoom)

router.get("/:roomName", getRoom);

export default router;
