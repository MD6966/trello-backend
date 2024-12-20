const catchAsyncError = require("../middlewares/catchAsyncError");
const sendEmail = require("../utils/sendEmail");
const Board = require("../models/board"); 
const Invitation = require("../models/invitation"); 
const User = require("../models/user"); 

exports.sendEmailToMultiple = catchAsyncError(async (req, res, next) => {
    const { emails, boardId } = req.body; 
    const subject = "You have been invited to join a board";

    if (!Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an array of email addresses.'
        });
    }

    const invalidEmails = emails.filter(email => !/\S+@\S+\.\S+/.test(email));
    if (invalidEmails.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email addresses: ' + invalidEmails.join(', ')
        });
    }

    if (!boardId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a boardId.'
        });
    }

    const boardExists = await Board.findById(boardId);
    if (!boardExists) {
        return res.status(404).json({
            success: false,
            message: 'Board not found with the provided boardId.'
        });
    }

    const users = await User.find({ email: { $in: emails } });
    const userMap = users.reduce((map, user) => {
        map[user.email] = user._id;
        return map;
    }, {});
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation Email</title>
    </head>
    <body>
        <h2>You have been invited to join a board:</h2>
        <p>Click the button below to accept the invitation and join the board:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="YOUR_INVITATION_LINK?boardId=${boardId}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Accept Invitation
            </a>
        </div>
        <p>If you were not expecting this invitation, you can safely ignore this email.</p>
    </body>
    </html>
    `;

    const sendEmailPromises = emails.map(email => 
        sendEmail({
            email,
            subject,
            html: htmlContent 
        }).then(() => {
            return Invitation.create({ 
                email, 
                boardId, 
                userId: userMap[email] || null 
            });
        })
    );

    await Promise.all(sendEmailPromises);

    res.status(200).json({
        success: true,
        message: 'Emails sent successfully.'
    });
});
