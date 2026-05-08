import { getLocalRoms, getPs1BiosRecord, getSystemByFileName, saveLocalRom } from "./roms.js";

const STORAGE_KEY = "oak-challenge-runs-v1";
const POKEAPI_BASE = "https://pokeapi.co/api/v2";
const POKEMON_CATALOG_LIMIT = 2000;

const RULES = [
  ["firstEncounterOnly", "Primeiro encontro"],
  ["permadeath", "Permadeath"],
  ["nicknameRequired", "Nickname"],
  ["levelCaps", "Level cap"],
  ["noBattleItems", "Sem item em batalha"],
  ["setMode", "Set mode"],
  ["dupesClause", "Dupes clause"],
  ["shinyClause", "Shiny clause"],
];

const TYPE_COLORS = {
  fire: "#ee8130", water: "#6390f0", grass: "#7ac74c", electric: "#f7d02c",
  poison: "#a33ea1", ground: "#e2bf65", flying: "#a98ff3", psychic: "#f95587",
  bug: "#a6b91a", rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc",
  dark: "#705746", steel: "#b7b7ce", fairy: "#d685ad", ice: "#96d9d6",
  fighting: "#c22e28", normal: "#a8a77a",
};

const DEFAULT_BADGES = [
  ["Roxanne", "Stone Badge", "Rock", 15],
  ["Brawly", "Knuckle Badge", "Fighting", 19],
  ["Wattson", "Dynamo Badge", "Electric", 24],
  ["Flannery", "Heat Badge", "Fire", 29],
  ["Norman", "Balance Badge", "Normal", 31],
  ["Winona", "Feather Badge", "Flying", 33],
  ["Tate & Liza", "Mind Badge", "Psychic", 42],
  ["Wallace", "Rain Badge", "Water", 46],
];

const RUN_TEMPLATES = {
  custom: {
    label: "Personalizado",
    gameTitle: "Pokemon Emerald",
    romHackName: "",
    mode: "Nuzlocke",
    badges: DEFAULT_BADGES,
  },
  emerald: {
    label: "Emerald Nuzlocke",
    gameTitle: "Pokemon Emerald",
    romHackName: "",
    mode: "Nuzlocke",
    badges: DEFAULT_BADGES,
  },
  fireRed: {
    label: "FireRed/LeafGreen",
    gameTitle: "Pokemon Fire Red",
    romHackName: "",
    mode: "Nuzlocke",
    badges: [
      ["Brock", "Boulder Badge", "Rock", 14],
      ["Misty", "Cascade Badge", "Water", 21],
      ["Lt. Surge", "Thunder Badge", "Electric", 24],
      ["Erika", "Rainbow Badge", "Grass", 29],
      ["Koga", "Soul Badge", "Poison", 43],
      ["Sabrina", "Marsh Badge", "Psychic", 43],
      ["Blaine", "Volcano Badge", "Fire", 47],
      ["Giovanni", "Earth Badge", "Ground", 50],
    ],
  },
  radicalRed: {
    label: "Radical Red Hardcore",
    gameTitle: "Pokemon Fire Red",
    romHackName: "Radical Red",
    mode: "Hardcore",
    badges: [
      ["Brock", "Boulder Badge", "Rock", 15],
      ["Misty", "Cascade Badge", "Water", 27],
      ["Lt. Surge", "Thunder Badge", "Electric", 34],
      ["Erika", "Rainbow Badge", "Grass", 44],
      ["Koga", "Soul Badge", "Poison", 59],
      ["Sabrina", "Marsh Badge", "Psychic", 59],
      ["Blaine", "Volcano Badge", "Fire", 68],
      ["Giovanni", "Earth Badge", "Ground", 76],
    ],
  },
  unbound: {
    label: "Pokemon Unbound",
    gameTitle: "Pokemon Fire Red",
    romHackName: "Pokemon Unbound",
    mode: "Hackrom",
    badges: [
      ["Vega", "Crater Badge", "Dark", 20],
      ["Alice", "Wing Badge", "Flying", 26],
      ["Mel", "Fall Badge", "Normal", 36],
      ["Galavan", "Circuit Badge", "Electric", 45],
      ["Big Mo", "Brawl Badge", "Fighting", 52],
      ["Tessy", "Tide Badge", "Water", 57],
      ["Penny", "Magic Badge", "Fairy", 61],
      ["Benjamin", "Toxic Badge", "Poison", 75],
    ],
  },
};

const TYPE_EFFECTIVENESS = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const TYPE_LABELS = {
  normal: "NOR", fire: "FIR", water: "WAT", electric: "ELE", grass: "GRA", ice: "ICE",
  fighting: "FIG", poison: "POI", ground: "GRO", flying: "FLY", psychic: "PSY", bug: "BUG",
  rock: "ROC", ghost: "GHO", dragon: "DRA", dark: "DAR", steel: "STE", fairy: "FAI",
};

const ROUTE_TEMPLATES = {
  emerald: [
    "Route 101", "Route 102", "Route 103", "Route 104", "Petalburg Woods", "Route 105",
    "Route 106", "Granite Cave", "Route 107", "Route 108", "Route 109", "Route 110",
    "Route 111", "Route 112", "Fiery Path", "Route 113", "Route 114", "Meteor Falls",
    "Route 115", "Route 116", "Rusturf Tunnel", "Route 117", "Route 118", "Route 119",
    "Route 120", "Route 121", "Safari Zone", "Route 122", "Mt. Pyre", "Route 123",
    "Route 124", "Route 125", "Shoal Cave", "Route 126", "Route 127", "Route 128",
    "Seafloor Cavern", "Route 129", "Route 130", "Route 131", "Sky Pillar", "Route 132",
    "Route 133", "Route 134", "Victory Road",
  ],
  fireRed: [
    "Route 1", "Route 2", "Viridian Forest", "Route 3", "Mt. Moon", "Route 4",
    "Route 24", "Route 25", "Route 5", "Route 6", "Route 11", "Diglett's Cave",
    "Route 9", "Route 10", "Rock Tunnel", "Route 7", "Route 8", "Pokemon Tower",
    "Route 12", "Route 13", "Route 14", "Route 15", "Route 16", "Route 17",
    "Route 18", "Safari Zone", "Route 19", "Seafoam Islands", "Route 20",
    "Pokemon Mansion", "Route 21", "Power Plant", "Victory Road",
  ],
  radicalRed: [
    "Route 1", "Route 2", "Viridian Forest", "Route 3", "Mt. Moon", "Route 4",
    "Route 24", "Route 25", "Route 5", "Route 6", "Route 11", "Diglett's Cave",
    "Route 9", "Route 10", "Rock Tunnel", "Route 7", "Route 8", "Pokemon Tower",
    "Route 12", "Route 13", "Route 14", "Route 15", "Route 16", "Route 17",
    "Route 18", "Safari Zone", "Route 19", "Seafoam Islands", "Route 20",
    "Pokemon Mansion", "Route 21", "Power Plant", "Victory Road",
  ],
  unbound: [
    "Icicle Cave", "Route 1", "Frozen Heights", "Route 2", "Route 3", "Flower Paradise",
    "Route 4", "Cinder Volcano", "Route 5", "Valley Cave", "Route 6", "Route 7",
    "Route 8", "Thundercap Mt.", "Route 9", "Route 10", "Route 11", "Great Desert",
    "Route 12", "Route 13", "Route 14", "Route 15", "Route 16", "Route 17",
    "Route 18", "Crystal Peak", "Victory Road",
  ],
};

let runs = loadRuns();
const initialParams = new URLSearchParams(window.location.search);
let activeRunId = initialParams.get("run") || localStorage.getItem("oak-challenge-active-run") || runs[0]?.id || "";
let dialogMode = "run";
let editId = "";
let availableRoms = [];
let challengeRomUrl = "";
let challengeBiosUrl = "";
let challengeLoaderScript = null;
let obsToolbarDockTimer = 0;
const pokemonCache = new Map();
let pokemonCatalog = [];
let pokemonCatalogPromise = null;
let pokemonLookupTimer = null;
let selectedOverlayMonId = "";
let dragState = null;
let obsAutoBootStarted = false;
let initialEditHandled = false;
let overlayEditorMonId = "";
let oakChallengeTourIndex = 0;
let oakChallengeTourActive = false;
const isObsMode = initialParams.get("obs") === "1";

