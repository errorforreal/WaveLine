const WebSocket = require('ws');

const uiClients = new Map();

function initUiWebSocket(server){
    const wss = new WebSocket.Server({server, path : '/ui-ws'});

    wss.on('connection', (ws)=>{
        
        uiClients.set(ws,null);

        ws.on('message', (raw)=>{
            try{
                const data = JSON.parse(raw.toString());

                if(data.type === 'BIND_CONNECTION'){
                    uiClients.set(ws, data.ConnectionId);
                }

                if(data.type === 'REMOVE_CONNECTION'){
                    uiClients.set(ws, null);
                }
            }
            catch(e){
                console.error('Invalid ui ws message');
                
            }
        })

        ws.on('close', ()=>{
            uiClients.delete(ws);
        })
    })
}

function notifyUi(connectionId, payload){
    for( const [ws, boundId] of uiClients.entries()){
        if(boundId == connectionId && ws.readyState === ws.OPEN){
            ws.send(JSON.stringify(payload));
        }
    }
}

module.exports = {
    notifyUi, 
    initUiWebSocket
}