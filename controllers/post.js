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
        });
        await post.save();
        const friends = user.friends;
        friends.push(userId);
        //console.log("friends : ",friends);
        let posts = await Post.find({userId:{$in:friends}}).sort({ createdAt : -1});
        for(let post of posts){
            if(post.comments){
                for(let comment of post.comments.keys()){
                    //console.log(comment);
                    let user = await User.findById(comment);
                    user.comment = post.comments[comment];
                    let obj = {
                        firstName : user.firstName,
                        picturePath : user.picturePath,
                        comment : post.comments.get(comment)
                    }
                    //console.log(obj);
                    post.comments.set(comment,JSON.stringify(obj));
                }
            }
        }
        res.status(201).json(posts);//201 indicates the requested entity was created
    }
    catch(err){
        res.status(409).json({error:err.message});//409 indicates a conflict with current state of resource
    }

}

//read
export const getFeedPosts = async (req,res) => {
    try{
        let posts = await Post.find().sort({ createdAt : -1});
        for(let post of posts){
            if(post.comments){
                for(let comment of post.comments.keys()){
                    //console.log(comment);
                    let user = await User.findById(comment);
                    user.comment = post.comments[comment];
                    let obj = {
                        firstName : user.firstName,
                        picturePath : user.picturePath,
                        comment : post.comments.get(comment)
                    }
                    //console.log(obj);
                    post.comments.set(comment,JSON.stringify(obj));
                }
            }
        }
        return res.status(200).json(posts);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}
export const getFriendsPosts = async (req,res) => {
    try{
        const {userId} = req.params;
        const user = await User.findById(userId);
        const friends = user.friends;
        friends.push(userId);
        let posts = await Post.find({userId:{$in:friends}}).sort({ createdAt : -1});
        for(let post of posts){
            if(post.comments){
                for(let comment of post.comments.keys()){
                    //console.log(comment);
                    let user = await User.findById(comment);
                    user.comment = post.comments[comment];
                    let obj = {
                        firstName : user.firstName,
                        picturePath : user.picturePath,
                        comment : post.comments.get(comment)
                    }
                    //console.log(obj);
                    post.comments.set(comment,JSON.stringify(obj));
                }
            }
        }
        return res.status(200).json(posts);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

export const getUserPosts = async (req,res) => {
    try{
        const {userId} = req.params;
        let posts = await Post.find({userId:userId});
        for(let post of posts){
            if(post.comments){
                for(let comment of post.comments.keys()){
                    //console.log(comment);
                    let user = await User.findById(comment);
                    user.comment = post.comments[comment];
                    let obj = {
                        firstName : user.firstName,
                        picturePath : user.picturePath,
                        comment : post.comments.get(comment)
                    }
                    //console.log(obj);
                    post.comments.set(comment,JSON.stringify(obj));
                }
            }
        }
        //console.log(posts);
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
        let updatedPost = await Post.findByIdAndUpdate(id,{
            likes : post.likes
        },{new:true});
        if(updatedPost.comments){
                for(let comment of updatedPost.comments.keys()){
                    //console.log(comment);
                    let user = await User.findById(comment);
                    user.comment = updatedPost.comments[comment];
                    let obj = {
                        firstName : user.firstName,
                        picturePath : user.picturePath,
                        comment : updatedPost.comments.get(comment)
                    }
                    //console.log(obj);
                    updatedPost.comments.set(comment,JSON.stringify(obj));
                }
        }
        return res.status(200).json(updatedPost);

    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

export const addComment = async (req,res)=>{
    try{
        const {id} = req.params;
        const {userId,comment} = req.body;
        const post = await Post.findById(id);
        post.comments.set(userId,comment);
        let updatedPost = await Post.findByIdAndUpdate(id,{
            comments : post.comments
        },{new:true});
        if(updatedPost.comments){
            for(let comment of updatedPost.comments.keys()){
                //console.log(comment);
                let user = await User.findById(comment);
                user.comment = updatedPost.comments[comment];
                let obj = {
                    firstName : user.firstName,
                    picturePath : user.picturePath,
                    comment : updatedPost.comments.get(comment)
                }
                //console.log(obj);
                updatedPost.comments.set(comment,JSON.stringify(obj));
            }
        }
        return res.status(200).json(updatedPost);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

export const deleteComment = async (req,res)=>{
    try{
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        post.comments.delete(userId);
        let updatedPost = await Post.findByIdAndUpdate(id,{
            comments : post.comments
        },{new:true});
        if(updatedPost.comments){
            for(let comment of updatedPost.comments.keys()){
                //console.log(comment);
                let user = await User.findById(comment);
                user.comment = updatedPost.comments[comment];
                let obj = {
                    firstName : user.firstName,
                    picturePath : user.picturePath,
                    comment : updatedPost.comments.get(comment)
                }
                //console.log(obj);
                updatedPost.comments.set(comment,JSON.stringify(obj));
            }
        }
        return res.status(200).json(updatedPost);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}