const MAX_TEAM_SIZE = 6;
const EMULATORJS_DATA_PATH = "https://cdn.emulatorjs.org/stable/data/";
const EMULATOR_BOOT_TIMEOUT = 12000;
const OAK_CHALLENGE_TOUR_STEPS = [
  {
    selector: ".challenge-sidebar",
    title: "Runs Pokemon",
    text: "Aqui ficam suas runs salvas. Use Nova para criar outra jornada e selecione uma run para continuar de onde parou.",
  },
  {
    selector: ".run-hero",
    title: "Run ativa",
    text: "Este painel mostra a run atual, a ROM vinculada e os atalhos para editar ou jogar no Oak Challenge.",
  },
  {
    selector: ".challenge-stats",
    title: "Resumo rapido",
    text: "Acompanhe time, badges, mortes e o proximo level cap sem abrir nenhum painel extra.",
  },
  {
    selector: ".challenge-tabs",
    title: "Abas da run",
    text: "Use as abas para alternar entre overlay de streamer, emulador, dashboard, time, encontros, cemiterio, badges, notas e timeline.",
  },
  {
    selector: ".streamer-canvas",
    title: "Overlay de streamer",
    text: "Nesta area voce monta a cena da live. Arraste os Pokemon, ajuste zoom e abra o overlay OBS para capturar no OBS.",
    tab: "hud",
  },
  {
    selector: "#selected-mon-control",
    title: "Sprites no overlay",
    text: "Clique em um Pokemon no preview para selecionar. Depois ajuste zoom, posicao ou resete o sprite pelo painel lateral.",
    tab: "hud",
  },
  {
    selector: "[data-panel='team']",
    title: "Time e box",
    text: "Na aba Time voce ve o time atual e a box. Pokemon extras vao para a box quando o time chega ao limite de 6.",
    tab: "team",
  },
  {
    selector: "[data-panel='play']",
    title: "Emulador Challenge",
    text: "Na aba Jogar voce adiciona ou carrega a ROM vinculada sem sair do Oak Challenge.",
    tab: "play",
  },
  {
    selector: "#open-obs-overlay",
    title: "Overlay OBS",
    text: "Abra esta tela em uma aba separada e capture no OBS. No overlay, use P para abrir ou fechar a Pokedex integrada.",
    tab: "hud",
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const el = {
  runList: $("#run-list"), rulesGrid: $("#rules-grid"), rulesModeLabel: $("#rules-mode-label"),
  runStatus: $("#run-status"), runTitle: $("#run-title"), runSubtitle: $("#run-subtitle"),
  openLinkedRom: $("#open-linked-rom"),
  statTeam: $("#stat-team"), statBadges: $("#stat-badges"), statDeaths: $("#stat-deaths"), statCap: $("#stat-cap"),
  teamGrid: $("#team-grid"), recentEncounters: $("#recent-encounters"), badgeTrack: $("#badge-track"), recentNotes: $("#recent-notes"),
  pokemonManager: $("#pokemon-manager"), encounterList: $("#encounter-list"), graveyardGrid: $("#graveyard-grid"),
  badgeList: $("#badge-list"), notesList: $("#notes-list"), hudPreview: $("#hud-preview"),
  timelineList: $("#timeline-list"),
  emulatorFrameWrap: $("#emulator-frame-wrap"), emulatorEmpty: $("#emulator-empty"),
  challengeEmulatorPlayer: $("#challenge-emulator-player"),
  challengeEmulatorLoading: $("#challenge-emulator-loading"),
  challengeEmulatorError: $("#challenge-emulator-error"),
  challengeEmulatorErrorMessage: $("#challenge-emulator-error-message"),
  playHudTeam: $("#play-hud-team"), playHudCap: $("#play-hud-cap"),
  playHudBadges: $("#play-hud-badges"), playHudDeaths: $("#play-hud-deaths"),
  playHudEncounter: $("#play-hud-encounter"),
  spriteZoom: $("#sprite-zoom"), spriteZoomLabel: $("#sprite-zoom-label"),
  selectedMonControl: $("#selected-mon-control"),
  challengeRomInput: $("#challenge-rom-input"),
  dialog: $("#challenge-dialog"), form: $("#challenge-form"), formFields: $("#form-fields"),
  dialogTitle: $("#dialog-title"), dialogKicker: $("#dialog-kicker"), deleteCurrent: $("#delete-current"),
  importInput: $("#import-run-input"),
};

function loadRuns() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRuns() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  if (activeRunId) localStorage.setItem("oak-challenge-active-run", activeRunId);
}

function createRun(data = {}) {
  const template = RUN_TEMPLATES[data.template] || RUN_TEMPLATES.custom;
  const mode = data.mode || template.mode || "Nuzlocke";
  return {
    id: uid("run"),
    name: data.name || template.label,
    gameTitle: data.gameTitle || template.gameTitle,
    romHackName: data.romHackName || template.romHackName,
    romId: data.romId || "",
    romRoute: data.romRoute || "",
    template: data.template || "custom",
    mode,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rules: {
      firstEncounterOnly: true,
      permadeath: mode !== "Normal",
      nicknameRequired: mode !== "Normal",
      levelCaps: mode === "Hardcore" || mode === "Hackrom",
      noBattleItems: mode === "Hardcore",
      setMode: mode === "Hardcore",
      dupesClause: true,
      shinyClause: true,
    },
    team: [],
    box: [],
    graveyard: [],
    encounters: [],
    routes: [],
    badges: template.badges.map(([leader, badgeName, type, levelCap]) => ({
      id: uid("badge"), leader, badgeName, type, levelCap, defeated: false, notes: "",
    })),
    notes: [],
    timeline: [],
    settings: {
      spriteZoom: 1,
    },
  };
}

function getRun() {
  const run = runs.find((item) => item.id === activeRunId) || runs[0] || null;
  return run ? normalizeRun(run) : null;
}

function upsertRun(run) {
  run.updatedAt = new Date().toISOString();
  const index = runs.findIndex((item) => item.id === run.id);
  if (index >= 0) runs[index] = run;
  else runs.unshift(run);
  activeRunId = run.id;
  saveRuns();
  render();
}

function commitRunChange(run, { refreshTeam = false } = {}) {
  if (!isObsMode) {
    upsertRun(run);
    return;
  }
  run.updatedAt = new Date().toISOString();
  const index = runs.findIndex((item) => item.id === run.id);
  if (index >= 0) runs[index] = run;
  else runs.unshift(run);
  activeRunId = run.id;
  saveRuns();
  if (refreshTeam) refreshObsTeamOverlay(run);
  else renderOverlayConfigPanelIntoScene(run);
}

function html(value) {
  return String(value || "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function render() {
  if (!runs.length) {
    const run = createRun();
    runs.push(run);
    activeRunId = run.id;
    saveRuns();
  }
  runs.forEach(normalizeRun);
  const run = getRun();
  document.body.classList.toggle("obs-overlay-mode", isObsMode);
  document.documentElement.style.setProperty("--challenge-sprite-zoom", String(run.settings.spriteZoom || 1));
  if (el.spriteZoom) el.spriteZoom.value = String(run.settings.spriteZoom || 1);
  if (el.spriteZoomLabel) el.spriteZoomLabel.textContent = `${Math.round((run.settings.spriteZoom || 1) * 100)}%`;
  renderRunList(run);
  renderHeader(run);
  renderRules(run);
  renderDashboard(run);
  renderCollections(run);
  renderPlayHud(run);
  renderSelectedMonControl(run);
  renderObsOverlayLink(run);
  if (isObsMode) {
    activateTab("hud");
    scheduleObsEmulatorBoot(run);
    window.setTimeout(() => {
      window.OakMascot?.show?.();
      window.OakMascot?.setMode?.("emulator");
      window.OakMascot?.say?.("OakBit pronto para abrir a Pokedex.", "happy", 2400, "info");
      window.OakMascot?.refreshLocale?.();
    }, 250);
  }
  handleInitialEditParam(run);
}

function handleInitialEditParam(run) {
  if (initialEditHandled || isObsMode) return;
  const editMonId = initialParams.get("editMon");
  if (!editMonId || !run.team.some((mon) => mon.id === editMonId) && !run.box.some((mon) => mon.id === editMonId)) return;
  initialEditHandled = true;
  window.setTimeout(() => openDialog("team", editMonId), 80);
}

function renderSelectedMonControl(run) {
  if (!el.selectedMonControl) return;
  const mon = run.team.find((item) => item.id === selectedOverlayMonId);
  if (!mon) {
    el.selectedMonControl.innerHTML = `<strong>Selecione um Pokemon</strong><span>Clique em um sprite para ajustar zoom e posicao.</span>`;
    return;
  }
  el.selectedMonControl.innerHTML = `
    <strong>${html(mon.nickname || mon.species)}</strong>
    <span>Zoom individual</span>
    <input id="selected-mon-zoom" type="range" min="0.6" max="2.6" step="0.1" value="${html(mon.layout?.zoom || 1)}" />
    <button type="button" id="reset-selected-mon">Resetar posicao</button>
  `;
}

function renderObsOverlayLink(run) {
  const link = document.querySelector("#open-obs-overlay");
  if (!link) return;
  link.href = `./oak-challenge.html?obs=1&run=${encodeURIComponent(run.id)}`;
}

function detectRoutesForRun(run) {
  const templateKey = ROUTE_TEMPLATES[run.template] ? run.template : inferRouteTemplate(run);
  const routeNames = ROUTE_TEMPLATES[templateKey] || ROUTE_TEMPLATES.emerald;
  const previous = new Map(run.routes.map((route) => [route.name, route]));
  run.routes = routeNames.map((name, index) => {
    const existing = previous.get(name);
    return existing || {
      id: `route_${templateKey}_${index}_${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      status: "pending",
      pokemon: "",
    };
  });
  addTimelineEvent(run, "route", "Rotas configuradas", `${run.routes.length} areas carregadas para ${templateKey}.`);
  if (isObsMode) {
    saveRuns();
    renderOverlayConfigPanelIntoScene(run);
  } else {
    upsertRun(run);
  }
}

function inferRouteTemplate(run) {
  const source = `${run.gameTitle || ""} ${run.romHackName || ""} ${run.name || ""}`.toLowerCase();
  if (source.includes("radical")) return "radicalRed";
  if (source.includes("unbound")) return "unbound";
  if (source.includes("fire") || source.includes("leaf")) return "fireRed";
  return "emerald";
}

async function refreshAvailableRoms() {
  try {
    const localRoms = await getLocalRoms();
    availableRoms = [
      ...localRoms.map((rom) => ({
        id: rom.id,
        title: rom.title || rom.name || "ROM local",
        system: rom.system || "ROM",
        source: "Local",
        isLocal: true,
      })),
    ];
  } catch {
    availableRoms = [];
  }
}

function normalizeRun(run) {
  run.rules ||= {};
  run.team ||= [];
  run.box ||= [];
  run.graveyard ||= [];
  run.encounters ||= [];
  run.routes ||= [];
  run.badges ||= [];
  run.notes ||= [];
  run.timeline ||= [];
  run.template ||= "custom";
  run.romId ||= "";
  run.romRoute ||= "";
  run.settings ||= {};
  run.settings.spriteZoom = Number(run.settings.spriteZoom || 1);
  enforceTeamLimit(run);
  run.team.forEach((mon, index) => {
    mon.layout ||= {};
    mon.layout.x = Number.isFinite(Number(mon.layout.x)) ? Number(mon.layout.x) : 4 + index * 16;
    mon.layout.y = Number.isFinite(Number(mon.layout.y)) ? Number(mon.layout.y) : 78;
    mon.layout.zoom = Number(mon.layout.zoom || 1);
  });
  return run;
}

function enforceTeamLimit(run) {
  run.team ||= [];
  run.box ||= [];
  if (run.team.length <= MAX_TEAM_SIZE) return;
  const overflow = run.team.splice(MAX_TEAM_SIZE);
  overflow.forEach((mon) => {
    mon.status = "box";
    run.box.push(mon);
  });
}

function renderRunList(activeRun) {
  el.runList.innerHTML = runs.map((run) => `
    <button class="run-card ${run.id === activeRun.id ? "is-active" : ""}" type="button" data-run-id="${run.id}">
      <strong>${html(run.name)}</strong>
      <span>${html(run.romHackName || run.gameTitle)} - ${html(run.mode)}</span>
    </button>
  `).join("");
}

function renderHeader(run) {
  const defeated = run.badges.filter((badge) => badge.defeated).length;
  const nextCap = run.badges.find((badge) => !badge.defeated && badge.levelCap);
  const linkedRom = getLinkedRom(run);
  el.runStatus.textContent = run.status === "complete" ? "Run finalizada" : "Run ativa";
  el.runTitle.textContent = run.name;
  el.runSubtitle.textContent = `${run.romHackName || run.gameTitle} - ${run.mode}${linkedRom ? ` - ${linkedRom.title}` : ""}`;
  el.statTeam.textContent = `${Math.min(run.team.length, MAX_TEAM_SIZE)}/${MAX_TEAM_SIZE}`;
  el.statBadges.textContent = String(defeated);
  el.statDeaths.textContent = String(run.graveyard.length);
  el.statCap.textContent = nextCap ? `Lv. ${nextCap.levelCap}` : "Livre";
  el.openLinkedRom.href = linkedRom?.route || "#vincular-rom";
  el.openLinkedRom.textContent = linkedRom ? "Jogar no Challenge" : "Vincular ROM";
}

function getLinkedRom(run) {
  if (!run.romId) return null;
  return availableRoms.find((rom) => rom.id === run.romId) || {
    id: run.romId,
    title: "ROM vinculada",
    isLocal: true,
  };
}

function renderRules(run) {
  el.rulesModeLabel.textContent = run.mode;
  el.rulesGrid.innerHTML = RULES.map(([key, label]) =>
    `<button class="${run.rules[key] ? "is-on" : ""}" type="button" data-rule="${key}">${label}</button>`
  ).join("");
}

function renderDashboard(run) {
  el.teamGrid.innerHTML = renderTeamSlots(run);
  if (el.recentEncounters) {
    el.recentEncounters.innerHTML = compactList(run.encounters.slice(-5).reverse(), (item) =>
      `${item.route || "Area"} - ${item.species || "Pokemon"} - ${item.status || "captured"}`
    );
  }
  if (el.badgeTrack) {
    el.badgeTrack.innerHTML = run.badges.map((badge) => `
      <button class="badge-chip ${badge.defeated ? "is-done" : ""}" type="button" data-toggle-badge="${badge.id}">
        <span>${html(badge.badgeName || badge.leader)}</span>
        <small>${badge.levelCap ? `Lv. ${badge.levelCap}` : "Sem cap"}</small>
      </button>
    `).join("");
  }
  if (el.recentNotes) {
    el.recentNotes.innerHTML = compactList(run.notes.slice(-4).reverse(), (item) => item.text);
  }
  const teamPanel = document.querySelector(".team-panel");
  if (teamPanel && !document.querySelector("#weakness-panel")) {
    teamPanel.insertAdjacentHTML("afterend", `<section class="tracker-panel weakness-panel" id="weakness-panel"></section>`);
  }
  const weaknessPanel = document.querySelector("#weakness-panel");
  if (weaknessPanel) weaknessPanel.innerHTML = renderWeaknessPanel(run);
}

function renderTeamSlots(run) {
  const slots = run.team.slice(0, MAX_TEAM_SIZE);
  while (slots.length < MAX_TEAM_SIZE) slots.push(null);
  return slots.map((mon, index) => {
    if (!mon) return `<button class="team-slot is-empty" type="button" data-open-form="team">Slot ${index + 1}</button>`;
    return `
      <article class="team-slot">
        ${mon.spriteUrl ? `<img src="${html(mon.spriteUrl)}" alt="" />` : `<span class="mon-placeholder">${html(mon.species.slice(0, 2))}</span>`}
        <strong>${html(mon.nickname || mon.species)}</strong>
        <small>${html(mon.species)}${mon.level ? ` - Lv. ${html(mon.level)}` : ""}</small>
        <div class="type-row">${renderTypes(mon.types)}</div>
        <div class="slot-actions">
          <button type="button" data-edit-mon="${mon.id}">Editar</button>
          <button type="button" data-kill-mon="${mon.id}">Morte</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderPlayHud(run) {
  const defeated = run.badges.filter((badge) => badge.defeated).length;
  const nextCap = run.badges.find((badge) => !badge.defeated && badge.levelCap);
  const lastEncounter = run.encounters.at(-1);
  el.playHudCap.textContent = nextCap ? `Cap Lv. ${nextCap.levelCap}` : "Livre";
  el.playHudBadges.textContent = `${defeated}/${run.badges.length}`;
  el.playHudDeaths.textContent = String(run.graveyard.length);
  el.playHudEncounter.textContent = lastEncounter ? lastEncounter.species || lastEncounter.route || "-" : "-";
  el.playHudTeam.innerHTML = run.team.length ? run.team.slice(0, MAX_TEAM_SIZE).map((mon) => `
    <article>
      ${mon.spriteUrl ? `<img src="${html(mon.spriteUrl)}" alt="" />` : `<span class="mini-mon">${html(mon.species.slice(0, 2))}</span>`}
      <div>
        <strong>${html(mon.nickname || mon.species)}</strong>
        <small>${mon.level ? `Lv. ${html(mon.level)} · ` : ""}${html(mon.species)}</small>
      </div>
    </article>
  `).join("") : `<p class="empty-state">Adicione Pokemon ao time para preencher o HUD.</p>`;
}

function activateTab(tabName) {
  $$(".challenge-tabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tabName));
  $$(".challenge-panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === tabName));
}

async function loadLinkedRomFrame(run) {
  const linkedRom = getLinkedRom(run);
  if (!linkedRom) {
    openDialog("run", run.id);
    return;
  }

  try {
    await bootChallengeEmulator(run, linkedRom, "#challenge-emulator-player");
    addTimelineEvent(run, "rom", "Emulador carregado no Oak Challenge", linkedRom.title);
    upsertRun(run);
  } catch (error) {
    showChallengeEmulatorError(error.message || "Nao foi possivel carregar a ROM vinculada.");
  }
}

function scheduleObsEmulatorBoot(run) {
  if (obsAutoBootStarted) return;
  const linkedRom = getLinkedRom(run);
  const placeholder = document.querySelector("#obs-emulator-placeholder");
  if (!linkedRom) {
    if (placeholder) placeholder.textContent = "Vincule uma ROM local na dashboard do Oak Challenge.";
    return;
  }
  obsAutoBootStarted = true;
  if (placeholder) placeholder.textContent = "Inicializando ROM da run...";
  window.setTimeout(() => {
    bootChallengeEmulator(run, linkedRom, "#obs-emulator-player", { directRuntime: true, silent: true }).catch((error) => {
      if (placeholder) placeholder.textContent = error.message || "Nao foi possivel carregar a ROM.";
    });
  }, 250);
}

async function bootChallengeEmulator(run, linkedRom, playerSelector = "#challenge-emulator-player", options = {}) {
  setChallengeEmulatorStatus("Localizando ROM...");
  if (el.challengeEmulatorError) el.challengeEmulatorError.hidden = true;
  const localRoms = options.romRecord ? [] : await getLocalRoms();
  const romRecord = options.romRecord || localRoms.find((rom) => rom.id === linkedRom.id || rom.id === run.romId);
  if (!romRecord?.file) {
    throw new Error("Vincule uma ROM local importada. Capas da biblioteca nao incluem o arquivo da ROM.");
  }

  const system = getSystemByFileName(romRecord.name || romRecord.file.name);
  if (!system) {
    throw new Error("Formato de ROM nao suportado pelo emulador do Oak Challenge.");
  }

  await resetChallengeEmulator();
  if (!options.silent) {
    showChallengeEmulatorLoading(true);
    el.emulatorEmpty.hidden = true;
  }

  setChallengeEmulatorStatus(`Preparando ${romRecord.name || romRecord.file.name} (${system.label})...`);
  challengeRomUrl = URL.createObjectURL(romRecord.file);

  if (system.id === "ps1") {
    const biosRecord = await getPs1BiosRecord();
    if (!biosRecord?.file) {
      throw new Error("PS1 precisa da BIOS scph5501.bin importada no navegador.");
    }
    challengeBiosUrl = URL.createObjectURL(biosRecord.file);
    window.EJS_biosUrl = challengeBiosUrl;
  } else {
    delete window.EJS_biosUrl;
  }

  const player = document.querySelector(playerSelector);
  if (!player) {
    throw new Error(`Player do emulador nao encontrado: ${playerSelector}`);
  }
  player.innerHTML = "";
  player.dataset.runtime = options.directRuntime ? "direct" : "isolated";

  setChallengeEmulatorStatus("Carregando EmulatorJS...");
  if (options.directRuntime) {
    window.EJS_player = playerSelector;
    window.EJS_core = system.core;
    window.EJS_pathtodata = EMULATORJS_DATA_PATH;
    window.EJS_gameName = romRecord.title || romRecord.name || romRecord.file.name;
    window.EJS_gameUrl = challengeRomUrl;
    window.EJS_startOnLoaded = true;
    window.EJS_threads = false;
    window.EJS_volume = 0.7;
    window.EJS_color = "#78f39f";
    window.EJS_defaultOptions = {
      shader: "crt-easymode.glslp",
      "save-state-location": "browser",
    };
    challengeLoaderScript = document.createElement("script");
    challengeLoaderScript.src = `${EMULATORJS_DATA_PATH}loader.js`;
    challengeLoaderScript.dataset.challengeEmulatorLoader = "true";
    challengeLoaderScript.async = true;
    challengeLoaderScript.addEventListener("load", () => {
      setChallengeEmulatorStatus("EmulatorJS carregado. Inicializando core...");
      showChallengeEmulatorLoading(false);
      if (el.challengeEmulatorError) el.challengeEmulatorError.hidden = true;
      document.querySelector("#obs-emulator-placeholder")?.setAttribute("hidden", "");
      startObsToolbarDocking(player);
    });
    challengeLoaderScript.addEventListener("error", () => {
      showChallengeEmulatorError("O core do EmulatorJS nao carregou. Verifique a conexao com a CDN.");
    });
    document.body.appendChild(challengeLoaderScript);
    return;
  }

  const frame = document.createElement("iframe");
  frame.className = "challenge-runtime-frame";
  frame.title = "Emulador Oak Challenge";
  frame.allow = "fullscreen; gamepad; autoplay";
  frame.srcdoc = buildChallengeRuntimeDocument({
    core: system.core,
    gameName: romRecord.title || romRecord.name || romRecord.file.name,
    gameUrl: challengeRomUrl,
    biosUrl: challengeBiosUrl,
  });
  frame.addEventListener("load", () => {
    setChallengeEmulatorStatus("EmulatorJS carregado. Inicializando core...");
    showChallengeEmulatorLoading(false);
    if (el.challengeEmulatorError) el.challengeEmulatorError.hidden = true;
    document.querySelector("#obs-emulator-placeholder")?.setAttribute("hidden", "");
    startRuntimeLayoutRepair(player);
  });
  player.appendChild(frame);
  window.setTimeout(() => {
    if (player.contains(frame) && !frame.contentDocument) {
      showChallengeEmulatorError("O runtime isolado do EmulatorJS nao abriu. Recarregue a pagina e tente novamente.");
    }
  }, EMULATOR_BOOT_TIMEOUT);
}

function buildChallengeRuntimeDocument({ core, gameName, gameUrl, biosUrl }) {
  const config = JSON.stringify({
    core,
    gameName,
    gameUrl,
    biosUrl,
    dataPath: EMULATORJS_DATA_PATH,
  }).replace(/</g, "\\u003c");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: auto;
      background: #000;
    }
    #player {
      width: 100%;
      height: 100%;
      background: #000;
      overflow: hidden;
    }
    #player iframe,
    #player canvas {
      width: 100% !important;
      height: 100% !important;
      max-width: none;
      display: block;
      border: 0;
      margin: 0;
      padding: 0;
    }
    #player canvas {
      object-fit: contain;
      background: #000;
    }
    [class*="netplay" i], [id*="netplay" i],
    [class*="multiplayer" i], [id*="multiplayer" i],
    [class*="drop" i], [id*="drop" i] {
      display: none !important;
      pointer-events: none !important;
    }
    body:not(.oak-control-settings-open) {
      overflow: hidden;
    }
    body.oak-control-settings-open {
      overflow: auto;
    }
    body.oak-control-settings-open #player {
      min-height: 100%;
    }
    .ejs_control_body input[type='text'] {
      background: rgba(12, 18, 32, 0.96) !important;
      border: 1px solid rgba(96, 165, 250, 0.78) !important;
      color: #eaf2ff !important;
      -webkit-text-fill-color: #eaf2ff !important;
      text-shadow: none !important;
    }
  </style>
</head>
<body>
  <div id="player"></div>
  <script>
    const config = ${config};
    window.EJS_player = "#player";
    window.EJS_core = config.core;
    window.EJS_pathtodata = config.dataPath;
    window.EJS_gameName = config.gameName;
    window.EJS_gameUrl = config.gameUrl;
    window.EJS_startOnLoaded = true;
    window.EJS_threads = false;
    window.EJS_volume = 0.7;
    window.EJS_color = "#78f39f";
    window.EJS_defaultOptions = {
      shader: "crt-easymode.glslp",
      "save-state-location": "browser"
    };
    if (config.biosUrl) window.EJS_biosUrl = config.biosUrl;
    const blockedText = ["drop save state here to load", "room name", "players", "criar uma sala", "create room", "not connected", "netplay", "multiplayer"];
    function cleanRuntimeOverlays() {
      document.querySelectorAll("div, form, section, aside").forEach((node) => {
        if (node.id === "player" || node.querySelector("canvas, iframe, video")) return;
        const text = String(node.innerText || node.textContent || "").trim().toLowerCase();
        if (!text || !blockedText.some((pattern) => text.includes(pattern))) return;
        if (text.includes("configurações do controle") || text.includes("configuracoes do controle") || text.includes("control settings")) return;
        node.style.setProperty("display", "none", "important");
        node.style.setProperty("pointer-events", "none", "important");
      });
    }
    function syncControlSettingsScroll() {
      const isOpen = Array.from(document.querySelectorAll("div, section, aside, form, h1, h2, h3")).some((node) => {
        const text = String(node.innerText || node.textContent || "").toLowerCase();
        return text.includes("configurações do controle") || text.includes("configuracoes do controle") || text.includes("control settings");
      });
      document.body.classList.toggle("oak-control-settings-open", isOpen);
    }
    window.setInterval(() => {
      cleanRuntimeOverlays();
      syncControlSettingsScroll();
    }, 300);
  </script>
  <script src="${EMULATORJS_DATA_PATH}loader.js"></script>
</body>
</html>`;
}

function startRuntimeLayoutRepair(player) {
  let attempts = 0;
  const repair = () => {
    attempts += 1;
    repairRuntimeLayout(player);
    if (attempts < 40) {
      window.setTimeout(repair, 250);
    }
  };
  repair();
}

function startObsToolbarDocking(player) {
  if (!isObsMode || !player) return;
  window.clearInterval(obsToolbarDockTimer);
  let attempts = 0;
  const dock = () => {
    attempts += 1;
    dockObsNativeToolbar(player);
    if (attempts > 80) {
      window.clearInterval(obsToolbarDockTimer);
      obsToolbarDockTimer = 0;
    }
  };
  dock();
  obsToolbarDockTimer = window.setInterval(dock, 300);
}

function dockObsNativeToolbar(player) {
  const controlSelector = [
    "button",
    "[role='button']",
    "[data-btn]",
    "[data-action]",
    ".ejs--button",
    ".ejs_button",
    "input[type='range']",
  ].join(",");
  const modalText = [
    "configurações do controle",
    "configuracoes do controle",
    "control settings",
    "backend core options",
    "graphics setting",
    "screen capture",
    "resetar",
    "limpar",
    "jogador 1",
  ];
  const candidates = Array.from(player.querySelectorAll("div, nav, section"))
    .map((node) => {
      const rect = node.getBoundingClientRect();
      const text = String(node.innerText || node.textContent || "").trim().toLowerCase();
      return {
        node,
        rect,
        text,
        controls: node.querySelectorAll(controlSelector).length,
      };
    })
    .filter(({ node, rect, text, controls }) => {
      if (node === player || node.querySelector("canvas, iframe, video")) return false;
      if (controls < 6) return false;
      if (rect.width < window.innerWidth * 0.32 || rect.height > 110) return false;
      if (modalText.some((pattern) => text.includes(pattern))) return false;
      return true;
    })
    .sort((a, b) => {
      const aBottomScore = Math.abs(window.innerHeight - a.rect.bottom);
      const bBottomScore = Math.abs(window.innerHeight - b.rect.bottom);
      return b.controls - a.controls || aBottomScore - bBottomScore;
    });

  const toolbar = candidates[0]?.node;
  if (!toolbar) return;
  player.querySelectorAll(".oak-obs-native-toolbar").forEach((node) => {
    if (node !== toolbar) node.classList.remove("oak-obs-native-toolbar");
  });
  toolbar.classList.add("oak-obs-native-toolbar");
}

function repairRuntimeLayout(player) {
  if (!player) return;
  hideChallengeRuntimeOverlays(player);
  const nodes = player.querySelectorAll("div, canvas, iframe, video");
  nodes.forEach((node) => {
    const className = String(node.className || "");
    if (node === player) return;
    if (node.tagName === "CANVAS" || node.tagName === "IFRAME" || /player|game|screen|canvas|emulator|ejs/i.test(className)) {
      node.style.setProperty("position", "absolute", "important");
      node.style.setProperty("inset", "0", "important");
      node.style.setProperty("width", "100%", "important");
      node.style.setProperty("height", "100%", "important");
      node.style.setProperty("max-width", "100%", "important");
      node.style.setProperty("max-height", "100%", "important");
    }
  });

  const looseControls = player.querySelectorAll("button, [role='button'], .ejs--button, .ejs_button");
  looseControls.forEach((control) => {
    const rect = control.getBoundingClientRect();
    if (rect.width > 160 || rect.height > 80) return;
    control.style.setProperty("z-index", "5", "important");
  });
}

function hideChallengeRuntimeOverlays(player) {
  const blockedText = [
    "drop save state here to load",
    "room name",
    "players",
    "criar uma sala",
    "create room",
    "not connected",
    "netplay",
    "multiplayer",
  ];
  const selectors = [
    "[class*='netplay' i]",
    "[id*='netplay' i]",
    "[class*='multiplayer' i]",
    "[id*='multiplayer' i]",
    "[class*='drop' i]",
    "[id*='drop' i]",
  ].join(",");

  player.querySelectorAll(selectors).forEach((node) => {
    if (node.querySelector?.("canvas, iframe, video")) return;
    node.style.setProperty("display", "none", "important");
    node.style.setProperty("pointer-events", "none", "important");
  });

  player.querySelectorAll("div, form, section, aside").forEach((node) => {
    if (node === player || node.querySelector("canvas, iframe, video")) return;
    const text = String(node.innerText || node.textContent || "").trim().toLowerCase();
    if (!text) return;
    if (!blockedText.some((pattern) => text.includes(pattern))) return;
    node.style.setProperty("display", "none", "important");
    node.style.setProperty("pointer-events", "none", "important");
  });
}

async function resetChallengeEmulator() {
  window.clearInterval(obsToolbarDockTimer);
  obsToolbarDockTimer = 0;

  try {
    if (window.EJS_emulator?.stop) window.EJS_emulator.stop();
  } catch {
    // Runtime partially loaded.
  }

  if (challengeLoaderScript) {
    challengeLoaderScript.remove();
    challengeLoaderScript = null;
  }

  document.querySelectorAll('[data-challenge-emulator-loader="true"]').forEach((script) => script.remove());

  if (challengeRomUrl) URL.revokeObjectURL(challengeRomUrl);
  if (challengeBiosUrl) URL.revokeObjectURL(challengeBiosUrl);
  challengeRomUrl = "";
  challengeBiosUrl = "";

  delete window.EJS_player;
  delete window.EJS_core;
  delete window.EJS_pathtodata;
  delete window.EJS_gameName;
  delete window.EJS_gameUrl;
  delete window.EJS_biosUrl;
  delete window.EJS_startOnLoaded;
  delete window.EJS_threads;
  delete window.EJS_volume;
  delete window.EJS_color;
  delete window.EJS_defaultOptions;
  delete window.EJS_emulator;

  if (el.challengeEmulatorPlayer) el.challengeEmulatorPlayer.innerHTML = "";
  const obsPlayer = document.querySelector("#obs-emulator-player");
  if (obsPlayer) obsPlayer.innerHTML = "";
  if (el.challengeEmulatorError) el.challengeEmulatorError.hidden = true;
}

function setChallengeEmulatorStatus(message) {
  const targets = [
    el.challengeEmulatorErrorMessage,
    document.querySelector("#obs-emulator-placeholder"),
  ].filter(Boolean);
  targets.forEach((target) => {
    target.textContent = message;
  });
}

function showChallengeEmulatorLoading(isLoading) {
  if (el.challengeEmulatorLoading) el.challengeEmulatorLoading.hidden = !isLoading;
  if (el.challengeEmulatorError) el.challengeEmulatorError.hidden = true;
  if (isLoading) setChallengeEmulatorStatus("Inicializando emulador...");
}

function showChallengeEmulatorError(message) {
  showChallengeEmulatorLoading(false);
  if (el.emulatorEmpty) el.emulatorEmpty.hidden = true;
  if (el.challengeEmulatorError) el.challengeEmulatorError.hidden = false;
  if (el.challengeEmulatorErrorMessage) el.challengeEmulatorErrorMessage.textContent = message;
}

function renderTypes(types = "") {
  return String(types).split(",").map((type) => type.trim()).filter(Boolean).map((type) => {
    const color = TYPE_COLORS[type.toLowerCase()] || "#4cc4ff";
    return `<span style="--type-color:${color}">${html(type)}</span>`;
  }).join("");
}

function formatPokemonName(value) {
  return String(value || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizePokemonQuery(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function fetchPokemonFromApi(query) {
  const normalized = normalizePokemonQuery(query);
  if (!normalized) throw new Error("Digite o nome do Pokemon.");
  if (!pokemonCache.has(normalized)) {
    pokemonCache.set(normalized, fetch(`${POKEAPI_BASE}/pokemon/${normalized}`).then(async (response) => {
      if (!response.ok) throw new Error("Pokemon nao encontrado na PokeAPI.");
      const pokemon = await response.json();
      return {
        id: pokemon.id,
        species: formatPokemonName(pokemon.name),
        types: pokemon.types.map(({ type }) => formatPokemonName(type.name)).join(", "),
        ability: formatPokemonName(pokemon.abilities.find((entry) => !entry.is_hidden)?.ability.name || pokemon.abilities[0]?.ability.name || ""),
        spriteUrl:
          pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ||
          pokemon.sprites.other?.showdown?.front_default ||
          pokemon.sprites.front_default ||
          pokemon.sprites.other?.["official-artwork"]?.front_default ||
          "",
      };
    }));
  }
  return pokemonCache.get(normalized);
}

async function loadPokemonCatalog() {
  if (!pokemonCatalogPromise) {
    pokemonCatalogPromise = fetch(`${POKEAPI_BASE}/pokemon?limit=${POKEMON_CATALOG_LIMIT}&offset=0`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Nao foi possivel carregar sugestoes da PokeAPI.");
        const payload = await response.json();
        pokemonCatalog = (payload.results || []).map((pokemon) => ({
          name: pokemon.name,
          label: formatPokemonName(pokemon.name),
        }));
        return pokemonCatalog;
      })
      .catch((error) => {
        pokemonCatalogPromise = null;
        throw error;
      });
  }
  return pokemonCatalogPromise;
}

function getPokemonSuggestions(query) {
  const normalized = normalizePokemonQuery(query);
  if (normalized.length < 2) return [];
  return pokemonCatalog
    .filter((pokemon) => pokemon.name.includes(normalized))
    .slice(0, 8);
}

function renderPokemonSuggestions(items, status = "") {
  const list = el.form.querySelector("#pokemon-suggestions");
  if (!list) return;
  if (status) {
    list.innerHTML = `<span>${html(status)}</span>`;
    list.hidden = false;
    return;
  }
  if (!items.length) {
    list.innerHTML = "";
    list.hidden = true;
    return;
  }
  list.innerHTML = items.map((pokemon) => `
    <button type="button" data-pokemon-suggestion="${html(pokemon.name)}">${html(pokemon.label)}</button>
  `).join("");
  list.hidden = false;
}

function schedulePokemonSuggestions(query) {
  window.clearTimeout(pokemonLookupTimer);
  pokemonLookupTimer = window.setTimeout(async () => {
    if (normalizePokemonQuery(query).length < 2) {
      renderPokemonSuggestions([]);
      return;
    }
    try {
      if (!pokemonCatalog.length) renderPokemonSuggestions([], "Carregando sugestoes...");
      await loadPokemonCatalog();
      renderPokemonSuggestions(getPokemonSuggestions(query));
    } catch (error) {
      renderPokemonSuggestions([], error.message);
    }
  }, 180);
}

function renderPokemonLookupPreview(data, status = "") {
  const preview = el.form.querySelector("#pokemon-lookup-preview");
  if (!preview) return;
  if (data) {
    preview.innerHTML = `
      <div class="pokemon-preview-art">
        ${data.spriteUrl ? `<img src="${html(data.spriteUrl)}" alt="" />` : `<span class="mini-mon">${html(data.species.slice(0, 2))}</span>`}
      </div>
      <div>
        <strong>${html(data.species)}</strong>
        <div class="type-row">${renderTypes(data.types)}</div>
        <span>${data.ability ? `Habilidade: ${html(data.ability)}` : "Habilidade nao informada"}</span>
      </div>
    `;
    preview.classList.add("is-filled");
    return;
  }
  preview.innerHTML = `<span>${html(status || "Busque um Pokemon para preencher sprite, tipo e habilidade.")}</span>`;
  preview.classList.remove("is-filled");
}

function applyPokemonLookupData(data) {
  if (!data) return;
  el.form.elements.species.value = data.species;
  el.form.elements.types.value = data.types;
  el.form.elements.ability.value = data.ability;
  el.form.elements.spriteUrl.value = data.spriteUrl;
  renderPokemonLookupPreview(data);
}

function parseTypes(types = "") {
  return String(types)
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);
}

function getAttackMultiplier(attackType, defenderTypes) {
  return defenderTypes.reduce((multiplier, defenderType) => {
    return multiplier * (TYPE_EFFECTIVENESS[attackType]?.[defenderType] ?? 1);
  }, 1);
}

function analyzeTeamTypes(team) {
  return Object.keys(TYPE_COLORS).map((attackType) => {
    const score = team.reduce((totals, mon) => {
      const multiplier = getAttackMultiplier(attackType, parseTypes(mon.types));
      if (multiplier >= 2) totals.weak += 1;
      if (multiplier < 1) totals.resist += 1;
      if (multiplier === 0) totals.immune += 1;
      return totals;
    }, { type: attackType, weak: 0, resist: 0, immune: 0 });
    return score;
  });
}

function renderWeaknessPanel(run) {
  const analysis = analyzeTeamTypes(run.team);
  const threats = analysis.filter((item) => item.weak >= 2).sort((a, b) => b.weak - a.weak).slice(0, 6);
  const coverage = analysis.filter((item) => item.resist + item.immune >= 2).sort((a, b) => (b.resist + b.immune) - (a.resist + a.immune)).slice(0, 6);
  return `
    <div class="panel-title-row">
      <span>Fraquezas do time</span>
      <strong>${run.team.length ? `${run.team.length} membros` : "Sem time"}</strong>
    </div>
    ${run.team.length ? `
      <div class="weakness-columns">
        <div>
          <small>Atenção</small>
          <div class="type-score-list">${renderTypeScores(threats, "weak")}</div>
        </div>
        <div>
          <small>Cobertura defensiva</small>
          <div class="type-score-list">${renderTypeScores(coverage, "resist")}</div>
        </div>
      </div>
    ` : `<p class="empty-state">Adicione tipos no time para calcular ameaças e resistências.</p>`}
  `;
}

function renderTypeScores(items, mode) {
  if (!items.length) return `<p class="empty-state">Nenhum destaque ainda.</p>`;
  return items.map((item) => {
    const color = TYPE_COLORS[item.type] || "#4cc4ff";
    const value = mode === "weak" ? item.weak : item.resist + item.immune;
    const suffix = mode === "weak" ? "fracos" : "seguram";
    return `<span class="type-score" style="--type-color:${color}">${html(item.type)} <strong>${value}</strong> ${suffix}</span>`;
  }).join("");
}

function compactList(items, formatter) {
  if (!items.length) return `<p class="empty-state">Nada registrado ainda.</p>`;
  return items.map((item) => `<article>${html(formatter(item))}</article>`).join("");
}

function addTimelineEvent(run, type, title, detail = "") {
  run.timeline.push({
    id: uid("event"),
    type,
    title,
    detail,
    createdAt: new Date().toISOString(),
  });
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderCollections(run) {
  const allPokemon = [...run.team, ...run.box];
  el.pokemonManager.innerHTML = allPokemon.length ? allPokemon.map((mon) => `
    <article class="manager-card">
      <div class="manager-card-sprite">
        ${mon.spriteUrl ? `<img src="${html(mon.spriteUrl)}" alt="" />` : `<span class="mini-mon">${html(mon.species.slice(0, 2))}</span>`}
      </div>
      <div class="manager-card-info">
        <strong>${html(mon.nickname || mon.species)}</strong>
        <span>${html(mon.species)}${mon.level ? ` - Lv. ${html(mon.level)}` : ""} - ${mon.status === "box" ? "Box" : "Time"}</span>
        <div class="type-row">${renderTypes(mon.types)}</div>
      </div>
      <div class="card-actions manager-card-actions">
        <button type="button" data-edit-mon="${mon.id}">Editar</button>
        <button type="button" data-move-mon="${mon.id}">${mon.status === "box" ? "Time" : "Box"}</button>
      </div>
    </article>
  `).join("") : `<p class="empty-state">Adicione o primeiro Pokemon da run.</p>`;

  el.encounterList.innerHTML = table(run.encounters, ["Rota", "Pokemon", "Status", "Notas"], (item) => [item.route, item.species, item.status, item.notes]);
  el.graveyardGrid.innerHTML = run.graveyard.length ? run.graveyard.map((death) => `
    <article class="grave-card">
      <strong>${html(death.nickname || death.species)}</strong>
      <span>${html(death.species)} - Lv. ${html(death.level)}</span>
      <p>${html(death.cause || "Sem causa registrada.")}</p>
    </article>
  `).join("") : `<p class="empty-state">Nenhuma perda registrada.</p>`;
  el.badgeList.innerHTML = table(run.badges, ["Lider", "Badge", "Tipo", "Cap"], (item) => [item.leader, item.badgeName, item.type, item.levelCap ? `Lv. ${item.levelCap}` : ""]);
  el.notesList.innerHTML = run.notes.length ? run.notes.slice().reverse().map((note) =>
    `<article><strong>${html(note.title || "Nota")}</strong><p>${html(note.text)}</p></article>`
  ).join("") : `<p class="empty-state">O diario da run esta vazio.</p>`;
  el.timelineList.innerHTML = run.timeline.length ? run.timeline.slice().reverse().map((event) => `
    <article class="timeline-event" data-event-type="${html(event.type)}">
      <span>${html(formatDateTime(event.createdAt))}</span>
      <strong>${html(event.title)}</strong>
      ${event.detail ? `<p>${html(event.detail)}</p>` : ""}
    </article>
  `).join("") : `<p class="empty-state">A linha do tempo ainda esta vazia.</p>`;
  el.hudPreview.innerHTML = `
    <div class="streamer-scene">
      <header class="streamer-top-overlay">
        <div class="streamer-run-name">
          <span>${html(run.mode)}</span>
          <strong>${html(run.name)}</strong>
        </div>
        <button class="overlay-oakbit-trigger" id="pokedex-toggle" type="button" data-toggle-overlay-pokedex>
          <span>OakBit</span>
          <strong>Pokedex</strong>
        </button>
        <button class="overlay-fullscreen-trigger" id="dock-fullscreen" type="button" data-toggle-overlay-fullscreen>
          Tela cheia
        </button>
        <button class="streamer-config-toggle" type="button" data-toggle-run-menu>
          <span>Run</span>
          <strong>${run.badges.filter((badge) => badge.defeated).length}/${run.badges.length}</strong>
        </button>
      </header>
      ${renderOverlayConfigPanel(run)}
      ${renderOverlayPokedexPanel()}
      ${renderOverlayEditor(run)}
      <div class="streamer-game-window">
        <div id="obs-emulator-player" class="obs-emulator-player"></div>
        <span id="obs-emulator-placeholder">ROM vinculada aparece aqui</span>
      </div>
      <div class="streamer-free-team">
        ${renderStreamerTeam(run)}
      </div>
    </div>
  `;
}

function renderOverlayPokedexPanel() {
  return `
    <aside class="overlay-pokedex-panel" id="overlay-pokedex-panel" hidden>
      <header>
        <div>
          <span>OakBit</span>
          <strong>Pokedex integrada</strong>
        </div>
        <button type="button" data-toggle-overlay-pokedex>Fechar</button>
      </header>
      <iframe title="Pokedex integrada OakBit" data-overlay-pokedex-frame loading="lazy" allow="autoplay"></iframe>
    </aside>
  `;
}

function renderOverlayConfigPanel(run) {
  const defeated = run.badges.filter((badge) => badge.defeated).length;
  const nextCap = run.badges.find((badge) => !badge.defeated && badge.levelCap);
  const lastEncounter = run.encounters.at(-1);
  const lastNote = run.notes.at(-1);
  return `
    <aside class="streamer-config-panel" id="streamer-config-panel" hidden>
      <header>
        <div>
          <span>Oak Challenge</span>
          <strong>Controle da run</strong>
        </div>
        <button type="button" data-toggle-run-menu>Fechar</button>
      </header>
      <div class="streamer-config-stats">
        <article><span>Badges</span><strong>${defeated}/${run.badges.length}</strong></article>
        <article><span>Mortes</span><strong>${run.graveyard.length}</strong></article>
        <article><span>Cap</span><strong>${nextCap ? `Lv. ${nextCap.levelCap}` : "Livre"}</strong></article>
      </div>
      <section>
        <div class="streamer-config-heading">
          <span>Insignias</span>
          <strong>${defeated}/${run.badges.length}</strong>
        </div>
        <div class="streamer-config-badges">${renderStreamerBadges(run)}</div>
      </section>
      <section>
        <div class="streamer-config-heading">
          <span>Rotas</span>
          <button type="button" id="detect-routes">Configurar</button>
        </div>
        <div class="streamer-config-routes">${renderStreamerRoutes(run)}</div>
      </section>
      <section>
        <div class="streamer-config-heading">
          <span>Acoes rapidas</span>
        </div>
        <div class="streamer-config-actions">
          <button type="button" data-open-form="encounter">Encontro</button>
          <button type="button" data-open-form="death">Morte</button>
          <button type="button" data-open-form="note">Nota</button>
          <button type="button" data-open-form="team">Pokemon</button>
          <button type="button" data-reset-overlay-layout>Reset sprites</button>
        </div>
      </section>
      <section>
        <div class="streamer-config-heading"><span>Resumo</span></div>
        <div class="streamer-config-summary">
          <article><span>Ultimo encontro</span><strong>${html(lastEncounter?.species || lastEncounter?.route || "-")}</strong></article>
          <article><span>Ultima nota</span><strong>${html(lastNote?.title || lastNote?.text || "-")}</strong></article>
        </div>
      </section>
    </aside>
  `;
}

function renderOverlayConfigPanelIntoScene(run) {
  const panel = document.querySelector("#streamer-config-panel");
  const wasOpen = panel && !panel.hidden;
  panel?.remove();
  document.querySelector(".streamer-scene")?.insertAdjacentHTML("beforeend", renderOverlayConfigPanel(run));
  const nextPanel = document.querySelector("#streamer-config-panel");
  if (nextPanel) nextPanel.hidden = !wasOpen;
  const toggle = document.querySelector("[data-toggle-run-menu].streamer-config-toggle strong");
  if (toggle) toggle.textContent = `${run.badges.filter((badge) => badge.defeated).length}/${run.badges.length}`;
}

function toggleOverlayPokedex(forceOpen) {
  const panel = document.querySelector("#overlay-pokedex-panel");
  if (!panel) return;
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : panel.hidden;
  panel.hidden = !shouldOpen;
  document.body.classList.toggle("is-overlay-pokedex-open", shouldOpen);
  const frame = panel.querySelector("[data-overlay-pokedex-frame]");
  if (shouldOpen && frame && !frame.getAttribute("src")) {
    frame.setAttribute("src", "./pokedex.html?embed=1");
  }
  if (shouldOpen) {
    window.OakMascot?.setMode?.("pokedex");
    window.OakMascot?.say?.("Pokedex integrada online.", "thinking", 2200, "action");
  } else if (isObsMode) {
    window.OakMascot?.setMode?.("emulator");
  }
}

async function toggleObsFullscreen() {
  const target = document.documentElement;
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (target.requestFullscreen) {
      await target.requestFullscreen();
    }
  } catch {
    window.OakMascot?.say?.("O navegador bloqueou a tela cheia.", "alert", 2600, "error");
  }
}

function syncObsFullscreenState() {
  const isFullscreen = Boolean(document.fullscreenElement);
  document.body.classList.toggle("is-obs-fullscreen", isFullscreen);
  const button = document.querySelector("#dock-fullscreen");
  if (button) {
    button.textContent = isFullscreen ? "Sair da tela cheia" : "Tela cheia";
    button.setAttribute("aria-label", button.textContent);
  }
  window.OakMascot?.syncFullscreenHost?.();
}

function ensureOakChallengeTour() {
  let overlay = document.querySelector("#oak-challenge-tour");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "oak-challenge-tour";
  overlay.className = "oak-challenge-tour";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="oak-challenge-tour-dim" aria-hidden="true"></div>
    <div class="oak-challenge-tour-spotlight" aria-hidden="true"></div>
    <section class="oak-challenge-tour-card" role="dialog" aria-live="polite" aria-label="Tutorial Oak Challenge"></section>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function startOakChallengeTour() {
  if (isObsMode) {
    window.OakMascot?.say?.("No overlay: clique duas vezes no Pokemon para editar, arraste para posicionar e aperte P para abrir a Pokedex.", "thinking", 5200, "action");
    return;
  }
  oakChallengeTourIndex = 0;
  oakChallengeTourActive = true;
  ensureOakChallengeTour().hidden = false;
  renderOakChallengeTourStep();
  window.OakMascot?.say?.("Tutorial do Oak Challenge iniciado.", "happy", 2400, "action");
}

function closeOakChallengeTour() {
  oakChallengeTourActive = false;
  const overlay = document.querySelector("#oak-challenge-tour");
  if (overlay) overlay.hidden = true;
}

function renderOakChallengeTourStep() {
  if (!oakChallengeTourActive) return;
  const overlay = ensureOakChallengeTour();
  const step = OAK_CHALLENGE_TOUR_STEPS[oakChallengeTourIndex];
  if (!step) {
    closeOakChallengeTour();
    return;
  }
  if (step.tab) activateTab(step.tab);
  window.setTimeout(() => positionOakChallengeTour(step), 60);
  const card = overlay.querySelector(".oak-challenge-tour-card");
  card.innerHTML = `
    <span>${oakChallengeTourIndex + 1}/${OAK_CHALLENGE_TOUR_STEPS.length}</span>
    <h3>${html(step.title)}</h3>
    <p>${html(step.text)}</p>
    <div>
      <button type="button" data-oak-challenge-tour="prev" ${oakChallengeTourIndex === 0 ? "disabled" : ""}>Voltar</button>
      <button type="button" data-oak-challenge-tour="close">Fechar</button>
      <button type="button" data-oak-challenge-tour="next">${oakChallengeTourIndex === OAK_CHALLENGE_TOUR_STEPS.length - 1 ? "Concluir" : "Proximo"}</button>
    </div>
  `;
}

function positionOakChallengeTour(step) {
  const overlay = ensureOakChallengeTour();
  const spotlight = overlay.querySelector(".oak-challenge-tour-spotlight");
  const card = overlay.querySelector(".oak-challenge-tour-card");
  const target = document.querySelector(step.selector);
  const rect = target?.getBoundingClientRect();
  const pad = 10;
  if (target) target.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  const safeRect = rect || { left: window.innerWidth - 110, top: window.innerHeight - 110, width: 82, height: 82, right: window.innerWidth - 28, bottom: window.innerHeight - 28 };
  spotlight.style.left = `${Math.max(8, safeRect.left - pad)}px`;
  spotlight.style.top = `${Math.max(8, safeRect.top - pad)}px`;
  spotlight.style.width = `${Math.min(window.innerWidth - 16, safeRect.width + pad * 2)}px`;
  spotlight.style.height = `${Math.min(window.innerHeight - 16, safeRect.height + pad * 2)}px`;
  const cardWidth = Math.min(360, window.innerWidth - 24);
  let left = Math.min(window.innerWidth - cardWidth - 12, Math.max(12, safeRect.left));
  let top = safeRect.bottom + 18;
  if (top + 230 > window.innerHeight) top = Math.max(12, safeRect.top - 238);
  card.style.width = `${cardWidth}px`;
  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
}

function speakOverlayNarration(text) {
  const content = String(text || "").trim();
  if (!content) return;
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    window.OakMascot?.say?.("Narracao indisponivel neste navegador.", "alert", 2600, "error");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(content);
  const voices = window.speechSynthesis.getVoices();
  utterance.lang = "pt-BR";
  utterance.voice = voices.find((voice) => voice.lang?.toLowerCase() === "pt-br") || voices.find((voice) => voice.lang?.toLowerCase().startsWith("pt")) || null;
  utterance.rate = 0.93;
  utterance.pitch = 0.92;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function renderOverlayEditor(run) {
  const mon = run.team.find((item) => item.id === overlayEditorMonId) || run.box.find((item) => item.id === overlayEditorMonId);
  if (!mon) return "";
  const boxOptions = run.box.filter((item) => item.id !== mon.id);
  return `
    <form class="overlay-mon-editor" id="overlay-mon-editor" data-overlay-editor="${html(mon.id)}">
      <div>
        <strong>${html(mon.species)}</strong>
        <button type="button" data-close-overlay-editor>×</button>
      </div>
      ${mon.spriteUrl ? `<img src="${html(mon.spriteUrl)}" alt="" />` : ""}
      <label>
        <span>Trocar Pokemon</span>
        <div class="overlay-lookup-row">
          <input name="pokemonLookup" type="search" value="${html(mon.species || "")}" placeholder="Ex: pikachu" autocomplete="off" />
          <button type="button" data-overlay-fetch-pokemon>Buscar</button>
        </div>
      </label>
      <div class="overlay-pokemon-preview" data-overlay-pokemon-preview>
        <span>${html(mon.types || "Busque para trocar sprite, tipos e habilidade.")}</span>
      </div>
      ${mon.status === "team" && boxOptions.length ? `
        <label>
          <span>Substituir por box</span>
          <select name="swapBoxId">
            <option value="">Manter atual</option>
            ${boxOptions.map((boxMon) => `<option value="${html(boxMon.id)}">${html(boxMon.nickname || boxMon.species)} - ${html(boxMon.species)}</option>`).join("")}
          </select>
        </label>
        <div class="overlay-box-swap-list">
          ${boxOptions.map((boxMon) => `
            <button type="button" data-overlay-swap-box="${html(boxMon.id)}">
              ${boxMon.spriteUrl ? `<img src="${html(boxMon.spriteUrl)}" alt="" />` : `<span class="mini-mon">${html(boxMon.species.slice(0, 2))}</span>`}
              <span><strong>${html(boxMon.nickname || boxMon.species)}</strong><small>${html(boxMon.species)}</small></span>
            </button>
          `).join("")}
        </div>
      ` : ""}
      <input name="species" type="hidden" value="${html(mon.species || "")}" />
      <input name="types" type="hidden" value="${html(mon.types || "")}" />
      <input name="ability" type="hidden" value="${html(mon.ability || "")}" />
      <input name="spriteUrl" type="hidden" value="${html(mon.spriteUrl || "")}" />
      <label class="overlay-zoom-field">
        <span>Zoom do sprite <strong data-overlay-zoom-label>${Math.round(Number(mon.layout?.zoom || 1) * 100)}%</strong></span>
        <input name="spriteZoom" type="range" min="0.6" max="2.8" step="0.05" value="${html(mon.layout?.zoom || 1)}" data-overlay-sprite-zoom />
      </label>
      <label>
        <span>Apelido</span>
        <input name="nickname" value="${html(mon.nickname || "")}" />
      </label>
      <label>
        <span>Status</span>
        <select name="status">
          <option value="team" ${mon.status === "team" ? "selected" : ""}>team</option>
          <option value="box" ${mon.status === "box" ? "selected" : ""}>box</option>
        </select>
      </label>
      <button type="submit">Salvar</button>
    </form>
  `;
}

function renderOverlayEditorIntoScene(run) {
  document.querySelector("#overlay-mon-editor")?.remove();
  const markup = renderOverlayEditor(run);
  if (!markup) return;
  document.querySelector(".streamer-scene")?.insertAdjacentHTML("beforeend", markup);
  const form = document.querySelector("#overlay-mon-editor");
  const mon = [...run.team, ...run.box].find((item) => item.id === overlayEditorMonId);
  if (form && mon) renderOverlayPokemonPreview(form, mon);
}

function refreshObsTeamOverlay(run) {
  const teamLayer = document.querySelector(".streamer-free-team");
  if (teamLayer) teamLayer.innerHTML = renderStreamerTeam(run);
  renderOverlayConfigPanelIntoScene(run);
  document.querySelector("#overlay-mon-editor")?.remove();
  hidePokemonTooltip();
  updateOverlaySelection(selectedOverlayMonId);
}

function resetOverlayTeamLayout(run) {
  run.team.slice(0, MAX_TEAM_SIZE).forEach((mon, index) => {
    mon.layout = {
      x: index < 3 ? 0 : 88,
      y: 12 + (index % 3) * 24,
      zoom: 1,
    };
  });
  selectedOverlayMonId = "";
  addTimelineEvent(run, "team", "Sprites reposicionados", "Layout do overlay OBS resetado.");
  commitRunChange(run, { refreshTeam: true });
}

function renderOverlayPokemonPreview(form, data, status = "") {
  const preview = form.querySelector("[data-overlay-pokemon-preview]");
  if (!preview) return;
  if (!data?.species) {
    preview.innerHTML = `<span>${html(status || "Busque um Pokemon para trocar.")}</span>`;
    preview.classList.remove("is-filled");
    return;
  }
  preview.innerHTML = `
    ${data.spriteUrl ? `<img src="${html(data.spriteUrl)}" alt="" />` : `<span class="mini-mon">${html(data.species.slice(0, 2))}</span>`}
    <div>
      <strong>${html(data.species)}</strong>
      <div class="type-row">${renderTypes(data.types)}</div>
      <span>${data.ability ? `Habilidade: ${html(data.ability)}` : "Habilidade nao informada"}</span>
    </div>
  `;
  preview.classList.add("is-filled");
}

function applyOverlayPokemonLookupData(form, data) {
  if (!form || !data) return;
  form.elements.species.value = data.species;
  form.elements.types.value = data.types;
  form.elements.ability.value = data.ability;
  form.elements.spriteUrl.value = data.spriteUrl;
  renderOverlayPokemonPreview(form, data);
}

function swapTeamPokemonWithBox(run, teamMon, boxMonId) {
  if (!teamMon || !boxMonId) return false;
  const teamIndex = run.team.findIndex((item) => item.id === teamMon.id);
  const boxIndex = run.box.findIndex((item) => item.id === boxMonId);
  if (teamIndex < 0 || boxIndex < 0) return false;
  const boxMon = run.box[boxIndex];
  const teamLayout = teamMon.layout ? { ...teamMon.layout } : null;
  teamMon.status = "box";
  boxMon.status = "team";
  boxMon.layout = teamLayout || boxMon.layout || { x: 4 + teamIndex * 16, y: 78, zoom: 1 };
  run.team[teamIndex] = boxMon;
  run.box[boxIndex] = teamMon;
  selectedOverlayMonId = boxMon.id;
  overlayEditorMonId = "";
  addTimelineEvent(run, "team", "Pokemon substituido", `${boxMon.nickname || boxMon.species} entrou no lugar de ${teamMon.nickname || teamMon.species}`);
  return true;
}

function updateOverlayPokemonCard(mon) {
  const node = document.querySelector(`[data-overlay-mon="${CSS.escape(mon.id)}"]`);
  if (!node) return;
  node.innerHTML = `
    <span class="streamer-mon-ground" aria-hidden="true"></span>
    ${mon.spriteUrl ? `<img src="${html(mon.spriteUrl)}" alt="" />` : `<span class="mon-placeholder">${html(mon.species.slice(0, 2))}</span>`}
    <div>
      <strong>${html(mon.nickname || mon.species)}</strong>
      <small>${html(mon.species)}</small>
    </div>
    <aside class="streamer-mon-tooltip">
      <strong>${html(mon.nickname || mon.species)}</strong>
      <span>Tipos: ${html(mon.types || "nao informado")}</span>
      <span>Fraquezas: ${getPokemonWeaknesses(mon).slice(0, 5).map(formatPokemonName).join(", ") || "nenhuma"}</span>
    </aside>
  `;
}

function getOverlayTooltip() {
  let tooltip = document.querySelector("#streamer-floating-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("aside");
    tooltip.id = "streamer-floating-tooltip";
    tooltip.className = "streamer-floating-tooltip";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function showPokemonTooltip(monId, event) {
  const run = getRun();
  const mon = [...run.team, ...run.box].find((item) => item.id === monId);
  if (!mon) return;
  const tooltip = getOverlayTooltip();
  tooltip.innerHTML = `
    <strong>${html(mon.nickname || mon.species)}</strong>
    <div class="tooltip-type-group">
      <span>Tipos</span>
      <div>${renderTypeChips(parseTypes(mon.types))}</div>
    </div>
    <div class="tooltip-type-group">
      <span>Fraquezas</span>
      <div>${renderTypeChips(getPokemonWeaknesses(mon).slice(0, 6))}</div>
    </div>
    <div class="tooltip-type-group">
      <span>Vantagens</span>
      <div>${renderTypeChips(getPokemonAdvantages(mon).slice(0, 6))}</div>
    </div>
  `;
  tooltip.hidden = false;
  positionPokemonTooltip(event);
}

function positionPokemonTooltip(event) {
  const tooltip = document.querySelector("#streamer-floating-tooltip");
  if (!tooltip || tooltip.hidden) return;
  const margin = 14;
  const offset = 18;
  const rect = tooltip.getBoundingClientRect();
  let left = event.clientX + offset;
  let top = event.clientY + offset;
  if (left + rect.width + margin > window.innerWidth) left = event.clientX - rect.width - offset;
  if (top + rect.height + margin > window.innerHeight) top = event.clientY - rect.height - offset;
  tooltip.style.left = `${Math.max(margin, left)}px`;
  tooltip.style.top = `${Math.max(margin, top)}px`;
}

function hidePokemonTooltip() {
  const tooltip = document.querySelector("#streamer-floating-tooltip");
  if (tooltip) tooltip.hidden = true;
}

function updateOverlaySelection(monId) {
  selectedOverlayMonId = monId;
  document.querySelectorAll("[data-overlay-mon]").forEach((node) => {
    node.classList.toggle("is-selected", node.dataset.overlayMon === monId);
  });
  renderSelectedMonControl(getRun());
}

function renderStreamerBadges(run) {
  return run.badges.map((badge, index) => {
    const type = String(badge.type || "").toLowerCase();
    const color = TYPE_COLORS[type] || "#78f39f";
    return `
      <button class="streamer-badge ${badge.defeated ? "is-done" : ""}" type="button" data-toggle-badge="${badge.id}" style="--badge-color:${color}" title="${html(badge.badgeName || badge.leader)}">
        <span>${TYPE_LABELS[type] || String(index + 1).padStart(2, "0")}</span>
      </button>
    `;
  }).join("");
}

function renderStreamerRoutes(run) {
  const routes = run.routes.length
    ? run.routes
    : run.encounters.map((encounter) => ({
        id: encounter.id,
        name: encounter.route || "Area",
        status: encounter.status || "captured",
        pokemon: encounter.species || "",
      }));
  if (!routes.length) return `<p>Nenhuma rota configurada.</p>`;
  return routes.map((route) => `
    <article class="${route.status === "captured" ? "is-captured" : ""}">
      <button type="button" data-route-toggle="${html(route.id)}">
        <span>${html(route.name || "Area")}</span>
        <strong>${html(route.pokemon || (route.status === "captured" ? "Capturado" : "Pendente"))}</strong>
        <small>${html(route.status || "pending")}</small>
      </button>
    </article>
  `).join("");
}

function renderStreamerTeam(run) {
  const slots = run.team.slice(0, MAX_TEAM_SIZE);
  while (slots.length < MAX_TEAM_SIZE) slots.push(null);
  return slots.map((mon, index) => {
    if (!mon) {
      return "";
    }
    const weaknesses = getPokemonWeaknesses(mon).slice(0, 5);
    return `
      <article
        class="streamer-mon ${selectedOverlayMonId === mon.id ? "is-selected" : ""}"
        data-overlay-mon="${mon.id}"
        style="--mon-x:${mon.layout?.x ?? 4}%; --mon-y:${mon.layout?.y ?? 78}%; --mon-zoom:${mon.layout?.zoom ?? 1};"
      >
        <span class="streamer-mon-ground" aria-hidden="true"></span>
        ${mon.spriteUrl ? `<img src="${html(mon.spriteUrl)}" alt="" />` : `<span class="mon-placeholder">${html(mon.species.slice(0, 2))}</span>`}
        <div>
          <strong>${html(mon.nickname || mon.species)}</strong>
          <small>${html(mon.species)}</small>
        </div>
        <aside class="streamer-mon-tooltip">
          <strong>${html(mon.nickname || mon.species)}</strong>
          <span>Tipos: ${html(mon.types || "nao informado")}</span>
          <span>Fraquezas: ${weaknesses.length ? weaknesses.map(formatPokemonName).join(", ") : "nenhuma"}</span>
        </aside>
      </article>
    `;
  }).join("");
}

function getPokemonWeaknesses(mon) {
  const defenderTypes = parseTypes(mon.types);
  return Object.keys(TYPE_COLORS).filter((attackType) => getAttackMultiplier(attackType, defenderTypes) >= 2);
}

function getPokemonAdvantages(mon) {
  const attackTypes = parseTypes(mon.types);
  const advantages = new Set();
  attackTypes.forEach((attackType) => {
    Object.entries(TYPE_EFFECTIVENESS[attackType] || {}).forEach(([defenderType, multiplier]) => {
      if (multiplier > 1) advantages.add(defenderType);
    });
  });
  return Array.from(advantages);
}

function renderTypeChips(types = []) {
  const normalized = Array.isArray(types) ? types : parseTypes(types);
  if (!normalized.length) return `<span class="type-chip is-empty">Nenhum</span>`;
  return normalized.map((type) => {
    const key = String(type).toLowerCase();
    return `<span class="type-chip" style="--type-color:${TYPE_COLORS[key] || "#78f39f"}">${html(formatPokemonName(key))}</span>`;
  }).join("");
}

function table(items, headers, mapper) {
  if (!items.length) return `<p class="empty-state">Nada registrado ainda.</p>`;
  return `<table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${
    items.map((item) => `<tr>${mapper(item).map((value) => `<td>${html(value)}</td>`).join("")}</tr>`).join("")
  }</tbody></table>`;
}

function openDialog(mode, id = "") {
  dialogMode = mode;
  editId = id;
  el.deleteCurrent.hidden = mode !== "run" || !id;
  el.dialogTitle.textContent = ({ run: id ? "Editar run" : "Nova run", team: id ? "Editar Pokemon" : "Adicionar Pokemon", encounter: "Registrar encontro", death: "Registrar morte", badge: "Adicionar badge", note: "Nova nota" })[mode] || "Editar";
  el.formFields.innerHTML = getFields(mode, id);
  if (mode === "team" && id) {
    const run = getRun();
    const mon = [...run.team, ...run.box].find((item) => item.id === id);
    if (mon?.species) renderPokemonLookupPreview(mon);
  }
  el.dialog.showModal();
}

function getFields(mode, id) {
  const run = getRun();
  const mon = [...run.team, ...run.box].find((item) => item.id === id) || {};
  if (mode === "run") {
    const target = id ? run : { name: "", gameTitle: "Pokemon Emerald", romHackName: "", mode: "Nuzlocke", template: "emerald" };
    return `${select("template", "Template", target.template || "custom", Object.entries(RUN_TEMPLATES).map(([key, item]) => [key, item.label]))}${select("romId", "ROM local vinculada", target.romId || "", [["", availableRoms.length ? "Nenhuma" : "Nenhuma ROM local encontrada"], ...availableRoms.map((rom) => [rom.id, `${rom.title} (${rom.system})`])])}${field("name", "Nome da run", target.name)}${field("gameTitle", "Jogo base", target.gameTitle)}${field("romHackName", "Hackrom/fangame", target.romHackName)}${select("mode", "Modo", target.mode, ["Normal", "Nuzlocke", "Hardcore", "Hackrom"])}`;
  }
  if (mode === "team") return `
    <label class="lookup-field full-field">
      <span>Buscar Pokemon</span>
      <div class="lookup-row">
        <input name="pokemonLookup" type="search" value="${html(mon.species || "")}" placeholder="Ex: mudkip, pikachu, charizard" autocomplete="off" />
        <button type="button" id="fetch-pokemon">Buscar</button>
      </div>
      <div class="pokemon-suggestions" id="pokemon-suggestions" hidden></div>
    </label>
    <div class="pokemon-lookup-preview full-field" id="pokemon-lookup-preview">
      <span>${mon.species ? "Dados carregados desta run." : "Busque um Pokemon para preencher sprite, tipo e habilidade."}</span>
    </div>
    <input name="species" type="hidden" value="${html(mon.species || "")}" />
    <input name="types" type="hidden" value="${html(mon.types || "")}" />
    <input name="ability" type="hidden" value="${html(mon.ability || "")}" />
    <input name="spriteUrl" type="hidden" value="${html(mon.spriteUrl || "")}" />
    ${field("nickname", "Apelido", mon.nickname || "")}
    ${select("status", "Status", mon.status || (run.team.length >= MAX_TEAM_SIZE ? "box" : "team"), ["team", "box"])}
  `;
  if (mode === "encounter") return `${field("route", "Rota/area", "")}${field("species", "Pokemon", "")}${field("level", "Nivel", "", "number")}${select("status", "Status", "captured", ["captured", "failed", "skipped", "dead", "dupes", "shiny"])}${field("notes", "Notas", "")}`;
  if (mode === "death") return `${select("pokemonId", "Pokemon", run.team[0]?.id || "", run.team.map((item) => [item.id, item.nickname || item.species]))}${field("level", "Nivel da morte", "", "number")}${field("cause", "Causa", "")}`;
  if (mode === "badge") return `${field("leader", "Lider", "")}${field("badgeName", "Badge", "")}${field("type", "Tipo", "")}${field("levelCap", "Level cap", "", "number")}${field("notes", "Notas", "")}`;
  return `${field("title", "Titulo", "")}<label class="full-field"><span>Nota</span><textarea name="text" rows="5" required></textarea></label>`;
}

function field(name, label, value, type = "text") {
  return `<label><span>${label}</span><input name="${name}" type="${type}" value="${html(value)}" ${name === "name" || name === "species" ? "required" : ""} /></label>`;
}

function select(name, label, value, options) {
  const normalized = options.map((option) => Array.isArray(option) ? option : [option, option]);
  return `<label><span>${label}</span><select name="${name}">${normalized.map(([optionValue, text]) =>
    `<option value="${html(optionValue)}" ${optionValue === value ? "selected" : ""}>${html(text)}</option>`
  ).join("")}</select></label>`;
}

function formData() {
  return Object.fromEntries(new FormData(el.form).entries());
}

function removePokemon(run, id) {
  run.team = run.team.filter((item) => item.id !== id);
  run.box = run.box.filter((item) => item.id !== id);
}

el.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formData();
  const run = getRun();
  if (dialogMode === "run") {
    const target = editId ? run : createRun(data);
    const template = RUN_TEMPLATES[data.template] || RUN_TEMPLATES.custom;
    const previousRomId = target.romId || "";
    const selectedRom = availableRoms.find((rom) => rom.id === data.romId);
    Object.assign(target, data);
    target.romRoute = selectedRom?.route || "";
    if (!editId) {
      target.badges = template.badges.map(([leader, badgeName, type, levelCap]) => ({
        id: uid("badge"), leader, badgeName, type, levelCap, defeated: false, notes: "",
      }));
      addTimelineEvent(target, "run", "Run criada", `${target.romHackName || target.gameTitle} - ${target.mode}`);
    } else {
      addTimelineEvent(target, "run", "Run editada", `${target.romHackName || target.gameTitle} - ${target.mode}`);
    }
    if (target.romId && target.romId !== previousRomId) {
      addTimelineEvent(target, "rom", "ROM vinculada", selectedRom ? `${selectedRom.title} - ${selectedRom.source}` : target.romId);
    }
    upsertRun(target);
  }
  if (dialogMode === "team") {
    if (!data.species && data.pokemonLookup) {
      try {
        const pokemon = await fetchPokemonFromApi(data.pokemonLookup);
        Object.assign(data, pokemon);
      } catch (error) {
        renderPokemonLookupPreview(null, error.message);
        return;
      }
    }
    if (!data.species) {
      renderPokemonLookupPreview(null, "Busque ou informe um Pokemon antes de salvar.");
      return;
    }
    const mon = { id: editId || uid("mon"), ...data, level: Number(data.level || 0) };
    removePokemon(run, mon.id);
    if (mon.status === "box" || run.team.length >= MAX_TEAM_SIZE) {
      mon.status = "box"; run.box.push(mon);
    } else {
      mon.status = "team"; run.team.push(mon);
    }
    addTimelineEvent(run, "team", editId ? "Pokemon editado" : "Pokemon adicionado", `${mon.nickname || mon.species}${mon.level ? ` - Lv. ${mon.level}` : ""} - ${mon.status === "box" ? "Box" : "Time"}`);
    commitRunChange(run, { refreshTeam: true });
  }
  if (dialogMode === "encounter") {
    run.encounters.push({ id: uid("encounter"), ...data, level: Number(data.level || 0) });
    addTimelineEvent(run, "encounter", "Encontro registrado", `${data.route || "Area"} - ${data.species || "Pokemon"} - ${data.status}`);
    commitRunChange(run);
  }
  if (dialogMode === "death") {
    const mon = run.team.find((item) => item.id === data.pokemonId);
    if (mon) {
      removePokemon(run, mon.id);
      run.graveyard.push({ ...mon, level: Number(data.level || mon.level), cause: data.cause, diedAt: new Date().toISOString() });
      addTimelineEvent(run, "death", "Morte registrada", `${mon.nickname || mon.species} - Lv. ${data.level || mon.level}${data.cause ? ` - ${data.cause}` : ""}`);
      commitRunChange(run, { refreshTeam: true });
    }
  }
  if (dialogMode === "badge") {
    run.badges.push({ id: uid("badge"), ...data, levelCap: Number(data.levelCap || 0), defeated: false });
    addTimelineEvent(run, "badge", "Badge adicionada", `${data.badgeName || data.leader}${data.levelCap ? ` - cap Lv. ${data.levelCap}` : ""}`);
    commitRunChange(run);
  }
  if (dialogMode === "note") {
    run.notes.push({ id: uid("note"), ...data, createdAt: new Date().toISOString() });
    addTimelineEvent(run, "note", data.title || "Nota adicionada", data.text);
    commitRunChange(run);
  }
  el.dialog.close();
});

