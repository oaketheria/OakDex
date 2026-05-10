const stage = document.querySelector("#oakduo-stage");
const setupPanel = document.querySelector("#oakduo-setup");
const setupStatus = document.querySelector("#oakduo-setup-status");
const setupGuide = document.querySelector("#oakduo-setup-guide");
const fullscreenButton = document.querySelector("#oakduo-fullscreen");
const copyInviteButton = document.querySelector("#oakduo-copy-invite");
const newRoomButton = document.querySelector("#oakduo-new-room");
const activePlayerLabel = document.querySelector("#oakduo-active-player");
const roomCodeLabel = document.querySelector("#oakduo-room-code");
const stripCodeLabel = document.querySelector("#oakduo-strip-code");
const roomHint = document.querySelector("#oakduo-room-hint");
const stripPlayerOne = document.querySelector("#oakduo-strip-player-1");
const stripPlayerTwo = document.querySelector("#oakduo-strip-player-2");
const stripPeer = document.querySelector("#oakduo-strip-peer");
const nextStepLabel = document.querySelector("#oakduo-next-step");
const lastEventLabel = document.querySelector("#oakduo-last-event");
const peerStatus = document.querySelector("#oakduo-peer-status");
const localSignal = document.querySelector("#oakduo-local-signal");
const remoteSignal = document.querySelector("#oakduo-remote-signal");
const localSignalBox = localSignal?.closest(".oakduo-signal-box") || null;
const remoteSignalBox = remoteSignal?.closest(".oakduo-signal-box") || null;
const createOfferButton = document.querySelector("#oakduo-create-offer");
const acceptOfferButton = document.querySelector("#oakduo-accept-offer");
const applyAnswerButton = document.querySelector("#oakduo-apply-answer");
const stopScreenButton = document.querySelector("#oakduo-stop-screen");
const copySignalButton = document.querySelector("#oakduo-copy-signal");
const disconnectPeerButton = document.querySelector("#oakduo-disconnect-peer");
const pokedexToggle = document.querySelector("#pokedex-toggle");
const pokedexVoiceButton = document.querySelector("#integrated-dex-voice");
const pokedexClose = document.querySelector("#pokedex-close");
const pokedexPanel = document.querySelector("#oakduo-pokedex-panel");
const pokedexFrame = document.querySelector("#oakduo-pokedex-frame");
const pokedexOriginalParent = pokedexPanel?.parentElement || null;
const pokedexOriginalNextSibling = pokedexPanel?.nextSibling || null;
const remotePlayerVideos = new Map(
  [...document.querySelectorAll("[data-remote-player]")].map((item) => [item.dataset.remotePlayer, item])
);
const remotePlayerBadges = new Map(
  [...document.querySelectorAll("[data-remote-badge]")].map((item) => [item.dataset.remoteBadge, item])
);
const playerPanels = [...document.querySelectorAll("[data-player-panel]")];
const setupSteps = new Map(
  [...document.querySelectorAll("[data-setup-step]")].map((item) => [item.dataset.setupStep, item])
);
const setupActions = new Map(
  [...document.querySelectorAll("[data-setup-action]")].map((item) => [item.dataset.setupAction, item])
);
const iconButtonMap = new Map([
  ["oakduo-new-room", "plus"],
  ["oakduo-copy-invite", "invite"],
  ["oakduo-fullscreen", "screen"],
  ["oakduo-create-offer", "signal"],
  ["oakduo-accept-offer", "reply"],
  ["oakduo-copy-signal", "copy"],
  ["oakduo-apply-answer", "link"],
  ["oakduo-stop-screen", "stop"],
  ["oakduo-disconnect-peer", "disconnect"],
]);
const statuses = new Map(
  [...document.querySelectorAll("[data-player-status]")].map((item) => [item.dataset.playerStatus, item])
);
const romLabels = new Map(
  [...document.querySelectorAll("[data-player-rom]")].map((item) => [item.dataset.playerRom, item])
);
const playerState = new Map([
  ["1", { status: "ready", label: "Pronto", romLabel: "Nenhuma ROM carregada" }],
  ["2", { status: "ready", label: "Pronto", romLabel: "Nenhuma ROM carregada" }],
]);
const peerConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

let peerConnection = null;
let dataChannel = null;
let localScreenStream = null;
let streamingPlayer = "";
let pendingRemoteStream = null;
const pendingRemoteStreams = new Map();
let remoteStreamingPlayer = "";
let isRenegotiating = false;
let pokedexVoiceRecognition = null;
let peerState = "offline";
let recentEvent = "Aguardando sessão";
let peerConnectionToken = 0;
let isPeerActionRunning = false;
let setupReadySent = false;
let remoteSetupReady = false;
let reconnectTimer = 0;
let setupReadinessTimer = 0;
let streamAnnounceTimer = 0;
const SETUP_STORAGE_KEY = "oakduoSetupFlowDoneV2";
const ROLE_STORAGE_KEY = "oakduoPreferredRole";
const SIGNAL_STORAGE_KEYS = {
  local: "oakduoLocalSignalDraft",
  remote: "oakduoRemoteSignalDraft",
  room: "oakduoSignalDraftRoom",
};
const OAKBIT_NOTICE_COOLDOWN = 6500;
const oakBitNoticeTimes = new Map();
const PokedexSpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const originalButtonLabels = new WeakMap();
const navigationEntry = performance.getEntriesByType?.("navigation")?.[0] || null;
const didReloadPage = navigationEntry?.type === "reload" || performance.navigation?.type === 1;

function cueOakBit(message, mood = "happy", duration = 3200) {
  window.OakMascot?.setMode?.("emulator");
  window.OakMascot?.setContext?.({
    mode: "emulator",
    feature: "oakduo",
    room: roomCodeLabel?.textContent || "",
  });
  window.OakMascot?.say?.(message, mood, duration);
}

function cueOakBitOnce(key, message, mood = "happy", duration = 3200, cooldown = OAKBIT_NOTICE_COOLDOWN) {
  const now = Date.now();
  const lastNoticeTime = oakBitNoticeTimes.get(key) || 0;
  if (now - lastNoticeTime < cooldown) {
    return;
  }

  oakBitNoticeTimes.set(key, now);
  cueOakBit(message, mood, duration);
}

function syncPokedexFullscreenHost() {
  if (!pokedexPanel) {
    return;
  }

  const fullscreenElement = document.fullscreenElement;
  const shouldAttachToFullscreen = fullscreenElement && fullscreenElement !== document.documentElement;

  if (shouldAttachToFullscreen && !fullscreenElement.contains(pokedexPanel)) {
    fullscreenElement.appendChild(pokedexPanel);
    return;
  }

  if (!shouldAttachToFullscreen && pokedexOriginalParent && pokedexPanel.parentElement !== pokedexOriginalParent) {
    pokedexOriginalParent.insertBefore(pokedexPanel, pokedexOriginalNextSibling);
  }
}

function setPokedexFrameSource(searchTerm = "") {
  if (!pokedexFrame) {
    return;
  }

  const nextUrl = new URL("./pokedex.html", window.location.href);
  nextUrl.searchParams.set("embed", "1");

  if (searchTerm) {
    nextUrl.searchParams.set("pokemon", searchTerm);
  }

  const nextSrc = `.${nextUrl.pathname.slice(nextUrl.pathname.lastIndexOf("/"))}${nextUrl.search}`;
  if ((pokedexFrame.getAttribute("src") || "") !== nextSrc) {
    pokedexFrame.setAttribute("src", nextSrc);
  }
}

function playPokedexOpenAnimation() {
  document.body.classList.add("is-pokedex-opening");
  window.setTimeout(() => {
    document.body.classList.remove("is-pokedex-opening");
  }, 760);
}

function playPokedexOpenSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(480, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.035, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.17);
    oscillator.onended = () => {
      audioContext.close().catch(() => {});
    };
  } catch (error) {
    // Browser audio policies can block this; the panel should still open.
  }
}

async function setPokedexOpen(open) {
  if (!pokedexPanel) {
    return;
  }

  if (open && !document.fullscreenElement) {
    if (!stage?.requestFullscreen) {
      cueOakBit("A Pokédex integrada abre em tela cheia.", "alert", 2800);
      return;
    }

    try {
      await stage.requestFullscreen();
    } catch (error) {
      cueOakBit("Entre em tela cheia para abrir a Pokédex integrada.", "alert", 3200);
      return;
    }
  }

  syncPokedexFullscreenHost();
  document.body.classList.toggle("is-pokedex-open", open);
  pokedexPanel.setAttribute("aria-hidden", String(!open));
  pokedexToggle?.setAttribute("aria-expanded", String(open));

  if (open) {
    playPokedexOpenSound();
    playPokedexOpenAnimation();
    cueOakBit("Pokédex integrada aberta. Use V para comando de voz.", "thinking", 3600);
    pokedexFrame?.focus();
  } else {
    cueOakBit("Pokédex fechada. Voltando ao OakDuo.", "idle", 2600);
  }
}

