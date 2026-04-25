import {
  DEFAULT_ROMS,
  EMULATOR_SYSTEMS,
  GITHUB_URL,
  ROM_ACCEPT,
  clearLocalLibraryData,
  clearLocalRoms,
  clearLocalSaves,
  deleteLocalRom,
  deleteLocalSave,
  deletePs1BiosRecord,
  formatRomTitle,
  getLocalSaves,
  getPs1BiosRecord,
  getLocalRoms,
  getLocale,
  getSystemLabelByFileName,
  getText,
  getVersionFromTitle,
  isSupportedRomFile,
  normalizeText,
  saveLocalRom,
  savePs1BiosRecord,
  setLocale,
  updateLocalRomCover,
  updateLocalRomMetadata,
} from "./roms.js";

const grid = document.querySelector("#rom-grid");
const recentSection = document.querySelector("#recent-local-section");
const recentGrid = document.querySelector("#recent-rom-grid");
const recentKicker = document.querySelector("#recent-local-kicker");
const recentTitle = document.querySelector("#recent-local-title");
const recentControls = document.querySelector("#recent-carousel-controls");
const recentPrev = document.querySelector("#recent-prev");
const recentNext = document.querySelector("#recent-next");
const defaultLibraryKicker = document.querySelector("#default-library-kicker");
const defaultLibraryTitle = document.querySelector("#default-library-title");
const searchInput = document.querySelector("#library-search");
const systemSelect = document.querySelector("#library-system");
const sortSelect = document.querySelector("#library-sort");
const sortDirectionButton = document.querySelector("#library-sort-direction");
const clearButton = document.querySelector("#library-clear");
const resultsLabel = document.querySelector("#library-results");
const systemLabel = document.querySelector("#system-label");
const sortLabel = document.querySelector("#sort-label");
const title = document.querySelector("#library-title");
const subtitle = document.querySelector("#library-subtitle");
const uploadLabel = document.querySelector("#upload-label");
const ps1BiosNote = document.querySelector("#ps1-bios-note");
const uploadInput = document.querySelector("#home-rom-input");
const coverInput = document.querySelector("#home-cover-input");
const uploadDialog = document.querySelector("#rom-upload-dialog");
const openUploadButton = document.querySelector("#open-rom-upload");
const closeUploadButton = document.querySelector("#close-rom-upload");
const cancelUploadButton = document.querySelector("#cancel-rom-upload");
const uploadForm = document.querySelector("#rom-upload-form");
const uploadPreview = document.querySelector("#rom-upload-preview");
const uploadTitle = document.querySelector("#rom-upload-title");
const uploadKicker = document.querySelector("#rom-upload-kicker");
const romFileLabel = document.querySelector("#rom-file-label");
const coverFileLabel = document.querySelector("#cover-file-label");
const saveUploadButton = document.querySelector("#save-rom-upload");
const openDashboardButton = document.querySelector("#open-library-dashboard");
const closeDashboardButton = document.querySelector("#close-library-dashboard");
const libraryDashboard = document.querySelector("#library-dashboard");
const dashboardTabs = [...document.querySelectorAll("[data-dashboard-tab]")];
const dashboardPanels = [...document.querySelectorAll("[data-dashboard-panel]")];
const dashboardList = document.querySelector("#library-dashboard-list");
const dashboardRomCount = document.querySelector("#dashboard-rom-count");
const dashboardStorageNote = document.querySelector("#dashboard-storage-note");
const dashboardSearch = document.querySelector("#dashboard-search");
const dashboardSystem = document.querySelector("#dashboard-system");
const dashboardSort = document.querySelector("#dashboard-sort");
const dashboardSearchClear = document.querySelector("#dashboard-search-clear");
const dashboardSaveCount = document.querySelector("#dashboard-save-count");
const dashboardSaveList = document.querySelector("#dashboard-save-list");
const dashboardSaveSearch = document.querySelector("#dashboard-save-search");
const dashboardSaveSystem = document.querySelector("#dashboard-save-system");
const dashboardSaveSort = document.querySelector("#dashboard-save-sort");
const dashboardSaveClear = document.querySelector("#dashboard-save-clear");
const dashboardCoverInput = document.querySelector("#dashboard-cover-input");
const dashboardBiosStatus = document.querySelector("#dashboard-bios-status");
const dashboardBiosDetail = document.querySelector("#dashboard-bios-detail");
const dashboardBiosImport = document.querySelector("#dashboard-bios-import");
const dashboardBiosDelete = document.querySelector("#dashboard-bios-delete");
const dashboardBiosInput = document.querySelector("#dashboard-bios-input");
const dashboardBulkImport = document.querySelector("#dashboard-bulk-import");
const dashboardBulkInput = document.querySelector("#dashboard-bulk-input");
const dashboardBulkCovers = document.querySelector("#dashboard-bulk-covers");
const dashboardBulkCoverInput = document.querySelector("#dashboard-bulk-cover-input");
const dashboardBulkStatus = document.querySelector("#dashboard-bulk-status");
const dashboardCleanRoms = document.querySelector("#dashboard-clean-roms");
const dashboardCleanSaves = document.querySelector("#dashboard-clean-saves");
const dashboardCleanBios = document.querySelector("#dashboard-clean-bios");
const dashboardCleanAll = document.querySelector("#dashboard-clean-all");
const dashboardCleanStatus = document.querySelector("#dashboard-clean-status");
const dashboardBackupExport = document.querySelector("#dashboard-backup-export");
const dashboardBackupImport = document.querySelector("#dashboard-backup-import");
const dashboardBackupInput = document.querySelector("#dashboard-backup-input");
const dashboardBackupStatus = document.querySelector("#dashboard-backup-status");
const githubLink = document.querySelector("#github-link");
const localeButtons = [...document.querySelectorAll("[data-locale]")];

let locale = getLocale();
let localRoms = [];
let localSaves = [];
let query = "";
let system = "";
let sortBy = "console";
let sortDirection = "asc";
let dashboardQuery = "";
let dashboardSystemFilter = "";
let dashboardSortBy = "recent";
let dashboardSaveQuery = "";
let dashboardSaveSystemFilter = "";
let dashboardSaveSortBy = "recent";
let activeDashboardTab = "roms";
let pendingCoverRomId = "";
let ps1BiosRecord = null;
let pendingBulkCoverFiles = [];

