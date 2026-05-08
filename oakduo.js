const stage = document.querySelector("#oakduo-stage");
const fullscreenButton = document.querySelector("#oakduo-fullscreen");
const copyInviteButton = document.querySelector("#oakduo-copy-invite");
const newRoomButton = document.querySelector("#oakduo-new-room");
const activePlayerLabel = document.querySelector("#oakduo-active-player");
const roomCodeLabel = document.querySelector("#oakduo-room-code");
const stripCodeLabel = document.querySelector("#oakduo-strip-code");
const peerStatus = document.querySelector("#oakduo-peer-status");
const localSignal = document.querySelector("#oakduo-local-signal");
const remoteSignal = document.querySelector("#oakduo-remote-signal");
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
const playerPanels = [...document.querySelectorAll("[data-player-panel]")];
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
let remoteStreamingPlayer = "";
let isRenegotiating = false;
let pokedexVoiceRecognition = null;
const PokedexSpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition || null;

function cueOakBit(message, mood = "happy", duration = 3200) {
  window.OakMascot?.setMode?.("emulator");
  window.OakMascot?.setContext?.({
    mode: "emulator",
    feature: "oakduo",
    room: roomCodeLabel?.textContent || "",
  });
  window.OakMascot?.say?.(message, mood, duration);
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
  setRoomCode(nextCode);
  setPeerStatus("Nova sala");
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
}

function setPeerStatus(message) {
  if (peerStatus) {
    peerStatus.textContent = message;
  }
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
}

function applyRemotePlayerState(player, state = {}) {
  const playerId = String(player || "");
  if (!playerId || !statuses.has(playerId)) {
    return;
  }

  const nextState = {
    ...(playerState.get(playerId) || {}),
    ...state,
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
  const otherPlayerId = playerId === "1" ? "2" : "1";
  const otherState = playerState.get(otherPlayerId);

  playerPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.playerPanel === playerId);
  });

  setPlayerStatus(playerId, "No controle");
  setPlayerStatus(otherPlayerId, otherState?.status === "running" ? "Rodando" : "Assistindo");
  if (activePlayerLabel) {
    activePlayerLabel.textContent = `Jogador ${playerId} no controle`;
  }
  cueOakBit(`Jogador ${playerId} no controle.`, "happy", 2200);
  sendPeerMessage("active-player", { player: playerId });
}

function focusPlayer(player) {
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
  const frame = getFrame(player);

  if (!frame?.contentWindow) {
    setPlayerStatus(player, "Carregando");
    return;
  }

  focusPlayer(player);
  setPlayerStatus(player, "Escolhendo");
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
  const signal = JSON.parse(atob(String(value || "").trim()));
  if (signal?.description) {
    return signal;
  }

  return {
    room: "",
    description: signal,
  };
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

function closePeerConnection() {
  stopScreenShare();
  clearRemotePlayerStream();
  dataChannel?.close();
  peerConnection?.close();
  dataChannel = null;
  peerConnection = null;
  setPeerStatus("Desconectado");
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
    playerPanels
      .find((panel) => panel.dataset.playerPanel === String(player))
      ?.classList.remove("is-remote-streaming");
  }
  remoteStreamingPlayer = "";
}

function attachRemotePlayerStream(player, stream = pendingRemoteStream) {
  const playerId = String(player || "");
  const video = remotePlayerVideos.get(playerId);
  if (!video || !stream) {
    return;
  }

  clearRemotePlayerStream();
  video.srcObject = stream;
  playerPanels
    .find((panel) => panel.dataset.playerPanel === playerId)
    ?.classList.add("is-remote-streaming");
  remoteStreamingPlayer = playerId;
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
    activePlayer: playerPanels.find((panel) => panel.classList.contains("is-active"))?.dataset.playerPanel || "1",
    players: Object.fromEntries(playerState),
  });
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
    return;
  }

  if (message.type === "hello") {
    setPeerStatus("Conectado");
    sendLocalSnapshot();
  }

  if (message.type === "active-player") {
    setPeerStatus(`Conectado - remoto no J${message.payload?.player || "?"}`);
  }

  if (message.type === "player-status") {
    applyRemotePlayerState(message.payload?.player, message.payload || {});
    setPeerStatus(`Conectado - J${message.payload?.player || "?"}: ${message.payload?.label || "status"}`);
  }

  if (message.type === "snapshot") {
    const players = message.payload?.players || {};
    Object.entries(players).forEach(([player, state]) => {
      applyRemotePlayerState(player, state);
    });
    setPeerStatus("Conectado - sessão sincronizada");
  }

  if (message.type === "screen-share") {
    const player = String(message.payload?.player || "");
    if (message.payload?.active) {
      remoteStreamingPlayer = player;
      attachRemotePlayerStream(player);
      setPeerStatus(`Recebendo emulador J${player || "?"}`);
      return;
    }

    clearRemotePlayerStream(player);
    setPeerStatus("Emulador remoto pausado");
  }

  if (message.type === "signal-offer") {
    answerVideoRenegotiation(message.payload?.description)
      .then(() => setPeerStatus("Video remoto sincronizado"))
      .catch(() => setPeerStatus("Falha ao sincronizar video"));
  }

  if (message.type === "signal-answer") {
    applyVideoRenegotiationAnswer(message.payload?.description)
      .then(() => setPeerStatus("Video remoto sincronizado"))
      .catch(() => setPeerStatus("Falha ao receber video"));
  }
}

