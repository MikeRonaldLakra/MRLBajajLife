export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) return res.status(500).json({ reply: "API Key missing in Vercel settings." });

    // ✅ FIXED: Using 1.5-flash for higher free limits
    // Is URL ko update karein (flash ke aage -latest lagayein)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${KEY}`;

    const payload = {
        contents: [{
            parts: [{ text: "You are Mike's Assistant for Bajaj Life. Answer briefly: " + message }]
        }]
    };

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ reply: "Assistant is resting. " + (data.error?.message || "") });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        return res.status(500).json({ reply: "Connection failed. WhatsApp Mike." });
    }
}
