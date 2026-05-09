const storeKey = "nexora.state.v1";
const settingsKey = "nexora.settings.v1";

const quickPrompts = [
  {
    title: "Explore any topic",
    text: "Tell me about quantum physics and how it might change our understanding of reality."
  },
  {
    title: "Deep discussion",
    text: "What are the most important philosophical questions humanity should be asking right now?"
  },
  {
    title: "Creative brainstorming",
    text: "Help me brainstorm ideas for a science fiction story about artificial consciousness."
  },
  {
    title: "Learn something new",
    text: "Explain the concept of blockchain technology and its potential applications beyond cryptocurrency."
  }
];

const translations = {
  en: {
    newChat: "New chat",
    searchChats: "Search chats",
    export: "Export",
    settings: "Settings",
    workspace: "Advanced assistant workspace",
    heroText: "Discuss any topic, explore ideas deeply, get creative, write code, research thoroughly, and keep every conversation organized.",
    launchPlan: "Launch plan",
    earnMoney: "Earn money",
    general: "General",
    reason: "Reason",
    search: "Search",
    code: "Code",
    create: "Create",
    brief: "Brief",
    explore: "Explore",
    discuss: "Discuss",
    message: "Message Nexora AI...",
    send: "Send"
  },
  hi: {
    newChat: "Nayi chat",
    searchChats: "Chat khojein",
    export: "Export",
    settings: "Settings",
    workspace: "Advanced assistant workspace",
    heroText: "Koi bhi topic discuss karein, ideas ko deeply explore karein, creative ho jayein, code likhein, research karein, aur har conversation organize rakhein.",
    launchPlan: "Launch plan",
    earnMoney: "Paise kamayein",
    general: "Sāmānya",
    reason: "Soch",
    search: "Search",
    code: "Code",
    create: "Create",
    brief: "Brief",
    explore: "Anveṣaṇ",
    discuss: "Charcha",
    message: "Nexora AI ko message bhejein...",
    send: "Send"
  },
  te: { newChat: "Kotha chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Evarina topic ni discuss cheyandi, ideas ni deeply explore cheyandi, creative avandi, code rayandi, research cheyandi, mariyu prati conversation ni organize cheyandi.", launchPlan: "Launch plan", earnMoney: "Earn money", general: "Sāmānya", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", explore: "Anveṣaṇ", discuss: "Charcha", message: "Nexora AI ki message...", send: "Send" },
  ta: { newChat: "Puthiya chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Eppadiyum topic ah discuss pannungal, ideas ah deeply explore pannungal, creative aavungal, code ezhuthungal, research pannungal, mattum ellam conversation ah organize pannungal.", launchPlan: "Launch plan", earnMoney: "Earn money", general: "Sāmānya", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", explore: "Anveṣaṇ", discuss: "Charcha", message: "Nexora AI ku message...", send: "Send" },
  gu: { newChat: "Navi chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Koi pan topic discuss karo, ideas deeply explore karo, creative bano, code lakh, research karo, ane darek conversation organize rako.", launchPlan: "Launch plan", earnMoney: "Earn money", general: "Sāmānya", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", explore: "Anveṣaṇ", discuss: "Charcha", message: "Nexora AI ne message...", send: "Send" },
  mr: { newChat: "Navi chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Koni topic discuss kara, ideas deeply explore kara, creative vha, code lihi, research kara, ani pratyek conversation organize raha.", launchPlan: "Launch plan", earnMoney: "Earn money", general: "Sāmānya", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", explore: "Anveṣaṇ", discuss: "Charcha", message: "Nexora AI la message...", send: "Send" },
  kn: { newChat: "Hosa chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Yavude topic annu discuss madi, ideas annu deeply explore madi, creative agi, code bari, research madi, mattu ellavu conversation annu organize madi.", launchPlan: "Launch plan", earnMoney: "Earn money", general: "Sāmānya", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", explore: "Anveṣaṇ", discuss: "Charcha", message: "Nexora AI ge message...", send: "Send" },
  ml: { newChat: "Puthiya chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Enta topic um discuss cheyyuka, ideas deeply explore cheyyuka, creative aavuka, code ezhuthuka, research cheyyuka, ellam conversation organize cheyyuka.", launchPlan: "Launch plan", earnMoney: "Earn money", general: "Sāmānya", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", explore: "Anveṣaṇ", discuss: "Charcha", message: "Nexora AI ku message...", send: "Send" }
};

const els = {
  sidebar: document.querySelector("#sidebar"),
  sidebarToggle: document.querySelector("#sidebarToggle"),
  newChatBtn: document.querySelector("#newChatBtn"),
  threadList: document.querySelector("#threadList"),
  threadSearch: document.querySelector("#threadSearch"),
  messages: document.querySelector("#messages"),
  composer: document.querySelector("#composer"),
  promptInput: document.querySelector("#promptInput"),
  sendBtn: document.querySelector("#sendBtn"),
  chatTitle: document.querySelector("#chatTitle"),
  heroPanel: document.querySelector("#heroPanel"),
  quickGrid: document.querySelector("#quickGrid"),
  contextRow: document.querySelector("#contextRow"),
  modeButtons: document.querySelectorAll(".mode-btn"),
  attachBtn: document.querySelector("#attachBtn"),
  voiceBtn: document.querySelector("#voiceBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  settingsBtn: document.querySelector("#settingsBtn"),
  settingsModal: document.querySelector("#settingsModal"),
  providerSelect: document.querySelector("#providerSelect"),
  endpointInput: document.querySelector("#endpointInput"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  apiModelInput: document.querySelector("#apiModelInput"),
  saveSettingsBtn: document.querySelector("#saveSettingsBtn"),
  clearSettingsBtn: document.querySelector("#clearSettingsBtn"),
  statusPill: document.querySelector("#statusPill"),
  modelSelect: document.querySelector("#modelSelect"),
  languageSelect: document.querySelector("#languageSelect"),
  themeGrid: document.querySelector("#themeGrid"),
  launchPlanBtn: document.querySelector("#launchPlanBtn"),
  moneyPlanBtn: document.querySelector("#moneyPlanBtn"),
  messageCount: document.querySelector("#messageCount"),
  tokenEstimate: document.querySelector("#tokenEstimate"),
  sourceCount: document.querySelector("#sourceCount")
};

let state = loadState();
let settings = loadSettings();
let activeMode = "general";
let contextChips = [];
let isGenerating = false;

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey));
    if (saved && saved.threads?.length) return saved;
  } catch {
    localStorage.removeItem(storeKey);
  }

  const firstThread = {
    id: uid(),
    title: "Welcome to Nexora",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      {
        id: uid(),
        role: "assistant",
        mode: "general",
        content: "Hello! I'm here to help with any questions or tasks you have. I can assist with research, writing, coding, analysis, creative projects, and virtually any topic you want to explore. What would you like to work on today?",
        createdAt: Date.now()
      }
    ]
  };

  return { activeThreadId: firstThread.id, threads: [firstThread] };
}

function loadSettings() {
  const defaults = {
    provider: "nexora-cloud",
    endpoint: "",
    apiKey: "",
    apiModel: "",
    modelStyle: "nexora-max",
    language: "en",
    theme: "obsidian"
  };

  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey)) };
  } catch {
    return defaults;
  }
}

