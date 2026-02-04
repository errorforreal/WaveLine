const WebSocket = require('ws');
const {addSocket, removeSocket, getSocket} = require('../../src/services/connectionID');
const connection = require('../../models/connection');
const Message = require('../../models/message');
const {notifyUi} = require('../message/ui-ws');
const {sessionMap} = require('../message/ui-ws');
const checkJSON = require('../../src/services/checkJSON');


async function connectToWs(wsUrl, connectionId){

    try{

        const ws = new WebSocket(wsUrl);
        
        const id = await connection.findOne({connectionId});
        
        ws.on('message',async(raw)=>{
            const message = raw.toString();
            let format = 'TEXT';
            const {ok} = checkJSON(message);


            if(ok){
                format = 'JSON';
            }

            notifyUi(connectionId, message, format);
            await Message.create({
                connectionId : id._id,
                status : 'RECEIVED',
                payload : message,
                format : format

            })
        })

        ws.on('open', async ()=>{
          addSocket(connectionId, ws);
  
          await connection.updateOne({connectionId}, {
              status : 'CONNECTED'
          })


        });

  
        ws.on('error', async ()=>{
          await connection.updateOne({connectionId}, {
            status : 'FAILED'
          })

          sessionMap.delete(connectionId);
          removeSocket(connectionId);
        });

        ws.on('close', async ()=>{
            await connection.updateOne({connectionId}, {
                status : 'DISCONNECTED'
            })

            sessionMap.delete(connectionId);
            console.log('disconnected');
            

            removeSocket(connectionId);
        })

    }
    catch(error){
        console.log(error);
        
    }
      
        
}

async function disconnectWs(connectionId){
    const ws = getSocket(connectionId);

    try{
        ws.close();

        await connection.updateOne({connectionId},{
            status : 'DISCONNECTED'
        })
        removeSocket(connectionId);
    }
    catch(error){
        console.log(error);
        
    }
}

module.exports = {
    connectToWs,
    disconnectWs
}