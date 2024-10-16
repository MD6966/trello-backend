const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { createCheckList } = require('../controller/checklistController');
const { getAllCheckLists } = require('../controller/checklistController');
const { deleteCheckList } = require('../controller/checklistController');
const router = express.Router();

router.route('/check-list').post(isAuthenticated, createCheckList)
router.route('/check-lists').get(isAuthenticated, getAllCheckLists)
router.route('/check-list/:id').delete(isAuthenticated, deleteCheckList)





module.exports = router;