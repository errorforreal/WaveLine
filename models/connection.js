const mongoose = require('mongoose');


const connectionEventSchema = new mongoose.Schema({
    type : { type : String ,
        enum : ['REQUESTED', 'CONNECTING', 'CONNECTED', 'DISCONNECTED', 'FAILED'],
        required : true
    },

    metadata : {
        type : mongoose.Schema.Types.mixed,
        default : {}
    },
     
    at : {
        type : Date,
        default : Date.now
    }
}, {_id : false});


module.exports = connectionEventSchema;
const connectionSchema = new mongoose.Schema({
    wsUrl : { type : String , required : true},
    connectionId : {type : String , required : true, unique : true},
    status : { type : String , required : true, enum: ['REQUESTED', 'CONNECTING', 'CONNECTED', 'DISCONNECTED', 'FAILED'] , default : 'REQUESTED'},
    createdBy : { type : mongoose.Schema.Types.ObjectId, ref : "user"},
    events : {type : [connectionEventSchema], default : []}

}, {timestamps : true})


const connectionReq = mongoose.model('connection', connectionSchema);

module.exports = connectionReq;