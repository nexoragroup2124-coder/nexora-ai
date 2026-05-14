const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// ============================================
// DATABASE SETUP (SQLite)
// ============================================

const db = new sqlite3.Database('./nexora.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Conversations table
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT DEFAULT 'New Chat',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      modelUsed TEXT DEFAULT 'mistral'
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      model TEXT,
      tokens INTEGER DEFAULT 0,
      FOREIGN KEY(conversationId) REFERENCES conversations(id)
    )
  `);

  // Memory/Knowledge table
  db.run(`
    CREATE TABLE IF NOT EXISTS memory (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      type TEXT,
      content TEXT,
      embedding TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(conversationId) REFERENCES conversations(id)
    )
  `);

  // API usage logs
  db.run(`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      endpoint TEXT,
      model TEXT,
      tokensUsed INTEGER,
      costUSD REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ============================================
// AI ENGINE MODULE
// ============================================

class AIEngine {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
    this.bingSearchKey = process.env.BING_SEARCH_KEY;
    
    this.models = {
      fast: 'mixtral-8x7b-32768', // Groq - fastest
      balanced: 'llama2-70b-4096', // Groq - balanced
      powerful: 'neural-chat-7b-v3-1', // HuggingFace - powerful
      code: 'meta-llama/Llama-2-7b-chat-hf', // Code specialist
    };
  }

  // Select best model based on task
  selectModel(taskType) {
    const modelMap = {
      'simple': this.models.fast,
      'reasoning': this.models.balanced,
      'code': this.models.code,
      'creative': this.models.powerful,
      'default': this.models.balanced
    };
    return modelMap[taskType] || modelMap.default;
  }

  // Chat with Groq API (Free & Fast)
  async chatWithGroq(messages, model = this.models.balanced, temperature = 0.7) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: 2048,
          top_p: 0.9,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        model: model,
        tokens: response.data.usage.total_tokens,
        finish_reason: response.data.choices[0].finish_reason,
      };
    } catch (error) {
      console.error('Groq API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Groq API error',
      };
    }
  }

  // Chat with HuggingFace API (Multiple models)
  async chatWithHuggingFace(messages, model = 'mistral') {
    try {
      const prompt = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: prompt, parameters: { max_new_tokens: 1024 } },
        {
          headers: {
            Authorization: `Bearer ${this.huggingfaceApiKey}`,
          },
        }
      );

      return {
        success: true,
        content: response.data[0].generated_text,
        model: model,
        tokens: 0, // HuggingFace doesn't return token count
      };
    } catch (error) {
      console.error('HuggingFace API error:', error.message);
      return {
        success: false,
        error: 'HuggingFace API error',
      };
    }
  }

  // Web search with Bing
  async webSearch(query) {
    try {
      const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
        params: { q: query },
        headers: {
          'Ocp-Apim-Subscription-Key': this.bingSearchKey,
        },
      });

      return {
        success: true,
        results: response.data.webPages.value.slice(0, 5).map(result => ({
          title: result.name,
          url: result.url,
          snippet: result.snippet,
          displayUrl: result.displayUrl,
        })),
      };
    } catch (error) {
      console.error('Bing Search error:', error.message);
      return {
        success: false,
        error: 'Search failed',
        results: [],
      };
    }
  }

  // Execute code safely (JavaScript only)
  executeCode(code, timeout = 5000) {
    return new Promise((resolve) => {
      try {
        const context = {
          console: {
            log: (...args) => resolve({
              success: true,
              output: args.map(arg => String(arg)).join(' '),
            }),
          },
          require: undefined, // Disable require
          __dirname: undefined,
          __filename: undefined,
          process: undefined,
        };

        const vmScript = new vm.Script(code);
        const vmContext = vm.createContext(context);

        const timeoutHandle = setTimeout(() => {
          resolve({
            success: false,
            error: 'Code execution timeout (5 seconds)',
          });
        }, timeout);

        vmScript.runInContext(vmContext, { timeout });
        clearTimeout(timeoutHandle);

        // If code doesn't explicitly log, return success
        if (!context.console.log.called) {
          resolve({
            success: true,
            output: 'Code executed successfully',
          });
        }
      } catch (error) {
        resolve({
          success: false,
          error: error.message,
        });
      }
    });
  }

  // Chain-of-thought reasoning
  async chainOfThought(problem) {
    const steps = [
      "Let me break down this problem into steps...",
      "First, I'll analyze the key components...",
      "Next, I'll reason through each part...",
      "Finally, I'll synthesize the solution...",
    ];

    const messages = [
      {
        role: 'user',
        content: `Solve this step-by-step with reasoning:\n\n${problem}`,
      },
    ];

    const result = await this.chatWithGroq(messages, this.models.powerful);
    return result;
  }

  // Advanced prompt engineering
  enhancePrompt(userMessage, context = '') {
    const systemPrompt = `You are Nexora AI, an advanced AI assistant.
You are:
- Highly knowledgeable across all domains
- Capable of deep reasoning and analysis
- Proficient in coding and technical topics
- Creative in problem-solving
- Transparent about your limitations
- Focused on accuracy and helpful responses

${context ? `Additional context: ${context}` : ''}`;

    return systemPrompt;
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

const aiEngine = new AIEngine();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    models: aiEngine.models,
  });
});