function handlePokedexVoiceCommand(transcript) {
  const command = String(transcript || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (!command) {
    return;
  }

  const searchMatch =
    command.match(/abrir (?:a )?pokedex (?:e )?buscar (.+)$/) ||
    command.match(/abrir dex (?:e )?buscar (.+)$/) ||
    command.match(/buscar (.+) na pokedex$/);
  const requestedPokemon = searchMatch?.[1]?.trim().replace(/\s+/g, "-") || "";

  if (requestedPokemon) {
    setPokedexFrameSource(requestedPokemon);
    void setPokedexOpen(true);
    return;
  }

  if (command.includes("abrir pokedex") || command.includes("abrir a pokedex") || command.includes("mostrar pokedex") || command.includes("abrir dex")) {
    setPokedexFrameSource();
    void setPokedexOpen(true);
    return;
  }

  if (command.includes("fechar pokedex") || command.includes("fechar a pokedex") || command.includes("esconder pokedex") || command.includes("fechar dex")) {
    void setPokedexOpen(false);
  }
}

function startPokedexVoiceCommand() {
  if (!pokedexVoiceRecognition) {
    cueOakBit("Comando de voz indisponível neste navegador.", "alert", 3000);
    return;
  }

  try {
    pokedexVoiceRecognition.start();
  } catch (error) {
    cueOakBit("Já estou ouvindo o comando de voz.", "thinking", 2200);
  }
}

function handlePokedexShortcut(event, ownerWindow = window) {
  const target = event.target;
  const isTyping =
    target instanceof ownerWindow.HTMLInputElement ||
    target instanceof ownerWindow.HTMLTextAreaElement ||
    target instanceof ownerWindow.HTMLSelectElement ||
    target?.isContentEditable;

  if (isTyping) {
    return false;
  }

  if (event.key.toLowerCase() === "p") {
    event.preventDefault();
    setPokedexFrameSource();
    void setPokedexOpen(!document.body.classList.contains("is-pokedex-open"));
    return true;
  }

  if (event.key.toLowerCase() === "v") {
    event.preventDefault();
    startPokedexVoiceCommand();
    return true;
  }

  if (event.key === "Escape" && document.body.classList.contains("is-pokedex-open")) {
    event.preventDefault();
    void setPokedexOpen(false);
    return true;
  }

  return false;
}

function getFrame(player) {
  return document.querySelector(`#oakduo-frame-${player}`);
}

function createRoomCode() {
  const params = new URLSearchParams(window.location.search);
  const urlRoomCode = String(params.get("room") || "").trim().toUpperCase();
  if (/^OAK-[A-Z2-9]{3}$/.test(urlRoomCode)) {
    sessionStorage.setItem("oakduoRoomCode", urlRoomCode);
    return urlRoomCode;
  }

  const storedCode = sessionStorage.getItem("oakduoRoomCode");
  if (storedCode) {
    return storedCode;
  }

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomPart = Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  const nextCode = `OAK-${randomPart}`;
  sessionStorage.setItem("oakduoRoomCode", nextCode);
  return nextCode;
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomPart = Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `OAK-${randomPart}`;
}

function setRoomCode(roomCode) {
  const normalizedCode = String(roomCode || "").trim().toUpperCase();
  if (!/^OAK-[A-Z2-9]{3}$/.test(normalizedCode)) {
    return syncRoomCode();
  }

  sessionStorage.setItem("oakduoRoomCode", normalizedCode);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("room", normalizedCode);
  window.history.replaceState({}, "", nextUrl);

  if (roomCodeLabel) {
    roomCodeLabel.textContent = normalizedCode;
  }
  if (stripCodeLabel) {
    stripCodeLabel.textContent = normalizedCode;
  }

  return normalizedCode;
}

function createNewRoom() {
  const currentCode = roomCodeLabel?.textContent || "";
  let nextCode = generateRoomCode();
  while (nextCode === currentCode) {
    nextCode = generateRoomCode();
  }

  closePeerConnection();
  if (localSignal) {
    localSignal.value = "";
  }
  if (remoteSignal) {
    remoteSignal.value = "";
  }
  clearSignalDrafts();
  oakBitNoticeTimes.clear();
  setRoomCode(nextCode);
  setPeerStatus("Nova sala");
  setLastEvent(`Sala ${nextCode} criada`);
  cueOakBit(`Nova sala criada: ${nextCode}. Copie o convite para chamar a outra pessoa.`, "happy", 4200);
}

function syncRoomCode() {
  const roomCode = createRoomCode();
  if (roomCodeLabel) {
    roomCodeLabel.textContent = roomCode;
  }
  if (stripCodeLabel) {
    stripCodeLabel.textContent = roomCode;
  }
  return roomCode;
}

function storeSignalDrafts() {
  sessionStorage.setItem(SIGNAL_STORAGE_KEYS.room, syncRoomCode());
  if (localSignal) {
    sessionStorage.setItem(SIGNAL_STORAGE_KEYS.local, localSignal.value || "");
  }
  if (remoteSignal) {
    sessionStorage.setItem(SIGNAL_STORAGE_KEYS.remote, remoteSignal.value || "");
  }
}

function clearSignalDrafts() {
  sessionStorage.removeItem(SIGNAL_STORAGE_KEYS.local);
  sessionStorage.removeItem(SIGNAL_STORAGE_KEYS.remote);
  sessionStorage.removeItem(SIGNAL_STORAGE_KEYS.room);
}

function restoreSignalDrafts() {
  const currentRoom = syncRoomCode();
  const storedRoom = sessionStorage.getItem(SIGNAL_STORAGE_KEYS.room) || "";
  const storedLocalSignal = sessionStorage.getItem(SIGNAL_STORAGE_KEYS.local) || "";
  const storedRemoteSignal = sessionStorage.getItem(SIGNAL_STORAGE_KEYS.remote) || "";

  if (storedRoom && storedRoom !== currentRoom) {
    clearSignalDrafts();
    setLastEvent("Código antigo ignorado");
    return;
  }

  if (localSignal && storedLocalSignal) {
    localSignal.value = storedLocalSignal;
  }
  if (remoteSignal && storedRemoteSignal) {
    remoteSignal.value = storedRemoteSignal;
  }
  if (storedLocalSignal || storedRemoteSignal) {
    setLastEvent("Código restaurado da sessão");
  }
}

function prepareReloadedSession() {
  if (!didReloadPage) {
    return;
  }

  sessionStorage.removeItem(SETUP_STORAGE_KEY);
  resetSetupReadyState();
  clearSignalDrafts();
  if (localSignal) {
    localSignal.value = "";
  }
  if (remoteSignal) {
    remoteSignal.value = "";
  }
  setPeerStatus("Reconectar");
  setLastEvent("Página recarregada");
}

function setPlayerStatus(player, message) {
  const playerId = String(player);
  const status = statuses.get(playerId);
  if (status) {
    status.textContent = message;
  }
  playerState.set(playerId, {
    ...(playerState.get(playerId) || {}),
    label: message,
  });
  updateDuoOverview();
}

function setPeerStatus(message) {
  if (peerStatus) {
    peerStatus.textContent = message;
  }
  peerState = getPeerStateFromLabel(message);
  updateDuoOverview();
}

function setLastEvent(message) {
  const normalized = String(message || "").trim();
  if (!normalized) {
    return;
  }

  recentEvent = normalized;
  if (lastEventLabel) {
    lastEventLabel.textContent = normalized;
  }
  updateDuoOverview();
}

function setSetupOpen(open) {
  document.body.classList.toggle("is-oakduo-setup-open", open);
  setupPanel?.setAttribute("aria-hidden", String(!open));
  if (open) {
    startSetupReadinessWatch();
  } else {
    stopSetupReadinessWatch();
  }
}

function startSetupReadinessWatch() {
  if (setupReadinessTimer) {
    return;
  }

  setupReadinessTimer = window.setInterval(() => {
    if (!document.body.classList.contains("is-oakduo-setup-open")) {
      stopSetupReadinessWatch();
      return;
    }
    updateSetupState();
  }, 700);
}

function stopSetupReadinessWatch() {
  window.clearInterval(setupReadinessTimer);
  setupReadinessTimer = 0;
}

function resetSetupReadyState() {
  setupReadySent = false;
  remoteSetupReady = false;
}

function handleConnectionProblem(status, eventMessage, oakBitMessage) {
  resetSetupReadyState();
  sessionStorage.removeItem(SETUP_STORAGE_KEY);
  resetStreamingState();
  setPeerStatus(status);
  setLastEvent(eventMessage);
  setSetupOpen(true);
  updateSetupState();
  if (oakBitMessage) {
    cueOakBitOnce(`connection-${status}`, oakBitMessage, "alert", 4400);
  }
}

function getPreferredRole() {
  return sessionStorage.getItem(ROLE_STORAGE_KEY) || "";
}

function isLocalPlayer(player) {
  const role = getPreferredRole();
  return !role || String(player) === role;
}

function getOtherPlayer(player) {
  return String(player) === "2" ? "1" : "2";
}

function getPlayerHasRom(player) {
  const state = playerState.get(String(player)) || {};
  return Boolean(state.romLabel && state.romLabel !== "Nenhuma ROM carregada");
}

function getPlayerCanStream(player) {
  return Boolean(getPlayerCanvas(player)?.captureStream);
}

function getSetupProgress() {
  const role = getPreferredRole();
  const hasRole = role === "1" || role === "2";
  const isConnected = peerState === "connected";
  const hasRom = hasRole && getPlayerHasRom(role);
  const canStream = hasRole && getPlayerCanStream(role);
  const isStreamingOwnSide = hasRole && streamingPlayer === role;

  return {
    role,
    hasRole,
    isConnected,
    hasRom,
    canStream,
    isStreamingOwnSide,
    done: hasRole && isConnected && hasRom && isStreamingOwnSide,
  };
}

function maybeOpenPreparedEmulators(progress = getSetupProgress()) {
  if (!progress.done) {
    return;
  }

  if (!setupReadySent) {
    setupReadySent = true;
    sendPeerMessage("setup-ready", { player: progress.role });
  }

  if (!remoteSetupReady) {
    if (setupStatus) {
      setupStatus.textContent = "Tudo pronto deste lado. Aguardando o outro jogador.";
    }
    return;
  }

  if (document.body.classList.contains("is-oakduo-setup-open")) {
    sessionStorage.setItem(SETUP_STORAGE_KEY, "true");
    window.setTimeout(() => {
      setSetupOpen(false);
      focusPlayer(progress.role);
      scheduleStreamResync();
    }, 450);
  }
}

function updateSetupState() {
  if (!setupPanel) {
    return;
  }

  const progress = getSetupProgress();
  document.querySelectorAll("[data-oakduo-role]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.oakduoRole === progress.role);
  });
  setupSteps.get("role")?.classList.toggle("is-complete", progress.hasRole);
  setupSteps.get("connection")?.classList.toggle("is-complete", progress.isConnected);
  setupSteps.get("rom")?.classList.toggle("is-complete", progress.hasRom);
  setupSteps.get("stream")?.classList.toggle("is-complete", progress.isStreamingOwnSide);

  setupActions.get("continue")?.toggleAttribute("disabled", !progress.done);
  setupActions.get("copy-invite")?.toggleAttribute("disabled", !progress.hasRole);
  setupActions.get("create-offer")?.toggleAttribute("disabled", !progress.hasRole || progress.isConnected || isPeerActionRunning);
  setupActions.get("accept-offer")?.toggleAttribute("disabled", !progress.hasRole || progress.isConnected || isPeerActionRunning || !remoteSignal?.value?.trim() || hasOwnSignalInRemoteBox());
  setupActions.get("apply-answer")?.toggleAttribute("disabled", !progress.hasRole || progress.isConnected || isPeerActionRunning || !peerConnection || !remoteSignal?.value?.trim() || hasOwnSignalInRemoteBox());
  setupActions.get("copy-signal")?.toggleAttribute("disabled", !progress.hasRole || !localSignal?.value?.trim());
  setupActions.get("choose-rom")?.toggleAttribute("disabled", !progress.isConnected || progress.hasRom);
  setupActions.get("stream")?.toggleAttribute("disabled", !progress.hasRole || !progress.isConnected || !progress.canStream || progress.isStreamingOwnSide);
  document.body.classList.toggle("is-oakduo-offer-role", progress.role === "1");
  document.body.classList.toggle("is-oakduo-answer-role", progress.role === "2");
  document.body.classList.toggle("is-oakduo-setup-connected", progress.isConnected);
  document.body.classList.toggle("is-oakduo-setup-has-rom", progress.hasRom);
  document.body.classList.toggle("is-oakduo-setup-can-stream", progress.canStream);
  document.body.classList.toggle("is-oakduo-setup-streaming", progress.isStreamingOwnSide);

  if (setupStatus) {
    setupStatus.textContent = !progress.hasRole
      ? "Escolha Jogador 1 ou Jogador 2 para começar."
      : !progress.isConnected
        ? "Conecte com o outro jogador usando convite, oferta e resposta."
        : !progress.hasRom
          ? `Conexão pronta. Escolha a ROM do Jogador ${progress.role}.`
          : !progress.canStream
            ? "ROM escolhida. Aguarde o emulador iniciar."
          : !progress.isStreamingOwnSide
            ? "ROM pronta. Inicie a transmissão do seu lado."
            : "Tudo pronto. Abrindo os emuladores.";
  }

  if (setupGuide) {
    const guides = !progress.hasRole
      ? ["Jogador 1 cria a sala.", "Jogador 2 entra pelo convite.", "Depois os dois carregam ROM e transmitem."]
      : progress.role === "1"
        ? progress.isConnected
          ? ["Conexão ativa.", "Escolha a ROM do lado esquerdo.", "Depois transmita seu lado."]
          : ["Copie o convite e envie.", "Clique em Oferta e envie o código.", "Cole a resposta do Jogador 2 e conecte."]
        : progress.isConnected
          ? ["Conexão ativa.", "Escolha a ROM do lado direito.", "Depois transmita seu lado."]
          : ["Abra o convite recebido.", "Cole a oferta em Recebido.", "Clique em Resposta e envie o código ao Jogador 1."];
    setupGuide.innerHTML = guides.map((item) => `<span>${item}</span>`).join("");
  }

  maybeOpenPreparedEmulators(progress);
}

