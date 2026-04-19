const API_BASE = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 50;
const ALL_POKEMON_LIMIT = 2000;

const elements = {
  search: document.querySelector("#highlights-search"),
  typeFilter: document.querySelector("#highlights-type-filter"),
  summary: document.querySelector("#highlights-summary"),
  prevButton: document.querySelector("#highlights-prev"),
  nextButton: document.querySelector("#highlights-next"),
  pageIndicator: document.querySelector("#highlights-page-indicator"),
  grid: document.querySelector("#highlights-grid"),
};

const state = {
  allPokemon: [],
  filteredPokemon: [],
  currentPage: 1,
  activeType: "",
  searchTerm: "",
};

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

function normalizeSearchText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao carregar ${url}`);
  }

  return response.json();
}

function extractPokemonId(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

function formatPokemonNumber(id) {
  return `#${String(id).padStart(4, "0")}`;
}

function getTotalPages() {
  return Math.max(1, Math.ceil(state.filteredPokemon.length / PAGE_SIZE));
}

function getCurrentPageItems() {
  const start = (state.currentPage - 1) * PAGE_SIZE;
  return state.filteredPokemon.slice(start, start + PAGE_SIZE);
}

function renderEmptyState(message) {
  elements.grid.innerHTML = `<article class="highlights-empty">${message}</article>`;
}

function renderGrid() {
  const items = getCurrentPageItems();

  if (!items.length) {
    renderEmptyState("Nenhum Pokemon encontrado com esse filtro.");
    return;
  }

  elements.grid.innerHTML = items
    .map((pokemon) => {
      const types = pokemon.types
        .map(
          (type) =>
            `<span class="highlights-type" style="--type-color: ${typeColors[type] ?? "#6c8fb1"}">${type}</span>`,
        )
        .join("");

      const artwork =
        pokemon.artwork ||
        pokemon.sprite ||
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

      return `
        <a class="highlights-card" href="./pokedex.html?pokemon=${encodeURIComponent(pokemon.id)}">
          <span class="highlights-card-glow"></span>
          <span class="highlights-number">${formatPokemonNumber(pokemon.id)}</span>
          <div class="highlights-artwrap">
            <img src="${artwork}" alt="${pokemon.name}" loading="lazy" />
          </div>
          <strong>${pokemon.displayName}</strong>
          <div class="highlights-types">${types}</div>
        </a>
      `;
    })
    .join("");
}

function renderPagination() {
  const totalPages = getTotalPages();
  const start = state.filteredPokemon.length ? (state.currentPage - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(state.currentPage * PAGE_SIZE, state.filteredPokemon.length);

  elements.summary.textContent =
    state.filteredPokemon.length > 0
      ? `Mostrando ${start}-${end} de ${state.filteredPokemon.length} Pokemon`
      : "Nenhum Pokemon encontrado";

  elements.pageIndicator.textContent = `Pagina ${state.currentPage} de ${totalPages}`;
  elements.prevButton.disabled = state.currentPage <= 1;
  elements.nextButton.disabled = state.currentPage >= totalPages;
}

function applyFilters() {
  const searchTerm = normalizeSearchText(state.searchTerm);

  state.filteredPokemon = state.allPokemon.filter((pokemon) => {
    const matchesType = !state.activeType || pokemon.types.includes(state.activeType);
    const matchesSearch =
      !searchTerm ||
      normalizeSearchText(pokemon.name).includes(searchTerm) ||
      String(pokemon.id).includes(searchTerm.replace(/\s+/g, ""));

    return matchesType && matchesSearch;
  });

  state.currentPage = 1;
  renderPagination();
  renderGrid();
}

function populateTypeFilter() {
  const typeSet = new Set();

  state.allPokemon.forEach((pokemon) => {
    pokemon.types.forEach((type) => typeSet.add(type));
  });

  elements.typeFilter.innerHTML = `
    <option value="">Todos os tipos</option>
    ${[...typeSet]
      .sort((a, b) => a.localeCompare(b))
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("")}
  `;
}

function bindEvents() {
  elements.search.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    applyFilters();
  });

  elements.typeFilter.addEventListener("change", (event) => {
    state.activeType = event.target.value;
    applyFilters();
  });

  elements.prevButton.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage -= 1;
      renderPagination();
      renderGrid();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  elements.nextButton.addEventListener("click", () => {
    if (state.currentPage < getTotalPages()) {
      state.currentPage += 1;
      renderPagination();
      renderGrid();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

async function loadPokemon() {
  renderEmptyState("Carregando destaques...");

  const listData = await fetchJson(`${API_BASE}/pokemon?limit=${ALL_POKEMON_LIMIT}&offset=0`);
  const firstBatch = listData.results.slice(0, ALL_POKEMON_LIMIT);

  const details = await Promise.all(
    firstBatch.map(async (pokemon) => {
      const id = extractPokemonId(pokemon.url);
      const detail = await fetchJson(`${API_BASE}/pokemon/${id}`);

      return {
        id: detail.id,
        name: detail.name,
        displayName: detail.name.replace(/-/g, " "),
        types: detail.types.map(({ type }) => type.name),
        sprite: detail.sprites.front_default,
        artwork: detail.sprites.other?.["official-artwork"]?.front_default,
      };
    }),
  );

  state.allPokemon = details;
  state.filteredPokemon = [...details];
  populateTypeFilter();
  renderPagination();
  renderGrid();
}

async function init() {
  bindEvents();

  try {
    await loadPokemon();
  } catch (error) {
    renderEmptyState("Falha ao carregar os destaques. Recarregue a pagina.");
  }
}

init();
