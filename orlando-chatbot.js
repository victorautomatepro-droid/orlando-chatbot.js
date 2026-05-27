(function() {
    // Create chat widget HTML
    const widgetHTML = `
        <div id="orlando-chat-widget" style="position:fixed;bottom:20px;right:20px;width:350px;height:500px;background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:none;flex-direction:column;font-family:Arial,sans-serif;z-index:9999;border:1px solid #ddd;">
            <div style="background:#007bff;color:white;padding:15px;border-radius:12px 12px 0 0;font-weight:bold;display:flex;justify-content:space-between;align-items:center;">
                <span>Orlando One Hour AC</span>
                <span id="close-chat" style="cursor:pointer;font-size:20px;">×</span>
            </div>
            <div id="chat-messages" style="flex:1;overflow-y:auto;padding:15px;background:#f9f9f9;"></div>
            <div style="padding:15px;border-top:1px solid #eee;display:flex;background:white;border-radius:0 0 12px 12px;">
                <input id="chat-input" type="text" placeholder="Type your message..." style="flex:1;padding:10px;border:1px solid #ddd;border-radius:8px;outline:none;">
                <button id="chat-send" style="margin-left:8px;padding:10px 16px;background:#007bff;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">Send</button>
            </div>
        </div>
        <button id="chat-toggle" style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#007bff;color:white;border:none;border-radius:50%;cursor:pointer;font-size:24px;z-index:9998;box-shadow:0 2px 10px rgba(0,0,0,0.2);">💬</button>
    `;
    
    // Inject widget
    const div = document.createElement('div');
    div.innerHTML = widgetHTML;
    document.body.appendChild(div);
    
    // Elements
    const widget = document.getElementById('orlando-chat-widget');
    const toggle = document.getElementById('chat-toggle');
    const closeBtn = document.getElementById('close-chat');
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    
    // Toggle visibility
    toggle.onclick = () => {
        widget.style.display = 'flex';
        toggle.style.display = 'none';
    };
    
    closeBtn.onclick = () => {
        widget.style.display = 'none';
        toggle.style.display = 'block';
    };
    
    // Add message to chat
    function addMessage(text, isUser) {
        const div = document.createElement('div');
        div.style.cssText = `margin:10px 0;text-align:${isUser ? 'right' : 'left'};`;
        div.innerHTML = `<span style="background:${isUser ? '#007bff' : '#e9ecef'};color:${isUser ? 'white' : '#333'};padding:10px 14px;border-radius:18px;display:inline-block;max-width:80%;word-wrap:break-word;font-size:14px;">${text}</span>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
    
    // Welcome message
    addMessage("Hello! Welcome to Orlando One Hour Air Conditioning. How can I assist you today?", false);
    
    // Send message function
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        addMessage(text, true);
        input.value = '';
        
        try {
            const response = await fetch('https://victors-team-free.n8nme.com/webhook/orlando-chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: text})
            });
            const data = await response.json();
            addMessage(data.response || data.message || "Sorry, I didn't understand that.", false);
        } catch (error) {
            addMessage("Sorry, I'm having trouble connecting. Please call (407) 555-0199 for immediate assistance.", false);
        }
    }
    
    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
})();