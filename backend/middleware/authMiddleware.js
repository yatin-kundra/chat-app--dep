import jwt from 'jsonwebtoken';
import User from "../models/userModel.js"
import AsyncHandler from "express-async-handler";

// this is so that only loged in user can do the searching and all other things


export const protect = AsyncHandler(async(req, res, next) => {
    let token;

    if(     // token will be send with the request and it will be a bearer token like bearer jfldjfdslfjd 
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];

            // decode token id 
            const decoded = jwt.verify(token,process.env.JWT_SECTER)

                // finding the user and returning it without the password
            req.user = await User.findById(decoded.id).select("-password")  
            
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized, Token Failed");

        }
    }

    if(!token){
        res.status(401);
        throw new Error("Not Authorized, No Token");
    }
    
})