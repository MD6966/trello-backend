const Board = require('../models/board');
const List = require('../models/list'); 
const Card = require('../models/card'); 
const CheckList = require('../models/checkList'); 
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
exports.addNoteToBoard = catchAsyncError(async (req, res, next) => {
    const boardId = req.params.id;
    const { note } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    board.notes = note;
    await board.save();

    res.status(200).json({
        success: true,
        note: board.notes
    });
});
exports.updateBoardStatus = catchAsyncError(async (req, res, next) => {
    const boardId = req.params.id;

    const board = await Board.findById(boardId);

    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    board.status = true;
    await board.save();

    res.status(200).json({
        success: true,
        message: 'Board Completed',
        board
    });
});

exports.getAllBoards = catchAsyncError(async (req, res, next) => {
    const boards = await Board.find({ status: false });

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

exports.getCompletedBoards = catchAsyncError(async (req, res, next) => {
    const activeBoards = await Board.find({ status: true });

    res.status(200).json({
        success: true,
        boards: activeBoards
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
