function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, {});
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed.' });
  }

  const plans = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Unlimited access with basic AI features',
      tokens: '∞',
      features: ['Unlimited messages', 'Unlimited context', 'Basic AI models']
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 1999,
      description: 'Premium access with advanced AI and priority support',
      tokens: '∞',
      features: ['Unlimited AI', 'GPT-4 access', 'Advanced analytics', 'Priority support']
    },
    team: {
      id: 'team',
      name: 'Team',
      price: 4999,
      description: 'Best for teams and business teams with collaboration features',
      tokens: '∞',
      features: ['Everything in Pro', 'Team accounts', 'Collaboration tools', 'Admin support']
    }
  };

  return json(200, { plans });
};