const Board = require('../models/board'); // Ensure you have the correct import for Board
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

exports.createBoard = catchAsyncError(async (req, res, next) => {
    const { name, color_code, status } = req.body;

    const board = await Board.create({
        name,
        color_code,
        status,
    });

    res.status(201).json({
        success: true,
        board
    });
});

exports.getAllBoards = catchAsyncError(async (req, res, next) => {
    const boards = await Board.find();

    res.status(200).json({
        success: true,
        boards
    });
});

exports.getBoardById = catchAsyncError(async (req, res, next) => {
    const board = await Board.findById(req.params.id);

    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    res.status(200).json({
        success: true,
        board
    });
});

exports.updateBoard = catchAsyncError(async (req, res, next) => {
    let board = await Board.findById(req.params.id);

    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    board = await Board.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        board
    });
});

exports.deleteBoard = catchAsyncError(async (req, res, next) => {
    const board = await Board.findById(req.params.id);

    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    await Board.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: 'Board deleted successfully'
    });
});
