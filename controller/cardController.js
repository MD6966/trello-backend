const Card = require('../models/card'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const Board = require('../models/board');
const List = require('../models/list');
const moment = require('moment');

exports.createCard = catchAsyncError(async (req, res, next) => {
    const { name, boardId, listId } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    const list = await List.findOne({ _id: listId, boardId });
    if (!list) {
        return next(new ErrorHandler('List not found or does not belong to this board', 404));
    }

    const card = await Card.create({
        name,
        boardId,
        listId,
    });
    list.cards.push(card);
    await list.save();

    res.status(201).json({
        success: true,
        card
    });
});

exports.updateCardDates = catchAsyncError(async (req, res, next) => {
    const { id: cardId } = req.params;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return next(new ErrorHandler('Both startDate and endDate are required', 400));
    }

    const isValidStartDate = moment(startDate, moment.ISO_8601, true).isValid();
    const isValidEndDate = moment(endDate, moment.ISO_8601, true).isValid();

    if (!isValidStartDate || !isValidEndDate) {
        return next(new ErrorHandler('Dates must be in valid ISO 8601 format', 400));
    }

    if (moment(startDate).isAfter(endDate)) {
        return next(new ErrorHandler('startDate must be before endDate', 400));
    }

    const list = await List.findOne({ "cards._id": cardId });

    if (!list) {
        return next(new ErrorHandler('Card not found', 404));
    }

    const card = list.cards.id(cardId);
    card.startDate = startDate;
    card.endDate = endDate;

    await list.save();

    res.status(200).json({
        success: true,
        card
    });
});


exports.getCardById = catchAsyncError(async (req, res, next) => {
    const { id: cardId } = req.params;

    const list = await List.findOne({ "cards._id": cardId });

    if (!list) {
        return next(new ErrorHandler('Card not found', 404));
    }
    const card = list.cards.id(cardId);

    res.status(200).json({
        success: true,
        card
    });
});

exports.updateCard = catchAsyncError(async (req, res, next) => {
    const { id: cardId } = req.params;
    const { name } = req.body;

    // Find the list containing the card
    const list = await List.findOne({ "cards._id": cardId });

    if (!list) {
        return next(new ErrorHandler('Card not found', 404));
    }

    // Find the card in the list's cards array and update it
    const card = list.cards.id(cardId);
    card.name = name || card.name; // Update the fields as needed

    await list.save();

    res.status(200).json({
        success: true,
        card
    });
});


exports.deleteCard = catchAsyncError(async (req, res, next) => {
    const { id: cardId } = req.params;

    // Find the list containing the card and remove the card from the array
    const list = await List.findOneAndUpdate(
        { "cards._id": cardId },
        { $pull: { cards: { _id: cardId } } },
        { new: true }
    );

    if (!list) {
        return next(new ErrorHandler('Card not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Card deleted successfully'
    });
});
