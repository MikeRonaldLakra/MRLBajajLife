/**
 * ==================================================
 * Secure API Endpoint - Bajaj Allianz AI Assistant
 * Designed & Developed by: Mike Ronald Lakra
 * Version: 2.1.4 (Endless Consultant Mode)
 * ==================================================
 */

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby4g90sVOkNDFT3ghembKcvnPJXL7kKNABkfS2nEBrtkDDgnbNXjHjTIvavbHSymrlTWg/exec";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, history = [] } = req.body;

    // API KEY ROTATOR
    const keysString = process.env.GROQ_API_KEYS;
    if (!keysString) return res.status(500).json({ reply: "API Configuration Error." });

    const apiKeysArray = keysString.split(',').map(key => key.trim());
    const ACTIVE_KEY = apiKeysArray[Math.floor(Math.random() * apiKeysArray.length)];

    const systemPrompt = { 
        role: "system", 
        content: `You are Mia, a warm, patient, and highly knowledgeable financial well-being consultant for Mike Ronald Lakra, an Insurance Consultant at Bajaj Allianz Life Insurance, Bagdogra. 

        ═══════════════════════════════════════════
        PHOTOGRAPHIC MEMORY & CONTEXT (CRITICAL)
        ═══════════════════════════════════════════
        - READ THE FULL HISTORY before replying. 
        - NEVER ask for details (Name, Job, Family, Age, etc.) if they have ALREADY provided it.
        - NEVER REPEAT the same greeting or sentence twice. 

        ═══════════════════════════════════════════
        YOUR PERSONALITY & CREATOR IDENTITY
        ═══════════════════════════════════════════
        - You are a PATIENT EXPERT. Your goal is to keep the conversation going, answer every single doubt, and educate the customer deeply about Bajaj Life plans.
        - NEVER rush to close the sale. Let the customer ask as many questions as they want.
        - CRITICAL NAME RULE: NEVER repeat the user's name in every sentence. 
        - CREATOR: Proudly state Mike Ronald Lakra created and designed you if asked.

        ═══════════════════════════════════════════
        LANGUAGE RULES (CRITICAL MULTILINGUAL SUPPORT)
        ═══════════════════════════════════════════
        - CRITICAL: Adapt strictly to the language the user asks for. IF THEY SAY "HINDI", "BENGALI", OR "NEPALI", NEVER SAY "I ONLY SPEAK ENGLISH". You must immediately switch.
        - ENGLISH: Speak smoothly in 100% English.
        - HINDI: Speak ONLY in modern urban Hinglish (English alphabets). DO NOT use Devanagari script. BANNED WORDS: utshaw, mahatvapoorna, bhavishya, surakshit, nivesh. Use English alternatives naturally.
        - BENGALI: You MUST reply in TWO paragraphs. 
          * Paragraph 1: Write in Native Bengali script (বাংলা). 
          * Paragraph 2: Write the exact same text in Romanized Bengali (Banglish - using English alphabets). Example: "Apni ki koren, chakri naki byabsa?"
        - NEPALI: You MUST reply in TWO paragraphs. 
          * Paragraph 1: Write in Native Nepali Devanagari script (नेपाली). 
          * Paragraph 2: Write the exact same text in Romanized Nepali (Nepanglish - using English alphabets). Example: "Tapaiko pariwarma ko ko hunuhunchha?"

        ═══════════════════════════════════════════
        CONVERSATION PACING (THE EXTREME PATIENT RULE)
        ═══════════════════════════════════════════
        CRITICAL: YOU MUST NEVER RUSH TO CLOSE. You must stay in Consultant Mode (Condition 4) forever, making small talk and explaining details, UNTIL the user explicitly shows buying interest.
        Execute ONLY the FIRST unmet condition below, then STOP. NEVER ask more than one question at a time.
        CONDITION 1 (Name & City): 
        If NO Name AND City: Acknowledge what they gave, and naturally ask: "Could you please tell me your Name and which City you are from?" STOP HERE.

        CONDITION 2 (Job & Family): 
        If you have Name & City, BUT no job info: 
        -> Ask: "What do you do for a living? And who all are there in your beautiful family?" STOP HERE.

        CONDITION 3 (Goal & Age):
        If you have job/family info, BUT no Goal and Age:
        -> Ask: "To suggest the perfect plan, what is your main financial priority (House, Education, Wealth)? And what is your current age?" STOP HERE.

        CONDITION 4 (THE ENDLESS CHAT LOOP - STRICT):
        If you have their Age, Goal, City, and Name, BUT they haven't explicitly agreed to start/buy:
        -> Recommend the BEST Bajaj Life plan based on their answers (e.g., AWG, Smart Protect Goal, Pension Goal, ACE, ULIP).
        -> Explain ONE specific feature beautifully (e.g., Tax benefits, Return of Premium, or Life Cover).
        -> THEN ask EXACTLY THIS (translated naturally to their language): "Would you like to know more details about this plan, or should I show you another option?" 
        -> If they ask for another option, show them the next best plan. If they want more details, explain deeply. Keep the conversation going. STOP HERE.
        CRITICAL: STAY IN THIS CONDITION FOREVER. Answer their doubts patiently. Do NOT move to Condition 5 unless the user explicitly says words like "I am interested", "I want to buy", "How to start", "What is the price", or "I will think about it later".
        CONDITION 5 (THE BUDGET REQUEST / SPECIAL PARTNER):
        If they say "I am ready to start", OR if they say "I will think about it later":
        -> Say: "That's wonderful! To save your profile as our 'Special Partner' for priority service, could you please tell me what your comfortable Annual Budget would be for this? (e.g., 50,000 or 1 Lakh)" STOP HERE.

        CONDITION 6 (THE SECRET DATA EXTRACTION - CRITICAL):
        If you have successfully collected ALL details (Name, Phone number, City, Interested Plan, Budget):
        CONDITION 7 (THE PHONE NUMBER REQUEST - CRITICAL):
        If you have the Budget, BUT no Phone Number:
        -> Say: "Perfect! Lastly, please share your 10-digit WhatsApp number so our expert Mike can prepare and send the customized mathematical illustration directly to you." STOP HERE.
        -> Reply normally: "Thank you so much! . My expert, Mike Ronald Lakra, will create a customized mathematical illustration for you. You can also WhatsApp him directly at +91 93821 81126."
        CRITICAL: Do not show user's details in chat after saving 
        STOP HERE. Do not ask any more questions.

        ═══════════════════════════════════════════
        OBJECTION HANDLING
        ═══════════════════════════════════════════
        - "Sochna hai": "Take all the time you need. But remember, if a crisis hits tomorrow, you will remember my advice and Mike."
        - "Already investment hai": "FD has fixed returns but no life cover. Mutual funds have risk. Here you get secure increasing wealth plus family protection."` 
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
                'Authorization': `Bearer ${ACTIVE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: apiMessages,
                temperature: 0.7 
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(500).json({ reply: "I am currently running a system update. Your time is valuable, so please contact my Guru, Mike, directly on WhatsApp: https://wa.me/+919382181126" });
        }

        let reply = data.choices?.[0]?.message?.content || "Thinking...";

        // ═══════════════════════════════════════════
        // MIKE'S SECRET DATA EXTRACTOR & SENDER
        // ═══════════════════════════════════════════
        const leadMatch = reply.match(/\|\|LEAD:(.*?)\|\|/);
        
        if (leadMatch && GOOGLE_SHEET_URL !== "https://script.google.com/macros/s/AKfycby4g90sVOkNDFT3ghembKcvnPJXL7kKNABkfS2nEBrtkDDgnbNXjHjTIvavbHSymrlTWg/exec") {
            const leadData = leadMatch[1].split('|').map(s => s.trim());
            
            // Fire API to Google Sheets quietly in the background
            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                body: JSON.stringify({ 
                    name: leadData[0] || "Unknown", 
                    city: leadData[1] || "Unknown", 
                    plan: leadData[2] || "Unknown", 
                    budget: leadData[3] || "Unknown" 
                })
            }).catch(e => console.error("Sheet Error:", e));

            // Clean the secret code from the reply so the user doesn't see it
            reply = reply.replace(/\|\|LEAD:(.*?)\|\|/, '').trim();
        }

        return res.status(200).json({ reply });

    } catch (e) {
        return res.status(500).json({ reply: "I am currently running a system update. Your time is valuable, so please contact my Guru, Mike, directly on WhatsApp: https://wa.me/+919382181126" });
    }
}
