const romInput = document.querySelector("#rom-input");
const romStatus =
  document.querySelector("#rom-status") || document.querySelector("#session-inline-status");
const romFileName =
  document.querySelector("#rom-file-name") || document.querySelector("#session-inline-rom");
const sessionTitle = document.querySelector("#session-title");
const sessionInlineStatus = document.querySelector("#session-inline-status");
const sessionInlineRom = document.querySelector("#session-inline-rom");
const launcherSessionStatus = document.querySelector("#launcher-session-status");
const launcherRomName = document.querySelector("#launcher-rom-name");
const romLibraryList = document.querySelector("#rom-library-list");
const romLibraryCount = document.querySelector("#rom-library-count");
const romLibrarySearch = document.querySelector("#rom-library-search");
const romLibrarySort = document.querySelector("#rom-library-sort");
const romLibraryResults = document.querySelector("#rom-library-results");
const romLibraryFooter = document.querySelector("#rom-library-footer");
const romLibraryMore = document.querySelector("#rom-library-more");
const recentRomList = document.querySelector("#recent-rom-list");
const clearLastRomButton = document.querySelector("#clear-last-rom");
const demoToggle = document.querySelector("#demo-toggle");
const hudMode = document.querySelector("#hud-mode");
const screenBadge = document.querySelector(".screen-badge");
const screenBadgeInline = document.querySelector("#screen-badge-inline");
const emulatorRuntime = document.querySelector("#emulator-runtime");
const emulatorLoading = document.querySelector("#emulator-loading");
const emulatorError = document.querySelector("#emulator-error");
const emulatorErrorMessage = document.querySelector("#emulator-error-message");
const dockFullscreen = document.querySelector("#dock-fullscreen");
const mobileActionFab = document.querySelector("#mobile-action-fab");
const mobileActionFabToggle = document.querySelector("#mobile-action-fab-toggle");
const mobileActionFabPanel = document.querySelector("#mobile-action-fab-panel");
const mobileFullscreen = document.querySelector("#mobile-fullscreen");
const mobilePokedexToggle = document.querySelector("#mobile-pokedex-toggle");
const mobileEmulatorSettings = document.querySelector("#mobile-emulator-settings");
const mobileSaveFile = document.querySelector("#mobile-save-file");
const mobileLoadFile = document.querySelector("#mobile-load-file");
const mobileControlSettings = document.querySelector("#mobile-control-settings");
const mobileTouchLayoutToggle = document.querySelector("#mobile-touch-layout-toggle");
const mobileActionHint = document.querySelector("#mobile-action-hint");
const saveImportInput = document.querySelector("#save-import-input");
const mobileTouchControls = document.querySelector("#mobile-touch-controls");
const pokedexToggle = document.querySelector("#pokedex-toggle");
const pokedexClose = document.querySelector("#pokedex-close");
const pokedexPanel = document.querySelector("#emulator-pokedex-panel");
const pokedexSearch = document.querySelector("#emulator-pokedex-search");
const pokedexSummary = document.querySelector("#emulator-pokedex-summary");
const pokedexList = document.querySelector("#emulator-pokedex-list");
const pokedexDetail = document.querySelector("#emulator-pokedex-detail");
const pokedexTabs = [...document.querySelectorAll(".pokedex-tab")];
const launcherTabs = [...document.querySelectorAll(".launcher-tab")];
const launcherPanels = [...document.querySelectorAll(".launcher-panel")];

let activeRomUrl = "";
let activeLoaderScript = null;
let emulationReady = false;
let emulationPaused = false;
let pokedexSearchTimer = null;
let activePokedexSelection = "";
let fullDexList = [];
let quickDexHistory = [];
let activeDexTab = "dados";
let currentQuickDexPokemon = null;
let activeLauncherTab = "recentes";
let romLibrary = [];
let activeRomId = "";
let activeBootToken = 0;
let romLibraryQuery = "";
let romLibrarySortMode = "recent";
let romLibraryExpanded = false;
let mobileToolbarObserver = null;
let touchLayoutEditMode = false;
let activeTouchLayoutDrag = null;
let mobileActionFabOpen = false;
let mobileActionFabDrag = null;
let mobileActionFabPositionPx = null;
const activeTouchKeys = new Map();

const EMULATORJS_CDN_VERSION = "4.2.3";
const EMULATORJS_DATA_PATH = `https://cdn.emulatorjs.org/${EMULATORJS_CDN_VERSION}/data/`;
const ROM_DB_NAME = "pokemon-emerald-gx";
const ROM_STORE_NAME = "rom-library";
const LAST_ROM_STORAGE_KEY = "emulatorLastRomId";
const RECENT_ROMS_STORAGE_KEY = "emulatorRecentRoms";
const PENDING_ROM_BOOT_KEY = "emulatorPendingRomBoot";
const RECENT_ROMS_LIMIT = 3;
const ROM_LIBRARY_PAGE_SIZE = 6;
const MOBILE_TOOLBAR_LABELS = ["context menu", "settings", "menu", "fullscreen", "save"];
const TOUCH_LAYOUT_STORAGE_KEY = "emulatorTouchLayout";
const MOBILE_ACTION_FAB_STORAGE_KEY = "emulatorMobileActionFab";
const DEFAULT_TOUCH_LAYOUT = {
  dpad: { x: 4, y: 52 },
  actions: { x: 76, y: 54 },
  meta: { x: 36, y: 82 },
};
const DEFAULT_MOBILE_ACTION_FAB_POSITION = { x: 82, y: 74 };
const TOUCH_KEY_MAP = {
  ArrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  ArrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  z: { key: "z", code: "KeyZ", keyCode: 90 },
  x: { key: "x", code: "KeyX", keyCode: 88 },
  Enter: { key: "Enter", code: "Enter", keyCode: 13 },
  Shift: { key: "Shift", code: "ShiftLeft", keyCode: 16 },
};

const dexTypeGlow = {
  normal: "190 188 138",
  fire: "245 125 49",
  water: "100 147 235",
  electric: "249 207 48",
  grass: "116 203 72",
  ice: "154 214 223",
  fighting: "193 34 57",
  poison: "164 62 158",
  ground: "222 193 107",
  flying: "168 145 236",
  psychic: "251 85 132",
  bug: "167 183 35",
  rock: "182 158 49",
  ghost: "112 85 155",
  dragon: "112 55 255",
  dark: "117 87 76",
  steel: "183 185 208",
  fairy: "230 158 172",
};

const POKEAPI_BASE = "https://pokeapi.co/api/v2";
const quickDexCache = new Map();
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
}

