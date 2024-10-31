const Board = require('../models/board');
const List = require('../models/list'); // Import List model
const Card = require('../models/card'); // Import Card model
const CheckList = require('../models/checkList'); // Import CheckList model
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

    const boardsWithTasks = await Promise.all(boards.map(async (board) => {
        const lists = await List.find({ boardId: board._id });
        
        let allTasks = [];

        await Promise.all(lists.map(async (list) => {
            const cards = await Card.find({ listId: list._id });

            await Promise.all(cards.map(async (card) => {
                const checklists = await CheckList.find({ card_id: card._id });

                checklists.forEach(checklist => {
                    allTasks = allTasks.concat(checklist.tasks); 
                });
            }));
        }));

        const completedTasks = allTasks.filter(task => task.is_completed);
        const incompleteTasks = allTasks.filter(task => !task.is_completed);

        return {
            ...board._doc, 
            tasks: {
                completedTasks,
                incompleteTasks,
            },
        };
    }));

    res.status(200).json({
        success: true,
        boards: boardsWithTasks,
    });
});


exports.getBoardById = catchAsyncError(async (req, res, next) => {
    const boardId = req.params.id; 

    const board = await Board.findById(boardId);
    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    const lists = await List.find({ boardId });

    let allTasks = [];

    await Promise.all(lists.map(async (list) => {
        const cards = await Card.find({ listId: list._id });

        await Promise.all(cards.map(async (card) => {
            const checklists = await CheckList.find({ card_id: card._id });

            checklists.forEach(checklist => {
                allTasks = allTasks.concat(checklist.tasks); 
            });
        }));
    }));

    const completedTasks = allTasks.filter(task => task.is_completed);
    const incompleteTasks = allTasks.filter(task => !task.is_completed);

    res.status(200).json({
        success: true,
        board,
        tasks: {
            completedTasks,
            incompleteTasks,
        },
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
