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

    // Stable v1beta Endpoint
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const SYSTEM_PROMPT = `You are Mike Ronald Lakra's Assistant. Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). Developed by Mike Ronald Lakra. Match user language (Hindi, English, Bengali, Nepali).`;

    // Sabse stable payload format
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: "SYSTEM INSTRUCTION: " + SYSTEM_PROMPT + "\n\nUSER QUESTION: " + message }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
        }
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
            // Agar API key galat hai toh ye error dikhega
            if (data.error?.status === "UNAUTHENTICATED") {
                return res.status(401).json({ reply: "Invalid API Key. Please update it in Vercel settings." });
            }
            return res.status(500).json({ reply: "Assistant is updating. Please WhatsApp Mike at +919382181126." });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am thinking... please contact Mike.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Connection timeout. Please try again." });
    }
}