function setSessionTitleText(value) {
  if (sessionTitle) {
    sessionTitle.textContent = value;
  }
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

    const request = window.indexedDB.open(ROM_DB_NAME, 1);

    request.addEventListener("upgradeneeded", () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(ROM_STORE_NAME)) {
        database.createObjectStore(ROM_STORE_NAME, { keyPath: "id" });
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
  return String(fileName || "ROM local").replace(/\.gba$/i, "");
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

function loadTouchLayout() {
  try {
    const saved = window.localStorage.getItem(TOUCH_LAYOUT_STORAGE_KEY);
    if (!saved) {
      return { ...DEFAULT_TOUCH_LAYOUT };
    }

    const parsed = JSON.parse(saved);
    return {
      dpad: {
        x: Number(parsed?.dpad?.x ?? DEFAULT_TOUCH_LAYOUT.dpad.x),
        y: Number(parsed?.dpad?.y ?? DEFAULT_TOUCH_LAYOUT.dpad.y),
      },
      actions: {
        x: Number(parsed?.actions?.x ?? DEFAULT_TOUCH_LAYOUT.actions.x),
        y: Number(parsed?.actions?.y ?? DEFAULT_TOUCH_LAYOUT.actions.y),
      },
      meta: {
        x: Number(parsed?.meta?.x ?? DEFAULT_TOUCH_LAYOUT.meta.x),
        y: Number(parsed?.meta?.y ?? DEFAULT_TOUCH_LAYOUT.meta.y),
      },
    };
  } catch (error) {
    return { ...DEFAULT_TOUCH_LAYOUT };
  }
}

function saveTouchLayout(layout) {
  try {
    window.localStorage.setItem(TOUCH_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch (error) {
    // Ignore storage failures.
  }
}

function loadMobileActionFabPosition() {
  try {
    const saved = window.localStorage.getItem(MOBILE_ACTION_FAB_STORAGE_KEY);
    if (!saved) {
      return { ...DEFAULT_MOBILE_ACTION_FAB_POSITION };
    }

    const parsed = JSON.parse(saved);
    return {
      x: Number(parsed?.x ?? DEFAULT_MOBILE_ACTION_FAB_POSITION.x),
      y: Number(parsed?.y ?? DEFAULT_MOBILE_ACTION_FAB_POSITION.y),
    };
  } catch (error) {
    return { ...DEFAULT_MOBILE_ACTION_FAB_POSITION };
  }
}

function saveMobileActionFabPosition(position) {
  try {
    window.localStorage.setItem(MOBILE_ACTION_FAB_STORAGE_KEY, JSON.stringify(position));
  } catch (error) {
    // Ignore storage failures.
  }
}

function isTouchLayoutOverlayMode() {
  return (
    isCompactTouchUi() &&
    window.matchMedia("(orientation: landscape)").matches &&
    document.body.classList.contains("has-rom")
  );
}

function clampTouchLayoutValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function applyTouchLayout() {
  if (!mobileTouchControls) {
    return;
  }

  const groups = mobileTouchControls.querySelectorAll("[data-touch-group]");
  if (!groups.length) {
    return;
  }

  if (!isTouchLayoutOverlayMode()) {
    if (touchLayoutEditMode) {
      touchLayoutEditMode = false;
      document.body.classList.remove("is-touch-layout-editing");
      if (mobileTouchLayoutToggle) {
        mobileTouchLayoutToggle.textContent = "Mover";
      }
    }

    groups.forEach((group) => {
      group.style.left = "";
      group.style.top = "";
    });
    return;
  }

  const layout = loadTouchLayout();

  groups.forEach((group) => {
    const key = group.dataset.touchGroup;
    const position = layout[key];
    if (!position) {
      return;
    }

    group.style.left = `${position.x}%`;
    group.style.top = `${position.y}%`;
  });
}

function setMobileActionFabOpen(nextOpen) {
  if (!mobileActionFab || !mobileActionFabToggle || !mobileActionFabPanel) {
    return;
  }

  mobileActionFabOpen = nextOpen;
  mobileActionFab.classList.toggle("is-open", nextOpen);
  mobileActionFabToggle.setAttribute("aria-expanded", String(nextOpen));
  mobileActionFabPanel.hidden = !nextOpen;
}

function applyMobileActionFabPosition() {
  if (!mobileActionFab || !isCompactTouchUi()) {
    return;
  }

  const fabWidth = 54;
  const fabHeight = 54;
  const position = mobileActionFabPositionPx || loadMobileActionFabPosition();
  const maxLeft = Math.max(window.innerWidth - fabWidth - 8, 8);
  const maxTop = Math.max(window.innerHeight - fabHeight - 8, 8);
  const rawLeft = position.unit === "px" ? position.x : (position.x / 100) * window.innerWidth;
  const rawTop = position.unit === "px" ? position.y : (position.y / 100) * window.innerHeight;
  const left = clampTouchLayoutValue(rawLeft, 8, maxLeft);
  const top = clampTouchLayoutValue(rawTop, 8, maxTop);

  mobileActionFab.style.left = `${left}px`;
  mobileActionFab.style.top = `${top}px`;
  mobileActionFab.style.right = "auto";
  mobileActionFab.style.bottom = "auto";
}

function setupMobileActionFab() {
  if (!mobileActionFab || !mobileActionFabToggle || !mobileActionFabPanel) {
    return;
  }

  applyMobileActionFabPosition();
  setMobileActionFabOpen(false);

  mobileActionFabToggle.addEventListener("click", (event) => {
    if (mobileActionFabDrag?.moved) {
      mobileActionFabDrag.moved = false;
      return;
    }

    event.preventDefault();
    setMobileActionFabOpen(!mobileActionFabOpen);
  });

  mobileActionFabToggle.addEventListener("pointerdown", (event) => {
    if (!isCompactTouchUi()) {
      return;
    }

    event.preventDefault();
    const rect = mobileActionFabToggle.getBoundingClientRect();
    mobileActionFabDrag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    mobileActionFabToggle.setPointerCapture?.(event.pointerId);
  });

  const stopFabDrag = (event) => {
    if (!mobileActionFabDrag || mobileActionFabDrag.pointerId !== event.pointerId) {
      return;
    }

    if (mobileActionFabPositionPx) {
      const position = {
        x: Number(((mobileActionFabPositionPx.x / Math.max(window.innerWidth, 1)) * 100).toFixed(2)),
        y: Number(((mobileActionFabPositionPx.y / Math.max(window.innerHeight, 1)) * 100).toFixed(2)),
      };
      saveMobileActionFabPosition(position);
      mobileActionFabPositionPx = null;
      applyMobileActionFabPosition();
    }

    mobileActionFabDrag = null;
  };

  mobileActionFabToggle.addEventListener("pointermove", (event) => {
    if (!mobileActionFabDrag || mobileActionFabDrag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - mobileActionFabDrag.startX;
    const deltaY = event.clientY - mobileActionFabDrag.startY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!mobileActionFabDrag.moved && distance < 8) {
      return;
    }

    const width = 54;
    const height = 54;
    const maxLeft = Math.max(window.innerWidth - width, 0);
    const maxTop = Math.max(window.innerHeight - height, 0);
    const left = clampTouchLayoutValue(event.clientX - mobileActionFabDrag.offsetX, 8, maxLeft - 8);
    const top = clampTouchLayoutValue(event.clientY - mobileActionFabDrag.offsetY, 8, maxTop - 8);

    mobileActionFabDrag.moved = true;
    mobileActionFabPositionPx = {
      unit: "px",
      x: left,
      y: top,
    };
    applyMobileActionFabPosition();
    event.preventDefault();
  });

  mobileActionFabToggle.addEventListener("pointerup", stopFabDrag);
  mobileActionFabToggle.addEventListener("pointercancel", stopFabDrag);
  mobileActionFabToggle.addEventListener("lostpointercapture", stopFabDrag);

  document.addEventListener("pointerdown", (event) => {
    if (!mobileActionFabOpen || mobileActionFab.contains(event.target)) {
      return;
    }

    setMobileActionFabOpen(false);
  });

  mobileActionFabPanel.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement) || !event.target.closest("button")) {
      return;
    }

    window.setTimeout(() => {
      setMobileActionFabOpen(false);
    }, 0);
  });

  window.addEventListener("resize", applyMobileActionFabPosition);
}

function pushRecentRom(entry) {
  const nextEntries = [entry, ...loadRecentRoms().filter((item) => item.id !== entry.id)].slice(0, 6);
  saveRecentRoms(nextEntries);
}

