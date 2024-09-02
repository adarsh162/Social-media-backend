import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { sendMessage, getChatMessages } from "../controllers/message.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/getChatMessages/:chatRoomId", verifyToken, getChatMessages);

export default router;

