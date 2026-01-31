const {getSocket} = require('../../src/services/connectionID');
const connection = require('../../models/connection');
const Message = require('../../models/message');

async function sendMessage(id, message){
   

        const ConnectionReq = await connection.findOne({connectionId : id});
        if(!ConnectionReq || ConnectionReq.status != 'CONNECTED'){
            throw new Error('Cannot send');
        }

        const ws = getSocket(id);
        if(!ws || ws.readyState !== ws.OPEN){
            throw new Error("Websocket not open");
            
        }

        let status = 'SENT';

        try{

            ws.send(message);
        }
        catch(error){
            status = 'FAILED';
        }

        await Message.create({
            connectionId : ConnectionReq._id,
            status,
            payload : message
        })

        if(status == 'FAILED'){
            throw new Error("Websocket send failed");
            
        }

        
        
    
    
}

module.exports = sendMessage;