function localCoverForVersion(version) {
  const match = DEFAULT_ROMS.find((rom) => rom.version === version);
  return match?.cover || "./assets/rom-covers/emerald.png.jfif";
}

function getCoverUrl(entry, fallbackVersion = "other") {
  if (entry.coverFile instanceof Blob) {
    return URL.createObjectURL(entry.coverFile);
  }

  return entry.coverUrl || localCoverForVersion(fallbackVersion);
}

function getAllRoms() {
  const customLocalRoms = getRecentLocalRoms().filter((rom) => {
    const version = getVersionFromTitle(rom.title);
    return version === "other";
  }).map((rom) => ({ ...rom, source: "library" }));

  return [
    ...DEFAULT_ROMS.map((rom, index) => ({ ...rom, source: "default", updatedAt: DEFAULT_ROMS.length - index })),
    ...customLocalRoms,
  ];
}

function getRecentLocalRoms() {
  return localRoms.map((entry) => {
    const title = entry.displayTitle || formatRomTitle(entry.name);
    const version = getVersionFromTitle(title);

    return {
      id: entry.id,
      title,
      system: entry.system || getSystemLabelByFileName(entry.name),
      cover: getCoverUrl(entry, version),
      route: `./rom.html?type=local&id=${encodeURIComponent(entry.id)}`,
      source: "local",
      lastPlayedAt: Number(entry.lastPlayedAt || 0),
      updatedAt: Number(entry.updatedAt || entry.addedAt || entry.file?.lastModified || 0),
    };
  })
    .sort((first, second) => (second.lastPlayedAt || second.updatedAt) - (first.lastPlayedAt || first.updatedAt))
}

function getFilteredRoms() {
  const normalizedQuery = normalizeText(query);

  const filtered = getAllRoms().filter((rom) => {
    const matchesQuery = !normalizedQuery || normalizeText(`${rom.title} ${rom.system}`).includes(normalizedQuery);
    const matchesSystem = !system || rom.system === system;
    return matchesQuery && matchesSystem;
  });

  return filtered.sort((first, second) => {
    let comparison = 0;

    if (sortBy === "console") {
      comparison = getSystemOrder(first.system) - getSystemOrder(second.system);
    } else if (sortBy === "recent") {
      comparison = (Number(second.lastPlayedAt || second.updatedAt || 0) - Number(first.lastPlayedAt || first.updatedAt || 0));
    } else {
      const firstValue = String(first[sortBy] || first.title || "");
      const secondValue = String(second[sortBy] || second.title || "");
      comparison = firstValue.localeCompare(secondValue, undefined, { sensitivity: "base" });
    }

    if (!comparison) {
      comparison = String(first.title || "").localeCompare(String(second.title || ""), undefined, { sensitivity: "base" });
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });
}

function getSystemOrder(systemName) {
  const index = EMULATOR_SYSTEMS.findIndex((item) => item.label === systemName);
  return index === -1 ? EMULATOR_SYSTEMS.length : index;
}

function groupRomsBySystem(items) {
  return items.reduce((groups, item) => {
    const systemName = item.system || "ROM";
    const group = groups.get(systemName) || [];
    group.push(item);
    groups.set(systemName, group);
    return groups;
  }, new Map());
}

function getDashboardRoms() {
  const normalizedQuery = normalizeText(dashboardQuery);

  const filtered = localRoms
    .filter((entry) => {
      const systemLabel = entry.system || getSystemLabelByFileName(entry.name);
      const matchesSystem = !dashboardSystemFilter || systemLabel === dashboardSystemFilter;

      if (!matchesSystem) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const title = entry.displayTitle || formatRomTitle(entry.name);
      return normalizeText(`${title} ${entry.name} ${systemLabel}`).includes(normalizedQuery);
    });

  return filtered.sort((first, second) => {
    if (dashboardSortBy === "name") {
      const firstTitle = first.displayTitle || formatRomTitle(first.name);
      const secondTitle = second.displayTitle || formatRomTitle(second.name);
      return firstTitle.localeCompare(secondTitle, undefined, { sensitivity: "base" });
    }

    if (dashboardSortBy === "console") {
      const firstSystem = first.system || getSystemLabelByFileName(first.name);
      const secondSystem = second.system || getSystemLabelByFileName(second.name);
      return firstSystem.localeCompare(secondSystem, undefined, { sensitivity: "base" })
        || (first.displayTitle || formatRomTitle(first.name)).localeCompare(second.displayTitle || formatRomTitle(second.name), undefined, { sensitivity: "base" });
    }

    if (dashboardSortBy === "size") {
      return Number(second.size || 0) - Number(first.size || 0);
    }

    return Number(second.updatedAt || second.addedAt || 0) - Number(first.updatedAt || first.addedAt || 0);
  });
}

function getSaveSystem(save) {
  const linkedName = normalizeText(save?.linkedRomName || save?.name || "");
  const match = localRoms.find((entry) => {
    const title = normalizeText(entry.displayTitle || formatRomTitle(entry.name));
    const fileName = normalizeText(formatRomTitle(entry.name));
    return linkedName && (linkedName.includes(title) || linkedName.includes(fileName) || title.includes(linkedName));
  });

  return match?.system || getSystemLabelByFileName(save?.linkedRomName || save?.name || "") || "Saves";
}

function getDashboardSaves() {
  const normalizedQuery = normalizeText(dashboardSaveQuery);

  const filtered = localSaves.filter((save) => {
    const systemLabel = getSaveSystem(save);
    const matchesSystem = !dashboardSaveSystemFilter || systemLabel === dashboardSaveSystemFilter;

    if (!matchesSystem) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return normalizeText(`${save.name} ${save.linkedRomName} ${systemLabel}`).includes(normalizedQuery);
  });

  return filtered.sort((first, second) => {
    if (dashboardSaveSortBy === "name") {
      return String(first.name || "").localeCompare(String(second.name || ""), undefined, { sensitivity: "base" });
    }

    if (dashboardSaveSortBy === "console") {
      return getSaveSystem(first).localeCompare(getSaveSystem(second), undefined, { sensitivity: "base" })
        || String(first.name || "").localeCompare(String(second.name || ""), undefined, { sensitivity: "base" });
    }

    if (dashboardSaveSortBy === "size") {
      return Number(second.size || 0) - Number(first.size || 0);
    }

    return Number(second.importedAt || 0) - Number(first.importedAt || 0);
  });
}

function renderRomCard(rom, t) {
  return `
    <a class="rom-card" href="${rom.route}" aria-label="${t.openRom}: ${rom.title}">
      <img class="rom-card-image" src="${rom.cover}" alt="${rom.title}" loading="lazy" />
      <span class="rom-card-info">
        <strong>${rom.title}</strong>
        <span>${rom.system}</span>
        <span class="rom-card-badge">${rom.source === "local" ? t.localBadge : t.defaultBadge}</span>
      </span>
    </a>
  `;
}

function getSystemSectionId(systemName) {
  return `system-${normalizeText(systemName).replace(/\s+/g, "-") || "rom"}`;
}

function renderSystems() {
  const t = getText(locale);
  const systems = [...new Set([
    ...EMULATOR_SYSTEMS.map((item) => item.label),
    ...getAllRoms().map((rom) => rom.system),
  ])].sort();
  systemSelect.innerHTML = [
    `<option value="">${t.allSystems}</option>`,
    ...systems.map((item) => `<option value="${item}">${item}</option>`),
  ].join("");
  systemSelect.value = system;
}

function renderLocale() {
  const t = getText(locale);
  document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  if (title) {
    title.textContent = t.library;
  }
  subtitle.textContent = t.subtitle;
  searchInput.placeholder = t.search;
  systemLabel.textContent = t.system;
  sortLabel.textContent = locale === "pt" ? "Ordenar por" : "Sort by";
  sortSelect.options[0].textContent = locale === "pt" ? "Console" : "Console";
  sortSelect.options[1].textContent = locale === "pt" ? "Nome" : "Name";
  sortSelect.options[2].textContent = locale === "pt" ? "Origem" : "Source";
  sortSelect.options[3].textContent = locale === "pt" ? "Mais recentes" : "Most recent";
  sortDirectionButton.textContent = sortDirection === "asc" ? "↑ Asc" : "↓ Desc";
  clearButton.textContent = locale === "pt" ? "Limpar filtros" : "Clear filters";
  recentKicker.textContent = locale === "pt" ? "Local" : "Local";
  recentTitle.textContent = locale === "pt" ? "Jogados recentes" : "Recently played";
  defaultLibraryKicker.textContent = locale === "pt" ? "Biblioteca" : "Library";
  defaultLibraryTitle.textContent = locale === "pt" ? "ROMs da biblioteca" : "Library ROMs";
  uploadLabel.textContent = t.upload;
  if (ps1BiosNote) {
    ps1BiosNote.textContent = locale === "pt"
      ? "PS1 requer BIOS scph5501.bin importada na página da ROM."
      : "PS1 requires scph5501.bin BIOS imported on the ROM page.";
  }
  uploadKicker.textContent = locale === "pt" ? "Biblioteca local" : "Local library";
  uploadTitle.textContent = t.upload;
  romFileLabel.textContent = locale === "pt" ? "Arquivo da ROM" : "ROM file";
  uploadInput.accept = ROM_ACCEPT;
  coverFileLabel.textContent = locale === "pt" ? "Capa da ROM" : "ROM cover";
  saveUploadButton.textContent = locale === "pt" ? "Adicionar e abrir" : "Add and open";
  cancelUploadButton.textContent = locale === "pt" ? "Cancelar" : "Cancel";
  githubLink.href = GITHUB_URL;
  githubLink.setAttribute("aria-label", t.github);
  githubLink.setAttribute("title", t.github);
  localeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.locale === locale);
  });
}

