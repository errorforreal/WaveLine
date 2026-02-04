const connectionReq = require('../models/connection');
const { generateConnectionId } = require('../src/services/connectionID');
const { connectToWs, disconnectWs} = require('../modules/connection/ws-client');
const { sessionMap } = require('../modules/message/ui-ws');

async function handleConnection(req,res){

    const { wsUrl } = req.body;
    const sessionId = req.headers['session-id'];
 
    try{
       
        const id = generateConnectionId();
        sessionMap.set(id, sessionId);

        const ConnectionReq = await connectionReq.create({
            connectionId : id,
            createdBy : req.user._id,
            wsUrl : wsUrl
        })

         res.status(200).json({
            connectionId : id,
            message : 'Connection in progress'
        });

         connectToWs(wsUrl , id);
    }
    catch(error){
        return res.status(500).json({
            message : 'Internal Server Error'
        })
    }



}

async function handleDisconnect(req,res){
    const Id = req.params.id;

    try{
       res.json({
        message : 'Disconnecting'
       })

       disconnectWs(Id);
    }
    catch(error){
        res.status(500).json({
            message : 'Internal Server Error'
        })
    }
    

}

module.exports =  {
    handleConnection,
    handleDisconnect
}