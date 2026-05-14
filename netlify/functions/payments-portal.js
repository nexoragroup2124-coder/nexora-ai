const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

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
    return json(500, { error: 'Stripe is not configured.' });
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return json(401, { error: 'Missing or invalid token.' });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: process.env.STRIPE_CUSTOMER_ID || 'cus_placeholder',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/nexora_ai`
    });

    return json(200, { url: session.url });
  } catch (error) {
    return json(500, { error: 'Unable to create Stripe portal session.' });
  }
};