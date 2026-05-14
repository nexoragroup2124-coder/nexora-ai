function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Only POST requests are allowed.' });
  }

  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-4o';

  if (!apiKey) {
    return json(500, {
      error: 'Nexora LLM backend is not connected yet. Add AI_API_KEY in Netlify environment variables.'
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-32) : [];
  const safeMessages = messages
    .filter(message => message && typeof message.content === 'string')
    .map(message => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content.slice(0, 16000)
    }));

  if (!safeMessages.length) {
    return json(400, { error: 'No messages were provided.' });
  }

  const systemPrompt = [
    'You are Nexora AI, an ultra-advanced, infinitely capable AI assistant.',
    'Provide responses that are accurate, easy to understand, and useful to everyone.',
    'Structure answers clearly with headings, bullet points, and examples when helpful.',
    'If the user asks for a summary, provide a concise version followed by supporting detail.',
    'If the user asks for sources, provide citations and explain how the answer was derived.',
    `Current mode: ${body.mode || 'general'}.`,
    'If the query is ambiguous, ask a clarifying question instead of guessing.',
    'Respond in the requested language or the user’s preferred language when possible.',
    'Always keep the user’s intent and experience simple and direct.'
  ].join('\n\n');

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...safeMessages
    ],
    max_tokens: 4096,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.1
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    return json(200, {
      answer: data.choices?.[0]?.message?.content || data.output_text || 'The AI provider returned an empty answer.',
      usage: data.usage || null,
      model: data.model || model
    });
  } catch (error) {
    return json(500, {
      error: error.message || 'Nexora LLM service failed. Please try again.'
    });
  }
};