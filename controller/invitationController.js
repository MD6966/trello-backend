const Invitation = require('../models/invitation'); 
const catchAsyncError = require('../middleware/catchAsyncError'); 

exports.getAllInvitations = catchAsyncError(async (req, res, next) => {
    const { boardId } = req.query;

    const invitations = await Invitation.find({ boardId });
    if (!invitations) {
        return res.status(404).json({
            success: false,
            message: 'No invitations found for this boardId.',
        });
    }
    res.status(200).json({
        success: true,
        invitations,
    });
});
