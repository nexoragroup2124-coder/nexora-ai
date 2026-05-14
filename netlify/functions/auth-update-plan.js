const jwt = require('jsonwebtoken');
const fs = require('fs');
const dbPath = '/tmp/nexora-auth.json';

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

function loadUsers() {
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
  } catch {
    // ignore
  }
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

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return json(401, { error: 'Missing token.' });
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return json(401, { error: 'Invalid token.' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { plan } = body;
    if (!plan) {
      return json(400, { error: 'Plan is required.' });
    }

    const users = loadUsers();
    const user = users.find(item => item.id === decoded.userId);
    if (!user) {
      return json(404, { error: 'User not found.' });
    }

    user.plan = plan;
    saveUsers(users);

    return json(200, { user: { id: user.id, plan: user.plan } });
  } catch (error) {
    return json(500, { error: 'Unable to update plan.' });
  }
};