el.form.addEventListener("change", (event) => {
  if (event.target.name !== "template" || dialogMode !== "run" || editId) return;
  const template = RUN_TEMPLATES[event.target.value] || RUN_TEMPLATES.custom;
  const nameInput = el.form.elements.name;
  if (nameInput && !nameInput.value.trim()) nameInput.value = template.label;
  if (el.form.elements.gameTitle) el.form.elements.gameTitle.value = template.gameTitle;
  if (el.form.elements.romHackName) el.form.elements.romHackName.value = template.romHackName;
  if (el.form.elements.mode) el.form.elements.mode.value = template.mode;
});

el.form.addEventListener("change", (event) => {
  if (event.target.name !== "romId" || dialogMode !== "run") return;
  const selectedRom = availableRoms.find((rom) => rom.id === event.target.value);
  if (!selectedRom) return;
  if (el.form.elements.gameTitle) el.form.elements.gameTitle.value = selectedRom.title;
  if (el.form.elements.name && !el.form.elements.name.value.trim()) {
    el.form.elements.name.value = `${selectedRom.title} Challenge`;
  }
});

el.form.addEventListener("input", (event) => {
  if (event.target.name !== "pokemonLookup" || dialogMode !== "team") return;
  schedulePokemonSuggestions(event.target.value);
});

