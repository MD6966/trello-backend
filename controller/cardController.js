const Card = require('../models/card'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const board = require('../models/board');
const list = require('../models/list');

exports.createCard = catchAsyncError(async (req, res, next) => {
    const { name, boardId, listId } = req.body;

    // Check if the board exists
    const Board = await board.findById(boardId);
    if (!Board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    // Check if the list exists and belongs to the board
    const List = await list.findOne({ _id: listId, boardId: boardId });
    if (!List) {
        return next(new ErrorHandler('List not found or does not belong to this board', 404));
    }

    // Create the card
    const card = await Card.create({
        name,
        boardId,
        listId,
    });

    // Add the entire card object to the list's cards array
    List.cards.push(card);
    await List.save(); // Save the updated list with the new card

    res.status(201).json({
        success: true,
        card
    });
});

exports.getAllCards = catchAsyncError(async (req, res, next) => {
    const { listId } = req.query; 
    const cards = await Card.find({ listId });

    res.status(200).json({
        success: true,
        cards
    });
});

exports.getCardById = catchAsyncError(async (req, res, next) => {
    const card = await Card.findById(req.params.id);

    if (!card) {
        return next(new ErrorHandler('Card not found', 404));
    }

    res.status(200).json({
        success: true,
        card
    });
});

// Update a card
exports.updateCard = catchAsyncError(async (req, res, next) => {
    let card = await Card.findById(req.params.id);

    if (!card) {
        return next(new ErrorHandler('Card not found', 404));
    }

    card = await Card.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        card
    });
});

// Delete a card
exports.deleteCard = catchAsyncError(async (req, res, next) => {
    const card = await Card.findById(req.params.id);

    if (!card) {
        return next(new ErrorHandler('Card not found', 404));
    }

    await Card.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: 'Card deleted successfully'
    });
});
