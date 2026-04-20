const romInput = document.querySelector("#rom-input");
const romStatus = document.querySelector("#rom-status");
const romFileName = document.querySelector("#rom-file-name");
const romLibraryList = document.querySelector("#rom-library-list");
const romLibraryCount = document.querySelector("#rom-library-count");
const clearLastRomButton = document.querySelector("#clear-last-rom");
const demoToggle = document.querySelector("#demo-toggle");
const hudMode = document.querySelector("#hud-mode");
const screenBadge = document.querySelector(".screen-badge");
const playerTitle = document.querySelector(".player-header h2");
const emulatorHost = document.querySelector("#emulatorjs-player");
const emulatorRuntime = document.querySelector("#emulator-runtime");
const emulatorLoading = document.querySelector("#emulator-loading");
const emulatorError = document.querySelector("#emulator-error");
const emulatorErrorMessage = document.querySelector("#emulator-error-message");
const dockPlay = document.querySelector("#dock-play");
const dockSave = document.querySelector("#dock-save");
const dockLoad = document.querySelector("#dock-load");
const dockFullscreen = document.querySelector("#dock-fullscreen");
const pokedexToggle = document.querySelector("#pokedex-toggle");
const pokedexClose = document.querySelector("#pokedex-close");
const pokedexPanel = document.querySelector("#emulator-pokedex-panel");
const pokedexSearch = document.querySelector("#emulator-pokedex-search");
const pokedexSummary = document.querySelector("#emulator-pokedex-summary");
const pokedexList = document.querySelector("#emulator-pokedex-list");
const pokedexDetail = document.querySelector("#emulator-pokedex-detail");
const pokedexTabs = [...document.querySelectorAll(".pokedex-tab")];

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
let romLibrary = [];

const ROM_DB_NAME = "pokemon-emerald-gx";
const ROM_STORE_NAME = "rom-library";
const LAST_ROM_STORAGE_KEY = "emulatorLastRomId";

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
    return;
  }

  romLibraryList.innerHTML = romLibrary
    .map(
      (entry) => `
        <article class="rom-library-card${entry.id === lastRomId ? " is-last-used" : ""}">
          <div class="rom-library-card-copy">
            <strong>${formatRomTitle(entry.name)}</strong>
            <span>${formatBytes(entry.size)}</span>
          </div>
          <div class="rom-library-card-actions">
            <button type="button" class="library-card-button" data-rom-launch="${entry.id}">Jogar</button>
            <button type="button" class="library-card-button is-secondary" data-rom-delete="${entry.id}">Remover</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function updateLibraryUnavailableState() {
  romLibrary = [];

  if (romLibraryList) {
    romLibraryList.innerHTML = '<p class="rom-library-empty">A biblioteca local nao esta disponivel neste navegador.</p>';
  }

  if (romLibraryCount) {
    romLibraryCount.textContent = "Biblioteca indisponivel";
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

    romLibrary.sort((first, second) => (second.updatedAt || 0) - (first.updatedAt || 0));
    renderRomLibrary();
  } catch (error) {
    updateLibraryUnavailableState();
  }
}

async function saveRomToLibrary(file) {
  const record = {
    id: createRomId(file),
    name: file.name,
    size: file.size,
    updatedAt: Date.now(),
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

  saveLastRomSelection(entry.id);
  romFileName.textContent = `${entry.name} - Biblioteca local`;
  if (playerTitle) {
    playerTitle.textContent = formatRomTitle(entry.name);
  }
  bootEmulator(entry.file);
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
  setDockEnabled(dockPlay, emulationReady);
  setDockEnabled(dockSave, emulationReady);
  setDockEnabled(dockLoad, emulationReady);
  setDockEnabled(dockFullscreen, true);

  if (dockPlay) {
    dockPlay.textContent = emulationPaused ? "Resume" : "Pause";
    dockPlay.classList.toggle("is-active", emulationReady && !emulationPaused);
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

  hudMode.textContent = emulationPaused ? "ROM paused" : "ROM running";
}

function queryEmulatorAction(actionNames) {
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
  hudMode.textContent = "Boot error";
  setEmulationReady(false);
}

function clearActiveRomUrl() {
  if (activeRomUrl) {
    URL.revokeObjectURL(activeRomUrl);
    activeRomUrl = "";
  }
}

function clearExistingRuntime() {
  if (activeLoaderScript) {
    activeLoaderScript.remove();
    activeLoaderScript = null;
  }

  if (emulatorHost) {
    emulatorHost.innerHTML = "";
  }

  const staleScript = document.querySelector('script[data-emulatorjs-loader="true"]');
  if (staleScript) {
    staleScript.remove();
  }

  delete window.EJS_player;
  delete window.EJS_core;
  delete window.EJS_pathtodata;
  delete window.EJS_gameUrl;
  delete window.EJS_biosUrl;
  delete window.EJS_startOnLoaded;
  setEmulationReady(false);
}

function forceRuntimeSizing() {
  if (!emulatorHost) {
    return;
  }

  const nestedNodes = emulatorHost.querySelectorAll("iframe, canvas, .ejs_player, .game");

  nestedNodes.forEach((node) => {
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.maxWidth = "100%";
    node.style.display = "block";
  });
}

function bootEmulator(file) {
  if (!emulatorHost || !emulatorRuntime || !emulatorLoading || !emulatorError) {
    return;
  }

  clearExistingRuntime();
  clearActiveRomUrl();

  activeRomUrl = URL.createObjectURL(file);

  document.body.classList.add("has-rom", "is-loading-rom");
  emulatorRuntime.classList.remove("is-visible");
  emulatorLoading.hidden = false;
  emulatorError.hidden = true;
  romStatus.textContent = "Inicializando core";
  hudMode.textContent = "Loading core";
  setEmulationReady(false);

  window.EJS_player = "#emulatorjs-player";
  window.EJS_core = "gba";
  window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
  window.EJS_gameUrl = activeRomUrl;
  window.EJS_startOnLoaded = true;
  window.EJS_volume = 0.65;

  activeLoaderScript = document.createElement("script");
  activeLoaderScript.src = `https://cdn.emulatorjs.org/stable/data/loader.js?v=${Date.now()}`;
  activeLoaderScript.dataset.emulatorjsLoader = "true";
  activeLoaderScript.async = true;

  activeLoaderScript.addEventListener("load", () => {
    document.body.classList.remove("is-loading-rom");
    emulatorLoading.hidden = true;
    emulatorRuntime.classList.add("is-visible");
    window.setTimeout(forceRuntimeSizing, 250);
    window.setTimeout(forceRuntimeSizing, 1200);
    romStatus.textContent = "Emulador em execucao";
    hudMode.textContent = "ROM running";
    setEmulationReady(true);
    if (screenBadge) {
      screenBadge.textContent = "Live emulator session";
    }
  });

  activeLoaderScript.addEventListener("error", () => {
    showRuntimeError("O core do emulador nao carregou. A pagina precisa acessar a CDN do EmulatorJS.");
  });

  document.body.appendChild(activeLoaderScript);

  window.setTimeout(() => {
    if (document.body.classList.contains("is-loading-rom")) {
      document.body.classList.remove("is-loading-rom");
      emulatorLoading.hidden = true;
      emulatorRuntime.classList.add("is-visible");
      romStatus.textContent = "Core carregado";
      hudMode.textContent = "ROM booting";
      setEmulationReady(true);
      if (screenBadge) {
        screenBadge.textContent = "Boot sequence started";
      }
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
      if (emulatorError) {
        emulatorError.hidden = true;
      }
      romStatus.textContent = "Sem ROM carregada";
      romFileName.textContent = "Nenhum arquivo selecionado";
      hudMode.textContent = "Awaiting ROM";
      if (screenBadge) {
        screenBadge.textContent = "Ready for emulator core";
      }
      if (playerTitle) {
        playerTitle.textContent = "Pokemon Emerald";
      }
      setEmulationReady(false);
      return;
    }

    romStatus.textContent = "ROM pronta para integrar";
    romFileName.textContent = file.name;
    hudMode.textContent = "ROM loaded locally";
    if (screenBadge) {
      screenBadge.textContent = "ROM staged locally";
    }
    if (playerTitle) {
      playerTitle.textContent = file.name.replace(/\.(gba|zip|7z)$/i, "");
    }

    if (!/\.gba$/i.test(file.name)) {
      showRuntimeError("Use uma ROM de Game Boy Advance no formato .gba para iniciar o player.");
      return;
    }

    try {
      const savedRecord = await saveRomToLibrary(file);
      saveLastRomSelection(savedRecord.id);
    } catch (error) {
      romStatus.textContent = "ROM carregada sem biblioteca";
    }

    bootEmulator(file);
  });
}

