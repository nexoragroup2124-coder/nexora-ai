# 🚀 NEXORA AI - COMPLETE BACKEND SETUP & DEPLOYMENT

## What You're Getting

**Nexora AI Backend v2.0** - Advanced AI chatbot with:
- ✅ Multiple LLM support (Mistral, Llama 2, Neural Hermes)
- ✅ Real-time web search
- ✅ Code execution engine
- ✅ Chain-of-thought reasoning
- ✅ Conversation memory & persistence
- ✅ Rate limiting & security
- ✅ Global deployment ready

---

## Phase 1: Get Free API Keys (15 minutes)

### 1. Groq API (Fastest LLM - FREE)
```
1. Go to: https://console.groq.com
2. Sign up with Google/GitHub
3. Navigate to API Keys
4. Create new key
5. Copy and save the key
```

**Why Groq?** Ultra-fast, free tier, great models (Mixtral, LLaMA2)

### 2. HuggingFace API (Multiple Models - FREE)
```
1. Go to: https://huggingface.co
2. Create account
3. Go to Settings → Access Tokens
4. Create new token (read access)
5. Copy and save the token
```

**Why HuggingFace?** 100K+ models, serverless GPU inference, free tier

### 3. Bing Search API (Web Search - FREE)
```
1. Go to: https://www.bing.com/webmaster
2. Sign in with Microsoft account
3. Add your domain or use default
4. Go to Search Console
5. Copy API key from settings
```

**Why Bing Search?** Free API, good search quality, reliable

### Optional: Replicate API (Model Hosting)
```
1. Go to: https://replicate.com
2. Sign up
3. Copy API token
```

---

## Phase 2: Set Up Backend Locally (20 minutes)

### Step 1: Install Node.js
```bash
# Download from https://nodejs.org
# Choose LTS version (18.x or 20.x)
# Install and verify:
node --version
npm --version
```

### Step 2: Clone/Setup Nexora Folder
```bash
cd /path/to/nexora-ai
# Already done if you followed deployment steps
```

### Step 3: Install Dependencies
```bash
npm install
```

This installs:
- Express (Web server)
- Axios (HTTP client)
- SQLite3 (Database)
- Rate limiting
- CORS support
- And more...

### Step 4: Create .env File
```bash
# Copy the example file:
cp .env.example .env

# Then edit .env and add your API keys:
GROQ_API_KEY=your_groq_key_here
HUGGINGFACE_API_KEY=your_hf_key_here
BING_SEARCH_KEY=your_bing_key_here
PORT=5000
NODE_ENV=development
```

### Step 5: Test Backend Locally
```bash
npm run dev
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║    🚀 Nexora AI Backend Started      ║
║    Server: http://localhost:5000      ║
╚═══════════════════════════════════════╝
```

### Step 6: Test API Endpoints
```bash
# In another terminal:

# Test health check
curl http://localhost:5000/api/health

# Test chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Test web search
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"latest AI news"}'
```

---

## Phase 3: Connect Frontend to Backend

### Option A: Use Advanced Frontend (Recommended)
```html
<!-- In index.html, replace the script tag with: -->
<script src="app-advanced.js"></script>

<!-- Make sure to set API_BASE to your backend -->
<!-- In app-advanced.js, update CONFIG.API_BASE -->
```

### Option B: Update Original Frontend
```javascript
// In app.js, add this at the top:
const API_BASE = 'http://localhost:5000';

// Replace chat handler with:
async function callBackendAPI(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

---

## Phase 4: Deploy Backend to Production (30 minutes)

### Option 1: Railway.app (RECOMMENDED - Free Tier)

**1. Create Railway Account**
```
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway
```

**2. Deploy Nexora Backend**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize Railway in your folder
cd nexora-ai
railway init

# Follow prompts:
# - Select your Nexora project
# - Name your service: "nexora-backend"

# Connect environment variables
railway variables
# Add:
# GROQ_API_KEY=...
# HUGGINGFACE_API_KEY=...
# BING_SEARCH_KEY=...
# NODE_ENV=production

# Deploy
railway up
```

**3. Get Production URL**
```
1. Go to https://railway.app/dashboard
2. Select your project
3. Click the service
4. Copy the public URL (e.g., nexora-ai-production.up.railway.app)
```

**Your backend is now live!** 🎉

### Option 2: Render.com (Alternative)

```bash
# 1. Go to https://render.com
# 2. Connect GitHub repo
# 3. Create new Web Service
# 4. Specify:
#    - Build command: npm install
#    - Start command: npm start
# 5. Add environment variables
# 6. Deploy
```

### Option 3: Heroku (Legacy)

```bash
# 1. Install Heroku CLI
# 2. heroku login
# 3. heroku create nexora-ai-backend
# 4. git push heroku main
# 5. heroku config:set GROQ_API_KEY=...
```

---

## Phase 5: Connect Everything

### Update Frontend API Base
```javascript
// In app-advanced.js, change:
const CONFIG = {
  API_BASE: 'https://your-railway-url.up.railway.app',
  // ...
}

// Or set environment variable:
// In netlify.toml or during build
REACT_APP_API_BASE=https://your-railway-url.up.railway.app
```

### Update Netlify Frontend Build