function completeSetup(player) {
  const playerId = String(player) === "2" ? "2" : "1";
  sessionStorage.setItem(ROLE_STORAGE_KEY, playerId);
  focusPlayer(playerId);
  setLastEvent(`Sessão preparada como Jogador ${playerId}`);
  updateSetupState();
  cueOakBit(`Você está como Jogador ${playerId}. Conecte com o outro jogador antes de abrir a tela dupla.`, "happy", 4200);
}

function initializeSetup() {
  sessionStorage.removeItem("oakduoSetupDone");
  const preferredRole = sessionStorage.getItem(ROLE_STORAGE_KEY) || "";
  setSetupOpen(true);
  if (preferredRole === "1" || preferredRole === "2") {
    setActivePlayer(preferredRole);
  }
  updateSetupState();
  if (didReloadPage && setupStatus) {
    setupStatus.textContent = "Sessão recarregada. Reconecte usando uma nova oferta.";
    cueOakBit("Sessão recarregada. Mantenha a sala e troque uma nova oferta com o outro jogador.", "alert", 5200);
  }
}

function getPeerStateFromLabel(message = "") {
  const text = String(message).toLowerCase();
  if (text.includes("conectado") || text.includes("sincronizado") || text.includes("recebendo") || text.includes("transmitindo")) {
    return "connected";
  }
  if (text.includes("oferta pronta") || text.includes("resposta pronta") || text.includes("código recebido") || text.includes("codigo recebido") || text.includes("código copiado") || text.includes("codigo copiado")) {
    return "ready";
  }
  if (text.includes("desconectado") || text.includes("nova sala") || text.includes("sem código") || text.includes("sem codigo") || text.includes("conecte primeiro") || text.includes("crie oferta primeiro")) {
    return "offline";
  }
  if (text.includes("conectando") || text.includes("coletando") || text.includes("preparando")) {
    return "connecting";
  }
  if (text.includes("processando")) {
    return "connecting";
  }
  if (text.includes("instavel") || text.includes("instável")) {
    return "reconnecting";
  }
  if (text.includes("falha") || text.includes("falhou") || text.includes("erro") || text.includes("sala diferente") || text.includes("código repetido") || text.includes("codigo repetido")) {
    return "error";
  }
  return "offline";
}

function getPlayerReadiness(player) {
  const state = playerState.get(String(player)) || {};
  const hasRom = state.romLabel && state.romLabel !== "Nenhuma ROM carregada";
  if (streamingPlayer === String(player)) {
    return "Transmitindo";
  }
  if (state.label === "No controle") {
    return hasRom ? "No controle" : "Controle";
  }
  if (hasRom || ["selected", "loading", "booting", "running", "focused"].includes(state.status)) {
    return "ROM pronta";
  }
  if (state.status === "choosing" || state.label === "Escolhendo") {
    return "Escolhendo";
  }
  return "Sem ROM";
}

