import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//register user
export const register = async (req, res)=>{
    try{
        //console.log(req.body);
        const {firstName,lastName,email,password,picturePath,friends,location,occupation} = req.body;
        const salt = await bcrypt.genSalt();//for generating salt value
        const passwordHash = await bcrypt.hash(password,salt);//for generating hash value from passsword and salt

        const newUser = new User({
            firstName:firstName,lastName:lastName,email,password:passwordHash,picturePath,friends,location,occupation,viewedProfile:Math.floor(Math.random() * 10000),
            impressions : Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        //console.log(savedUser);
        return res.status(201).json(savedUser);

    }
    catch(err){
        return res.status(401).json({error:err.message});
    }
}
//function for login
export const login = async (req,res)=>{
     try{
        //console.log(req);
        const {email,password} = req.body;
        
        const user = await User.findOne({email : email});
        if(!user){
            return res.status(400).json({msg:"User does not exist"});
        }

        //if user exist then check his password
        const isMatch = await bcrypt.compare(password,user.password);
        //if psswrd doesn't match 
        if(!isMatch){
            return res.status(401).json({msg:"Invalid Credentials"});
        }
        //else when password also matches,create a jwt for that user
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password;//we are deleting password field from fetched user object so that that doesn't get sended to frontend for security purporse

        //send response object with user and jwt token
        return res.status(200).json({token,user});
     }
     catch(err){
        return res.status(401).json({error:err.message});
     }
}