// Chat endpoint (main)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, taskType = 'default', conversationId = null, userId = 'guest' } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages required' });
    }

    // Select model based on task
    const model = aiEngine.selectModel(taskType);

    // Get AI response
    const aiResponse = await aiEngine.chatWithGroq(messages, model);

    if (!aiResponse.success) {
      return res.status(500).json({ error: aiResponse.error });
    }

    // Save to database if conversationId provided
    if (conversationId) {
      const messageId = uuidv4();
      db.run(
        `INSERT INTO messages (id, conversationId, role, content, model, tokens)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [messageId, conversationId, 'assistant', aiResponse.content, model, aiResponse.tokens]
      );
    }

    res.json({
      success: true,
      content: aiResponse.content,
      model: model,
      tokens: aiResponse.tokens,
      taskType: taskType,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Web search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    const searchResults = await aiEngine.webSearch(query);

    if (!searchResults.success) {
      return res.status(500).json({ error: searchResults.error });
    }

    res.json({
      success: true,
      query: query,
      results: searchResults.results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Code execution endpoint
app.post('/api/code', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code required' });
    }

    const result = await aiEngine.executeCode(code);

    res.json({
      success: result.success,
      output: result.output || result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'Code execution failed' });
  }
});

// Chain-of-thought reasoning
app.post('/api/reason', async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      return res.status(400).json({ error: 'Problem required' });
    }

    const result = await aiEngine.chainOfThought(problem);

    res.json({
      success: result.success,
      reasoning: result.content || result.error,
      model: result.model,
      tokens: result.tokens,
    });
  } catch (error) {
    console.error('Reasoning error:', error);
    res.status(500).json({ error: 'Reasoning failed' });
  }
});

// Create conversation
app.post('/api/conversations', (req, res) => {
  try {
    const { userId = 'guest', title = 'New Chat' } = req.body;
    const conversationId = uuidv4();

    db.run(
      `INSERT INTO conversations (id, userId, title) VALUES (?, ?, ?)`,
      [conversationId, userId, title],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create conversation' });
        }
        res.json({ success: true, conversationId: conversationId });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Conversation creation failed' });
  }
});

// Get conversation history
app.get('/api/conversations/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;

    db.all(
      `SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp ASC`,
      [conversationId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve messages' });
        }
        res.json({ success: true, messages: rows });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// List available models
app.get('/api/models', (req, res) => {
  res.json({
    success: true,
    models: aiEngine.models,
    description: {
      fast: 'Mixtral-8x7B (Fastest, good for simple Q&A)',
      balanced: 'LLaMA2-70B (Balanced performance & quality)',
      powerful: 'Neural-Chat-7B (Best quality, slower)',
      code: 'Meta-Llama (Code specialist)',
    },
  });
});

// Usage statistics
app.get('/api/stats', (req, res) => {
  try {
    db.all(
      `SELECT model, COUNT(*) as count, SUM(tokens) as totalTokens, SUM(costUSD) as totalCost 
       FROM usage_logs GROUP BY model`,
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to get stats' });
        }
        res.json({ success: true, stats: rows });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║    🚀 Nexora AI Backend Started      ║
  ║    Server: http://localhost:${PORT}     ║
  ╚═══════════════════════════════════════╝
  
  API Endpoints:
  - POST /api/chat (Chat with AI)
  - POST /api/search (Web search)
  - POST /api/code (Execute code)
  - POST /api/reason (Chain-of-thought)
  - GET  /api/health (Server status)
  - GET  /api/models (Available models)
  
  Environment:
  - Groq API: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}
  - HuggingFace API: ${process.env.HUGGINGFACE_API_KEY ? '✅ Configured' : '❌ Missing'}
  - Bing Search: ${process.env.BING_SEARCH_KEY ? '✅ Configured' : '❌ Missing'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.close();
  process.exit(0);
});
