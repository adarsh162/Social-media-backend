import jwt from "jsonwebtoken";


export const verifyToken = async(req,res,next)=>{
    try{
        let token = req.header("Authorization");
        //if token does not exist return error
        if(!token){
            return res.status(403).send("Unauthorized");
        }
        if(token.startsWith("Bearer ")){
            //to slice bearer keyword from token an get actual token  
            token = token.slice(7,token.length).trimLeft(); 
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);//to decode the token using jwt_secret key and fetch user id
        req.user = verified;//assign fetched user id (decoded from token using jwt secret_key and verify method)to req.user so whenever we use req.user we get the id of user that is loggged in using token(because we have stored user id in token)
        next();//call the next cb function middleware

    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}