export default async function handler(req, res) {
    // 1. Mandatory CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message, history = [] } = req.body;
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) return res.status(500).json({ reply: "⚠️ API Key missing in Vercel settings." });

    // ✅ BULLETPROOF URL: Using v1 stable and correct model path
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const contents = [
        { role: 'user', parts: [{ text: "You are Mike Ronald Lakra's Assistant. Match the user's language." }] },
        { role: 'model', parts: [{ text: 'Ready.' }] },
        ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
    ];

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (!response.ok) {
            // Detailed error to help us debug
            return res.status(500).json({ reply: "System busy. Error: " + (data.error?.message || "Check API Settings") });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });
    } catch (err) {
        res.status(500).json({ reply: "Connection Error. Please WhatsApp Mike." });
    }
}
