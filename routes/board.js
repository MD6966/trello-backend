const express = require('express');
const {
    createBoard,
    getAllBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
    addNoteToBoard,
    updateBoardStatus,
    getCompletedBoards,
    uploadFileToBoard,
    deleteFileFromBoard
} = require('../controller/boardController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/board').post(isAuthenticated, createBoard);
router.route('/board/:id/add-note').patch(isAuthenticated, addNoteToBoard);
router.route('/board/:id/status').patch(isAuthenticated, updateBoardStatus);
router.route('/boards/completed').get(isAuthenticated, getCompletedBoards);
router.route('/boards').get(isAuthenticated, getAllBoards);
router.route('/board/:id').get(isAuthenticated, getBoardById);
router.route('/board/:id').put(isAuthenticated, updateBoard);
router.route('/board/:id').delete(isAuthenticated, deleteBoard);
router.route('/boards/:id/files/:fileId').delete(isAuthenticated, deleteFileFromBoard);
router.route('/board/:id/upload').post(isAuthenticated, upload.single('file'), uploadFileToBoard);


module.exports = router;
