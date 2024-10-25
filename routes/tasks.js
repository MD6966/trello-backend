const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { addTaskToCheckList, updateTaskCompletion } = require('../controller/taskController');
const router = express.Router();

router.route('/add-task').post(isAuthenticated, addTaskToCheckList)
router.route('/update-task').put(isAuthenticated, updateTaskCompletion)






module.exports = router;