if (el.spriteZoom) {
  el.spriteZoom.addEventListener("input", (event) => {
    const run = getRun();
    const value = Number(event.target.value || 1);
    run.settings.spriteZoom = value;
    document.documentElement.style.setProperty("--challenge-sprite-zoom", String(value));
    el.spriteZoomLabel.textContent = `${Math.round(value * 100)}%`;
    saveRuns();
  });
}

document.addEventListener("input", (event) => {
  if (event.target.dataset.overlaySpriteZoom !== undefined) {
    const form = event.target.closest("#overlay-mon-editor");
    const run = getRun();
    const mon = [...run.team, ...run.box].find((item) => item.id === form?.dataset.overlayEditor);
    if (!mon) return;
    const zoom = Number(event.target.value || 1);
    mon.layout ||= {};
    mon.layout.zoom = zoom;
    form.querySelector("[data-overlay-zoom-label]").textContent = `${Math.round(zoom * 100)}%`;
    document.querySelector(`[data-overlay-mon="${CSS.escape(mon.id)}"]`)?.style.setProperty("--mon-zoom", String(zoom));
    saveRuns();
    return;
  }
  if (event.target.id !== "selected-mon-zoom") return;
  const run = getRun();
  const mon = run.team.find((item) => item.id === selectedOverlayMonId);
  if (!mon) return;
  mon.layout ||= {};
  mon.layout.zoom = Number(event.target.value || 1);
  const node = document.querySelector(`[data-overlay-mon="${CSS.escape(mon.id)}"]`);
  node?.style.setProperty("--mon-zoom", String(mon.layout.zoom));
  saveRuns();
});

