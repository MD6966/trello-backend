const express = require('express');
const { createCard, getCardById, updateCard, deleteCard } = require('../controller/cardController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/card').post(isAuthenticated, createCard)
router.route('/card/:id').get(isAuthenticated, getCardById)
router.route('/card/:id').put(isAuthenticated, updateCard)
router.route('/card/:id').delete(isAuthenticated, deleteCard)





module.exports = router;