export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const KEY = process.env.GEMINI_API_KEY;

    // ✅ NEW MODEL: Using Flash-8B which has different access rules
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${KEY}`;

    const payload = {
        contents: [{
            parts: [{ text: "You are Mike's Assistant. Answer briefly: " + message }]
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
            // Agar ye bhi fail ho, toh humein pata chal jayega ki problem KEY mein hai
            return res.status(500).json({ reply: "Assistant is updating. Reason: " + (data.error?.message || "Model issue") });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        return res.status(500).json({ reply: "Connection failed." });
    }
}