function saveState() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function saveSettings() {
  settings.modelStyle = els.modelSelect.value;
  settings.language = els.languageSelect.value;
  localStorage.setItem(settingsKey, JSON.stringify(settings));
  updateStatus();
}

function activeThread() {
  return state.threads.find(thread => thread.id === state.activeThreadId) || state.threads[0];
}

function setActiveThread(id) {
  state.activeThreadId = id;
  saveState();
  render();
}

function createThread(prompt = "") {
  const thread = {
    id: uid(),
    title: prompt ? makeTitle(prompt) : "New chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: []
  };
  state.threads.unshift(thread);
  state.activeThreadId = thread.id;
  saveState();
  render();
  els.promptInput.focus();
}

function makeTitle(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}...` : cleaned || "New chat";
}

function render() {
  applyTheme();
  applyLanguage();
  renderQuickPrompts();
  renderThreads();
  renderMessages();
  renderStats();
  updateStatus();
}

function renderQuickPrompts() {
  els.quickGrid.innerHTML = quickPrompts.map(prompt => `
    <button class="quick-card" data-prompt="${escapeAttr(prompt.text)}">
      <strong>${prompt.title}</strong>
      <span>${prompt.text}</span>
    </button>
  `).join("");
}

function renderThreads() {
  const query = els.threadSearch.value.trim().toLowerCase();
  const threads = state.threads.filter(thread => {
    const haystack = `${thread.title} ${thread.messages.map(message => message.content).join(" ")}`.toLowerCase();
    return haystack.includes(query);
  });

  els.threadList.innerHTML = threads.map(thread => `
    <button class="thread-btn ${thread.id === state.activeThreadId ? "active" : ""}" data-thread="${thread.id}">
      <strong>${escapeHtml(thread.title)}</strong>
      <span>${thread.messages.length} messages · ${formatDate(thread.updatedAt)}</span>
    </button>
  `).join("");
}

function renderMessages() {
  const thread = activeThread();
  els.chatTitle.textContent = thread?.title || "Ask anything";
  const messages = thread?.messages || [];
  els.heroPanel.classList.toggle("hidden", messages.length > 1);

  els.messages.innerHTML = messages.map(message => `
    <article class="message ${message.role}">
      <div class="avatar">${message.role === "assistant" ? "N" : "You".slice(0, 1)}</div>
      <div>
        <div class="message-meta">${message.role === "assistant" ? "Nexora AI" : "You"} · ${message.mode || "chat"} · ${formatTime(message.createdAt)}</div>
        <div class="bubble">${formatMessage(message.content)}</div>
        ${message.role === "assistant" ? assistantActions(message.id) : ""}
      </div>
    </article>
  `).join("");

  els.messages.scrollTop = els.messages.scrollHeight;
}

function assistantActions(id) {
  return `
    <div class="message-actions">
      <button class="mini-btn" data-action="copy" data-message="${id}">Copy</button>
      <button class="mini-btn" data-action="expand" data-message="${id}">Expand</button>
      <button class="mini-btn" data-action="sources" data-message="${id}">Sources</button>
    </div>
  `;
}

function renderStats() {
  const thread = activeThread();
  const messages = thread?.messages || [];
  const words = messages.reduce((sum, message) => sum + message.content.split(/\s+/).filter(Boolean).length, 0);
  const sources = messages.filter(message => /source|research|http|compare|latest/i.test(message.content)).length;
  els.messageCount.textContent = `${messages.length} messages`;
  els.tokenEstimate.textContent = Math.round(words * 1.35).toLocaleString();
  els.sourceCount.textContent = sources;
  els.contextRow.innerHTML = contextChips.map(chip => `<span class="chip">${escapeHtml(chip)}</span>`).join("");
}

function updateStatus() {
  const provider = settings.provider === "offline" ? "Demo AI ready - connect backend for real AI" : `${settings.provider.toUpperCase()} provider configured`;
  els.statusPill.textContent = provider;
}

function applyLanguage() {
  const pack = translations[settings.language] || translations.en;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = pack[node.dataset.i18n] || translations.en[node.dataset.i18n] || node.textContent;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(node => {
    node.placeholder = pack[node.dataset.i18nPlaceholder] || translations.en[node.dataset.i18nPlaceholder] || node.placeholder;
  });
}

function applyTheme() {
  document.body.dataset.theme = settings.theme || "obsidian";
  document.querySelectorAll(".theme-tile").forEach(tile => {
    tile.classList.toggle("active", tile.dataset.theme === document.body.dataset.theme);
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  const prompt = els.promptInput.value.trim();
  if (!prompt || isGenerating) return;

  const thread = activeThread();
  if (!thread) createThread(prompt);
  addMessage("user", prompt, activeMode);
  els.promptInput.value = "";
  autoSizeInput();
  await generateReply(prompt);
}

function addMessage(role, content, mode) {
  const thread = activeThread();
  thread.messages.push({ id: uid(), role, content, mode, createdAt: Date.now() });
  if (thread.messages.filter(message => message.role === "user").length === 1) {
    thread.title = makeTitle(content);
  }
  thread.updatedAt = Date.now();
  saveState();
  render();
}

async function generateReply(prompt) {
  isGenerating = true;
  els.sendBtn.disabled = true;
  const typingId = uid();
  const thread = activeThread();
  thread.messages.push({
    id: typingId,
    role: "assistant",
    mode: activeMode,
    content: "Thinking...",
    createdAt: Date.now()
  });
  render();

  try {
    const answer = settings.provider === "offline"
      ? await offlineNexora(prompt)
      : await providerReply(prompt);
    const target = thread.messages.find(message => message.id === typingId);
    target.content = answer;
  } catch (error) {
    const target = thread.messages.find(message => message.id === typingId);
    target.content = `I could not reach the configured provider, so I stayed local.\n\n${await offlineNexora(prompt)}\n\nProvider note: ${error.message}`;
  } finally {
    thread.updatedAt = Date.now();
    isGenerating = false;
    els.sendBtn.disabled = false;
    saveState();
    render();
  }
}

async function providerReply(prompt) {
  if (settings.provider === "nexora-cloud") {
    return cloudBackendReply(prompt);
  }

  if (!settings.endpoint || !settings.apiKey || !settings.apiModel) {
    throw new Error("Add an endpoint, API key, and model in Settings.");
  }

  const thread = activeThread();
  const messages = thread.messages
    .filter(message => message.content !== "Thinking...")
    .slice(-12)
    .map(message => ({ role: message.role, content: message.content }));

  messages.unshift({
    role: "system",
    content: `You are Nexora AI inside the Nexora app. Be capable, direct, advanced, and practical. Current mode: ${activeMode}.`
  });

  const response = await fetch(settings.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.apiModel,
      messages,
      temperature: activeMode === "creative" ? 0.9 : 0.35
    })
  });

  if (!response.ok) {
    throw new Error(`Provider returned ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || data.output_text || "The provider returned an empty response.";
}

