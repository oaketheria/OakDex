const MOODS = ["idle", "happy", "thinking", "alert", "sleepy"];
const SKINS = ["normal", "shiny", "tech", "night"];
const MODES = ["library", "emulator", "pokedex", "system-alert"];
const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const OAKBIT_HIDDEN_KEY = "oakbitHidden";
const OAKBIT_MUTED_KEY = "oakbitMuted";
const OAKBIT_SKIN_KEY = "oakbitSkin";
const OAKBIT_MODEL_KEY = "oakbitModel";
const OAKBIT_SECRET_KEY = "oakbitSecretUnlocked";
const OAKBIT_ENERGY_KEY = "oakbitEnergy";
const OAKBIT_CONTEXT_KEY = "oakbitContext";
const OAKBIT_TUTORIAL_DONE_KEY = "oakbitTutorialDone";
const LOCALE_KEY = "oak-rom-locale";

const REPEAT_WINDOW_MS = 5200;
const EVENT_REPEAT_WINDOW_MS = 1800;
const PRIORITY_HOLD_MS = 2800;

const DEFAULT_LINES = {
  pt: {
    idle: "OakBit online.",
    happy: "Biblioteca pronta.",
    thinking: "Escaneando biblioteca...",
    alert: "Atencao ao modulo.",
    sleepy: "Modo descanso ativado.",
  },
  en: {
    idle: "OakBit online.",
    happy: "Library ready.",
    thinking: "Scanning library...",
    alert: "Module warning.",
    sleepy: "Rest mode enabled.",
  },
};

const MESSAGE_PRIORITY = {
  idle: 0,
  info: 1,
  action: 2,
  error: 3,
};

const EVENT_MESSAGES = {
  "boot-ready": { mood: "happy", priority: "info", pt: "Biblioteca pronta.", en: "Library ready." },
  "upload-hover": { mood: "happy", priority: "info", pt: "Tenho espaco para mais uma aventura.", en: "I have room for another adventure." },
  "empty-library": { mood: "thinking", priority: "info", pt: "Sua biblioteca local esta vazia. Vamos adicionar uma ROM?", en: "Your local library is empty. Add a ROM?" },
  "recent-ready": { mood: "happy", priority: "info", pt: "Seu ultimo jogo esta te esperando.", en: "Your last game is waiting." },
  "filter-change": { mood: "thinking", priority: "info", pt: "Filtro ajustado. Escaneando capas.", en: "Filter adjusted. Scanning covers." },
  "rom-imported": { mood: "happy", priority: "action", pt: ({ system }) => `${system || "ROM"} identificado.`, en: ({ system }) => `${system || "ROM"} identified.` },
  "ps1-bios-needed": { mood: "alert", priority: "error", pt: "PS1 precisa de BIOS para ligar esse modulo.", en: "PS1 needs a BIOS to power this module." },
  "invalid-file": { mood: "alert", priority: "error", pt: "Esse cartucho nao encaixa aqui.", en: "This cartridge does not fit here." },
  "emulator-loading": { mood: "thinking", priority: "action", pt: "Conectando cabos...", en: "Connecting cables..." },
  "emulator-ready": { mood: "happy", priority: "action", pt: "Sistema online.", en: "System online." },
  "emulator-core-error": { mood: "alert", priority: "error", pt: "Core nao respondeu.", en: "Core did not respond." },
  "pokedex-available": { mood: "happy", priority: "info", pt: "Pokedex disponivel.", en: "Pokedex available." },
  "pokedex-open": { mood: "thinking", priority: "action", pt: "Modo pesquisa ativado.", en: "Research mode enabled." },
  "pokedex-search": { mood: "thinking", priority: "info", pt: "Escaneando dados.", en: "Scanning data." },
  "pokedex-selected": { mood: "happy", priority: "info", pt: ({ pokemon }) => pokemon ? `${pokemon} localizado.` : "Registro localizado.", en: ({ pokemon }) => pokemon ? `${pokemon} located.` : "Record located." },
  "pokedex-not-found": { mood: "alert", priority: "error", pt: "Nada nos arquivos.", en: "Nothing in the files." },
  "pokedex-cry": { mood: "happy", priority: "action", pt: "Sinal sonoro detectado.", en: "Audio signal detected." },
  "pokedex-cry-missing": { mood: "alert", priority: "error", pt: "Sem audio registrado para esse alvo.", en: "No audio registered for this target." },
  "pokedex-tab": { mood: "thinking", priority: "info", pt: "Mudando painel de dados.", en: "Switching data panel." },
  "pokedex-narration": { mood: "happy", priority: "action", pt: "Narrando registro.", en: "Narrating record." },
  "voice-listening": { mood: "thinking", priority: "action", pt: "Estou ouvindo.", en: "Listening." },
  "voice-result": { mood: "happy", priority: "action", pt: "Comando de voz recebido.", en: "Voice command received." },
  "voice-error": { mood: "alert", priority: "error", pt: "Nao consegui ouvir o comando.", en: "I could not hear the command." },
  "rom-removed": { mood: "alert", priority: "action", pt: "Cartucho removido da estante.", en: "Cartridge removed from the shelf." },
  "cover-updated": { mood: "happy", priority: "action", pt: "Nova capa registrada.", en: "New cover registered." },
  "metadata-updated": { mood: "happy", priority: "action", pt: "Ficha da ROM atualizada.", en: "ROM file updated." },
  "backup-exported": { mood: "happy", priority: "action", pt: "Backup de metadados pronto.", en: "Metadata backup ready." },
  "backup-imported": { mood: "happy", priority: "action", pt: "Biblioteca restaurada.", en: "Library restored." },
  "cleanup-done": { mood: "alert", priority: "action", pt: "Limpeza concluida.", en: "Cleanup complete." },
  "bulk-imported": { mood: "happy", priority: "action", pt: "Lote catalogado.", en: "Batch cataloged." },
  "save-imported": { mood: "happy", priority: "action", pt: "Save enviado para o core.", en: "Save sent to the core." },
  "save-exported": { mood: "happy", priority: "action", pt: "Save protegido.", en: "Save protected." },
  "save-loaded": { mood: "happy", priority: "action", pt: "Save reaplicado.", en: "Save reapplied." },
  "save-removed": { mood: "alert", priority: "action", pt: "Save removido.", en: "Save removed." },
  "save-error": { mood: "alert", priority: "error", pt: "Esse save nao encaixou.", en: "This save did not fit." },
  "session-restored": { mood: "happy", priority: "action", pt: "Sessao restaurada.", en: "Session restored." },
  "core-menu": { mood: "thinking", priority: "info", pt: "Menu do core aberto.", en: "Core menu opened." },
  "history-cleared": { mood: "alert", priority: "action", pt: "Historico limpo.", en: "History cleared." },
  favorite: { mood: "happy", priority: "action", pt: "Favorito registrado.", en: "Favorite registered." },
};

