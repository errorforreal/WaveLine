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

        const connectionId = data.connectionId;
        let status = null;
        let attempts = 0;
        const MAX_ATTEMPTS = 20;

        while (status !== 'CONNECTED' && attempts < MAX_ATTEMPTS) {
            const res = await fetch(`/connection/${connectionId}`);
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

       setConnectedUI();
    }
    catch(error){
        setDisconnectedUI();
        showToast(error.message);
    }

}




function setConnectingUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connected', 'is-disconnected');
    bar.classList.add('is-connecting');
  
    document.getElementById('connectionStatus').innerHTML =
      `<span class="spinner"></span> Connecting...`;
  
    document.getElementById('connectBtn').disabled = true;
  }
  
  function setConnectedUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connecting', 'is-disconnected');
    bar.classList.add('is-connected');
  
    document.getElementById('connectionStatus').textContent = '🟢 Connected';
  
    document.getElementById('disconnectBtn').disabled = false;
    document.getElementById('sendBtn').disabled = false;
  }
  
  function setDisconnectedUI() {
    const bar = document.getElementById('connectionBar');
    bar.classList.remove('is-connected', 'is-connecting');
    bar.classList.add('is-disconnected');
  
    document.getElementById('connectionStatus').textContent = '● Disconnected';
  
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('disconnectBtn').disabled = true;
    document.getElementById('sendBtn').disabled = true;
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
  