async function cloudBackendReply(prompt) {
  const thread = activeThread();
  const messages = thread.messages
    .filter(message => message.content !== "Thinking...")
    .slice(-12)
    .map(message => ({ role: message.role, content: message.content }));

  let response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      mode: activeMode,
      modelStyle: settings.modelStyle,
      language: settings.language
    })
  });

  if (response.status === 404) {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        mode: activeMode,
        modelStyle: settings.modelStyle,
        language: settings.language
      })
    });
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Nexora backend returned ${response.status}`);
  }

  return data.answer || "Nexora backend returned an empty answer.";
}

async function offlineNexora(prompt) {
  await wait(620 + Math.min(prompt.length * 8, 900));
  const context = contextChips.length ? `\n\nContext I will keep in mind: ${contextChips.join(", ")}.` : "";
  const style = settings.modelStyle.replace("nexora-", "");
  const direct = directAnswer(prompt, style);

  if (direct) {
    return direct + context;
  }

  if (activeMode === "code" || /\b(code|react|javascript|python|css|html|bug|component|api)\b/i.test(prompt)) {
    return codeAnswer(prompt, style) + context;
  }

  if (activeMode === "search" || /\b(research|compare|latest|sources|perplexity|find|market)\b/i.test(prompt)) {
    return researchAnswer(prompt, style) + context;
  }

  if (activeMode === "creative" || /\b(write|brand|story|script|caption|design|name)\b/i.test(prompt)) {
    return creativeAnswer(prompt, style) + context;
  }

  if (activeMode === "brief" || /\b(summarize|brief|short|tl;dr|recap)\b/i.test(prompt)) {
    return briefAnswer(prompt, style) + context;
  }

  if (activeMode === "explore" || /\b(explore|deep|dive|understand|learn|curious)\b/i.test(prompt)) {
    return exploreAnswer(prompt, style) + context;
  }

  if (activeMode === "discuss" || /\b(discuss|debate|opinion|perspective|think|about)\b/i.test(prompt)) {
    return discussAnswer(prompt, style) + context;
  }

  return generalAnswer(prompt, style) + context;
}

function directAnswer(prompt, style) {
  const clean = prompt.trim();
  const lower = clean.toLowerCase();

  if (/^(hi|hello|hey|namaste|hola|yo|hii+)\b/.test(lower)) {
    return `Hello! I'm here to help with anything you need. What would you like to know or discuss?`;
  }

  if (/\b(who are you|what are you|your name)\b/.test(lower)) {
    return `I'm an AI assistant designed to be helpful and informative. I can answer questions, help with tasks, provide explanations, and engage in conversations about virtually any topic. What can I help you with today?`;
  }

  if (/\b(joke|funny|make me laugh)\b/.test(lower)) {
    return `Here's a quick one:\n\nWhy did the developer go broke?\nBecause he used up all his cache!\n\n😄 What topic would you like a joke about?`;
  }

  if (/\b(meaning of|define|what is|explain)\b/.test(lower) && clean.length < 120) {
    const topic = clean.replace(/^(what is|explain|define|meaning of)\s+/i, "").replace(/[?!.]+$/, "");
    return `${topic} refers to a concept, object, or idea. Let me break it down for you:

**What it is**: [Basic definition]
**Why it matters**: [Importance or relevance]
**How it's used**: [Common applications]
**Example**: [Simple illustration]

If you'd like a more detailed explanation or have a specific aspect you'd like me to focus on, just let me know!`;
  }

  if (/^\s*[\d\s+\-*/().%]+\s*$/.test(clean) && /\d/.test(clean)) {
    try {
      const safeExpression = clean.replace(/%/g, "/100");
      const result = Function(`"use strict"; return (${safeExpression})`)();
      if (Number.isFinite(result)) {
        return `The result is **${result}**.`;
      }
    } catch {
      return `I couldn't evaluate that expression. Try something like "12 + 8 * 3" or "25% of 200".`;
    }
  }

  if (/\b(study|exam|homework|learn|school|college|marks)\b/.test(lower)) {
    return `I'd be happy to help with your studies! Here's a practical approach:

**Study Plan for: ${firstSentence(prompt)}**

1. **Start with basics** (20-30 minutes): Get the core concepts down
2. **Active learning**: Take notes in your own words, create mind maps
3. **Practice**: Do 5-10 example problems or questions
4. **Self-test**: Quiz yourself without looking at notes
5. **Review**: Go over mistakes and weak areas

The key is active recall - testing yourself is more effective than just re-reading. What specific topic are you studying?`;
  }

  if (/\b(business|startup|idea|money|earn|income|sell)\b/.test(lower)) {
    return moneyAnswer(style);
  }

  if (/\b(love|friend|family|sad|angry|stress|confused|motivation)\b/.test(lower)) {
    return `I understand you're dealing with some emotional challenges. While I'm here to listen and offer general advice, remember that for serious personal issues, speaking with a trusted friend, family member, or professional counselor can be very helpful.

That said, here are some general strategies that often help:

**When emotions are running high:**
- Take a few deep breaths and give yourself time to process
- Try to identify the specific feeling and what triggered it
- Consider writing down your thoughts to clarify them

**Communication approach:**
- Use "I" statements: "I feel ___ when ___"
- Focus on understanding rather than winning an argument
- Listen actively to the other person's perspective

What specific situation are you facing? I'm here to help you think through it.`;
  }

  if (/\b(doctor|medicine|pain|symptom|legal|lawyer|invest|stock|crypto|loan)\b/.test(lower)) {
    return `I can provide general information and help you think through these topics, but please remember:

**Important disclaimers:**
- For medical concerns: Always consult a healthcare professional for personalized advice
- For legal matters: Speak with a qualified attorney familiar with your jurisdiction
- For financial decisions: Consider your risk tolerance and consult financial advisors

That said, I can help you:
- Understand general concepts and options
- Prepare questions to ask professionals
- Think through pros and cons
- Find reliable sources of information

What specific aspect would you like to explore?`;
  }

  return "";
}

