async function connect(){
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

        const connectionID = data.connectionId;
       const errorBox = document.getElementById('errorBox');
       document.getElementById('connectionStatus').textContent = '🟢 Connected'

        document.getElementById('connectBtn').disabled = true;
        document.getElementById('disconnectBtn').disabled = false;
        errorBox.classList.add('hidden');
    }
    catch(error){
       const errorBox = document.getElementById('errorBox');
       errorBox.textContent = error.message;
       errorBox.classList.remove('hidden');
       console.log(error.message);
       

    }

}