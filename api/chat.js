export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, history = [] } = req.body;
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
        return res.status(500).json({ reply: "⚠️ API Key missing in Vercel settings." });
    }

    // ✅ FIXED: Stable V1 URL (v1beta error solve karne ke liye)
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const SYSTEM_PROMPT = `You are Mike Ronald Lakra's Assistant. 
    Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). 
    Identity: Developed by Mike Ronald Lakra. Match user language (Hindi, English, Bengali, Nepali).`;

    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Ready.' }] },
        // ✅ FIXED: Role mapping for Gemini compatibility
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
            console.error("Gemini API Error:", data);
            return res.status(500).json({ 
                reply: "System busy. Error: " + (data.error?.message || "Check API Settings") 
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking. Please contact Mike.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Connection Error. Please WhatsApp Mike Ronald Lakra." });
    }
}
