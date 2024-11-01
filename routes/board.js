const express = require('express');
const { createBoard, getAllBoards, getBoardById, updateBoard, deleteBoard, addNoteToBoard, updateBoardStatus, getCompletedBoards } = require('../controller/boardController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/board').post(isAuthenticated, createBoard)
router.route('/board/:id/add-note').patch(isAuthenticated, addNoteToBoard)
router.route('/board/:id/status').patch(isAuthenticated, updateBoardStatus)
router.route('/boards/completed').get(isAuthenticated, getCompletedBoards)
router.route('/boards').get(isAuthenticated, getAllBoards)
router.route('/board/:id').get(isAuthenticated, getBoardById)
router.route('/board/:id').put(isAuthenticated, updateBoard)
router.route('/board/:id').delete(isAuthenticated, deleteBoard)





module.exports = router;