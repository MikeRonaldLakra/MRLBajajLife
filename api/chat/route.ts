export async function POST(req: Request) {
  // 1. Check if the key exists to prevent the 66ms crash
  if (!process.env.GROQ_API_KEY) {
    console.error("CRITICAL: GROQ_API_KEY is missing!");
    return new Response(
      JSON.stringify({ error: "Server Configuration Error: API Key Missing" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages.slice(-6), // Keep context short to stay under TPM limit
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify(errorData), { status: response.status });
    }

    return new Response(response.body);

  } catch (err) {
    console.error("Fetch error:", err);
    return new Response("Failed to connect to Groq", { status: 502 });
  }
}
