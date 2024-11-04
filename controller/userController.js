const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/user");

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find(); 

    res.status(200).json({
        success: true,
        users,
    });
});

exports.assignBoardToUsers = catchAsyncError(async (req, res, next) => {
    const { userIds, boardId } = req.body; 

    if (!Array.isArray(userIds) || userIds.length === 0 || !boardId) {
        return res.status(400).json({
            success: false,
            message: "Invalid input. Please provide an array of user IDs and a board ID."
        });
    }

    const users = await User.find({ _id: { $in: userIds } });
    
    if (users.length !== userIds.length) {
        return res.status(404).json({
            success: false,
            message: "Some users not found. Please check the user IDs."
        });
    }

    await Promise.all(users.map(async (user) => {
        if (!user.assignedBoards.includes(boardId)) {
            user.assignedBoards.push(boardId);
            await user.save();
        }
    }));

    res.status(200).json({
        success: true,
        message: "Board assigned to specified users successfully.",
    });
});

