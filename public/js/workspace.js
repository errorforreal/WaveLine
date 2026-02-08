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
       <div class="connection-summary">
            <div class="connection-url">${conn.wsUrl}</div>
            <div class="connection-status status-${conn.status}">
                ${conn.status}
            </div>
        </div>

        <div class="connection-details hidden">
            <div class="messages">Loading messages...</div>
        </div>
      `;
  
      // click → go to detail view
        const summary = row.querySelector('.connection-summary');
        const details = row.querySelector('.connection-details');
        const messagesContainer = row.querySelector('.messages');

        let loaded = false;

        summary.addEventListener('click', async () => {
            details.classList.toggle('hidden');

            if (!loaded) {
                await loadMessages(conn.connectionId, messagesContainer);
                loaded = true;
            }
        });
  
      list.appendChild(row);
    });
  }

  async function loadMessages(connectionId, messagesContainer){
    try{
        const res = await fetch( `/workspace/api/${connectionId}`, {
            method : 'GET'
        })

        const data = await res.json();

        if(!res.ok){
            throw new Error(data.message);  
        }

        showMessages(data.allMessages, messagesContainer);
    }
    catch(error){
        showToast(error.message);
    }
  }

  function showMessages(messages, container) {
    // clear previous content
    container.innerHTML = '';
  
    if (!messages || messages.length === 0) {
      container.innerHTML = `<p class="empty-messages">No messages yet</p>`;
      return;
    }
  
    messages.forEach(msg => {
      const row = document.createElement('div');
      row.className = `message-row ${msg.status === 'RECEIVED' ? 'incoming' : 'outgoing'}`;
  
      row.innerHTML = `
        <div class="message-meta">
          <span class="message-status">${msg.status}</span>
          <span class="message-time">
            ${new Date(msg.createdAt).toLocaleTimeString()}
          </span>
        </div>
  
        <div class="message-payload">
          ${escapeHtml(msg.payload)}
        </div>
      `;
  
      container.appendChild(row);
    });
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
  
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }