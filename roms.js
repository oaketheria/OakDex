export const ROM_DB_NAME = "pokemon-emerald-gx";
export const ROM_STORE_NAME = "rom-library";
export const BIOS_STORE_NAME = "bios-library";
export const SAVE_STORE_NAME = "save-library";
export const PS1_BIOS_ID = "ps1-scph5501";
export const ROM_ACCEPT = ".gba,.gb,.gbc,.nes,.sfc,.smc,.md,.gen,.sms,.gg,.n64,.z64,.v64,.chd,.pbp,.iso,.bin";

export const EMULATOR_SYSTEMS = [
  { id: "gba", label: "GBA", name: "Game Boy Advance", core: "gba", extensions: ["gba"] },
  { id: "gb", label: "GB", name: "Game Boy", core: "gb", extensions: ["gb"] },
  { id: "gbc", label: "GBC", name: "Game Boy Color", core: "gb", extensions: ["gbc"] },
  { id: "nes", label: "NES", name: "Nintendo Entertainment System", core: "nes", extensions: ["nes"] },
  { id: "snes", label: "SNES", name: "Super Nintendo", core: "snes", extensions: ["sfc", "smc"] },
  { id: "md", label: "Mega Drive", name: "Mega Drive / Genesis", core: "segaMD", extensions: ["md", "gen"] },
  { id: "sms", label: "Master System", name: "Sega Master System", core: "segaMS", extensions: ["sms"] },
  { id: "gg", label: "Game Gear", name: "Sega Game Gear", core: "segaGG", extensions: ["gg"] },
  { id: "n64", label: "N64", name: "Nintendo 64", core: "n64", extensions: ["n64", "z64", "v64"] },
  { id: "ps1", label: "PS1", name: "PlayStation 1", core: "psx", extensions: ["chd", "pbp", "iso", "bin"] },
];

export function getRomExtension(fileName) {
  return String(fileName || "").split(".").pop()?.toLowerCase() || "";
}

export function getSystemByExtension(extension) {
  const normalizedExtension = String(extension || "").replace(/^\./, "").toLowerCase();
  return EMULATOR_SYSTEMS.find((system) => system.extensions.includes(normalizedExtension)) || null;
}

export function getSystemByFileName(fileName) {
  return getSystemByExtension(getRomExtension(fileName));
}

export function getSystemLabelByFileName(fileName) {
  return getSystemByFileName(fileName)?.label || "ROM";
}

export function isSupportedRomFile(fileName) {
  return Boolean(getSystemByFileName(fileName));
}

export const DEFAULT_ROMS = [
  {
    id: "emerald",
    title: "Pokemon Emerald",
    system: "GBA",
    cover: "./assets/rom-covers/emerald.png.jfif",
    route: "./rom.html?id=emerald",
    version: "emerald",
  },
  {
    id: "fire-red",
    title: "Pokemon Fire Red",
    system: "GBA",
    cover: "./assets/rom-covers/fire-red.png.jfif",
    route: "./rom.html?id=fire-red",
    version: "fire red",
  },
  {
    id: "leaf-green",
    title: "Pokemon Leaf Green",
    system: "GBA",
    cover: "./assets/rom-covers/leaf-green.png.jfif",
    route: "./rom.html?id=leaf-green",
    version: "leaf green",
  },
  {
    id: "ruby",
    title: "Pokemon Ruby",
    system: "GBA",
    cover: "./assets/rom-covers/ruby.png.jfif",
    route: "./rom.html?id=ruby",
    version: "ruby",
  },
  {
    id: "sapphire",
    title: "Pokemon Sapphire",
    system: "GBA",
    cover: "./assets/rom-covers/sapphire.png.jfif",
    route: "./rom.html?id=sapphire",
    version: "sapphire",
  },
];

