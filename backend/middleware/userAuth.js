 import handleAsynError from "../utils/handleAsyncError.js";
 
 export const verifyUserAuth = handleAsynError(async(req, res, next) => {

    const token = req.cookies;
    console.log(token);

})