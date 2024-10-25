const CheckList = require('../models/checkList'); 
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

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
