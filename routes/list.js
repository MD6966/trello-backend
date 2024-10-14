const express = require('express');
const { createList, getAllLists, getListById, updateList, deleteList } = require('../controller/listController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/list').post(isAuthenticated, createList)
router.route('/lists').get(isAuthenticated, getAllLists)
router.route('/list/:id').get(isAuthenticated, getListById)
router.route('/list/:id').put(isAuthenticated, updateList)
router.route('/list/:id').delete(isAuthenticated, deleteList)





module.exports = router;