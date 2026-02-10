const {getSocket, removeSocket} = require('../../src/services/connectionID');

const uiClients = new Map();
const sessionMap = new Map();

function initUiWebSocket(wss){

    wss.on('connection', (ws)=>{

        ws.on('message', (raw)=>{
            try{
                const data = JSON.parse(raw.toString());

                if(data.type === 'BIND_CONNECTION'){
                    uiClients.set(data.SessionId, ws);
                    ws.sessionId = data.SessionId;
                }
                if(data.type === 'REMOVE_CONNECTION'){
                    sessionMap.delete(data.id);
                }
            }
            catch(e){
                console.error('Invalid ui ws message');
                
            }
        })

        ws.on('close', ()=>{

            for(const [id,sessionId] of sessionMap){
                if(sessionId == ws.sessionId){
                    const backendws = getSocket(id);
                    backendws._closeInitiator = 'client';
                    backendws.close();
                    break;
                }
            }

            uiClients.delete(ws.sessionId);
        })
    })
}

function notifyUi(connectionId, value, format){
    const sessionId = sessionMap.get(connectionId);
    const uiws = uiClients.get(sessionId);
    const payload = {
        message : value,
        format : format
    }
    if(uiws && uiws.readyState === uiws.OPEN){
        uiws.send(JSON.stringify(payload));
    }
}

module.exports = {
    notifyUi, 
    initUiWebSocket,
    sessionMap
}