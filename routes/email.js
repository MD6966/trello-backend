const express = require('express');
const { getEmails } = require('../controller/emailController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/get-mails').get(isAuthenticated, getEmails)

module.exports = router;