import express from "express";
import {addComment, deleteComment, getFeedPosts,getFriendsPosts,getUserPosts,likePost} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


//read
router.get("/",verifyToken,getFeedPosts);
router.get("/:userId",verifyToken,getFriendsPosts);
router.get("/:userId/posts",verifyToken,getUserPosts);

//update
router.patch("/:id/like",verifyToken,likePost);
router.patch("/:id/addComment", verifyToken, addComment);

//delete
router.delete("/:id/deleteComment",verifyToken, deleteComment);

export default router;