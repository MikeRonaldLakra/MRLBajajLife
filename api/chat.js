export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body; // Simple message extract
    const KEY = process.env.GEMINI_API_KEY;

    if (!KEY) {
        return res.status(500).json({ reply: "⚠️ API Key missing in Vercel." });
    }

    // Is URL ko dhyan se dekhiye - v1beta use kar rahe hain
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const SYSTEM_PROMPT = `You are Mike Ronald Lakra's Assistant. 
    Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). 
    Identity: Developed by Mike Ronald Lakra. Match user language (Hindi, English, Bengali, Nepali).`;

    // Sabse simple structure jo kabhi fail nahi hota
    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\n\nUser Question: " + message }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
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
            // Agar abhi bhi error aaye toh console mein detail dikhegi
            console.error("Gemini Error Detail:", JSON.stringify(data));
            return res.status(500).json({ 
                reply: "Assistant is resting. Please WhatsApp Mike directly at +919382181126." 
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm thinking... please contact Mike.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Network Error. Please try again later." });
    }
}
