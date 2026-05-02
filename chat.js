exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Only POST requests are allowed." });
  }

  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return json(500, {
      error: "Nexora backend is not connected yet. Add AI_API_KEY in Netlify environment variables."
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  const safeMessages = messages
    .filter(message => message && typeof message.content === "string")
    .map(message => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.slice(0, 8000)
    }));

  if (!safeMessages.length) {
    return json(400, { error: "No messages were provided." });
  }

  const systemPrompt = [
    "You are Nexora AI, a premium, helpful AI assistant inside the Nexora app.",
    "Be direct, useful, friendly, and original.",
    "Do not pretend to be ChatGPT, Siri, Alexa, Gemini, Perplexity, or xAI.",
    `Mode: ${body.mode || "reason"}.`,
    `Interface language preference: ${body.language || "en"}.`,
    "If the user asks in an Indian language or romanized Indian language, answer simply in that language when possible.",
    "When unsure, say what you can do and ask one helpful question."
  ].join(" ");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...safeMessages
        ],
        temperature: body.mode === "creative" ? 0.85 : 0.35
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json(response.status, {
        error: data.error?.message || data.message || `AI provider returned ${response.status}.`
      });
    }

    return json(200, {
      answer: data.choices?.[0]?.message?.content || data.output_text || "The AI provider returned an empty answer."
    });
  } catch (error) {
    return json(500, { error: error.message || "Nexora backend failed." });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}