function reasonAnswer(prompt, style) {
  if (/\b(money|earn|pricing|subscription|business|income|revenue)\b/i.test(prompt)) {
    return moneyAnswer(style);
  }

  if (/\b(openai|chatgpt|xai|grok|grook|perplexity|gemini|alexa|siri|model)\b/i.test(prompt)) {
    return gatewayAnswer(style);
  }

  const ask = firstSentence(prompt);
  const actions = buildActionList(prompt);
  return `I understand you're asking about: ${ask}

Here's a logical breakdown:

${actions}

The key insight here is to start with the smallest actionable step that will give you immediate feedback. This approach helps you learn and iterate quickly. What specific aspect would you like me to expand on?`;
}

function gatewayAnswer(style) {
  return `Nexora should use a clean model gateway.\n\nLegal and practical setup:\n- Use official APIs or compatible APIs only.\n- Do not copy another company's logo, name, voice, or interface as your own product identity.\n- Say "connect OpenAI-compatible, xAI-compatible, Gemini-compatible, Perplexity-compatible, or custom models" instead of claiming Nexora contains those products.\n- Siri and Alexa are voice assistant ecosystems, so connect through approved voice/platform APIs rather than pretending to be them.\n\nProduct structure:\n1. Frontend: this Nexora app.\n2. Backend: /api/chat endpoint.\n3. Provider adapters: OpenAI, xAI, Gemini, Perplexity, custom LLM, voice services.\n4. Billing: free trial, Pro plan, Team plan.\n5. Safety: login, rate limits, usage caps, abuse checks.\n\nIn ${style} mode, the premium version should feel original: Nexora branding, Nexora colors, Nexora wording, and a provider selector hidden behind a simple "AI Gateway" control.`;
}

