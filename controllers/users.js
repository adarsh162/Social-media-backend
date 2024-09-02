import User from "../models/User.js";
import Chat from "../models/ChatModel.js";

//Read
export const getUser = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        return res.status(200).json(user);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

export const getUserFriends = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        )
        return res.status(200).json(formattedFriends);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}
export const getUserRequests = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friend_requests.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        )
        return res.status(200).json(formattedFriends);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}

//update
export const addRemoveFriend = async (req,res)=>{
    try{
        //console.log("req came : ",req.params)
        const {id,friendId} = req.params;
        const user_id = id;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        // console.log("user found : ",user.friends)
        // console.log("friend found : ",friend.friends)
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id !== friendId);
            friend.friends = friend.friends.filter((id)=> id !== user_id);
            
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
            //console.log("not already friends : ",friendId)
        }
        // console.log("user after : ",user.friends)
        // console.log("friend after : ",friend.friends)
        await user.save();
        await friend.save();
        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        //console.log("map friends: ",friends)
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        );
        return res.status(200).json(formattedFriends);
    }
    catch(err){
        return res.status(404).json({error:err.message});
    }
}
export const send_request = async (req, res) => {
    const { id, friendId } = req.params;
    const friend = await User.findById(friendId);
    friend.friend_requests.push(id);
    await friend.save();
    return res.status(200).json({});
}

export const accept_request = async (req, res) => {
    const {id,friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        user.friends.push(friendId);
        friend.friends.push(id);
        user.friend_requests = user.friend_requests.filter((id) => id !== friendId);
        await user.save();
        await friend.save();
        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        )
        var alreadyPresent = await Chat.findOne({
            isGroupChat: false,
            users: {  $all: [ id, friendId] },
        }).populate("users", "-password").populate("latestMessage")
    
        alreadyPresent = await User.populate(
            alreadyPresent, {
            path: "latestMessage.sender",
            select: "firstName lastName email picturePath"
        }
        );
        if (!alreadyPresent || alreadyPresent.length <= 0) {
            var chatData = new Chat({
                chatName: "sender",
                isGroupChat: false,
                users: [id, friendId],
            });
            try {
                await chatData.save();
            }
            catch (err) {
                return res.status(404).json({ error: err.message });
            }
        }
        return res.status(200).json(formattedFriends);
}

export const cancel_request = async (req, res) => {
    const {id,friendId} = req.params;
        const user_id = id;
        const user = await User.findById(user_id);
        user.friend_requests = user.friend_requests.filter((id) => id !== friendId);
        await user.save();
        return res.status(200).json({});
}
export const removeFriend = async (req, res) => {
        const {id,friendId} = req.params;
        const user_id = id;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        user.friends = user.friends.filter((id)=> id !== friendId);
        friend.friends = friend.friends.filter((id)=> id !== user_id);
        await user.save();
        await friend.save();
        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath} 
            }
        );
        return res.status(200).json(formattedFriends);
}

export const getUsers = async (req, res) => {
    const user = await User.findById(req.params.id);;
    let userFriends = user.friends || [];
    userFriends.push(req.params.id);
    console.log("ufriend" ,userFriends);
    const users = await User.find({ _id: { $nin: userFriends } }).select([
        "_id",
        "firstName",
        "lastName",
        "occupation",
        "location",
        "picturePath",
    ]);
    console.log("users" ,users);
    return res.status(200).json(users);
}

export const getSearchUsers = async (req, res) => { 
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "_id",
        "firstName",
        "lastName",
        "occupation",
        "location",
        "picturePath",
    ]);
    //console.log("users" ,users);
    return res.status(200).json(users);
}