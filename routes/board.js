const express = require('express');
const { createBoard, getAllBoards, getBoardById, updateBoard, deleteBoard } = require('../controller/boardController');
const router = express.Router();

router.route('/board').post(createBoard)
router.route('/boards').get(getAllBoards)
router.route('/board/:id').get(getBoardById)
router.route('/board/:id').put(updateBoard)
router.route('/board/:id').delete(deleteBoard)





module.exports = router;