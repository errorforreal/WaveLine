const WebSocket = require('ws');
const {addSocket, removeSocket, getSocket} = require('../../src/services/connectionID');
const connection = require('../../models/connection');
const Message = require('../../models/message');
const {notifyUi} = require('./ui-ws');
const {sessionMap} = require('./ui-ws');
const checkJSON = require('../../src/services/checkJSON');

async function connectToWs(wsUrl, connectionId){
    let phase = 'handshake';

    try{

        const connectionEvent = {
            type : 'CONNECTING',
            metadata : {}
        }
        await connection.updateOne({connectionId}, {
            $set : {status : 'CONNECTING'},
            $push : {events : connectionEvent}
        })

        const ws = new WebSocket(wsUrl);

        ws._closeInitiator = 'target';
        

        
        ws.on('message',async(raw)=>{
            const message = raw.toString();
            let format = 'TEXT';
            const {ok} = checkJSON(message);


            if(ok){
                format = 'JSON';
            }

            const id = await connection.findOne({connectionId});
            notifyUi(connectionId, message, format);
            await Message.create({
                connectionId : id._id,
                status : 'RECEIVED',
                payload : message,
                format : format

            })
        })

        ws.on('open', async ()=>{
            phase = 'active';
            
          addSocket(connectionId, ws);

          const connectionEvent = {
            type : 'CONNECTED',
            metadata : {}
          }
  
          await connection.updateOne({connectionId}, {
              $set : {status : 'CONNECTED'},
              $push : {events : connectionEvent}
          })


        });

  
        ws.on('error', async (err)=>{

            let connectionEvent = {
                type : 'FAILED',
                metadata : {reason : 'connection_failed', phase : phase, code : err.code || 'UNKNOWN' , message : err.message}
            }

            await connection.updateOne({connectionId}, {
              $set : {status : 'FAILED'},
              $push : {events : connectionEvent}
            })


          sessionMap.delete(connectionId);
          removeSocket(connectionId);
        });

        ws.on('close', async ()=>{

            let ConnectionEvent = {
                type : 'DISCONNECTED',
                metadata : { reason : 'client closed'}
            }

            if(ws._closeInitiator === 'target'){

                ConnectionEvent.metadata = { reason : 'target closed'};
            }
           

            await connection.updateOne({connectionId}, {
                $set : {status : 'DISCONNECTED'},
                $push : {events : ConnectionEvent}
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
    
    if(!ws) return;

    ws._closeInitiator = 'client';
    ws.close();
}

module.exports = {
    connectToWs,
    disconnectWs
}