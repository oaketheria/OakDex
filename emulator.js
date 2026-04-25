const romInput = document.querySelector("#rom-input");
const romStatus =
  document.querySelector("#rom-status") || document.querySelector("#session-inline-status");
const romFileName =
  document.querySelector("#rom-file-name") || document.querySelector("#session-inline-rom");
const sessionTitle = document.querySelector("#session-title");
const sessionResumeHero = document.querySelector("#session-resume-hero");
const sessionResumeCover = document.querySelector("#session-resume-cover");
const sessionResumeKicker = document.querySelector("#session-resume-kicker");
const sessionResumeDetail = document.querySelector("#session-resume-detail");
const sessionResumeTags = document.querySelector("#session-resume-tags");
const sessionInlineStatus = document.querySelector("#session-inline-status");
const sessionInlineRom = document.querySelector("#session-inline-rom");
const launcherSessionStatus = document.querySelector("#launcher-session-status");
const launcherRomName = document.querySelector("#launcher-rom-name");
const launcherSaveStatus = document.querySelector("#launcher-save-status");
const launcherSaveDetail = document.querySelector("#launcher-save-detail");
const sessionSaveList = document.querySelector("#session-save-list");
const launcherRuntimeFlags = document.querySelector("#launcher-runtime-flags");
const launcherRuntimeDetail = document.querySelector("#launcher-runtime-detail");
const launcherPlaySummary = document.querySelector("#launcher-play-summary");
const launcherPlayDetail = document.querySelector("#launcher-play-detail");
const sessionExportSaveButton = document.querySelector("#session-export-save");
const sessionImportSaveButton = document.querySelector("#session-import-save");
const romLibraryList = document.querySelector("#rom-library-list");
const romLibraryCount = document.querySelector("#rom-library-count");
const romLibrarySearch = document.querySelector("#rom-library-search");
const romLibrarySort = document.querySelector("#rom-library-sort");
const romLibraryResults = document.querySelector("#rom-library-results");
const romLibraryFooter = document.querySelector("#rom-library-footer");
const romLibraryMore = document.querySelector("#rom-library-more");
const romLibraryFilters = [...document.querySelectorAll("[data-library-filter]")];
const recentRomList = document.querySelector("#recent-rom-list");
const clearLastRomButton = document.querySelector("#clear-last-rom");
const hudMode = document.querySelector("#hud-mode");
const screenBadge = document.querySelector(".screen-badge");
const screenBadgeInline = document.querySelector("#screen-badge-inline");
const emulatorRuntime = document.querySelector("#emulator-runtime");
const emulatorLoading = document.querySelector("#emulator-loading");
const emulatorError = document.querySelector("#emulator-error");
const emulatorErrorMessage = document.querySelector("#emulator-error-message");
const dockFullscreen = document.querySelector("#dock-fullscreen");
const emulatorNativeMenu = document.querySelector("#emulator-native-menu");
const integratedDexVoiceButton = document.querySelector("#integrated-dex-voice");
const saveImportInput = document.querySelector("#save-import-input");
const biosImportInput = document.querySelector("#bios-import-input");
const biosImportLabel = document.querySelector("#bios-import-label");
const playSpace = document.querySelector("#play-space");
const pokedexToggle = document.querySelector("#pokedex-toggle");
const pokedexClose = document.querySelector("#pokedex-close");
const pokedexPanel = document.querySelector("#emulator-pokedex-panel");
const pokedexFrame = document.querySelector("#emulator-pokedex-frame");
const launcherTabs = [...document.querySelectorAll(".launcher-tab")];
const launcherPanels = [...document.querySelectorAll(".launcher-panel")];
const pokedexOriginalParent = pokedexPanel?.parentElement || null;
const pokedexOriginalNextSibling = pokedexPanel?.nextSibling || null;

let activeRomUrl = "";
let activeBiosUrl = "";
let activeLoaderScript = null;
let emulationReady = false;
let emulationPaused = false;
let activeLauncherTab = "biblioteca";
let romLibrary = [];
let activeRomId = "";
let activeSupportsPokedex = false;
let activeBootToken = 0;
let romLibraryQuery = "";
let romLibrarySortMode = "recent";
let romLibraryExpanded = false;
let romLibraryFilter = "all";
let runtimeResizeInterval = null;
let activeSessionStartedAt = 0;
let integratedDexVoiceRecognition = null;

const IntegratedDexSpeechRecognitionApi =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const EMULATORJS_DATA_PATH = "https://cdn.emulatorjs.org/stable/data/";
const ROM_DB_NAME = "pokemon-emerald-gx";
const ROM_STORE_NAME = "rom-library";
const SAVE_STORE_NAME = "save-library";
const BIOS_STORE_NAME = "bios-library";
const LAST_ROM_STORAGE_KEY = "emulatorLastRomId";
const RECENT_ROMS_STORAGE_KEY = "emulatorRecentRoms";
const PENDING_ROM_BOOT_KEY = "emulatorPendingRomBoot";
const SESSION_META_STORAGE_KEY = "emulatorSessionMeta";
const DEFAULT_ROM_LINKS_STORAGE_KEY = "oakDefaultRomLinks";
const RECENT_ROMS_LIMIT = 3;
const ROM_LIBRARY_PAGE_SIZE = 6;

const EMULATOR_SYSTEMS = [
  { label: "GBA", name: "Game Boy Advance", core: "gba", extensions: ["gba"] },
  { label: "GB", name: "Game Boy", core: "gb", extensions: ["gb"] },
  { label: "GBC", name: "Game Boy Color", core: "gb", extensions: ["gbc"] },
  { label: "NES", name: "Nintendo Entertainment System", core: "nes", extensions: ["nes"] },
  { label: "SNES", name: "Super Nintendo", core: "snes", extensions: ["sfc", "smc"] },
  { label: "Mega Drive", name: "Mega Drive / Genesis", core: "segaMD", extensions: ["md", "gen"] },
  { label: "Master System", name: "Sega Master System", core: "segaMS", extensions: ["sms"] },
  { label: "Game Gear", name: "Sega Game Gear", core: "segaGG", extensions: ["gg"] },
  { label: "N64", name: "Nintendo 64", core: "n64", extensions: ["n64", "z64", "v64"] },
  { label: "PS1", name: "PlayStation 1", core: "psx", extensions: ["chd", "pbp", "iso", "bin"], biosId: "ps1-scph5501" },
];

function getRomExtension(fileName) {
  return String(fileName || "").split(".").pop()?.toLowerCase() || "";
}

function getSystemByFileName(fileName) {
  const extension = getRomExtension(fileName);
  return EMULATOR_SYSTEMS.find((system) => system.extensions.includes(extension)) || null;
}

function getRomSystem(entryOrFile) {
  const name = entryOrFile?.name || entryOrFile?.file?.name || "";
  if (entryOrFile?.system) {
    return EMULATOR_SYSTEMS.find((system) => system.label === entryOrFile.system) || getSystemByFileName(name) || EMULATOR_SYSTEMS[0];
  }
  return getSystemByFileName(name) || EMULATOR_SYSTEMS[0];
}

function getSupportedRomExtensionsLabel() {
  return EMULATOR_SYSTEMS.flatMap((system) => system.extensions.map((extension) => `.${extension}`)).join(", ");
}

function getRouteLocalRomId() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const romIndex = pathParts.lastIndexOf("rom");

  if (romIndex !== -1 && pathParts[romIndex + 1] === "local") {
    return decodeURIComponent(pathParts.slice(romIndex + 2).join("/"));
  }

  return "";
}

function getRouteDefaultRomId() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const romIndex = pathParts.lastIndexOf("rom");

  if (romIndex !== -1 && pathParts[romIndex + 1] && pathParts[romIndex + 1] !== "local") {
    return decodeURIComponent(pathParts[romIndex + 1]);
  }

  return "";
}

