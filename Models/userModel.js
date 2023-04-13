const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true,
        unique:true

    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    referedby:{
        type:String,
    },
    country:{
        type:String,
    },
    balance:{
        type:Number,
        default:0,
    },
    tdeposit:{
        type:Number,
        default:0,
    },
    twithdraw:{
        type:Number,
        default:0,
    },
    vip:{
        type:Number,
        default:0,
    },
    active:{
        type:Boolean,
        default:false,
    },
    lastaccess:{
        type:String,
        default:new Date().toLocaleString()
    },
    createdat:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model('Users',userModel)

module.exports = User