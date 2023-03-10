const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
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
    
    secq:{
        type:String,
        required:true,
    },
    seca:{
        type:String,
        required:true,
    },
    btcaddress:{
        type:String,
    },
    ethaddress:{
        type:String,
    },
    trcaddress:{
        type:String,
    },
    bnbaddress:{
        type:String,
    },
    referedby:{
        type:String,
    },
    isverified:{
        type:Boolean,
    },
    balance:{
        type:Number,
    },
    commision:{
        type:Number,
    },
    earnedc:{
        type:Number,
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