function renderGrid() {
  const t = getText(locale);
  const filteredRoms = getFilteredRoms();
  const systemGroups = [...groupRomsBySystem(filteredRoms).entries()]
    .sort(([firstSystem], [secondSystem]) => {
      const orderDelta = getSystemOrder(firstSystem) - getSystemOrder(secondSystem);
      return orderDelta || firstSystem.localeCompare(secondSystem, undefined, { sensitivity: "base" });
    });

  resultsLabel.textContent = `${filteredRoms.length} ${locale === "pt" ? "resultado(s)" : "result(s)"}`;

  if (!systemGroups.length) {
    grid.innerHTML = `<p class="library-empty">${t.empty}</p>`;
    return;
  }

  grid.innerHTML = systemGroups
    .map(([systemName, items]) => {
      const sectionId = getSystemSectionId(systemName);
      const hasCarouselControls = items.length > 4;

      return `
        <section class="library-system-section" data-system-section="${systemName}">
          <header class="library-system-heading">
            <div>
              <span>${systemName}</span>
              <strong>${items.length} ${items.length === 1 ? "ROM" : "ROMs"}</strong>
            </div>
            <div class="library-system-controls" ${hasCarouselControls ? "" : "hidden"}>
              <button type="button" data-system-scroll="${sectionId}" data-scroll-direction="-1" aria-label="Anterior">‹</button>
              <button type="button" data-system-scroll="${sectionId}" data-scroll-direction="1" aria-label="Próximo">›</button>
            </div>
          </header>
          <div class="library-system-carousel rom-row" id="${sectionId}">
            ${items.map((rom) => renderRomCard(rom, t)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderRecentLocalGrid() {
  const t = getText(locale);
  const recentRoms = getRecentLocalRoms();

  recentSection.hidden = recentRoms.length === 0;
  recentControls.hidden = recentRoms.length <= 4;

  if (!recentRoms.length) {
    recentGrid.innerHTML = "";
    return;
  }

  recentGrid.innerHTML = recentRoms
    .map(
      (rom) => `
        <a class="rom-card recent-rom-card" href="${rom.route}" aria-label="${t.openRom}: ${rom.title}">
          <img class="rom-card-image" src="${rom.cover}" alt="${rom.title}" loading="lazy" />
          <span class="rom-card-info">
            <strong>${rom.title}</strong>
            <span>${rom.system}</span>
            <span class="rom-card-badge">${t.localBadge}</span>
          </span>
        </a>
      `,
    )
    .join("");
}

function renderDashboardSaves() {
  const dashboardSaves = getDashboardSaves();
  dashboardSaveCount.textContent = locale === "pt"
    ? `${localSaves.length} save(s) locais`
    : `${localSaves.length} local save${localSaves.length === 1 ? "" : "s"}`;
  dashboardSaveSearch.placeholder = locale === "pt" ? "Buscar por save ou ROM..." : "Search by save or ROM...";
  dashboardSaveSearch.value = dashboardSaveQuery;
  dashboardSaveSystem.innerHTML = [
    `<option value="">${locale === "pt" ? "Todos" : "All"}</option>`,
    ...[...new Set(localSaves.map((save) => getSaveSystem(save)))].sort()
      .map((item) => `<option value="${item}">${item}</option>`),
  ].join("");
  dashboardSaveSystem.value = dashboardSaveSystemFilter;
  dashboardSaveSort.options[0].textContent = locale === "pt" ? "Recentes" : "Recent";
  dashboardSaveSort.options[1].textContent = locale === "pt" ? "Nome" : "Name";
  dashboardSaveSort.options[2].textContent = locale === "pt" ? "Console" : "Console";
  dashboardSaveSort.options[3].textContent = locale === "pt" ? "Tamanho" : "Size";
  dashboardSaveSort.value = dashboardSaveSortBy;
  dashboardSaveClear.textContent = locale === "pt" ? "Limpar" : "Clear";

  if (!localSaves.length) {
    dashboardSaveList.innerHTML = `<p class="library-empty">${locale === "pt" ? "Nenhum save local salvo neste navegador." : "No local saves saved in this browser."}</p>`;
    return;
  }

  if (!dashboardSaves.length) {
    dashboardSaveList.innerHTML = `<p class="library-empty">${locale === "pt" ? "Nenhum save encontrado." : "No saves found."}</p>`;
    return;
  }

  const groups = [...groupRomsBySystem(dashboardSaves.map((save) => ({ ...save, system: getSaveSystem(save) }))).entries()]
    .sort(([firstSystem], [secondSystem]) => {
      const orderDelta = getSystemOrder(firstSystem) - getSystemOrder(secondSystem);
      return orderDelta || firstSystem.localeCompare(secondSystem, undefined, { sensitivity: "base" });
    });

  dashboardSaveList.innerHTML = groups
    .map(([systemName, saves]) => `
      <section class="library-dashboard-save-group">
        <header>
          <span>${systemName}</span>
          <strong>${saves.length} ${saves.length === 1 ? "save" : "saves"}</strong>
        </header>
        <div class="library-dashboard-save-row">
          ${saves.map((save) => {
            const sizeLabel = save.size ? `${(save.size / 1024).toFixed(1)} KB` : (locale === "pt" ? "Tamanho indisponível" : "Size unavailable");
            const dateLabel = save.importedAt
              ? new Date(save.importedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")
              : "";
            const linkedRom = save.linkedRomName || (locale === "pt" ? "ROM não vinculada" : "Unlinked ROM");

            return `
              <article class="library-dashboard-save-item">
                <div>
                  <strong>${save.name || "save"}</strong>
                  <span>${linkedRom}</span>
                  <small>${sizeLabel}${dateLabel ? ` - ${dateLabel}` : ""}</small>
                </div>
                <button type="button" data-dashboard-save-delete="${save.id}">${locale === "pt" ? "Excluir" : "Delete"}</button>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderDashboardTabs() {
  dashboardTabs.forEach((button) => {
    const isActive = button.dataset.dashboardTab === activeDashboardTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  dashboardPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.dashboardPanel === activeDashboardTab);
  });
}

function renderDashboardRomList(dashboardRoms) {
  if (!localRoms.length) {
    dashboardList.innerHTML = `<p class="library-empty">${locale === "pt" ? "Nenhuma ROM local salva neste navegador." : "No local ROMs saved in this browser."}</p>`;
    return;
  }

  if (!dashboardRoms.length) {
    dashboardList.innerHTML = `<p class="library-empty">${locale === "pt" ? "Nenhuma ROM encontrada no painel." : "No ROMs found in the dashboard."}</p>`;
    return;
  }

  const groups = [...groupRomsBySystem(dashboardRoms).entries()]
    .sort(([firstSystem], [secondSystem]) => {
      const orderDelta = getSystemOrder(firstSystem) - getSystemOrder(secondSystem);
      return orderDelta || firstSystem.localeCompare(secondSystem, undefined, { sensitivity: "base" });
    });

  dashboardList.innerHTML = groups
    .map(([systemName, items]) => `
      <section class="library-dashboard-rom-group">
        <header>
          <span>${systemName}</span>
          <strong>${items.length} ${items.length === 1 ? "ROM" : "ROMs"}</strong>
        </header>
        <div class="library-dashboard-rom-row">
          ${items.map((entry) => {
            const title = entry.displayTitle || formatRomTitle(entry.name);
            const version = getVersionFromTitle(title);
            const cover = getCoverUrl(entry, version);
            const systemLabel = entry.system || getSystemLabelByFileName(entry.name);
            const sizeLabel = entry.size ? `${(entry.size / (1024 * 1024)).toFixed(2)} MB` : "Tamanho indisponível";
            const systemOptions = EMULATOR_SYSTEMS
              .map((item) => `<option value="${item.label}" ${item.label === systemLabel ? "selected" : ""}>${item.label}</option>`)
              .join("");
            const supportsPokedex = Boolean(entry.supportsPokedex ?? normalizeText(entry.name).includes("pokemon"));

            return `
              <article class="library-dashboard-item">
                <img src="${cover}" alt="${title}" loading="lazy" />
                <div>
                  <strong>${title}</strong>
                  <span>${systemLabel} - ${sizeLabel}</span>
                  <small>${entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US") : ""}</small>
                </div>
                <div class="library-dashboard-item-actions">
                  <button type="button" data-dashboard-open="${entry.id}">${locale === "pt" ? "Abrir" : "Open"}</button>
                  <button type="button" data-dashboard-cover="${entry.id}">${locale === "pt" ? "Trocar capa" : "Change cover"}</button>
                  <button type="button" data-dashboard-edit="${entry.id}">${locale === "pt" ? "Editar" : "Edit"}</button>
                  <button type="button" class="is-danger" data-dashboard-delete="${entry.id}">${locale === "pt" ? "Excluir" : "Delete"}</button>
                </div>
                <form class="library-dashboard-edit" data-dashboard-edit-form="${entry.id}" hidden>
                  <label>
                    <span>${locale === "pt" ? "Nome exibido" : "Display name"}</span>
                    <input name="displayTitle" type="text" value="${title}" />
                  </label>
                  <label>
                    <span>${locale === "pt" ? "Console" : "Console"}</span>
                    <select name="system">${systemOptions}</select>
                  </label>
                  <label class="library-dashboard-check">
                    <input name="supportsPokedex" type="checkbox" ${supportsPokedex ? "checked" : ""} />
                    <span>${locale === "pt" ? "Mostrar Pokédex integrada" : "Show integrated Pokedex"}</span>
                  </label>
                  <div>
                    <button type="submit">${locale === "pt" ? "Salvar dados" : "Save data"}</button>
                    <button type="button" data-dashboard-edit-cancel="${entry.id}">${locale === "pt" ? "Cancelar" : "Cancel"}</button>
                  </div>
                </form>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderLibraryDashboard() {
  const dashboardRoms = getDashboardRoms();
  const countLabel = localRoms.length === 1 ? "1 ROM local" : `${localRoms.length} ROMs locais`;
  dashboardRomCount.textContent = locale === "pt" ? countLabel : `${localRoms.length} local ROM${localRoms.length === 1 ? "" : "s"}`;
  dashboardStorageNote.textContent = locale === "pt" ? "Salvas neste navegador" : "Saved in this browser";
  dashboardSearch.placeholder = locale === "pt" ? "Buscar por nome ou console..." : "Search by name or console...";
  dashboardSearch.value = dashboardQuery;
  dashboardSystem.innerHTML = [
    `<option value="">${locale === "pt" ? "Todos" : "All"}</option>`,
    ...[...new Set(localRoms.map((entry) => entry.system || getSystemLabelByFileName(entry.name)))].sort()
      .map((item) => `<option value="${item}">${item}</option>`),
  ].join("");
  dashboardSystem.value = dashboardSystemFilter;
  dashboardSort.options[0].textContent = locale === "pt" ? "Recentes" : "Recent";
  dashboardSort.options[1].textContent = locale === "pt" ? "Nome" : "Name";
  dashboardSort.options[2].textContent = locale === "pt" ? "Console" : "Console";
  dashboardSort.options[3].textContent = locale === "pt" ? "Tamanho" : "Size";
  dashboardSort.value = dashboardSortBy;
  dashboardSearchClear.textContent = locale === "pt" ? "Limpar" : "Clear";
  dashboardBulkImport.textContent = locale === "pt" ? "Selecionar ROMs" : "Select ROMs";
  dashboardBulkCovers.textContent = locale === "pt" ? "Selecionar capas" : "Select covers";
  if (!dashboardBulkStatus.dataset.result) {
    dashboardBulkStatus.textContent = locale === "pt"
      ? "Selecione múltiplos arquivos suportados de uma vez."
      : "Select multiple supported files at once.";
  }
  dashboardCleanRoms.textContent = locale === "pt" ? "Limpar ROMs" : "Clear ROMs";
  dashboardCleanSaves.textContent = locale === "pt" ? "Limpar saves" : "Clear saves";
  dashboardCleanBios.textContent = locale === "pt" ? "Limpar BIOS" : "Clear BIOS";
  dashboardCleanAll.textContent = locale === "pt" ? "Limpar tudo" : "Clear all";
  if (!dashboardCleanStatus.dataset.result) {
    dashboardCleanStatus.textContent = locale === "pt"
      ? "Ações permanentes neste navegador."
      : "Permanent actions in this browser.";
  }
  dashboardBackupExport.textContent = locale === "pt" ? "Exportar JSON" : "Export JSON";
  dashboardBackupImport.textContent = locale === "pt" ? "Importar JSON" : "Import JSON";
  if (!dashboardBackupStatus.dataset.result) {
    dashboardBackupStatus.textContent = locale === "pt"
      ? "Exporta dados, capas e ajustes. Nao inclui ROMs ou BIOS."
      : "Exports data, covers, and settings. Does not include ROMs or BIOS.";
  }
  renderDashboardBios();
  renderDashboardSaves();
  renderDashboardTabs();
  renderDashboardRomList(dashboardRoms);
}

function renderDashboardBios() {
  const hasBios = Boolean(ps1BiosRecord?.file);
  dashboardBiosStatus.textContent = hasBios
    ? (locale === "pt" ? "BIOS PS1 importada" : "PS1 BIOS imported")
    : (locale === "pt" ? "BIOS PS1 ausente" : "PS1 BIOS missing");
  dashboardBiosDetail.textContent = hasBios
    ? `${ps1BiosRecord.name} - ${(ps1BiosRecord.size / 1024).toFixed(0)} KB`
    : (locale === "pt" ? "Importe scph5501.bin para iniciar jogos de PS1." : "Import scph5501.bin to start PS1 games.");
  dashboardBiosImport.textContent = hasBios
    ? (locale === "pt" ? "Substituir BIOS" : "Replace BIOS")
    : (locale === "pt" ? "Importar BIOS" : "Import BIOS");
  dashboardBiosDelete.hidden = !hasBios;
  dashboardBiosDelete.textContent = locale === "pt" ? "Remover BIOS" : "Remove BIOS";
}

function render() {
  renderLocale();
  renderSystems();
  renderGrid();
  renderRecentLocalGrid();
  renderLibraryDashboard();
}

async function refreshLocalRoms() {
  try {
    localRoms = await getLocalRoms();
  } catch (error) {
    localRoms = [];
  }

  try {
    ps1BiosRecord = await getPs1BiosRecord();
  } catch (error) {
    ps1BiosRecord = null;
  }

  try {
    localSaves = await getLocalSaves();
  } catch (error) {
    localSaves = [];
  }

  render();
}

searchInput.addEventListener("input", () => {
  query = searchInput.value;
  renderGrid();
});

systemSelect.addEventListener("change", () => {
  system = systemSelect.value;
  renderGrid();
});

sortSelect.addEventListener("change", () => {
  sortBy = sortSelect.value || "console";
  renderGrid();
});

sortDirectionButton.addEventListener("click", () => {
  sortDirection = sortDirection === "asc" ? "desc" : "asc";
  renderLocale();
  renderGrid();
});

clearButton.addEventListener("click", () => {
  query = "";
  system = "";
  sortBy = "console";
  sortDirection = "asc";
  searchInput.value = "";
  systemSelect.value = "";
  sortSelect.value = "console";
  render();
});

dashboardSearch.addEventListener("input", () => {
  dashboardQuery = dashboardSearch.value;
  renderLibraryDashboard();
});

dashboardSystem.addEventListener("change", () => {
  dashboardSystemFilter = dashboardSystem.value;
  renderLibraryDashboard();
});

dashboardSort.addEventListener("change", () => {
  dashboardSortBy = dashboardSort.value || "recent";
  renderLibraryDashboard();
});

dashboardSearchClear.addEventListener("click", () => {
  dashboardQuery = "";
  dashboardSystemFilter = "";
  dashboardSortBy = "recent";
  renderLibraryDashboard();
});

dashboardSaveSearch.addEventListener("input", () => {
  dashboardSaveQuery = dashboardSaveSearch.value;
  renderDashboardSaves();
});

dashboardSaveSystem.addEventListener("change", () => {
  dashboardSaveSystemFilter = dashboardSaveSystem.value;
  renderDashboardSaves();
});

dashboardSaveSort.addEventListener("change", () => {
  dashboardSaveSortBy = dashboardSaveSort.value || "recent";
  renderDashboardSaves();
});

dashboardSaveClear.addEventListener("click", () => {
  dashboardSaveQuery = "";
  dashboardSaveSystemFilter = "";
  dashboardSaveSortBy = "recent";
  renderDashboardSaves();
});

function scrollRecent(direction) {
  const amount = Math.max(recentGrid.clientWidth * 0.82, 260);
  recentGrid.scrollBy({ left: amount * direction, behavior: "smooth" });
}

recentPrev.addEventListener("click", () => scrollRecent(-1));
recentNext.addEventListener("click", () => scrollRecent(1));

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-system-scroll]");

  if (!button) {
    return;
  }

  const carousel = document.querySelector(`#${button.dataset.systemScroll}`);
  const direction = Number(button.dataset.scrollDirection || 1);

  if (!carousel) {
    return;
  }

  const amount = Math.max(carousel.clientWidth, 320);
  carousel.scrollBy({ left: amount * direction, behavior: "smooth" });
});

localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    locale = button.dataset.locale || "pt";
    setLocale(locale);
    render();
  });
});

dashboardTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeDashboardTab = button.dataset.dashboardTab || "roms";
    renderDashboardTabs();
  });
});