document.addEventListener("click", (event) => {
  if (!isObsMode) return;
  const oakBitPokedex = event.target.closest?.("[data-oakbit-action='pokedex']");
  if (oakBitPokedex) {
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleOverlayPokedex();
    return;
  }

  const oakBitFullscreen = event.target.closest?.("[data-oakbit-action='fullscreen']");
  if (!oakBitFullscreen) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  toggleObsFullscreen();
}, true);

document.addEventListener("click", (event) => {
  const oakBitTutorial = event.target.closest?.("[data-oakbit-action='tutorial']");
  if (!oakBitTutorial || !document.body.classList.contains("challenge-page")) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  startOakChallengeTour();
}, true);

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;
  const run = getRun();
  if (target.dataset.oakChallengeTour) {
    const action = target.dataset.oakChallengeTour;
    if (action === "close") closeOakChallengeTour();
    if (action === "next") {
      oakChallengeTourIndex += 1;
      renderOakChallengeTourStep();
    }
    if (action === "prev") {
      oakChallengeTourIndex = Math.max(0, oakChallengeTourIndex - 1);
      renderOakChallengeTourStep();
    }
    return;
  }
  if (target.dataset.toggleRoutes !== undefined) {
    const panel = document.querySelector("#streamer-route-panel");
    if (panel) panel.hidden = !panel.hidden;
  }
  if (target.dataset.toggleRunMenu !== undefined) {
    const panel = document.querySelector("#streamer-config-panel");
    if (panel) panel.hidden = !panel.hidden;
  }
  if (target.dataset.toggleOverlayPokedex !== undefined) {
    event.preventDefault();
    toggleOverlayPokedex();
  }
  if (target.dataset.resetOverlayLayout !== undefined) {
    resetOverlayTeamLayout(run);
  }
  if (target.dataset.toggleOverlayFullscreen !== undefined) {
    event.preventDefault();
    toggleObsFullscreen();
  }
  if (target.dataset.closeOverlayEditor !== undefined) {
    overlayEditorMonId = "";
    document.querySelector("#overlay-mon-editor")?.remove();
  }
  if (target.id === "detect-routes") {
    detectRoutesForRun(run);
  }
  if (target.dataset.routeToggle) {
    const route = run.routes.find((item) => item.id === target.dataset.routeToggle);
    if (route) {
      route.status = route.status === "captured" ? "pending" : "captured";
      if (isObsMode) {
        saveRuns();
        renderOverlayConfigPanelIntoScene(run);
      } else {
        upsertRun(run);
      }
    }
  }
  const monTarget = event.target.closest("[data-overlay-mon]");
  if (monTarget?.dataset.overlayMon) {
    updateOverlaySelection(monTarget.dataset.overlayMon);
  }
  if (target.dataset.overlayFetchPokemon !== undefined) {
    const form = target.closest("#overlay-mon-editor");
    const query = form?.elements.pokemonLookup?.value;
    renderOverlayPokemonPreview(form, null, "Buscando na PokeAPI...");
    fetchPokemonFromApi(query)
      .then((data) => applyOverlayPokemonLookupData(form, data))
      .catch((error) => renderOverlayPokemonPreview(form, null, error.message));
  }
  if (target.dataset.overlaySwapBox) {
    const form = target.closest("#overlay-mon-editor");
    if (form?.elements.swapBoxId) form.elements.swapBoxId.value = target.dataset.overlaySwapBox;
    form?.querySelectorAll("[data-overlay-swap-box]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.overlaySwapBox === target.dataset.overlaySwapBox);
    });
  }
  if (target.id === "open-linked-rom" && !getLinkedRom(run)) {
    event.preventDefault();
    openDialog("run", run.id);
  }
  if (target.id === "open-linked-rom" && getLinkedRom(run)) {
    event.preventDefault();
    activateTab("play");
    loadLinkedRomFrame(run);
  }
  if (target.id === "load-linked-rom") {
    loadLinkedRomFrame(run);
  }
  if (target.dataset.runId) { activeRunId = target.dataset.runId; saveRuns(); render(); }
  if (target.id === "new-run") openDialog("run");
  if (target.id === "edit-run") openDialog("run", run.id);
  if (target.id === "fetch-pokemon") {
    const query = el.form.elements.pokemonLookup?.value;
    renderPokemonLookupPreview(null, "Buscando na PokeAPI...");
    fetchPokemonFromApi(query)
      .then(applyPokemonLookupData)
      .catch((error) => renderPokemonLookupPreview(null, error.message));
  }
  if (target.dataset.pokemonSuggestion) {
    el.form.elements.pokemonLookup.value = formatPokemonName(target.dataset.pokemonSuggestion);
    renderPokemonSuggestions([]);
    renderPokemonLookupPreview(null, "Carregando Pokemon...");
    fetchPokemonFromApi(target.dataset.pokemonSuggestion)
      .then(applyPokemonLookupData)
      .catch((error) => renderPokemonLookupPreview(null, error.message));
  }
  if (target.dataset.openForm) openDialog(target.dataset.openForm);
  if (target.dataset.editMon) openDialog("team", target.dataset.editMon);
  if (target.dataset.killMon) openDialog("death");
  if (target.dataset.moveMon) {
    const mon = [...run.team, ...run.box].find((item) => item.id === target.dataset.moveMon);
    if (mon) {
      removePokemon(run, mon.id);
      if (mon.status === "box" && run.team.length < MAX_TEAM_SIZE) { mon.status = "team"; run.team.push(mon); }
      else { mon.status = "box"; run.box.push(mon); }
      addTimelineEvent(run, "team", "Pokemon movido", `${mon.nickname || mon.species} foi para ${mon.status === "box" ? "Box" : "Time"}`);
      commitRunChange(run, { refreshTeam: true });
    }
  }
  if (target.dataset.toggleBadge) {
    const badge = run.badges.find((item) => item.id === target.dataset.toggleBadge);
    if (badge) {
      badge.defeated = !badge.defeated;
      addTimelineEvent(run, "badge", badge.defeated ? "Badge vencida" : "Badge reaberta", `${badge.badgeName || badge.leader}${badge.levelCap ? ` - cap Lv. ${badge.levelCap}` : ""}`);
      if (isObsMode) {
        saveRuns();
        renderOverlayConfigPanelIntoScene(run);
      } else {
        upsertRun(run);
      }
    }
  }
  if (target.dataset.rule) { run.rules[target.dataset.rule] = !run.rules[target.dataset.rule]; commitRunChange(run); }
  if (target.dataset.tab) {
    activateTab(target.dataset.tab);
  }
  if (target.id === "close-dialog" || target.id === "cancel-dialog") el.dialog.close();
  if (target.id === "delete-current" && run && confirm("Excluir esta run?")) {
    runs = runs.filter((item) => item.id !== run.id);
    activeRunId = runs[0]?.id || "";
    saveRuns();
    el.dialog.close();
    render();
  }
  if (target.id === "clear-timeline" && run && confirm("Limpar a linha do tempo desta run?")) {
    run.timeline = [];
    commitRunChange(run);
  }
  if (target.id === "export-run") exportRun();
  if (target.id === "import-run") el.importInput.click();
  if (target.id === "reset-selected-mon") {
    const mon = run.team.find((item) => item.id === selectedOverlayMonId);
    if (mon) {
      const index = run.team.indexOf(mon);
      mon.layout = { x: 4 + index * 16, y: 78, zoom: 1 };
      commitRunChange(run, { refreshTeam: true });
    }
  }
});

