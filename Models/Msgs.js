const mongoose = require('mongoose')

const msgsModel = new mongoose.Schema({
    name : {
        type: String,
        require:true
    },
    email : {
        type: String,
        require:true
    },
    msg : {
        type: String,
        require:true
    },
    status : {
        type: String,
        default:'unread'
    },
    createdat:{
        type:Date,
        default:Date.now
    }
})

const Msgs = mongoose.model('Msgs',msgsModel)

module.exports = Msgs