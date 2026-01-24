const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    wsUrl : { type : String , required : true},
    connectionId : {type : String , required : true, unique : true},
    status : { type : String , required : true, enum: ['CONNECTING', 'CONNECTED', 'DISCONNECTED', 'FAILED'] , default : 'CONNECTING'},
    createdBy : { type : mongoose.Schema.Types.ObjectId, ref : "user"},

}, {timestamps : true})


const connection = mongoose.model('connection', connectionSchema);

module.exports = connection;