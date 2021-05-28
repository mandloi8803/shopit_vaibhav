const User = require('../models/user');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const user = require("../models/user");
//check user athunticate o r not
exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{

    const { token }= req.cookies
    console.log(token);
    if(!token){
        return next(new ErrorHandler('login first access resource',401))
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await user.findById(decoded.id);
    next()
})

//handling users role
exports.authorizeRoles=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403))
        }
        next()
    }
}

