# GPT.md

## Visao geral

OakRom e um projeto web vanilla com servidor Node.js simples. Ele combina:

- Home com biblioteca local de ROMs.
- Pokedex principal.
- Pagina de destaques.
- Emulador via EmulatorJS.
- Pagina dedicada de ROM.
- Pokedex integrada ao emulador.
- Mascote OakBit com menu, tutorial e comportamento contextual.
- Oak Challenge para runs Pokemon/Nuzlocke/Hackroms com overlay OBS.

Nao ha React, Vue, bundler ou build step.

## Stack

- HTML
- CSS
- JavaScript vanilla
- Node.js com `http`
- IndexedDB para ROMs, saves, BIOS e metadados locais
- EmulatorJS via CDN
- Three.js via CDN apenas para teste do modelo 3D do OakBit

## Como rodar

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Servidor padrao:

- `http://127.0.0.1:5500`
- `http://localhost:5500`

## Estrutura importante

- `index.html`: Home, biblioteca e dashboard.
- `home-library.js`: logica da Home, ROMs locais, dashboard, backups e integracao com OakBit.
- `home.css`: Home, dashboard, paginas informativas e biblioteca.
- `rom.html`: pagina dedicada da ROM.
- `rom-page.js`: textos, rota da ROM e modo foco da pagina dedicada.
- `rom-page.css`: layout da pagina dedicada da ROM.
- `emulator.html`: tela completa do emulador antigo/launcher.
- `emulator.js`: boot do EmulatorJS, biblioteca local, fullscreen, saves, Pokedex integrada e eventos do OakBit.
- `emulator.css`: layout do emulador e Pokedex integrada.
- `oak-challenge.html`: pagina de runs Pokemon, modo streamer, emulador Challenge e overlay OBS.
- `oak-challenge.js`: logica de runs, time/box, PokeAPI, rotas, overlay OBS, EmulatorJS direto no overlay e Pokedex integrada.
- `oak-challenge.css`: layout do Oak Challenge, HUD de streamer, overlay OBS, paineis e tutorial.
- `pokedex.html`: Pokedex principal e modo embed.
- `app.js`: logica da Pokedex, busca, voz, cries e postMessage para o emulador.
- `pokedex.css`: visual da Pokedex e overrides do modo embed.
- `mascot.js`: OakBit, menu, tutorial, energia, modos, skins e eventos.
- `mascot.css`: visual do OakBit e tutorial flutuante.
- `mascot-3d.js`: teste 3D procedural com Three.js.
- `roms.js`: utilitarios compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS.
- `info-pages.js`: textos dinamicos e traducao BR/US das paginas informativas.
- `server.js`: servidor estatico e endpoints auxiliares.

## Regra obrigatoria antes de GitHub

Sempre que o usuario pedir commit, push ou publicacao no GitHub, ler e seguir `GITHUB_CHECKLIST.md` antes de executar `git add`, `git commit` ou `git push`.

Nunca subir:

- `.env`
- BIOS de PS1
- pasta `bios/`
- arquivos `.bin`
- ROMs comerciais
- `socialrom_repo/`
- `_backups/`

Conferir:

```powershell
git status --short --ignored
```

## Home e biblioteca

A Home atual possui:

- intro retro exibida uma vez por sessao;
- fundo retro animado;
- area de adicionar ROM;
- jogados recentes;
- biblioteca por console;
- capas padronizadas;
- filtros, busca e ordenacao;
- dashboard local.

O dashboard possui abas:

- ROMs
- Saves
- BIOS
- Backup
- OakBit
- Limpeza

A aba OakBit mostra estado, voz, modelo, modo, energia, skin e skin secreta. Tambem permite ocultar, silenciar, trocar skin, forcar Pixel, abrir tutorial e resetar preferencias.

## Emulador e ROM

A pagina dedicada da ROM (`rom.html`) e o fluxo principal atual para jogar.

Funcionalidades:

- modo foco para esconder paineis;
- menu da tela controlado pelo OakBit;
- fullscreen;
- Pokedex integrada;
- controles atualizados por console/core;
- retomada automatica de ROM local depois do F5 quando existe vinculo salvo;
- importacao/exportacao de saves;
- PS1 com BIOS local `scph5501.bin`;
- botao de voltar Home no menu do OakBit.

