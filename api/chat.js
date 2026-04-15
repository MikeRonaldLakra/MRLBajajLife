export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const KEY = process.env.GEMINI_API_KEY;

  // ✅ v1beta endpoint — required for gemini-1.5-flash
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  const SYSTEM_PROMPT = `You are Mike's AI Assistant — a helpful, friendly insurance advisor for Mike Ronald Lakra, an authorized Bajaj Allianz Life Insurance Financial Advisor based in Kolkata (IC Code: ABLIC1003446377).

KEY PLANS:
1. AWG Second Income: ₹1L/yr × 10yr → ₹1,81,500/yr × 30yrs + 110% ROP. Zero market risk.
2. Smart Protect Goal (Term): ₹651/month for ₹1 Crore (Age 30, male). 99.29% CSR FY25.
3. Smart Wealth Goal V (ULIP): Zero allocation charges. Market-linked wealth.
4. Guaranteed Pension Goal II: ~9% annuity rate at age 60. Lifetime pension.
5. Bajaj Life ACE: Modular plan. Product of Year 2024. GI + Cash Bonus.

KEY FACTS:
- Claim Settlement: 99.29% FY 2024-25
- Zero GST on life insurance since Sept 2025
- AUM: ₹1.37L Crore | Solvency: 343%
- Tax benefits: 80C + 10(10D)

STYLE: Be concise and warm. Use simple English with occasional Hindi.
Always end with WhatsApp CTA: https://wa.me/+919382181126
Keep replies under 150 words. Never make up specific numbers not listed above.`;

  // Build contents array with history
  const contents = [
    // Inject system prompt as first user/model exchange
    { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUnderstood. I will follow these instructions.' }] },
    { role: 'model', parts: [{ text: 'Understood! I am Mike\'s Assistant, ready to help visitors with Bajaj Life Insurance plans.' }] },
    // Add conversation history
    ...history.map(h => ({
      role: h.role === 'assistant' ? 'model' : h.role,
      parts: [{ text: h.parts?.[0]?.text || h.content || '' }]
    })),
    // Add current message
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
      console.error('Gemini API Error:', data);
      return res.status(500).json({ 
        reply: 'Sorry, I had trouble. Please WhatsApp Mike: https://wa.me/+919382181126' 
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text 
      || 'Please contact Mike directly on WhatsApp!';

    return res.status(200).json({ reply });

  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ 
      reply: 'Connection failed. Please WhatsApp Mike: https://wa.me/+919382181126' 
    });
  }
}
