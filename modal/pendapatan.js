const mongoose = require("mongoose")

const Pendapatans = mongoose.model("pendapatans",{
    kegiatan:{
        type:String,
        required:true,
    },
    pendapatan:{
        type:Number,
        required:true,
    },
    tanggal:{
        type:Date,
        required:true,
    }
})

module.exports = {Pendapatans};
