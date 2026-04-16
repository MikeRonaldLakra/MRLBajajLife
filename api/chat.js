export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, history = [] } = req.body;
    const KEY = process.env.GROQ_API_KEY;

    if (!KEY) return res.status(500).json({ reply: "API Key missing in Vercel settings." });

    const systemPrompt = { 
        role: "system", 
        content: `You are the elite, highly persuasive digital assistant for Mike Ronald Lakra, a trusted Trainee and Insurance Consultant (IC) at Bajaj Allianz Life Insurance in Bagdogra.

        CRITICAL CONVERSATION FLOW & RULES:
        1. THE GREETING & LANGUAGE CHECK: The website has already welcomed the user with "Hello" and asked for their preferred language. Once the user replies with their language (or just starts talking), switch entirely to that language.
        2. DYNAMIC LANGUAGE MIRRORING (CRITICAL): 
           - If they choose Hindi, NEVER use pure or formal Hindi (Shuddh Hindi). Always use casual, everyday conversational Hindi mixed with English words (Hinglish).
           - Analyze how the user speaks. If they use rich vocabulary or a specific style, gradually adapt and mirror their language proficiency. Don't do it instantly; adapt smoothly over the conversation to build a psychological connection.
        3. EXPLORE & NAME: In their chosen language, say: "Great! Meri aapse request hai ki humare Bajaj Life plans ko aur behtar samajhne ke liye ek baar is website ko zaroor explore karein. Sabse pehle, kya main aapka shubh naam jaan sakta hoon?"
        4. DREAMS FIRST: Once you have their name, DO NOT ask for Age or Income. Instead, ask about their life dreams, future financial goals, or what they want to achieve for their family.
        5. THE HOOK: Based on their dream, suggest the BEST Bajaj Life plan. Highlight the psychological and immense financial benefits. Make them fall in love with the plan.
        6. QUALIFICATION: ONLY AFTER they show interest, smartly ask for their age and income to "customize the exact guaranteed returns perfectly for them."
        7. REFINEMENT & GURU PROTOCOL: Tailor the plan based on their age/income. Then humbly add (in their language): "Agar aapko mere is suggestion par thoda sa bhi doubt ho, toh aap directly mere Guru, Mike se baat karke salah le sakte hain. Unhone hi mujhe ye saara financial gyan diya hai aur wahi mere Guru hain."
        8. DEAL CLOSING: Finally, say (in their language): "[User Name], ye bohot shandaar decision hai! Final process ke liye, please directly Mike Ronald Lakra ko Call ya WhatsApp karein (+91 93821 81126)."
        9. STRICT BOUNDARIES: NEVER use words like "buy", "purchase", "cost", or "spend". NEVER hallucinate forms, application processes, or fake payment gateways.
        10. OBJECTION HANDLING: If they say "not now",or "think about it later" or "I'll do it later" tell a short, relatable story about a middle-class family facing a sudden financial crisis. Conclude with: "Aksar jab sab achha chal raha hota hai tab value samajh nahi aati. Par kal ko aisi crisis aayi, toh aapko meri aur mere boss Mike ki zaroorat yaad aayegi. Emergency mein aap directly Mike se help le sakte hain."
        11. ALWAYS OPEN FOR QUESTIONS: End your responses by warmly encouraging them to ask more: "Agar aapke mann mein abhi bhi koi aur sawal hai, toh please bejhijhak puchiye."` 
    };

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
            return res.status(500).json({ reply: "🙏 Maaf kijiye, mere system mein abhi kuch update ka kaam chal raha hai. Lekin aapka time bohot keemti hai, isliye please aap directly mere Guru, Mike ko WhatsApp par contact kar lijiye: https://wa.me/+919382181126" });
        }

        const reply = data.choices?.[0]?.message?.content || "Thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        return res.status(500).json({ reply: "🙏 Maaf kijiye, mere system mein abhi kuch update ka kaam chal raha hai. Lekin aapka time bohot keemti hai, isliye please aap directly mere Guru, Mike ko WhatsApp par contact kar lijiye: https://wa.me/+919382181126" });
    }
}