export const UI_TEXT = {
  pt: {
    search: "Buscar jogo...",
    system: "Sistema",
    allSystems: "Todos os sistemas",
    upload: "Adicionar ROM",
    uploadHint: "A ROM fica salva na biblioteca local deste navegador.",
    library: "Biblioteca de ROMs",
    subtitle: "Escolha uma capa para abrir a página da ROM.",
    localBadge: "Local",
    defaultBadge: "Biblioteca",
    empty: "Nenhuma ROM encontrada.",
    github: "GitHub do projeto",
    languagePt: "BR",
    languageEn: "US",
    openRom: "Abrir ROM",
    back: "Voltar para biblioteca",
    controls: "Controles",
    save: "Como salvar",
    emulatorReady: "Emulador pronto",
    uploadForRom: "Adicione o arquivo da ROM para iniciar esta página.",
    uploadAnyRom: "Adicionar ROM local",
    noRomLoaded: "Nenhuma ROM carregada",
    selectedFile: "Arquivo selecionado",
    fullscreen: "Tela cheia",
    pokedex: "Pokédex",
    voice: "Voz",
    status: "Status",
    runtime: "Runtime GBA",
  },
  en: {
    search: "Search game...",
    system: "System",
    allSystems: "All systems",
    upload: "Add ROM",
    uploadHint: "The ROM stays saved in this browser's local library.",
    library: "ROM Library",
    subtitle: "Choose a cover to open that ROM page.",
    localBadge: "Local",
    defaultBadge: "Library",
    empty: "No ROMs found.",
    github: "Project GitHub",
    languagePt: "BR",
    languageEn: "US",
    openRom: "Open ROM",
    back: "Back to library",
    controls: "Controls",
    save: "How to save",
    emulatorReady: "Emulator ready",
    uploadForRom: "Add the ROM file to start this page.",
    uploadAnyRom: "Add local ROM",
    noRomLoaded: "No ROM loaded",
    selectedFile: "File selected",
    fullscreen: "Fullscreen",
    pokedex: "Pokédex",
    voice: "Voice",
    status: "Status",
    runtime: "GBA runtime",
  },
};

export const GITHUB_URL = "https://github.com/oaketheria/OakDex";

export function getLocale() {
  const saved = window.localStorage.getItem("oak-rom-locale");
  if (saved === "pt" || saved === "en") {
    return saved;
  }

  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function setLocale(locale) {
  window.localStorage.setItem("oak-rom-locale", locale);
}

export function getText(locale = getLocale()) {
  return UI_TEXT[locale] || UI_TEXT.pt;
}

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatRomTitle(fileName) {
  return String(fileName || "ROM local")
    .replace(/\.(gba|gb|gbc|nes|sfc|smc|md|gen|sms|gg|n64|z64|v64|chd|pbp|iso|bin|zip|7z)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createRomId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function openRomLibraryDb() {
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

export async function getLocalRoms() {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ROM_STORE_NAME, "readonly");
    const store = transaction.objectStore(ROM_STORE_NAME);
    const request = store.getAll();
    let results = [];

    request.addEventListener("success", () => {
      results = request.result || [];
    });

    transaction.addEventListener("complete", () => {
      database.close();
      resolve(results);
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao listar ROMs locais."));
    });
  });
}

export async function saveLocalRom(file, coverFile = null) {
  const database = await openRomLibraryDb();
  const title = formatRomTitle(file.name);
  const version = getVersionFromTitle(title);
  const coverUrl = DEFAULT_ROMS.find((rom) => rom.version === version)?.cover || "";
  const now = Date.now();
  const record = {
    id: createRomId(file),
    name: file.name,
    system: getSystemLabelByFileName(file.name),
    emulatorCore: getSystemByFileName(file.name)?.core || "gba",
    size: file.size,
    updatedAt: now,
    addedAt: now,
    coverUrl,
    coverFile: coverFile instanceof File ? coverFile : null,
    file,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ROM_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ROM_STORE_NAME);
    store.put(record);

    transaction.addEventListener("complete", () => {
      database.close();
      resolve(record);
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao salvar ROM local."));
    });

    transaction.addEventListener("abort", () => {
      database.close();
      reject(transaction.error || new Error("Salvamento da ROM abortado."));
    });
  });
}

export async function deleteLocalRom(romId) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ROM_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ROM_STORE_NAME);
    store.delete(romId);

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao remover ROM local."));
    });
  });
}

async function clearObjectStore(storeName) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao limpar dados locais."));
    });
  });
}

export async function clearLocalRoms() {
  await clearObjectStore(ROM_STORE_NAME);
}

export async function clearLocalSaves() {
  await clearObjectStore(SAVE_STORE_NAME);
}

