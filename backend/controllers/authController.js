const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const cloundinary = require('cloudinary');
const auth = require('../middleware/auth');
const user = require('../models/user');
//console.log("hello auth1")

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    //const { name, email, password }=req.body;
    console.log("auth");
    const result = await cloundinary.v2.uploader.upload(req.body.avatar,{
        folder:'avatars',
        width: 150,
        crop:"scale"
    })
    //const { name, email, password } = req.body;
    console.log(req.body);
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
})
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    //check if user entered username and password
    if (!email || !password) {
        return next(new ErrorHandler('please enter email and passsword correct', 400))
    }

    //finding user data in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email id or password', 401));
    }
    //check if password not correct
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('invalid password or email', 401))
    }
    // const token = user.getJwtToken();

    // res.status(200).json({
    //     success:true,
    //     token
    // })
    sendToken(user, 200, res)
})
//for forgot reset password token
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('user email is not valid', 404))
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    //create reset password
    //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    //this is only for testing frontend url 
    const resetUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your Password reset token is as follow:\n\n${resetUrl}\n\nIf you have not send change
     password request then this email egnore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Shopit password recovery',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to:${user.email}`
        })

    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))

    }
})
//reset password for link
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler('password reset token is invalid or has been expire', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password does mot matched', 400))
    }
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res)
})
//password change when you know old password
exports.updatePassword = catchAsyncErrors( async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    //check privious password
    const isMatched= await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('old password is not correct',400))
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user,200,res)
}

)
//current login details of user like profile
// exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.findById(req.user.id);
//     res.status(200).json({
//         success: true,
//         user
//     })
// })
// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    //const user = await User.findById(req.body.role);
    res.status(200).json({
        success: true,
        user
    })
})
//update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    //update user profile
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})
//for logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})
console.log("hello auth");

//admin routes for fetch all users 
//get all users => /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async (req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})
//get access user details by admin 
// ==>/api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not found with this id :${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user
    })
})
//update user details by admin
exports.updateUser = catchAsyncErrors(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
}) 
// user delete by admin
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not found id:${req.params.id}`))
    }
    await user.remove();

    res.status(200).json({
        success:true
    })
})