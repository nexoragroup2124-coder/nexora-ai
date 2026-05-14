/**
 * Nexora AI - Advanced Frontend Integration
 * Integrates with powerful backend AI engine
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  API_BASE: process.env.API_BASE || 'http://localhost:5000',
  WS_BASE: process.env.WS_BASE || 'ws://localhost:5000',
  MODELS: {
    fast: 'mixtral-8x7b-32768',
    balanced: 'llama2-70b-4096',
    powerful: 'neural-chat-7b-v3-1',
    code: 'meta-llama/Llama-2-7b-chat-hf',
  },
  DEFAULT_MODEL: 'balanced',
  MAX_RETRIES: 3,
  TIMEOUT: 30000,
};

// ============================================
// STATE MANAGEMENT
// ============================================

class NexoraState {
  constructor() {
    this.conversations = new Map();
    this.currentConversation = null;
    this.isLoading = false;
    this.selectedModel = CONFIG.DEFAULT_MODEL;
    this.taskType = 'default';
    this.settings = this.loadSettings();
    this.cache = new Map();
  }

  loadSettings() {
    try {
      return JSON.parse(localStorage.getItem('nexora.settings.v2')) || {
        theme: 'dark',
        language: 'en',
        autoSave: true,
        enableSearch: true,
        enableCode: true,
      };
    } catch {
      return {};
    }
  }

  saveSettings() {
    localStorage.setItem('nexora.settings.v2', JSON.stringify(this.settings));
  }

  addMessage(role, content, model = null) {
    if (!this.currentConversation) return null;

    const message = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      model,
      timestamp: Date.now(),
    };

    this.currentConversation.messages.push(message);
    this.saveConversation();
    return message;
  }

  saveConversation() {
    if (!this.currentConversation) return;
    this.conversations.set(this.currentConversation.id, this.currentConversation);
    localStorage.setItem(
      `nexora.conversation.${this.currentConversation.id}`,
      JSON.stringify(this.currentConversation)
    );
  }

  createConversation(title = 'New Chat') {
    const id = Date.now().toString();
    const conversation = {
      id,
      title,
      messages: [],
      createdAt: Date.now(),
      model: this.selectedModel,
    };
    this.currentConversation = conversation;
    this.conversations.set(id, conversation);
    this.saveConversation();
    return conversation;
  }
}

// ============================================
// API CLIENT
// ============================================

class NexoraAPI {
  constructor(baseURL = CONFIG.API_BASE) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        timeout: CONFIG.TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Chat with AI
  async chat(messages, taskType = 'default', model = CONFIG.DEFAULT_MODEL) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        taskType,
        model,
      }),
    });
  }

  // Web Search
  async search(query) {
    return this.request('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Execute Code
  async executeCode(code) {
    return this.request('/api/code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Chain-of-Thought Reasoning
  async reason(problem) {
    return this.request('/api/reason', {
      method: 'POST',
      body: JSON.stringify({ problem }),
    });
  }

  // Get Available Models
  async getModels() {
    return this.request('/api/models');
  }

  // Health Check
  async health() {
    return this.request('/api/health');
  }

  // Create Conversation
  async createConversation(userId, title) {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ userId, title }),
    });
  }

  // Get Conversation History
  async getConversation(conversationId) {
    return this.request(`/api/conversations/${conversationId}`);
  }
}

// ============================================
// ADVANCED FEATURES
// ============================================

class NexoraAI {
  constructor() {
    this.state = new NexoraState();
    this.api = new NexoraAPI();
    this.isConnected = false;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      await this.api.health();
      this.isConnected = true;
      document.body.dataset.connected = 'true';
    } catch {
      this.isConnected = false;
      document.body.dataset.connected = 'false';
    }
  }

  // Main chat handler
  async handleChat(userMessage) {
    if (!this.isConnected) {
      return this.handleOfflineMode(userMessage);
    }

    this.state.addMessage('user', userMessage);

    try {
      const conversation = this.state.currentConversation;
      const messages = conversation.messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const result = await this.api.chat(messages, this.state.taskType);

      if (result.success) {
        this.state.addMessage('assistant', result.content, result.model);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      this.state.addMessage('assistant', `Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Web search mode
  async handleSearch(query) {
    if (!this.isConnected) {
      return { success: false, error: 'Search requires backend connection' };
    }

    try {
      const results = await this.api.search(query);
      this.state.addMessage('user', `Search: ${query}`);
      this.state.addMessage('assistant', this.formatSearchResults(results.results));
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, error: error.message };
    }
  }

  // Code execution mode
  async handleCodeExecution(code) {
    if (!this.isConnected) {
      return { success: false, error: 'Code execution requires backend connection' };
    }

    try {
      const result = await this.api.executeCode(code);
      this.state.addMessage('user', `Execute:\n\`\`\`\n${code}\n\`\`\``);
      this.state.addMessage('assistant', `Output:\n\`\`\`\n${result.output}\n\`\`\``);
      return result;
    } catch (error) {
      console.error('Code execution error:', error);
      return { success: false, error: error.message };
    }
  }

  // Advanced reasoning mode
  async handleReasoning(problem) {
    if (!this.isConnected) {
      return { success: false, error: 'Reasoning requires backend connection' };
    }

    try {
      const result = await this.api.reason(problem);
      this.state.addMessage('user', `Problem: ${problem}`);
      this.state.addMessage('assistant', result.reasoning);
      return result;
    } catch (error) {
      console.error('Reasoning error:', error);
      return { success: false, error: error.message };
    }
  }

  // Offline fallback mode
  async handleOfflineMode(userMessage) {
    const response = `[Offline Mode] ${userMessage}\n\nBackend is not connected. Please ensure the Nexora AI backend server is running at ${CONFIG.API_BASE}`;
    this.state.addMessage('user', userMessage);
    this.state.addMessage('assistant', response);
    return { success: false, message: response };
  }

  // Format search results
  formatSearchResults(results) {
    return results
      .map((r, i) => `${i + 1}. **${r.title}**\n   ${r.snippet}\n   [${r.displayUrl}](${r.url})`)
      .join('\n\n');
  }

  // Switch model
  setModel(model) {
    this.state.selectedModel = model;
    this.state.settings.model = model;
    this.state.saveSettings();
  }

  // Switch task type
  setTaskType(taskType) {
    this.state.taskType = taskType;
  }
}

// ============================================
// UI CONTROLLER
// ============================================

class NexoraUI {
  constructor(nexoraAI) {
    this.nexora = nexoraAI;
    this.elements = this.cacheElements();
    this.setupEventListeners();
    this.render();
  }

  cacheElements() {
    return {
      messageContainer: document.getElementById('messages'),
      promptInput: document.getElementById('promptInput'),
      sendBtn: document.getElementById('sendBtn'),
      modelSelect: document.getElementById('modelSelect'),
      taskTypeButtons: document.querySelectorAll('[data-task-type]'),
      statusPill: document.getElementById('statusPill'),
      themeToggle: document.getElementById('themeToggle'),
      conversationsList: document.getElementById('conversationsList'),
    };
  }

  setupEventListeners() {
    // Send message
    this.elements.sendBtn?.addEventListener('click', () => this.sendMessage());
    this.elements.promptInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Task type selection
    this.elements.taskTypeButtons?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.nexora.setTaskType(e.target.dataset.taskType);
        this.updateTaskButtons();
      });
    });

    // Model selection
    this.elements.modelSelect?.addEventListener('change', (e) => {
      this.nexora.setModel(e.target.value);
    });

    // Check connection periodically
    setInterval(() => this.nexora.checkConnection(), 5000);
  }

  async sendMessage() {
    const message = this.elements.promptInput?.value.trim();
    if (!message) return;

    this.elements.promptInput.value = '';
    this.addMessageToUI('user', message);
    this.showLoading();

    try {
      const result = await this.nexora.handleChat(message);
      if (result.success) {
        this.addMessageToUI('assistant', result.content);
      }
    } catch (error) {
      this.addMessageToUI('assistant', `Error: ${error.message}`);
    } finally {
      this.hideLoading();
    }
  }

  addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${role}`;
    messageDiv.innerHTML = `
      <div class="message-avatar">${role === 'assistant' ? 'N' : 'U'}</div>
      <div class="message-content">
        <div class="message-text">${this.formatMessageContent(content)}</div>
        ${role === 'assistant' ? this.getMessageActions() : ''}
      </div>
    `;
    this.elements.messageContainer?.appendChild(messageDiv);
    this.elements.messageContainer?.scrollTop = this.elements.messageContainer?.scrollHeight;
  }

  formatMessageContent(content) {
    return content
      .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  getMessageActions() {
    return `
      <div class="message-actions">
        <button class="action-btn" title="Copy">📋</button>
        <button class="action-btn" title="Regenerate">🔄</button>
        <button class="action-btn" title="Share">🔗</button>
      </div>
    `;
  }

  updateTaskButtons() {
    this.elements.taskTypeButtons?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.taskType === this.nexora.state.taskType);
    });
  }

  updateStatus() {
    if (this.elements.statusPill) {
      this.elements.statusPill.textContent = this.nexora.isConnected
        ? '✅ Connected - Backend Active'
        : '⚠️ Offline Mode';
      this.elements.statusPill.className = this.nexora.isConnected ? 'status-connected' : 'status-offline';
    }
  }

  showLoading() {
    this.nexora.state.isLoading = true;
    this.elements.sendBtn.disabled = true;
  }

  hideLoading() {
    this.nexora.state.isLoading = false;
    this.elements.sendBtn.disabled = false;
  }

  render() {
    this.updateStatus();
    this.updateTaskButtons();
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const nexora = new NexoraAI();
  const ui = new NexoraUI(nexora);

  // Create initial conversation
  nexora.state.createConversation('Nexora AI Chat');

  // Make available globally for debugging
  window.Nexora = { ai: nexora, ui, api: nexora.api, state: nexora.state };

  console.log('🚀 Nexora AI loaded successfully');
  console.log('Backend API:', CONFIG.API_BASE);
  console.log('Connection Status:', nexora.isConnected ? '✅ Connected' : '⚠️ Offline');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  return date.toLocaleDateString();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NexoraAI, NexoraAPI, NexoraState, NexoraUI };
}
