const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');
// const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });
    sendToken(user, 200, res, "User Registered Successfully");
});


exports.loginUser = catchAsyncError(async (req,res,next)=> {
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler('Please Enter Email & password', 400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    const isPassword = await await user.comparePassword(password)
    if(!isPassword) {
        return next(new ErrorHandler('Invalid Email or Password', 401))

    }
    sendToken(user, 200, res )
})