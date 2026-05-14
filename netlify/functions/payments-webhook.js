const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, {});
  }

  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, secret);
  } catch (err) {
    return json(400, { error: `Webhook signature verification failed: ${err.message}` });
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      // In production, update user plan and billing status here.
      break;
    default:
      break;
  }

  return json(200, { received: true });
};