const WebSocket = require('ws');

const uiClients = new Map();
const sessionMap = new Map();

function initUiWebSocket(server){
    const wss = new WebSocket.Server({server, path : '/ui-ws'});

    wss.on('connection', (ws)=>{

        ws.on('message', (raw)=>{
            try{
                const data = JSON.parse(raw.toString());

                if(data.type === 'BIND_CONNECTION'){
                    uiClients.set(data.SessionId, ws);
                    ws.sessionId = data.SessionId;
                }
            }
            catch(e){
                console.error('Invalid ui ws message');
                
            }
        })

        ws.on('close', ()=>{
            uiClients.delete(ws.sessionId);
        })
    })
}

function notifyUi(connectionId, value, format){
    const sessionId = sessionMap.get(connectionId);
    const ws = uiClients.get(sessionId);
    const payload = {
        message : value,
        format : format
    }
    if(ws && ws.readyState === ws.OPEN){
        ws.send(JSON.stringify(payload));
    }
}

module.exports = {
    notifyUi, 
    initUiWebSocket,
    sessionMap
}