function loadDefaultRomLinks() {
  try {
    const saved = window.localStorage.getItem(DEFAULT_ROM_LINKS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

function saveDefaultRomLink(defaultRomId, localRomId) {
  if (!defaultRomId || !localRomId) {
    return;
  }

  try {
    const links = loadDefaultRomLinks();
    links[defaultRomId] = localRomId;
    window.localStorage.setItem(DEFAULT_ROM_LINKS_STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    // Ignore storage failures.
  }
}

function getLinkedDefaultRomId(defaultRomId) {
  const links = loadDefaultRomLinks();
  return links[defaultRomId] || "";
}

const LOCAL_ROM_COVER_MAP = {
  emerald: "assets/rom-covers/emerald.png.jfif",
  "fire red": "assets/rom-covers/fire-red.png.jfif",
  "leaf green": "assets/rom-covers/leaf-green.png.jfif",
  ruby: "assets/rom-covers/ruby.png.jfif",
  sapphire: "assets/rom-covers/sapphire.png.jfif",
};
const LOCAL_ROM_COVER_ALIASES = {
  emerald: ["emerald", "pokemon emerald"],
  "fire red": ["fire red", "firered", "pokemon fire red", "pokemon firered"],
  "leaf green": ["leaf green", "leafgreen", "pokemon leaf green", "pokemon leafgreen"],
  ruby: ["ruby", "pokemon ruby"],
  sapphire: ["sapphire", "pokemon sapphire"],
};

function setSessionBadgeText(value) {
  if (screenBadge) {
    screenBadge.textContent = value;
  }

  if (screenBadgeInline) {
    screenBadgeInline.textContent = value;
  }
}

function getEmulatorHost() {
  return document.querySelector("#emulatorjs-player");
}

function syncSessionSummary() {
  const statusText = romStatus?.textContent || "Sem ROM carregada";
  const romText = romFileName?.textContent || "Nenhum arquivo selecionado";

  if (launcherSessionStatus) {
    launcherSessionStatus.textContent = statusText;
  }

  if (launcherRomName) {
    launcherRomName.textContent = romText;
  }

  if (sessionInlineStatus) {
    sessionInlineStatus.textContent = statusText;
  }

  if (sessionInlineRom) {
    sessionInlineRom.textContent = romText;
  }

  if (launcherRuntimeFlags) {
    const flags = [];
    if (document.body.classList.contains("has-rom")) {
      flags.push("ROM ativa");
    }
    if (document.fullscreenElement) {
      flags.push("Tela cheia");
    }
    flags.push(emulationPaused ? "Pausado" : "Ao vivo");
    launcherRuntimeFlags.textContent = flags.join(" • ");
  }

  if (launcherRuntimeDetail) {
    launcherRuntimeDetail.textContent = document.fullscreenElement
      ? "Fullscreen ativo e sessao em destaque."
      : "Sessao local pronta para jogar neste navegador.";
  }

  syncSessionInsights();
}

function loadSessionMeta() {
  try {
    const saved = window.localStorage.getItem(SESSION_META_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

function saveSessionMeta(nextMeta) {
  try {
    const current = loadSessionMeta();
    window.localStorage.setItem(SESSION_META_STORAGE_KEY, JSON.stringify({ ...current, ...nextMeta }));
  } catch (error) {
    // Ignore storage failures.
  }
}

function getPendingPlaytimeMap() {
  const sessionMeta = loadSessionMeta();
  return sessionMeta.pendingPlaytime && typeof sessionMeta.pendingPlaytime === "object"
    ? sessionMeta.pendingPlaytime
    : {};
}

function savePendingPlaytimeMap(pendingPlaytime) {
  saveSessionMeta({ pendingPlaytime });
}

function queuePendingPlaytime(romId, elapsedMinutes, lastPlayedAt = Date.now()) {
  if (!romId || !elapsedMinutes) {
    return;
  }

  const pendingPlaytime = getPendingPlaytimeMap();
  const current = pendingPlaytime[romId] || { minutes: 0, lastPlayedAt: 0 };

  pendingPlaytime[romId] = {
    minutes: Number(current.minutes || 0) + Number(elapsedMinutes || 0),
    lastPlayedAt: Math.max(Number(current.lastPlayedAt || 0), Number(lastPlayedAt || 0)),
  };

  savePendingPlaytimeMap(pendingPlaytime);
}

function consumeElapsedSessionMinutes() {
  if (!activeSessionStartedAt) {
    return 0;
  }

  const elapsedMs = Math.max(Date.now() - activeSessionStartedAt, 0);
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  activeSessionStartedAt = Date.now() - (elapsedMs % 60000);
  return elapsedMinutes;
}

function formatRelativeTime(timestamp) {
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return "agora mesmo";
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(Math.round(diffMs / 60000), 0);

  if (diffMinutes < 1) {
    return "agora mesmo";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min atras`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} h atras`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} d atras`;
}

function getEntryEstimatedPlayMinutes(entry) {
  const storedMinutes = Number(entry?.playMinutes || 0);

  if (!entry?.id || entry.id !== activeRomId || !activeSessionStartedAt) {
    return storedMinutes;
  }

  const liveElapsedMinutes = Math.max(Math.ceil((Date.now() - activeSessionStartedAt) / 60000), 0);
  return storedMinutes + liveElapsedMinutes;
}

function inferRomVersion(name) {
  const normalized = formatRomTitle(name).toLowerCase();
  if (normalized.includes("emerald")) return "emerald";
  if (normalized.includes("fire red") || normalized.includes("firered")) return "fire red";
  if (normalized.includes("leaf green") || normalized.includes("leafgreen")) return "leaf green";
  if (normalized.includes("ruby")) return "ruby";
  if (normalized.includes("sapphire")) return "sapphire";
  return "other";
}

function getVersionLabel(version) {
  const labels = {
    emerald: "Emerald",
    "fire red": "Fire Red",
    "leaf green": "Leaf Green",
    ruby: "Ruby",
    sapphire: "Sapphire",
    other: "Outra ROM",
  };
  return labels[version] || "Outra ROM";
}

function syncSessionInsights() {
  const sessionMeta = loadSessionMeta();
  const lastSaveAction = sessionMeta.lastSaveAction || "";
  const lastSaveAt = Number(sessionMeta.lastSaveAt || 0);

  if (launcherSaveStatus) {
    launcherSaveStatus.textContent = lastSaveAction || "Nenhuma acao recente";
  }

  if (launcherSaveDetail) {
    launcherSaveDetail.textContent = lastSaveAction
      ? `Ultimo evento: ${formatRelativeTime(lastSaveAt)}.`
      : "Importacoes e exportacoes de save vao aparecer aqui.";
  }

  const latestPlayedEntry = [...romLibrary].sort((a, b) => (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0))[0];
  if (launcherPlaySummary) {
    launcherPlaySummary.textContent = latestPlayedEntry
      ? `${formatRomTitle(latestPlayedEntry.name)} • ${formatRelativeTime(latestPlayedEntry.lastPlayedAt || latestPlayedEntry.updatedAt || 0)}`
      : "Sem historico recente";
  }

  if (launcherPlayDetail) {
    const minutes = getEntryEstimatedPlayMinutes(latestPlayedEntry);
    launcherPlayDetail.textContent = latestPlayedEntry
      ? `Tempo local estimado: ${minutes ? `${minutes} min` : "ainda sem estimativa"}.`
      : "A ultima jogada e o tempo local estimado vao aparecer aqui.";
  }
}

function getActiveRomBaseName() {
  return formatRomTitle(romFileName?.textContent || sessionInlineRom?.textContent || sessionTitle?.textContent || "");
}

function matchesSaveToRom(saveName, romName) {
  const normalizedSave = normalizeIntegratedDexSearch(String(saveName || "").replace(/\.(sav|srm|state|slot)$/i, ""));
  const normalizedRom = normalizeIntegratedDexSearch(String(romName || "").replace(/\s*-\s*biblioteca local/i, ""));
  return Boolean(normalizedSave && normalizedRom && normalizedSave.includes(normalizedRom));
}

async function loadStoredSaves() {
  return withSaveStore("readonly", (store, resolve, reject, database) => {
    const request = store.getAll();

    request.addEventListener("success", () => {
      database.close();
      resolve(request.result || []);
    });

    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao listar saves."));
    });
  });
}

async function saveImportedSaveFile(file) {
  if (!(file instanceof File)) {
    return;
  }

  const linkedRomName = getActiveRomBaseName();
  const record = {
    id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`,
    name: file.name,
    size: file.size,
    linkedRomName,
    importedAt: Date.now(),
    file,
  };

  await withSaveStore("readwrite", (store, resolve, reject, database) => {
    const request = store.put(record);
    request.addEventListener("success", () => {
      database.close();
      resolve();
    });
    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao salvar save importado."));
    });
  });
}

async function getStoredSave(saveId) {
  return withSaveStore("readonly", (store, resolve, reject, database) => {
    const request = store.get(saveId);
    request.addEventListener("success", () => {
      database.close();
      resolve(request.result || null);
    });
    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao abrir save local."));
    });
  });
}

async function deleteStoredSave(saveId) {
  await withSaveStore("readwrite", (store, resolve, reject, database) => {
    const request = store.delete(saveId);
    request.addEventListener("success", () => {
      database.close();
      resolve();
    });
    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao remover save local."));
    });
  });
}

async function renderStoredSaves() {
  if (!sessionSaveList) {
    return;
  }

  try {
    const activeRomName = getActiveRomBaseName();
    const saves = await loadStoredSaves();
    const visibleSaves = saves
      .filter((entry) => !activeRomName || matchesSaveToRom(entry.linkedRomName || entry.name, activeRomName))
      .sort((first, second) => (second.importedAt || 0) - (first.importedAt || 0))
      .slice(0, 4);

    if (!visibleSaves.length) {
      sessionSaveList.innerHTML = '<p class="rom-library-empty">Nenhum save recente salvo neste navegador.</p>';
      return;
    }

    sessionSaveList.innerHTML = visibleSaves
      .map(
        (entry) => `
          <article class="session-save-item">
            <button type="button" class="session-save-load" data-load-save="${entry.id}">
              <strong>${entry.name}</strong>
              <span>${entry.linkedRomName || "ROM local"} • ${formatRelativeTime(entry.importedAt)}</span>
              <span>${formatBytes(entry.size)} • ${entry.name.split(".").pop()?.toUpperCase() || "SAVE"}</span>
            </button>
            <button type="button" class="session-save-remove" data-delete-save="${entry.id}" aria-label="Excluir save importado">Excluir</button>
          </article>
        `,
      )
      .join("");
  } catch (error) {
    sessionSaveList.innerHTML = '<p class="rom-library-empty">Nao foi possivel listar os saves locais.</p>';
  }
}

function setSessionTitleText(value) {
  if (sessionTitle) {
    sessionTitle.textContent = value;
  }
}

function renderSessionResumeHero(featuredEntry) {
  if (
    !sessionResumeHero ||
    !sessionResumeCover ||
    !sessionResumeKicker ||
    !sessionTitle ||
    !sessionResumeDetail ||
    !sessionResumeTags
  ) {
    return;
  }

  if (!featuredEntry) {
    sessionResumeHero.disabled = true;
    sessionResumeHero.removeAttribute("data-rom-launch");
    sessionResumeCover.innerHTML = "";
    sessionResumeKicker.textContent = "Emulador";
    sessionTitle.textContent = "Oak Emulator";
    sessionResumeDetail.textContent = "Sua proxima retomada vai aparecer aqui assim que voce jogar uma ROM.";
    sessionResumeTags.innerHTML = "";
    return;
  }

  const minutes = getEntryEstimatedPlayMinutes(featuredEntry);
  const progressLabel = minutes ? `${minutes} min locais` : "Sem tempo estimado";
  const version = inferRomVersion(featuredEntry.name);
  sessionResumeHero.disabled = false;
  sessionResumeHero.dataset.romLaunch = featuredEntry.id;
  sessionResumeCover.innerHTML = getRomCoverMarkup(featuredEntry);
  sessionResumeKicker.textContent = "Retomar agora";
  sessionTitle.textContent = getRomDisplayTitle(featuredEntry);
  sessionResumeDetail.textContent = `${featuredEntry.lastPlayedLabel || "Ultima sessao"} - ${progressLabel}`;
  sessionResumeTags.innerHTML = `
    ${version !== "other" ? `<span class="session-resume-tag">${getVersionLabel(version)}</span>` : ""}
    ${featuredEntry.favorite ? '<span class="session-resume-tag session-resume-tag-favorite">Favorita</span>' : ""}
    ${featuredEntry.id === activeRomId ? '<span class="session-resume-tag session-resume-tag-live">Em execucao</span>' : ""}
  `;
}

function syncLauncherTabs() {
  launcherTabs.forEach((button) => {
    const isActive = button.dataset.launcherTab === activeLauncherTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  launcherPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.launcherPanel === activeLauncherTab);
  });
}

function openRomLibraryDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB indisponivel neste navegador."));
      return;
    }

    const request = window.indexedDB.open(ROM_DB_NAME, 3);

    request.addEventListener("upgradeneeded", () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(ROM_STORE_NAME)) {
        database.createObjectStore(ROM_STORE_NAME, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(SAVE_STORE_NAME)) {
        database.createObjectStore(SAVE_STORE_NAME, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(BIOS_STORE_NAME)) {
        database.createObjectStore(BIOS_STORE_NAME, { keyPath: "id" });
      }
    });

    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error || new Error("Falha ao abrir IndexedDB.")));
  });
}

async function withRomStore(mode, callback) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ROM_STORE_NAME, mode);
    const store = transaction.objectStore(ROM_STORE_NAME);

    transaction.addEventListener("complete", () => {
      database.close();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao acessar a biblioteca local."));
    });

    try {
      callback(store, resolve, reject, database);
    } catch (error) {
      database.close();
      reject(error);
    }
  });
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "Tamanho indisponivel";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function createRomId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatRomTitle(fileName) {
  return String(fileName || "ROM local").replace(/\.(gba|gb|gbc|nes|sfc|smc|md|gen|sms|gg|n64|z64|v64|chd|pbp|iso|bin|zip|7z)$/i, "");
}