function updatePlayerPanelState(player) {
  const playerId = String(player);
  const panel = playerPanels.find((item) => item.dataset.playerPanel === playerId);
  const state = playerState.get(playerId) || {};
  const hasRom = state.romLabel && state.romLabel !== "Nenhuma ROM carregada";
  const isActive = panel?.classList.contains("is-active") || false;
  const isStreaming = streamingPlayer === playerId;
  const isOwnSide = isLocalPlayer(playerId);
  const canStream = Boolean(peerConnection) && hasRom && isOwnSide;
  if (!panel) {
    return;
  }

  panel.classList.toggle("is-loaded", Boolean(hasRom));
  panel.classList.toggle("is-streaming", isStreaming);
  panel.classList.toggle("is-receiving", remoteStreamingPlayer === playerId);
  panel.classList.toggle("has-status-warning", ["error"].includes(state.status));
  panel.setAttribute("aria-current", isActive ? "true" : "false");
  panel.setAttribute("aria-busy", String(["choosing", "loading", "booting"].includes(state.status)));
  panel.setAttribute("aria-label", `Jogador ${playerId}: ${getPlayerReadiness(playerId)}${remoteStreamingPlayer === playerId ? ", recebendo transmissão remota" : ""}`);
  panel.dataset.oakduoReady = hasRom ? "true" : "false";

  const romButton = panel.querySelector("[data-oakduo-action='rom']");
  const focusButton = panel.querySelector("[data-oakduo-action='focus']");
  const streamButton = panel.querySelector("[data-oakduo-action='stream']");

  if (romButton) {
    romButton.textContent = hasRom ? "Trocar ROM" : "Escolher ROM";
    romButton.setAttribute("aria-label", romButton.textContent);
    romButton.dataset.oakTooltip = isOwnSide ? romButton.textContent : "Este lado pertence ao outro jogador";
    romButton.removeAttribute("title");
    romButton.toggleAttribute("disabled", !isOwnSide);
  }

  if (focusButton) {
    focusButton.textContent = isActive ? "No controle" : "Assumir controle";
    focusButton.setAttribute("aria-label", focusButton.textContent);
    focusButton.dataset.oakTooltip = isOwnSide ? focusButton.textContent : "Este lado pertence ao outro jogador";
    focusButton.removeAttribute("title");
    focusButton.classList.toggle("is-current-control", isActive);
    focusButton.setAttribute("aria-pressed", String(isActive));
    focusButton.toggleAttribute("disabled", isActive || !isOwnSide);
  }

  if (streamButton) {
    streamButton.textContent = isStreaming ? "Transmitindo" : "Transmitir este lado";
    streamButton.setAttribute("aria-label", streamButton.textContent);
    streamButton.dataset.oakTooltip = isStreaming
      ? "Este lado está sendo transmitido"
      : canStream
        ? "Transmitir o emulador deste lado"
        : isOwnSide
          ? "Conecte a sessão e inicie a ROM antes de transmitir"
          : "Este lado pertence ao outro jogador";
    streamButton.removeAttribute("title");
    streamButton.classList.toggle("is-streaming-action", isStreaming);
    streamButton.toggleAttribute("disabled", !isStreaming && !canStream);
  }
}

function updateRoomHint() {
  const target = nextStepLabel || roomHint;
  if (!target) {
    return;
  }

  const bothReady = ["1", "2"].every((player) => getPlayerReadiness(player) !== "Sem ROM");
  const hasLocalSignal = Boolean(localSignal?.value?.trim());
  const hasRemoteSignal = Boolean(remoteSignal?.value?.trim());
  const hasRepeatedSignal = hasOwnSignalInRemoteBox();
  const hints = {
    connected: bothReady ? "Conexão ativa. Escolha o lado para controlar ou transmitir." : "Conexão ativa. Carregue as ROMs nos dois lados quando estiver pronto.",
    repeated: "Você colou seu próprio código. Cole o código enviado pelo outro navegador.",
    ready: hasLocalSignal ? "Código pronto. Copie e envie para o outro jogador." : "Cole o código recebido para continuar a conexão.",
    connecting: "Código gerado. Envie para o outro navegador e aguarde a resposta.",
    reconnecting: "Conexão instável. Mantenha a sala aberta enquanto o navegador tenta recuperar.",
    error: "Confira se o código recebido pertence a esta sala e tente gerar a conexão novamente.",
    offline: hasRemoteSignal ? "Use o código colado para gerar resposta ou concluir conexão." : "Envie o convite e troque os códigos manuais.",
  };

  target.textContent = hasRepeatedSignal ? hints.repeated : hints[peerState] || hints.offline;
}

function updateSignalPlaceholders() {
  const hasLocalSignal = Boolean(localSignal?.value?.trim());
  const hasRemoteSignal = Boolean(remoteSignal?.value?.trim());

  if (localSignal) {
    localSignal.placeholder = hasLocalSignal
      ? "Código pronto para copiar"
      : "Crie oferta ou gere resposta";
  }

  if (remoteSignal) {
    remoteSignal.placeholder = hasRemoteSignal
      ? "Código recebido pronto"
      : peerConnection
        ? "Cole a resposta recebida"
        : "Cole a oferta recebida";
  }
}

function recoverPeerStatusAfterSignalEdit() {
  if (peerState !== "error") {
    return;
  }

  if (hasOwnSignalInRemoteBox()) {
    return;
  }

  const hasRemoteSignal = Boolean(remoteSignal?.value?.trim());
  setPeerStatus(hasRemoteSignal ? "Código recebido" : "Desconectado");
}

function hasActiveDuoSession() {
  return Boolean(
    peerConnection ||
    dataChannel ||
    localScreenStream ||
    streamingPlayer ||
    remoteStreamingPlayer ||
    localSignal?.value?.trim() ||
    remoteSignal?.value?.trim()
  );
}

function selectSignalText(target) {
  if (!target?.value) {
    return;
  }

  target.focus();
  target.select();
}

function normalizeSignalText(value) {
  return String(value || "").replace(/\s+/g, "");
}

function flashButtonLabel(button, label, duration = 1600) {
  if (!button) {
    return;
  }

  if (!originalButtonLabels.has(button)) {
    originalButtonLabels.set(button, button.textContent);
  }

  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = originalButtonLabels.get(button) || button.textContent;
  }, duration);
}

function applyButtonIcons() {
  document.querySelectorAll(".oakduo-room-actions button, .oakduo-actions button, .oakduo-webrtc-actions button, .oakduo-box-actions button").forEach((button) => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    const actionIconMap = {
      rom: "rom",
      focus: "control",
      stream: "stream",
    };
    const icon = actionIconMap[button.dataset.oakduoAction] || iconButtonMap.get(button.id) || "";
    if (icon) {
      button.dataset.oakIcon = icon;
      button.setAttribute("aria-label", button.textContent.trim());
      if (button.closest(".oakduo-actions, .oakduo-room-actions, .oakduo-webrtc-actions")) {
        button.dataset.oakIconOnly = "true";
        button.dataset.oakTooltip = button.textContent.trim();
        button.removeAttribute("title");
      }
    }
  });
}

function updateDuoOverview() {
  const j1 = getPlayerReadiness("1");
  const j2 = getPlayerReadiness("2");
  const hasLocalSignal = Boolean(localSignal?.value?.trim());
  const hasRemoteSignal = Boolean(remoteSignal?.value?.trim());
  const hasRepeatedSignal = hasOwnSignalInRemoteBox();
  const hasConnection = Boolean(peerConnection);
  const isConnected = peerState === "connected";
  if (stripPlayerOne) {
    stripPlayerOne.textContent = `J1 ${j1}`;
  }
  if (stripPlayerTwo) {
    stripPlayerTwo.textContent = `J2 ${j2}`;
  }
  if (stripPeer) {
    const labels = {
      connected: "Conectado",
      connecting: "Conectando",
      reconnecting: "Reconectando",
      ready: "Código pronto",
      error: "Atenção",
      offline: "Offline",
    };
    stripPeer.textContent = labels[peerState] || "Offline";
  }

  document.body.classList.toggle("is-oakduo-connected", peerState === "connected");
  document.body.classList.toggle("is-oakduo-connecting", peerState === "connecting" || peerState === "ready");
  document.body.classList.toggle("is-oakduo-warning", peerState === "reconnecting" || peerState === "error");
  localSignalBox?.classList.toggle("is-next-step", peerState === "ready" && hasLocalSignal);
  localSignalBox?.classList.toggle("is-filled", hasLocalSignal);
  remoteSignalBox?.classList.toggle("is-next-step", peerState !== "connected" && !hasLocalSignal && !hasRemoteSignal);
  remoteSignalBox?.classList.toggle("is-filled", hasRemoteSignal);
  remoteSignalBox?.classList.toggle("is-action-ready", peerState !== "connected" && hasRemoteSignal);
  remoteSignalBox?.classList.toggle("is-conflict", hasRepeatedSignal);
  copySignalButton?.toggleAttribute("disabled", !hasLocalSignal);
  stopScreenButton?.toggleAttribute("disabled", !streamingPlayer);
  disconnectPeerButton?.toggleAttribute("disabled", !hasConnection && !hasLocalSignal && !hasRemoteSignal);
  createOfferButton?.toggleAttribute("disabled", isPeerActionRunning || isConnected);
  applyAnswerButton?.toggleAttribute("disabled", isPeerActionRunning || hasRepeatedSignal || !hasConnection || !hasRemoteSignal || isConnected);
  acceptOfferButton?.toggleAttribute("disabled", isPeerActionRunning || hasRepeatedSignal || !hasRemoteSignal || isConnected);
  ["1", "2"].forEach(updatePlayerPanelState);
  if (lastEventLabel) {
    lastEventLabel.textContent = recentEvent;
  }
  updateRoomHint();
  updateSignalPlaceholders();
  updateSetupState();
}

