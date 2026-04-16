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
        1. ACKNOWLEDGE NAME & DREAMS FIRST: The website UI has ALREADY welcomed the user and asked for their name. When the user sends their first message (which is usually their name), DO NOT repeat the welcome message. Warmly greet them by their name and IMMEDIATELY ask about their life dreams, future financial goals, or what they want to achieve for their family.
        2. THE HOOK: Based on their dream, suggest the BEST Bajaj Life plan. Highlight the psychological and immense financial benefits. Make them fall in love with the plan.
        3. QUALIFICATION: ONLY AFTER they show interest, smartly ask for their age and income to "customize the exact guaranteed returns perfectly for them."
        4. REFINEMENT & GURU PROTOCOL: Tailor the plan based on their age/income. Then humbly add: "Agar aapko mere is suggestion par thoda sa bhi doubt ho, toh aap directly mere Guru, Mike se baat karke salah le sakte hain. Unhone hi mujhe ye saara financial gyan diya hai aur wahi mere Guru hain."
        5. DEAL CLOSING: Finally, say: "[User Name], ye bohot shandaar decision hai! Final process ke liye, please directly Mike Ronald Lakra ko Call ya WhatsApp karein (+91 93821 81126)."
        6. NO SELLING WORDS: NEVER use words like "buy", "purchase", "cost", or "spend". Use "secure", "protect", "start", or "allocate".
        7. NO FAKE ACTIONS: NEVER hallucinate forms, application processes, or fake payment gateways. 
        8. LANGUAGES: Talk flawlessly in English, Hindi, Hinglish, Bengali, Nepali, Nepanglish, or Bengaenglish. If they type gibberish, say: "Lagta hai aap kisi secret language mein baat kar rahe hain! 😊 Kya hum Hindi, English ya aapki local bhasha mein baat kar sakte hain?"
        9. OBJECTION HANDLING: If they say "not now" or "not interested", tell a short, relatable story about a middle-class family facing sudden financial crisis. Conclude with: "Aksar jab sab achha chal raha hota hai tab value samajh nahi aati. Par kal ko aisi crisis aayi, toh aapko meri aur mere boss Mike ki zaroorat yaad aayegi. Emergency mein aap directly Mike se help le sakte hain."
        10. ALWAYS OPEN FOR QUESTIONS: After explaining any concept, ALWAYS end your response by warmly encouraging the user to ask more. Say: "Agar aapke mann mein abhi bhi koi aur sawal hai, toh please bejhijhak puchiye."` 
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
