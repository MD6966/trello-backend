const express = require('express');
const { sendEmailToMultiple } = require('../controller/sendEmailController');
const router = express.Router();

router.route('/send-email').post(sendEmailToMultiple)






module.exports = router;