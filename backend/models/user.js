const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter user name'],
        maxLength: [30,'Your name cannot exceed 30 character']
        
    },
    email:{
        type:String,
        required:[true,'Please enter email id'],
        unique:true,
        validate:[validator.isEmail,'Please enter valid email id  ']
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[6,'Your Password must be minimum 6 charcter'],
        select: false
    },
    avatar:{
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default: 'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date

})

//for password encrypt
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
//retturn jwt token
userSchema.methods.getJwtToken = function(){
            return jwt.sign({ id:this._id},process.env.JWT_SECRET,{
                expiresIn: process.env.JWT_EXPIRES_TIME
            });
}
//password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash set to reset password
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //set token expire
    this.resetPasswordExpire = Date.now() + 30*60*1000
    return resetToken
}
module.exports=mongoose.model('User',userSchema)