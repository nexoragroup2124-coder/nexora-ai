const bcrypt = require('bcryptjs');
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

function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'nexora-secret-key', { expiresIn: '7d' });
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    if (!email || !password) {
      return json(400, { error: 'Email and password are required.' });
    }

    const users = loadUsers();
    const user = users.find(item => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return json(401, { error: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return json(401, { error: 'Invalid credentials.' });
    }

    return json(200, {
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      token: generateToken(user)
    });
  } catch (error) {
    return json(500, { error: 'Login failed.' });
  }
};