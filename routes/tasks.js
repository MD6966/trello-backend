const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { addTaskToCheckList, updateTaskCompletion, deleteTaskFromCheckList, getCompletedTasksByBoardId } = require('../controller/taskController');
const router = express.Router();
//
router.route('/add-task').post(isAuthenticated, addTaskToCheckList)
router.route('/update-task').put(isAuthenticated, updateTaskCompletion)
router.route('/delete-task').delete(isAuthenticated, deleteTaskFromCheckList)
router.route('/completed-tasks/:boardId').get(isAuthenticated, getCompletedTasksByBoardId)








module.exports = router;