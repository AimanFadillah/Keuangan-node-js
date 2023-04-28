const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://aimanfadillah:j1wYb0NnzQM7FIpz@cluster0.laldqws.mongodb.net/tabungan",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

module.exports = mongoose;