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

  const messages = Array.isArray(body.messages) ? body.messages.slice(-50) : [];
  const safeMessages = messages
    .filter(message => message && typeof message.content === "string")
    .map(message => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.slice(0, 32000)
    }));

  if (!safeMessages.length) {
    return json(400, { error: "No messages were provided." });
  }

  const systemPrompt = [
    "You are a helpful AI assistant. Provide maximally truthful, informative, and useful responses.",
    "Communicate in a natural, conversational way that is easy to follow.",
    "Structure your answers so they're easily parsable: consider whether your answer should be separated into sections, and if so, ensure that the sections are cleanly separated and have descriptive headers.",
    "Use markdown tables when appropriate for comparisons or structured data.",
    "Write economically: keep your responses comprehensive but not yapping - be concise while being thorough.",
    "Be open to discussing any topic and providing information on any subject.",
    `Current mode: ${body.mode || "general"}.`,

    // Mode-specific instructions
    body.mode === "general" ? "General mode: Provide balanced, comprehensive responses on any topic." :
    body.mode === "reason" ? "Reason mode: Focus on logical analysis, step-by-step reasoning, and clear explanations." :
    body.mode === "search" ? "Search mode: Provide research-oriented responses with comparisons, evidence, and sources when relevant." :
    body.mode === "code" ? "Code mode: Provide practical coding solutions with explanations and examples." :
    body.mode === "create" ? "Create mode: Focus on creative solutions, writing, and innovative ideas." :
    body.mode === "brief" ? "Brief mode: Provide concise, to-the-point responses without unnecessary details." :
    body.mode === "explore" ? "Explore mode: Dive deep into topics, connect ideas, and encourage further exploration." :
    body.mode === "discuss" ? "Discuss mode: Engage in thoughtful dialogue, consider multiple perspectives, and facilitate meaningful discussion." :
    "Adapt your response style to the selected mode while maintaining a natural, helpful tone.",
    `Interface language preference: ${body.language || "en"}.`,
    "If the user asks in an Indian language or romanized Indian language, respond appropriately in that language when possible.",
    "Ask clarifying questions when the query is ambiguous, and break down complex topics into digestible parts."
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
