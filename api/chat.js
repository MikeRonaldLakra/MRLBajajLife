export default async function handler(req, res) {
    // CORS Headers (Website se connect karne ke liye)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const KEY = process.env.GROQ_API_KEY; // Jo key aapne Vercel me daali hai

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Ye bahut fast aur powerful model hai
                messages: [
                    { 
                        role: "system", 
                        content: "You are Mike Ronald Lakra's Assistant for Bajaj Life Insurance. Be professional and brief." 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(500).json({ reply: "Assistant is busy. Try again." });
        }

        const reply = data.choices?.[0]?.message?.content || "I am thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        return res.status(500).json({ reply: "Connection failed. Please WhatsApp Mike." });
    }
}