function closeUploadDialog() {
  uploadDialog.close();
}

function openLibraryDashboard() {
  libraryDashboard.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-library-dashboard-open");
  renderLibraryDashboard();
}

function closeLibraryDashboard() {
  libraryDashboard.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-library-dashboard-open");
}

function resetUploadPreview() {
  uploadPreview.innerHTML = `<span>${locale === "pt" ? "Sem capa selecionada" : "No cover selected"}</span>`;
}

openUploadButton.addEventListener("click", () => {
  uploadForm.reset();
  resetUploadPreview();
  uploadDialog.showModal();
});

openDashboardButton.addEventListener("click", openLibraryDashboard);
closeDashboardButton.addEventListener("click", closeLibraryDashboard);

libraryDashboard.addEventListener("click", async (event) => {
  if (event.target === libraryDashboard) {
    closeLibraryDashboard();
    return;
  }

  const openButton = event.target.closest("[data-dashboard-open]");
  const coverButton = event.target.closest("[data-dashboard-cover]");
  const editButton = event.target.closest("[data-dashboard-edit]");
  const editCancelButton = event.target.closest("[data-dashboard-edit-cancel]");
  const deleteButton = event.target.closest("[data-dashboard-delete]");

  if (openButton?.dataset.dashboardOpen) {
    window.location.href = `./rom.html?type=local&id=${encodeURIComponent(openButton.dataset.dashboardOpen)}`;
    return;
  }

  if (coverButton?.dataset.dashboardCover) {
    pendingCoverRomId = coverButton.dataset.dashboardCover;
    dashboardCoverInput.value = "";
    dashboardCoverInput.click();
    return;
  }

  if (editButton?.dataset.dashboardEdit) {
    const form = dashboardList.querySelector(`[data-dashboard-edit-form="${CSS.escape(editButton.dataset.dashboardEdit)}"]`);
    if (form) {
      form.hidden = !form.hidden;
    }
    return;
  }

  if (editCancelButton?.dataset.dashboardEditCancel) {
    const form = dashboardList.querySelector(`[data-dashboard-edit-form="${CSS.escape(editCancelButton.dataset.dashboardEditCancel)}"]`);
    if (form) {
      form.hidden = true;
    }
    return;
  }

  if (deleteButton?.dataset.dashboardDelete) {
    const entry = localRoms.find((rom) => rom.id === deleteButton.dataset.dashboardDelete);
    const title = entry ? formatRomTitle(entry.name) : "ROM";
    const confirmed = window.confirm(locale === "pt" ? `Excluir "${title}" da biblioteca local?` : `Delete "${title}" from the local library?`);

    if (!confirmed) {
      return;
    }

    await deleteLocalRom(deleteButton.dataset.dashboardDelete);
    await refreshLocalRoms();
  }
});

