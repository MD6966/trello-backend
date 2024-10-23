const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter List Title'],
        maxLength: [30, 'Title must be less than 30 characters']
    }, 
    boardId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Board', 
        required: true 
    },
    cards: {
        type: [{
            name: String,
            boardId: mongoose.Schema.Types.ObjectId,
            listId: mongoose.Schema.Types.ObjectId,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('List', listSchema);