const MODE_EVENT_MAP = {
  "boot-ready": "library",
  "upload-hover": "library",
  "empty-library": "library",
  "recent-ready": "library",
  "filter-change": "library",
  "rom-imported": "library",
  "rom-removed": "library",
  "cover-updated": "library",
  "metadata-updated": "library",
  "backup-exported": "library",
  "backup-imported": "library",
  "cleanup-done": "library",
  "bulk-imported": "library",
  "emulator-loading": "emulator",
  "emulator-ready": "emulator",
  "session-restored": "emulator",
  "core-menu": "emulator",
  "save-imported": "emulator",
  "save-exported": "emulator",
  "save-loaded": "emulator",
  "save-removed": "emulator",
  favorite: "emulator",
  "pokedex-available": "pokedex",
  "pokedex-open": "pokedex",
  "pokedex-search": "pokedex",
  "pokedex-selected": "pokedex",
  "pokedex-cry": "pokedex",
  "pokedex-tab": "pokedex",
  "pokedex-narration": "pokedex",
  "voice-listening": "pokedex",
  "voice-result": "pokedex",
  "ps1-bios-needed": "system-alert",
  "invalid-file": "system-alert",
  "emulator-core-error": "system-alert",
  "pokedex-not-found": "system-alert",
  "pokedex-cry-missing": "system-alert",
  "voice-error": "system-alert",
  "save-error": "system-alert",
};

const ENERGY_EVENTS = {
  "boot-ready": 4,
  "rom-imported": 14,
  "emulator-loading": 3,
  "emulator-ready": 10,
  "pokedex-available": 5,
  "pokedex-open": 4,
  "pokedex-selected": 5,
  "pokedex-cry": 7,
  "voice-result": 5,
  "cover-updated": 8,
  "metadata-updated": 6,
  "backup-exported": 6,
  "backup-imported": 8,
  "bulk-imported": 12,
  "save-imported": 6,
  "save-exported": 6,
  "save-loaded": 5,
  "session-restored": 8,
  favorite: 10,
  "ps1-bios-needed": -8,
  "invalid-file": -10,
  "emulator-core-error": -12,
  "pokedex-not-found": -5,
  "pokedex-cry-missing": -4,
  "voice-error": -5,
  "save-error": -7,
  "cleanup-done": -4,
};

let root = null;
let bubble = null;
let restoreButton = null;
let tutorialOverlay = null;
let tutorialSpotlight = null;
let tutorialCard = null;
let tutorialSteps = [];
let tutorialIndex = 0;
let hideTimer = null;
let idleTimer = null;
let effectTimer = null;
let moodIndex = 0;
let originalParent = null;
let originalNextSibling = null;
let lastMessage = "";
let lastMessageAt = 0;
let lastPriority = MESSAGE_PRIORITY.idle;
let lastPriorityAt = 0;
const lastEventAt = new Map();
let hidden = localStorage.getItem(OAKBIT_HIDDEN_KEY) === "1";
let muted = localStorage.getItem(OAKBIT_MUTED_KEY) === "1";
let secretUnlocked = localStorage.getItem(OAKBIT_SECRET_KEY) === "1";
let skin = localStorage.getItem(OAKBIT_SKIN_KEY) || "normal";
let modelMode = localStorage.getItem(OAKBIT_MODEL_KEY) || "pixel";
let energy = Number(localStorage.getItem(OAKBIT_ENERGY_KEY) || 42);
let context = loadContext();
let mode = context.mode || "library";
let konamiIndex = 0;

if (!SKINS.includes(skin) && !(secretUnlocked && skin === "secret")) {
  skin = "normal";
}

if (modelMode !== "pixel" && modelMode !== "3d") {
  modelMode = "pixel";
}

if (!Number.isFinite(energy)) {
  energy = 42;
}