function moneyAnswer(style) {
  return `Simple earning plan for Nexora:\n\n1. Free plan: limited daily messages so people can try it.\n2. Pro plan: monthly subscription for more messages, better models, file tools, and priority speed.\n3. Team plan: shared workspace, admin controls, and higher usage.\n4. Credits: sell extra message credits for heavy users.\n5. Business services: offer custom Nexora setup for schools, shops, creators, and companies.\n\nBefore earning money publicly, add:\n- Backend API so your keys stay private.\n- User login.\n- Payment system such as Stripe, Razorpay, or another legal payment provider in your country.\n- Privacy policy and terms.\n- Usage limits so one person cannot spend all your API budget.\n\nBest first launch: free public demo plus a waitlist for Nexora Pro.`;
}

function researchAnswer(prompt, style) {
  return `Research analysis for: ${firstSentence(prompt)}

Here's a structured approach to evaluating this topic:

| Aspect | Key Questions |
|--------|---------------|
| **Core Answer** | What seems most accurate or useful based on available information? |
| **Evidence** | What sources or data support this conclusion? |
| **Costs & Benefits** | What are the trade-offs in time, money, effort, and risk? |
| **Alternatives** | What other options or perspectives exist? |
| **Next Steps** | What should you do with this information? |

**Recommended approach:**
1. Gather information from 3+ reliable sources
2. Cross-reference claims and eliminate contradictory information
3. Consider your specific context and constraints
4. Make an informed decision based on the strongest evidence

Note: For real-time web research capabilities, you'll need to connect to a backend service with search integration. What specific aspect of this topic would you like me to help you research?`;
}

