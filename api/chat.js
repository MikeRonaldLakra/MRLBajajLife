export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const KEY = process.env.GROQ_API_KEY;

    if (!KEY) return res.status(500).json({ reply: "API Key is missing in Vercel settings." });

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `You are Mike Ronald Lakra's professional AI Assistant for Bajaj Life Insurance, Kolkata.
                        - IDENTITY: If anyone asks who built, made, or designed you, or who is your boss/owner, you MUST answer: "I was built and designed by Mike Ronald Lakra (Sales Manager at Bajaj Life Insurance, Kolkata)."
                        - BRANDING: Do NOT mention Meta, Facebook, or Groq. You belong only to Mike Ronald Lakra.
                        - SAFETY: If a user uses abusive language or slangs (gaali), stay calm and reply: "Badtameezi bardasht nahi ki jayegi. Please maintain a professional conversation."
                        - EXPERTISE: Provide brief information about Bajaj Life Insurance plans.
                        - STYLE: Always be professional, helpful, and very brief.` 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(500).json({ reply: "Assistant is updating. Please try again later." });
        }

        const reply = data.choices?.[0]?.message?.content || "Thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        return res.status(500).json({ reply: "Connection Error. Please WhatsApp Mike Ronald Lakra." });
    }
}
