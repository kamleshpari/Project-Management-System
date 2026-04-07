import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
//import { type } from 'os';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [30, 'Your name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],

    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Your password must be at least 8 characters long'],
        select: false,
    },
    role:{
        type: String,
        default: 'Student',
        enum:['Student', 'Teacher', 'Admin'],
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
 
    department:{
        type: String,
        trim: true,
        default: null,

    },
    experties:{
        type: [String],
        default: [],
    },
    maxStudents:{
        type: Number,
        default: 10,
        min: [1, 'Max students must be at least 1'],
    },
    assignedStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
    ],
    supervisor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    project:{
        
            type: mongoose.Schema.Types.ObjectId,   
            ref: 'Project',
            default: null,
        
    },
    
},
{    
    timestamps: true,
}
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
      next();
    }
    this.password=await bcrypt.hash(this.password,10); 
});


 userSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

export const User=mongoose.model('User',userSchema);