function setPlayerRomMeta(player, detail = {}) {
  const playerId = String(player);
  const target = romLabels.get(playerId);
  const romName = String(detail.romName || "").trim();
  const system = String(detail.system || "").trim();
  const providedLabel = String(detail.romLabel || "").trim();
  const romLabel = romName
    ? `${romName}${system ? ` - ${system}` : ""}`
    : providedLabel
      ? providedLabel
    : "Nenhuma ROM carregada";

  if (target) {
    target.textContent = romLabel;
    target.title = romLabel;
  }

  playerState.set(playerId, {
    ...(playerState.get(playerId) || {}),
    romLabel,
  });
  updateDuoOverview();
}

function applyRemotePlayerState(player, state = {}) {
  const playerId = String(player || "");
  if (!playerId || !statuses.has(playerId)) {
    return;
  }

  const localRole = getPreferredRole();
  const incomingLabel = String(state.label || "");
  const label = localRole && playerId !== localRole && incomingLabel === "No controle"
    ? "Recebendo"
    : incomingLabel;
  const nextState = {
    ...(playerState.get(playerId) || {}),
    ...state,
    ...(label ? { label } : {}),
  };
  playerState.set(playerId, nextState);

  if (nextState.label) {
    setPlayerStatus(playerId, nextState.label);
  }

  if (nextState.romLabel || nextState.detail?.romName) {
    setPlayerRomMeta(playerId, {
      ...(nextState.detail || {}),
      romLabel: nextState.romLabel,
    });
  }
}

function postToPlayer(player, action) {
  const frame = getFrame(player);
  frame?.contentWindow?.postMessage({
    source: "oakduo-shell",
    player: String(player),
    action,
  }, window.location.origin);
}

function setActivePlayer(player) {
  const playerId = String(player);
  const otherPlayerId = getOtherPlayer(playerId);
  const otherState = playerState.get(otherPlayerId);

  playerPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.playerPanel === playerId);
  });

  setPlayerStatus(playerId, "No controle");
  setPlayerStatus(otherPlayerId, otherState?.status === "running" ? "Rodando" : "Assistindo");
  if (activePlayerLabel) {
    activePlayerLabel.textContent = `Jogador ${playerId} no controle`;
  }
  sessionStorage.setItem("oakduoActivePlayer", playerId);
  setLastEvent(`Jogador ${playerId} assumiu controle`);
  cueOakBit(`Jogador ${playerId} no controle.`, "happy", 2200);
  sendPeerMessage("active-player", { player: playerId });
}

function focusPlayer(player) {
  if (!isLocalPlayer(player)) {
    setLastEvent(`Jogador ${player} pertence ao outro navegador`);
    cueOakBitOnce("remote-side-control", "Controle apenas o lado escolhido neste navegador. O outro lado chega pela transmissão.", "alert", 3200);
    return;
  }

  const frame = getFrame(player);
  if (!frame) {
    return;
  }

  frame.focus();
  frame.contentWindow?.focus();
  postToPlayer(player, "focus");
  setActivePlayer(player);
}

function chooseRom(player) {
  if (!isLocalPlayer(player)) {
    setLastEvent(`ROM do Jogador ${player} fica no outro navegador`);
    cueOakBitOnce("remote-side-rom", "Cada jogador escolhe a ROM no próprio lado. Depois use Transmitir para enviar a tela.", "alert", 3600);
    return;
  }

  const frame = getFrame(player);

  if (!frame?.contentWindow) {
    setPlayerStatus(player, "Carregando");
    return;
  }

  focusPlayer(player);
  setPlayerStatus(player, "Escolhendo");
  setLastEvent(`Jogador ${player} escolhendo ROM`);
  postToPlayer(player, "open-rom");
}

function reloadPlayer(player) {
  const frame = getFrame(player);
  if (!frame) {
    return;
  }

  setPlayerStatus(player, "Recarregando");
  frame.contentWindow?.location.reload();
}

function labelForDuoStatus(status) {
  const labels = {
    ready: "Pronto",
    choosing: "Escolhendo",
    selected: "ROM pronta",
    loading: "Iniciando",
    booting: "Boot",
    running: "Rodando",
    focused: "No controle",
    error: "Erro",
  };

  return labels[status] || "Pronto";
}

function handleDuoStatus(data) {
  const player = String(data.player || "");
  if (!player || !statuses.has(player)) {
    return;
  }

  const activePlayer = playerPanels.find((panel) => panel.classList.contains("is-active"))?.dataset.playerPanel;
  const label = data.status === "running" && activePlayer === player
    ? "No controle"
    : labelForDuoStatus(data.status);

  playerState.set(player, {
    status: data.status,
    label,
    detail: data.detail || {},
    romLabel: playerState.get(player)?.romLabel || "Nenhuma ROM carregada",
  });

  if (["selected", "loading", "booting", "running"].includes(data.status)) {
    setPlayerRomMeta(player, data.detail || {});
  }

  if (data.status === "ready") {
    setPlayerRomMeta(player);
  }

  setPlayerStatus(player, label);
  if (["selected", "loading", "booting", "running", "error"].includes(data.status)) {
    setLastEvent(`J${player}: ${label}`);
  }
  sendPeerMessage("player-status", {
    player,
    status: data.status,
    label,
    detail: data.detail || {},
    romLabel: playerState.get(player)?.romLabel || "Nenhuma ROM carregada",
  });
}

function encodeSignal(description) {
  return btoa(JSON.stringify({
    room: syncRoomCode(),
    description,
  }));
}

function decodeSignal(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    throw new Error("empty-signal");
  }

  let signal = null;
  try {
    signal = JSON.parse(atob(rawValue));
  } catch (error) {
    throw new Error("invalid-signal");
  }

  const description = signal?.description || signal;
  if (!description?.type || !description?.sdp) {
    throw new Error("invalid-signal");
  }

  if (signal?.description) {
    return signal;
  }

  return {
    room: "",
    description: signal,
  };
}

function getRemoteSignalValue() {
  return normalizeSignalText(remoteSignal?.value || "");
}

function getLocalSignalValue() {
  return normalizeSignalText(localSignal?.value || "");
}

function hasOwnSignalInRemoteBox() {
  const remoteValue = getRemoteSignalValue();
  const localValue = getLocalSignalValue();
  return Boolean(remoteValue && localValue && remoteValue === localValue);
}

function guardRemoteSignal() {
  if (!hasOwnSignalInRemoteBox()) {
    return true;
  }

  setPeerStatus("Código repetido");
  setLastEvent("Você colou seu próprio código");
  cueOakBitOnce("own-signal", "Esse é o seu próprio código. Cole o código enviado pelo outro navegador.", "alert", 4200);
  return false;
}

function guardSignalRoom(signal) {
  const signalRoom = String(signal?.room || "").trim().toUpperCase();
  const currentRoom = syncRoomCode();
  if (!signalRoom || signalRoom === currentRoom) {
    return true;
  }

  setPeerStatus("Sala diferente");
  setLastEvent("Código de outra sala");
  cueOakBitOnce("signal-room-mismatch", "Esse código pertence a outra sala. Peça um novo código para a sala atual.", "alert", 4400);
  return false;
}

function guardSignalType(signal, expectedType) {
  const type = signal?.description?.type || "";
  if (type === expectedType) {
    return true;
  }

  const expectedLabel = expectedType === "offer" ? "oferta" : "resposta";
  setPeerStatus("Código errado");
  setLastEvent(`Cole uma ${expectedLabel}`);
  cueOakBitOnce(`signal-type-${expectedType}`, `Esse campo precisa de uma ${expectedLabel}. Confira se o outro jogador enviou o código certo.`, "alert", 4400);
  return false;
}

function waitForIceGathering(connection) {
  if (connection.iceGatheringState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, 5000);
    connection.addEventListener("icegatheringstatechange", () => {
      if (connection.iceGatheringState === "complete") {
        window.clearTimeout(timeout);
        resolve();
      }
    });
  });
}

function closePeerConnection({ clearSignals = false } = {}) {
  peerConnectionToken += 1;
  window.clearTimeout(reconnectTimer);
  reconnectTimer = 0;
  stopStreamAnnouncer();
  resetSetupReadyState();
  resetStreamingState();
  dataChannel?.close();
  peerConnection?.close();
  dataChannel = null;
  peerConnection = null;
  if (clearSignals) {
    if (localSignal) {
      localSignal.value = "";
    }
    if (remoteSignal) {
      remoteSignal.value = "";
    }
    clearSignalDrafts();
  }
  setPeerStatus("Desconectado");
  setLastEvent("Conexão encerrada");
}

function getActivePlayerId() {
  return playerPanels.find((panel) => panel.classList.contains("is-active"))?.dataset.playerPanel || "1";
}

