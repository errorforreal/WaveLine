const Connection = require('../models/connection');
const { generateConnectionId } = require('../src/services/connectionID');
const connectToWs = require('../modules/connection/ws-client');

async function handleConnection(req,res){

    const { wsUrl } = req.body

    try{
       
        const id = generateConnectionId();
        const connection = await Connection.create({
            connectionId : id,
            createdBy : req.user._id,
            wsUrl : wsUrl
        })

         res.status(200).json({connectionId : id});
         connectToWs(wsUrl , id);
    }
    catch(error){
        return res.status(500).json({
            message : 'Internal Server Error'
        })
    }



}

module.exports = handleConnection;