function loadContext() {
  try {
    const saved = JSON.parse(localStorage.getItem(OAKBIT_CONTEXT_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    return {};
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function syncEnergy() {
  energy = clamp(Math.round(energy), 0, 100);
  localStorage.setItem(OAKBIT_ENERGY_KEY, String(energy));
  root?.style.setProperty("--oakbit-energy", `${energy}%`);
  root?.setAttribute("data-energy", energy < 28 ? "low" : energy > 74 ? "high" : "normal");
}

function addEnergy(delta = 0) {
  energy += Number(delta) || 0;
  syncEnergy();
  if (delta > 0) {
    spark();
  }
}

function setContext(nextContext = {}) {
  context = {
    ...context,
    ...Object.fromEntries(Object.entries(nextContext).filter(([, value]) => value !== undefined && value !== null && value !== "")),
    updatedAt: Date.now(),
  };

  localStorage.setItem(OAKBIT_CONTEXT_KEY, JSON.stringify(context));
}

function setMode(nextMode = "library", announce = false) {
  mode = MODES.includes(nextMode) ? nextMode : "library";
  root?.setAttribute("data-mode", mode);
  setContext({ mode });

  if (announce) {
    const locale = getLocale();
    const labels = locale === "pt"
      ? {
          library: "Modo biblioteca.",
          emulator: "Modo emulador.",
          pokedex: "Modo pesquisa.",
          "system-alert": "Modo alerta.",
        }
      : {
          library: "Library mode.",
          emulator: "Emulator mode.",
          pokedex: "Research mode.",
          "system-alert": "Alert mode.",
        };
    say(labels[mode] || labels.library, mode === "system-alert" ? "alert" : "thinking", 2400, "info");
  }
}

function getContextLine(kind = "ready") {
  const locale = getLocale();
  const title = context.title || context.game || "";
  const system = context.system || "";

  if (locale === "pt") {
    if (kind === "loading") {
      return title ? `Preparando ${title}.` : "Preparando modulo.";
    }
    if (kind === "restored") {
      return title ? `${title} voltou para a bancada.` : "Sessao retomada.";
    }
    if (kind === "pokedex" && title) {
      return `Pokedex pronta para ${title}.`;
    }
    return title ? `${title} online${system ? ` no ${system}` : ""}.` : "Sistema online.";
  }

  if (kind === "loading") {
    return title ? `Preparing ${title}.` : "Preparing module.";
  }
  if (kind === "restored") {
    return title ? `${title} is back on deck.` : "Session restored.";
  }
  if (kind === "pokedex" && title) {
    return `Pokedex ready for ${title}.`;
  }
  return title ? `${title} online${system ? ` on ${system}` : ""}.` : "System online.";
}

function getLocale() {
  const saved = localStorage.getItem(LOCALE_KEY);
  if (saved === "pt" || saved === "en") {
    return saved;
  }

  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function getDefaultLine(mood = "idle") {
  const locale = getLocale();
  if (mood === "sleepy" && mode === "emulator") {
    return locale === "pt" ? "Jogo em espera." : "Game on standby.";
  }
  if (mood === "sleepy" && mode === "pokedex") {
    return locale === "pt" ? "Scanner em repouso." : "Scanner resting.";
  }
  if (mood === "sleepy" && mode === "library") {
    return locale === "pt" ? "Estante em repouso." : "Shelf resting.";
  }

  return DEFAULT_LINES[locale]?.[mood] || DEFAULT_LINES.pt[mood] || DEFAULT_LINES.pt.idle;
}

function getEventMessage(eventName, detail = {}) {
  const entry = EVENT_MESSAGES[eventName];
  if (!entry) {
    return { message: getDefaultLine("idle"), mood: "idle", priority: MESSAGE_PRIORITY.idle };
  }

  const locale = getLocale();
  const template = entry[locale] || entry.pt || entry.en;
  const message = typeof template === "function" ? template(detail) : template;
  return {
    message,
    mood: entry.mood || "idle",
    priority: MESSAGE_PRIORITY[entry.priority] ?? MESSAGE_PRIORITY.info,
  };
}

function clearHideTimer() {
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function setEffect(effect = "") {
  if (!root) {
    return;
  }

  if (effectTimer) {
    window.clearTimeout(effectTimer);
    effectTimer = null;
  }

  root.dataset.effect = effect;

  if (effect) {
    const durations = {
      listening: 5200,
      fullscreen: 1400,
      "pokedex-scan": 1800,
      transfer: 1800,
    };
    effectTimer = window.setTimeout(() => {
      root.dataset.effect = "";
      effectTimer = null;
    }, durations[effect] || 1800);
  }
}

function scheduleIdle() {
  if (idleTimer) {
    window.clearTimeout(idleTimer);
  }

  idleTimer = window.setTimeout(() => {
    say(getDefaultLine("sleepy"), "sleepy", 3600, "idle");
  }, 28000);
}

function setMood(mood = "idle") {
  if (!root) {
    return;
  }

  root.dataset.mood = MOODS.includes(mood) ? mood : "idle";
}

function say(message, mood = "idle", duration = 4200, priorityName = "info") {
  if (!root || !bubble || !message || hidden || muted) {
    return;
  }

  const now = Date.now();
  const priority = MESSAGE_PRIORITY[priorityName] ?? MESSAGE_PRIORITY.info;
  if (priority < lastPriority && now - lastPriorityAt < PRIORITY_HOLD_MS) {
    return;
  }

  if (message === lastMessage && now - lastMessageAt < REPEAT_WINDOW_MS) {
    return;
  }

  lastMessage = message;
  lastMessageAt = now;
  lastPriority = priority;
  lastPriorityAt = now;
  clearHideTimer();
  setMood(mood);
  if (!["listening", "sound"].includes(root.dataset.effect)) {
    setEffect(mood === "thinking" ? "scan" : mood === "alert" ? "error" : "speaking");
  }
  bubble.textContent = message;
  root.classList.add("is-speaking");
  scheduleIdle();

  hideTimer = window.setTimeout(() => {
    root.classList.remove("is-speaking");
    setMood("idle");
    if (root.dataset.effect === "speaking") {
      root.dataset.effect = "";
    }
    lastPriority = MESSAGE_PRIORITY.idle;
  }, duration);
}

function react(eventName, detail = {}) {
  const now = Date.now();
  const lastEvent = lastEventAt.get(eventName) || 0;
  if (now - lastEvent < EVENT_REPEAT_WINDOW_MS) {
    return;
  }
  lastEventAt.set(eventName, now);

  const normalizedDetail = {
    ...detail,
    system: detail.system ? String(detail.system).toUpperCase() : "",
  };
  if (MODE_EVENT_MAP[eventName]) {
    setMode(MODE_EVENT_MAP[eventName]);
  }

  if (detail.title || detail.game || detail.system) {
    setContext({
      title: detail.title || detail.game,
      system: normalizedDetail.system || detail.system,
      supportsPokedex: detail.supportsPokedex,
    });
  }

  addEnergy(ENERGY_EVENTS[eventName] || 0);

  let { message, mood, priority } = getEventMessage(eventName, normalizedDetail);
  if (eventName === "emulator-loading") {
    message = getContextLine("loading");
  } else if (eventName === "emulator-ready") {
    message = getContextLine("ready");
  } else if (eventName === "session-restored") {
    message = getContextLine("restored");
  } else if (eventName === "pokedex-available" && context.title) {
    message = getContextLine("pokedex");
  }

  if (eventName === "voice-listening") {
    setEffect("listening");
  } else if (eventName === "pokedex-cry") {
    setEffect("sound");
  }

  const priorityName = Object.keys(MESSAGE_PRIORITY).find((key) => MESSAGE_PRIORITY[key] === priority) || "info";
  say(message, mood, 4200, priorityName);
}

function cycleMood() {
  moodIndex = (moodIndex + 1) % MOODS.length;
  const mood = MOODS[moodIndex];
  say(getDefaultLine(mood), mood, 3200, "action");
}

function setMenuOpen(open) {
  if (!root) {
    return;
  }

  root.classList.toggle("is-menu-open", Boolean(open));
}

function toggleMenu() {
  if (!root || hidden) {
    return;
  }

  setMenuOpen(!root.classList.contains("is-menu-open"));
}

function hide() {
  if (!root) {
    return;
  }

  hidden = true;
  localStorage.setItem(OAKBIT_HIDDEN_KEY, "1");
  root.classList.add("is-hidden");
  setMenuOpen(false);
  restoreButton?.removeAttribute("hidden");
  root.classList.remove("is-speaking");
}

function show() {
  if (!root) {
    return;
  }

  hidden = false;
  localStorage.removeItem(OAKBIT_HIDDEN_KEY);
  root.classList.remove("is-hidden");
  restoreButton?.setAttribute("hidden", "");
  if (muted) {
    setMood("happy");
  } else {
    say("OakBit online.", "happy", 2600, "action");
  }
}

function toggle() {
  if (hidden) {
    show();
  } else {
    hide();
  }
}

function spark() {
  if (!root || hidden) {
    return;
  }

  root.classList.remove("is-sparking");
  void root.offsetWidth;
  root.classList.add("is-sparking");
}

function listen(active = true) {
  setEffect(active ? "listening" : "");
}

function setMuted(nextMuted = true) {
  muted = Boolean(nextMuted);

  if (muted) {
    localStorage.setItem(OAKBIT_MUTED_KEY, "1");
    root?.classList.remove("is-speaking");
  } else {
    localStorage.removeItem(OAKBIT_MUTED_KEY);
    say(getLocale() === "pt" ? "Voz reativada." : "Voice enabled.", "happy", 2400, "action");
  }

  root?.classList.toggle("is-muted", muted);
  updateMenuLabels();
}

function toggleMuted() {
  setMuted(!muted);
}

function isHidden() {
  return hidden;
}

function isMuted() {
  return muted;
}

function getAvailableSkins() {
  return secretUnlocked ? [...SKINS, "secret"] : [...SKINS];
}

function setSkin(nextSkin = "normal") {
  const availableSkins = getAvailableSkins();
  skin = availableSkins.includes(nextSkin) ? nextSkin : "normal";
  localStorage.setItem(OAKBIT_SKIN_KEY, skin);
  root?.setAttribute("data-skin", skin);

  updateMenuLabels();
}

function getSkin() {
  return skin;
}

function getModelMode() {
  return modelMode;
}

function getMode() {
  return mode;
}

function getEnergy() {
  return energy;
}

function setModelMode(nextMode = "pixel") {
  const requestedMode = nextMode === "3d" ? "3d" : "pixel";

  if (requestedMode === "3d" && document.fullscreenElement) {
    modelMode = "pixel";
    localStorage.setItem(OAKBIT_MODEL_KEY, modelMode);
    root?.setAttribute("data-model", modelMode);
    window.OakBit3D?.stop?.();
    updateMenuLabels();
    say(getLocale() === "pt" ? "Modelo 3D pausado em tela cheia." : "3D model paused in fullscreen.", "thinking", 2800, "info");
    return Promise.resolve();
  }

  if (requestedMode === "pixel") {
    modelMode = "pixel";
    localStorage.setItem(OAKBIT_MODEL_KEY, modelMode);
    root?.setAttribute("data-model", modelMode);
    window.OakBit3D?.stop?.();
    updateMenuLabels();
    return Promise.resolve();
  }

  const canvas = root?.querySelector(".oakbit-3d-canvas");
  if (!canvas || !window.OakBit3D?.start) {
    modelMode = "pixel";
    localStorage.setItem(OAKBIT_MODEL_KEY, modelMode);
    root?.setAttribute("data-model", modelMode);
    updateMenuLabels();
    say(getLocale() === "pt" ? "Modelo 3D indisponivel agora." : "3D model unavailable right now.", "alert", 2800, "error");
    return Promise.resolve();
  }

  return window.OakBit3D.start(canvas)
    .then(() => {
      modelMode = "3d";
      localStorage.setItem(OAKBIT_MODEL_KEY, modelMode);
      root?.setAttribute("data-model", modelMode);
      updateMenuLabels();
    })
    .catch(() => {
      modelMode = "pixel";
      localStorage.setItem(OAKBIT_MODEL_KEY, modelMode);
      root?.setAttribute("data-model", modelMode);
      window.OakBit3D?.stop?.();
      updateMenuLabels();
      say(getLocale() === "pt" ? "Modelo 3D indisponivel agora." : "3D model unavailable right now.", "alert", 2800, "error");
    });
}

function toggleModelMode() {
  const nextMode = modelMode === "3d" ? "pixel" : "3d";
  setModelMode(nextMode).then(() => {
    say(getLocale() === "pt"
      ? `Modelo ${modelMode === "3d" ? "3D" : "Pixel"} ativado.`
      : `${modelMode === "3d" ? "3D" : "Pixel"} model enabled.`, "happy", 2600, "action");
  });
}

function getRomFocusToggle() {
  return document.querySelector("#rom-focus-menu-toggle");
}

function getSessionAction(action) {
  const selectors = {
    home: "#rom-back-link, .rom-back-link, .emulator-brand",
    fullscreen: "#dock-fullscreen",
    pokedex: "#pokedex-toggle",
    "save-import": "#session-import-save",
    "save-export": "#session-export-save",
  };

  return document.querySelector(selectors[action] || "");
}

function hasSessionActions() {
  return Boolean(getSessionAction("home") || getSessionAction("fullscreen") || getSessionAction("pokedex") || getSessionAction("save-import") || getSessionAction("save-export"));
}

function getTutorialSteps() {
  const locale = getLocale();
  const pt = locale === "pt";
  const steps = [];

  const isVisibleTutorialTarget = (target) => {
    if (!target) {
      return false;
    }

    const rect = target.getBoundingClientRect();
    const style = window.getComputedStyle(target);
    return rect.width > 8
      && rect.height > 8
      && style.display !== "none"
      && style.visibility !== "hidden"
      && Number(style.opacity || 1) > 0;
  };

  const add = (selector, titlePt, copyPt, titleEn, copyEn) => {
    const target = document.querySelector(selector);
    if (isVisibleTutorialTarget(target)) {
      steps.push({
        selector,
        title: pt ? titlePt : titleEn,
        copy: pt ? copyPt : copyEn,
      });
    }
  };

  if (document.body.classList.contains("home-page")) {
    add(".rom-library-hero", "Home", "Aqui voce escolhe uma capa para abrir a pagina da ROM.", "Home", "Choose a cover here to open a ROM page.");
    add(".home-upload-panel", "Adicionar ROM", "Use este painel para salvar ROMs locais neste navegador.", "Add ROM", "Use this panel to save local ROMs in this browser.");
    add("#open-library-dashboard", "Gerenciar biblioteca", "Aqui ficam ROMs locais, saves, BIOS, backups e preferencias do OakBit.", "Manage library", "Local ROMs, saves, BIOS, backups, and OakBit settings live here.");
    add(".library-toolbar-panel", "Filtros", "Busca, sistema, ordenacao e resultados ficam nesta barra compacta.", "Filters", "Search, system, sorting, and results live in this compact bar.");
    add("#rom-grid", "Biblioteca", "As ROMs salvas e padrao aparecem aqui, organizadas por sistema.", "Library", "Saved and default ROMs appear here, organized by system.");
  } else {
    add(".rom-page-title", "ROM atual", "Este bloco mostra a ROM aberta e acompanha o novo topo compacto do emulador.", "Current ROM", "This block shows the open ROM and follows the compact emulator header.");
    add(".rom-page-status", "Status da sessao", "Aqui ficam o estado do emulador e a origem da ROM carregada.", "Session status", "This shows emulator state and where the loaded ROM came from.");
    add(".rom-player-stage, .player-stage", "Emulador", "Esta e a area principal do jogo. O modo foco deixa tudo mais limpo.", "Emulator", "This is the main game area. Focus mode keeps the screen clean.");
    add(".player-session-meta", "Sessao", "Esses chips mostram runtime e estado da sessao alinhados com a tela do jogo.", "Session", "These chips show runtime and session state aligned with the game screen.");
    add(".rom-upload-strip", "ROM local", "Upload e status ficam agrupados acima do player sem ocupar a largura inteira da pagina.", "Local ROM", "Upload and status are grouped above the player without spanning the whole page.");
    add("#rom-focus-menu-toggle", "Painéis", "O OakBit usa este controle para alternar entre paineis visiveis e foco no jogo.", "Panels", "OakBit uses this control to switch between visible panels and game focus.");
    add(".rom-controls-panel", "Controles", "Este painel muda conforme o console detectado pela ROM.", "Controls", "This panel changes based on the console detected from the ROM.");
    add("#session-export-save", "Saves", "Importe ou exporte saves locais por estes comandos.", "Saves", "Import or export local saves from these commands.");
  }

  steps.push({
    selector: ".oakbit-button",
    title: pt ? "OakBit" : "OakBit",
    copy: pt ? "Tela cheia e Pokedex ficam aqui no mascote, junto com saves, tutorial, skins e opcoes da sessao." : "Fullscreen and Pokedex live here in the mascot, along with saves, tutorial, skins, and session options.",
  });

  return steps;
}

function positionTutorial() {
  if (!tutorialOverlay || !tutorialSpotlight || !tutorialCard || !tutorialSteps.length) {
    return;
  }

  const step = tutorialSteps[tutorialIndex];
  const target = document.querySelector(step.selector);
  target?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  const rect = target?.getBoundingClientRect();
  const safeRect = rect && rect.width && rect.height
    ? rect
    : { left: window.innerWidth - 96, top: window.innerHeight - 96, width: 72, height: 72, right: window.innerWidth - 24, bottom: window.innerHeight - 24 };

  const pad = 8;
  tutorialSpotlight.style.left = `${Math.max(8, safeRect.left - pad)}px`;
  tutorialSpotlight.style.top = `${Math.max(8, safeRect.top - pad)}px`;
  tutorialSpotlight.style.width = `${Math.min(window.innerWidth - 16, safeRect.width + pad * 2)}px`;
  tutorialSpotlight.style.height = `${Math.min(window.innerHeight - 16, safeRect.height + pad * 2)}px`;

  const cardWidth = Math.min(300, window.innerWidth - 24);
  let left = Math.min(window.innerWidth - cardWidth - 12, Math.max(12, safeRect.left));
  let top = safeRect.bottom + 12;
  if (top + 176 > window.innerHeight) {
    top = Math.max(12, safeRect.top - 188);
  }

  tutorialCard.style.left = `${left}px`;
  tutorialCard.style.top = `${top}px`;
  tutorialCard.style.width = `${cardWidth}px`;
}

function renderTutorial() {
  if (!tutorialCard || !tutorialSteps.length) {
    return;
  }

  const step = tutorialSteps[tutorialIndex];
  const locale = getLocale();
  tutorialCard.innerHTML = `
    <span class="oakbit-tour-kicker">${tutorialIndex + 1}/${tutorialSteps.length}</span>
    <h3>${step.title}</h3>
    <p>${step.copy}</p>
    <div class="oakbit-tour-actions">
      <button type="button" data-oakbit-tour="prev"${tutorialIndex === 0 ? " disabled" : ""}>${locale === "pt" ? "Voltar" : "Back"}</button>
      <button type="button" data-oakbit-tour="skip">${locale === "pt" ? "Pular" : "Skip"}</button>
      <button type="button" data-oakbit-tour="next">${tutorialIndex === tutorialSteps.length - 1 ? (locale === "pt" ? "Concluir" : "Done") : (locale === "pt" ? "Proximo" : "Next")}</button>
    </div>
  `;
  positionTutorial();
  say(step.title, "thinking", 2200, "info");
}

function stopTutorial(completed = false) {
  tutorialOverlay?.setAttribute("hidden", "");
  tutorialSteps = [];
  tutorialIndex = 0;
  if (completed) {
    localStorage.setItem(OAKBIT_TUTORIAL_DONE_KEY, "1");
  }
}

function startTutorial() {
  tutorialSteps = getTutorialSteps();
  tutorialIndex = 0;
  if (!tutorialSteps.length || !tutorialOverlay) {
    return;
  }
  setMenuOpen(false);
  show();
  tutorialOverlay.removeAttribute("hidden");
  renderTutorial();
}

function syncMenuGroups() {
  if (!root) {
    return;
  }

  for (const group of root.querySelectorAll(".oakbit-menu-group")) {
    const visibleButtons = [...group.querySelectorAll("button")].filter((button) => !button.hidden);
    group.hidden = visibleButtons.length === 0;
  }
}

function isRomFocusMenuOpen() {
  return document.body.classList.contains("is-rom-menu-open");
}

function toggleRomFocusMenu() {
  const focusToggle = getRomFocusToggle();
  if (!focusToggle) {
    return;
  }

  focusToggle.click();
  setMode("emulator");
  updateMenuLabels();
  say(getLocale() === "pt"
    ? (isRomFocusMenuOpen() ? "Painel da tela aberto." : "Modo foco ativado.")
    : (isRomFocusMenuOpen() ? "Screen panel opened." : "Focus mode enabled."), "thinking", 2400, "action");
}

function triggerSessionAction(action) {
  const target = getSessionAction(action);
  if (!target) {
    return;
  }

  if (action === "home" && target.href) {
    window.location.href = target.href;
  } else {
    target.click();
  }
  setMode(action === "pokedex" ? "pokedex" : "emulator");
  if (action === "fullscreen") {
    setEffect("fullscreen");
  } else if (action === "pokedex") {
    setEffect("pokedex-scan");
  } else if (action === "save-import" || action === "save-export") {
    setEffect("transfer");
  }
  setMenuOpen(false);

  const locale = getLocale();
  const messages = locale === "pt"
    ? {
        home: "Voltando para a Home.",
        fullscreen: "Controle de tela enviado.",
        pokedex: "Abrindo modulo de pesquisa.",
        "save-import": "Selecione o save.",
        "save-export": "Exportando save.",
      }
    : {
        home: "Returning Home.",
        fullscreen: "Display command sent.",
        pokedex: "Opening research module.",
        "save-import": "Select the save file.",
        "save-export": "Exporting save.",
      };
  say(messages[action] || messages.fullscreen, "thinking", 2400, "action");
}

function updateMenuLabels() {
  if (!root) {
    return;
  }

  const locale = getLocale();
  const labels = locale === "pt"
    ? { mute: "Silenciar", unmute: "Ativar voz", mood: "Humor", hide: "Ocultar", model: "Modelo", home: "Voltar Home", screenMenu: "Mostrar painéis", focus: "Foco no jogo", fullscreen: "Tela cheia", pokedex: "Abrir Pokedex", saveImport: "Importar save", saveExport: "Exportar save" }
    : { mute: "Mute", unmute: "Enable voice", mood: "Mood", hide: "Hide", model: "Model", home: "Back Home", screenMenu: "Show panels", focus: "Game focus", fullscreen: "Fullscreen", pokedex: "Open Pokedex", saveImport: "Import save", saveExport: "Export save" };

  const muteButton = root.querySelector("[data-oakbit-action='mute']");
  const modelButton = root.querySelector("[data-oakbit-action='model']");
  const skinButton = root.querySelector("[data-oakbit-action='skin']");
  const moodButton = root.querySelector("[data-oakbit-action='mood']");
  const hideButton = root.querySelector("[data-oakbit-action='hide']");
  const tutorialButton = root.querySelector("[data-oakbit-action='tutorial']");
  const screenMenuButton = root.querySelector("[data-oakbit-action='rom-focus']");
  const homeButton = root.querySelector("[data-oakbit-action='home']");
  const fullscreenButton = root.querySelector("[data-oakbit-action='fullscreen']");
  const pokedexButton = root.querySelector("[data-oakbit-action='pokedex']");
  const saveImportButton = root.querySelector("[data-oakbit-action='save-import']");
  const saveExportButton = root.querySelector("[data-oakbit-action='save-export']");

  if (muteButton) {
    muteButton.textContent = muted ? labels.unmute : labels.mute;
  }
  if (screenMenuButton) {
    screenMenuButton.hidden = !getRomFocusToggle();
    screenMenuButton.textContent = isRomFocusMenuOpen() ? labels.focus : labels.screenMenu;
  }
  if (homeButton) {
    homeButton.hidden = !getSessionAction("home");
    homeButton.textContent = labels.home;
  }
  if (fullscreenButton) {
    fullscreenButton.hidden = !hasSessionActions();
    fullscreenButton.textContent = labels.fullscreen;
  }
  if (pokedexButton) {
    pokedexButton.hidden = !getSessionAction("pokedex");
    pokedexButton.textContent = labels.pokedex;
  }
  if (saveImportButton) {
    saveImportButton.hidden = !getSessionAction("save-import");
    saveImportButton.textContent = labels.saveImport;
  }
  if (saveExportButton) {
    saveExportButton.hidden = !getSessionAction("save-export");
    saveExportButton.textContent = labels.saveExport;
  }
  if (modelButton) {
    modelButton.disabled = Boolean(document.fullscreenElement);
    modelButton.textContent = document.fullscreenElement
      ? `${labels.model}: Pixel`
      : `${labels.model}: ${modelMode === "3d" ? "3D" : "Pixel"}`;
  }
  if (skinButton) {
    skinButton.textContent = `Skin: ${skin}`;
  }
  if (moodButton) {
    moodButton.textContent = labels.mood;
  }
  if (hideButton) {
    hideButton.textContent = labels.hide;
  }
  if (tutorialButton) {
    tutorialButton.textContent = getLocale() === "pt" ? "Tutorial" : "Tutorial";
  }
  syncMenuGroups();
}

function cycleSkin() {
  const availableSkins = getAvailableSkins();
  const currentIndex = availableSkins.indexOf(skin);
  setSkin(availableSkins[(currentIndex + 1) % availableSkins.length]);
  spark();
  say(getLocale() === "pt" ? `Skin ${skin} ativada.` : `${skin} skin enabled.`, "happy", 2600, "action");
}

function unlockSecretSkin() {
  if (secretUnlocked) {
    setSkin("secret");
    spark();
    return;
  }

  secretUnlocked = true;
  localStorage.setItem(OAKBIT_SECRET_KEY, "1");
  setSkin("secret");
  spark();
  say(getLocale() === "pt" ? "Protocolo secreto ativado." : "Secret protocol enabled.", "happy", 3600, "action");
}

function isSecretUnlocked() {
  return secretUnlocked;
}

function resetPreferences() {
  localStorage.removeItem(OAKBIT_HIDDEN_KEY);
  localStorage.removeItem(OAKBIT_MUTED_KEY);
  localStorage.removeItem(OAKBIT_SKIN_KEY);
  localStorage.removeItem(OAKBIT_MODEL_KEY);
  localStorage.removeItem(OAKBIT_SECRET_KEY);
  localStorage.removeItem(OAKBIT_ENERGY_KEY);
  localStorage.removeItem(OAKBIT_CONTEXT_KEY);
  hidden = false;
  muted = false;
  secretUnlocked = false;
  energy = 42;
  context = {};
  mode = "library";
  setSkin("normal");
  setModelMode("pixel");
  setMode("library");
  syncEnergy();
  root?.classList.remove("is-hidden", "is-muted");
  restoreButton?.setAttribute("hidden", "");
  updateMenuLabels();
  say(getLocale() === "pt" ? "Preferencias resetadas." : "Preferences reset.", "happy", 2800, "action");
}

function mount() {
  if (root) {
    return;
  }

  root = document.createElement("aside");
  root.className = "oakbit";
  root.dataset.mood = "idle";
  root.dataset.skin = skin;
  root.dataset.model = modelMode;
  root.dataset.mode = mode;
  root.setAttribute("aria-label", "OakBit, mascote do OakRom");
  root.innerHTML = `
    <p class="oakbit-bubble" aria-live="polite"></p>
    <button class="oakbit-hide" type="button" aria-label="Ocultar OakBit" title="Ocultar OakBit">x</button>
    <div class="oakbit-menu" aria-label="Controles do OakBit">
      <div class="oakbit-menu-group oakbit-menu-group-session">
        <span>Sessao</span>
        <button type="button" data-oakbit-action="home" hidden>Voltar Home</button>
        <button type="button" data-oakbit-action="rom-focus" hidden>Menu da tela</button>
        <button type="button" data-oakbit-action="fullscreen" hidden>Tela cheia</button>
        <button type="button" data-oakbit-action="pokedex" hidden>Pokedex</button>
      </div>
      <div class="oakbit-menu-group oakbit-menu-group-saves">
        <span>Saves</span>
        <button type="button" data-oakbit-action="save-import" hidden>Importar save</button>
        <button type="button" data-oakbit-action="save-export" hidden>Exportar save</button>
      </div>
      <div class="oakbit-menu-group">
        <span>OakBit</span>
        <button type="button" data-oakbit-action="mute">${muted ? "Ativar voz" : "Silenciar"}</button>
        <button type="button" data-oakbit-action="model">Modelo: ${modelMode === "3d" ? "3D" : "Pixel"}</button>
        <button type="button" data-oakbit-action="skin">Skin: ${skin}</button>
        <button type="button" data-oakbit-action="mood">Humor</button>
        <button type="button" data-oakbit-action="tutorial">Tutorial</button>
        <button type="button" data-oakbit-action="hide">Ocultar</button>
      </div>
    </div>
    <button class="oakbit-button" type="button" aria-label="Interagir com OakBit">
      <span class="oakbit-sprite" aria-hidden="true">
        <span class="oakbit-eye oakbit-eye-left"></span>
        <span class="oakbit-eye oakbit-eye-right"></span>
        <span class="oakbit-mouth"></span>
      </span>
      <canvas class="oakbit-3d-canvas" aria-hidden="true"></canvas>
      <span class="oakbit-energy" aria-hidden="true"><span></span></span>
    </button>
  `;

  document.body.append(root);
  tutorialOverlay = document.createElement("div");
  tutorialOverlay.className = "oakbit-tour";
  tutorialOverlay.hidden = true;
  tutorialOverlay.innerHTML = `
    <div class="oakbit-tour-dim" aria-hidden="true"></div>
    <div class="oakbit-tour-spotlight" aria-hidden="true"></div>
    <section class="oakbit-tour-card" role="dialog" aria-live="polite" aria-label="Tutorial do OakBit"></section>
  `;
  document.body.append(tutorialOverlay);
  tutorialSpotlight = tutorialOverlay.querySelector(".oakbit-tour-spotlight");
  tutorialCard = tutorialOverlay.querySelector(".oakbit-tour-card");
  restoreButton = document.createElement("button");
  restoreButton.className = "oakbit-restore";
  restoreButton.type = "button";
  restoreButton.textContent = "OakBit";
  restoreButton.setAttribute("aria-label", "Mostrar OakBit");
  restoreButton.hidden = !hidden;
  restoreButton.addEventListener("click", show);
  document.body.append(restoreButton);
  originalParent = root.parentElement;
  originalNextSibling = root.nextSibling;
  bubble = root.querySelector(".oakbit-bubble");
  root.querySelector(".oakbit-button")?.addEventListener("click", toggleMenu);
  root.querySelector(".oakbit-hide")?.addEventListener("click", hide);
  root.classList.toggle("is-hidden", hidden);
  root.classList.toggle("is-muted", muted);
  syncEnergy();
  updateMenuLabels();
  root.querySelector(".oakbit-menu")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-oakbit-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.oakbitAction;
    if (action === "mute") {
      toggleMuted();
      return;
    }

    if (action === "rom-focus") {
      toggleRomFocusMenu();
      return;
    }

    if (["home", "fullscreen", "pokedex", "save-import", "save-export"].includes(action)) {
      triggerSessionAction(action);
      return;
    }

    if (action === "mood") {
      cycleMood();
      return;
    }

    if (action === "tutorial") {
      startTutorial();
      return;
    }

    if (action === "model") {
      toggleModelMode();
      return;
    }

    if (action === "skin") {
      cycleSkin();
      return;
    }

    if (action === "hide") {
      hide();
    }
  });
  tutorialOverlay.addEventListener("click", (event) => {
    const action = event.target.closest("[data-oakbit-tour]")?.dataset.oakbitTour;
    if (!action) {
      return;
    }

    if (action === "skip") {
      stopTutorial(false);
      return;
    }

    if (action === "prev") {
      tutorialIndex = Math.max(0, tutorialIndex - 1);
      renderTutorial();
      return;
    }

    if (action === "next") {
      if (tutorialIndex >= tutorialSteps.length - 1) {
        stopTutorial(true);
        say(getLocale() === "pt" ? "Tutorial concluido." : "Tutorial complete.", "happy", 2600, "action");
        return;
      }
      tutorialIndex += 1;
      renderTutorial();
    }
  });
  scheduleIdle();
  if (modelMode === "3d") {
    window.setTimeout(() => setModelMode("3d"), 0);
  }
}

function syncFullscreenHost() {
  if (!root || !originalParent) {
    return;
  }

  const fullscreenElement = document.fullscreenElement;

  if (fullscreenElement && root.parentElement !== fullscreenElement) {
    if (modelMode === "3d") {
      setModelMode("pixel");
    }
    fullscreenElement.append(root);
    if (restoreButton && restoreButton.parentElement !== fullscreenElement) {
      fullscreenElement.append(restoreButton);
    }
    return;
  }

  if (!fullscreenElement && root.parentElement !== originalParent) {
    originalParent.insertBefore(root, originalNextSibling);
    if (restoreButton && restoreButton.parentElement !== originalParent) {
      originalParent.append(restoreButton);
    }
    if (modelMode === "3d") {
      window.setTimeout(() => setModelMode("3d"), 0);
    }
  }
}

mount();
document.addEventListener("fullscreenchange", syncFullscreenHost);
document.addEventListener("click", (event) => {
  if (!root?.classList.contains("is-menu-open")) {
    return;
  }

  if (!root.contains(event.target)) {
    setMenuOpen(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (tutorialOverlay && !tutorialOverlay.hidden) {
      stopTutorial(false);
    }
    setMenuOpen(false);
    konamiIndex = 0;
    return;
  }

  const expectedKey = KONAMI_CODE[konamiIndex];
  const pressedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (pressedKey === expectedKey) {
    konamiIndex += 1;
    if (konamiIndex === KONAMI_CODE.length) {
      konamiIndex = 0;
      unlockSecretSkin();
    }
    return;
  }

  konamiIndex = pressedKey === KONAMI_CODE[0] ? 1 : 0;
});
window.addEventListener("resize", positionTutorial);
window.addEventListener("scroll", positionTutorial, true);

window.OakMascot = {
  say,
  react,
  setMood,
  hide,
  show,
  toggle,
  spark,
  listen,
  setMuted,
  toggleMuted,
  setSkin,
  setModelMode,
  toggleModelMode,
  addEnergy,
  setContext,
  setMode,
  getSkin,
  getModelMode,
  getMode,
  getEnergy,
  isHidden,
  isMuted,
  isSecretUnlocked,
  resetPreferences,
  startTutorial,
  refreshLocale: updateMenuLabels,
  syncFullscreenHost,
};
