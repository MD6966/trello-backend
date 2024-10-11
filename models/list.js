const mongoose = require('mongoose')

const listScehma = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please Enter List Title'],
        maxLength:[30, 'Title must be less than 30 characters']
    }, 
    board_id : {
        type: String,
        required:true,
    },
        createdAt: {
            type: Date,
            default: Date.now
        }

})

module.exports = mongoose.model('List', listScehma)