document.addEventListener("pointerdown", (event) => {
  const monNode = event.target.closest("[data-overlay-mon]");
  if (!monNode) return;
  const scene = document.querySelector(".streamer-scene");
  const run = getRun();
  const mon = run.team.find((item) => item.id === monNode.dataset.overlayMon);
  if (!scene || !mon) return;
  selectedOverlayMonId = mon.id;
  const rect = scene.getBoundingClientRect();
  dragState = {
    monId: mon.id,
    rect,
    offsetX: event.clientX - monNode.getBoundingClientRect().left,
    offsetY: event.clientY - monNode.getBoundingClientRect().top,
  };
  monNode.setPointerCapture?.(event.pointerId);
  renderSelectedMonControl(run);
});

document.addEventListener("pointermove", (event) => {
  const hoverMon = event.target.closest("[data-overlay-mon]");
  if (hoverMon?.dataset.overlayMon && !dragState) {
    showPokemonTooltip(hoverMon.dataset.overlayMon, event);
  } else if (!event.target.closest(".streamer-floating-tooltip")) {
    hidePokemonTooltip();
  }
  if (!dragState) return;
  const run = getRun();
  const mon = run.team.find((item) => item.id === dragState.monId);
  if (!mon) return;
  const x = ((event.clientX - dragState.rect.left - dragState.offsetX) / dragState.rect.width) * 100;
  const y = ((event.clientY - dragState.rect.top - dragState.offsetY) / dragState.rect.height) * 100;
  mon.layout ||= {};
  mon.layout.x = Math.max(0, Math.min(88, x));
  mon.layout.y = Math.max(0, Math.min(88, y));
  document.querySelector(`[data-overlay-mon="${CSS.escape(mon.id)}"]`)?.style.setProperty("--mon-x", `${mon.layout.x}%`);
  document.querySelector(`[data-overlay-mon="${CSS.escape(mon.id)}"]`)?.style.setProperty("--mon-y", `${mon.layout.y}%`);
});

