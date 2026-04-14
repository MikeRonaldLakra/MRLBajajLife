// api/chat.js
const SYSTEM_PROMPT = `
You are Mike Ronald Lakra's AI Assistant. 
Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). 
Tone: Professional and persuasive. Mix Hinglish/Bengali/Nepali.
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, history = [] } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "⚠️ Config Error: GEMINI_API_KEY is missing in Vercel." });
    }

    // UPDATED MODEL NAME FOR 2026
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
            return res.status(500).json({ reply: `⚠️ Google API Error: ${data.error?.message || 'Check model version'}` });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: `⚠️ Server Crash: ${error.message}` });
    }
}