dashboardList.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-dashboard-edit-form]");

  if (!form) {
    return;
  }

  event.preventDefault();
  const formData = new FormData(form);
  const romId = form.dataset.dashboardEditForm;
  await updateLocalRomMetadata(romId, {
    displayTitle: formData.get("displayTitle"),
    system: formData.get("system"),
    supportsPokedex: formData.get("supportsPokedex") === "on",
  });
  await refreshLocalRoms();
});

dashboardSaveList.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-dashboard-save-delete]");

  if (!deleteButton?.dataset.dashboardSaveDelete) {
    return;
  }

  const save = localSaves.find((item) => item.id === deleteButton.dataset.dashboardSaveDelete);
  const name = save?.name || "save";
  const confirmed = window.confirm(locale === "pt" ? `Excluir o save "${name}"?` : `Delete the save "${name}"?`);

  if (!confirmed) {
    return;
  }

  await deleteLocalSave(deleteButton.dataset.dashboardSaveDelete);
  await refreshLocalRoms();
});

dashboardCoverInput.addEventListener("change", async () => {
  const [coverFile] = dashboardCoverInput.files || [];

  if (!coverFile || !pendingCoverRomId) {
    return;
  }

  try {
    await updateLocalRomCover(pendingCoverRomId, coverFile);
    await refreshLocalRoms();
  } finally {
    pendingCoverRomId = "";
    dashboardCoverInput.value = "";
  }
});

