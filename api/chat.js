export default async function handler(req, res) {
    // 1. Mandatory CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, history = [] } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "⚠️ API Key is missing in Vercel settings." });
    }

    // ✅ FIXED URL: Using v1beta with the correct model string
    // This is the most compatible version for gemini-1.5-flash
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_PROMPT = `You are Mike Ronald Lakra's Assistant. 
    Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). 
    Identity: Developed by Mike Ronald Lakra. Match user language (Hindi, English, Bengali, Nepali).`;

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
            // If it fails, this will show exactly why (e.g., Invalid Key or Quota)
            console.error("Gemini Error:", data);
            return res.status(500).json({ reply: "System busy. Error: " + (data.error?.message || "Check API Settings") });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking. Please contact Mike.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Connection Error. Please WhatsApp Mike Ronald Lakra." });
    }
}
