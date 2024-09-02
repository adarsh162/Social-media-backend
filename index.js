import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";
import { Server } from 'socket.io';


//Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
//to invoke over application we use express as a function to invoke our application
const app = express();

app.use(cors());//so this will invoke cross origin resource sharing policy
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
//app.use(bodyParser.json({limit:"30mb",extended:true}));//so we dont have any issue
//app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

app.use("/assets",express.static(path.join(__dirname,'public/assets')));//we are specifying that we will store our assets/images in that combined path

//set up the file storage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload = multer({storage});//so it sets up upload variable by assigning a multer object that has been created above,so any time we have to use this upload object to upload files only.

//routes with files
app.post("/auth/register",upload.single("picture"),register);//using upload and verify token middlewares for uploading pic to destination for user 
app.post("/posts",verifyToken,upload.single("picture"),createPost);
//routes without files-normal ones for auth
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);
app.use("/chat", chatRoutes);
app.use("/msgs", messageRoutes);

//mongoose setup
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(
    ()=>{
        console.log(`DB connected !`);
    }
).catch((error)=>console.log(error)); 

//create http server and listen it on port
const server = app.listen(PORT,()=>console.log(`Server Port : ${PORT}`));
//create socket io server with cors and ping timeout options
const io = new Server(server,{
    pingTimeout: 60000,
    cors: {
        origin : "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket)=>{
    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        socket.emit("connected", userData._id);
    });
    socket.on("join room", (roomId)=>{
        socket.join(roomId);
    });
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        chat?.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id)return;
            socket.in(user._id).emit("message_recieved", newMessageRecieved);
        });
    })
})


