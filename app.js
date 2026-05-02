const storeKey = "nexora.state.v1";
const settingsKey = "nexora.settings.v1";

const quickPrompts = [
  {
    title: "Research a decision",
    text: "Compare three laptops for app development under a realistic budget."
  },
  {
    title: "Build a plan",
    text: "Create a 30-day roadmap to launch a polished AI chatbot product."
  },
  {
    title: "Write better",
    text: "Rewrite this message so it sounds confident, concise, and professional."
  },
  {
    title: "Code with me",
    text: "Design a React component for a responsive chat composer with attachments."
  }
];

const translations = {
  en: {
    newChat: "New chat",
    searchChats: "Search chats",
    export: "Export",
    settings: "Settings",
    workspace: "Advanced assistant workspace",
    heroText: "Plan, research, write, summarize, code, compare ideas, and keep every conversation organized.",
    launchPlan: "Launch plan",
    earnMoney: "Earn money",
    reason: "Reason",
    search: "Search",
    code: "Code",
    create: "Create",
    brief: "Brief",
    message: "Message Nexora AI...",
    send: "Send"
  },
  hi: {
    newChat: "Nayi chat",
    searchChats: "Chat khojein",
    export: "Export",
    settings: "Settings",
    workspace: "Advanced assistant workspace",
    heroText: "Plan, research, writing, summary, coding aur ideas ko ek jagah organize karein.",
    launchPlan: "Launch plan",
    earnMoney: "Paise kamayein",
    reason: "Soch",
    search: "Search",
    code: "Code",
    create: "Create",
    brief: "Brief",
    message: "Nexora AI ko message bhejein...",
    send: "Send"
  },
  te: { newChat: "Kotha chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Planning, research, writing, coding mariyu ideas ni organize cheyandi.", launchPlan: "Launch plan", earnMoney: "Earn money", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", message: "Nexora AI ki message...", send: "Send" },
  ta: { newChat: "Puthiya chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Plan, research, write, summarize, code matrum ideas organize seiyungal.", launchPlan: "Launch plan", earnMoney: "Earn money", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", message: "Nexora AI ku message...", send: "Send" },
  gu: { newChat: "Navi chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Plan, research, writing, summary, coding ane ideas organize karo.", launchPlan: "Launch plan", earnMoney: "Earn money", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", message: "Nexora AI ne message...", send: "Send" },
  mr: { newChat: "Navi chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Plan, research, writing, summary, coding ani ideas organize kara.", launchPlan: "Launch plan", earnMoney: "Earn money", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", message: "Nexora AI la message...", send: "Send" },
  kn: { newChat: "Hosa chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Plan, research, writing, summary, coding mattu ideas organize madi.", launchPlan: "Launch plan", earnMoney: "Earn money", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", message: "Nexora AI ge message...", send: "Send" },
  ml: { newChat: "Puthiya chat", searchChats: "Chat search", export: "Export", settings: "Settings", workspace: "Advanced assistant workspace", heroText: "Plan, research, writing, summary, coding, ideas organize cheyyuka.", launchPlan: "Launch plan", earnMoney: "Earn money", reason: "Reason", search: "Search", code: "Code", create: "Create", brief: "Brief", message: "Nexora AI ku message...", send: "Send" }
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
let activeMode = "reason";
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
        mode: "reason",
        content: "Hi, I am Nexora AI. I can help you reason through ideas, draft content, write code, summarize material, and organize research. Ask me anything or pick a starter prompt.",
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

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      mode: activeMode,
      modelStyle: settings.modelStyle,
      language: settings.language
    })
  });

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

  return reasonAnswer(prompt, style) + context;
}

function directAnswer(prompt, style) {
  const clean = prompt.trim();
  const lower = clean.toLowerCase();

  if (/^(hi|hello|hey|namaste|hola|yo|hii+)\b/.test(lower)) {
    return `Hey, I am Nexora AI. Ask me something specific and I will help directly.\n\nTry one of these:\n- "Make a study plan for my exam"\n- "Explain photosynthesis simply"\n- "Write an Instagram caption"\n- "Help me choose a laptop"\n- "Create a business idea for students"`;
  }

  if (/\b(who are you|what are you|your name)\b/.test(lower)) {
    return `I am Nexora AI, your assistant inside the Nexora app. I can help with writing, study, planning, coding, ideas, summaries, and decisions.\n\nRight now I am using Nexora's local demo brain. For real advanced AI like a production assistant, connect Nexora to a backend AI provider.`;
  }

  if (/\b(joke|funny|make me laugh)\b/.test(lower)) {
    return `Here is one:\n\nWhy did the developer open a bakery?\nBecause they wanted better cookies.\n\nOkay, small smile only. Give me a topic and I can make the next one funnier.`;
  }

  if (/\b(meaning of|define|what is|explain)\b/.test(lower) && clean.length < 120) {
    const topic = clean.replace(/^(what is|explain|define|meaning of)\s+/i, "").replace(/[?!.]+$/, "");
    return `Simple explanation of ${topic}:\n\n${topic} means a thing, idea, or process you are asking about. The easiest way to understand it is to break it into:\n\n1. What it is.\n2. Why it matters.\n3. Where people use it.\n4. One simple example.\n\nAsk me "explain ${topic} like I am 10" and I will make it even simpler.`;
  }

  if (/^\s*[\d\s+\-*/().%]+\s*$/.test(clean) && /\d/.test(clean)) {
    try {
      const safeExpression = clean.replace(/%/g, "/100");
      const result = Function(`"use strict"; return (${safeExpression})`)();
      if (Number.isFinite(result)) {
        return `Answer: ${result}\n\nI calculated the expression you typed.`;
      }
    } catch {
      return `I tried to calculate that, but the expression is not clear. Try something like:\n\n12 + 8 * 3`;
    }
  }

  if (/\b(study|exam|homework|learn|school|college|marks)\b/.test(lower)) {
    return `Here is a simple study plan for this:\n\nTopic: ${firstSentence(prompt)}\n\n1. Spend 20 minutes understanding the basics.\n2. Write short notes in your own words.\n3. Practice 5 questions.\n4. Check mistakes immediately.\n5. Revise again tomorrow for 10 minutes.\n\nBest method: do not only read. Test yourself, because recall is what improves marks.`;
  }

  if (/\b(business|startup|idea|money|earn|income|sell)\b/.test(lower)) {
    return moneyAnswer(style);
  }

  if (/\b(love|friend|family|sad|angry|stress|confused|motivation)\b/.test(lower)) {
    return `I hear you. For this kind of situation, do this calmly:\n\n1. Name the exact problem in one sentence.\n2. Do not react immediately if emotions are high.\n3. Talk to the person with one clear sentence: "I feel ___ because ___."\n4. Ask what outcome you both want.\n5. If it is serious or unsafe, speak to a trusted person nearby.\n\nIf you tell me what happened, I can help you write the exact message to send.`;
  }

  if (/\b(doctor|medicine|pain|symptom|legal|lawyer|invest|stock|crypto|loan)\b/.test(lower)) {
    return `I can help you think through this, but this may need expert advice.\n\nFor safety:\n- Medical problems: speak to a doctor or local emergency service if urgent.\n- Legal problems: speak to a qualified lawyer.\n- Money/investing: avoid rushing and check risk carefully.\n\nWhat I can do now: help you list the facts, questions to ask an expert, and safer next steps.`;
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
  return `I understand the request as: ${ask}\n\nHere is a useful answer:\n\n${actions}\n\nMy recommendation in ${style} mode: choose the smallest step that gives a visible result, do it first, then improve. If you want, ask a follow-up like "make it simpler", "make it detailed", or "turn this into a checklist".`;
}

function gatewayAnswer(style) {
  return `Nexora should use a clean model gateway.\n\nLegal and practical setup:\n- Use official APIs or compatible APIs only.\n- Do not copy another company's logo, name, voice, or interface as your own product identity.\n- Say "connect OpenAI-compatible, xAI-compatible, Gemini-compatible, Perplexity-compatible, or custom models" instead of claiming Nexora contains those products.\n- Siri and Alexa are voice assistant ecosystems, so connect through approved voice/platform APIs rather than pretending to be them.\n\nProduct structure:\n1. Frontend: this Nexora app.\n2. Backend: /api/chat endpoint.\n3. Provider adapters: OpenAI, xAI, Gemini, Perplexity, custom LLM, voice services.\n4. Billing: free trial, Pro plan, Team plan.\n5. Safety: login, rate limits, usage caps, abuse checks.\n\nIn ${style} mode, the premium version should feel original: Nexora branding, Nexora colors, Nexora wording, and a provider selector hidden behind a simple "AI Gateway" control.`;
}

function moneyAnswer(style) {
  return `Simple earning plan for Nexora:\n\n1. Free plan: limited daily messages so people can try it.\n2. Pro plan: monthly subscription for more messages, better models, file tools, and priority speed.\n3. Team plan: shared workspace, admin controls, and higher usage.\n4. Credits: sell extra message credits for heavy users.\n5. Business services: offer custom Nexora setup for schools, shops, creators, and companies.\n\nBefore earning money publicly, add:\n- Backend API so your keys stay private.\n- User login.\n- Payment system such as Stripe, Razorpay, or another legal payment provider in your country.\n- Privacy policy and terms.\n- Usage limits so one person cannot spend all your API budget.\n\nBest first launch: free public demo plus a waitlist for Nexora Pro.`;
}

function researchAnswer(prompt, style) {
  return `Research mode for: ${firstSentence(prompt)}\n\nI would compare it like this:\n\n| Area | What to check |\n| --- | --- |\n| Main answer | What is most likely true or useful? |\n| Evidence | What source or proof supports it? |\n| Cost | Time, money, effort, and risk |\n| Alternatives | What are the other choices? |\n| Final decision | What should you do next? |\n\nBest next step: collect 3 reliable sources, remove weak claims, then make a short conclusion.\n\nNote: this local version cannot browse live websites. For real Perplexity-style live research, Nexora needs the backend AI/search connection.`;
}

function codeAnswer(prompt, style) {
  return `Code help for: ${firstSentence(prompt)}\n\nUse this structure:\n\n\`\`\`js\nconst appState = {\n  input: "",\n  result: null,\n  loading: false,\n  error: ""\n};\n\nfunction setState(nextState) {\n  Object.assign(appState, nextState);\n  render();\n}\n\nasync function handleAction() {\n  setState({ loading: true, error: "" });\n  try {\n    const result = await runLogic(appState.input);\n    setState({ result });\n  } catch (error) {\n    setState({ error: error.message });\n  } finally {\n    setState({ loading: false });\n  }\n}\n\`\`\`\n\nChecklist:\n- Make the main feature work first.\n- Add loading and error states.\n- Save important data.\n- Test on mobile.\n- Keep the UI simple enough that users understand it instantly.`;
}

function creativeAnswer(prompt, style) {
  return `Creative draft for: ${firstSentence(prompt)}\n\nOption 1: Premium and direct\n"Built for people who want faster answers, clearer ideas, and better work."\n\nOption 2: Friendly and simple\n"Ask. Understand. Create. Nexora helps you move from question to result."\n\nOption 3: Futuristic\n"Your intelligent workspace for ideas, research, code, and decisions."\n\nMy pick: use simple words with a premium visual style. People trust products that are clear more than products that sound complicated.`;
}

function briefAnswer(prompt, style) {
  return `Short answer:\n\n${firstSentence(prompt)}\n\nBest next move: decide the exact result you want, then take one small action toward it today.\n\nSimple checklist:\n- What is the goal?\n- What is blocking it?\n- What can be done in 10 minutes?\n- What needs help, tools, or money?\n\nThat gives you clarity fast.`;
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
