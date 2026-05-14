exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Only POST requests are allowed." });
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

  const provider = (body.provider || process.env.AI_PROVIDER || "openai").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const defaultUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const providerUrls = {
    openai: process.env.AI_API_URL || defaultUrl,
    xai: process.env.XAI_API_URL || "https://api.x.ai/v1/chat/completions",
    perplexity: process.env.PERPLEXITY_API_URL || "https://api.perplexity.ai/chat/completions",
    gemini: process.env.GEMINI_API_URL || defaultUrl,
    custom: process.env.AI_API_URL || defaultUrl
  };
  const apiUrl = providerUrls[provider] || defaultUrl;
  const model = body.model || process.env.AI_MODEL || "gpt-4o-mini";
  const temperature = typeof body.temperature === "number" ? body.temperature : 0.35;

  if (!apiKey) {
    return json(500, {
      error: "Nexora backend is not connected yet. Set AI_API_KEY in your Netlify environment variables."
    });
  }

  const systemPrompt = [
    "You are Nexora AI, an advanced assistant that gives accurate, helpful, and user-focused answers.",
    "Speak clearly, stay on topic, and provide structured, easy-to-follow responses.",
    "If the topic deserves sections, use headers and bullets. Use tables for comparisons.",
    "Keep answers precise but complete, with no unnecessary discussion.",
    "Follow the chosen mode and language preference.",
    `Current mode: ${body.mode || "general"}.`,
    body.mode === "reason" ? "Focus on logic, explanation, and step-by-step reasoning." :
    body.mode === "search" ? "Answer with research style, comparisons, and relevant evidence." :
    body.mode === "code" ? "Provide practical code answers, examples, and debugging help." :
    body.mode === "create" ? "Generate creative and original content." :
    body.mode === "brief" ? "Keep the answer concise and direct." :
    body.mode === "explore" ? "Explore ideas, connections, and possibilities." :
    body.mode === "discuss" ? "Engage in thoughtful dialogue and consider multiple perspectives." :
    body.mode === "analyze" ? "Analyze carefully and summarize key insights." :
    body.mode === "research" ? "Deliver evidence-based conclusions and sources." :
    "Answer in a helpful, natural tone."
  ].join("\n");

  try {
    const payload = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...safeMessages
      ],
      temperature,
      max_tokens: 1500
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json(response.status, {
        error: data.error?.message || data.message || `AI provider returned ${response.status}.`
      });
    }

    const answer = data.choices?.[0]?.message?.content || data.output_text || data.response || "The AI provider returned an empty answer.";
    return json(200, { answer });
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
