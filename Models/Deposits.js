const mongoose = require('mongoose')

const depositModel = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    method:{
        type:String,
    },
    trxID:{
        type:String,
    },
    image:{
        type:String,
    },
    amount:{
        type:Number,
    },
    status:{
        type:String,
        default:'pending'
    },
    comment:{
        type:String,
        default:'under review'
    },
    createdat:{
        type:Date,
        default:Date.now
    }

})

const Deposit = mongoose.model('Deposit',depositModel)

module.exports = Deposit