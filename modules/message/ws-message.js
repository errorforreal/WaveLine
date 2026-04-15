const {getSocket} = require('../../src/services/connectionID');
const connection = require('../../models/connection');
const Message = require('../../models/message');
const checkJSON = require('../../src/services/checkJSON');

async function sendMessage(id, message, format){
   

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

        if(format == 'JSON'){

            const {ok} = checkJSON(message);
            if(!ok){
                format = 'TEXT';
            }
        }

        await Message.create({
            connectionId : ConnectionReq._id,
            status,
            payload : message,
            format : format,
            sentAt : Date.now()
        })

        if(status == 'FAILED'){
            throw new Error("Websocket send failed");
            
        }

        
        
    
    
}

module.exports = sendMessage;