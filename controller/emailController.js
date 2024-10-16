// controllers/emailController.js
const User = require('../models/user');
const catchAsyncError = require('../middlewares/catchAsyncError');

exports.getEmails = catchAsyncError(async (req, res, next) => {
    const users = await User.find({}, { _id: 1, email: 1 }); 

    res.status(200).json({
        success: true,
        count: users.length,
        users, 
    });
});
