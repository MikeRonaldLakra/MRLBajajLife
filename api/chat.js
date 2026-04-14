export default async function handler(req, res) {
    // FIX 1: Allow your website to talk to this script (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history = [] } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "⚠️ Error: API Key is missing in Vercel Settings." });
    }

    // FIX 2: Using the correct stable model name
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_PROMPT = "You are Mike Ronald Lakra's Assistant. Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). Identity: Developed by Mike Ronald Lakra.";

    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Ready.' }] },
        ...history.map(entry => ({
            role: entry.role === 'user' ? 'user' : 'model',
            parts: [{ text: entry.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
    ];

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Gemini Error:", data);
            return res.status(500).json({ reply: "Server is busy. Please WhatsApp Mike direct." });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking. Contact Mike.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Connection Error. Please WhatsApp Mike direct." });
    }
}
