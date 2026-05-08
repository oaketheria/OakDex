const localeButtons = [...document.querySelectorAll("[data-locale]")];

const content = {
  "/sobre.html": {
    pt: {
      title: "Sobre o Projeto - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "OakRom",
      heroTitle: "Sobre o Projeto",
      heroCopy: "Uma biblioteca local de ROMs com emulador no navegador, OakDuo, Oak Challenge, OakBit e Pokédex integrada em uma interface inspirada em arcades.",
      cards: [
        ["O que é", "OakRom organiza suas ROMs por console, salva sua biblioteca no próprio navegador e abre cada jogo em uma página dedicada com EmulatorJS."],
        ["Privacidade local", "As ROMs, saves e BIOS importadas ficam no armazenamento local do navegador. O projeto não envia esses arquivos para um servidor."],
        ["Modos de jogo", "Além da página individual da ROM, o projeto inclui OakDuo para dois jogadores lado a lado e Oak Challenge para runs com HUD, overlay e apoio ao streamer."],
        ["PS1 com BIOS", "Jogos de PS1 precisam da BIOS scph5501.bin fornecida pelo próprio usuário. Ela é importada pelo site e salva localmente no navegador."],
      ],
    },
    en: {
      title: "About the Project - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "About the Project", "How to Use", "Patch Notes"],
      heroKicker: "OakRom",
      heroTitle: "About the Project",
      heroCopy: "A local ROM library with browser emulation, OakDuo, Oak Challenge, OakBit, and an integrated Pokedex in an arcade-inspired interface.",
      cards: [
        ["What it is", "OakRom organizes your ROMs by console, saves your library in the browser, and opens each game on a dedicated EmulatorJS page."],
        ["Local privacy", "Imported ROMs, saves, and BIOS files stay in your browser storage. The project does not upload those files to a server."],
        ["Play modes", "Beyond the individual ROM page, the project includes OakDuo for two side-by-side players and Oak Challenge for runs with HUD, overlay, and streamer support."],
        ["PS1 BIOS", "PS1 games need the scph5501.bin BIOS supplied by the user. It is imported through the site and saved locally in the browser."],
      ],
    },
  },
  "/como-usar.html": {
    pt: {
      title: "Como Usar - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "Guia atualizado",
      heroTitle: "Como Usar",
      heroCopy: "Use a Home para organizar ROMs, abra jogos no emulador, controle a sessão pelo OakBit e use a Pokédex integrada quando o jogo for compatível.",
      cards: [
        ["Adicionar e organizar ROMs", "Na Home, use Adicionar ROM para salvar jogos neste navegador. A biblioteca detecta o console, exibe capas, separa jogos recentes e mantém os cards com tamanho padronizado."],
        ["Gerenciar biblioteca", "O painel Gerenciar Biblioteca reúne ROMs, saves, BIOS, backup, limpeza e configurações do OakBit. A aba OakBit mostra energia, modo, modelo, skin e tutorial."],
        ["Abrir e jogar", "Clique em uma capa para abrir a página da ROM. O emulador tenta retomar a ROM salva automaticamente depois do F5 e atualiza os controles conforme o console detectado."],
        ["Modo foco e tela cheia", "Na página do jogo, use o menu do OakBit para alternar Menu da tela, Tela cheia, Pokédex, importar save, exportar save e voltar para Home."],
        ["OakBit", "O mascote reage ao que você faz, guarda contexto da sessão, mostra energia, muda de modo e oferece um tutorial flutuante pelo próprio menu."],
        ["PS1, saves e backups", "Para PS1, importe a BIOS scph5501.bin. Saves e BIOS ficam locais no navegador. O backup exporta metadados e capas, mas não inclui ROMs nem BIOS."],
      ],
    },
    en: {
      title: "How to Use - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "About the Project", "How to Use", "Patch Notes"],
      heroKicker: "Updated guide",
      heroTitle: "How to Use",
      heroCopy: "Use Home to organize ROMs, open games in the emulator, control the session through OakBit, and use the integrated Pokedex when the game is compatible.",
      cards: [
        ["Add and organize ROMs", "On Home, use Add ROM to save games in this browser. The library detects the console, shows covers, separates recent games, and keeps cards at a consistent size."],
        ["Manage the library", "The Manage Library panel brings together ROMs, saves, BIOS, backup, cleanup, and OakBit settings. The OakBit tab shows energy, mode, model, skin, and tutorial."],
        ["Open and play", "Click a cover to open the ROM page. The emulator tries to resume the saved ROM after refresh and updates controls based on the detected console."],
        ["Focus mode and fullscreen", "On the game page, use OakBit's menu to toggle the screen menu, fullscreen, Pokedex, import save, export save, and return Home."],
        ["OakBit", "The mascot reacts to what you do, keeps session context, shows energy, changes mode, and offers a floating tutorial through its own menu."],
        ["PS1, saves, and backups", "For PS1, import the scph5501.bin BIOS. Saves and BIOS stay local in the browser. Backup exports metadata and covers, but does not include ROMs or BIOS."],
      ],
    },
  },
  "/patch-notes.html": {
    pt: {
      title: "Patch Notes - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "Changelog",
      heroTitle: "Patch Notes",
      heroCopy: "Histórico das atualizações recentes do OakRom, incluindo OakDuo, OakBit, Home, página da ROM, tela do emulador, Pokédex integrada, Oak Challenge e melhorias da biblioteca.",
      cards: [],
    },
    en: {
      title: "Patch Notes - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "About the Project", "How to Use", "Patch Notes"],
      heroKicker: "Changelog",
      heroTitle: "Patch Notes",
      heroCopy: "Recent OakRom update history, including OakDuo, OakBit, Home, the ROM page, emulator screen, integrated Pokedex, Oak Challenge, and library improvements.",
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
