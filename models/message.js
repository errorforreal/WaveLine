const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    connectionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'connection',
        required : true
    },
    
    status : {
        type : String,
        enum : ['SENT' , 'RECIEVED', 'FAILED'],
        required : true
    },

    format : {
        type : String,
        enum : ["RAW", 'JSON'],
        default : 'RAW'
    },

    payload : {
        type : mongoose.Schema.Types.Mixed,
        required : true
    }
}, {timestamps : true});

const message = mongoose.model('message', messageSchema);

module.exports = message;