function findCanvasInDocument(doc) {
  const canvas = doc?.querySelector("#emulatorjs-player canvas, canvas");
  if (canvas) {
    return canvas;
  }

  const frames = [...(doc?.querySelectorAll("iframe") || [])];
  for (const frame of frames) {
    try {
      const nestedCanvas = findCanvasInDocument(frame.contentDocument);
      if (nestedCanvas) {
        return nestedCanvas;
      }
    } catch (error) {
      // Cross-origin frames cannot be inspected.
    }
  }

  return null;
}

function getPlayerCanvas(player) {
  const frame = getFrame(player);
  try {
    return findCanvasInDocument(frame?.contentDocument);
  } catch (error) {
    return null;
  }
}

function clearRemotePlayerStream(player = remoteStreamingPlayer) {
  if (player) {
    const video = remotePlayerVideos.get(String(player));
    if (video) {
      video.srcObject = null;
    }
    const badge = remotePlayerBadges.get(String(player));
    if (badge) {
      badge.textContent = `Recebendo J${player}`;
    }
    playerPanels
      .find((panel) => panel.dataset.playerPanel === String(player))
      ?.classList.remove("is-remote-streaming");
  }
  remoteStreamingPlayer = "";
  updateDuoOverview();
}

function resetStreamingState() {
  stopScreenShare();
  clearRemotePlayerStream();
  streamingPlayer = "";
  pendingRemoteStream = null;
  pendingRemoteStreams.clear();
  remoteStreamingPlayer = "";
  updateDuoOverview();
}

function attachRemotePlayerStream(player, stream = pendingRemoteStreams.get(String(player || "")) || pendingRemoteStream) {
  const playerId = String(player || "");
  const video = remotePlayerVideos.get(playerId);
  if (!video || !stream) {
    return;
  }

  if (remoteStreamingPlayer === playerId && video.srcObject === stream) {
    playerPanels
      .find((panel) => panel.dataset.playerPanel === playerId)
      ?.classList.add("is-remote-streaming");
    return;
  }

  clearRemotePlayerStream();
  const badge = remotePlayerBadges.get(playerId);
  if (badge) {
    badge.textContent = `Recebendo J${playerId}`;
  }
  video.srcObject = stream;
  video.play?.().catch(() => {});
  playerPanels
    .find((panel) => panel.dataset.playerPanel === playerId)
    ?.classList.add("is-remote-streaming");
  remoteStreamingPlayer = playerId;
  setLastEvent(`Recebendo transmissão do J${playerId}`);
}

function sendPeerMessage(type, payload = {}) {
  if (dataChannel?.readyState !== "open") {
    return;
  }

  dataChannel.send(JSON.stringify({
    source: "oakduo-peer",
    type,
    room: syncRoomCode(),
    payload,
  }));
}

function getVideoSender() {
  return peerConnection
    ?.getTransceivers()
    .find((transceiver) => transceiver.sender && transceiver.receiver?.track?.kind === "video")
    ?.sender;
}

async function renegotiateVideo() {
  if (!peerConnection || dataChannel?.readyState !== "open" || isRenegotiating) {
    return;
  }

  isRenegotiating = true;
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await waitForIceGathering(peerConnection);
    sendPeerMessage("signal-offer", { description: peerConnection.localDescription });
  } finally {
    isRenegotiating = false;
  }
}

async function answerVideoRenegotiation(description) {
  if (!peerConnection || !description) {
    return;
  }

  await peerConnection.setRemoteDescription(description);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  await waitForIceGathering(peerConnection);
  sendPeerMessage("signal-answer", { description: peerConnection.localDescription });
}

async function applyVideoRenegotiationAnswer(description) {
  if (!peerConnection || !description) {
    return;
  }

  await peerConnection.setRemoteDescription(description);
}

function sendLocalSnapshot() {
  sendPeerMessage("snapshot", {
    role: getPreferredRole() || getActivePlayerId(),
    activePlayer: playerPanels.find((panel) => panel.classList.contains("is-active"))?.dataset.playerPanel || "1",
    streamingPlayer,
    players: Object.fromEntries(playerState),
  });
}

function sendLocalStreamState() {
  if (!streamingPlayer) {
    return;
  }

  sendPeerMessage("screen-share", { active: true, player: streamingPlayer });
}

function requestStreamResync() {
  sendPeerMessage("stream-resync-request", { player: getPreferredRole() || getActivePlayerId() });
}

function scheduleStreamResync() {
  [250, 900, 1800, 3200].forEach((delay) => {
    window.setTimeout(() => {
      requestStreamResync();
      sendLocalStreamState();
    }, delay);
  });
}

function startStreamAnnouncer() {
  if (streamAnnounceTimer) {
    return;
  }

  streamAnnounceTimer = window.setInterval(() => {
    if (!streamingPlayer || dataChannel?.readyState !== "open") {
      stopStreamAnnouncer();
      return;
    }
    sendLocalStreamState();
  }, 1500);
}

function stopStreamAnnouncer() {
  window.clearInterval(streamAnnounceTimer);
  streamAnnounceTimer = 0;
}

function handlePeerMessage(event) {
  let message = null;
  try {
    message = JSON.parse(event.data);
  } catch (error) {
    return;
  }

  if (message?.source !== "oakduo-peer") {
    return;
  }

  if (message.room && message.room !== syncRoomCode()) {
    setPeerStatus("Sala diferente");
    setLastEvent("Código de outra sala");
    cueOakBitOnce("room-mismatch", "Esse código pertence a outra sala. Confira o convite ou gere uma nova oferta.", "alert", 4200);
    return;
  }

  if (message.type === "hello") {
    setPeerStatus("Conectado");
    setLastEvent("Sessão conectada");
    sendLocalSnapshot();
    sendLocalStreamState();
  }

  if (message.type === "active-player") {
    setPeerStatus(`Conectado - remoto no J${message.payload?.player || "?"}`);
    setLastEvent(`Remoto no J${message.payload?.player || "?"}`);
  }

  if (message.type === "player-status") {
    applyRemotePlayerState(message.payload?.player, message.payload || {});
    setPeerStatus(`Conectado - J${message.payload?.player || "?"}: ${message.payload?.label || "status"}`);
    setLastEvent(`Remoto J${message.payload?.player || "?"}: ${message.payload?.label || "status"}`);
  }

  if (message.type === "snapshot") {
    const players = message.payload?.players || {};
    const remoteRole = String(message.payload?.role || "");
    if (remoteRole && players[remoteRole]) {
      applyRemotePlayerState(remoteRole, players[remoteRole]);
    }
    if (message.payload?.streamingPlayer) {
      remoteStreamingPlayer = String(message.payload.streamingPlayer);
      attachRemotePlayerStream(remoteStreamingPlayer);
    }
    setPeerStatus("Conectado - sessão sincronizada");
    setLastEvent("Sessão sincronizada");
  }

  if (message.type === "setup-ready") {
    remoteSetupReady = true;
    setLastEvent(`Jogador ${message.payload?.player || "remoto"} pronto`);
    sendLocalSnapshot();
    sendLocalStreamState();
    updateSetupState();
  }

  if (message.type === "stream-resync-request") {
    sendLocalSnapshot();
    sendLocalStreamState();
  }

  if (message.type === "screen-share") {
    const player = String(message.payload?.player || "");
    if (message.payload?.active) {
      remoteStreamingPlayer = player;
      attachRemotePlayerStream(player);
      setPeerStatus(`Recebendo emulador J${player || "?"}`);
      setLastEvent(`Recebendo emulador J${player || "?"}`);
      return;
    }

    clearRemotePlayerStream(player);
    setPeerStatus("Emulador remoto pausado");
    setLastEvent("Transmissão remota pausada");
  }

  if (message.type === "signal-offer") {
    answerVideoRenegotiation(message.payload?.description)
      .then(() => {
        setPeerStatus("Video remoto sincronizado");
        setLastEvent("Vídeo remoto sincronizado");
      })
      .catch(() => {
        setPeerStatus("Falha ao sincronizar video");
        setLastEvent("Falha ao sincronizar vídeo");
      });
  }

  if (message.type === "signal-answer") {
    applyVideoRenegotiationAnswer(message.payload?.description)
      .then(() => {
        setPeerStatus("Video remoto sincronizado");
        setLastEvent("Vídeo remoto sincronizado");
      })
      .catch(() => {
        setPeerStatus("Falha ao receber video");
        setLastEvent("Falha ao receber vídeo");
      });
  }
}

function bindDataChannel(channel) {
  dataChannel = channel;
  dataChannel.addEventListener("open", () => {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = 0;
    setPeerStatus("Conectado");
    setLastEvent("Canal de dados conectado");
    sendPeerMessage("hello", { room: syncRoomCode() });
    sendLocalSnapshot();
    sendLocalStreamState();
  });
  dataChannel.addEventListener("close", () => {
    if (peerConnection?.connectionState === "connected") {
      return;
    }
    handleConnectionProblem("Reconectando", "Canal de dados fechado", "A conexão com o outro jogador caiu. Gere uma nova oferta na mesma sala se ela não voltar.");
  });
  dataChannel.addEventListener("error", () => {
    handleConnectionProblem("Erro WebRTC", "Erro no canal WebRTC", "A conexão WebRTC encontrou um erro. Gere uma nova oferta para recuperar a sessão.");
  });
  dataChannel.addEventListener("message", handlePeerMessage);
}

