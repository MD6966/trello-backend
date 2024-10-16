const mongoose = require('mongoose')

const invitationSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    }, 
    boardId : {
         type: String, 
         required: true 
    },
    userId:{
        type:String,
        required:true
    },
   status: {
    type: String,
    default:"Pending",
   },
    createdAt: {
    type: Date,
    default: Date.now

        }

})

module.exports = mongoose.model('Invitation', invitationSchema)