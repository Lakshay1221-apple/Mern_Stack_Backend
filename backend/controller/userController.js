import handleAsynError from '../middleware/handleAsynError.js';
import User from "../models/userModel.js";

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

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        user,
        token
    })

})

// Login User
export const loginUser = handleAsyncError(async(req, res, next) => {
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

    const token = user.getJWTToken();

    res.status(200).json({
        success: true,
        token
    })
})


