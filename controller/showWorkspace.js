const connection = require('../models/connection');

async function handleWorkSpace(req,res){
    const user = req.user;

    try{
    
        const connections = await connection.find( { createdBy : user._id}).select('connectionId wsUrl status updatedAt').sort({ updatedAt : -1});
    
        return res.status(200).json({
            allConnections : connections
        })
    }
    catch(error){
        return res.status(500).json({
            message : 'Failed to fetch workspace'
        })
    }
}


module.exports = handleWorkSpace;
