import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { accessChat,fetchAllChats } from "../controllers/chat.js";

const router = express.Router();

router.get("/:id/:userId/access", verifyToken, accessChat);
router.get("/:id/fetchAll", verifyToken, fetchAllChats);

export default router;