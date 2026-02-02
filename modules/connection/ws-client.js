const WebSocket = require('ws');
const {addSocket, removeSocket, getSocket} = require('../../src/services/connectionID');
const connection = require('../../models/connection');
const Message = require('../../models/message');
const {notifyUi} = require('../message/ui-ws');


async function connectToWs(wsUrl, connectionId){

    try{

        const ws = new WebSocket(wsUrl);
        
        const id = await connection.findOne({connectionId})
        ws.on('message',async(raw)=>{
            const data = raw.toString();

            notifyUi(connectionId, data)
            await Message.create({
                connectionId : id._id,
                status : 'RECIEVED',
                payload : data

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

          removeSocket(connectionId);
        });

        ws.on('close', async ()=>{
            await connection.updateOne({connectionId}, {
                status : 'DISCONNECTED'
            })

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