function createPeerConnection() {
  closePeerConnection();
  const connectionToken = peerConnectionToken;
  peerConnection = new RTCPeerConnection(peerConfig);
  peerConnection.addTransceiver("video", { direction: "sendrecv" });
  peerConnection.addEventListener("track", (event) => {
    if (connectionToken !== peerConnectionToken) {
      return;
    }

    if (event.track.kind !== "video") {
      return;
    }

    const [remoteStream] = event.streams;
    pendingRemoteStream = remoteStream || new MediaStream([event.track]);
    if (remoteStreamingPlayer) {
      attachRemotePlayerStream(remoteStreamingPlayer, pendingRemoteStream);
    }
    setPeerStatus("Emulador remoto recebido");
  });
  peerConnection.addEventListener("connectionstatechange", () => {
    if (connectionToken !== peerConnectionToken) {
      return;
    }

    const state = peerConnection?.connectionState || "closed";
    const labels = {
      new: "Preparando",
      connecting: "Conectando",
      connected: "Conectado",
      disconnected: "Reconectando",
      failed: "Falhou",
      closed: "Desconectado",
    };
    setPeerStatus(labels[state] || state);
    if (state === "connected") {
      window.clearTimeout(reconnectTimer);
      reconnectTimer = 0;
      setLastEvent("Conexão recuperada");
      return;
    }
    if (state === "disconnected") {
      window.clearTimeout(reconnectTimer);
      setLastEvent("Tentando recuperar conexão");
      setSetupOpen(true);
      updateSetupState();
      reconnectTimer = window.setTimeout(() => {
        if (peerConnection?.connectionState === "disconnected") {
          handleConnectionProblem("Falhou", "Reconexão não concluída", "O outro jogador pode ter fechado a aba ou perdido a rede. Gere uma nova oferta na mesma sala.");
        }
      }, 8000);
      cueOakBitOnce("connection-disconnected", "A conexão ficou instável. Mantenha a sala aberta por alguns segundos.", "alert", 3800);
    }
    if (state === "failed") {
      handleConnectionProblem("Falhou", "Conexão falhou", "A conexão falhou. Use a sala atual para gerar uma nova oferta.");
    }
  });
  peerConnection.addEventListener("iceconnectionstatechange", () => {
    if (connectionToken !== peerConnectionToken) {
      return;
    }

    if (peerConnection?.iceConnectionState === "failed") {
      handleConnectionProblem("Falhou", "Rota WebRTC falhou", "A rota de conexão falhou. Gere uma nova oferta para tentar outra rota.");
    }
  });
  peerConnection.addEventListener("datachannel", (event) => {
    if (connectionToken !== peerConnectionToken) {
      return;
    }

    bindDataChannel(event.channel);
  });
  return peerConnection;
}

async function shareScreen(player = getActivePlayerId()) {
  if (!peerConnection) {
    setPeerStatus("Conecte primeiro");
    setLastEvent("Conecte antes de transmitir");
    return;
  }

  const playerId = String(player);
  if (!isLocalPlayer(playerId)) {
    setLastEvent(`Jogador ${playerId} pertence ao outro navegador`);
    cueOakBitOnce("remote-side-stream", "Transmita apenas o seu lado. A tela do outro jogador aparece quando ele transmitir.", "alert", 3600);
    return;
  }

  const canvas = getPlayerCanvas(playerId);
  if (!canvas?.captureStream) {
    setLastEvent("Inicie a ROM antes de transmitir");
    updateSetupState();
    cueOakBitOnce("rom-not-ready", "A ROM ainda está iniciando. Espere a tela do jogo aparecer antes de transmitir.", "alert", 3600);
    return;
  }

  localScreenStream = canvas.captureStream(30);
  const [videoTrack] = localScreenStream.getVideoTracks();
  if (!videoTrack) {
    setLastEvent("Sem vídeo para transmitir");
    updateSetupState();
    return;
  }

  const sender = getVideoSender(playerId);

  if (!sender) {
    setLastEvent("Canal de vídeo ausente");
    updateSetupState();
    return;
  }

  await sender.replaceTrack(videoTrack);
  videoTrack.addEventListener("ended", () => {
    stopScreenShare();
  });
  streamingPlayer = playerId;
  setPeerStatus(`Transmitindo emulador J${playerId}`);
  setLastEvent(`Transmitindo emulador J${playerId}`);
  sendPeerMessage("screen-share", { active: true, player: playerId });
  sendLocalSnapshot();
  startStreamAnnouncer();
  await renegotiateVideo();
}

function stopScreenShare() {
  const stoppedPlayer = streamingPlayer;
  const tracks = localScreenStream?.getTracks() || [];
  tracks.forEach((track) => track.stop());
  localScreenStream = null;
  const sender = getVideoSender(stoppedPlayer || getActivePlayerId());
  void sender?.replaceTrack(null).catch(() => {});
  sendPeerMessage("screen-share", { active: false, player: stoppedPlayer });
  streamingPlayer = "";
  stopStreamAnnouncer();
  setLastEvent("Transmissão encerrada");
}

async function createOfferSignal() {
  cueOakBit("Criando oferta para o outro navegador.", "thinking", 2800);
  const connection = createPeerConnection();
  bindDataChannel(connection.createDataChannel("oakduo"));
  const offer = await connection.createOffer();
  await connection.setLocalDescription(offer);
  setPeerStatus("Coletando rota");
  await waitForIceGathering(connection);
  if (localSignal) {
    localSignal.value = encodeSignal(connection.localDescription);
    storeSignalDrafts();
  }
  setPeerStatus("Oferta pronta");
  setLastEvent("Oferta pronta para copiar");
  selectSignalText(localSignal);
}

async function acceptOfferSignal() {
  cueOakBit("Gerando resposta com o código recebido.", "thinking", 3000);
  if (!guardRemoteSignal()) {
    return;
  }

  const offerSignal = decodeSignal(remoteSignal?.value);
  if (!guardSignalRoom(offerSignal) || !guardSignalType(offerSignal, "offer")) {
    return;
  }
  if (offerSignal.room) {
    setRoomCode(offerSignal.room);
  }

  const connection = createPeerConnection();
  await connection.setRemoteDescription(offerSignal.description);
  const answer = await connection.createAnswer();
  await connection.setLocalDescription(answer);
  setPeerStatus("Coletando rota");
  await waitForIceGathering(connection);
  if (localSignal) {
    localSignal.value = encodeSignal(connection.localDescription);
    storeSignalDrafts();
  }
  setPeerStatus("Resposta pronta");
  setLastEvent("Resposta pronta para enviar");
  selectSignalText(localSignal);
}

async function applyAnswerSignal() {
  cueOakBit("Concluindo a conexão manual.", "thinking", 2600);
  if (!peerConnection) {
    setPeerStatus("Crie oferta primeiro");
    setLastEvent("Crie uma oferta antes da resposta");
    return;
  }

  if (!guardRemoteSignal()) {
    return;
  }

  const answerSignal = decodeSignal(remoteSignal?.value);
  if (!guardSignalRoom(answerSignal) || !guardSignalType(answerSignal, "answer")) {
    return;
  }
  if (answerSignal.room) {
    setRoomCode(answerSignal.room);
  }

  await peerConnection.setRemoteDescription(answerSignal.description);
  setPeerStatus("Conectando");
  setLastEvent("Resposta aplicada");
}

async function copyLocalSignal() {
  const signal = localSignal?.value?.trim();
  if (!signal) {
    setPeerStatus("Sem código");
    setLastEvent("Nenhum código para copiar");
    return;
  }

  try {
    await navigator.clipboard.writeText(signal);
    setPeerStatus("Código copiado");
    setLastEvent("Código copiado");
    flashButtonLabel(copySignalButton, "Código copiado");
    if (peerConnection?.connectionState !== "connected") {
      remoteSignal?.focus();
    }
  } catch (error) {
    window.prompt("Copie o código WebRTC:", signal);
  }
}

async function runPeerAction(action) {
  if (isPeerActionRunning) {
    return;
  }

  isPeerActionRunning = true;
  updateDuoOverview();
  setPeerStatus("Processando");
  try {
    await action();
  } catch (error) {
    setPeerStatus("Falha no código");
    setLastEvent("Código inválido ou incompleto");
    cueOakBitOnce("invalid-signal", "Não consegui ler esse código. Confira se ele foi copiado inteiro.", "alert", 3800);
  } finally {
    isPeerActionRunning = false;
    updateDuoOverview();
  }
}

