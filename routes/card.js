const express = require('express');
const { createCard, getAllCards, getCardById, updateCard, deleteCard } = require('../controller/cardController');
const router = express.Router();

router.route('/card').post(createCard)
router.route('/cards').get(getAllCards)
router.route('/card/:id').get(getCardById)
router.route('/card/:id').put(updateCard)
router.route('/card/:id').delete(deleteCard)





module.exports = router;