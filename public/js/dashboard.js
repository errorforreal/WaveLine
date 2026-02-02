let activeConnectionId = null;
let connectionState = 'IDLE';
const pendingLogs = [];

const uiWs = new WebSocket('ws://localhost:8000/ui-ws');

uiWs.onmessage = (event)=>{
    const message = JSON.parse(event.data);

    if(connectionState != 'CONNECTED'){
        pendingLogs.push(message);
        return;
    }

    addLog({
        message,
        direction: 'INCOMING',
        status: 'RECIEVED'
    });
}



function setConnectingUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connected', 'is-disconnected');
    bar.classList.add('is-connecting');
  
    document.getElementById('connectionStatus').innerHTML =
      `<span class="spinner"></span> Connecting...`;
  
    document.getElementById('connectBtn').disabled = true;
    document.getElementById('logList').innerHTML = '';
    connectionState = 'CONNECTING';
    
  }

  
  function setConnectedUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connecting', 'is-disconnected');
    bar.classList.add('is-connected');
  
    document.getElementById('connectionStatus').textContent = '🟢 Connected';
  
    document.getElementById('disconnectBtn').disabled = false;
    document.getElementById('sendBtn').disabled = false

    document.getElementById('messageInput').value = '';
    
    connectionState = 'CONNECTED';
   
  }
  
  function setDisconnectedUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connected', 'is-connecting');
    bar.classList.add('is-disconnected');
  
    document.getElementById('connectionStatus').textContent = '● Disconnected';
  
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('disconnectBtn').disabled = true;
    document.getElementById('sendBtn').disabled = true;

    connectionState = 'IDLE';
  }
  
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast error';
  
    toast.classList.remove('hidden');
  
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
  

  function setDisconnectingUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connected', 'is-connecting');
    bar.classList.add('is-disconnecting');
  
    document.getElementById('connectionStatus').innerHTML =
      `<span class="spinner"></span> Disconnecting...`;
  
    document.getElementById('disconnectBtn').disabled = true;
    document.getElementById('sendBtn').disabled = true;
  }

  function addLog({ message, direction, status , timestamp = Date.now() }) {
    const logList = document.getElementById('logList');
  
    const row = document.createElement('div');
    row.classList.add('log-row', direction.toLowerCase());
  
    if (status === 'FAILED') {
      row.classList.add('failed');
    }
  
    const icon = document.createElement('div');
    icon.className = 'log-icon';
  
    if (status === 'FAILED') icon.textContent = '✖';
    else if (direction === 'INCOMING') icon.textContent = '↘';
    else icon.textContent = '↗';
  
    const content = document.createElement('div');
    content.className = 'log-content';
  
    const msg = document.createElement('div');
    msg.className = 'log-message';
    msg.textContent = message;
  
    const meta = document.createElement('div');
    meta.className = 'log-meta';
    meta.textContent = new Date(timestamp).toLocaleTimeString();
  
    content.append(msg, meta);
    row.append(icon, content);
    logList.appendChild(row);
  
    logList.scrollTop = logList.scrollHeight;
  }
  



async function connect(){

    setConnectingUI();
    const input = document.getElementById('wsUrlInput').value.trim();
    const authToken = localStorage.getItem('authToken');

    const payload = {
        wsUrl : input
    }

    try{
        
        const res = await fetch('/connection', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json', 'authorization' : `Bearer ${authToken}`},
            body : JSON.stringify(payload)
        })
    
        const data = await res.json();
    
        if(!res.ok){
            throw new Error(data.message);
            
        }

        activeConnectionId = data.connectionId;
        uiWs.send(JSON.stringify({
            type : 'BIND_CONNECTION',
            ConnectionId : activeConnectionId
           }))

        let status = null;
        let attempts = 0;
        const MAX_ATTEMPTS = 20;

        while (status !== 'CONNECTED' && attempts < MAX_ATTEMPTS) {
            const res = await fetch(`/connection/${activeConnectionId}`);
            const data = await res.json();

            if (!res.ok) {
            throw new Error(data.message);
            }

            status = data.status;

            if (status === 'FAILED') {
                throw new Error('Connection failed');
            }

            await new Promise(r => setTimeout(r, 1000)); // 1s delay
            attempts++;
        }

        if (status !== 'CONNECTED') {
            throw new Error('Connection timeout');
          }
          

       setConnectedUI();

       pendingLogs.forEach(msg => {
            addLog({
                message : msg,
                direction : 'INCOMING',
                status : 'RECIEVED'
            })
       });

       

    }
    catch(error){
        setDisconnectedUI();
        showToast(error.message);
        console.log(error);
        
    }

}






async function disconnect(){
    setDisconnectingUI();
    try{
        
        const res = await fetch(`/connection/${activeConnectionId}`, {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            
        })
        
        const data = await res.json();
        
        if(!res.ok){
            throw new Error(data.message);
            
        }
        
        let Status = null;
        let Attempts = 0;
        const MAX_ATTEMPTS = 20;

        while (Status !== 'DISCONNECTED' && Attempts < MAX_ATTEMPTS) {
            const res = await fetch(`/connection/${activeConnectionId}`);
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message);
            }
            
            Status = data.status;
            
            if (Status === 'FAILED') {
                throw new Error('Disconnect failed');
            }
            
            await new Promise(r => setTimeout(r, 1000)); // 1s delay
            Attempts++;
        }
        
        if (Status !== 'DISCONNECTED') {
            throw new Error('Disconnect timeout');
          }
          

          setDisconnectedUI();
          uiWs.send(JSON.stringify({
            type : 'REMOVE_CONNECTION'
          }))
          activeConnectionId = null;
        }
        catch(error){
            setConnectedUI(); 
            showToast(error.message);
        }
        
    }
    
    async function sendMessage(){
        const message = document.getElementById('messageInput').value.trim();
        if(!message){
            showToast('No message to send');
            return;
        }
        
        try{
            
        const res = await fetch(`/connection/${activeConnectionId}/message`, {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                payload : message,
                format : 'TEXT'
            })
        })
        
        const data = await res.json();
        
        
        if(!res.ok){
            throw new Error(data.status);
            
        }

        addLog({
            message,
            direction: 'OUTGOING',
            status: 'SENT'
          });
          
    }
    catch(error){
        showToast(error.message);
    }
    
  }