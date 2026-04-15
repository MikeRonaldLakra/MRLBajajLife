export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
        return res.status(500).json({ reply: "⚠️ API Key missing in Vercel." });
    }

    // Is URL ko dhyan se dekhiye - v1beta version
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const SYSTEM_PROMPT = `You are Mike Ronald Lakra's Assistant. Identity: Developed by Mike Ronald Lakra. Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). Language: Match user language (Hindi/English). Keep it short.`;

    // Simple payload format jo stable hai
    const payload = {
        contents: [{
            parts: [{ text: SYSTEM_PROMPT + "\n\nUser Question: " + message }]
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
            console.error("Gemini Error:", data);
            return res.status(500).json({ 
                reply: "Service is updating (API Error). Please WhatsApp Mike at +919382181126." 
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking. Please contact Mike.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Network Error. Please try again." });
    }
}
