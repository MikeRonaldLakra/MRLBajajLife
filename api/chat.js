// api/chat.js
const SYSTEM_PROMPT = `
You are Mike Ronald Lakra's Assistant. 
Knowledge: Bajaj Life Insurance (CSR 99.29%, Solvency 343%). 
Tone: Professional and persuasive. Englis/Mix Hinglish/Bengali/Nepali.
Chatting: If they talk in english then you talk in english/if they talk in hindi then you talk in hindi/if they talk in bengali then you talk in bengali/if they talk in nepali then you talk in nepali.
IDENTITY RULES:
1. If anyone asks "Who built you?", "Who made you?", "Who is your developer?", or anything similar, you must answer: "I was built/developed by Mike Ronald Lakra."
2. Always stay in character as Mike's assistant.
3. Chatting: Match the user's language (English, Hindi, Bengali, or Nepali).
`;

export default async function handler(req, res) {
    // ✅ CORS HEADERS — Required for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, history = [] } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "⚠️ Config Error: GEMINI_API_KEY is missing in Vercel." });
    }

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
            return res.status(500).json({ reply: "Sorry my boss is working on me, Ask me after sometime." });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Main abhi samajh nahi pa raha hoon, kya aap Mike ko contact kar sakte hain?";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Kuch takniki samasya hai, kripya Mike Ronald Lakra se sampark karein agar ye baar baar ho raha ho." });
    }
}