export async function getLocalSaves() {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(SAVE_STORE_NAME, "readonly");
    const store = transaction.objectStore(SAVE_STORE_NAME);
    const request = store.getAll();
    let results = [];

    request.addEventListener("success", () => {
      results = request.result || [];
    });

    transaction.addEventListener("complete", () => {
      database.close();
      resolve(results);
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao listar saves locais."));
    });
  });
}

export async function deleteLocalSave(saveId) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(SAVE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(SAVE_STORE_NAME);
    store.delete(saveId);

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao remover save local."));
    });
  });
}

export async function clearLocalLibraryData() {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ROM_STORE_NAME, SAVE_STORE_NAME, BIOS_STORE_NAME], "readwrite");
    transaction.objectStore(ROM_STORE_NAME).clear();
    transaction.objectStore(SAVE_STORE_NAME).clear();
    transaction.objectStore(BIOS_STORE_NAME).clear();

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao limpar biblioteca local."));
    });
  });
}

export async function updateLocalRomCover(romId, coverFile) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ROM_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ROM_STORE_NAME);
    const getRequest = store.get(romId);

    getRequest.addEventListener("success", () => {
      const record = getRequest.result;

      if (!record) {
        reject(new Error("ROM local não encontrada."));
        return;
      }

      record.coverFile = coverFile instanceof File ? coverFile : null;
      record.coverUrl = record.coverFile ? "" : record.coverUrl || "";
      record.updatedAt = Date.now();
      store.put(record);
    });

    getRequest.addEventListener("error", () => {
      reject(getRequest.error || new Error("Falha ao carregar ROM local."));
    });

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao atualizar capa da ROM."));
    });
  });
}

export async function updateLocalRomMetadata(romId, metadata) {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ROM_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ROM_STORE_NAME);
    const getRequest = store.get(romId);

    getRequest.addEventListener("success", () => {
      const record = getRequest.result;

      if (!record) {
        reject(new Error("ROM local não encontrada."));
        return;
      }

      record.displayTitle = String(metadata.displayTitle || "").trim();
      record.system = metadata.system || record.system;
      record.emulatorCore = EMULATOR_SYSTEMS.find((item) => item.label === record.system)?.core || record.emulatorCore;
      record.supportsPokedex = Boolean(metadata.supportsPokedex);
      record.updatedAt = Date.now();
      store.put(record);
    });

    getRequest.addEventListener("error", () => {
      reject(getRequest.error || new Error("Falha ao carregar ROM local."));
    });

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao atualizar dados da ROM."));
    });
  });
}

export async function getPs1BiosRecord() {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BIOS_STORE_NAME, "readonly");
    const store = transaction.objectStore(BIOS_STORE_NAME);
    const request = store.get(PS1_BIOS_ID);

    request.addEventListener("success", () => {
      resolve(request.result || null);
    });

    request.addEventListener("error", () => {
      reject(request.error || new Error("Falha ao carregar BIOS PS1."));
    });

    transaction.addEventListener("complete", () => {
      database.close();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao acessar BIOS PS1."));
    });
  });
}

export async function savePs1BiosRecord(file) {
  const database = await openRomLibraryDb();
  const record = {
    id: PS1_BIOS_ID,
    name: file.name,
    size: file.size,
    updatedAt: Date.now(),
    file,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BIOS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(BIOS_STORE_NAME);
    store.put(record);

    transaction.addEventListener("complete", () => {
      database.close();
      resolve(record);
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao salvar BIOS PS1."));
    });
  });
}

export async function deletePs1BiosRecord() {
  const database = await openRomLibraryDb();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BIOS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(BIOS_STORE_NAME);
    store.delete(PS1_BIOS_ID);

    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });

    transaction.addEventListener("error", () => {
      database.close();
      reject(transaction.error || new Error("Falha ao remover BIOS PS1."));
    });
  });
}

export function getDefaultRomById(id) {
  return DEFAULT_ROMS.find((rom) => rom.id === id) || null;
}

export function getVersionFromTitle(title) {
  const normalized = normalizeText(title);
  if (normalized.includes("emerald")) return "emerald";
  if (normalized.includes("fire red") || normalized.includes("firered")) return "fire red";
  if (normalized.includes("leaf green") || normalized.includes("leafgreen")) return "leaf green";
  if (normalized.includes("ruby")) return "ruby";
  if (normalized.includes("sapphire")) return "sapphire";
  return "other";
}
