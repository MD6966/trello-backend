const express = require('express');
const { createBoard, getAllBoards, getBoardById, updateBoard, deleteBoard } = require('../controller/boardController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/board').post(isAuthenticated, createBoard)
router.route('/boards').get(isAuthenticated, getAllBoards)
router.route('/board/:id').get(isAuthenticated, getBoardById)
router.route('/board/:id').put(isAuthenticated, updateBoard)
router.route('/board/:id').delete(isAuthenticated, deleteBoard)





module.exports = router;