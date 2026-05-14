const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

const plans = {
  free: { price: 0, name: 'Free', description: 'Unlimited access with basic AI features' },
  pro: { price: 1999, name: 'Pro', description: 'Premium access with advanced AI and priority support' },
  team: { price: 4999, name: 'Team', description: 'Enterprise access with team collaboration' }
};

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

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'nexora-secret-key');
  } catch {
    return null;
  }
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return json(500, { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables.' });
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const user = token ? verifyToken(token) : null;

  try {
    const body = JSON.parse(event.body || '{}');
    const planId = body.planId;
    if (!planId || !plans[planId]) {
      return json(400, { error: 'Invalid plan selected.' });
    }

    const selectedPlan = plans[planId];
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/nexora_ai?success=true`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/nexora_ai?cancel=true`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Nexora AI ${selectedPlan.name} Plan`,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.price
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId,
        userEmail: user?.email || 'anonymous'
      },
      customer_email: user?.email
    });

    return json(200, { url: session.url });
  } catch (error) {
    return json(500, { error: 'Unable to create payment session.' });
  }
};