document.addEventListener("pointerleave", (event) => {
  if (event.target.closest?.("[data-overlay-mon]")) hidePokemonTooltip();
}, true);

document.addEventListener("pointerup", () => {
  if (!dragState) return;
  dragState = null;
  saveRuns();
});

document.addEventListener("fullscreenchange", () => {
  if (isObsMode) syncObsFullscreenState();
});

document.addEventListener("keydown", (event) => {
  if (!isObsMode) return;
  const target = event.target;
  const isTyping =
    target instanceof HTMLElement &&
    (target.matches("input, textarea, select") || target.isContentEditable);
  if (isTyping) return;
  if (event.key.toLowerCase() !== "p") return;
  event.preventDefault();
  toggleOverlayPokedex();
});

window.addEventListener("message", (event) => {
  if (!isObsMode || event.origin !== window.location.origin) return;
  const payload = event.data || {};
  if (payload.source !== "oakrom-pokedex") return;
  if (payload.eventName === "pokedex-narrate-lore") {
    window.OakMascot?.say?.(`Narrando ${payload.detail?.pokemon || "lore"}.`, "happy", 1800, "action");
    speakOverlayNarration(payload.detail?.text);
  }
});

window.addEventListener("resize", () => {
  if (!oakChallengeTourActive) return;
  positionOakChallengeTour(OAK_CHALLENGE_TOUR_STEPS[oakChallengeTourIndex]);
});