function getRomDisplayTitle(entryOrFile) {
  return entryOrFile?.displayTitle || formatRomTitle(entryOrFile?.name || entryOrFile?.file?.name || entryOrFile || "");
}

function saveLastRomSelection(romId) {
  try {
    if (romId) {
      window.localStorage.setItem(LAST_ROM_STORAGE_KEY, romId);
    } else {
      window.localStorage.removeItem(LAST_ROM_STORAGE_KEY);
    }
  } catch (error) {
    // Ignore storage failures.
  }
}

async function withSaveStore(mode, callback) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(SAVE_STORE_NAME, mode);
    const store = transaction.objectStore(SAVE_STORE_NAME);

    transaction.addEventListener("complete", () => {
      database.close();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao acessar a biblioteca de saves."));
    });

    try {
      callback(store, resolve, reject, database);
    } catch (error) {
      database.close();
      reject(error);
    }
  });
}

function getLastRomSelection() {
  try {
    return window.localStorage.getItem(LAST_ROM_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
}

function scheduleColdRomBoot(romId) {
  try {
    window.sessionStorage.setItem(PENDING_ROM_BOOT_KEY, romId);
  } catch (error) {
    // Ignore storage failures.
  }

  window.location.reload();
}

function getPendingColdRomBoot() {
  try {
    return window.sessionStorage.getItem(PENDING_ROM_BOOT_KEY) || "";
  } catch (error) {
    return "";
  }
}

function clearPendingColdRomBoot() {
  try {
    window.sessionStorage.removeItem(PENDING_ROM_BOOT_KEY);
  } catch (error) {
    // Ignore storage failures.
  }
}

function shouldColdBootRom(nextRomId) {
  return Boolean(activeRomId && nextRomId && activeRomId !== nextRomId);
}

function loadRecentRoms() {
  try {
    const saved = window.localStorage.getItem(RECENT_ROMS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveRecentRoms(entries) {
  try {
    window.localStorage.setItem(RECENT_ROMS_STORAGE_KEY, JSON.stringify(entries.slice(0, 8)));
  } catch (error) {
    // Ignore storage failures.
  }
}

function pushRecentRom(entry) {
  const nextEntries = [entry, ...loadRecentRoms().filter((item) => item.id !== entry.id)].slice(0, 6);
  saveRecentRoms(nextEntries);
}

function getSortedRomLibrary(entries) {
  const nextEntries = [...entries];

  if (romLibrarySortMode === "favorite") {
    nextEntries.sort((first, second) => {
      const favoriteDelta = Number(Boolean(second.favorite)) - Number(Boolean(first.favorite));
      if (favoriteDelta) {
        return favoriteDelta;
      }

      return (second.updatedAt || 0) - (first.updatedAt || 0);
    });
    return nextEntries;
  }

  if (romLibrarySortMode === "lastplayed") {
    nextEntries.sort((first, second) => (second.lastPlayedAt || 0) - (first.lastPlayedAt || 0));
    return nextEntries;
  }

  if (romLibrarySortMode === "az") {
    nextEntries.sort((first, second) => formatRomTitle(first.name).localeCompare(formatRomTitle(second.name), "pt-BR"));
    return nextEntries;
  }

  if (romLibrarySortMode === "size") {
    nextEntries.sort((first, second) => (second.size || 0) - (first.size || 0));
    return nextEntries;
  }

  nextEntries.sort((first, second) => (second.updatedAt || 0) - (first.updatedAt || 0));
  return nextEntries;
}

function getVisibleRomLibraryEntries() {
  const normalizedQuery = normalizeIntegratedDexSearch(romLibraryQuery);
  const filteredEntries = getSortedRomLibrary(romLibrary).filter((entry) => {
    const version = inferRomVersion(entry.name);
    const passesFilter = romLibraryFilter === "all" || romLibraryFilter === version;

    if (!passesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return normalizeIntegratedDexSearch(getRomDisplayTitle(entry)).includes(normalizedQuery);
  });

  const visibleEntries = romLibraryExpanded ? filteredEntries : filteredEntries.slice(0, ROM_LIBRARY_PAGE_SIZE);

  return {
    filteredEntries,
    visibleEntries,
  };
}

function hydrateRecentRomEntries(entries) {
  return entries.map((entry) => {
    const libraryMatch = romLibrary.find((item) => item.id === entry.id);

    if (!libraryMatch) {
      return entry;
    }

    return {
      ...entry,
      name: libraryMatch.name,
      playMinutes: libraryMatch.playMinutes || 0,
      lastPlayedAt: libraryMatch.lastPlayedAt || entry.lastPlayedAt || 0,
      favorite: Boolean(libraryMatch.favorite),
      coverUrl: libraryMatch.coverUrl || entry.coverUrl || "",
    };
  });
}

function getRomCoverMeta(fileName) {
  const normalized = String(fileName || "").toLowerCase();

  if (normalized.includes("emerald")) {
    return {
      accent: "emerald",
      label: "Hoenn",
      edition: "Emerald",
      mascot: "Rayquaza",
      gradient: "linear-gradient(135deg, #1fbf79 0%, #0c6f69 100%)",
    };
  }

  if (normalized.includes("fire") || normalized.includes("red")) {
    return {
      accent: "firered",
      label: "Kanto",
      edition: "Fire Red",
      mascot: "Charizard",
      gradient: "linear-gradient(135deg, #ff7a30 0%, #b33221 100%)",
    };
  }

  if (normalized.includes("leaf") || normalized.includes("green")) {
    return {
      accent: "leafgreen",
      label: "Kanto",
      edition: "Leaf Green",
      mascot: "Venusaur",
      gradient: "linear-gradient(135deg, #5ddb63 0%, #1f8f5b 100%)",
    };
  }

  if (normalized.includes("ruby")) {
    return {
      accent: "ruby",
      label: "Hoenn",
      edition: "Ruby",
      mascot: "Groudon",
      gradient: "linear-gradient(135deg, #ef476f 0%, #9d174d 100%)",
    };
  }

  if (normalized.includes("sapphire")) {
    return {
      accent: "sapphire",
      label: "Hoenn",
      edition: "Sapphire",
      mascot: "Kyogre",
      gradient: "linear-gradient(135deg, #58a6ff 0%, #2249a2 100%)",
    };
  }

  return {
    accent: "generic",
    label: getRomSystem({ name: fileName }).label,
    edition: "ROM local",
    mascot: "Adventure",
    gradient: "linear-gradient(135deg, #4dc3ff 0%, #2a4ea8 100%)",
  };
}

function isKnownPokemonRom(fileName) {
  const normalized = String(fileName || "").toLowerCase();

  return ["pokemon", "pokémon", "emerald", "fire", "red", "leaf", "green", "ruby", "sapphire", "unbound", "lazarus"].some((term) =>
    normalized.includes(term),
  );
}

function getSupportsPokedex(entryOrFile) {
  const name = entryOrFile?.name || entryOrFile?.title || entryOrFile?.file?.name || "";
  return Boolean(entryOrFile?.supportsPokedex ?? isKnownPokemonRom(name));
}

function setPokedexAvailable(available) {
  activeSupportsPokedex = Boolean(available);
  document.body.classList.toggle("has-pokedex-support", activeSupportsPokedex);

  if (pokedexToggle) {
    pokedexToggle.hidden = !activeSupportsPokedex;
    pokedexToggle.disabled = !activeSupportsPokedex;
    pokedexToggle.setAttribute("aria-hidden", String(!activeSupportsPokedex));
  }

  if (integratedDexVoiceButton) {
    integratedDexVoiceButton.hidden = !activeSupportsPokedex;
    integratedDexVoiceButton.disabled = !activeSupportsPokedex || !IntegratedDexSpeechRecognitionApi;
    integratedDexVoiceButton.setAttribute("aria-hidden", String(!activeSupportsPokedex));
  }

  if (!activeSupportsPokedex) {
    setPokedexOpen(false);
  }
}

function normalizeRomSearchQuery(fileName) {
  return String(fileName || "")
    .replace(/\.(gba|gb|gbc|nes|sfc|smc|md|gen|sms|gg|n64|z64|v64|chd|pbp|iso|bin)$/i, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\bwww\.[^\s]+/gi, " ")
    .replace(/\bromsportugues(?:\.com)?\b/gi, " ")
    .replace(/\b(portugues|portuguese|traduzido|translated|translation|br|ptbr|pt-br|rom|gba|gb|gbc|nes|snes|sfc|smc|md|gen|sms|gg|n64|z64|v64|ps1|psx|chd|pbp|iso|bin)\b/gi, " ")
    .replace(/pokemon/gi, "Pokemon ")
    .replace(/fire\s*red/gi, "Fire Red")
    .replace(/leaf\s*green/gi, "Leaf Green")
    .replace(/\b(version|edition)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRomCoverIdentity(fileName) {
  return normalizeRomSearchQuery(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getLocalRomCover(fileName) {
  const normalized = normalizeRomCoverIdentity(fileName);

  if (!normalized) {
    return "";
  }

  if (LOCAL_ROM_COVER_MAP[normalized]) {
    return LOCAL_ROM_COVER_MAP[normalized];
  }

  for (const [key, aliases] of Object.entries(LOCAL_ROM_COVER_ALIASES)) {
    if (aliases.some((alias) => normalized === alias || normalized.includes(alias))) {
      return LOCAL_ROM_COVER_MAP[key] || "";
    }
  }

  for (const [key, value] of Object.entries(LOCAL_ROM_COVER_MAP)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  return "";
}

function getResolvedRomCoverUrl(entry) {
  const fileName = typeof entry === "string" ? entry : entry?.name || "";
  const currentCoverUrl = typeof entry === "string" ? "" : String(entry?.coverUrl || "");
  const localCover = getLocalRomCover(fileName);

  if (localCover) {
    const localBaseName = localCover.replace(/\.[^.]+$/, "");
    const hasMatchingLocalAsset = currentCoverUrl.startsWith(localBaseName);

    if (hasMatchingLocalAsset) {
      return currentCoverUrl;
    }

    return localCover;
  }

  return currentCoverUrl;
}

async function findAvailableLocalRomCover(fileName) {
  return getLocalRomCover(fileName);
}

async function fetchAutomaticRomCover(fileName) {
  const localCover = await findAvailableLocalRomCover(fileName);

  if (localCover) {
    return localCover;
  }

  try {
    const query = normalizeRomSearchQuery(fileName);

    if (!query) {
      return "";
    }

    const response = await fetch(`/api/rom-cover?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      return "";
    }

    const payload = await response.json();
    return String(payload.coverUrl || "");
  } catch (error) {
    return "";
  }
}

function getRomCoverMarkup(entry) {
  const coverMeta = getRomCoverMeta(entry.name);
  const resolvedCoverUrl = getResolvedRomCoverUrl(entry);
  const coverStyle = resolvedCoverUrl ? "" : `background:${coverMeta.gradient}`;
  const mediaMarkup = resolvedCoverUrl
    ? `
      <div class="rom-cover-art">
        <img class="rom-cover-image" src="${resolvedCoverUrl}" alt="Capa da ROM ${getRomDisplayTitle(entry)}" loading="lazy" />
      </div>
    `
    : "";
  const contentMarkup = resolvedCoverUrl
    ? ""
    : `
      <div class="rom-cover-content">
        <span class="rom-cover-region">${coverMeta.label}</span>
        <div class="rom-cover-copy">
          <strong>${coverMeta.edition}</strong>
          <span>${coverMeta.mascot}</span>
        </div>
        <span class="rom-cover-system">${getRomSystem(entry).name}</span>
      </div>
    `;

  return `
    <div class="rom-cover rom-cover-${coverMeta.accent}${resolvedCoverUrl ? " has-image" : ""}" style="${coverStyle}">
      ${contentMarkup}
      ${mediaMarkup}
    </div>
  `;
}

function renderRecentRoms() {
  if (!recentRomList && !sessionResumeHero) {
    return;
  }

  const recentEntries = hydrateRecentRomEntries(loadRecentRoms()).slice(0, RECENT_ROMS_LIMIT);
  const resumeLabel = "Retomar";

  if (!recentEntries.length) {
    renderSessionResumeHero(null);
    if (recentRomList) {
      recentRomList.innerHTML = '<p class="rom-library-empty">Seu historico de jogos vai aparecer aqui.</p>';
    }
    return;
  }

  const [featuredEntry, ...queueEntries] = recentEntries;
  renderSessionResumeHero(featuredEntry);

  if (recentRomList) {
    recentRomList.innerHTML = queueEntries.length
      ? queueEntries
          .map(
            (entry) => `
        <button
          type="button"
          class="recent-rom-card${entry.id === activeRomId ? " is-active" : ""}"
          data-rom-launch="${entry.id}"
        >
          ${getRomCoverMarkup(entry)}
          <span class="recent-rom-copy">
            <strong>${getRomDisplayTitle(entry)}</strong>
            <span>${entry.lastPlayedLabel || "Ultima sessao"}</span>
          </span>
          <span class="rom-card-tag-row">
            <span class="rom-card-tag">${getRomSystem(entry).label}</span>
            <span class="rom-card-tag">${getVersionLabel(inferRomVersion(entry.name))}</span>
            ${entry.favorite ? '<span class="rom-card-tag rom-card-tag-favorite">Favorita</span>' : ""}
          </span>
          <span class="rom-card-badge-row">
            ${entry.id === activeRomId ? '<span class="rom-card-badge rom-card-badge-live">Em execucao</span>' : ""}
            <span class="rom-card-badge">${resumeLabel}</span>
          </span>
        </button>
      `,
          )
          .join("")
      : '<p class="rom-library-empty">A ROM principal da sessao ja esta destacada acima.</p>';
  }
}

function renderRomLibrary() {
  if (!romLibraryList || !romLibraryCount) {
    return;
  }

  const lastRomId = getLastRomSelection();
  const launchLabel = "Jogar";
  romLibraryCount.textContent =
    romLibrary.length === 1 ? "1 ROM salva" : romLibrary.length ? `${romLibrary.length} ROMs salvas` : "Nenhuma ROM salva";

  if (!romLibrary.length) {
    romLibraryList.innerHTML =
      '<p class="rom-library-empty">Envie uma ROM para criar sua biblioteca particular neste navegador.</p>';
    if (romLibraryResults) {
      romLibraryResults.textContent = "0 exibidos";
    }
    if (romLibraryFooter) {
      romLibraryFooter.hidden = true;
    }
    renderRecentRoms();
    return;
  }

  const { filteredEntries, visibleEntries } = getVisibleRomLibraryEntries();

  if (romLibraryResults) {
    const visibleLabel = `${visibleEntries.length} exibidos`;
    const totalLabel = filteredEntries.length === romLibrary.length ? "" : ` de ${filteredEntries.length}`;
    romLibraryResults.textContent = `${visibleLabel}${totalLabel}`;
  }

  if (!filteredEntries.length) {
    romLibraryList.innerHTML =
      '<p class="rom-library-empty">Nenhuma ROM encontrada nessa busca. Tente outro nome ou limpe o filtro.</p>';
    if (romLibraryFooter) {
      romLibraryFooter.hidden = true;
    }
    renderRecentRoms();
    return;
  }

  if (romLibraryFooter && romLibraryMore) {
    const isPaginated = filteredEntries.length > ROM_LIBRARY_PAGE_SIZE;
    romLibraryFooter.hidden = !isPaginated;
    romLibraryMore.textContent = romLibraryExpanded ? "Ver menos" : `Ver mais ${filteredEntries.length - visibleEntries.length}`;
  }

  romLibraryList.innerHTML = visibleEntries
    .map(
      (entry) => `
        <article class="rom-library-card${entry.id === lastRomId ? " is-last-used" : ""}${entry.id === activeRomId ? " is-active" : ""}">
          ${getRomCoverMarkup(entry)}
          <button type="button" class="rom-favorite-toggle${entry.favorite ? " is-active" : ""}" data-rom-favorite="${entry.id}" aria-label="${entry.favorite ? "Remover dos favoritos" : "Marcar como favorita"}">★</button>
          <div class="rom-library-card-copy">
            <strong>${getRomDisplayTitle(entry)}</strong>
            <span>${formatBytes(entry.size)}</span>
          </div>
          <div class="rom-card-tag-row">
            <span class="rom-card-tag">${entry.system || getRomSystem(entry).label}</span>
            <span class="rom-card-tag">${getVersionLabel(inferRomVersion(entry.name))}</span>
            ${entry.playMinutes ? `<span class="rom-card-tag">${entry.playMinutes} min</span>` : ""}
            ${entry.lastPlayedAt ? `<span class="rom-card-tag">Jogada ${formatRelativeTime(entry.lastPlayedAt)}</span>` : ""}
          </div>
          <div class="rom-card-badge-row">
            ${entry.id === activeRomId ? '<span class="rom-card-badge rom-card-badge-live">Em execucao</span>' : ""}
            ${entry.id === lastRomId ? '<span class="rom-card-badge">Ultima jogada</span>' : ""}
            ${entry.favorite ? '<span class="rom-card-badge">Favorita</span>' : ""}
          </div>
          <div class="rom-library-card-actions">
            <button type="button" class="library-card-button" data-rom-launch="${entry.id}">${launchLabel}</button>
            <button type="button" class="library-card-button is-secondary" data-rom-delete="${entry.id}">Remover</button>
          </div>
        </article>
      `,
    )
    .join("");

  renderRecentRoms();
}

function updateLibraryUnavailableState() {
  romLibrary = [];

  if (romLibraryList) {
    romLibraryList.innerHTML = '<p class="rom-library-empty">A biblioteca local nao esta disponivel neste navegador.</p>';
  }

  if (romLibraryCount) {
    romLibraryCount.textContent = "Biblioteca indisponivel";
  }

  if (romLibraryResults) {
    romLibraryResults.textContent = "Indisponivel";
  }

  if (romLibraryFooter) {
    romLibraryFooter.hidden = true;
  }

  if (recentRomList) {
    recentRomList.innerHTML = '<p class="rom-library-empty">Historico indisponivel neste navegador.</p>';
  }
}

async function loadRomLibrary() {
  try {
    romLibrary = await withRomStore("readonly", (store, resolve, reject, database) => {
      const request = store.getAll();

      request.addEventListener("success", () => {
        database.close();
        resolve(request.result || []);
      });

      request.addEventListener("error", () => {
        database.close();
        reject(request.error || new Error("Falha ao listar ROMs."));
      });
    });

    const pendingPlaytime = getPendingPlaytimeMap();
    const pendingIds = Object.keys(pendingPlaytime);

    if (pendingIds.length) {
      for (const entry of romLibrary) {
        const pendingEntry = pendingPlaytime[entry.id];

        if (!pendingEntry?.minutes) {
          continue;
        }

        entry.playMinutes = Number(entry.playMinutes || 0) + Number(pendingEntry.minutes || 0);
        entry.lastPlayedAt = Math.max(Number(entry.lastPlayedAt || 0), Number(pendingEntry.lastPlayedAt || 0));

        await withRomStore("readwrite", (store, resolve, reject, database) => {
          const request = store.put(entry);

          request.addEventListener("success", () => {
            database.close();
            resolve();
          });

          request.addEventListener("error", () => {
            database.close();
            reject(request.error || new Error("Falha ao reconciliar tempo jogado da ROM."));
          });
        });
      }

      savePendingPlaytimeMap({});
    }

    const mismatchedKnownPokemonCovers = romLibrary.filter(
      (entry) => entry.coverUrl && isKnownPokemonRom(entry.name),
    );

    if (mismatchedKnownPokemonCovers.length) {
      for (const entry of mismatchedKnownPokemonCovers) {
        entry.coverUrl = "";

        await withRomStore("readwrite", (store, resolve, reject, database) => {
          const request = store.put(entry);

          request.addEventListener("success", () => {
            database.close();
            resolve();
          });

          request.addEventListener("error", () => {
            database.close();
            reject(request.error || new Error("Falha ao corrigir capa da ROM."));
          });
        });
      }
    }

    for (const entry of romLibrary) {
      const localCover = await findAvailableLocalRomCover(entry.name);

      if (!localCover || entry.coverUrl === localCover) {
        continue;
      }

      entry.coverUrl = localCover;

      await withRomStore("readwrite", (store, resolve, reject, database) => {
        const request = store.put(entry);

        request.addEventListener("success", () => {
          database.close();
          resolve();
        });

        request.addEventListener("error", () => {
          database.close();
          reject(request.error || new Error("Falha ao aplicar capa local da ROM."));
        });
      });
    }

    const coverUsage = new Map();

    romLibrary.forEach((entry) => {
      if (!entry.coverUrl) {
        return;
      }

      const entries = coverUsage.get(entry.coverUrl) || [];
      entries.push(entry);
      coverUsage.set(entry.coverUrl, entries);
    });

    const duplicatedCoverEntries = [...coverUsage.values()]
      .filter((entries) => {
        if (entries.length < 2) {
          return false;
        }

        const identities = new Set(entries.map((entry) => normalizeRomCoverIdentity(entry.name)));
        return identities.size > 1;
      })
      .flat();

    if (duplicatedCoverEntries.length) {
      for (const entry of duplicatedCoverEntries) {
        entry.coverUrl = "";

        await withRomStore("readwrite", (store, resolve, reject, database) => {
          const request = store.put(entry);

          request.addEventListener("success", () => {
            database.close();
            resolve();
          });

          request.addEventListener("error", () => {
            database.close();
            reject(request.error || new Error("Falha ao limpar capas duplicadas."));
          });
        });
      }
    }

    const entriesNeedingCover = romLibrary.filter((entry) => !entry.coverUrl);

    if (entriesNeedingCover.length) {
      for (const entry of entriesNeedingCover) {
        const coverUrl = await fetchAutomaticRomCover(entry.name);

        if (!coverUrl) {
          continue;
        }

        entry.coverUrl = coverUrl;

        await withRomStore("readwrite", (store, resolve, reject, database) => {
          const request = store.put(entry);

          request.addEventListener("success", () => {
            database.close();
            resolve();
          });

          request.addEventListener("error", () => {
            database.close();
            reject(request.error || new Error("Falha ao atualizar capa da ROM."));
          });
        });
      }
    }

    romLibrary.sort((first, second) => (second.updatedAt || 0) - (first.updatedAt || 0));
    renderRomLibrary();
  } catch (error) {
    updateLibraryUnavailableState();
  }
}

async function saveRomToLibrary(file) {
  const coverUrl = await fetchAutomaticRomCover(file.name);
  const existingRecord = romLibrary.find((entry) => entry.id === createRomId(file));
  const system = getRomSystem(file);
  const record = {
    id: createRomId(file),
    name: file.name,
    system: system.label,
    systemName: system.name,
    emulatorCore: system.core,
    supportsPokedex: getSupportsPokedex(file),
    displayTitle: existingRecord?.displayTitle || "",
    size: file.size,
    updatedAt: Date.now(),
    coverUrl,
    favorite: existingRecord?.favorite || false,
    lastPlayedAt: existingRecord?.lastPlayedAt || 0,
    playMinutes: existingRecord?.playMinutes || 0,
    file,
  };

  await withRomStore("readwrite", (store, resolve, reject, database) => {
    const request = store.put(record);

    request.addEventListener("success", () => {
      database.close();
      resolve();
    });

    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao salvar a ROM."));
    });
  });

  await loadRomLibrary();
  return record;
}

async function deleteRomFromLibrary(romId) {
  await withRomStore("readwrite", (store, resolve, reject, database) => {
    const request = store.delete(romId);

    request.addEventListener("success", () => {
      database.close();
      resolve();
    });

    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao remover a ROM."));
    });
  });

  if (getLastRomSelection() === romId) {
    saveLastRomSelection("");
  }

  await loadRomLibrary();
}

async function getRomFromLibrary(romId) {
  return withRomStore("readonly", (store, resolve, reject, database) => {
    const request = store.get(romId);

    request.addEventListener("success", () => {
      database.close();
      resolve(request.result || null);
    });

    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao abrir a ROM."));
    });
  });
}

async function launchLibraryRom(romId) {
  const entry = await getRomFromLibrary(romId);

  if (!entry?.file) {
    throw new Error("Nao encontrei essa ROM na biblioteca local.");
  }

  activeRomId = entry.id;
  setPokedexAvailable(getSupportsPokedex(entry));
  activeSessionStartedAt = Date.now();
  saveLastRomSelection(entry.id);
  pushRecentRom({
    id: entry.id,
    name: entry.name,
    displayTitle: entry.displayTitle || "",
    lastPlayedLabel: "Ultima jogada",
  });
  romFileName.textContent = `${getRomDisplayTitle(entry)} - Biblioteca local`;
  setSessionTitleText(getRomDisplayTitle(entry));

  entry.lastPlayedAt = Date.now();
  await withRomStore("readwrite", (store, resolve, reject, database) => {
    const request = store.put(entry);

    request.addEventListener("success", () => {
      database.close();
      resolve();
    });

    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao atualizar ultima jogada."));
    });
  });

  await bootEmulator(entry.file);
  renderRomLibrary();
  void renderStoredSaves();
}

function setPokedexOpen(open) {
  if (open && !activeSupportsPokedex) {
    showRuntimeHint("A Pokedex integrada aparece apenas em jogos Pokemon.");
    return;
  }

  if (open && !document.fullscreenElement) {
    const target = emulatorRuntime || getEmulatorHost();

    if (!target || typeof target.requestFullscreen !== "function") {
      showRuntimeHint("A Pokedex integrada abre apenas em tela cheia.");
      return;
    }

    target
      .requestFullscreen()
      .then(() => {
        syncPokedexFullscreenHost();
        setPokedexOpen(true);
      })
      .catch(() => {
        showRuntimeHint("Entre em tela cheia para abrir a Pokedex integrada.");
      });
    return;
  }

  syncPokedexFullscreenHost();
  document.body.classList.toggle("is-pokedex-open", open);

  if (pokedexToggle) {
    pokedexToggle.setAttribute("aria-expanded", String(open));
  }

  if (pokedexPanel) {
    pokedexPanel.setAttribute("aria-hidden", String(!open));
  }

  if (open) {
    playIntegratedDexOpenSound();
  }
}

function setIntegratedDexVoiceButtonState(isListening, supported = true) {
  if (!integratedDexVoiceButton) {
    return;
  }

  integratedDexVoiceButton.hidden = !activeSupportsPokedex;
  integratedDexVoiceButton.disabled = !supported || !activeSupportsPokedex;
  integratedDexVoiceButton.classList.toggle("is-listening", isListening);
  integratedDexVoiceButton.textContent = supported
    ? (isListening ? "Ouvindo" : "Voz")
    : "Sem voz";
}

function setIntegratedDexFrameSource(searchTerm = "") {
  if (!pokedexFrame) {
    return;
  }

  const nextUrl = new URL("/pokedex.html", window.location.origin);
  nextUrl.searchParams.set("embed", "1");

  if (searchTerm) {
    nextUrl.searchParams.set("pokemon", searchTerm);
  }

  const nextSrc = nextUrl.pathname + nextUrl.search;
  const currentSrc = pokedexFrame.getAttribute("src") || "";

  if (currentSrc !== nextSrc) {
    pokedexFrame.setAttribute("src", nextSrc);
  }
}

function handleIntegratedDexVoiceCommand(transcript) {
  if (!activeSupportsPokedex) {
    return;
  }

  const command = String(transcript || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (!command) {
    return;
  }

  const wantsOpen =
    command.includes("abrir pokedex") ||
    command.includes("abrir a pokedex") ||
    command.includes("mostrar pokedex") ||
    command.includes("abrir dex");

  const wantsClose =
    command.includes("fechar pokedex") ||
    command.includes("fechar a pokedex") ||
    command.includes("esconder pokedex") ||
    command.includes("fechar dex");

  const searchMatch =
    command.match(/abrir (?:a )?pokedex (?:e )?buscar (.+)$/) ||
    command.match(/abrir dex (?:e )?buscar (.+)$/) ||
    command.match(/buscar (.+) na pokedex$/);

  const requestedPokemon = searchMatch?.[1]?.trim().replace(/\s+/g, "-") || "";

  if (requestedPokemon) {
    setIntegratedDexFrameSource(requestedPokemon);
    setPokedexOpen(true);
    pokedexFrame?.focus();
    return;
  }

  if (wantsOpen) {
    setIntegratedDexFrameSource();
    setPokedexOpen(true);
    pokedexFrame?.focus();
    return;
  }

  if (wantsClose) {
    setPokedexOpen(false);
    return;
  }
}

function playIntegratedDexOpenSound() {
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
    // Ignore audio restrictions.
  }
}

function normalizeIntegratedDexSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function handleIntegratedDexShortcuts(event, ownerWindow = window) {
  const target = event.target;
  const view = ownerWindow;
  const isTyping =
    target instanceof view.HTMLInputElement ||
    target instanceof view.HTMLTextAreaElement ||
    target instanceof view.HTMLSelectElement ||
    target?.isContentEditable;

  if (isTyping) {
    return;
  }

  if (event.key.toLowerCase() === "p") {
    if (!activeSupportsPokedex) {
      return;
    }

    event.preventDefault();
    const willOpen = !document.body.classList.contains("is-pokedex-open");
    setPokedexOpen(willOpen);

    if (willOpen) {
      pokedexFrame?.focus();
    }
    return;
  }

  if (event.key === "Escape" && document.body.classList.contains("is-pokedex-open")) {
    setPokedexOpen(false);
    return;
  }

  if (event.key.toLowerCase() === "v" && activeSupportsPokedex && integratedDexVoiceRecognition && integratedDexVoiceButton) {
    event.preventDefault();

    try {
      integratedDexVoiceRecognition.start();
    } catch (error) {
      setIntegratedDexVoiceButtonState(false, true);
    }
  }
}

function setDockEnabled(button, enabled) {
  if (!button) {
    return;
  }

  button.disabled = !enabled;
  button.classList.toggle("is-disabled", !enabled);
}

function syncPokedexFullscreenHost() {
  if (!pokedexPanel) {
    return;
  }

  const fullscreenElement = document.fullscreenElement;
  const shouldAttachToFullscreen =
    fullscreenElement instanceof HTMLElement &&
    (fullscreenElement === emulatorRuntime ||
      fullscreenElement.contains(emulatorRuntime) ||
      emulatorRuntime?.contains(fullscreenElement));

  if (shouldAttachToFullscreen && !fullscreenElement.contains(pokedexPanel)) {
    fullscreenElement.appendChild(pokedexPanel);
    return;
  }

  if (!shouldAttachToFullscreen && pokedexOriginalParent && pokedexPanel.parentElement !== pokedexOriginalParent) {
    pokedexOriginalParent.insertBefore(pokedexPanel, pokedexOriginalNextSibling);
  }
}

function syncDockState() {
  const isFullscreen = Boolean(document.fullscreenElement);
  setDockEnabled(dockFullscreen, Boolean(document.body.classList.contains("has-rom") && emulationReady));

  if (dockFullscreen) {
    dockFullscreen.classList.toggle("is-active", isFullscreen);
    dockFullscreen.textContent = isFullscreen ? "Sair da tela cheia" : "Tela cheia";
    dockFullscreen.setAttribute(
      "aria-label",
      isFullscreen ? "Sair da tela cheia" : "Abrir em tela cheia",
    );
  }
}

function setEmulationReady(ready) {
  emulationReady = ready;

  if (!ready) {
    emulationPaused = false;
  }

  syncDockState();
}

function updateHudForPauseState() {
  if (!hudMode) {
    return;
  }

  hudMode.textContent = emulationPaused ? "ROM pausada" : "ROM em execucao";
}

function queryEmulatorAction(actionNames) {
  const emulatorHost = getEmulatorHost();

  if (!emulatorHost) {
    return null;
  }

  const selectors = actionNames
    .map((name) => [
      `[data-btn="${name}"]`,
      `[data-action="${name}"]`,
      `[title*="${name}" i]`,
      `[aria-label*="${name}" i]`,
      `button[onclick*="${name}"]`,
    ])
    .flat();

  for (const selector of selectors) {
    const match = emulatorHost.querySelector(selector);
    if (match) {
      return match;
    }
  }

  const normalizedNames = actionNames.map((name) => name.trim().toLowerCase());
  const clickableNodes = emulatorHost.querySelectorAll(
    'button, [role="button"], [data-btn], [data-action], label, .ejs--button, .ejs_button',
  );

  for (const node of clickableNodes) {
    const text = (node.textContent || "").trim().toLowerCase();
    const title = (node.getAttribute("title") || "").trim().toLowerCase();
    const ariaLabel = (node.getAttribute("aria-label") || "").trim().toLowerCase();
    const matches = normalizedNames.some(
      (name) => text.includes(name) || title.includes(name) || ariaLabel.includes(name),
    );

    if (matches) {
      return node;
    }
  }

  return null;
}

function triggerEmulatorAction(actionNames) {
  const target = queryEmulatorAction(actionNames);

  if (target instanceof HTMLElement) {
    target.click();
    return true;
  }

  return false;
}

function openEmulatorHiddenFileInput(kind) {
  const emulatorHost = getEmulatorHost();
  if (!emulatorHost) {
    return false;
  }

  const normalizedKind = String(kind || "").toLowerCase();
  const fileInputs = emulatorHost.querySelectorAll('input[type="file"]');

  for (const input of fileInputs) {
    const accept = (input.getAttribute("accept") || "").toLowerCase();
    const name = (input.getAttribute("name") || "").toLowerCase();
    const id = (input.getAttribute("id") || "").toLowerCase();
    const ariaLabel = (input.getAttribute("aria-label") || "").toLowerCase();
    const descriptor = `${accept} ${name} ${id} ${ariaLabel}`;

    const isSaveImportInput =
      descriptor.includes(".sav") ||
      descriptor.includes(".srm") ||
      descriptor.includes("save") ||
      descriptor.includes("import") ||
      descriptor.includes("upload");

    if (normalizedKind === "import-save" && isSaveImportInput) {
      input.click();
      return true;
    }
  }

  return false;
}

function importSaveFileIntoEmulator(file) {
  const runtimeHost = getEmulatorHost();
  const dropTarget = runtimeHost?.querySelector("canvas, .game, .ejs_player") || runtimeHost;

  if (!(file instanceof File) || !dropTarget) {
    return false;
  }

  const fileName = file.name.toLowerCase();
  const isSupportedSave =
    fileName.endsWith(".sav") ||
    fileName.endsWith(".srm") ||
    fileName.endsWith(".state") ||
    fileName.endsWith(".slot");

  if (!isSupportedSave) {
    showRuntimeHint("Escolha um arquivo de save valido (.sav, .srm, .state ou .slot).");
    return false;
  }

  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    ["dragenter", "dragover", "drop"].forEach((eventName) => {
      const dragEvent = new DragEvent(eventName, {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });
      dropTarget.dispatchEvent(dragEvent);
    });

    showRuntimeHint("Save enviado para o emulador.");
    return true;
  } catch (error) {
    return false;
  }
}

function triggerEmulatorActionOrToast(actionNames, message) {
  const actionSucceeded = triggerEmulatorAction(actionNames);

  if (!actionSucceeded && message) {
    showRuntimeHint(message);
  }

  return actionSucceeded;
}

function showRuntimeHint(message) {
  if (romStatus) {
    romStatus.textContent = message;
  }

  window.setTimeout(() => {
    if (romStatus && document.body.classList.contains("has-rom")) {
      romStatus.textContent = "Emulador em execucao";
    }
  }, 2200);
}

async function updateRomLibraryEntry(romId, updater) {
  if (!romId) {
    return;
  }

  const entry = await getRomFromLibrary(romId);
  if (!entry) {
    return;
  }

  const nextEntry = updater({ ...entry }) || entry;
  await withRomStore("readwrite", (store, resolve, reject, database) => {
    const request = store.put(nextEntry);
    request.addEventListener("success", () => {
      database.close();
      resolve();
    });
    request.addEventListener("error", () => {
      database.close();
      reject(request.error || new Error("Falha ao atualizar ROM."));
    });
  });
}

async function flushActiveSessionPlaytime() {
  if (!activeRomId || !activeSessionStartedAt) {
    return;
  }

  const elapsedMinutes = consumeElapsedSessionMinutes();

  if (!elapsedMinutes) {
    return;
  }

  await updateRomLibraryEntry(activeRomId, (entry) => {
    entry.playMinutes = Number(entry.playMinutes || 0) + elapsedMinutes;
    entry.lastPlayedAt = Date.now();
    return entry;
  });
}

async function exitFullscreenIfActive() {
  const fullscreenElement = document.fullscreenElement;
  if (!fullscreenElement || typeof document.exitFullscreen !== "function") {
    return false;
  }

  try {
    await document.exitFullscreen();
    return true;
  } catch (error) {
    return false;
  }
}

function resetRuntimeState() {
  document.body.classList.remove("is-loading-rom");
  emulatorLoading.hidden = true;
}

async function toggleFullscreenMode() {
  const target = emulatorRuntime || getEmulatorHost();

  if (!target) {
    return;
  }

  if (!document.body.classList.contains("has-rom")) {
    showRuntimeHint("Carregue uma ROM antes de usar a tela cheia.");
    return;
  }

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await target.requestFullscreen();
      window.setTimeout(() => syncRuntimeViewport(), 180);
    }
  } catch (error) {
    showRuntimeHint("O navegador bloqueou o fullscreen dessa sessao.");
  } finally {
    syncDockState();
  }
}

function getNativeFullscreenControl(runtimeHost = getEmulatorHost()) {
  if (!runtimeHost) {
    return null;
  }

  const controls = runtimeHost.querySelectorAll(
    'button, [role="button"], [data-btn], [data-action], .ejs--button, .ejs_button',
  );

  for (const control of controls) {
    if (!(control instanceof HTMLElement)) {
      continue;
    }

    const label = [
      control.textContent,
      control.getAttribute("aria-label"),
      control.getAttribute("title"),
      control.getAttribute("data-btn"),
      control.getAttribute("data-action"),
      control.className,
      control.id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (label.includes("fullscreen") || label.includes("full screen") || label.includes("tela cheia")) {
      return control;
    }
  }

  return null;
}

function showRuntimeError(message) {
  document.body.classList.remove("has-rom");
  resetRuntimeState();
  emulatorRuntime.classList.remove("is-visible");
  if (emulatorNativeMenu) {
    emulatorNativeMenu.hidden = true;
  }
  emulatorError.hidden = false;
  emulatorErrorMessage.textContent = message;
  romStatus.textContent = "Falha ao iniciar";
  hudMode.textContent = "Falha no boot";
  setEmulationReady(false);
  syncSessionSummary();
}

function clearActiveRomUrl() {
  if (activeRomUrl) {
    if (activeRomUrl.startsWith("blob:")) {
      URL.revokeObjectURL(activeRomUrl);
    }
    activeRomUrl = "";
  }
}

function getRomDisplayName(file) {
  const fallbackName = "pokemon-emerald";
  const rawName = typeof file?.name === "string" ? file.name : fallbackName;
  const normalizedName = rawName.replace(/\.[^.]+$/, "").trim().toLowerCase();

  return normalizedName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallbackName;
}

function readFileAsObjectUrl(file) {
  if (!(file instanceof File)) {
    return Promise.reject(new Error("Falha ao ler a ROM."));
  }

  return Promise.resolve(URL.createObjectURL(file));
}

function syncRuntimeViewport(runtimeHost = getEmulatorHost()) {
  if (!runtimeHost) {
    return;
  }

  const frame = runtimeHost.querySelector("iframe");
  const canvas = runtimeHost.querySelector("canvas");

  [frame, canvas].forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.style.width = "100%";
    node.style.height = "100%";
    node.style.maxWidth = "100%";
    node.style.display = "block";
    node.style.border = "0";
    node.style.left = "0";
    node.style.top = "0";
  });

  hideWideBlankTouchControls(runtimeHost);
}

function getRuntimeTextSignal(node) {
  return [
    node.textContent,
    node.getAttribute("aria-label"),
    node.getAttribute("title"),
    node.getAttribute("data-btn"),
    node.getAttribute("data-action"),
  ]
    .filter(Boolean)
    .join("")
    .replace(/\s+/g, "")
    .trim();
}

function hideWideBlankTouchControls(runtimeHost = getEmulatorHost()) {
  if (!runtimeHost || !isCompactTouchUi()) {
    return;
  }

  const hostRect = runtimeHost.getBoundingClientRect();
  if (!hostRect.width || !hostRect.height) {
    return;
  }

  runtimeHost.querySelectorAll("div, button, [role='button']").forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (node.matches("canvas, iframe") || node.querySelector("canvas, iframe")) {
      return;
    }

    if (getRuntimeTextSignal(node)) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const isWideBlankControl =
      rect.width >= hostRect.width * 0.72 &&
      rect.height >= 24 &&
      rect.height <= Math.max(96, hostRect.height * 0.14);

    if (isWideBlankControl) {
      node.dataset.oakWideBlankControl = "true";
      node.style.setProperty("display", "none", "important");
      node.style.setProperty("opacity", "0", "important");
      node.style.setProperty("pointer-events", "none", "important");
      node.setAttribute("aria-hidden", "true");
    }
  });
}

async function withBiosStore(mode, callback) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BIOS_STORE_NAME, mode);
    const store = transaction.objectStore(BIOS_STORE_NAME);

    transaction.addEventListener("complete", () => {
      database.close();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao acessar a biblioteca de BIOS."));
    });

    try {
      callback(store, resolve, reject, database);
    } catch (error) {
      database.close();
      reject(error);
    }
  });
}

function getBiosIdForSystem(system) {
  return system?.biosId || "";
}

async function getBiosRecord(biosId) {
  if (!biosId) {
    return null;
  }

  return withBiosStore("readonly", (store, resolve, reject) => {
    const request = store.get(biosId);

    request.addEventListener("success", () => {
      resolve(request.result || null);
    });

    request.addEventListener("error", () => {
      reject(request.error || new Error("Falha ao carregar BIOS."));
    });
  });
}

async function saveBiosRecord(biosId, file) {
  const record = {
    id: biosId,
    name: file.name,
    size: file.size,
    updatedAt: Date.now(),
    file,
  };

  await withBiosStore("readwrite", (store, resolve, reject) => {
    const request = store.put(record);

    request.addEventListener("success", () => resolve(record));
    request.addEventListener("error", () => reject(request.error || new Error("Falha ao salvar BIOS.")));
  });

  return record;
}

function getNativeEmulatorMenuControl(runtimeHost = getEmulatorHost()) {
  if (!runtimeHost) {
    return null;
  }

  const controls = runtimeHost.querySelectorAll(
    'button, [role="button"], [data-btn], [data-action], .ejs--button, .ejs_button',
  );

  for (const control of controls) {
    if (!(control instanceof HTMLElement)) {
      continue;
    }

    const label = [
      control.textContent,
      control.getAttribute("aria-label"),
      control.getAttribute("title"),
      control.getAttribute("data-btn"),
      control.getAttribute("data-action"),
      control.className,
      control.id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (label.includes("menu") || label.includes("context") || label.includes("settings")) {
      return control;
    }
  }

  return null;
}

function openNativeEmulatorMenu() {
  const runtimeHost = getEmulatorHost();
  const nativeControl = getNativeEmulatorMenuControl(runtimeHost);

  if (nativeControl) {
    nativeControl.click();
    return;
  }

  const target = runtimeHost?.querySelector("canvas, iframe") || runtimeHost;
  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  target.dispatchEvent(new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    clientX: rect.right - 18,
    clientY: rect.top + 18,
  }));
}

function ensureRuntimeResizeInterval() {
  const runtimeHost = getEmulatorHost();

  if (!runtimeHost) {
    return;
  }

  syncRuntimeViewport(runtimeHost);

  if (runtimeResizeInterval) {
    window.clearInterval(runtimeResizeInterval);
  }

  runtimeResizeInterval = window.setInterval(() => {
    syncRuntimeViewport(runtimeHost);
  }, 300);
}

function clearExistingRuntime() {
  activeBootToken += 1;

  if (runtimeResizeInterval) {
    window.clearInterval(runtimeResizeInterval);
    runtimeResizeInterval = null;
  }

  try {
    if (window.EJS_emulator?.stop) {
      window.EJS_emulator.stop();
    }
  } catch (error) {
    // Ignore teardown issues from partially loaded runtimes.
  }

  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.src = "";
  });

  if (activeLoaderScript) {
    activeLoaderScript.remove();
    activeLoaderScript = null;
  }

  if (activeBiosUrl) {
    URL.revokeObjectURL(activeBiosUrl);
    activeBiosUrl = "";
  }

  if (emulatorRuntime) {
    emulatorRuntime.innerHTML = '<div id="emulatorjs-player" class="emulator-runtime-player"></div>';
  }

  const staleScript = document.querySelector('script[data-emulatorjs-loader="true"]');
  if (staleScript) {
    staleScript.remove();
  }

  delete window.EJS_player;
  delete window.EJS_core;
  delete window.EJS_pathtodata;
  delete window.EJS_gameName;
  delete window.EJS_gameUrl;
  delete window.EJS_biosUrl;
  delete window.EJS_startOnLoaded;
  delete window.EJS_threads;
  delete window.EJS_Buttons;
  delete window.EJS_volume;
  delete window.EJS_color;
  delete window.EJS_defaultOptions;
  delete window.EJS_emulator;
  if (emulatorRuntime) {
    emulatorRuntime.classList.remove("is-visible");
  }
  if (emulatorNativeMenu) {
    emulatorNativeMenu.hidden = true;
  }
  setEmulationReady(false);
  setPokedexAvailable(false);
  activeSessionStartedAt = 0;
}

function isCompactTouchUi() {
  return window.matchMedia("(max-width: 1100px), ((hover: none) and (pointer: coarse) and (max-width: 1400px))").matches;
}

async function bootEmulator(file) {
  if (!emulatorRuntime || !emulatorLoading || !emulatorError) {
    return;
  }

  clearExistingRuntime();
  clearActiveRomUrl();
  setPokedexAvailable(getSupportsPokedex(file));
  const bootToken = activeBootToken;
  const runtimeHost = getEmulatorHost();

  document.body.classList.add("has-rom", "is-loading-rom");
  emulatorRuntime.classList.remove("is-visible");
  if (emulatorNativeMenu) {
    emulatorNativeMenu.hidden = true;
  }
  emulatorLoading.hidden = false;
  emulatorError.hidden = true;
  romStatus.textContent = "Inicializando core";
  hudMode.textContent = "Carregando core";
  setEmulationReady(false);
  syncSessionSummary();

  try {
    activeRomUrl = await readFileAsObjectUrl(file);
  } catch (error) {
    showRuntimeError("Nao consegui ler essa ROM local para iniciar o emulador.");
    return;
  }

  if (!runtimeHost || bootToken !== activeBootToken) {
    return;
  }

  const system = getRomSystem(file);
  const biosId = getBiosIdForSystem(system);

  if (biosId) {
    const biosRecord = await getBiosRecord(biosId);

    if (!biosRecord?.file) {
      showRuntimeError("PS1 precisa da BIOS scph5501.bin. Importe sua BIOS legalmente obtida antes de iniciar esta ROM.");
      return;
    }

    activeBiosUrl = URL.createObjectURL(biosRecord.file);
    window.EJS_biosUrl = activeBiosUrl;
  } else {
    delete window.EJS_biosUrl;
  }

  window.EJS_player = "#emulatorjs-player";
  window.EJS_core = system.core;
  window.EJS_pathtodata = EMULATORJS_DATA_PATH;
  window.EJS_gameName = getRomDisplayName(file);
  window.EJS_gameUrl = activeRomUrl;
  window.EJS_startOnLoaded = true;
  window.EJS_threads = false;
  window.EJS_volume = 0.7;
  window.EJS_color = "#00FF80";
  window.EJS_defaultOptions = {
    shader: "crt-easymode.glslp",
    "save-state-location": "browser",
  };

  activeLoaderScript = document.createElement("script");
  activeLoaderScript.src = `${EMULATORJS_DATA_PATH}loader.js`;
  activeLoaderScript.dataset.emulatorjsLoader = "true";
  activeLoaderScript.async = true;

  activeLoaderScript.addEventListener("load", () => {
    if (bootToken !== activeBootToken) {
      return;
    }
    document.body.classList.remove("is-loading-rom");
    emulatorLoading.hidden = true;
    emulatorRuntime.classList.add("is-visible");
    if (emulatorNativeMenu) {
      emulatorNativeMenu.hidden = false;
    }
    window.setTimeout(ensureRuntimeResizeInterval, 120);
    window.setTimeout(() => syncRuntimeViewport(), 500);
    if (document.fullscreenElement) {
      window.setTimeout(() => syncRuntimeViewport(), 220);
    }
    romStatus.textContent = "Emulador em execucao";
    hudMode.textContent = "ROM em execucao";
    setEmulationReady(true);
    activeSessionStartedAt = Date.now();
    if (screenBadge) {
      setSessionBadgeText("Sessao ativa");
    }
    syncSessionSummary();
  });

  activeLoaderScript.addEventListener("error", () => {
    if (bootToken !== activeBootToken) {
      return;
    }
    showRuntimeError("O core do emulador nao carregou. A pagina precisa acessar a CDN do EmulatorJS.");
  });

  document.body.appendChild(activeLoaderScript);

  window.setTimeout(() => {
    if (document.body.classList.contains("is-loading-rom")) {
      document.body.classList.remove("is-loading-rom");
      emulatorLoading.hidden = true;
      emulatorRuntime.classList.add("is-visible");
      if (emulatorNativeMenu) {
        emulatorNativeMenu.hidden = false;
      }
      romStatus.textContent = "Core carregado";
      hudMode.textContent = "Iniciando ROM";
      setEmulationReady(true);
      if (screenBadge) {
        setSessionBadgeText("Inicializacao iniciada");
      }
      syncSessionSummary();
    }
  }, 2200);
}

if (romInput && romStatus && romFileName) {
  romInput.addEventListener("change", async () => {
    const [file] = romInput.files || [];

    if (!file) {
      clearExistingRuntime();
      clearActiveRomUrl();
      document.body.classList.remove("has-rom");
      resetRuntimeState();
      emulatorRuntime?.classList.remove("is-visible");
      if (emulatorNativeMenu) {
        emulatorNativeMenu.hidden = true;
      }
      if (emulatorError) {
        emulatorError.hidden = true;
      }
      romStatus.textContent = "Sem ROM carregada";
      romFileName.textContent = "Nenhum arquivo selecionado";
      hudMode.textContent = "Aguardando ROM";
      if (screenBadge) {
        setSessionBadgeText("Pronto para iniciar");
      }
      setSessionTitleText("Oak Emulator Lounge");
      setEmulationReady(false);
      syncSessionSummary();
      return;
    }

    await flushActiveSessionPlaytime();

    romStatus.textContent = "Arquivo selecionado";
    syncSessionSummary();

    romStatus.textContent = "ROM pronta para integrar";
    romFileName.textContent = file.name;
    hudMode.textContent = "ROM carregada localmente";
    if (screenBadge) {
      setSessionBadgeText("ROM carregada");
    }
    setSessionTitleText(formatRomTitle(file.name));

    if (!getSystemByFileName(file.name)) {
      showRuntimeError(`Use uma ROM suportada (${getSupportedRomExtensionsLabel()}) para iniciar o emulador.`);
      return;
    }

    try {
      const savedRecord = await saveRomToLibrary(file);
      activeRomId = savedRecord.id;
      setPokedexAvailable(getSupportsPokedex(savedRecord));
      saveDefaultRomLink(getRouteDefaultRomId(), savedRecord.id);
      saveLastRomSelection(savedRecord.id);
      pushRecentRom({
        id: savedRecord.id,
        name: savedRecord.name,
        lastPlayedLabel: "Adicionada agora",
      });
    } catch (error) {
      romStatus.textContent = "ROM carregada sem biblioteca";
      setPokedexAvailable(getSupportsPokedex(file));
      activeRomId = "";
    }

    await bootEmulator(file);
    renderRecentRoms();
    renderRomLibrary();
    syncSessionSummary();
    void renderStoredSaves();
  });
}

if (emulatorNativeMenu) {
  emulatorNativeMenu.addEventListener("click", openNativeEmulatorMenu);
}

if (dockFullscreen && emulatorRuntime) {
  dockFullscreen.addEventListener("click", async () => {
    await toggleFullscreenMode();
  });
}

document.addEventListener("fullscreenchange", () => {
  syncPokedexFullscreenHost();
  if (!document.fullscreenElement && document.body.classList.contains("is-pokedex-open")) {
    setPokedexOpen(false);
  }
  syncDockState();
  window.setTimeout(() => syncRuntimeViewport(), 60);
});

window.addEventListener("orientationchange", () => {
  window.setTimeout(() => syncRuntimeViewport(), 180);
});

window.addEventListener("resize", () => {
  window.setTimeout(() => syncRuntimeViewport(), 90);
});

if (saveImportInput) {
  saveImportInput.addEventListener("change", () => {
    const [file] = saveImportInput.files || [];

    if (!file) {
      return;
    }

    const imported = importSaveFileIntoEmulator(file);
    if (!imported) {
      const actionSucceeded = triggerEmulatorAction([
        "loadSavFiles",
        "load save files",
        "load save file",
        "import save file",
        "upload save file",
        "import",
      ]);

      if (!actionSucceeded && !openEmulatorHiddenFileInput("import-save")) {
        showRuntimeHint("Nao consegui importar esse save agora.");
      }
    } else {
      saveSessionMeta({
        lastSaveAction: `Save importado: ${file.name}`,
        lastSaveAt: Date.now(),
      });
      void saveImportedSaveFile(file).then(() => {
        void renderStoredSaves();
      });
      syncSessionInsights();
    }

    saveImportInput.value = "";
  });
}

if (biosImportInput) {
  biosImportInput.addEventListener("change", async () => {
    const [file] = biosImportInput.files || [];

    if (!file) {
      return;
    }

    if (!/^scph5501\.bin$/i.test(file.name)) {
      showRuntimeError("Use a BIOS PS1 scph5501.bin. Ela deve ser fornecida por voce e nao fica no repositorio.");
      biosImportInput.value = "";
      return;
    }

    try {
      await saveBiosRecord("ps1-scph5501", file);
      romStatus.textContent = "BIOS PS1 importada";
      hudMode.textContent = "BIOS PS1 salva neste navegador";
      if (biosImportLabel) {
        biosImportLabel.textContent = "BIOS PS1 importada";
      }
      if (activeRomId) {
        try {
          await launchLibraryRom(activeRomId);
        } catch (error) {
          showRuntimeError("BIOS importada, mas nao consegui reiniciar a ROM PS1 automaticamente.");
        }
      }
    } catch (error) {
      showRuntimeError("Nao consegui salvar a BIOS PS1 neste navegador.");
    } finally {
      biosImportInput.value = "";
    }
  });
}

if (sessionExportSaveButton) {
  sessionExportSaveButton.addEventListener("click", () => {
    const ok = triggerEmulatorActionOrToast(
      ["saveSavFiles", "save files", "export save file", "save file", "save"],
      "Nao consegui exportar o save agora.",
    );

    if (ok) {
      saveSessionMeta({
        lastSaveAction: `Save exportado de ${formatRomTitle(romFileName?.textContent || "ROM atual")}`,
        lastSaveAt: Date.now(),
      });
      syncSessionInsights();
    }
  });
}

if (sessionImportSaveButton) {
  sessionImportSaveButton.addEventListener("click", () => {
    if (!document.body.classList.contains("has-rom")) {
      showRuntimeHint("Carregue uma ROM antes de importar um save.");
      return;
    }

    saveImportInput?.click();
  });
}

if (sessionSaveList) {
  sessionSaveList.addEventListener("click", async (event) => {
    const loadButton = event.target.closest("[data-load-save]");
    const deleteButton = event.target.closest("[data-delete-save]");

    if (deleteButton?.dataset.deleteSave) {
      try {
        await deleteStoredSave(deleteButton.dataset.deleteSave);
        await renderStoredSaves();
        showRuntimeHint("Save removido da sessao local.");
      } catch (error) {
        showRuntimeHint("Nao consegui excluir esse save local.");
      }
      return;
    }

    if (!loadButton?.dataset.loadSave) {
      return;
    }

    const entry = await getStoredSave(loadButton.dataset.loadSave);
    if (!entry?.file) {
      showRuntimeHint("Nao consegui abrir esse save salvo localmente.");
      return;
    }

    const imported = importSaveFileIntoEmulator(entry.file);
    if (!imported) {
      showRuntimeHint("Nao consegui carregar esse save no emulador.");
      return;
    }

    saveSessionMeta({
      lastSaveAction: `Save reaplicado: ${entry.name}`,
      lastSaveAt: Date.now(),
    });
    syncSessionInsights();
  });
}

window.addEventListener("beforeunload", () => {
  if (!activeRomId || !activeSessionStartedAt) {
    return;
  }

  const elapsedMinutes = consumeElapsedSessionMinutes();
  if (!elapsedMinutes) {
    return;
  }

  queuePendingPlaytime(activeRomId, elapsedMinutes, Date.now());

  const entry = romLibrary.find((item) => item.id === activeRomId);
  if (entry) {
    entry.playMinutes = Number(entry.playMinutes || 0) + elapsedMinutes;
    entry.lastPlayedAt = Date.now();
  }
});

if (pokedexToggle) {
  pokedexToggle.addEventListener("click", () => {
    if (!activeSupportsPokedex) {
      return;
    }

    const willOpen = !document.body.classList.contains("is-pokedex-open");
    setPokedexOpen(willOpen);

    if (willOpen) {
      pokedexFrame?.focus();
    }
  });
}

if (pokedexClose) {
  pokedexClose.addEventListener("click", () => {
    setPokedexOpen(false);
  });
}

if (integratedDexVoiceButton) {
  if (IntegratedDexSpeechRecognitionApi) {
    integratedDexVoiceRecognition = new IntegratedDexSpeechRecognitionApi();
    integratedDexVoiceRecognition.lang = "pt-BR";
    integratedDexVoiceRecognition.interimResults = false;
    integratedDexVoiceRecognition.maxAlternatives = 1;

    integratedDexVoiceRecognition.addEventListener("start", () => {
      setIntegratedDexVoiceButtonState(true, true);
    });

    integratedDexVoiceRecognition.addEventListener("end", () => {
      setIntegratedDexVoiceButtonState(false, true);
    });

    integratedDexVoiceRecognition.addEventListener("result", (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? "";
      handleIntegratedDexVoiceCommand(transcript);
    });

    integratedDexVoiceRecognition.addEventListener("error", () => {
      setIntegratedDexVoiceButtonState(false, true);
    });

    integratedDexVoiceButton.addEventListener("click", () => {
      if (!activeSupportsPokedex) {
        return;
      }

      try {
        integratedDexVoiceRecognition.start();
      } catch (error) {
        setIntegratedDexVoiceButtonState(false, true);
      }
    });

    setIntegratedDexVoiceButtonState(false, true);
  } else {
    setIntegratedDexVoiceButtonState(false, false);
  }
}

if (romLibraryList) {
  romLibraryList.addEventListener("click", async (event) => {
    const launchButton = event.target.closest("[data-rom-launch]");
    const deleteButton = event.target.closest("[data-rom-delete]");
    const favoriteButton = event.target.closest("[data-rom-favorite]");

    if (launchButton?.dataset.romLaunch) {
      try {
        await launchLibraryRom(launchButton.dataset.romLaunch);
      } catch (error) {
        showRuntimeError("Nao consegui iniciar essa ROM da biblioteca local.");
      }
      return;
    }

    if (favoriteButton?.dataset.romFavorite) {
      try {
        const entry = await getRomFromLibrary(favoriteButton.dataset.romFavorite);
        if (!entry) {
          return;
        }

        entry.favorite = !entry.favorite;
        entry.updatedAt = Date.now();
        await withRomStore("readwrite", (store, resolve, reject, database) => {
          const request = store.put(entry);
          request.addEventListener("success", () => {
            database.close();
            resolve();
          });
          request.addEventListener("error", () => {
            database.close();
            reject(request.error || new Error("Falha ao atualizar favorita."));
          });
        });
        await loadRomLibrary();
        syncSessionInsights();
      } catch (error) {
        showRuntimeHint("Nao consegui atualizar essa favorita.");
      }
      return;
    }

    if (deleteButton?.dataset.romDelete) {
      try {
        await deleteRomFromLibrary(deleteButton.dataset.romDelete);
      } catch (error) {
        showRuntimeError("Nao consegui remover essa ROM da biblioteca local.");
      }
    }
  });
}


if (recentRomList) {
  recentRomList.addEventListener("click", async (event) => {
    const launchButton = event.target.closest("[data-rom-launch]");

    if (!launchButton?.dataset.romLaunch) {
      return;
    }

    try {
      await launchLibraryRom(launchButton.dataset.romLaunch);
    } catch (error) {
      showRuntimeError("Nao consegui retomar essa ROM do historico local.");
    }
  });
}

if (sessionResumeHero) {
  sessionResumeHero.addEventListener("click", async (event) => {
    const launchButton = event.target.closest("[data-rom-launch]");

    if (!launchButton?.dataset.romLaunch) {
      return;
    }

    try {
      await launchLibraryRom(launchButton.dataset.romLaunch);
    } catch (error) {
      showRuntimeError("Nao consegui retomar essa ROM do topo da sessao.");
    }
  });
}

if (clearLastRomButton) {
  clearLastRomButton.addEventListener("click", () => {
    saveLastRomSelection("");
    saveRecentRoms([]);
    activeRomId = "";
    renderRomLibrary();
    renderRecentRoms();
    romStatus.textContent = "Historico limpo";
    syncSessionSummary();
  });
}

if (romLibraryFilters.length) {
  romLibraryFilters.forEach((button) => {
    button.addEventListener("click", () => {
      romLibraryFilter = button.dataset.libraryFilter || "all";
      romLibraryFilters.forEach((item) => item.classList.toggle("is-active", item === button));
      romLibraryExpanded = false;
      renderRomLibrary();
    });
  });
}

if (launcherTabs.length) {
  launcherTabs.forEach((button) => {
    button.addEventListener("click", () => {
      activeLauncherTab = button.dataset.launcherTab || "recentes";
      syncLauncherTabs();
    });
  });
}

if (romLibrarySearch) {
  romLibrarySearch.addEventListener("input", () => {
    romLibraryQuery = romLibrarySearch.value;
    romLibraryExpanded = false;
    renderRomLibrary();
  });
}

if (romLibrarySort) {
  romLibrarySort.addEventListener("change", () => {
    romLibrarySortMode = romLibrarySort.value || "recent";
    romLibraryExpanded = false;
    renderRomLibrary();
  });
}

if (romLibraryMore) {
  romLibraryMore.addEventListener("click", () => {
    romLibraryExpanded = !romLibraryExpanded;
    renderRomLibrary();
  });
}

window.addEventListener("keydown", (event) => {
  handleIntegratedDexShortcuts(event, window);
});

if (pokedexFrame) {
  pokedexFrame.addEventListener("load", () => {
    try {
      const frameWindow = pokedexFrame.contentWindow;
      const frameDocument = pokedexFrame.contentDocument;

      if (!frameWindow || !frameDocument || frameDocument.body?.dataset.integratedDexShortcutsBound === "true") {
        return;
      }

      frameDocument.body.dataset.integratedDexShortcutsBound = "true";
      frameWindow.addEventListener("keydown", (event) => {
        handleIntegratedDexShortcuts(event, frameWindow);
      });
    } catch (error) {
      // Ignore iframe binding failures.
    }
  });
}

syncLauncherTabs();
setPokedexAvailable(false);
syncDockState();
await loadRomLibrary();
const routeDefaultRomId = window.OAK_DEFAULT_ROM_ID || getRouteDefaultRomId();
const autoBootRomId = window.OAK_AUTO_BOOT_ROM_ID || getRouteLocalRomId() || getLinkedDefaultRomId(routeDefaultRomId);
if (autoBootRomId) {
  try {
    await launchLibraryRom(autoBootRomId);
  } catch (error) {
    showRuntimeError("Nao consegui iniciar essa ROM local. Volte para a biblioteca e tente enviar o arquivo novamente.");
  }
}
renderRecentRoms();
syncSessionSummary();
void renderStoredSaves();
