const localeButtons = [...document.querySelectorAll("[data-locale]")];

const content = {
  "/sobre.html": {
    pt: {
      title: "Sobre o Projeto - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "Sobre o Projeto", "Como Usar", "Patch Notes"],
      heroKicker: "OakRom",
      heroTitle: "Sobre o Projeto",
      heroCopy: "OakRom é uma central local para jogar, organizar e transmitir ROMs no navegador, com OakBit, OakDuo, Oak Challenge, Pokédex integrada e uma interface inspirada em arcades.",
      cards: [
        ["Biblioteca local", "A Home organiza ROMs por console, mostra capas, destaca jogos recentes e salva biblioteca, metadados e preferências no próprio navegador."],
        ["Emulador integrado", "Cada jogo abre em uma página dedicada com EmulatorJS, retomada de sessão, tela cheia, modo foco, saves e ferramentas rápidas pelo OakBit."],
        ["OakBit assistente", "OakBit acompanha a navegação, explica recursos, muda de modo, mostra energia, abre menus contextuais e ajuda a controlar emulador, Pokédex e OakDuo."],
        ["OakDuo", "OakDuo coloca dois emuladores lado a lado, com sala, convite, conexão manual, troca de controle, transmissão por lado e Pokédex integrada em tela cheia."],
        ["Oak Challenge", "Oak Challenge foi criado para runs e transmissões, com HUD, overlay OBS, time, box, rotas, mortes, level cap e apoio visual para desafios Pokémon."],
        ["Privacidade e BIOS", "ROMs, saves e BIOS ficam locais no navegador. Para PS1, a BIOS scph5501.bin é importada pelo usuário e não deve ser enviada ao repositório."],
      ],
    },
    en: {
      title: "About the Project - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "About the Project", "How to Use", "Patch Notes"],
      heroKicker: "OakRom",
      heroTitle: "About the Project",
      heroCopy: "OakRom is a local hub for playing, organizing, and streaming ROMs in the browser, with OakBit, OakDuo, Oak Challenge, an integrated Pokedex, and an arcade-inspired interface.",
      cards: [
        ["Local library", "Home organizes ROMs by console, shows covers, highlights recent games, and saves the library, metadata, and preferences in the browser."],
        ["Integrated emulator", "Each game opens on a dedicated EmulatorJS page with session resume, fullscreen, focus mode, saves, and quick tools through OakBit."],
        ["OakBit assistant", "OakBit follows navigation, explains features, changes modes, shows energy, opens contextual menus, and helps control the emulator, Pokedex, and OakDuo."],
        ["OakDuo", "OakDuo places two emulators side by side, with room code, invite, manual connection, control switching, per-side streaming, and fullscreen integrated Pokedex."],
        ["Oak Challenge", "Oak Challenge was built for runs and streams, with HUD, OBS overlay, team, box, routes, deaths, level cap, and visual support for Pokemon challenges."],
        ["Privacy and BIOS", "ROMs, saves, and BIOS stay local in the browser. For PS1, the scph5501.bin BIOS is imported by the user and must not be sent to the repository."],
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