function getSortedRomLibrary(entries) {
  const nextEntries = [...entries];

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
  const normalizedQuery = normalizeQuickDexSearch(romLibraryQuery);
  const filteredEntries = getSortedRomLibrary(romLibrary).filter((entry) => {
    if (!normalizedQuery) {
      return true;
    }

    return normalizeQuickDexSearch(formatRomTitle(entry.name)).includes(normalizedQuery);
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
    label: "GBA",
    edition: "ROM local",
    mascot: "Adventure",
    gradient: "linear-gradient(135deg, #4dc3ff 0%, #2a4ea8 100%)",
  };
}

function isKnownPokemonRom(fileName) {
  const normalized = String(fileName || "").toLowerCase();

  return ["emerald", "fire", "red", "leaf", "green", "ruby", "sapphire"].some((term) =>
    normalized.includes(term),
  );
}

function normalizeRomSearchQuery(fileName) {
  return String(fileName || "")
    .replace(/\.gba$/i, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\bwww\.[^\s]+/gi, " ")
    .replace(/\bromsportugues(?:\.com)?\b/gi, " ")
    .replace(/\b(portugues|portuguese|traduzido|translated|translation|br|ptbr|pt-br|rom|gba)\b/gi, " ")
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
        <img class="rom-cover-image" src="${resolvedCoverUrl}" alt="Capa da ROM ${formatRomTitle(entry.name)}" loading="lazy" />
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
        <span class="rom-cover-system">Game Boy Advance</span>
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
  if (!recentRomList) {
    return;
  }

  const recentEntries = hydrateRecentRomEntries(loadRecentRoms()).slice(0, RECENT_ROMS_LIMIT);

  if (!recentEntries.length) {
    recentRomList.innerHTML = '<p class="rom-library-empty">Seu historico de jogos vai aparecer aqui.</p>';
    return;
  }

  recentRomList.innerHTML = recentEntries
    .map(
      (entry) => `
        <button
          type="button"
          class="recent-rom-card${entry.id === activeRomId ? " is-active" : ""}"
          data-rom-launch="${entry.id}"
        >
          ${getRomCoverMarkup(entry)}
          <span class="recent-rom-copy">
            <strong>${formatRomTitle(entry.name)}</strong>
            <span>${entry.lastPlayedLabel || "Ultima sessao"}</span>
          </span>
          <span class="rom-card-badge-row">
            ${entry.id === activeRomId ? '<span class="rom-card-badge rom-card-badge-live">Em execucao</span>' : ""}
            <span class="rom-card-badge">Retomar</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderRomLibrary() {
  if (!romLibraryList || !romLibraryCount) {
    return;
  }

  const lastRomId = getLastRomSelection();
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
          <div class="rom-library-card-copy">
            <strong>${formatRomTitle(entry.name)}</strong>
            <span>${formatBytes(entry.size)}</span>
          </div>
          <div class="rom-card-badge-row">
            ${entry.id === activeRomId ? '<span class="rom-card-badge rom-card-badge-live">Em execucao</span>' : ""}
            ${entry.id === lastRomId ? '<span class="rom-card-badge">Ultima jogada</span>' : ""}
          </div>
          <div class="rom-library-card-actions">
            <button type="button" class="library-card-button" data-rom-launch="${entry.id}">Jogar</button>
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
  const record = {
    id: createRomId(file),
    name: file.name,
    size: file.size,
    updatedAt: Date.now(),
    coverUrl,
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

  const shouldColdBoot = shouldColdBootRom(entry.id);

  activeRomId = entry.id;
  saveLastRomSelection(entry.id);
  pushRecentRom({
    id: entry.id,
    name: entry.name,
    lastPlayedLabel: "Ultima jogada",
  });
  romFileName.textContent = `${entry.name} - Biblioteca local`;
  setSessionTitleText(formatRomTitle(entry.name));

  if (shouldColdBoot) {
    scheduleColdRomBoot(entry.id);
    return;
  }

  await bootEmulator(entry.file);
  renderRomLibrary();
}

function setPokedexOpen(open) {
  document.body.classList.toggle("is-pokedex-open", open);

  if (pokedexToggle) {
    pokedexToggle.setAttribute("aria-expanded", String(open));
  }

  if (pokedexPanel) {
    pokedexPanel.setAttribute("aria-hidden", String(!open));
  }

  if (open) {
    playQuickDexOpenSound();
  }
}

function playQuickDexOpenSound() {
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

function syncPokedexTabs() {
  pokedexTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.dexTab === activeDexTab);
  });
}

function loadQuickDexHistory() {
  try {
    const saved = window.localStorage.getItem("emulatorQuickDexHistory");
    quickDexHistory = saved ? JSON.parse(saved) : [];
  } catch (error) {
    quickDexHistory = [];
  }
}

function saveQuickDexHistory() {
  try {
    window.localStorage.setItem("emulatorQuickDexHistory", JSON.stringify(quickDexHistory.slice(0, 8)));
  } catch (error) {
    // Ignore storage failures.
  }
}

function pushQuickDexHistory(entry) {
  quickDexHistory = [entry, ...quickDexHistory.filter((item) => item.name !== entry.name)].slice(0, 6);
  saveQuickDexHistory();
}

async function fetchQuickDexJson(url) {
  if (!quickDexCache.has(url)) {
    quickDexCache.set(
      url,
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da PokeAPI.");
        }

        return response.json();
      }),
    );
  }

  return quickDexCache.get(url);
}

function formatQuickDexLabel(value) {
  return String(value).replace(/-/g, " ");
}

function translateEvolutionTerm(value) {
  const normalized = String(value || "").toLowerCase();
  const dictionary = {
    "level-up": "Subindo de nivel",
    trade: "Troca",
    use: "Usando item",
    other: "Metodo especial",
    "thunder-stone": "Pedra do Trovao",
    "fire-stone": "Pedra do Fogo",
    "water-stone": "Pedra da Agua",
    "leaf-stone": "Pedra da Folha",
    "moon-stone": "Pedra da Lua",
    "sun-stone": "Pedra do Sol",
    "dusk-stone": "Pedra do Anoitecer",
    "dawn-stone": "Pedra do Amanhecer",
    "shiny-stone": "Pedra Brilhante",
    "oval-stone": "Pedra Oval",
    "ice-stone": "Pedra do Gelo",
    "kings-rock": "Rocha do Rei",
  };

  return dictionary[normalized] || formatQuickDexLabel(normalized);
}

function normalizeQuickDexSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getQuickDexArtwork(pokemon) {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default ||
    ""
  );
}

function getQuickDexTypeColor(typeName) {
  const colors = {
    normal: "#9e9e7a",
    fire: "#f57d31",
    water: "#6493eb",
    electric: "#f9cf30",
    grass: "#74cb48",
    ice: "#9ad6df",
    fighting: "#c12239",
    poison: "#a43e9e",
    ground: "#dec16b",
    flying: "#a891ec",
    psychic: "#fb5584",
    bug: "#a7b723",
    rock: "#b69e31",
    ghost: "#70559b",
    dragon: "#7037ff",
    dark: "#75574c",
    steel: "#b7b9d0",
    fairy: "#e69eac",
  };

  return colors[typeName] || "#4cc4ff";
}

function getQuickDexTypeTextColor(typeName) {
  const darkTextTypes = new Set(["electric", "ice", "ground", "rock", "steel", "normal", "fairy"]);
  return darkTextTypes.has(typeName) ? "#182230" : "#f7fbff";
}

function hexToRgbChannels(hexColor) {
  const normalized = String(hexColor || "").replace("#", "");

  if (normalized.length !== 6) {
    return "76, 196, 255";
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

function getQuickDexTypeChipStyle(typeName) {
  const base = getQuickDexTypeColor(typeName);
  const text = getQuickDexTypeTextColor(typeName);
  const rgb = hexToRgbChannels(base);

  return [
    `color:${text}`,
    `background:linear-gradient(180deg, rgba(${rgb}, 0.96), rgba(${rgb}, 0.78))`,
    `border-color:rgba(${rgb}, 0.42)`,
    `box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 18px rgba(${rgb}, 0.18)`,
  ].join("; ");
}

function translateTypeName(typeName) {
  const dictionary = {
    normal: "Normal",
    fire: "Fogo",
    water: "Agua",
    electric: "Eletrico",
    grass: "Planta",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psiquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragao",
    dark: "Sombrio",
    steel: "Aco",
    fairy: "Fada",
  };

  return dictionary[String(typeName || "").toLowerCase()] || formatQuickDexLabel(typeName);
}

function getTypeShortLabel(typeName) {
  const dictionary = {
    normal: "NR",
    fire: "FG",
    water: "AG",
    electric: "EL",
    grass: "PL",
    ice: "GL",
    fighting: "LT",
    poison: "VN",
    ground: "TR",
    flying: "VO",
    psychic: "PS",
    bug: "IN",
    rock: "PD",
    ghost: "FT",
    dragon: "DG",
    dark: "SM",
    steel: "AC",
    fairy: "FD",
  };

  return dictionary[String(typeName || "").toLowerCase()] || String(typeName || "").slice(0, 2).toUpperCase();
}

function getTypeIcon(typeName) {
  const dictionary = {
    normal: "N",
    fire: "F",
    water: "W",
    electric: "E",
    grass: "G",
    ice: "I",
    fighting: "K",
    poison: "P",
    ground: "T",
    flying: "V",
    psychic: "Y",
    bug: "B",
    rock: "R",
    ghost: "H",
    dragon: "D",
    dark: "S",
    steel: "A",
    fairy: "Z",
  };

  return dictionary[String(typeName || "").toLowerCase()] || "?";
}

function setQuickDexGlowFromPokemon(pokemon) {
  const primaryType = pokemon.types?.[0]?.type?.name || "water";
  const glow = dexTypeGlow[primaryType] || "76 196 255";
  document.documentElement.style.setProperty("--dex-glow-rgb", glow);
}

async function getTypeDamageProfile(typeEntries) {
  const multiplierMap = new Map();

  for (const { type } of typeEntries) {
    const typeData = await fetchQuickDexJson(type.url);

    typeData.damage_relations.double_damage_from.forEach((entry) => {
      multiplierMap.set(entry.name, (multiplierMap.get(entry.name) || 1) * 2);
    });

    typeData.damage_relations.half_damage_from.forEach((entry) => {
      multiplierMap.set(entry.name, (multiplierMap.get(entry.name) || 1) * 0.5);
    });

    typeData.damage_relations.no_damage_from.forEach((entry) => {
      multiplierMap.set(entry.name, 0);
    });
  }

  return [...multiplierMap.entries()]
    .filter(([, multiplier]) => multiplier > 1)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6);
}

async function getTypeDefenseProfile(typeEntries) {
  const multiplierMap = new Map();

  for (const { type } of typeEntries) {
    const typeData = await fetchQuickDexJson(type.url);

    typeData.damage_relations.double_damage_to.forEach((entry) => {
      multiplierMap.set(entry.name, (multiplierMap.get(entry.name) || 1) * 2);
    });

    typeData.damage_relations.half_damage_to.forEach((entry) => {
      multiplierMap.set(entry.name, (multiplierMap.get(entry.name) || 1) * 0.5);
    });

    typeData.damage_relations.no_damage_to.forEach((entry) => {
      multiplierMap.set(entry.name, 0);
    });
  }

  const advantages = [...multiplierMap.entries()]
    .filter(([, multiplier]) => multiplier > 1)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6);

  const resistances = [...multiplierMap.entries()]
    .filter(([, multiplier]) => multiplier > 0 && multiplier < 1)
    .sort((first, second) => first[1] - second[1])
    .slice(0, 6);

  return { advantages, resistances };
}

function flattenQuickDexEvolution(chain, result = []) {
  if (!chain) {
    return result;
  }

  result.push({
    name: chain.species.name,
    requirement: chain.evolution_details?.[0] || null,
  });

  chain.evolves_to.forEach((entry) => flattenQuickDexEvolution(entry, result));
  return result;
}

async function getQuickDexEvolutionCards(pokemon) {
  const speciesData = await fetchQuickDexJson(pokemon.species.url);

  if (!speciesData.evolution_chain?.url) {
    return [];
  }

  const evolutionData = await fetchQuickDexJson(speciesData.evolution_chain.url);
  const speciesList = flattenQuickDexEvolution(evolutionData.chain).slice(0, 4);

  return Promise.all(
    speciesList.map(async (species) => {
      const details = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon/${species.name}`);
      return {
        id: details.id,
        name: details.name,
        image: getQuickDexArtwork(details),
        requirement: species.requirement,
      };
    }),
  );
}

