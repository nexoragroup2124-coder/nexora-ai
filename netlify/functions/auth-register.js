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
      'Access-Control-Allow-Headers': 'Content-Type',
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
    // Persist may fail on cold start; continue with in-memory store
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
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return json(400, { error: 'Name, email, and password are required.' });
    }

    const users = loadUsers();
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      return json(409, { error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      plan: 'free',
      tokensUsed: 0,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);

    return json(201, {
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      token: generateToken(user)
    });
  } catch (error) {
    return json(500, { error: 'Registration failed.' });
  }
};