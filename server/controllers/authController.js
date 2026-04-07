//Register User
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;

    if(!name || !email || !password){
       return next(new ErrorHandler('Please Provide  all Required fields',400));
    }
    
    let user=await User.findOne({email});
    if(user){
        return next(new ErrorHandler('User already exists',400));
    }
    user=new User({name,email,password,role});
    await user.save();
    generateToken(user,201,'User Registered Successfully',res);
    
});

export const login=asyncHandler(async(req,res,next)=>{
    const {email,password,role}=req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler('Please Provide Email, Password and Role',400));
    }
    const user=await User.findOne({email,role}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or Password Credentials',401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or Password ',401));
    }
    generateToken(user,200,'Login Successful',res);

});

export const getUser=asyncHandler(async(req,res,next)=>{

});

export const logOut=asyncHandler(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(
            Date.now() 
        ),
        httpOnly:true,

    }).json({
        success:true,
        message:'Logged Out Successfully',
    });
});

export const forgotPassword=asyncHandler(async(req,res,next)=>{});

export const resetPassword=asyncHandler(async(req,res,next)=>{});