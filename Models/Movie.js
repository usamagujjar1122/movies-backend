const mongoose = require('mongoose')

const MovieModel = new mongoose.Schema({
    id:{
        type:String,
    },
    name:{
        type:String,
    },
    type:{
        type:String,
    },
    image:{
        type:String,
    },
    language:{
        type:String,
    },
    duration:{
        type:String,
    },
    description:{
        type:String,
    },
    date:{
        type:String,
    },
    genera:{
        type:String,
    },
    ep:{
        type:String,
    },
    id2:{
        type:String,
    },
    server:{
        type:String,
    },
    createdat:{
        type:Date,
        default:Date.now
    }

})

const Movie = mongoose.model('Movies',MovieModel)

module.exports = Movie