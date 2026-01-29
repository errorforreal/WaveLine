const WebSocket = require('ws');
const {addSocket, removeSocket, getSocket} = require('../../src/services/connectionID');
const connection = require('../../models/connection');


async function connectToWs(wsUrl, connectionId){

    try{

        const ws = new WebSocket(wsUrl);
  
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