function formatEvolutionRequirement(requirement) {
  if (!requirement) {
    return "Forma base";
  }

  const parts = [];

  if (requirement.min_level) {
    parts.push(`Nivel ${requirement.min_level}`);
  }

  if (requirement.item?.name) {
    parts.push(`Item: ${translateEvolutionTerm(requirement.item.name)}`);
  }

  if (requirement.held_item?.name) {
    parts.push(`Segurando: ${translateEvolutionTerm(requirement.held_item.name)}`);
  }

  if (requirement.min_happiness) {
    parts.push("Amizade");
  }

  if (requirement.time_of_day) {
    parts.push(requirement.time_of_day === "day" ? "Durante o dia" : "Durante a noite");
  }

  if (
    requirement.trigger?.name &&
    !requirement.min_level &&
    !requirement.item?.name &&
    !requirement.min_happiness
  ) {
    parts.push(translateEvolutionTerm(requirement.trigger.name));
  }

  if (!parts.length) {
    parts.push("Metodo especial");
  }

  return parts.join(" - ");
}

async function renderQuickDexDetail(pokemon) {
  if (!pokedexDetail) {
    return;
  }

  currentQuickDexPokemon = pokemon;
  setQuickDexGlowFromPokemon(pokemon);
  pokedexDetail.classList.remove("is-animating");
  void pokedexDetail.offsetWidth;
  pokedexDetail.classList.add("is-animating");

  const types = pokemon.types
    .map(
      ({ type }) => `
        <span class="pokedex-type-chip" style="${getQuickDexTypeChipStyle(type.name)}">
          <span class="pokedex-type-icon" aria-hidden="true">${getTypeIcon(type.name)}</span>
          <span>${translateTypeName(type.name)}</span>
        </span>
      `,
    )
    .join("");

  const abilities = pokemon.abilities
    .slice(0, 2)
    .map(({ ability }) => formatQuickDexLabel(ability.name))
    .join(", ");

  const stats = pokemon.stats
    .slice(0, 4)
    .map(
      (stat, index) => `
        <div class="pokedex-stat-row">
          <span>${formatQuickDexLabel(stat.stat.name)}</span>
          <strong>${stat.base_stat}</strong>
          <div class="pokedex-stat-meter" aria-hidden="true">
            <div class="pokedex-stat-fill" style="width:${Math.min((stat.base_stat / 180) * 100, 100)}%; animation-delay:${index * 70}ms;"></div>
          </div>
        </div>
      `,
    )
    .join("");

  const statMap = Object.fromEntries(pokemon.stats.map((entry) => [entry.stat.name, entry.base_stat]));
  const radarAttack = Math.min(((statMap.attack || 1) / 180) * 100, 100);
  const radarDefense = Math.min(((statMap.defense || 1) / 180) * 100, 100);
  const radarSpeed = Math.min(((statMap.speed || 1) / 180) * 100, 100);
  const radarSpAtk = Math.min(((statMap["special-attack"] || 1) / 180) * 100, 100);

  const weaknesses = await getTypeDamageProfile(pokemon.types);
  const battleProfile = await getTypeDefenseProfile(pokemon.types);
  const evolutions = await getQuickDexEvolutionCards(pokemon);
  const hiddenAbility = pokemon.abilities.find((entry) => entry.is_hidden)?.ability?.name || "";
  const moves = pokemon.moves
    .map((entry) => {
      const preferred =
        entry.version_group_details.find((detail) => detail.move_learn_method.name === "level-up") ||
        entry.version_group_details[0];

      return {
        name: entry.move.name,
        method: preferred?.move_learn_method?.name || "unknown",
        level: preferred?.level_learned_at || 0,
      };
    })
    .sort((first, second) => {
      if (first.method === "level-up" && second.method !== "level-up") {
        return -1;
      }

      if (first.method !== "level-up" && second.method === "level-up") {
        return 1;
      }

      return first.level - second.level;
    })
    .slice(0, 6);

  const weaknessMarkup = weaknesses.length
    ? weaknesses
        .map(
          ([typeName, multiplier]) => `
            <span
              class="pokedex-weakness-chip"
              style="${getQuickDexTypeChipStyle(typeName)}"
            >
              <span class="type-chip-mark" aria-hidden="true">${getTypeIcon(typeName)}</span>
              <span class="type-chip-copy">
                <span class="type-chip-name">${translateTypeName(typeName)}</span>
                <span class="type-chip-value">${multiplier}x de dano</span>
              </span>
            </span>
          `,
        )
        .join("")
    : "<p>Sem fraquezas destacadas.</p>";

  const advantageMarkup = battleProfile.advantages.length
    ? battleProfile.advantages
        .map(
          ([typeName, multiplier]) => `
            <span
              class="pokedex-advantage-chip"
              style="${getQuickDexTypeChipStyle(typeName)}"
            >
              <span class="type-chip-mark" aria-hidden="true">${getTypeIcon(typeName)}</span>
              <span class="type-chip-copy">
                <span class="type-chip-name">${translateTypeName(typeName)}</span>
                <span class="type-chip-value">${multiplier}x ofensivo</span>
              </span>
            </span>
          `,
        )
        .join("")
    : "<p>Sem vantagens destacadas.</p>";

  const resistanceMarkup = battleProfile.resistances.length
    ? battleProfile.resistances
        .map(
          ([typeName, multiplier]) => `
            <span
              class="pokedex-advantage-chip"
              style="${getQuickDexTypeChipStyle(typeName)}"
            >
              <span class="type-chip-mark" aria-hidden="true">${getTypeIcon(typeName)}</span>
              <span class="type-chip-copy">
                <span class="type-chip-name">${translateTypeName(typeName)}</span>
                <span class="type-chip-value">${multiplier}x resistente</span>
              </span>
            </span>
          `,
        )
        .join("")
    : "<p>Sem resistencias destacadas.</p>";

  const evolutionMarkup = evolutions.length
    ? evolutions
        .map(
          (entry) => `
            <button
              type="button"
              class="pokedex-evolution-card${entry.name === pokemon.name ? " is-active" : ""}"
              data-evolution-name="${entry.name}"
            >
              <img src="${entry.image}" alt="${entry.name}" />
              <strong>${formatQuickDexLabel(entry.name)}</strong>
              <span>#${String(entry.id).padStart(4, "0")}</span>
              <small>${formatEvolutionRequirement(entry.requirement)}</small>
            </button>
          `,
        )
        .join("")
    : "<p>Sem cadeia evolutiva disponivel.</p>";

  const moveMarkup = moves.length
    ? moves
        .map(
          (move) => `
            <div class="pokedex-move-card">
              <strong>${formatQuickDexLabel(move.name)}</strong>
              <span>${formatQuickDexLabel(move.method)}${move.level ? ` - nivel ${move.level}` : ""}</span>
            </div>
          `,
        )
        .join("")
    : "<p>Sem moves disponiveis.</p>";

  const historyMarkup = quickDexHistory.length
    ? quickDexHistory
        .map(
          (entry) => `
            <button type="button" class="pokedex-history-chip" data-history-name="${entry.name}">
              <strong>${formatQuickDexLabel(entry.name)}</strong>
              <span>#${String(entry.id).padStart(4, "0")}</span>
            </button>
          `,
        )
        .join("")
    : "<p>Sem historico ainda.</p>";

  pushQuickDexHistory({
    name: pokemon.name,
    id: pokemon.id,
  });

  const dataSection = `
    <div class="pokedex-meta-grid pokedex-detail-section">
      <div class="pokedex-meta-card">
        <span>Altura</span>
        <strong>${(pokemon.height / 10).toFixed(1)} m</strong>
      </div>
      <div class="pokedex-meta-card">
        <span>Peso</span>
        <strong>${(pokemon.weight / 10).toFixed(1)} kg</strong>
      </div>
      <div class="pokedex-meta-card">
        <span>Base XP</span>
        <strong>${pokemon.base_experience ?? "?"}</strong>
      </div>
      <div class="pokedex-meta-card">
        <span>Habilidade</span>
        <strong>${abilities || "Sem dados"}</strong>
      </div>
      <div class="pokedex-meta-card">
        <span>Habilidade oculta</span>
        <strong>${hiddenAbility ? formatQuickDexLabel(hiddenAbility) : "Nao possui"}</strong>
      </div>
    </div>

    <div class="pokedex-stats pokedex-detail-section">${stats}</div>

    <h4 class="pokedex-section-title pokedex-detail-section">Moves principais</h4>
    <div class="pokedex-moves-grid pokedex-detail-section">${moveMarkup}</div>
  `;

  const battleSection = `
    <div class="pokedex-radar pokedex-detail-section">
      <div
        class="pokedex-radar-shape"
        style="clip-path: polygon(
          50% ${50 - radarAttack / 2}%,
          ${50 + radarSpAtk / 2}% 50%,
          50% ${50 + radarDefense / 2}%,
          ${50 - radarSpeed / 2}% 50%
        );"
      ></div>
      <div class="pokedex-radar-sweep"></div>
      <div class="pokedex-radar-center"></div>
      <span class="pokedex-radar-label pokedex-radar-label-top">Atk</span>
      <span class="pokedex-radar-label pokedex-radar-label-right">Res</span>
      <span class="pokedex-radar-label pokedex-radar-label-bottom">Def</span>
      <span class="pokedex-radar-label pokedex-radar-label-left">Spd</span>
    </div>

    <h4 class="pokedex-section-title pokedex-detail-section">Fraquezas</h4>
    <div class="pokedex-weakness-grid pokedex-detail-section">${weaknessMarkup}</div>

    <h4 class="pokedex-section-title pokedex-detail-section">Vantagens ofensivas</h4>
    <div class="pokedex-advantage-grid pokedex-detail-section">${advantageMarkup}</div>

    <h4 class="pokedex-section-title pokedex-detail-section">Resistencias ofensivas</h4>
    <div class="pokedex-advantage-grid pokedex-detail-section">${resistanceMarkup}</div>
  `;

  const evolutionSection = `
    <h4 class="pokedex-section-title pokedex-detail-section">Evolucoes</h4>
    <div class="pokedex-evolution-grid pokedex-detail-section">${evolutionMarkup}</div>

    <h4 class="pokedex-section-title pokedex-detail-section">Ultimas pesquisas</h4>
    <div class="pokedex-history-grid pokedex-detail-section">${historyMarkup}</div>
  `;

  const tabContent =
    activeDexTab === "batalha"
      ? battleSection
      : activeDexTab === "evolucao"
        ? evolutionSection
        : dataSection;

  pokedexDetail.innerHTML = `
    <div class="pokedex-detail-hero">
      <div class="pokedex-detail-hero-visual">
        <img src="${getQuickDexArtwork(pokemon)}" alt="${pokemon.name}" />
      </div>
      <div class="pokedex-detail-heading">
        <strong>${formatQuickDexLabel(pokemon.name)}</strong>
        <span>#${String(pokemon.id).padStart(4, "0")}</span>
      </div>
    </div>

    <div class="pokedex-type-list pokedex-detail-section">${types}</div>
    ${tabContent}
  `;

  const radarSweep = pokedexDetail.querySelector(".pokedex-radar-sweep");
  if (radarSweep) {
    radarSweep.style.animation = "radar-sweep 4.2s linear infinite";
  }
}

