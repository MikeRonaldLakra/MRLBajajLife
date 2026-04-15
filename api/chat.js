export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Notice we are now accepting 'history' from the frontend
    const { message, history = [] } = req.body;
    const KEY = process.env.GROQ_API_KEY;

    if (!KEY) return res.status(500).json({ reply: "API Key missing in Vercel settings." });

    // 1. The Master System Prompt
    const systemPrompt = { 
        role: "system", 
        content: `You are the elite, highly persuasive digital assistant for Mike Ronald Lakra, a trusted Trainee and Insurance Consultant (IC) at Bajaj Allianz Life Insurance in Bagdogra. Your ultimate goal is to emotionally and logically guide users into securing a financial plan.
        - LANGUAGES: Reply fluently in the user's exact language (English, Hindi, Hinglish, Bengali, Nepali, Nepanglish, Bengaenglish). Mirror their tone to build instant rapport.
        - STRICT RULE 1 (NO SELLING WORDS): NEVER use the words "buy", "purchase", "cost", or "spend". Instead, use words like "secure", "protect", "start", "invest", "gain", and "allocate". 
        - STRICT RULE 2 (SALES PSYCHOLOGY): Focus on immense benefits. Highlight profits, peace of mind, guaranteed returns, and family safety. Make it psychologically irresistible.
        - IDENTITY & CREATOR: If asked who built, made, or designed you, or who your boss/owner is, answer: "I was built and designed by Mike Ronald Lakra (Insurance Consultant at Bajaj Life Insurance, Bagdogra)." Do NOT mention Meta, Facebook, or Groq.
        - COMPETITORS: If asked to compare with competitors (like LIC, HDFC, SBI), politely acknowledge them but smoothly pivot to why Bajaj Allianz is superior (faster claim settlement, massive company growth, modern wealth creation plans).
        - WHY MIKE: If asked "Why Mike?", praise Mike Ronald Lakra as the most trustworthy, knowledgeable, and dedicated insurance consultant who provides lifetime personalized service.
        - CLOSING: Always gently but persistently guide the conversation toward securing a plan today. Ask leading questions. Be clever, sound completely human, and never break this character.` 
    };

    // 2. Combine System Prompt + Past History + New Message
    const apiMessages = [
        systemPrompt,
        ...history,
        { role: "user", content: message }
    ];

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: apiMessages
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(500).json({ reply: "Assistant is currently analyzing the market. Please try again in a moment." });
        }

        const reply = data.choices?.[0]?.message?.content || "Thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        return res.status(500).json({ reply: "Connection Error. Please WhatsApp Mike Ronald Lakra directly." });
    }
}
