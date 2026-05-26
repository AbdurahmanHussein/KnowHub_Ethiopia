// KnowHub Ethiopia — Gemini AI Tutor Serverless Proxy
// Runs on Vercel as a serverless function at /api/tutor

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return a helpful fallback when API key is not configured
    return res.status(200).json({
      reply: "I'm currently in offline mode. To enable real AI responses, please add a GEMINI_API_KEY to your Vercel environment variables. In the meantime, explore our Schools, Scholarships, and Test Prep tabs for curated educational content!",
      offline: true
    });
  }

  try {
    // Build conversation history for context
    const systemPrompt = `You are KnowHub Ethiopia's friendly Academic Assistant. You help Ethiopian high school and university students with:
- Information about Ethiopian universities, schools, and academic programs
- Scholarship opportunities and application guidance
- Study tips for IELTS, TOEFL, and Duolingo English Tests (DET)
- General academic advice, career guidance, and study strategies
- STEM subjects, essay writing, and research skills

Keep responses concise (under 200 words), encouraging, and practical. Use simple English. When relevant, mention that students can check specific tabs in the KnowHub app (Schools, Scholarships, Tests, Resources, Skills) for more detailed information.`;

    const contents = [];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) { // Keep last 6 messages for context
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 512
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(200).json({
        reply: "I'm having trouble connecting right now. Please try again in a moment, or explore the Schools and Scholarships tabs for immediate help!",
        offline: true
      });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text 
      || "I couldn't generate a response. Please try rephrasing your question!";

    return res.status(200).json({ reply, offline: false });

  } catch (error) {
    console.error('Tutor API error:', error);
    return res.status(200).json({
      reply: "Sorry, I encountered an unexpected error. Please try again shortly!",
      offline: true
    });
  }
}