document.addEventListener("dblclick", (event) => {
  const monNode = event.target.closest("[data-overlay-mon]");
  if (!monNode?.dataset.overlayMon) return;
  overlayEditorMonId = monNode.dataset.overlayMon;
  renderOverlayEditorIntoScene(getRun());
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("#overlay-mon-editor");
  if (!form) return;
  event.preventDefault();
  const run = getRun();
  const mon = [...run.team, ...run.box].find((item) => item.id === form.dataset.overlayEditor);
  if (!mon) return;
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.swapBoxId && mon.status === "team") {
    if (swapTeamPokemonWithBox(run, mon, data.swapBoxId)) {
      commitRunChange(run, { refreshTeam: true });
    }
    return;
  }
  if (!data.species && data.pokemonLookup) {
    try {
      Object.assign(data, await fetchPokemonFromApi(data.pokemonLookup));
    } catch (error) {
      renderOverlayPokemonPreview(form, null, error.message);
      return;
    }
  }
  const statusChanged = Boolean(data.status && data.status !== mon.status);
  mon.nickname = data.nickname || "";
  mon.species = data.species || mon.species;
  mon.types = data.types || mon.types;
  mon.ability = data.ability || mon.ability;
  mon.spriteUrl = data.spriteUrl || mon.spriteUrl;
  mon.layout ||= {};
  mon.layout.zoom = Number(data.spriteZoom || mon.layout.zoom || 1);
  if (statusChanged) {
    removePokemon(run, mon.id);
    mon.status = data.status;
    if (mon.status === "team" && run.team.length < MAX_TEAM_SIZE) run.team.push(mon);
    else {
      mon.status = "box";
      run.box.push(mon);
    }
  }
  overlayEditorMonId = "";
  if (isObsMode) {
    commitRunChange(run, { refreshTeam: statusChanged });
    if (!statusChanged) {
      updateOverlayPokemonCard(mon);
      document.querySelector("#overlay-mon-editor")?.remove();
    }
  } else {
    upsertRun(run);
  }
});

function exportRun() {
  const run = getRun();
  const blob = new Blob([JSON.stringify(run, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${run.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-oak-challenge.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

el.importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    imported.id = uid("run");
    imported.updatedAt = new Date().toISOString();
    upsertRun(imported);
  } catch {
    alert("Nao foi possivel importar este JSON.");
  } finally {
    event.target.value = "";
  }
});

if (el.challengeRomInput) {
  el.challengeRomInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const run = getRun();
    try {
      const record = await saveLocalRom(file);
      await refreshAvailableRoms();
      run.romId = record.id;
      run.romRoute = "";
      run.gameTitle = record.title || run.gameTitle;
      addTimelineEvent(run, "rom", "ROM adicionada ao Oak Challenge", record.title || file.name);
      upsertRun(run);
      activateTab("play");
      await bootChallengeEmulator(
        run,
        { id: record.id, title: record.title || record.name || file.name, isLocal: true },
        "#challenge-emulator-player",
        { romRecord: record },
      );
      showChallengeEmulatorLoading(false);
    } catch (error) {
      showChallengeEmulatorError(error.message || "Nao foi possivel adicionar esta ROM.");
    } finally {
      event.target.value = "";
    }
  });
}

refreshAvailableRoms().finally(render);