**In netlify.toml:**
```toml
[build]
  command = "echo 'No build needed'"
  publish = "."

[functions]
  external_node_modules = ["express"]

[[redirects]]
  from = "/api/*"
  to = "https://your-railway-url.up.railway.app/api/:splat"
  status = 200
```

### Test Connection

```bash
# Open browser developer console (F12)
# Check if Nexora AI says "✅ Connected"
# Try sending a message - should work!
```

---

## Phase 6: Monitor & Maintain

### Check Backend Health
```bash
# Visit your backend health endpoint:
https://your-railway-url.up.railway.app/api/health

# Should return:
{
  "status": "healthy",
  "timestamp": "2026-05-14T...",
  "models": {...}
}
```

### View Logs
```bash
# Railway:
railway logs

# Or in Dashboard:
1. Go to railway.app
2. Select project
3. Click "View logs"
```

### Monitor Usage
```bash
# API endpoint to check stats:
curl https://your-url.app/api/stats

# Returns:
# - Requests per model
# - Total tokens used
# - Cost breakdown
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server status |
| `/api/chat` | POST | Chat with AI |
| `/api/search` | POST | Web search |
| `/api/code` | POST | Execute code |
| `/api/reason` | POST | Chain-of-thought reasoning |
| `/api/models` | GET | List available models |
| `/api/conversations` | POST | Create conversation |
| `/api/conversations/:id` | GET | Get conversation history |
| `/api/stats` | GET | Usage statistics |

---

## Troubleshooting

### Backend Won't Start
```bash
# Check Node.js is installed
node --version

# Check port isn't in use
lsof -i :5000

# Check dependencies installed
npm install

# Try with verbose logging
NODE_DEBUG=* npm run dev
```

### API Key Errors
```
Error: "401 Unauthorized"
→ Check API key in .env file
→ Verify key has correct permissions
→ Try regenerating key in provider dashboard
```

### Connection Refused
```
Error: "ECONNREFUSED"
→ Backend server not running
→ Check it's on correct port (5000)
→ Check firewall settings
→ Try: http://localhost:5000/api/health
```

### Rate Limit Exceeded
```
Error: "429 Too Many Requests"
→ Request limit: 100 per 15 minutes per IP
→ Wait 15 minutes or upgrade
→ For production: use API key per user
```

### Models Not Found
```
Error: "Model not available"
→ Check API keys are valid
→ Verify model names in CONFIG.models
→ Check Groq/HuggingFace status
```

---

## Performance Optimization

### Caching
```javascript
// Implement Redis caching (optional)
const redis = require('redis');
const client = redis.createClient();

// Cache common searches
client.set('search:latest-ai-news', results, 'EX', 3600);
```

### Database Optimization
```bash
# Create indexes for faster queries
sqlite3 nexora.db
CREATE INDEX idx_conversationId ON messages(conversationId);
CREATE INDEX idx_timestamp ON messages(timestamp);
```

### Rate Limiting
```javascript
// Already implemented in server.js
// Limit: 100 requests per 15 minutes
// Customize in middleware section
```

---

## Security Best Practices

### ✅ Done
- Rate limiting enabled
- CORS configured
- Input validation
- SQL injection prevention

### 🔄 Add These
```javascript
// 1. Add HTTPS enforcement
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.originalUrl}`);
  }
  next();
});

// 2. Add security headers
const helmet = require('helmet');
app.use(helmet());

// 3. Add request logging
const morgan = require('morgan');
app.use(morgan('combined'));
```

---

## Scale to Millions of Users

### Backend Scaling
```
1. Database: Migrate to PostgreSQL + Supabase
2. Cache: Add Redis for faster responses
3. Load Balancing: Use Railway/Render auto-scaling
4. CDN: Add Cloudflare for static assets
5. Monitoring: Use Sentry for error tracking
```

### Cost Optimization
```
Free tier limits:
- Groq: 500 calls/day (free tier)
- HuggingFace: 25,000 API calls/month
- Railway: 500 hours/month

For higher volume:
- Switch to paid tiers
- Use model caching
- Implement smart request batching
```

---

## Success Checklist

- [ ] All API keys obtained
- [ ] Backend running locally on :5000
- [ ] Frontend can connect to backend
- [ ] Chat works end-to-end
- [ ] Backend deployed to Railway/Render
- [ ] Frontend updated with production URL
- [ ] Health check endpoint responding
- [ ] Web search working
- [ ] Code execution working
- [ ] Conversations being saved
- [ ] Error logging working
- [ ] Rate limiting active

---

## Next Steps

1. ✅ Get API keys (done above)
2. ✅ Set up .env file
3. ✅ Run backend locally
4. ✅ Test all endpoints
5. ✅ Deploy to Railway
6. ✅ Update frontend config
7. 🚀 Launch to world!

---

## Quick Commands Reference

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start with auto-reload
npm test                # Run tests

# Production
npm start               # Start server
npm run lint            # Check code
NODE_ENV=production npm start

# Database
sqlite3 nexora.db       # Open database
.tables                 # Show tables
SELECT * FROM messages; # View messages

# Deployment
railway up              # Deploy to Railway
railway logs            # View logs
railway variables       # Manage env vars
```

---

**Nexora AI Backend is now production-ready! 🎉**

For questions or issues, check the logs or GitHub issues.

