const List = require('../models/list'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const Card = require('../models/card');
const CheckList = require('../models/checkList');

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
    const { boardId } = req.query;

    const filter = boardId ? { boardId } : {}; 

    const lists = await List.find(filter);

    const listsWithTasks = await Promise.all(lists.map(async (list) => {
        const cards = await Card.find({ listId: list._id });

        let allTasks = [];

        await Promise.all(cards.map(async (card) => {
            const checklists = await CheckList.find({ card_id: card._id });

            checklists.forEach(checklist => {
                allTasks = allTasks.concat(checklist.tasks);
            });
        }));

        const completedTasks = allTasks.filter(task => task.is_completed);
        const incompleteTasks = allTasks.filter(task => !task.is_completed);

        return {
            ...list._doc, 
            tasks: {
                completedTasks,
                incompleteTasks,
            },
        };
    }));

    res.status(200).json({
        success: true,
        lists: listsWithTasks,
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