async function renderQuickDexResults(searchTerm) {
  if (!pokedexList || !pokedexSummary) {
    return;
  }

  const normalized = String(searchTerm || "").trim().toLowerCase();

  if (!normalized) {
    pokedexSummary.textContent = "Digite para pesquisar.";
    pokedexList.innerHTML = "";
    if (pokedexDetail) {
      const historyMarkup = quickDexHistory.length
        ? quickDexHistory
            .map(
              (entry) => `
                <button type="button" class="pokedex-history-chip" data-history-name="${entry.name}">
                  <strong>${formatQuickDexLabel(entry.name)}</strong>
                  <span>#${String(entry.id).padStart(4, "0")}</span>
                </button>
              `,
            )
            .join("")
        : "<p>Sem historico ainda.</p>";

      pokedexDetail.innerHTML = `
        <div class="pokedex-detail-empty">
          <div>
            <p>Selecione um Pokemon para consultar seus dados enquanto joga.</p>
            <h4 class="pokedex-section-title">Ultimas pesquisas</h4>
            <div class="pokedex-history-grid">${historyMarkup}</div>
          </div>
        </div>
      `;
    }
    return;
  }

  pokedexSummary.textContent = "Pesquisando...";

  try {
    if (!fullDexList.length) {
      const listPayload = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon?limit=1025&offset=0`);
      fullDexList = listPayload.results.map((pokemon, index) => ({
        name: pokemon.name,
        id: index + 1,
        searchLabel: normalizeQuickDexSearch(pokemon.name),
      }));
    }

    const filtered = fullDexList
      .filter(
        (pokemon) =>
          pokemon.searchLabel.includes(normalized) || String(pokemon.id).includes(normalized),
      )
      .slice(0, 8);

    pokedexSummary.textContent = `${filtered.length} resultado(s)`;

    if (!filtered.length) {
      pokedexList.innerHTML = "";
      if (pokedexDetail) {
        pokedexDetail.innerHTML = "<p>Nenhum Pokemon encontrado nessa busca.</p>";
      }
      return;
    }

    pokedexList.innerHTML = filtered
      .map(
        (pokemon) => `
          <button
            type="button"
            class="pokedex-result${activePokedexSelection === pokemon.name ? " is-active" : ""}"
            data-pokemon-name="${pokemon.name}"
          >
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />
            <span>
              <strong>${formatQuickDexLabel(pokemon.name)}</strong>
              <span>#${String(pokemon.id).padStart(4, "0")}</span>
            </span>
          </button>
        `,
      )
      .join("");

    pokedexList.classList.remove("is-refreshing");
    void pokedexList.offsetWidth;
    pokedexList.classList.add("is-refreshing");

    const nextSelection =
      filtered.find((pokemon) => pokemon.name === activePokedexSelection)?.name || filtered[0].name;

    activePokedexSelection = nextSelection;

    const details = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon/${nextSelection}`);
    await renderQuickDexDetail(details);
    pokedexList
      .querySelectorAll(".pokedex-result")
      .forEach((button) =>
        button.classList.toggle("is-active", button.dataset.pokemonName === activePokedexSelection),
      );
  } catch (error) {
    pokedexSummary.textContent = "Falha ao buscar.";
    pokedexList.innerHTML = "";
    if (pokedexDetail) {
      pokedexDetail.innerHTML = "<p>Nao foi possivel carregar a Pokedex agora.</p>";
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

function syncDockState() {
  setDockEnabled(dockFullscreen, true);
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
}

function showRuntimeHint(message) {
  if (mobileActionHint) {
    mobileActionHint.textContent = message;
    mobileActionHint.hidden = false;
  } else if (romStatus) {
    romStatus.textContent = message;
  }

  window.setTimeout(() => {
    if (mobileActionHint) {
      mobileActionHint.hidden = true;
      mobileActionHint.textContent = "";
    } else if (romStatus && document.body.classList.contains("has-rom")) {
      romStatus.textContent = "Emulador em execucao";
    }
  }, 2200);
}

function resetRuntimeState() {
  document.body.classList.remove("is-loading-rom");
  emulatorLoading.hidden = true;
}

function showRuntimeError(message) {
  document.body.classList.remove("has-rom");
  resetRuntimeState();
  emulatorRuntime.classList.remove("is-visible");
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

function clearExistingRuntime() {
  activeBootToken += 1;

  if (mobileToolbarObserver) {
    mobileToolbarObserver.disconnect();
    mobileToolbarObserver = null;
  }

  if (activeLoaderScript) {
    activeLoaderScript.remove();
    activeLoaderScript = null;
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
  delete window.EJS_Buttons;
  if (emulatorRuntime) {
    emulatorRuntime.classList.remove("is-visible");
  }
  setEmulationReady(false);
}

function forceRuntimeSizing() {
  const runtimeHost = getEmulatorHost();

  if (!runtimeHost) {
    return;
  }

  const nestedNodes = runtimeHost.querySelectorAll("iframe, canvas, .ejs_player, .game");

  nestedNodes.forEach((node) => {
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.maxWidth = "100%";
    node.style.display = "block";

    if (node instanceof HTMLCanvasElement) {
      node.style.imageRendering = "pixelated";
      node.style.backgroundColor = "#000";
      node.style.transform = "translateZ(0)";
      node.style.backfaceVisibility = "hidden";
    }
  });
}

function dispatchVirtualKey(type, touchKey) {
  const keyConfig = TOUCH_KEY_MAP[touchKey];
  if (!keyConfig) {
    return;
  }

  const runtimeHost = getEmulatorHost();
  const canvas = runtimeHost?.querySelector("canvas");
  const targets = [window, document, runtimeHost, canvas].filter(Boolean);

  if (runtimeHost instanceof HTMLElement) {
    runtimeHost.tabIndex = 0;
    runtimeHost.focus({ preventScroll: true });
  }

  if (canvas instanceof HTMLElement) {
    canvas.tabIndex = 0;
    canvas.focus({ preventScroll: true });
  }

  targets.forEach((target) => {
    const keyboardEvent = new KeyboardEvent(type, {
      key: keyConfig.key,
      code: keyConfig.code,
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(keyboardEvent, "keyCode", { get: () => keyConfig.keyCode });
    Object.defineProperty(keyboardEvent, "which", { get: () => keyConfig.keyCode });

    target.dispatchEvent(keyboardEvent);
  });
}

function releaseAllTouchKeys() {
  activeTouchKeys.forEach((touchKey, pointerId) => {
    dispatchVirtualKey("keyup", touchKey);
    activeTouchKeys.delete(pointerId);
  });

  if (!mobileTouchControls) {
    return;
  }

  mobileTouchControls.querySelectorAll(".touch-key.is-pressed").forEach((button) => {
    button.classList.remove("is-pressed");
  });
}

function setupMobileTouchControls() {
  if (!mobileTouchControls) {
    return;
  }

  applyTouchLayout();

  const touchButtons = mobileTouchControls.querySelectorAll("[data-touch-key]");

  touchButtons.forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      if (touchLayoutEditMode) {
        return;
      }

      const touchKey = button.dataset.touchKey;
      if (!touchKey) {
        return;
      }

      event.preventDefault();
      button.classList.add("is-pressed");
      activeTouchKeys.set(event.pointerId, touchKey);
      dispatchVirtualKey("keydown", touchKey);
      button.setPointerCapture?.(event.pointerId);
    });

    const releasePointer = (event) => {
      const touchKey = activeTouchKeys.get(event.pointerId);
      if (!touchKey) {
        return;
      }

      event.preventDefault();
      activeTouchKeys.delete(event.pointerId);
      button.classList.remove("is-pressed");
      dispatchVirtualKey("keyup", touchKey);
    };

    button.addEventListener("pointerup", releasePointer);
    button.addEventListener("pointercancel", releasePointer);
    button.addEventListener("lostpointercapture", releasePointer);
  });

  window.addEventListener("blur", releaseAllTouchKeys);
  window.addEventListener("resize", applyTouchLayout);

  mobileTouchControls.querySelectorAll("[data-touch-group]").forEach((group) => {
    group.addEventListener("pointerdown", (event) => {
      if (!touchLayoutEditMode || !isTouchLayoutOverlayMode()) {
        return;
      }

      const hostRect = mobileTouchControls.getBoundingClientRect();
      const groupRect = group.getBoundingClientRect();

      activeTouchLayoutDrag = {
        groupKey: group.dataset.touchGroup || "",
        pointerId: event.pointerId,
        offsetX: event.clientX - groupRect.left,
        offsetY: event.clientY - groupRect.top,
        hostRect,
        width: groupRect.width,
        height: groupRect.height,
      };

      group.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    group.addEventListener("pointermove", (event) => {
      if (
        !activeTouchLayoutDrag ||
        activeTouchLayoutDrag.pointerId !== event.pointerId ||
        activeTouchLayoutDrag.groupKey !== group.dataset.touchGroup
      ) {
        return;
      }

      const maxLeft = Math.max(activeTouchLayoutDrag.hostRect.width - activeTouchLayoutDrag.width, 0);
      const maxTop = Math.max(activeTouchLayoutDrag.hostRect.height - activeTouchLayoutDrag.height, 0);
      const left = clampTouchLayoutValue(
        event.clientX - activeTouchLayoutDrag.hostRect.left - activeTouchLayoutDrag.offsetX,
        0,
        maxLeft,
      );
      const top = clampTouchLayoutValue(
        event.clientY - activeTouchLayoutDrag.hostRect.top - activeTouchLayoutDrag.offsetY,
        0,
        maxTop,
      );

      const layout = loadTouchLayout();
      layout[activeTouchLayoutDrag.groupKey] = {
        x: Number(((left / activeTouchLayoutDrag.hostRect.width) * 100).toFixed(2)),
        y: Number(((top / activeTouchLayoutDrag.hostRect.height) * 100).toFixed(2)),
      };
      saveTouchLayout(layout);
      applyTouchLayout();
      event.preventDefault();
    });

    const stopDrag = (event) => {
      if (!activeTouchLayoutDrag || activeTouchLayoutDrag.pointerId !== event.pointerId) {
        return;
      }

      activeTouchLayoutDrag = null;
      event.preventDefault();
    };

    group.addEventListener("pointerup", stopDrag);
    group.addEventListener("pointercancel", stopDrag);
    group.addEventListener("lostpointercapture", stopDrag);
  });
}

function disableMobileRuntimeContextMenu() {
  if (!emulatorRuntime || !window.matchMedia("(max-width: 820px)").matches) {
    return;
  }

  emulatorRuntime.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
}

function isCompactTouchUi() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function getMobileToolbarContainer(node, runtimeHost) {
  let current = node instanceof Element ? node : null;

  while (current && current !== runtimeHost) {
    const interactiveCount = current.querySelectorAll('button, [role="button"], input[type="range"]').length;
    const hasVolumeSlider = Boolean(current.querySelector('input[type="range"]'));

    if (hasVolumeSlider || interactiveCount >= 2) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function hideMobileEmulatorToolbar() {
  if (!isCompactTouchUi()) {
    return;
  }

  const runtimeHost = getEmulatorHost();
  if (!runtimeHost) {
    return;
  }

  const nodes = runtimeHost.querySelectorAll("*");

  nodes.forEach((node) => {
    const text = (node.textContent || "").trim().toLowerCase();
    const title = (node.getAttribute("title") || "").trim().toLowerCase();
    const ariaLabel = (node.getAttribute("aria-label") || "").trim().toLowerCase();
    const matchesToolbarLabel = MOBILE_TOOLBAR_LABELS.some((label) =>
      text.includes(label) || title.includes(label) || ariaLabel.includes(label),
    );

    if (!matchesToolbarLabel && !node.matches('input[type="range"]')) {
      return;
    }

    const toolbarContainer = getMobileToolbarContainer(node, runtimeHost);
    if (!toolbarContainer || toolbarContainer.dataset.ejsToolbarHidden === "true") {
      return;
    }

    toolbarContainer.dataset.ejsToolbarHidden = "true";
    toolbarContainer.style.display = "none";
    toolbarContainer.style.pointerEvents = "none";
  });
}

function ensureMobileToolbarObserver() {
  if (!isCompactTouchUi() || !window.MutationObserver) {
    return;
  }

  const runtimeHost = getEmulatorHost();
  if (!runtimeHost) {
    return;
  }

  if (mobileToolbarObserver) {
    mobileToolbarObserver.disconnect();
  }

  mobileToolbarObserver = new MutationObserver(() => {
    hideMobileEmulatorToolbar();
  });

  mobileToolbarObserver.observe(runtimeHost, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["title", "aria-label", "style", "class"],
  });

  hideMobileEmulatorToolbar();
}

function getEmulatorToolbarConfig() {
  if (!isCompactTouchUi()) {
    return {};
  }

  return {
    playPause: false,
    restart: false,
    mute: false,
    settings: false,
    fullscreen: false,
    saveState: false,
    loadState: false,
    screenRecord: false,
    gamepad: false,
    cheat: false,
    volume: false,
    saveSavFiles: false,
    loadSavFiles: false,
    quickSave: false,
    quickLoad: false,
    screenshot: false,
    cacheManager: false,
    exitEmulation: false,
  };
}

async function bootEmulator(file) {
  if (!emulatorRuntime || !emulatorLoading || !emulatorError) {
    return;
  }

  clearExistingRuntime();
  clearActiveRomUrl();
  const bootToken = activeBootToken;
  const runtimeHost = getEmulatorHost();

  document.body.classList.add("has-rom", "is-loading-rom");
  emulatorRuntime.classList.remove("is-visible");
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

  window.EJS_player = "#emulatorjs-player";
  window.EJS_core = "gba";
  window.EJS_pathtodata = EMULATORJS_DATA_PATH;
  window.EJS_gameName = getRomDisplayName(file);
  window.EJS_gameUrl = activeRomUrl;
  window.EJS_startOnLoaded = true;
  window.EJS_volume = 0.65;
  window.EJS_Buttons = getEmulatorToolbarConfig();

  activeLoaderScript = document.createElement("script");
  activeLoaderScript.src = `${EMULATORJS_DATA_PATH}loader.js?v=${Date.now()}`;
  activeLoaderScript.dataset.emulatorjsLoader = "true";
  activeLoaderScript.async = true;

  activeLoaderScript.addEventListener("load", () => {
    if (bootToken !== activeBootToken) {
      return;
    }
    document.body.classList.remove("is-loading-rom");
    emulatorLoading.hidden = true;
    emulatorRuntime.classList.add("is-visible");
    window.setTimeout(forceRuntimeSizing, 250);
    window.setTimeout(forceRuntimeSizing, 1200);
    window.setTimeout(hideMobileEmulatorToolbar, 150);
    window.setTimeout(hideMobileEmulatorToolbar, 800);
    window.setTimeout(ensureMobileToolbarObserver, 150);
    romStatus.textContent = "Emulador em execucao";
    hudMode.textContent = "ROM em execucao";
    setEmulationReady(true);
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
    romStatus.textContent = "Arquivo selecionado";
    syncSessionSummary();

    const [file] = romInput.files || [];

    if (!file) {
      clearExistingRuntime();
      clearActiveRomUrl();
      document.body.classList.remove("has-rom");
      resetRuntimeState();
      emulatorRuntime?.classList.remove("is-visible");
      if (emulatorError) {
        emulatorError.hidden = true;
      }
      romStatus.textContent = "Sem ROM carregada";
      romFileName.textContent = "Nenhum arquivo selecionado";
      hudMode.textContent = "Aguardando ROM";
      if (screenBadge) {
        setSessionBadgeText("Pronto para iniciar");
      }
      setSessionTitleText("Oak Emulador");
      setEmulationReady(false);
      syncSessionSummary();
      return;
    }

    romStatus.textContent = "ROM pronta para integrar";
    romFileName.textContent = file.name;
    hudMode.textContent = "ROM carregada localmente";
    if (screenBadge) {
      setSessionBadgeText("ROM carregada");
    }
    setSessionTitleText(file.name.replace(/\.(gba|zip|7z)$/i, ""));

    if (!/\.gba$/i.test(file.name)) {
      showRuntimeError("Use uma ROM de Game Boy Advance no formato .gba para iniciar o emulador.");
      return;
    }

    try {
      const savedRecord = await saveRomToLibrary(file);
      activeRomId = savedRecord.id;
      saveLastRomSelection(savedRecord.id);
      pushRecentRom({
        id: savedRecord.id,
        name: savedRecord.name,
        lastPlayedLabel: "Adicionada agora",
      });
    } catch (error) {
      romStatus.textContent = "ROM carregada sem biblioteca";
      activeRomId = "";
    }

    if (activeRomId) {
      scheduleColdRomBoot(activeRomId);
      return;
    }

    await bootEmulator(file);
    renderRecentRoms();
    syncSessionSummary();
  });
}

if (demoToggle && hudMode) {
  demoToggle.addEventListener("click", () => {
    const demoEnabled = document.body.classList.toggle("is-demo-on");
    hudMode.textContent = demoEnabled ? "HUD demo ativo" : "Aguardando ROM";
    if (screenBadge) {
      setSessionBadgeText(demoEnabled ? "HUD energizado" : "Pronto para iniciar");
    }
  });
}

if (dockFullscreen && emulatorRuntime) {
  dockFullscreen.addEventListener("click", async () => {
    const target = document.querySelector("#play-space") || document.querySelector(".player-screen");

    if (!target) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();

        if (window.screen?.orientation?.unlock) {
          window.screen.orientation.unlock();
        }
      } else {
        await target.requestFullscreen();

        if (window.screen?.orientation?.lock) {
          try {
            await window.screen.orientation.lock("landscape");
          } catch (error) {
            // Ignore orientation lock failures on unsupported browsers.
          }
        }
      }
    } catch (error) {
      showRuntimeHint("O navegador bloqueou o fullscreen dessa sessao.");
    }
  });
}

if (mobileFullscreen && dockFullscreen) {
  mobileFullscreen.addEventListener("click", () => {
    dockFullscreen.click();
  });
}

if (mobileEmulatorSettings) {
  mobileEmulatorSettings.addEventListener("click", () => {
    triggerEmulatorActionOrToast(
      ["settings", "menu", "control settings"],
      "Nao consegui abrir as configuracoes do emulador agora.",
    );
  });
}

if (mobilePokedexToggle && pokedexToggle) {
  mobilePokedexToggle.addEventListener("click", () => {
    pokedexToggle.click();
  });
}

if (mobileSaveFile) {
  mobileSaveFile.addEventListener("click", () => {
    triggerEmulatorActionOrToast(
      ["saveSavFiles", "save files", "export save file", "save file", "save"],
      "Nao consegui abrir a exportacao de save agora.",
    );
  });
}

if (mobileLoadFile) {
  mobileLoadFile.addEventListener("click", () => {
    if (!document.body.classList.contains("has-rom")) {
      showRuntimeHint("Carregue uma ROM antes de importar um save.");
      return;
    }

    saveImportInput?.click();
  });
}

if (mobileControlSettings) {
  mobileControlSettings.addEventListener("click", () => {
    triggerEmulatorActionOrToast(
      ["gamepad", "control settings", "keyboard"],
      "Nao consegui abrir os controles do emulador agora.",
    );
  });
}

if (mobileTouchLayoutToggle) {
  mobileTouchLayoutToggle.addEventListener("click", () => {
    touchLayoutEditMode = !touchLayoutEditMode;
    document.body.classList.toggle("is-touch-layout-editing", touchLayoutEditMode);
    mobileTouchLayoutToggle.textContent = touchLayoutEditMode ? "Fixar" : "Mover";
    releaseAllTouchKeys();
    applyTouchLayout();
  });
}

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
    }

    saveImportInput.value = "";
  });
}

