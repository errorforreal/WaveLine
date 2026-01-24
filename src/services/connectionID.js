const { v4 : uuidv4 } = require('uuid');
const connections = new Map();


function generateConnectionId(){
    const id = uuidv4();
    return id;
}

function getSocket(connectionId){
    return connections.get(connectionId);
}

function addSocket(connectionId,ws){
    connections.set(connectionId,ws);
}

function removeSocket(connectionId){
    connections.delete(connectionId);
}

module.exports = {
    generateConnectionId,
    getSocket,
    addSocket,
    removeSocket
 
}