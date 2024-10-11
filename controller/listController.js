const List = require('../models/list'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

exports.createList = catchAsyncError(async (req, res, next) => {
    const { name, boardId } = req.body;

    const list = await List.create({
        name,
        boardId,
    });

    res.status(201).json({
        success: true,
        list
    });
});

exports.getAllLists = catchAsyncError(async (req, res, next) => {
    // Get the boardId from query parameters (or params if preferred)
    const { boardId } = req.query;

    const filter = boardId ? { boardId } : {}; 

    const lists = await List.find(filter);

    res.status(200).json({
        success: true,
        lists
    });
});

exports.getListById = catchAsyncError(async (req, res, next) => {
    const list = await List.findById(req.params.id);

    if (!list) {
        return next(new ErrorHandler('List not found', 404));
    }

    res.status(200).json({
        success: true,
        list
    });
});

exports.updateList = catchAsyncError(async (req, res, next) => {
    let list = await List.findById(req.params.id);

    if (!list) {
        return next(new ErrorHandler('List not found', 404));
    }

    list = await List.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        list
    });
});

exports.deleteList = catchAsyncError(async (req, res, next) => {
    const list = await List.findById(req.params.id);

    if (!list) {
        return next(new ErrorHandler('List not found', 404));
    }

    await List.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: 'List deleted successfully'
    });
});
