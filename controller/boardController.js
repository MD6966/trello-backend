const Board = require('../models/board');
const List = require('../models/list'); 
const Card = require('../models/card'); 
const CheckList = require('../models/checkList'); 
const ErrorHandler = require('../utils/errorHandler');
const multer = require('multer');
const catchAsyncError = require('../middlewares/catchAsyncError');
const cloudinary = require('../config/cloudinaryConfig');
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

exports.uploadFileToBoard = catchAsyncError(async (req, res, next) => {
    const boardId = req.params.id;
    const board = await Board.findById(boardId);

    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    if (!req.file) {
        return next(new ErrorHandler('No file provided', 400));
    }

    try {
        // Directly upload the file buffer to Cloudinary
        const result = await cloudinary.uploader.upload_stream({
            folder: 'board_files',
            resource_type: 'auto',
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return next(new ErrorHandler('Cloudinary upload failed', 500));
            }
            return result;
        });

        // Push file details to board if upload is successful
        board.files.push({ url: result.secure_url, name: req.body.fileName });
        await board.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: { url: result.secure_url, name: req.body.fileName },
            board,
        });
    } catch (error) {
        console.error('File upload error:', error);
        return next(new ErrorHandler('File upload failed', 500));
    }
});
exports.deleteFileFromBoard = catchAsyncError(async (req, res, next) => {
    const boardId = req.params.id;
    const fileId = req.params.fileId;  // Get the file ID from the request parameters

    // Find the board by ID
    const board = await Board.findById(boardId);
    if (!board) {
        return next(new ErrorHandler('Board not found', 404));
    }

    // Find the file to be deleted by its _id from the board's files array
    const fileIndex = board.files.findIndex(file => file._id.toString() === fileId);
    if (fileIndex === -1) {
        return next(new ErrorHandler('File not found', 404));
    }

    // Get the file's Cloudinary public_id for deletion
    const file = board.files[fileIndex];
    const publicId = file.url.split('/').pop().split('.')[0]; // Assuming the file URL format is consistent

    // Set resource type based on file extension
    const resourceType = file.url.includes('image') ? 'image' : 'raw'; // Adjust this condition as needed

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType, // Set resource type (image, raw, etc.)
    });

    // Remove the file from the board's files array
    board.files.splice(fileIndex, 1);
    await board.save();

    res.status(200).json({
        success: true,
        message: 'File deleted successfully',
        board,
    });
});


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

    // Append the new note on a new line if there is an existing note
    if (board.notes) {
        board.notes += `<br>${note}`;
    } else {
        board.notes = note;
    }
    
    await board.save();

    res.status(200).send(`
        <html>
            <body>
                <p>${board.notes}</p>
            </body>
        </html>
    `);
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
    const boards = await Board.find({ status: true });

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
        boards: boardsWithTasks
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
