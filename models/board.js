const mongoose = require('mongoose')

const boardScehma = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Card Title'],
        maxLength:[30, 'Title must be less than 30 characters']
    }, 
    color_code : {
        type: String,
    },
    status: {
        type:Boolean,
        default:false
    },
        createdAt: {
            type: Date,
            default: Date.now
        }

})

module.exports = mongoose.model('Board', boardScehma)