function codeAnswer(prompt, style) {
  return `Code solution for: ${firstSentence(prompt)}

Here's a practical implementation approach:

\`\`\`javascript
// Example structure - adapt this to your specific needs
const appState = {
  input: "",
  result: null,
  loading: false,
  error: ""
};

function updateState(newState) {
  Object.assign(appState, newState);
  renderUI();
}

async function handleAction() {
  updateState({ loading: true, error: "" });
  try {
    const result = await processData(appState.input);
    updateState({ result, loading: false });
  } catch (error) {
    updateState({ error: error.message, loading: false });
  }
}
\`\`\`

**Key considerations:**
- **Core functionality first**: Get the main feature working before adding bells and whistles
- **Error handling**: Always include proper error states and user feedback
- **Performance**: Consider loading states for async operations
- **User experience**: Keep the interface intuitive and responsive
- **Testing**: Test across different devices and scenarios

What specific programming challenge are you working on? I can provide more targeted code examples.`;
}

function creativeAnswer(prompt, style) {
  return `Creative concept for: ${firstSentence(prompt)}

Here are several approaches you could consider:

**Option 1: Direct & Professional**
"Empowering people to think faster, work smarter, and achieve more."

**Option 2: Conversational & Approachable**
"Ask questions. Get answers. Make progress. Your AI companion for ideas and execution."

**Option 3: Visionary & Inspiring**
"Transforming how we think, create, and connect through intelligent conversation."

**Option 4: Feature-Focused**
"Where ideas become reality. Research, write, code, and collaborate with AI assistance."

I recommend starting with clear, benefit-focused messaging that immediately communicates value. People are more likely to engage with solutions that solve their specific problems. What kind of tone or style are you aiming for with this creative project?`;
}

