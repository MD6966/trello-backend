// controllers/emailController.js
const Email = require('../models/email');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

exports.createEmails = catchAsyncError(async (req, res, next) => {
    const { emails } = req.body;

    if (!Array.isArray(emails)) {
        return next(new ErrorHandler('Emails should be an array', 400));
    }

    const emailDocs = emails.map(email => ({ email }));

    try {
        const savedEmails = await Email.insertMany(emailDocs, { ordered: false });

        res.status(201).json({
            success: true,
            savedEmails,
        });
    } catch (error) {
        next(new ErrorHandler('Error saving emails', 500));
    }
});

exports.getEmails = catchAsyncError(async (req, res, next) => {
    const emails = await Email.find(); 
    res.status(200).json({
        success: true,
        count: emails.length,
        emails,
    });
});