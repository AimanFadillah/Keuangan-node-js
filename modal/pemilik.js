const mongoose = require("mongoose")

const Pemiliks = mongoose.model("pemiliks",{
    nama:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    tabungan:{
        type:Number,
        required:true
    },
    perhari:{
        type:Number,
    },
    perminggu:{
        type:Number,
    },
    perbulan:{
        type:Number,
    },
})

module.exports = {Pemiliks};
