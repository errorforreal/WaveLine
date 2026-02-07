showWorkspace();

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast error';
  
    toast.classList.remove('hidden');
  
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

async function showWorkspace(){

    try{
      const authToken = localStorage.getItem('authToken');

      const res = await fetch('/workspace/api', {
        method : 'GET',
        headers : {'Content-Type' : 'application/json', 'authorization' : `Bearer ${authToken}`},
  
      })
  
      const data = await res.json();
  
      if(!res.ok){
        throw new Error(data.message);
        
      }

      renderConnections(data.allConnections);

    }
    catch(error){
        showToast(error.message);
    }
}

showWorkspace();

function renderConnections(connections) {
    const list = document.getElementById('connections-list');
    list.innerHTML = '';
  
    if (!connections.length) {
      list.innerHTML = `<p>No connections yet</p>`;
      return;
    }
  
    connections.forEach(conn => {
      const row = document.createElement('div');
      row.className = 'connection-row';
  
      row.innerHTML = `
        <div class="connection-url">${conn.wsUrl}</div>
        <div class="connection-status status-${conn.status}">
          ${conn.status}
        </div>
      `;
  
      // click → go to detail view
      row.addEventListener('click', () => {
        window.location.href = `/connections/${conn.connectionId}`;
      });
  
      list.appendChild(row);
    });
  }