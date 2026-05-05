import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import { generateForgotPasswordEmail } from "../utils/emailTeb.js";
import crypto from 'crypto';
import { sendEmail } from "../services/emailService.js";

//Register User
export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler('Please Provide  all Required fields', 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler('User already exists', 400));
    }
    user = new User({ name, email, password, role });
    await user.save();
    generateToken(user, 201, 'User Registered Successfully', res);

});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler('Please Provide Email, Password and Role', 400));
    }
    const user = await User.findOne({ email, role }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid email or Password Credentials', 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or Password ', 401));
    }
    generateToken(user, 200, 'Login Successful', res);

});

export const getUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });

});

export const logOut = asyncHandler(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(
            Date.now()
        ),
        httpOnly: true,

    }).json({
        success: true,
        message: 'Logged Out Successfully',
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const message = generateForgotPasswordEmail(resetPasswordUrl);

    try {
        await sendEmail({
            to: user.email,
            subject: 'FYP SYSTEM - Password Reset Request',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Password reset link sent to ${user.email}`,
        });
    } catch (error) {
        // Clear reset token if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Failed to send email. Please try again later.', 500));
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;


    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Invalid or expired password reset token', 400));
    }


    if (!req.body.password || !req.body.confirmPassword) {
        return next(new ErrorHandler('Please provide both password and confirm password', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    generateToken(user, 200, 'Password reset successful', res);
});