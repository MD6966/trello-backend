const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { getAllUsers, assignBoardToUsers } = require('../controller/userController');
const router = express.Router();
//
router.route('/all-users').get(isAuthenticated, getAllUsers)
router.route('/user/assign').post(isAuthenticated, assignBoardToUsers)










module.exports = router;