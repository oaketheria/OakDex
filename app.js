const API_BASE = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 12;
const ALL_POKEMON_LIMIT = 2000;
const DEFAULT_THEME = {
  primary: "#4cc4ff",
  secondary: "#74cb48",
};

const elements = {
  appShell: document.querySelector(".app-shell"),
  spotlight: document.querySelector("#pokemon-spotlight"),
  detailCard: document.querySelector("#detail-card"),
  summary: document.querySelector("#results-summary"),
  topSearchInput: document.querySelector("#top-search-input"),
  voiceSearchButton: document.querySelector("#voice-search-button"),
  typeSelect: document.querySelector("#type-select"),
  shuffleButton: document.querySelector("#shuffle-button"),
  cryButton: document.querySelector("#cry-button"),
  hudTabs: [...document.querySelectorAll(".hud-tab")],
  spotlightTemplate: document.querySelector("#pokemon-spotlight-template"),
};

const SpeechRecognitionApi =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

let voiceRecognition = null;

const state = {
  allPokemon: [],
  filteredPokemon: [],
  selectedPokemonId: null,
  selectedPokemonDetails: null,
  activeTab: "dados",
};

const pokemonDetailsCache = new Map();
const typeDetailsCache = new Map();
const typePokemonIdsCache = new Map();
const speciesDetailsCache = new Map();
const evolutionChainCache = new Map();
const translationCache = new Map();
const audioNarrationCache = new Map();
let currentCryAudio = null;
let currentNarrationAudio = null;

const typeColors = {
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

async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Falha de rede ao acessar ${url}`);
  }

  if (!response.ok) {
    throw new Error(`Falha ao carregar ${url}`);
  }

  return response.json();
}

function extractPokemonId(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

async function fetchPokemonDetails(idOrName) {
  const cacheKey = String(idOrName).toLowerCase();

  if (!pokemonDetailsCache.has(cacheKey)) {
    pokemonDetailsCache.set(cacheKey, fetchJson(`${API_BASE}/pokemon/${cacheKey}`));
  }

  const pokemon = await pokemonDetailsCache.get(cacheKey);
  pokemonDetailsCache.set(String(pokemon.id), Promise.resolve(pokemon));
  pokemonDetailsCache.set(pokemon.name.toLowerCase(), Promise.resolve(pokemon));
  return pokemon;
}

async function fetchTypeDetails(url) {
  if (!typeDetailsCache.has(url)) {
    typeDetailsCache.set(url, fetchJson(url));
  }

  return typeDetailsCache.get(url);
}

async function fetchTypePokemonIds(typeName) {
  if (!typePokemonIdsCache.has(typeName)) {
    typePokemonIdsCache.set(
      typeName,
      fetchJson(`${API_BASE}/type/${typeName}`).then((typeData) => {
        return new Set(
          typeData.pokemon.map(({ pokemon }) => extractPokemonId(pokemon.url)).filter(Boolean),
        );
      }),
    );
  }

  return typePokemonIdsCache.get(typeName);
}

async function fetchSpeciesDetails(url) {
  if (!speciesDetailsCache.has(url)) {
    speciesDetailsCache.set(url, fetchJson(url));
  }

  return speciesDetailsCache.get(url);
}

async function fetchEvolutionChain(url) {
  if (!evolutionChainCache.has(url)) {
    evolutionChainCache.set(url, fetchJson(url));
  }

  return evolutionChainCache.get(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPokemonNumber(id) {
  return `#${String(id).padStart(4, "0")}`;
}

function formatStatName(name) {
  return name.replace(/-/g, " ");
}

function formatLabel(value) {
  return value.replace(/-/g, " ");
}

function getTypeBadgeStyle(typeName, variant = "solid") {
  const color = typeColors[typeName] ?? DEFAULT_THEME.primary;
  const safeColor = escapeHtml(color);

  if (variant === "soft") {
    return `background: color-mix(in srgb, ${safeColor} 24%, #0f2030 76%); border-color: color-mix(in srgb, ${safeColor} 55%, #ffffff 10%); color: #f6fbff;`;
  }

  return `background-color:${safeColor};`;
}

