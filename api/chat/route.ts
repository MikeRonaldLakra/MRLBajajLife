export async function POST(req: Request) {
  // 1. Check if the key even exists
  if (!process.env.GROQ_API_KEY) {
    console.error("CRITICAL: GROQ_API_KEY is missing from environment variables!");
    return new Response(
      JSON.stringify({ error: "Server Configuration Error: API Key Missing" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // ... your existing Groq fetch logic ...
  } catch (err) {
    console.error("Fetch error:", err);
    return new Response("Failed to connect to Groq", { status: 502 });
  }
}

