// Replace ONLY the processAIQuery function inside your <script> tag:
async function processAIQuery() {
    const inp = document.getElementById('aiInput');
    const text = inp.value.trim();
    if (!text) return;

    appendChat('user', text);
    inp.value = '';
    const typId = 'typ-' + Date.now();
    appendChat('bot', '<span class="typing-anim">Assistant is thinking...</span>', typId);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: text, 
                history: conversationHistory 
            })
        });

        const data = await response.json();
        const el = document.getElementById(typId);
        
        // This will now display the specific error message from the backend
        el.innerHTML = data.reply || data.error || "Something went wrong.";
        
        if (response.ok) {
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'model', content: el.innerText });
        }
    } catch (error) {
        document.getElementById(typId).innerHTML = "⚠️ Network Error. Check your internet or Vercel logs.";
    }
}
