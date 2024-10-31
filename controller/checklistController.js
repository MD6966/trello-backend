const CheckList = require('../models/checkList'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const Card = require('../models/card'); 

exports.createCheckList = catchAsyncError(async (req, res, next) => {
    const { title, card_id, board_id } = req.body;

    const card = await Card.findById(card_id);
    if (!card) {
        return next(new ErrorHandler('Card not found', 404));
    }

    const checkList = await CheckList.create({
        title,
        card_id,
        board_id
    });

    res.status(201).json({
        success: true,
        checkList,
    });
});


exports.deleteCheckList = catchAsyncError(async (req, res, next) => {
    const checkList = await CheckList.findById(req.params.id);

    if (!checkList) {
        return next(new ErrorHandler('Checklist not found', 404));
    }

    await CheckList.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: 'Checklist deleted successfully',
    });
});

exports.getAllCheckLists = catchAsyncError(async (req, res, next) => {
    const { card_id } = req.query;

    if (!card_id) {
        return next(new ErrorHandler('Card ID is required', 400));
    }

    const card = await Card.findById(card_id);
    if (!card) {
        return next(new ErrorHandler('Card ID is not valid', 404));
    }

    const checklists = await CheckList.find({ card_id });

    res.status(200).json({
        success: true,
        checklists,
    });
});
