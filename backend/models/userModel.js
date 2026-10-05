import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter Your Name"],
        maxLength : [25, "Name cannot exceed 25 characters"],
        minLength : [4, "Name should have more than 4 characters"]
    },

    email : {
        type : String,
        required : [true, "Please Enter Your Email"],
        unique : true,
        validate : [validator.isEmail, "Please Enter a valid Email"]
    },

    password : {
        type : String,
        required : [true, "Please Enter Your Password"],
        minLength : [8, "Password should be greater than 8 characters"],
        select : false
    },

    avatar : {
        public_id : {
            type : String,
            required : true
        },
        url : {
            type : String,
            required : true
        }
    },

    role : {
        type : String,
        default : "user"
    },

    createdAt : {
        type : Date,
        default : Date.now
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date,


},{
    timestamps : true
});
// Password hashing and other methods can be added here as needed


userSchema.pre("save", async function(next){
    this.password = await bcryptjs.hash(this.password, 10);

    if(!this.isModified("password")){
        return next();
    }
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword, this.password);
}

export default mongoose.model("User", userSchema);