Consoles suportados:

- GBA
- GB
- GBC
- NES
- SNES
- Mega Drive
- Master System
- Game Gear
- N64
- PS1

Observacoes tecnicas:

- ROMs, saves e BIOS ficam apenas no navegador do usuario via IndexedDB.
- O EmulatorJS depende de CDN.
- O fullscreen usa a UI do projeto.
- No fullscreen, OakBit usa Pixel como modo seguro; o modelo 3D fica bloqueado.
- A Pokedex integrada usa `pokedex.html?embed=1` dentro de iframe.

## Oak Challenge

Oak Challenge e a area dedicada a runs Pokemon, especialmente Nuzlocke, Hardcore e Hackroms.

Funcionalidades principais:

- Runs com templates: `custom`, `emerald`, `fireRed`, `radicalRed`, `unbound`.
- Time com limite de `MAX_TEAM_SIZE = 6`; excedentes devem ir para `box`.
- Cadastro/edicao de Pokemon via PokeAPI, preenchendo sprite, tipos e habilidade.
- Box visivel na aba Time, com sprite e acoes para mover entre time e box.
- Dashboard com encontros, cemiterio, badges, notas e timeline.
- Fraquezas e vantagens calculadas por tipo.
- Rotas por template para marcar encontros pendentes/capturados.
- Backup/importacao JSON da run.

Overlay OBS:

- URL: `oak-challenge.html?obs=1&run=<id>`.
- Usa EmulatorJS diretamente no DOM principal do overlay para preservar menus nativos e configuracao de controle.
- Evitar chamar `render()` ou recriar `.streamer-scene` quando o emulador estiver ativo no OBS.
- Para salvar mudancas no OBS, usar `commitRunChange(run, { refreshTeam })` em vez de `upsertRun(run)`.
- Para atualizar sprites sem reiniciar o emulador, usar `refreshObsTeamOverlay(run)`.
- Acoes como adicionar Pokemon, mover box/time, morte, reset de layout e troca por box nao devem recriar `#obs-emulator-player`.
- Sprites do time usam `layout.x`, `layout.y` e `layout.zoom`; ha drag livre, zoom individual e reset geral.
- Pokedex integrada abre no overlay via `pokedex.html?embed=1` e atalho `P`.
- Narracao da lore no overlay e feita por `postMessage` da Pokedex embed para o Oak Challenge, que executa `speechSynthesis` no documento pai.
- OakBit aparece no overlay, abre a Pokedex integrada e possui tutorial rapido especifico.
- Fullscreen no overlay pode ser bloqueado pelo navegador; nao depender do fullscreen nativo do EmulatorJS para a UI do Oak Challenge.

Ao mexer no Oak Challenge, verificar:

- `oak-challenge.html`
- `oak-challenge.js`
- `oak-challenge.css`
- `pokedex.css` se afetar modo embed
- `app.js` se afetar eventos/narracao da Pokedex integrada
- `mascot.js`/`mascot.css` se afetar OakBit

## OakBit

OakBit e o mascote assistente do projeto.

Recursos:

- Menu por categorias: Sessao, Saves e OakBit.
- Acoes contextuais: Voltar Home, Menu da tela, Tela cheia, Pokedex, Importar save, Exportar save.
- Tutorial flutuante contextual.
- Tutorial flutuante especifico no Oak Challenge acionado pelo menu do OakBit.
- Modos: `library`, `emulator`, `pokedex`, `system-alert`.
- Energia persistente.
- Memoria contextual da sessao.
- Skins: `normal`, `shiny`, `tech`, `night` e `secret`.
- Modelo Pixel e modelo 3D experimental.
- Restore button quando oculto.
- Migra para o elemento fullscreen quando necessario.
- No Oak Challenge OBS, deve permanecer disponivel sem bloquear o emulador.

Ao mexer no OakBit, verificar:

- `mascot.js`
- `mascot.css`
- `mascot-3d.js`
- `home-library.js` se a mudanca aparecer no dashboard
- `emulator.js` se a mudanca depender do emulador/fullscreen/Pokedex

## Pokedex

A Pokedex principal possui:

