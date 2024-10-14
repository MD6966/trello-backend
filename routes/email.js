const express = require('express');
const { createEmails, getEmails } = require('../controller/emailController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/emails').post(isAuthenticated,createEmails)
router.route('/get-mails').get(isAuthenticated, getEmails)

module.exports = router;