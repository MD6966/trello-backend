const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Card Title'],
    },
    color_code: {
        type: String,
    },
    notes: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    },
    files: [
        {
            url: String,
            name: String,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Board', boardSchema);