document.addEventListener("click", (event) => {
  const roleButton = event.target.closest("[data-oakduo-role]");
  if (roleButton) {
    completeSetup(roleButton.dataset.oakduoRole);
    return;
  }

  const setupButton = event.target.closest("[data-setup-action]");
  if (setupButton) {
    const action = setupButton.dataset.setupAction;
    const role = getPreferredRole() || "1";
    if (action === "continue") {
      const progress = getSetupProgress();
      if (!progress.done) {
        updateSetupState();
        return;
      }

      sessionStorage.setItem(SETUP_STORAGE_KEY, "true");
      setSetupOpen(false);
      focusPlayer(role);
    } else if (action === "new-session") {
      sessionStorage.removeItem(SETUP_STORAGE_KEY);
      sessionStorage.removeItem(ROLE_STORAGE_KEY);
      resetSetupReadyState();
      createNewRoom();
      setSetupOpen(true);
      updateSetupState();
    } else if (action === "copy-invite") {
      copyInvite();
    } else if (action === "create-offer") {
      runPeerAction(createOfferSignal);
    } else if (action === "accept-offer") {
      runPeerAction(acceptOfferSignal);
    } else if (action === "copy-signal") {
      copyLocalSignal();
    } else if (action === "apply-answer") {
      runPeerAction(applyAnswerSignal);
    } else if (action === "choose-rom") {
      chooseRom(role);
    } else if (action === "stream") {
      focusPlayer(role);
      runPeerAction(() => shareScreen(role));
    }
    return;
  }

  const button = event.target.closest("[data-oakduo-action]");
  if (!button) {
    return;
  }

  const player = button.dataset.player;
  const action = button.dataset.oakduoAction;

  if (action === "rom") {
    chooseRom(player);
  } else if (action === "focus") {
    focusPlayer(player);
  } else if (action === "stream") {
    focusPlayer(player);
    runPeerAction(() => shareScreen(player));
  } else if (action === "reload") {
    reloadPlayer(player);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }

  if (handlePokedexShortcut(event)) {
    return;
  }

  if (event.key === "1") {
    event.preventDefault();
    focusPlayer("1");
  }

  if (event.key === "2") {
    event.preventDefault();
    focusPlayer("2");
  }
});

fullscreenButton?.addEventListener("click", async () => {
  if (!document.fullscreenElement && stage?.requestFullscreen) {
    await stage.requestFullscreen();
    fullscreenButton.textContent = "Sair da tela cheia";
    return;
  }

  if (document.exitFullscreen) {
    await document.exitFullscreen();
    fullscreenButton.textContent = "Tela cheia";
  }
});

document.addEventListener("fullscreenchange", () => {
  syncPokedexFullscreenHost();
  if (fullscreenButton) {
    fullscreenButton.textContent = document.fullscreenElement ? "Sair da tela cheia" : "Tela cheia";
  }
  if (!document.fullscreenElement && document.body.classList.contains("is-pokedex-open")) {
    void setPokedexOpen(false);
  }
});

async function copyInvite() {
  const roomCode = syncRoomCode();
  const inviteUrl = new URL(window.location.href);
  inviteUrl.searchParams.set("room", roomCode);
  const invite = [
    `OakDuo ${roomCode}`,
    "Dois emuladores lado a lado no OakRom.",
    "1. Abra o link no outro navegador.",
    "2. Use Conexão manual para trocar oferta e resposta.",
    "3. Depois transmita o emulador do seu lado:",
    inviteUrl.toString(),
  ].join("\n");

  try {
    await navigator.clipboard.writeText(invite);
    flashButtonLabel(copyInviteButton, "Convite copiado", 1800);
    setLastEvent("Convite copiado");
    cueOakBit("Convite copiado com sala e passos rápidos.", "happy", 2600);
  } catch (error) {
    window.prompt("Copie o convite do OakDuo:", invite);
  }
}

copyInviteButton?.addEventListener("click", copyInvite);
newRoomButton?.addEventListener("click", createNewRoom);
createOfferButton?.addEventListener("click", () => runPeerAction(createOfferSignal));
acceptOfferButton?.addEventListener("click", () => runPeerAction(acceptOfferSignal));
applyAnswerButton?.addEventListener("click", () => runPeerAction(applyAnswerSignal));
stopScreenButton?.addEventListener("click", stopScreenShare);
copySignalButton?.addEventListener("click", (event) => {
  if (event.currentTarget?.dataset?.setupAction) {
    return;
  }

  runPeerAction(copyLocalSignal);
});
disconnectPeerButton?.addEventListener("click", () => closePeerConnection({ clearSignals: true }));
remoteSignal?.addEventListener("input", () => {
  storeSignalDrafts();
  recoverPeerStatusAfterSignalEdit();
  setLastEvent(remoteSignal.value.trim() ? "Código recebido colado" : "Código recebido vazio");
});
remoteSignal?.addEventListener("paste", (event) => {
  const pastedText = event.clipboardData?.getData("text") || "";
  const normalizedText = normalizeSignalText(pastedText);
  if (!normalizedText || normalizedText === pastedText) {
    return;
  }

  event.preventDefault();
  remoteSignal.value = normalizedText;
  storeSignalDrafts();
  recoverPeerStatusAfterSignalEdit();
  setLastEvent("Código recebido limpo");
});
remoteSignal?.addEventListener("keydown", (event) => {
  if (!(event.ctrlKey || event.metaKey) || event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  if (peerConnection) {
    runPeerAction(applyAnswerSignal);
    return;
  }

  runPeerAction(acceptOfferSignal);
});
localSignal?.addEventListener("input", () => {
  storeSignalDrafts();
  updateDuoOverview();
});
localSignal?.addEventListener("focus", () => selectSignalText(localSignal));
localSignal?.addEventListener("click", () => selectSignalText(localSignal));
pokedexToggle?.addEventListener("click", () => {
  setPokedexFrameSource();
  void setPokedexOpen(!document.body.classList.contains("is-pokedex-open"));
});
pokedexClose?.addEventListener("click", () => {
  void setPokedexOpen(false);
});
pokedexVoiceButton?.addEventListener("click", startPokedexVoiceCommand);

pokedexFrame?.addEventListener("load", () => {
  try {
    const frameWindow = pokedexFrame.contentWindow;
    const frameDocument = pokedexFrame.contentDocument;
    if (!frameWindow || !frameDocument || frameDocument.body?.dataset.oakduoDexShortcutsBound === "true") {
      return;
    }

    frameDocument.body.dataset.oakduoDexShortcutsBound = "true";
    frameWindow.addEventListener("keydown", (event) => {
      handlePokedexShortcut(event, frameWindow);
    });
  } catch (error) {
    // Same-origin iframe shortcuts are a convenience; skip if the browser blocks access.
  }
});

if (pokedexVoiceButton && PokedexSpeechRecognitionApi) {
  pokedexVoiceRecognition = new PokedexSpeechRecognitionApi();
  pokedexVoiceRecognition.lang = "pt-BR";
  pokedexVoiceRecognition.interimResults = false;
  pokedexVoiceRecognition.maxAlternatives = 1;
  pokedexVoiceRecognition.addEventListener("start", () => {
    pokedexVoiceButton.textContent = "Ouvindo";
    window.OakMascot?.listen?.(true);
    cueOakBit('Estou ouvindo. Diga "abrir pokédex" ou "buscar pikachu na pokédex".', "thinking", 4200);
  });
  pokedexVoiceRecognition.addEventListener("end", () => {
    pokedexVoiceButton.textContent = "Voz";
    window.OakMascot?.listen?.(false);
  });
  pokedexVoiceRecognition.addEventListener("result", (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? "";
    cueOakBit("Comando de voz recebido.", "happy", 2200);
    handlePokedexVoiceCommand(transcript);
  });
  pokedexVoiceRecognition.addEventListener("error", () => {
    pokedexVoiceButton.textContent = "Voz";
    window.OakMascot?.listen?.(false);
    cueOakBit("Não consegui ouvir o comando.", "alert", 2600);
  });
} else if (pokedexVoiceButton) {
  pokedexVoiceButton.disabled = true;
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }

  const data = event.data || {};
  if (data.source === "oakduo-emulator") {
    handleDuoStatus(data);
  }
});

window.addEventListener("beforeunload", (event) => {
  if (!hasActiveDuoSession()) {
    return;
  }

  event.preventDefault();
  event.returnValue = "";
});

["1", "2"].forEach((player) => {
  const frame = getFrame(player);
  frame?.addEventListener("load", () => {
    setPlayerStatus(player, "Pronto");
    setPlayerRomMeta(player);
    window.setTimeout(updateSetupState, 300);
    window.setTimeout(updateSetupState, 1200);
  });
});

syncRoomCode();
if (didReloadPage) {
  prepareReloadedSession();
} else {
  restoreSignalDrafts();
}
applyButtonIcons();
setActivePlayer(sessionStorage.getItem(ROLE_STORAGE_KEY) || sessionStorage.getItem("oakduoActivePlayer") || "1");
initializeSetup();
updateDuoOverview();
window.setTimeout(() => {
  cueOakBit("OakDuo pronto. Eu fico aqui para ajudar com lado, convite, conexão e transmissão.", "happy", 4600);
}, 700);
