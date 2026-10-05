import handleAsynError from "./handleAsynError.js";
import HandleError from "../utils/handleError.js";
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
 
 export const verifyUserAuth = handleAsynError(async(req, res, next) => {

    const {token} = req.cookies;
    console.log(token);
    const {user} = req;

    if(!token){
        return next(new HandleError("Please Login to access this resource", 401));
    }
    if(!user){
        return next(new HandleError("User not found", 404));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);

    req.user = await User.findById(decodedData.id);

    next();
})

export const roleBasedAccess = (...roles) => {
    return (req, res ,next) => {
        if(!roles.includes(req.user.role)){
            return next(new HandleError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}