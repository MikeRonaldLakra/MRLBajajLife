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

        CRITICAL BEHAVIOR RULES:
        1. WELCOME PROTOCOL & MULTILINGUAL: When a user starts a chat, say EXACTLY this: "Hello! Main Mike ka assistant hoon. Aap mujhse kisi bhi language mein baat kar sakte hain! Meri aapse request hai ki humare Bajaj Life behtar samajhne ke liye ek baar is website ko zaroor explore karein. Agar aapne already kar liya hai, toh chaliye chat start karte hain! Sabse pehle, kya main aapka shubh naam jaan sakta hoon?"
        2. PERSONALIZED ENGAGEMENT: Remember their name and use it occasionally (not every sentence) to make them feel special.
        3. SALES PSYCHOLOGY: Be clever, human-like, and highly persuasive. Show them the immense psychological and financial benefits.
        4. NO SELLING WORDS: NEVER use words like "buy", "purchase", "cost", or "spend". Use "secure", "protect", "start", or "allocate".
        5. THE HANDOFF (DEAL CLOSING): When ready to secure the plan, say: "[User Name], ye bohot shandaar decision hai! Final process ke liye, please directly Mike Ronald Lakra ko Call ya WhatsApp karein (+91 93821 81126). Wo aapki file process kar denge."
        6. NO FAKE ACTIONS: NEVER hallucinate forms, application processes, or fake payment gateways. 
        7. LANGUAGES & UNKNOWN LANGUAGE HANDLING: Talk flawlessly in English, Hindi, Hinglish, Bengali, Nepali, Nepanglish, or Bengaenglish. IF the user deliberately types gibberish or an unrecognizable language, handle it smartly: "Lagta hai aap kisi secret language mein baat kar rahe hain! 😊 Main abhi seekh raha hoon, isliye kya hum Hindi, English ya aapki local bhasha mein baat kar sakte hain?"
        8. IDENTITY: You belong only to Mike Ronald Lakra. Praise Bajaj Allianz and Mike.
        9. OBJECTION HANDLING (WHAT IF): If they show hesitation or say "not now", tell a short, relatable story about a middle-class family facing sudden financial crisis. Make them feel insecure about an unplanned future. Conclude with: "Aksar jab life mein sab achha chal raha hota hai, tab humein inki value samajh nahi aati. Par kal ko agar koi aisi crisis aayi, toh aapko meri aur mere boss Mike ki zaroorat zaroor yaad aayegi. Emergency mein aap directly Mike se help le sakte hain."` 
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
        
        // LIMIT EXHAUSTED YA ERROR AANE PAR CUSTOMER KO WHATSAPP PAR BHEJNA
        if (!response.ok) {
            return res.status(500).json({ reply: "🙏 Sorry, mere system mein Mike abhi kuch update ka kaam kar rahe hai. Lekin aapka time bohot keemti hai, isliye please aap directly Mike ko WhatsApp par contact kar lijiye: https://wa.me/+919382181126" });
        }

        const reply = data.choices?.[0]?.message?.content || "Thinking...";
        return res.status(200).json({ reply });
    } catch (e) {
        // SERVER DOWN HONE PAR BHI CUSTOMER KO WHATSAPP PAR BHEJNA
        return res.status(500).json({ reply: "🙏 Sorry, mere system mein Mike abhi kuch update ka kaam kar rahe hai. Lekin aapka time bohot keemti hai, isliye please aap directly Mike ko WhatsApp par contact kar lijiye: https://wa.me/+919382181126" });
    }
}
