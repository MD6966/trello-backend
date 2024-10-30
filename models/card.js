const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter List Title'],
    }, 
    boardId : {
         type: mongoose.Schema.Types.ObjectId, ref: 'Board', 
         required: true 
    },
    listId : {
        type: mongoose.Schema.Types.ObjectId, ref: 'List', 
        required: true 
   },
        createdAt: {
            type: Date,
            default: Date.now
        }

})

module.exports = mongoose.model('Card', cardSchema)