const CheckList = require('../models/checkList'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const List = require('../models/list');
const Card = require('../models/card');
exports.addTaskToCheckList = catchAsyncError(async (req, res, next) => {
    const { checklist_id, task_name } = req.body;

    const checklist = await CheckList.findById(checklist_id);
    if (!checklist) {
        return next(new ErrorHandler('Checklist not found', 404));
    }

    const newTask = { 
        name: task_name,
        is_completed: false,
        created_at: Date.now(),
    };

    checklist.tasks.push(newTask);
    await checklist.save();

    res.status(201).json({
        success: true,
        checklist,
    });
});

exports.updateTaskCompletion = catchAsyncError(async (req, res, next) => {
    const { checklist_id, task_id, is_completed } = req.body;

    const checklist = await CheckList.findById(checklist_id);
    if (!checklist) {
        return next(new ErrorHandler('Checklist not found', 404));
    }

    const task = checklist.tasks.id(task_id);
    if (!task) {
        return next(new ErrorHandler('Task not found', 404));
    }

    task.is_completed = is_completed;
    await checklist.save();

    res.status(200).json({
        success: true,
        checklist,
    });
});
exports.deleteTaskFromCheckList = catchAsyncError(async (req, res, next) => {
    const { checklist_id, task_id } = req.body;

    const checklist = await CheckList.findById(checklist_id);
    if (!checklist) {
        return next(new ErrorHandler('Checklist not found', 404));
    }


    const task = checklist.tasks.id(task_id);
    if (!task) {
        return next(new ErrorHandler('Task not found', 404));
    }

    checklist.tasks.pull(task_id);
    await checklist.save();

    res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        checklist,
    });
});

exports.getCompletedTasksByBoardId = catchAsyncError(async (req, res, next) => {
    const { boardId } = req.params; 

    const lists = await List.find({ boardId });

    let completedTasks = [];


    for (const list of lists) {
        const cards = await Card.find({ listId: list._id });
        for (const card of cards) {
            const checkLists = await CheckList.find({ card_id: card._id });
            for (const checkList of checkLists) {
                const completed = checkList.tasks.filter(task => task.is_completed);
                completedTasks = [...completedTasks, ...completed];
            }
        }
    }
    res.status(200).json({
        success: true,
        completedTasks,
    });
});

exports.getIncompleteTasksByBoardId = catchAsyncError(async (req, res, next) => {
    const { boardId } = req.params;

    const lists = await List.find({ boardId });

    let incompleteTasks = [];

    for (const list of lists) {
        const cards = await Card.find({ listId: list._id });

        for (const card of cards) {
            const checkLists = await CheckList.find({ card_id: card._id });

            for (const checkList of checkLists) {
                const incomplete = checkList.tasks.filter(task => !task.is_completed);
                incompleteTasks = [...incompleteTasks, ...incomplete];
            }
        }
    }

    res.status(200).json({
        success: true,
        incompleteTasks,
    });
});