function briefAnswer(prompt, style) {
  return `**TL;DR:** ${firstSentence(prompt)}

**Key takeaway:** Focus on the one most important action you can take immediately.

**Quick action plan:**
- Define your specific goal clearly
- Identify the biggest obstacle
- Choose one small, concrete step (under 10 minutes)
- Execute it today

This approach cuts through complexity and gets you moving forward quickly. What's your main objective here?`;
}

function generalAnswer(prompt, style) {
  const ask = firstSentence(prompt);
  const actions = buildActionList(prompt);
  return `I understand you're asking about: ${ask}

Here's a comprehensive response that should help:

${actions}

This covers the key aspects of your question. If you'd like me to elaborate on any particular point, provide more details about what you're looking for, or explore related topics, feel free to ask!`;
}

function exploreAnswer(prompt, style) {
  const topic = firstSentence(prompt);
  return `Let's explore: ${topic}

This is a fascinating topic with many dimensions. Here's what we could dive into:

**Core Concepts**: What are the fundamental ideas and principles?
**Historical Context**: How has this developed over time?
**Current Applications**: Where is this used today?
**Future Implications**: What might happen next?
**Related Ideas**: What connects to this topic?

What aspect interests you most? Or would you like me to start with a specific angle? I'm ready to explore as deeply as you'd like.`;
}

function discussAnswer(prompt, style) {
  const topic = firstSentence(prompt);
  return `Let's discuss: ${topic}

This is an interesting topic with multiple perspectives. Here are some key viewpoints to consider:

**Perspective 1:** [One way to look at it]

**Perspective 2:** [Another angle]

**Perspective 3:** [A different consideration]

What are your thoughts on this? Do you agree with any of these viewpoints, or do you see it differently? I'm here to engage in thoughtful discussion on any topic.`;
}

function buildActionList(prompt) {
  const lower = prompt.toLowerCase();

  if (/\b(plan|roadmap|steps|how to)\b/.test(lower)) {
    return `1. Define the final result.\n2. Break it into 3 small stages.\n3. Finish the easiest visible part first.\n4. Test it with one real person.\n5. Improve based on what confused them.`;
  }

  if (/\b(compare|choose|better|best)\b/.test(lower)) {
    return `1. List the options.\n2. Compare price, quality, effort, and risk.\n3. Remove any option that fails your must-have requirement.\n4. Pick the option that is good enough and easiest to maintain.\n5. Review after a short test.`;
  }

  if (/\b(write|message|email|caption|post)\b/.test(lower)) {
    return `1. Start with the main point.\n2. Remove extra words.\n3. Make the tone respectful and confident.\n4. End with a clear action.\n5. Read it once before sending.`;
  }

  return `1. Identify the main problem.\n2. Decide what a good result looks like.\n3. List what you already have.\n4. Find the missing piece.\n5. Take the next smallest useful step.`;
}

function firstSentence(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.split(/[.!?]/)[0].slice(0, 140) || "this request";
}

function formatMessage(text) {
  const escaped = escapeHtml(text);
  const withCode = escaped.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });
  return withCode
    .split(/\n{2,}/)
    .map(block => {
      if (block.startsWith("<pre>")) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(timestamp);
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(timestamp);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function autoSizeInput() {
  els.promptInput.style.height = "auto";
  els.promptInput.style.height = `${Math.min(els.promptInput.scrollHeight, 180)}px`;
}

function exportChat() {
  const thread = activeThread();
  const transcript = thread.messages
    .map(message => `## ${message.role.toUpperCase()} (${message.mode || "chat"})\n${message.content}`)
    .join("\n\n");
  const blob = new Blob([`# ${thread.title}\n\n${transcript}`], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${thread.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "nexora-chat"}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

els.newChatBtn.addEventListener("click", () => createThread());
els.threadSearch.addEventListener("input", renderThreads);
els.composer.addEventListener("submit", handleSubmit);
els.promptInput.addEventListener("input", autoSizeInput);
els.promptInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    els.composer.requestSubmit();
  }
});

els.threadList.addEventListener("click", event => {
  const button = event.target.closest("[data-thread]");
  if (!button) return;
  setActiveThread(button.dataset.thread);
  els.sidebar.classList.remove("open");
});

els.quickGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-prompt]");
  if (!button) return;
  els.promptInput.value = button.dataset.prompt;
  autoSizeInput();
  els.promptInput.focus();
});

