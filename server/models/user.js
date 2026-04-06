import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { type } from 'os';


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
    

  

});