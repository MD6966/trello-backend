const express = require('express');
const { createList, getAllLists, getListById, updateList, deleteList } = require('../controller/listController');
const router = express.Router();

router.route('/list').post(createList)
router.route('/lists').get(getAllLists)
router.route('/list/:id').get(getListById)
router.route('/list/:id').put(updateList)
router.route('/list/:id').delete(deleteList)





module.exports = router;