const localeButtons = [...document.querySelectorAll("[data-locale]")];

const content = {
  "/sobre.html": {
    pt: {
      title: "Sobre o Projeto - OakRom",
      nav: ["Home", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "OakRom",
      heroTitle: "Sobre o Projeto",
      heroCopy: "Uma biblioteca local de ROMs com emulador no navegador, Pokédex integrada e uma interface inspirada em arcades.",
      cards: [
        ["O que é", "OakRom organiza suas ROMs por console, salva sua biblioteca no próprio navegador e abre cada jogo em uma página dedicada com EmulatorJS."],
        ["Privacidade local", "As ROMs, saves e BIOS importadas ficam no armazenamento local do navegador. O projeto não envia esses arquivos para um servidor."],
        ["Consoles", "O projeto suporta GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64 e PS1."],
        ["PS1 com BIOS", "Jogos de PS1 precisam da BIOS scph5501.bin fornecida pelo próprio usuário. Ela é importada pelo site e salva localmente no navegador."],
      ],
    },
    en: {
      title: "About the Project - OakRom",
      nav: ["Home", "About", "How to Use", "Patch Notes"],
      heroKicker: "OakRom",
      heroTitle: "About the Project",
      heroCopy: "A local ROM library with browser emulation, an integrated Pokedex, and an arcade-inspired interface.",
      cards: [
        ["What it is", "OakRom organizes your ROMs by console, saves your library in the browser, and opens each game on a dedicated EmulatorJS page."],
        ["Local privacy", "Imported ROMs, saves, and BIOS files stay in your browser storage. The project does not upload those files to a server."],
        ["Consoles", "The project supports GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64, and PS1."],
        ["PS1 BIOS", "PS1 games need the scph5501.bin BIOS supplied by the user. It is imported through the site and saved locally in the browser."],
      ],
    },
  },
  "/como-usar.html": {
    pt: {
      title: "Como Usar - OakRom",
      nav: ["Home", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "Guia rápido",
      heroTitle: "Como Usar",
      heroCopy: "Adicione suas ROMs, organize por console, abra a página do jogo e use fullscreen para jogar com mais conforto.",
      cards: [
        ["Adicionar ROM", "Na home, clique em Adicionar ROM, escolha o arquivo e salve. O card aparece na biblioteca local, separado pelo console detectado."],
        ["Abrir o jogo", "Clique no card da ROM para abrir a página do jogo. O emulador usa automaticamente o core correto para o console."],
        ["PS1 e BIOS", "Para PlayStation 1, importe a BIOS scph5501.bin na página da ROM. A BIOS fica salva no navegador e vale para os próximos jogos de PS1."],
        ["Saves e fullscreen", "Use os botões de save quando disponíveis e entre em tela cheia para abrir a Pokédex integrada por cima do emulador."],
      ],
    },
    en: {
      title: "How to Use - OakRom",
      nav: ["Home", "About", "How to Use", "Patch Notes"],
      heroKicker: "Quick guide",
      heroTitle: "How to Use",
      heroCopy: "Add your ROMs, organize them by console, open the game page, and use fullscreen for a better play experience.",
      cards: [
        ["Add a ROM", "On the home page, click Add ROM, choose the file, and save it. The card appears in your local library under the detected console."],
        ["Open the game", "Click the ROM card to open the game page. The emulator automatically uses the correct core for that console."],
        ["PS1 and BIOS", "For PlayStation 1, import the scph5501.bin BIOS on the ROM page. The BIOS stays saved in the browser for future PS1 games."],
        ["Saves and fullscreen", "Use save buttons when available and enter fullscreen to open the integrated Pokedex over the emulator."],
      ],
    },
  },
  "/patch-notes.html": {
    pt: {
      title: "Patch Notes - OakRom",
      nav: ["Home", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "Changelog",
      heroTitle: "Patch Notes",
      heroCopy: "Histórico das atualizações do OakRom, com versões, melhorias adicionadas e correções importantes do projeto.",
      cards: [],
    },
    en: {
      title: "Patch Notes - OakRom",
      nav: ["Home", "About", "How to Use", "Patch Notes"],
      heroKicker: "Changelog",
      heroTitle: "Patch Notes",
      heroCopy: "OakRom update history with versions, added improvements, and important project fixes.",
      cards: [],
    },
  },
};

function getLocale() {
  const saved = window.localStorage.getItem("oak-rom-locale");
  if (saved === "pt" || saved === "en") {
    return saved;
  }

  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function setLocale(locale) {
  window.localStorage.setItem("oak-rom-locale", locale);
}

function render(locale = getLocale()) {
  const page = content[window.location.pathname] || content[`/${window.location.pathname.split("/").pop()}`];
  const text = page?.[locale] || page?.pt;

  if (!text) {
    return;
  }

  document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  document.title = text.title;

  document.querySelectorAll(".rom-main-nav a").forEach((link, index) => {
    link.textContent = text.nav[index] || link.textContent;
  });

  const hero = document.querySelector(".info-page-hero");
  hero.querySelector("span").textContent = text.heroKicker;
  hero.querySelector("h1").textContent = text.heroTitle;
  hero.querySelector("p").textContent = text.heroCopy;

  document.querySelectorAll(".info-page-grid article, .info-page-steps article").forEach((card, index) => {
    const [heading, copy] = text.cards[index] || [];
    if (heading) {
      card.querySelector("h2").textContent = heading;
    }
    if (copy) {
      card.querySelector("p").textContent = copy;
    }
  });

  localeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.locale === locale);
  });
}

localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextLocale = button.dataset.locale === "en" ? "en" : "pt";
    setLocale(nextLocale);
    render(nextLocale);
  });
});

render();
