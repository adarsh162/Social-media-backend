import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    send_request,
    cancel_request,
    accept_request,
    getUserRequests,
    removeFriend,
    getUsers,
    getSearchUsers
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

//read
router.get("/:id",verifyToken,getUser)
router.get("/:id/getUsers",verifyToken,getUsers)
router.get("/:id/getSearchUsers",verifyToken,getSearchUsers)
router.get("/:id/friends",verifyToken,getUserFriends)

//update
router.get("/removeFriend/:id/:friendId",verifyToken,removeFriend)

router.get("/sendRequest/:id/:friendId",verifyToken,send_request)
router.get("/cancelRequest/:id/:friendId",verifyToken,cancel_request)
router.get("/acceptRequest/:id/:friendId",verifyToken,accept_request)
router.get("/getUserRequests/:id",verifyToken,getUserRequests)
export default router