function getArtwork(pokemon, shiny = false) {
  if (shiny) {
    return (
      pokemon.sprites.other["official-artwork"].front_shiny ||
      pokemon.sprites.front_shiny ||
      pokemon.sprites.other.home?.front_shiny ||
      getArtwork(pokemon, false)
    );
  }

  return (
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.home?.front_default ||
    pokemon.sprites.front_default
  );
}

function getCryUrl(pokemon) {
  return pokemon.cries?.latest || pokemon.cries?.legacy || "";
}

function renderHudTabs() {
  elements.hudTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === state.activeTab);
  });
}

function setVoiceButtonState(isListening, supported = true) {
  if (!elements.voiceSearchButton) {
    return;
  }

  elements.voiceSearchButton.classList.toggle("is-listening", isListening);
  elements.voiceSearchButton.disabled = !supported;
  elements.voiceSearchButton.textContent = supported
    ? (isListening ? "Ouvindo" : "Voz")
    : "Sem voz";
}

function setThemeFromPokemon(pokemon) {
  const primaryType = pokemon.types[0]?.type.name;
  const secondaryType = pokemon.types[1]?.type.name ?? primaryType;
  const primary = typeColors[primaryType] ?? DEFAULT_THEME.primary;
  const secondary = typeColors[secondaryType] ?? DEFAULT_THEME.secondary;

  document.documentElement.style.setProperty("--theme-primary", primary);
  document.documentElement.style.setProperty("--theme-secondary", secondary);
}

function triggerScanEffect() {
  [elements.spotlight, elements.detailCard].forEach((element) => {
    if (!element) {
      return;
    }

    element.classList.remove("is-scanning");
    void element.offsetWidth;
    element.classList.add("is-scanning");
    window.setTimeout(() => {
      element.classList.remove("is-scanning");
    }, 720);
  });
}

function playPokemonCry(pokemon) {
  const cryUrl = getCryUrl(pokemon);

  if (!cryUrl) {
    return;
  }

  if (currentCryAudio) {
    currentCryAudio.pause();
    currentCryAudio.currentTime = 0;
  }

  currentCryAudio = new Audio(cryUrl);
  currentCryAudio.volume = 0.7;
  currentCryAudio.play().catch(() => {});
}

function renderEmptyState(message) {
  elements.spotlight.innerHTML = `<div class="empty-state">${message}</div>`;
}

function getEnglishFlavorText(speciesDetails) {
  return (
    speciesDetails.flavor_text_entries.find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f|\n|\r/g, " ") ?? "Sem registro adicional para este Pokemon."
  );
}

