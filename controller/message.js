const SendMessage = require('../modules/message/ws-message');
const ConnectionReq = require('../models/connection');

async function sendMessage(req,res){
    const {payload} = req.body;
    const connectionId = req.params.id;

    try{
        
        await SendMessage(connectionId, payload);
        res.status(200).json({
            status :  'SENT'
        })
    }
    catch(error){
        res.status(500).json({
            status : 'FAILED'
        })
        console.log(error);
        
    }


}

module.exports = sendMessage;