function bindDataChannel(channel) {
  dataChannel = channel;
  dataChannel.addEventListener("open", () => {
    setPeerStatus("Conectado");
    sendPeerMessage("hello", { room: syncRoomCode() });
    sendLocalSnapshot();
  });
  dataChannel.addEventListener("close", () => setPeerStatus("Desconectado"));
  dataChannel.addEventListener("error", () => setPeerStatus("Erro WebRTC"));
  dataChannel.addEventListener("message", handlePeerMessage);
}

function createPeerConnection() {
  closePeerConnection();
  peerConnection = new RTCPeerConnection(peerConfig);
  peerConnection.addTransceiver("video", { direction: "sendrecv" });
  peerConnection.addEventListener("track", (event) => {
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
    const state = peerConnection?.connectionState || "closed";
    const labels = {
      new: "Preparando",
      connecting: "Conectando",
      connected: "Conectado",
      disconnected: "Instavel",
      failed: "Falhou",
      closed: "Desconectado",
    };
    setPeerStatus(labels[state] || state);
  });
  peerConnection.addEventListener("datachannel", (event) => bindDataChannel(event.channel));
  return peerConnection;
}

async function shareScreen(player = getActivePlayerId()) {
  if (!peerConnection) {
    setPeerStatus("Conecte primeiro");
    return;
  }

  const playerId = String(player);
  const canvas = getPlayerCanvas(playerId);
  if (!canvas?.captureStream) {
    setPeerStatus("Inicie a ROM antes");
    return;
  }

  localScreenStream = canvas.captureStream(30);
  const [videoTrack] = localScreenStream.getVideoTracks();
  if (!videoTrack) {
    setPeerStatus("Sem video");
    return;
  }

  const sender = getVideoSender();

  if (!sender) {
    setPeerStatus("Canal de video ausente");
    return;
  }

  await sender.replaceTrack(videoTrack);
  videoTrack.addEventListener("ended", () => {
    stopScreenShare();
  });
  streamingPlayer = playerId;
  setPeerStatus(`Transmitindo emulador J${playerId}`);
  sendPeerMessage("screen-share", { active: true, player: playerId });
  await renegotiateVideo();
}

function stopScreenShare() {
  const tracks = localScreenStream?.getTracks() || [];
  tracks.forEach((track) => track.stop());
  localScreenStream = null;
  const sender = getVideoSender();
  void sender?.replaceTrack(null).catch(() => {});
  sendPeerMessage("screen-share", { active: false, player: streamingPlayer });
  streamingPlayer = "";
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
  }
  setPeerStatus("Oferta pronta");
}

async function acceptOfferSignal() {
  cueOakBit("Gerando resposta com o código recebido.", "thinking", 3000);
  const offerSignal = decodeSignal(remoteSignal?.value);
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
  }
  setPeerStatus("Resposta pronta");
}

async function applyAnswerSignal() {
  cueOakBit("Concluindo a conexão manual.", "thinking", 2600);
  if (!peerConnection) {
    setPeerStatus("Crie oferta primeiro");
    return;
  }

  const answerSignal = decodeSignal(remoteSignal?.value);
  if (answerSignal.room) {
    setRoomCode(answerSignal.room);
  }

  await peerConnection.setRemoteDescription(answerSignal.description);
  setPeerStatus("Conectando");
}

async function copyLocalSignal() {
  const signal = localSignal?.value?.trim();
  if (!signal) {
    setPeerStatus("Sem código");
    return;
  }

  try {
    await navigator.clipboard.writeText(signal);
    setPeerStatus("Código copiado");
  } catch (error) {
    window.prompt("Copie o código WebRTC:", signal);
  }
}

async function runPeerAction(action) {
  try {
    await action();
  } catch (error) {
    setPeerStatus("Falha no código");
  }
}

document.addEventListener("click", (event) => {
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
    "Abra o link, conecte pela sala manual e transmita o emulador do seu lado:",
    inviteUrl.toString(),
  ].join("\n");

  try {
    await navigator.clipboard.writeText(invite);
    if (copyInviteButton) {
      copyInviteButton.textContent = "Convite copiado";
      window.setTimeout(() => {
        copyInviteButton.textContent = "Copiar convite";
      }, 1800);
    }
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
copySignalButton?.addEventListener("click", () => runPeerAction(copyLocalSignal));
disconnectPeerButton?.addEventListener("click", closePeerConnection);
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

["1", "2"].forEach((player) => {
  const frame = getFrame(player);
  frame?.addEventListener("load", () => {
    setPlayerStatus(player, "Pronto");
    setPlayerRomMeta(player);
  });
});

syncRoomCode();
setActivePlayer("1");
window.setTimeout(() => {
  cueOakBit("OakDuo pronto. Eu fico aqui para ajudar com sala, controle e conexão.", "happy", 4600);
}, 700);