if (pokedexToggle) {
  pokedexToggle.addEventListener("click", () => {
    const willOpen = !document.body.classList.contains("is-pokedex-open");
    setPokedexOpen(willOpen);

    if (willOpen) {
      pokedexSearch?.focus();
    }
  });
}

if (pokedexClose) {
  pokedexClose.addEventListener("click", () => {
    setPokedexOpen(false);
  });
}

if (pokedexSearch) {
  pokedexSearch.addEventListener("input", () => {
    window.clearTimeout(pokedexSearchTimer);
    pokedexSearchTimer = window.setTimeout(() => {
      renderQuickDexResults(pokedexSearch.value);
    }, 220);
  });
}

if (pokedexTabs.length) {
  pokedexTabs.forEach((button) => {
    button.addEventListener("click", async () => {
      activeDexTab = button.dataset.dexTab || "dados";
      syncPokedexTabs();

      if (!activePokedexSelection || !currentQuickDexPokemon) {
        return;
      }

      pokedexDetail?.classList.remove("tab-switching");
      void pokedexDetail?.offsetWidth;
      pokedexDetail?.classList.add("tab-switching");

      const details = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon/${activePokedexSelection}`);
      await renderQuickDexDetail(details);
    });
  });
}

if (pokedexList) {
  pokedexList.addEventListener("click", async (event) => {
    const button = event.target.closest(".pokedex-result");

    if (!button?.dataset.pokemonName) {
      return;
    }

    activePokedexSelection = button.dataset.pokemonName;
    const details = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon/${activePokedexSelection}`);
    await renderQuickDexDetail(details);
    pokedexList
      .querySelectorAll(".pokedex-result")
      .forEach((item) => item.classList.toggle("is-active", item === button));
  });
}

if (pokedexDetail) {
  pokedexDetail.addEventListener("click", async (event) => {
    const evolutionButton = event.target.closest("[data-evolution-name]");
    const button = event.target.closest("[data-history-name]");

    if (evolutionButton?.dataset.evolutionName) {
      activePokedexSelection = evolutionButton.dataset.evolutionName;
      const details = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon/${activePokedexSelection}`);
      await renderQuickDexDetail(details);

      if (pokedexSearch) {
        pokedexSearch.value = activePokedexSelection;
      }

      return;
    }

    if (!button?.dataset.historyName) {
      return;
    }

    activePokedexSelection = button.dataset.historyName;
    const details = await fetchQuickDexJson(`${POKEAPI_BASE}/pokemon/${activePokedexSelection}`);
    await renderQuickDexDetail(details);

    if (pokedexSearch) {
      pokedexSearch.value = activePokedexSelection;
    }
  });
}

if (romLibraryList) {
  romLibraryList.addEventListener("click", async (event) => {
    const launchButton = event.target.closest("[data-rom-launch]");
    const deleteButton = event.target.closest("[data-rom-delete]");

    if (launchButton?.dataset.romLaunch) {
      try {
        await launchLibraryRom(launchButton.dataset.romLaunch);
      } catch (error) {
        showRuntimeError("Nao consegui iniciar essa ROM da biblioteca local.");
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
  const target = event.target;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;

  if (isTyping) {
    return;
  }

  if (event.key.toLowerCase() === "p") {
    event.preventDefault();
    const willOpen = !document.body.classList.contains("is-pokedex-open");
    setPokedexOpen(willOpen);

    if (willOpen) {
      pokedexSearch?.focus();
    }
  }

  if (event.key === "Escape" && document.body.classList.contains("is-pokedex-open")) {
    setPokedexOpen(false);
  }
});

loadQuickDexHistory();
syncPokedexTabs();
syncLauncherTabs();
syncDockState();
disableMobileRuntimeContextMenu();
setupMobileTouchControls();
setupMobileActionFab();
await loadRomLibrary();
renderRecentRoms();
syncSessionSummary();

const pendingRomId = getPendingColdRomBoot();

if (pendingRomId) {
  try {
    clearPendingColdRomBoot();
    await launchLibraryRom(pendingRomId);
  } catch (error) {
    clearPendingColdRomBoot();
    saveLastRomSelection("");
    renderRomLibrary();
  }
} else {
  const lastRomId = getLastRomSelection();
  if (lastRomId) {
    try {
      await launchLibraryRom(lastRomId);
    } catch (error) {
      saveLastRomSelection("");
      renderRomLibrary();
    }
  }
}