if (demoToggle && hudMode) {
  demoToggle.addEventListener("click", () => {
    const demoEnabled = document.body.classList.toggle("is-demo-on");
    hudMode.textContent = demoEnabled ? "Demo HUD active" : "Awaiting ROM";
    if (screenBadge) {
      screenBadge.textContent = demoEnabled ? "Visual stack energized" : "Ready for emulator core";
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
      } else {
        await target.requestFullscreen();
      }
    } catch (error) {
      showRuntimeError("O navegador bloqueou o fullscreen dessa sessao.");
    }
  });
}

if (dockPlay) {
  dockPlay.addEventListener("click", () => {
    if (!emulationReady) {
      return;
    }

    const actionSucceeded = emulationPaused
      ? triggerEmulatorAction(["play", "resume", "unpause"])
      : triggerEmulatorAction(["pause", "play"]);

    if (!actionSucceeded) {
      showRuntimeError("Nao encontrei o controle interno de play/pause do emulador.");
      return;
    }

    emulationPaused = !emulationPaused;
    syncDockState();
    updateHudForPauseState();
  });
}

if (dockSave) {
  dockSave.addEventListener("click", () => {
    if (!emulationReady) {
      return;
    }

    const actionSucceeded = triggerEmulatorAction(["save", "save state", "savestate"]);

    if (!actionSucceeded) {
      showRuntimeError("Nao encontrei o controle interno de save state do emulador.");
      return;
    }

    romStatus.textContent = "Save solicitado";
    hudMode.textContent = "Saving state";
  });
}

if (dockLoad) {
  dockLoad.addEventListener("click", () => {
    if (!emulationReady) {
      return;
    }

    const actionSucceeded = triggerEmulatorAction(["load", "load state", "loadstate"]);

    if (!actionSucceeded) {
      showRuntimeError("Nao encontrei o controle interno de load state do emulador.");
      return;
    }

    romStatus.textContent = "Load solicitado";
    hudMode.textContent = "Loading state";
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

if (clearLastRomButton) {
  clearLastRomButton.addEventListener("click", () => {
    saveLastRomSelection("");
    renderRomLibrary();
    romStatus.textContent = "Ultima ROM limpa";
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
syncDockState();
await loadRomLibrary();

const lastRomId = getLastRomSelection();
if (lastRomId) {
  try {
    await launchLibraryRom(lastRomId);
  } catch (error) {
    saveLastRomSelection("");
    renderRomLibrary();
  }
}
