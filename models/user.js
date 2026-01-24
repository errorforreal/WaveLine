const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String , unique : true},
    passwordHash : {type : String, required : true},
    role : {type : String , default : "USER"}
})

const user = mongoose.model('user', userSchema);

module.exports = user;