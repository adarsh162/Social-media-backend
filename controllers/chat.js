import Chat from "../models/ChatModel.js";
import User from "../models/User.js";

export const accessChat = async (req, res) => {
    const { id, userId } = req.params;
    var alreadyPresent = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [id, userId] }
    }).populate("users", "-password").populate("latestMessage");
    alreadyPresent = await User.populate(
        alreadyPresent, {
        path: "latestMessage.sender",
        select: "firstName lastName email picturePath"
        }
    );
    //console.log(alreadyPresent);
    return res.send(alreadyPresent);
}

export const fetchAllChats = async (req, res) => {
    const { id } = req.params;
    var alreadyPresent = await Chat.find({
        isGroupChat: false,
        users: { $all: [id] }
    }).populate("users", "-password").populate("latestMessage");
    alreadyPresent = await User.populate(
        alreadyPresent, {
        path: "latestMessage.sender",
        select: "firstName lastName email picturePath"
        }
    );
    return res.send(alreadyPresent);
}
