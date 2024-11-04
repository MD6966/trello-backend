const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Card Title'],
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Card', cardSchema);
