import {
  DEFAULT_ROMS,
  formatRomTitle,
  getSystemLabelByFileName,
  getDefaultRomById,
  getLocale,
  getLocalRoms,
  getText,
  setLocale,
} from "./roms.js";

const title = document.querySelector("#session-title");
const kicker = document.querySelector("#session-resume-kicker");
const inlineRom = document.querySelector("#session-inline-rom");
const backLink = document.querySelector("#rom-back-link");
const controlsTitle = document.querySelector("#controls-title");
const saveTitle = document.querySelector("#save-title");
const uploadLabel = document.querySelector("#rom-upload-label");
const runtimeLabel = document.querySelector("#rom-runtime-label");
const emptyTitle = document.querySelector("#rom-empty-title");
const emptyCopy = document.querySelector("#rom-empty-copy");
const voiceButton = document.querySelector("#integrated-dex-voice");
const fullscreenButton = document.querySelector("#dock-fullscreen");
const pokedexButton = document.querySelector("#pokedex-toggle");
const ps1BiosAlert = document.querySelector("#ps1-bios-alert");
const biosImportLabel = document.querySelector("#bios-import-label");

const locale = getLocale();
setLocale(locale);

function getRouteParts() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const romIndex = pathParts.lastIndexOf("rom");

  if (romIndex === -1) {
    const params = new URLSearchParams(window.location.search);
    return { type: params.get("type") || "default", id: params.get("id") || "emerald" };
  }

  if (pathParts[romIndex + 1] === "local") {
    return { type: "local", id: decodeURIComponent(pathParts.slice(romIndex + 2).join("/")) };
  }

  return { type: "default", id: pathParts[romIndex + 1] || "emerald" };
}

function titleFromLocalId(id) {
  const withoutMeta = String(id || "")
    .replace(/-\d+-\d+$/i, "")
    .replace(/\.(gba|gb|gbc|nes|sfc|smc|md|gen|sms|gg|n64|z64|v64|chd|pbp|iso|bin|zip|7z)$/i, "");

  return formatRomTitle(withoutMeta) || "ROM local";
}

async function resolveRom() {
  const route = getRouteParts();

  if (route.type === "local") {
    try {
      const entries = await getLocalRoms();
      const entry = entries.find((item) => item.id === route.id);
      if (entry) {
        return {
          id: entry.id,
          type: "local",
          title: entry.displayTitle || formatRomTitle(entry.name),
          system: entry.system || getSystemLabelByFileName(entry.name),
        };
      }
    } catch (error) {
      return {
        id: route.id,
        type: "local",
        title: titleFromLocalId(route.id),
        system: getSystemLabelByFileName(route.id),
      };
    }

    return {
      id: route.id,
      type: "local",
      title: titleFromLocalId(route.id),
      system: getSystemLabelByFileName(route.id),
    };
  }

  if (route.id === "upload") {
    const params = new URLSearchParams(window.location.search);
    return {
      id: "upload",
      type: "upload",
      title: params.get("name") ? formatRomTitle(params.get("name")) : "ROM local",
      system: params.get("name") ? getSystemLabelByFileName(params.get("name")) : "ROM",
    };
  }

  return getDefaultRomById(route.id) || DEFAULT_ROMS[0];
}

function applyText(rom) {
  const t = getText(locale);
  document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  document.title = `${rom.title} - Oak Emulator`;
  title.textContent = rom.title;
  kicker.textContent = rom.system || "ROM";
  inlineRom.textContent = rom.type === "local" ? rom.title : t.uploadForRom;
  backLink.textContent = t.back;
  controlsTitle.textContent = `${t.controls} - ${rom.system || "ROM"}`;
  saveTitle.textContent = t.save;
  uploadLabel.textContent = t.uploadAnyRom;
  runtimeLabel.textContent = t.runtime;
  emptyTitle.textContent = t.emulatorReady;
  emptyCopy.textContent = t.uploadForRom;
  voiceButton.textContent = t.voice;
  fullscreenButton.textContent = t.fullscreen;
  pokedexButton.textContent = t.pokedex;

  const isPs1 = rom.system === "PS1";
  if (ps1BiosAlert) {
    ps1BiosAlert.hidden = !isPs1;
    ps1BiosAlert.textContent = locale === "pt"
      ? "PS1 precisa da BIOS scph5501.bin. Importe sua BIOS legalmente obtida para iniciar jogos de PlayStation 1."
      : "PS1 needs the scph5501.bin BIOS. Import your legally obtained BIOS to start PlayStation 1 games.";
  }

  if (biosImportLabel) {
    biosImportLabel.classList.toggle("is-attention", isPs1);
  }
}

const rom = await resolveRom();
applyText(rom || DEFAULT_ROMS[0]);

if (rom?.type === "local") {
  window.OAK_AUTO_BOOT_ROM_ID = rom.id;
} else if (rom?.id) {
  window.OAK_DEFAULT_ROM_ID = rom.id;
}
