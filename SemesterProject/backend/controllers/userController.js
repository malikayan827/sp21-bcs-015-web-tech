const Product = require("../models/productModel");
const sendToken = require("../utils/jwttoken");
const ErrorHandler = require("../utils/errorhandler");
const User=require('../models/userModel')
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//register a user
exports.registerUser = catchAsyncErrors( async(req, res, next) => {
  
    const{name,email,password}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'this is a sample id',
            url:'profilepic'
        }
    })
    sendToken(user,201,res);


})
//login user
exports.loginUser = catchAsyncErrors( async(req, res, next) => {
    const {email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',400));
    }

    const user=await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password',401));
    }
    //check if password is correct or not
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401));
    }
    sendToken(user,200,res);
}
)
//logout user
exports.logoutUser = catchAsyncErrors( async(req, res, next) => {
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'Logged out'
    })
}
)
//forgot password
exports.forgotPassword = 
catchAsyncErrors( async(req, res, next) => {
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email',404));
    }
    //get reset token
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    //create reset password url
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message=`Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email,then ignore it`;
    try{
        await sendEmail({
            email:user.email,
            subject:'ShopIT password recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to:${user.email}`
        })
    }
    catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }
}
)

