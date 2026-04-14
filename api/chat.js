// api/chat.js
const SYSTEM_PROMPT = `
You are Mike Ronald Lakra's AI Assistant, specializing in Bajaj Life Insurance. 
Knowledge: CSR 99.29%, Solvency 343%. 
Personality: Warm, persuasive, and professional. Use Hinglish/Bengali/Nepali as needed.
`;

export default async function (req, res) {
    // 1. Check for POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message, history = [] } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // 2. Check for API Key
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "⚠️ GEMINI_API_KEY is missing in Vercel. Please add it and REDEPLOY." });
    }

    // 3. Stable Gemini Model URL
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // 4. Format Content
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
            console.error('Google Error:', data);
            return res.status(500).json({ reply: `⚠️ Google API Error: ${data.error?.message || 'Check Key'}` });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: `⚠️ Server Crash: ${error.message}` });
    }
}