dashboardBiosImport.addEventListener("click", () => {
  dashboardBiosInput.value = "";
  dashboardBiosInput.click();
});

dashboardBiosInput.addEventListener("change", async () => {
  const [file] = dashboardBiosInput.files || [];

  if (!file) {
    return;
  }

  if (!/^scph5501\.bin$/i.test(file.name)) {
    window.alert(locale === "pt" ? "Use a BIOS PS1 scph5501.bin." : "Use the PS1 BIOS file scph5501.bin.");
    dashboardBiosInput.value = "";
    return;
  }

  await savePs1BiosRecord(file);
  ps1BiosRecord = await getPs1BiosRecord();
  renderDashboardBios();
  dashboardBiosInput.value = "";
});

dashboardBiosDelete.addEventListener("click", async () => {
  const confirmed = window.confirm(locale === "pt" ? "Remover a BIOS PS1 deste navegador?" : "Remove the PS1 BIOS from this browser?");

  if (!confirmed) {
    return;
  }

  await deletePs1BiosRecord();
  ps1BiosRecord = null;
  renderDashboardBios();
});

function setDashboardCleanStatus(messagePt, messageEn) {
  dashboardCleanStatus.dataset.result = "true";
  dashboardCleanStatus.textContent = locale === "pt" ? messagePt : messageEn;
}

