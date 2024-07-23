import { request } from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";

//create
export const createPost = async (req,res)=>{
    try{
        const {userId,description,picturePath} = req.body;
        const user = await User.findById(userId);
        const post = new Post({
            userId,
            firstName : user.firstName,
            lastName : user.lastName,
            location : user.location,
            description,
            userPicturePath : user.picturePath,
            picturePath,
            likes : {},
            comments : []
        })
        await post.save();
        const posts = await Post.find();
        res.status(201).json(posts);//201 indicates the requested entity was created
    }
    catch(err){
        res.status(409).json({error:err.message});//409 indicates a conflict with current state of resource
    }

}

//read
export const getFeedPosts = async (req,res) => {
    try{
        const posts = await Post.find().sort({ createdAt : -1});
        return res.status(200).json(posts);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

export const getUserPosts = async (req,res) => {
    try{
        const {userId} = req.params;
        const posts = await Post.find({userId:userId});
        return res.status(200).json(posts);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

//update
export const likePost = async (req,res)=>{
    try{
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        if(post.likes.get(userId)){
            post.likes.delete(userId);
        }
        else{
            post.likes.set(userId,true);
        }
        const updatedPost = await Post.findByIdAndUpdate(id,{
            likes : post.likes
        },{new:true});
        return res.status(200).json(updatedPost);

    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}
