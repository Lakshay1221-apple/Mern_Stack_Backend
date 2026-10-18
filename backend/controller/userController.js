import handleAsynError from '../middleware/handleAsynError.js';
import User from "../models/userModel.js";
import {sendToken} from '../utils/jwtToken.js';
import HandleError from '../utils/handleError.js';
import crypto from 'crypto';

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

// Logout user 
export const logout = handleAsynError(async(req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

// Forget password 
export const requestPasswordReset = handleAsynError(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new HandleError("User not found with this email", 404));
    }

    let resetToken;

    try{
        resetToken = user.generatePasswordResetToken();
        await user.save({validateBeforeSave: false});
    } catch (error){
        return next(new HandleError("Error generating reset token", 500));
    }

    const resetPasswordUrl = `http://localhost:3000/api/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetPasswordUrl}\n\n
    If you have not requested this email, please ignore it.`;

    try{
        // Sent Email 
        await sendEmail({
            email : user.email,
            subject : "Password Recovery",
            message : message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });


    } catch (error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new HandleError("Error sending reset email", 500));
    }

    res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
        resetPasswordUrl
    });
});

// Reset password 
export const resetPassword = handleAsynError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); 
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user){
        return next(new HandleError("Reset Password Token is invalid or has been expired", 400));
    }

    const {password, confirmPassword} = req.body;

    if(password !== confirmPassword){
        return next(new HandleError("Password and Confirm Password do not match", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

}); 


// get user details 
export const getUserDetails = handleAsynError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
})

// Update user password
export const updatePassword = handleAsynError(async (req, res, next) => {

    const {oldPassword , newPassword , confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const checkPasswordMatch = await user.comparePassword(oldPassword);

    if(!checkPasswordMatch){
        return next(new HandleError("Old Password is incorrect", 400));
    }

    if(newPassword !== confirmPassword){
        return next(new HandleError("New Password and Confirm Password do not match", 400));
    }

    user.password = newPassword;
    await user.save();

    sendToken(user, 200, res);
});

// Updating a user profile 
export const updateProfile = handleAsynError(async (req, res, next) => {
    const {name , email} = req.body;
    const updateUserData = {
        name : name,
        email : email
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUserData, {
        new: true,  
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Admin getting all users
export const getUsersList = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
};

// Get single user details (Admin)
export const getSingleUser = handleAsynError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new HandleError(`User does not exist with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    })
});


// Change user role (Admin)
export const changeUserRole = handleAsynError(async (req, res, next) => {

    const {role} = req.body;

    const newUserData = {
        role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new : true,      
        runValidators : true,
    })   
    
    if(!user) {
        return next(new HandleError(`User does not exist with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    })
});

// Delete user (Admin)
export const deleteUser = handleAsynError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new HandleError(`User does not exist with id: ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
});