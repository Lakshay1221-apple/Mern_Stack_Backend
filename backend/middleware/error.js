import HandleError from "../utils/handleError.js";

export default (err, req , res ,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // cast error 
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new HandleError(message, 400);
    }

    // Duplicate Email error 

    if(err.code === 11000){
        const message = `This email ${err.keyValue} Already exists. Please use another email`;
        err = new HandleError(message, 400);
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })

}