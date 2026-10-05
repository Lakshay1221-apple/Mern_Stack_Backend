import handleAsynError from '../middleware/handleAsynError.js';
import User from "../models/userModel.js";
import {sendToken} from '../utils/jwtToken.js';
import HandleError from '../utils/handleError.js';

// Register User
export const registerUser =  handleAsynError(async(req, res , next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicUrl"
        }
    })

    sendToken(user, 201, res);

})

// Login User
export const loginUser = handleAsynError(async(req, res, next) => {
    const {email , password} = req.body;

    if(!email || !password){
        return next(new HandleError("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new HandleError("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new HandleError("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
})


