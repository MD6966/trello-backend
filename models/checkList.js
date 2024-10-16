const mongoose = require('mongoose');

const checkListSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: false,
    },
    tasks: {
        type: [String], 
        default: [], 
    },
    card_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CheckList', checkListSchema);
