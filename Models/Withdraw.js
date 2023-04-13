const mongoose = require('mongoose')

const withdrawModel = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    method:{
        type:String,
    },
    address:{
        type:String,
    },
    status:{
        type:String,
        default:'pending'
    },
    amount:{
        type:Number,
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

const withdraw = mongoose.model('Withdraw',withdrawModel)

module.exports = withdraw