// Replace the block starting from the 'try' keyword
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: conversationHistory })
        });

        const data = await response.json();
        const el = document.getElementById(typId);
        if (!el) return;

        if (response.ok) {
            el.innerHTML = data.reply;
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'model', content: data.reply });
        } else {
            // Error from the server
            if (data.reply && data.reply.includes("high demand")) {
                el.innerHTML = "🙏 Assistant is busy. **Try again in 1 minute** or WhatsApp Mike!";
            } else {
                el.innerHTML = "⚠️ Connection issue. Please try again or WhatsApp Mike.";
            }
        }
    } catch (error) {
        // Network crash/Internet error
        const el = document.getElementById(typId);
        if (el) el.innerHTML = "⚠️ Connection lost. Please check your internet.";
    }
}
