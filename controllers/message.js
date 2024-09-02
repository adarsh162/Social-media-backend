import Chat from "../models/ChatModel.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";
export const sendMessage = async (req, res) => {
    const {chatRoomId, messageContent, sender} = req.body;
    var newMessage = Message({
        sender : sender,
        content : messageContent,
        chat : chatRoomId
    });
   // console.log(req.body);
    try{
        await newMessage.save();
        newMessage = await User.populate(newMessage, {path: "sender", select: "firstName lastName picturePath"});
        newMessage = await Chat.populate(newMessage, {path: "chat", select: "chatName isGroupChat users latestMessage"});
        newMessage = await User.populate(newMessage, {path: "chat.users", select: "firstName lastName picturePath email"});
        await Chat.findByIdAndUpdate(chatRoomId, {
            latestMessage : newMessage
        });
        return res.status(200).json(newMessage);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

export const getChatMessages = async (req, res) => {
    try{
        const messages = await Message.find({chat : req.params.chatRoomId}).populate("sender", "firstName LastName picturePath").populate("chat");
        return res.status(200).json(messages);
    }   
    catch(err){
        return res.status(404).json({error:err.message});
    }
}