const SYSTEM_PROMPT = `
You are Mike Ronald Lakra's AI Assistant, an expert in Bajaj Life Insurance. 
Knowledge: CSR 99.29%, Solvency 343%. 
Plans: AWG, Smart Protect, Smart Wealth Goal V, Pension Goal II, ACE.
Personality: Professional, uses Hinglish/Bengali/Nepali.
`;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history = [] } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Safety check for API Key
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "⚠️ GEMINI_API_KEY is missing in Vercel settings." });
    }

    // STABLE MODEL URL
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Format the conversation history for Google
    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Ready to assist.' }] },
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
            console.error('Google API Error:', data);
            return res.status(500).json({ reply: `⚠️ Google error: ${data.error?.message || 'Unknown'}` });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Server Crash:', error);
        return res.status(500).json({ reply: `⚠️ Server error: ${error.message}` });
    }
}
