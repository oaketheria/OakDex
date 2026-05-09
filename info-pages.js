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
      heroCopy: "Comece pela Home, organize suas ROMs, abra o emulador, use o OakBit como assistente e escolha entre jogar sozinho, em dupla no OakDuo ou em modo desafio no Oak Challenge.",
      cards: [
        ["Monte sua biblioteca", "Na Home, clique em Adicionar ROM, escolha o arquivo e salve neste navegador. A biblioteca detecta o console, exibe capas, organiza recentes e mantém tudo local."],
        ["Abra o jogo", "Clique em uma capa para abrir a página da ROM. O emulador escolhe o core compatível, tenta retomar a sessão após atualizar a página e mostra controles conforme o console."],
        ["Use OakBit e Pokédex", "Use o menu do OakBit para tela cheia, modo foco, Pokédex, voz, importar save, exportar save e voltar para Home. Em jogos compatíveis, a Pokédex abre integrada ao emulador."],
        ["Jogue em dupla", "No OakDuo, use Nova sala ou Copiar convite, escolha ROM em cada lado, assuma o controle quando necessário e use a conexão manual para trocar oferta e resposta com outra pessoa."],
        ["Faça desafios", "No Oak Challenge, configure run, time, box, rotas, mortes e level cap. O overlay OBS usa essas informações para transmissões e o OakBit ajuda com atalhos e contexto."],
        ["Gerencie dados locais", "Em Gerenciar Biblioteca, cuide de ROMs, saves, BIOS, backup, limpeza e OakBit. Para PS1, importe scph5501.bin. Backups exportam metadados e capas, mas não incluem ROMs nem BIOS."],
      ],
    },
    en: {
      title: "How to Use - OakRom",
      nav: ["Home", "OakDuo", "Oak Challenge", "About the Project", "How to Use", "Patch Notes"],
      heroKicker: "Updated guide",
      heroTitle: "How to Use",
      heroCopy: "Start from Home, organize your ROMs, open the emulator, use OakBit as an assistant, and choose between solo play, OakDuo, or Oak Challenge.",
      cards: [
        ["Build your library", "On Home, click Add ROM, choose the file, and save it in this browser. The library detects the console, shows covers, organizes recent games, and keeps everything local."],
        ["Open the game", "Click a cover to open the ROM page. The emulator chooses the compatible core, tries to resume the session after refresh, and shows controls based on the console."],
        ["Use OakBit and Pokedex", "Use OakBit's menu for fullscreen, focus mode, Pokedex, voice, import save, export save, and return Home. In compatible games, the Pokedex opens integrated with the emulator."],
        ["Play together", "In OakDuo, use New Room or Copy Invite, choose a ROM on each side, take control when needed, and use manual connection to exchange offer and answer with another person."],
        ["Run challenges", "In Oak Challenge, configure run, team, box, routes, deaths, and level cap. The OBS overlay uses that information for streams and OakBit helps with shortcuts and context."],
        ["Manage local data", "In Manage Library, handle ROMs, saves, BIOS, backup, cleanup, and OakBit. For PS1, import scph5501.bin. Backups export metadata and covers, but not ROMs or BIOS."],
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