function sanitizeFlavorText(text) {
  return String(text ?? "")
    .replace(/[\f\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getNarrationCacheKey(pokemonName, englishText) {
  return `${String(pokemonName ?? "").toLowerCase()}::${sanitizeFlavorText(englishText)}`;
}

async function translateTextToPortuguese(text) {
  const cleanedText = sanitizeFlavorText(text);

  if (!cleanedText) {
    return "";
  }

  if (!translationCache.has(cleanedText)) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanedText)}&langpair=en|pt-BR`;
    translationCache.set(
      cleanedText,
      fetchJson(url)
        .then((payload) => {
          const translated =
            payload.responseData?.translatedText ||
            payload.matches?.find((entry) => entry.translation)?.translation ||
            cleanedText;

          return sanitizeFlavorText(translated);
        })
        .catch(() => cleanedText),
    );
  }

  return translationCache.get(cleanedText);
}

function setNarrationButtonState(status, label = "") {
  const narrationButton = elements.detailCard.querySelector("[data-narrate-button]");

  if (!narrationButton) {
    return;
  }

  narrationButton.classList.remove("is-loading", "is-playing");
  narrationButton.removeAttribute("aria-busy");
  narrationButton.disabled = false;

  if (status === "loading") {
    narrationButton.classList.add("is-loading");
    narrationButton.setAttribute("aria-busy", "true");
    narrationButton.disabled = true;
  }

  if (status === "playing") {
    narrationButton.classList.add("is-playing");
  }

  narrationButton.querySelector(".narration-button-text").textContent = label || "Narrar lore";
}

function stopCurrentNarration() {
  if (!currentNarrationAudio) {
    return;
  }

  currentNarrationAudio.pause();
  currentNarrationAudio.currentTime = 0;
  currentNarrationAudio = null;
  setNarrationButtonState("idle");
}

async function requestNarrationAudio(text) {
  const response = await fetch("/api/narrate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || payload.details || "Falha ao gerar a narracao.");
  }

  return response.blob();
}

async function handleLoreNarration(pokemonName, englishFlavorText) {
  const cacheKey = getNarrationCacheKey(pokemonName, englishFlavorText);
  const narrationButton = elements.detailCard.querySelector("[data-narrate-button]");

  if (!narrationButton) {
    return;
  }

  if (currentNarrationAudio && currentNarrationAudio.dataset.cacheKey === cacheKey) {
    if (currentNarrationAudio.paused) {
      currentNarrationAudio.play().catch(() => {});
      setNarrationButtonState("playing", "Tocando");
    } else {
      stopCurrentNarration();
    }
    return;
  }

  stopCurrentNarration();
  setNarrationButtonState("loading", "Gerando audio...");

  try {
    const translatedText = await translateTextToPortuguese(englishFlavorText);
    let audioUrl = audioNarrationCache.get(cacheKey);

    if (!audioUrl) {
      const audioBlob = await requestNarrationAudio(translatedText);
      audioUrl = URL.createObjectURL(audioBlob);
      audioNarrationCache.set(cacheKey, audioUrl);
    }

    const audio = new Audio(audioUrl);
    audio.dataset.cacheKey = cacheKey;
    currentNarrationAudio = audio;

    audio.addEventListener("play", () => {
      setNarrationButtonState("playing", "Tocando");
    });

    audio.addEventListener("ended", () => {
      if (currentNarrationAudio === audio) {
        currentNarrationAudio = null;
      }
      setNarrationButtonState("idle");
    });

    audio.addEventListener("pause", () => {
      if (!audio.ended) {
        setNarrationButtonState("idle");
      }
    });

    await audio.play();
  } catch (error) {
    setNarrationButtonState("idle");
    const message = String(error.message || "");
    const servedOutsideLocalServer =
      window.location.port && window.location.port !== "5500";

    if (servedOutsideLocalServer) {
      window.alert(
        "Nao foi possivel gerar a narracao agora. Abra a PokeDex por http://127.0.0.1:5500 usando npm start.",
      );
      return;
    }

    if (message.includes("creditos") || message.includes("plano ativo")) {
      window.alert(`${message} Verifique sua conta ElevenLabs.`);
      return;
    }

    window.alert(`Nao foi possivel gerar a narracao agora. ${message || "Verifique o servidor local."}`);
  }
}

function getGenus(speciesDetails) {
  return (
    speciesDetails.genera.find((entry) => entry.language.name === "en")?.genus ??
    "Species Pokemon"
  );
}

function flattenEvolutionChain(chain, steps = [], depth = 0) {
  if (!chain) {
    return steps;
  }

  steps.push({
    name: chain.species.name,
    minLevel: chain.evolution_details[0]?.min_level ?? null,
    trigger: chain.evolution_details[0]?.trigger?.name ?? null,
    depth,
  });

  chain.evolves_to.forEach((next) => flattenEvolutionChain(next, steps, depth + 1));
  return steps;
}

async function getEvolutionStages(pokemon) {
  const speciesDetails = await fetchSpeciesDetails(pokemon.species.url);

  if (!speciesDetails.evolution_chain?.url) {
    return [];
  }

  const evolutionChain = await fetchEvolutionChain(speciesDetails.evolution_chain.url);
  const stages = flattenEvolutionChain(evolutionChain.chain);

  return Promise.all(
    stages.map(async (stage) => {
      const details = await fetchPokemonDetails(stage.name);
      return { ...stage, details };
    }),
  );
}

function formatEvolutionRequirement(step) {
  if (step.minLevel) {
    return `Nivel ${step.minLevel}`;
  }

  if (step.trigger) {
    return formatLabel(step.trigger);
  }

  return step.depth === 0 ? "Forma base" : "Metodo especial";
}

async function getTypeMatchups(types) {
  const typeResponses = await Promise.all(
    types.map(({ type }) => fetchTypeDetails(type.url)),
  );

  const multiplierMap = new Map(Object.keys(typeColors).map((type) => [type, 1]));

  typeResponses.forEach((typeData) => {
    typeData.damage_relations.double_damage_from.forEach((item) => {
      multiplierMap.set(item.name, (multiplierMap.get(item.name) ?? 1) * 2);
    });

    typeData.damage_relations.half_damage_from.forEach((item) => {
      multiplierMap.set(item.name, (multiplierMap.get(item.name) ?? 1) * 0.5);
    });

    typeData.damage_relations.no_damage_from.forEach((item) => {
      multiplierMap.set(item.name, 0);
    });
  });

  const entries = [...multiplierMap.entries()];

  return {
    weaknesses: entries
      .filter(([, value]) => value > 1)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 4),
    resistances: entries
      .filter(([, value]) => value > 0 && value < 1)
      .sort((first, second) => first[1] - second[1])
      .slice(0, 4),
    immunities: entries.filter(([, value]) => value === 0).slice(0, 3),
  };
}

function renderDamageChip(typeName, multiplier, labelSuffix) {
  return `<li class="matchup-chip" style="${getTypeBadgeStyle(typeName, "soft")}">${escapeHtml(typeName)}${escapeHtml(labelSuffix ? ` - ${labelSuffix}` : "")}</li>`;
}

function renderArtPane(label, pokemon, shiny = false) {
  const artwork = getArtwork(pokemon, shiny);
  return `
    <article class="art-pane">
      <span class="art-badge">${escapeHtml(label)}</span>
      <img src="${escapeHtml(artwork)}" alt="${escapeHtml(pokemon.name)} ${escapeHtml(label)}" />
    </article>
  `;
}

async function renderSpotlight() {
  if (!state.filteredPokemon.length) {
    renderEmptyState("Nenhum Pokemon encontrado para essa busca.");
    elements.summary.textContent = "0 resultados";
    return;
  }

  const pokemon =
    state.selectedPokemonDetails ?? (await fetchPokemonDetails(state.filteredPokemon[0].id));
  const evolutionStages = await getEvolutionStages(pokemon);
  const speciesDetails = await fetchSpeciesDetails(pokemon.species.url);
  const card = elements.spotlightTemplate.content.firstElementChild.cloneNode(true);
  const art = card.querySelector(".spotlight-art");

  art.innerHTML = `
    <div class="art-compare">
      ${renderArtPane("Normal", pokemon, false)}
      ${renderArtPane("Shiny", pokemon, true)}
    </div>
  `;

  if (evolutionStages.length) {
    const strip = document.createElement("div");
    strip.className = "evolution-strip";

    evolutionStages.forEach((stage) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `evolution-button${stage.details.id === pokemon.id ? " is-active" : ""}`;
      button.dataset.pokemonId = String(stage.details.id);
      button.innerHTML = `
        <img src="${escapeHtml(getArtwork(stage.details))}" alt="${escapeHtml(stage.details.name)}" />
        <strong>${escapeHtml(stage.details.name)}</strong>
        <span>${escapeHtml(formatEvolutionRequirement(stage))}</span>
      `;
      strip.appendChild(button);
    });

    card.appendChild(strip);
  }

  elements.spotlight.innerHTML = "";
  elements.spotlight.appendChild(card);
  elements.summary.textContent = `${state.filteredPokemon.length} Pokemon${state.filteredPokemon.length > 1 ? "s" : ""} encontrados`;
}

function renderDataTab(pokemon, matchups, joinedTypes) {
  return `
    <div class="detail-columns">
      <section class="detail-block">
        <h4>Dados fisicos</h4>
        <div class="measurements">
          <div class="metric">
            <span class="metric-label">Altura</span>
            <strong>${(pokemon.height / 10).toFixed(1)} m</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Peso</span>
            <strong>${(pokemon.weight / 10).toFixed(1)} kg</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Habilidades</span>
            <strong>${pokemon.abilities.length}</strong>
          </div>
        </div>
      </section>

      <section class="detail-block">
        <h4>Leitura tatica</h4>
        <p class="detail-copy">
          Perfil monitorado como ${escapeHtml(joinedTypes)}. O alvo apresenta ${pokemon.stats.length}
          atributos analisados pelo HUD.
        </p>
      </section>
    </div>

    <div class="detail-grid-2">
      <section class="detail-section">
        <h4>Habilidades</h4>
        <ul class="abilities-list">
          ${pokemon.abilities
            .map(
              ({ ability, is_hidden }) =>
                `<li>${escapeHtml(formatLabel(ability.name))}${is_hidden ? " (oculta)" : ""}</li>`,
            )
            .join("")}
        </ul>
      </section>

      <section class="detail-section">
        <h4>Fraquezas</h4>
        <ul class="weakness-list">
          ${
            matchups.weaknesses.length
              ? matchups.weaknesses
                  .map(([typeName, multiplier]) => renderDamageChip(typeName, multiplier, `${multiplier}x`))
                  .join("")
              : "<li>Sem fraquezas destacadas</li>"
          }
        </ul>
      </section>

      <section class="detail-section">
        <h4>Resistencias</h4>
        <ul class="weakness-list">
          ${
            matchups.resistances.length
              ? matchups.resistances
                  .map(([typeName, multiplier]) => renderDamageChip(typeName, multiplier, `${multiplier}x`))
                  .join("")
              : "<li>Sem resistencias destacadas</li>"
          }
          ${
            matchups.immunities.length
              ? matchups.immunities
                  .map(([typeName]) => renderDamageChip(typeName, 0, "imune"))
                  .join("")
              : ""
          }
        </ul>
      </section>

      <section class="detail-section">
        <h4>Assinatura</h4>
        <ul class="type-list">
          ${pokemon.types
            .map(({ type }) => `<li class="type-chip" style="${getTypeBadgeStyle(type.name)}">${escapeHtml(type.name)}</li>`)
            .join("")}
        </ul>
      </section>
    </div>
  `;
}

function renderStatsTab(pokemon) {
  return `
    <section class="detail-section">
      <h4>Status base</h4>
      <ul class="stats-list compact">
        ${pokemon.stats
          .map((stat) => {
            const value = Math.min(stat.base_stat, 180);
            return `
              <li>
                <label>${escapeHtml(formatStatName(stat.stat.name))}</label>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${(value / 180) * 100}%"></div>
                </div>
                <strong>${stat.base_stat}</strong>
              </li>
            `;
          })
          .join("")}
      </ul>
    </section>
  `;
}

function renderMovesTab(pokemon) {
  const moveCards = pokemon.moves
    .map((move) => {
      const preferred =
        move.version_group_details.find((detail) => detail.move_learn_method.name === "level-up") ||
        move.version_group_details[0];

      return {
        name: move.move.name,
        method: preferred?.move_learn_method.name ?? "unknown",
        level: preferred?.level_learned_at ?? 0,
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
    .slice(0, 12);

  return `
    <section class="detail-section">
      <h4>Moves monitorados</h4>
      <div class="moves-grid">
        ${moveCards
          .map(
            (move) => `
              <article class="move-card">
                <strong>${escapeHtml(formatLabel(move.name))}</strong>
                <span>${escapeHtml(formatLabel(move.method))}${move.level ? ` - nivel ${move.level}` : ""}</span>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderFormsTab(pokemon, speciesDetails) {
  const forms = speciesDetails.varieties.map((entry) => {
    const varietyId = extractPokemonId(entry.pokemon.url);
    const label = entry.pokemon.name
      .replace(`${speciesDetails.name}-`, "")
      .replace(/-/g, " ");

    return {
      id: varietyId,
      name: label || "Forma base",
      isDefault: entry.is_default,
    };
  });

  return `
    <section class="detail-section">
      <h4>Forms registradas</h4>
      <div class="forms-grid">
        ${forms
          .map(
            (form) => `
              <button class="form-card ${form.id === pokemon.id ? "is-active" : ""}" type="button" data-form-id="${form.id}">
                <strong>${escapeHtml(form.name)}</strong>
                <span>${form.isDefault ? "Forma principal" : "Forma alternativa"}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderLoreTab(speciesDetails) {
  const generation = speciesDetails.generation?.name?.replace(/-/g, " ") ?? "desconhecida";
  const habitat = speciesDetails.habitat?.name?.replace(/-/g, " ") ?? "sem habitat";
  const genus = getGenus(speciesDetails);
  const flavorText = sanitizeFlavorText(getEnglishFlavorText(speciesDetails));

  return `
    <section class="detail-section lore-box">
      <div class="lore-header">
        <h4>Registro PokeDex</h4>
        <button
          class="narration-button"
          type="button"
          data-narrate-button
          data-flavor-text="${escapeHtml(flavorText)}"
          aria-label="Narrar lore do Pokemon em portugues"
        >
          <span class="narration-button-icon" aria-hidden="true">🔊</span>
          <span class="narration-button-text">Narrar lore</span>
        </button>
      </div>
      <p class="detail-copy">${escapeHtml(flavorText)}</p>
    </section>

    <div class="detail-grid-2">
      <section class="detail-section">
        <h4>Origem</h4>
        <div class="lore-meta">
          <div class="metric">
            <span class="metric-label">Geracao</span>
            <strong>${escapeHtml(generation)}</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Habitat</span>
            <strong>${escapeHtml(habitat)}</strong>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h4>Classificacao</h4>
        <div class="lore-meta">
          <div class="metric">
            <span class="metric-label">Especie</span>
            <strong>${escapeHtml(genus)}</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Captura</span>
            <strong>${speciesDetails.capture_rate ?? "?"}</strong>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function renderDetail(pokemon) {
  elements.detailCard.classList.add("loading");
  elements.detailCard.innerHTML = "<p>Carregando detalhes...</p>";

  try {
    setThemeFromPokemon(pokemon);

    const matchups = await getTypeMatchups(pokemon.types);
    const speciesDetails = await fetchSpeciesDetails(pokemon.species.url);
    const artwork = getArtwork(pokemon, false);
    const joinedTypes = pokemon.types.map(({ type }) => type.name).join(" / ");
    let tabContent = "";

    if (state.activeTab === "stats") {
      tabContent = renderStatsTab(pokemon);
    } else if (state.activeTab === "moves") {
      tabContent = renderMovesTab(pokemon);
    } else if (state.activeTab === "forms") {
      tabContent = renderFormsTab(pokemon, speciesDetails);
    } else if (state.activeTab === "lore") {
      tabContent = renderLoreTab(speciesDetails);
    } else {
      tabContent = renderDataTab(pokemon, matchups, joinedTypes);
    }

    elements.detailCard.classList.remove("loading");
    elements.detailCard.innerHTML = `
      <div class="detail-content">
        <div class="detail-header">
          <div class="detail-heading">
            <span class="section-label">${formatPokemonNumber(pokemon.id)}</span>
            <h3>${escapeHtml(pokemon.name)}</h3>
            <p>${escapeHtml(formatLabel(pokemon.species.name))}</p>
          </div>
          <div class="detail-visual">
            <img src="${escapeHtml(artwork)}" alt="${escapeHtml(pokemon.name)}" />
          </div>
        </div>

        <div class="detail-meta">
          <div class="type-list">
            ${pokemon.types
              .map(({ type }) => {
                return `<span class="type-chip" style="${getTypeBadgeStyle(type.name)}">${escapeHtml(type.name)}</span>`;
              })
              .join("")}
          </div>
          <p class="detail-copy">${pokemon.base_experience ?? "?"} XP base</p>
        </div>

        ${tabContent}
      </div>
    `;
  } catch (error) {
    elements.detailCard.classList.remove("loading");
    elements.detailCard.innerHTML = "<p>Nao foi possivel carregar os detalhes agora.</p>";
  }
}

function renderFallbackDetail() {
  elements.detailCard.classList.add("loading");
  elements.detailCard.innerHTML =
    "<p>Digite ou selecione um Pokemon para ver todos os dados.</p>";
}

function renderConnectionError(message) {
  elements.summary.textContent = "Nao foi possivel carregar a PokeDex.";
  renderEmptyState(message);
  renderFallbackDetail();
}

async function selectPokemon(pokemonId, options = {}) {
  stopCurrentNarration();
  const details = await fetchPokemonDetails(pokemonId);
  state.selectedPokemonId = details.id;
  state.selectedPokemonDetails = details;

  if (options.updateSearch !== false) {
    elements.topSearchInput.value = details.name;
  }

  await renderSpotlight();
  await renderDetail(details);
  triggerScanEffect();

  if (options.playCry) {
    playPokemonCry(details);
  }
}

async function syncSelectionFromSearch(searchTerm) {
  if (!searchTerm) {
    const firstPokemon = state.filteredPokemon[0];

    if (firstPokemon) {
      await selectPokemon(firstPokemon.id, { updateSearch: false });
    } else {
      renderFallbackDetail();
    }

    return;
  }

  const exactMatch = state.filteredPokemon.find(
    (pokemon) => pokemon.name === searchTerm || String(pokemon.id) === searchTerm,
  );

  const firstMatch = exactMatch ?? state.filteredPokemon[0];

  if (!firstMatch) {
    renderFallbackDetail();
    return;
  }

  await selectPokemon(firstMatch.id, { updateSearch: false });
}

async function applyFilters() {
  const searchTerm = elements.topSearchInput.value.trim().toLowerCase();
  const selectedType = elements.typeSelect.value;
  const allowedTypeIds = selectedType ? await fetchTypePokemonIds(selectedType) : null;

  state.filteredPokemon = state.allPokemon.filter((pokemon) => {
    const matchesSearch =
      !searchTerm ||
      pokemon.name.includes(searchTerm) ||
      String(pokemon.id).includes(searchTerm);
    const matchesType = !allowedTypeIds || allowedTypeIds.has(pokemon.id);

    return matchesSearch && matchesType;
  });

  await syncSelectionFromSearch(searchTerm);
}

async function populateTypeFilter() {
  const typeData = await fetchJson(`${API_BASE}/type`);
  const validTypes = typeData.results
    .map((type) => type.name)
    .filter((type) => type !== "unknown" && type !== "shadow");

  validTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    elements.typeSelect.appendChild(option);
  });
}

function bindEvents() {
  elements.topSearchInput.addEventListener("input", applyFilters);
  elements.typeSelect.addEventListener("change", applyFilters);

  if (SpeechRecognitionApi && elements.voiceSearchButton) {
    voiceRecognition = new SpeechRecognitionApi();
    voiceRecognition.lang = "pt-BR";
    voiceRecognition.interimResults = false;
    voiceRecognition.maxAlternatives = 1;

    voiceRecognition.addEventListener("start", () => {
      setVoiceButtonState(true, true);
    });

    voiceRecognition.addEventListener("end", () => {
      setVoiceButtonState(false, true);
    });

    voiceRecognition.addEventListener("result", async (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) {
        return;
      }

      elements.topSearchInput.value = transcript.toLowerCase();
      await applyFilters();
    });

    voiceRecognition.addEventListener("error", () => {
      setVoiceButtonState(false, true);
    });

    elements.voiceSearchButton.addEventListener("click", () => {
      try {
        voiceRecognition.start();
      } catch (error) {
        setVoiceButtonState(false, true);
      }
    });

    setVoiceButtonState(false, true);
  } else {
    setVoiceButtonState(false, false);
  }

  elements.hudTabs.forEach((button) => {
    button.addEventListener("click", async () => {
      state.activeTab = button.dataset.tab;
      stopCurrentNarration();
      renderHudTabs();

      if (state.selectedPokemonDetails) {
        await renderDetail(state.selectedPokemonDetails);
        triggerScanEffect();
      }
    });
  });

  elements.cryButton.addEventListener("click", () => {
    if (state.selectedPokemonDetails) {
      playPokemonCry(state.selectedPokemonDetails);
    }
  });

  elements.spotlight.addEventListener("click", async (event) => {
    const evolutionButton = event.target.closest(".evolution-button");
    const pokemonId = evolutionButton?.dataset.pokemonId;

    if (!pokemonId) {
      return;
    }

    await selectPokemon(pokemonId, { playCry: true });
  });

  elements.detailCard.addEventListener("click", async (event) => {
    const formCard = event.target.closest(".form-card");
    const narrationButton = event.target.closest("[data-narrate-button]");

    if (narrationButton && state.selectedPokemonDetails) {
      await handleLoreNarration(
        state.selectedPokemonDetails.name,
        narrationButton.dataset.flavorText ?? "",
      );
      return;
    }

    if (!formCard?.dataset.formId) {
      return;
    }

    await selectPokemon(formCard.dataset.formId, { playCry: true });
  });

  elements.shuffleButton.addEventListener("click", async () => {
    if (!state.filteredPokemon.length) {
      return;
    }

    const randomPokemon =
      state.filteredPokemon[Math.floor(Math.random() * state.filteredPokemon.length)];
    await selectPokemon(randomPokemon.id, { playCry: true });
  });
}

async function loadPokemon() {
  elements.summary.textContent = "Buscando Pokemon...";
  renderEmptyState("Carregando catalogo completo...");

  const listData = await fetchJson(
    `${API_BASE}/pokemon?limit=${ALL_POKEMON_LIMIT}&offset=0`,
  );

  state.allPokemon = listData.results
    .map((pokemon) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
      url: pokemon.url,
      types: [],
    }))
    .filter((pokemon) => pokemon.id !== null);

  const firstPageDetails = await Promise.all(
    state.allPokemon.slice(0, PAGE_SIZE).map((pokemon) => fetchPokemonDetails(pokemon.id)),
  );

  firstPageDetails.forEach((pokemon) => {
    const summary = state.allPokemon.find((item) => item.id === pokemon.id);
    if (summary) {
      summary.types = pokemon.types.map(({ type }) => type.name);
    }
  });

  state.filteredPokemon = [...state.allPokemon];
  state.selectedPokemonId = state.allPokemon[0]?.id ?? null;

  await populateTypeFilter();

  if (state.allPokemon[0]) {
    await selectPokemon(state.allPokemon[0].id, { updateSearch: false });
  }
}

async function init() {
  bindEvents();
  renderHudTabs();

  try {
    await loadPokemon();
  } catch (error) {
    const openedFromFile = window.location.protocol === "file:";

    if (openedFromFile) {
      renderConnectionError(
        "Abra a PokeDex por um servidor local. Se abrir o index.html direto, a API pode falhar.",
      );
      return;
    }

    renderConnectionError(
      "Falha ao conectar com a PokeAPI. Verifique sua internet e recarregue a pagina.",
    );
  }
}

init();