- busca por nome ou numero;
- filtro por tipo;
- detalhes, stats, moves, forms e lore;
- sprites animados quando disponiveis;
- cries quando a PokeAPI fornece audio;
- comando de voz quando suportado;
- modo embed para o emulador.

No modo embed, `app.js` envia eventos para o parent com `postMessage`, permitindo OakBit reagir a busca, selecao, cry, voz e erros.

No Oak Challenge, a Pokedex embed tambem envia `pokedex-narrate-lore` para o parent para a narracao rodar fora do iframe.

## Paginas informativas

- `sobre.html`: visao do projeto.
- `como-usar.html`: guia atualizado com OakBit, modo foco, dashboard, saves e PS1.
- `patch-notes.html`: historico com Oak Challenge, OakBit Assistente, emulador modernizado, dashboard e multi-console.

## Backend

`server.js`:

1. serve arquivos estaticos;
2. oferece endpoints auxiliares, incluindo narracao quando configurada.

ElevenLabs local usa:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_MODEL_ID`

No deploy, a narracao pode cair para voz nativa do navegador.

## Checklist antes de editar

### Home/dashboard

- Verificar `index.html`, `home-library.js` e `home.css`.
- Conferir se mudancas no dashboard precisam atualizar a aba OakBit.
- Preservar IndexedDB e limpeza/backup.

### Emulador/ROM

- Verificar `rom.html`, `rom-page.js`, `rom-page.css`, `emulator.js` e `emulator.css`.
- Preservar boot do EmulatorJS.
- Preservar fullscreen e Pokedex integrada.
- Testar OakBit em fullscreen.
- Conferir controles por console.

### Oak Challenge

- Evitar `upsertRun(run)` em handlers usados no overlay OBS quando o emulador estiver ativo.
- Nao substituir `.streamer-scene` nem `#obs-emulator-player` para atualizar HUD/sprites.
- Depois de mudar dados da run no OBS, usar `commitRunChange`.
- Depois de mudar time/layout no OBS, usar `refreshObsTeamOverlay`.
- Manter limite de 6 Pokemon no time.
- Preservar atalho `P` para Pokedex integrada.
- Testar que narracao da lore funciona no iframe embed.
- Conferir que o painel de rotas e o reset de sprites nao reiniciam o emulador.

### OakBit

- Verificar menu, grupos e labels em `mascot.js`.
- Conferir z-index e fullscreen em `mascot.css`.
- Nao habilitar modelo 3D em fullscreen sem testar canvas.
- Se mudar estado do OakBit, atualizar getters usados pelo dashboard.

### Pokedex

- Verificar `pokedex.html`, `app.js` e `pokedex.css`.
- Preservar modo embed.
- Preservar eventos `postMessage` para o emulador.

### Informativas

- Se adicionar recurso grande, atualizar `como-usar.html`, `patch-notes.html`, `README.md` e este `GPT.md`.

## Riscos conhecidos

- EmulatorJS depende de CDN.
- IndexedDB pode ser bloqueado pelo navegador.
- SpeechRecognition varia por navegador/permissao.
- O modelo 3D do OakBit depende de Three.js via CDN e nao deve ser usado como requisito para jogar.
- Mudancas no fullscreen podem afetar OakBit, Pokedex integrada e controles do EmulatorJS ao mesmo tempo.
- No overlay OBS, re-renderizar a cena inteira pode derrubar o EmulatorJS.
- Menus nativos do EmulatorJS podem quebrar com CSS amplo aplicado dentro de `.obs-emulator-player`; preferir classes especificas como `.oak-obs-native-toolbar`.
- Backups nao incluem ROMs nem BIOS.

## Validacoes uteis

```powershell
node --check mascot.js
node --check mascot-3d.js
node --check emulator.js
node --check home-library.js
node --check oak-challenge.js
node --check app.js
```

Checar paginas:

- `http://localhost:5500/`
- `http://localhost:5500/rom.html?id=fire-red`
- `http://localhost:5500/oak-challenge.html`
- `http://localhost:5500/oak-challenge.html?obs=1`
- `http://localhost:5500/pokedex.html?embed=1`
- `http://localhost:5500/como-usar.html`
- `http://localhost:5500/patch-notes.html`