function setDashboardBackupStatus(messagePt, messageEn) {
  dashboardBackupStatus.dataset.result = "true";
  dashboardBackupStatus.textContent = locale === "pt" ? messagePt : messageEn;
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Falha ao ler arquivo.")));
    reader.readAsText(file);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Falha ao ler capa.")));
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(dataUrl, fileName = "cover.png") {
  const [header, base64Data] = String(dataUrl || "").split(",");

  if (!header?.startsWith("data:") || !base64Data) {
    return null;
  }

  const mimeType = header.match(/^data:([^;]+);base64$/)?.[1] || "image/png";
  const bytes = atob(base64Data);
  const chunks = new Uint8Array(bytes.length);

  for (let index = 0; index < bytes.length; index += 1) {
    chunks[index] = bytes.charCodeAt(index);
  }

  return new File([chunks], fileName, { type: mimeType });
}

function downloadJsonFile(fileName, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function buildLibraryBackupPayload() {
  const roms = await Promise.all(localRoms.map(async (entry) => ({
    id: entry.id,
    name: entry.name,
    size: entry.size,
    lastModified: entry.file?.lastModified || 0,
    displayTitle: entry.displayTitle || "",
    system: entry.system || getSystemLabelByFileName(entry.name),
    emulatorCore: entry.emulatorCore || "",
    supportsPokedex: Boolean(entry.supportsPokedex ?? normalizeText(entry.name).includes("pokemon")),
    coverDataUrl: entry.coverFile instanceof Blob ? await readFileAsDataUrl(entry.coverFile) : "",
    updatedAt: entry.updatedAt || 0,
  })));

  return {
    app: "OakRom",
    type: "library-metadata",
    version: 1,
    exportedAt: new Date().toISOString(),
    note: "Este backup não inclui arquivos de ROM nem BIOS.",
    roms,
  };
}

function findRomForBackupEntry(backupEntry) {
  return localRoms.find((entry) => entry.id === backupEntry.id)
    || localRoms.find((entry) => entry.name === backupEntry.name && Number(entry.size || 0) === Number(backupEntry.size || 0))
    || null;
}

dashboardCleanRoms.addEventListener("click", async () => {
  const confirmed = window.confirm(locale === "pt"
    ? "Remover todas as ROMs locais deste navegador?"
    : "Remove all local ROMs from this browser?");

  if (!confirmed) {
    return;
  }

  await clearLocalRoms();
  setDashboardCleanStatus("ROMs locais removidas.", "Local ROMs removed.");
  await refreshLocalRoms();
});

dashboardCleanSaves.addEventListener("click", async () => {
  const confirmed = window.confirm(locale === "pt"
    ? "Remover todos os saves importados deste navegador?"
    : "Remove all imported saves from this browser?");

  if (!confirmed) {
    return;
  }

  await clearLocalSaves();
  setDashboardCleanStatus("Saves locais removidos.", "Local saves removed.");
  await refreshLocalRoms();
});

dashboardCleanBios.addEventListener("click", async () => {
  const confirmed = window.confirm(locale === "pt"
    ? "Remover a BIOS PS1 deste navegador?"
    : "Remove the PS1 BIOS from this browser?");

  if (!confirmed) {
    return;
  }

  await deletePs1BiosRecord();
  ps1BiosRecord = null;
  setDashboardCleanStatus("BIOS PS1 removida.", "PS1 BIOS removed.");
  renderDashboardBios();
});

dashboardCleanAll.addEventListener("click", async () => {
  const confirmed = window.confirm(locale === "pt"
    ? "Remover ROMs, saves e BIOS deste navegador?"
    : "Remove ROMs, saves, and BIOS from this browser?");

  if (!confirmed) {
    return;
  }

  await clearLocalLibraryData();
  ps1BiosRecord = null;
  setDashboardCleanStatus("Biblioteca local limpa.", "Local library cleared.");
  await refreshLocalRoms();
});

dashboardBackupExport.addEventListener("click", async () => {
  if (!localRoms.length) {
    setDashboardBackupStatus("Nao ha ROMs locais para exportar.", "There are no local ROMs to export.");
    return;
  }

  const payload = await buildLibraryBackupPayload();
  const dateStamp = new Date().toISOString().slice(0, 10);
  downloadJsonFile(`oakrom-library-${dateStamp}.json`, payload);
  setDashboardBackupStatus("Backup de metadados exportado.", "Metadata backup exported.");
});

dashboardBackupImport.addEventListener("click", () => {
  dashboardBackupInput.value = "";
  dashboardBackupInput.click();
});

dashboardBackupInput.addEventListener("change", async () => {
  const [file] = dashboardBackupInput.files || [];

  if (!file) {
    return;
  }

  try {
    const payload = JSON.parse(await readFileAsText(file));
    const backupRoms = Array.isArray(payload?.roms) ? payload.roms : [];
    let updatedCount = 0;
    let skippedCount = 0;

    for (const backupEntry of backupRoms) {
      const entry = findRomForBackupEntry(backupEntry);

      if (!entry) {
        skippedCount += 1;
        continue;
      }

      await updateLocalRomMetadata(entry.id, {
        displayTitle: backupEntry.displayTitle || entry.displayTitle || formatRomTitle(entry.name),
        system: backupEntry.system || entry.system,
        supportsPokedex: Boolean(backupEntry.supportsPokedex),
      });

      const coverFile = dataUrlToFile(backupEntry.coverDataUrl, `${backupEntry.name || entry.name}-cover.png`);
      if (coverFile) {
        await updateLocalRomCover(entry.id, coverFile);
      }

      updatedCount += 1;
    }

    setDashboardBackupStatus(
      `${updatedCount} ROM(s) atualizada(s). ${skippedCount} sem correspondencia.`,
      `${updatedCount} ROM(s) updated. ${skippedCount} unmatched.`,
    );
    await refreshLocalRoms();
  } catch (error) {
    setDashboardBackupStatus("Backup invalido ou corrompido.", "Invalid or corrupted backup.");
  } finally {
    dashboardBackupInput.value = "";
  }
});

dashboardBulkImport.addEventListener("click", () => {
  dashboardBulkInput.value = "";
  dashboardBulkInput.click();
});

function getComparableFileName(fileName) {
  return normalizeText(String(fileName || "").replace(/\.[^.]+$/i, ""));
}

function findMatchingBulkCover(romFile, coverFiles) {
  const romName = getComparableFileName(romFile.name);

  if (!romName) {
    return null;
  }

  return coverFiles.find((coverFile) => {
    const coverName = getComparableFileName(coverFile.name);
    return coverName && (coverName === romName || coverName.includes(romName) || romName.includes(coverName));
  }) || null;
}

dashboardBulkCovers.addEventListener("click", () => {
  dashboardBulkCoverInput.value = "";
  dashboardBulkCoverInput.click();
});

dashboardBulkCoverInput.addEventListener("change", () => {
  pendingBulkCoverFiles = [...(dashboardBulkCoverInput.files || [])];
  dashboardBulkStatus.dataset.result = "true";
  dashboardBulkStatus.textContent = locale === "pt"
    ? `${pendingBulkCoverFiles.length} capa(s) pronta(s) para parear.`
    : `${pendingBulkCoverFiles.length} cover(s) ready to match.`;
});

dashboardBulkInput.addEventListener("change", async () => {
  const files = [...(dashboardBulkInput.files || [])];

  if (!files.length) {
    return;
  }

  let savedCount = 0;
  let skippedCount = 0;
  let matchedCoverCount = 0;

  dashboardBulkStatus.dataset.result = "true";
  dashboardBulkStatus.textContent = locale === "pt" ? "Salvando ROMs..." : "Saving ROMs...";

  for (const file of files) {
    if (!isSupportedRomFile(file.name)) {
      skippedCount += 1;
      continue;
    }

    try {
      const matchingCover = findMatchingBulkCover(file, pendingBulkCoverFiles);
      await saveLocalRom(file, matchingCover);
      savedCount += 1;
      if (matchingCover) {
        matchedCoverCount += 1;
      }
    } catch (error) {
      skippedCount += 1;
    }
  }

  dashboardBulkStatus.textContent = locale === "pt"
    ? `${savedCount} ROM(s) adicionada(s). ${matchedCoverCount} capa(s) pareada(s). ${skippedCount} ignorada(s).`
    : `${savedCount} ROM(s) added. ${matchedCoverCount} cover(s) matched. ${skippedCount} skipped.`;
  dashboardBulkInput.value = "";
  pendingBulkCoverFiles = [];
  dashboardBulkCoverInput.value = "";
  await refreshLocalRoms();
});

closeUploadButton.addEventListener("click", closeUploadDialog);
cancelUploadButton.addEventListener("click", closeUploadDialog);

coverInput.addEventListener("change", () => {
  const [coverFile] = coverInput.files || [];
  if (!coverFile) {
    resetUploadPreview();
    return;
  }

  const previewUrl = URL.createObjectURL(coverFile);
  uploadPreview.innerHTML = `<img src="${previewUrl}" alt="">`;
});

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const [file] = uploadInput.files || [];
  const [coverFile] = coverInput.files || [];
  if (!file) {
    return;
  }

  if (!isSupportedRomFile(file.name)) {
    window.location.href = `./rom.html?id=upload&name=${encodeURIComponent(file.name)}`;
    return;
  }

  try {
    const saved = await saveLocalRom(file, coverFile || null);
    window.location.href = `./rom.html?type=local&id=${encodeURIComponent(saved.id)}`;
  } catch (error) {
    window.location.href = `./rom.html?id=upload&name=${encodeURIComponent(file.name)}`;
  }
});

render();
await refreshLocalRoms();