els.messages.addEventListener("click", async event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const message = activeThread().messages.find(item => item.id === button.dataset.message);
  if (!message) return;

  if (button.dataset.action === "copy") {
    await navigator.clipboard.writeText(message.content);
    button.textContent = "Copied";
    setTimeout(() => (button.textContent = "Copy"), 900);
  }

  if (button.dataset.action === "expand") {
    els.promptInput.value = `Expand this answer with more practical detail:\n\n${message.content}`;
    autoSizeInput();
    els.promptInput.focus();
  }

  if (button.dataset.action === "sources") {
    els.promptInput.value = `Add a source plan and verification checklist for this answer:\n\n${message.content}`;
    autoSizeInput();
    els.promptInput.focus();
  }
});

els.modeButtons.forEach(button => {
  button.addEventListener("click", () => {
    els.modeButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeMode = button.dataset.mode;
  });
});

els.sidebarToggle.addEventListener("click", () => {
  els.sidebar.classList.toggle("open");
});

els.attachBtn.addEventListener("click", () => {
  const label = prompt("Add a context note for Nexora AI:");
  if (!label) return;
  contextChips.push(label.slice(0, 48));
  renderStats();
});

els.voiceBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    contextChips.push("Voice input unavailable in this browser");
    renderStats();
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = navigator.language || "en-US";
  recognition.onresult = event => {
    els.promptInput.value += `${event.results[0][0].transcript} `;
    autoSizeInput();
  };
  recognition.start();
});

els.exportBtn.addEventListener("click", exportChat);

els.settingsBtn.addEventListener("click", () => {
  els.providerSelect.value = settings.provider;
  els.endpointInput.value = settings.endpoint;
  els.apiKeyInput.value = settings.apiKey;
  els.apiModelInput.value = settings.apiModel;
  els.settingsModal.showModal();
});

els.saveSettingsBtn.addEventListener("click", () => {
  settings.provider = els.providerSelect.value;
  settings.endpoint = els.endpointInput.value.trim();
  settings.apiKey = els.apiKeyInput.value.trim();
  settings.apiModel = els.apiModelInput.value.trim();
  saveSettings();
});

els.clearSettingsBtn.addEventListener("click", () => {
  settings = {
    provider: "nexora-cloud",
    endpoint: "",
    apiKey: "",
    apiModel: "",
    modelStyle: els.modelSelect.value,
    language: els.languageSelect.value,
    theme: settings.theme
  };
  saveSettings();
  els.settingsModal.close();
});

els.providerSelect.addEventListener("change", () => {
  const value = els.providerSelect.value;
  if (value === "nexora-cloud") {
    els.endpointInput.value = "";
    els.apiKeyInput.value = "";
    els.apiModelInput.value = "";
    els.endpointInput.placeholder = "Uses /api/chat on your Netlify backend";
    return;
  }
  if (value === "openai" && !els.endpointInput.value) els.endpointInput.value = "https://api.openai.com/v1/chat/completions";
  if (value === "xai" && !els.endpointInput.value) els.endpointInput.value = "https://api.x.ai/v1/chat/completions";
  if (value === "perplexity" && !els.endpointInput.value) els.endpointInput.value = "https://api.perplexity.ai/chat/completions";
  if (value === "gemini" && !els.endpointInput.value) els.endpointInput.placeholder = "Use your backend Gemini adapter endpoint";
  if (value === "voice" && !els.endpointInput.value) els.endpointInput.placeholder = "Use your backend voice assistant adapter endpoint";
});

els.modelSelect.value = settings.modelStyle;
els.modelSelect.addEventListener("change", saveSettings);
els.languageSelect.value = settings.language;
els.languageSelect.addEventListener("change", saveSettings);

els.themeGrid.addEventListener("click", event => {
  const tile = event.target.closest("[data-theme]");
  if (!tile) return;
  settings.theme = tile.dataset.theme;
  saveSettings();
  applyTheme();
});

els.launchPlanBtn.addEventListener("click", () => {
  els.promptInput.value = "Create a simple launch plan for Nexora AI so the world can use it safely and legally.";
  autoSizeInput();
  els.promptInput.focus();
});

els.moneyPlanBtn.addEventListener("click", () => {
  els.promptInput.value = "Create a simple money plan for Nexora AI with free, pro, and team plans.";
  autoSizeInput();
  els.promptInput.focus();
});

render();
