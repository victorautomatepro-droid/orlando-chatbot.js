(function() {
    // Generate unique session ID for this browser tab
    const SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    
    // Brand colors
    const BRAND_YELLOW = '#FFD700';
    const BRAND_RED = '#C41E3A';
    const BRAND_BLACK = '#1a1a1a';
    const BRAND_GRAY = '#f5f5f5';
    
    // Logo URL (host this on your GitHub too, or use a direct link)
    const LOGO_URL = 'https://victorautomatepro-droid.github.io/orlando-chatbot.js/logo.png';
    
    // Create chat widget HTML
    const widgetHTML = `
        <div id="orlando-chat-widget" style="position:fixed;bottom:20px;right:20px;width:380px;height:550px;background:white;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.2);display:none;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;z-index:9999;border:3px solid ${BRAND_YELLOW};overflow:hidden;">
            
            <!-- Header -->
            <div style="background:${BRAND_YELLOW};color:${BRAND_BLACK};padding:16px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid ${BRAND_RED};">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="${LOGO_URL}" alt="One Hour AC" style="width:40px;height:40px;border-radius:8px;object-fit:contain;background:white;padding:2px;" onerror="this.style.display='none'">
                    <div>
                        <div style="font-weight:bold;font-size:16px;">One Hour Air Conditioning</div>
                        <div style="font-size:11px;color:${BRAND_RED};font-weight:600;">Always On Time... Or You Don't Pay A Dime!</div>
                    </div>
                </div>
                <span id="close-chat" style="cursor:pointer;font-size:24px;color:${BRAND_BLACK};padding:4px;">×</span>
            </div>
            
            <!-- Messages -->
            <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;background:${BRAND_GRAY};"></div>
            
            <!-- Input -->
            <div style="padding:16px;border-top:2px solid ${BRAND_YELLOW};display:flex;background:white;gap:8px;">
                <input id="chat-input" type="text" placeholder="Ask about your AC..." style="flex:1;padding:12px;border:2px solid #ddd;border-radius:10px;outline:none;font-size:14px;">
                <button id="chat-send" style="padding:12px 20px;background:${BRAND_RED};color:white;border:none;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;">Send</button>
            </div>
        </div>
        
        <!-- Toggle Button -->
        <button id="chat-toggle" style="position:fixed;bottom:20px;right:20px;width:70px;height:70px;background:${BRAND_YELLOW};border:3px solid ${BRAND_RED};border-radius:50%;cursor:pointer;z-index:9998;box-shadow:0 4px 16px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;padding:8px;">
            <img src="${LOGO_URL}" alt="Chat" style="width:45px;height:45px;object-fit:contain;" onerror="this.parentElement.innerHTML='💬';this.parentElement.style.fontSize='28px';this.parentElement.style.color='${BRAND_BLACK}';">
        </button>
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
        toggle.style.display = 'flex';
    };
    
    // Add message to chat
    function addMessage(text, isUser) {
        const div = document.createElement('div');
        div.style.cssText = `margin:12px 0;text-align:${isUser ? 'right' : 'left'};`;
        
        const bubble = document.createElement('span');
        bubble.style.cssText = `
            background: ${isUser ? BRAND_RED : 'white'};
            color: ${isUser ? 'white' : BRAND_BLACK};
            padding: 12px 16px;
            border-radius: ${isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
            display: inline-block;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: ${isUser ? 'none' : '1px solid #e0e0e0'};
        `;
        bubble.textContent = text;
        div.appendChild(bubble);
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
    
    // Welcome message with branding
    addMessage("👋 Hi! Welcome to One Hour Air Conditioning & Heating. I'm here to help with your AC or heating needs. What can I assist you with today?", false);
    
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
                body: JSON.stringify({
                    message: text,
                    sessionId: SESSION_ID
                })
            });
            const data = await response.json();
            addMessage(data.response || data.message || "Sorry, I didn't catch that. Please call us at (407) 555-0199 for immediate help.", false);
        } catch (error) {
            addMessage("⚠️ Having trouble connecting. For emergencies, call us right away at (407) 555-0199. We're available 24/7!", false);
        }
    }
    
    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
})();
