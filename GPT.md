# GPT.md

## Visão geral

OakRom é um projeto web vanilla com servidor Node.js simples. Ele combina:

- Home com biblioteca local de ROMs.
- Pokédex principal.
- Página de destaques.
- Emulador via EmulatorJS.
- Página dedicada de ROM.
- Pokédex integrada ao emulador.
- Mascote OakBit com menu, tutorial e comportamento contextual.
- Oak Challenge para runs Pokémon/Nuzlocke/Hackroms com overlay OBS.

Não há React, Vue, bundler ou build step.

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

Servidor padrão:

- `http://127.0.0.1:5500`
- `http://localhost:5500`

## Estrutura importante

- `index.html`: Home, biblioteca e dashboard.
- `home-library.js`: lógica da Home, ROMs locais, dashboard, backups e integração com OakBit.
- `home.css`: Home, dashboard, páginas informativas e biblioteca.
- `rom.html`: página dedicada da ROM.
- `rom-page.js`: textos, rota da ROM e modo foco da página dedicada.
- `rom-page.css`: layout da página dedicada da ROM.
- `emulator.html`: tela completa do emulador antigo/launcher.
- `emulator.js`: boot do EmulatorJS, biblioteca local, fullscreen, saves, Pokédex integrada e eventos do OakBit.
- `emulator.css`: layout do emulador e Pokédex integrada.
- `oak-challenge.html`: página de runs Pokémon, modo streamer, emulador Challenge e overlay OBS.
- `oak-challenge.js`: lógica de runs, time/box, PokeAPI, rotas, overlay OBS, EmulatorJS direto no overlay e Pokédex integrada.
- `oak-challenge.css`: layout do Oak Challenge, HUD de streamer, overlay OBS, painéis e tutorial.
- `pokedex.html`: Pokédex principal e modo embed.
- `app.js`: lógica da Pokédex, busca, voz, cries e postMessage para o emulador.
- `pokedex.css`: visual da Pokédex e overrides do modo embed.
- `mascot.js`: OakBit, menu, tutorial, energia, modos, skins e eventos.
- `mascot.css`: visual do OakBit e tutorial flutuante.
- `mascot-3d.js`: teste 3D procedural com Three.js.
- `roms.js`: utilitários compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS.
- `info-pages.js`: textos dinâmicos e tradução BR/US das páginas informativas.
- `server.js`: servidor estático e endpoints auxiliares.

## Regra obrigatória antes de GitHub

Sempre que o usuário pedir commit, push ou publicação no GitHub, ler e seguir `GITHUB_CHECKLIST.md` antes de executar `git add`, `git commit` ou `git push`.

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

- intro retro exibida uma vez por sessão;
- fundo arcade neon em imagem, sem o overlay antigo de Pac-Man/grid;
- área de adicionar ROM;
- jogados recentes;
- biblioteca por console;
- capas padronizadas;
- filtros, busca e ordenação;
- barra de filtros reorganizada para melhor leitura em desktop;
- dashboard local.

O dashboard possui abas:

- ROMs
- Saves
- BIOS
- Backup
- OakBit
- Limpeza

A aba OakBit mostra estado, voz, modelo, modo, energia, skin e skin secreta. Também permite ocultar, silenciar, trocar skin, forçar Pixel, abrir tutorial e resetar preferências.

## Emulador e ROM

A página dedicada da ROM (`rom.html`) é o fluxo principal atual para jogar.

Funcionalidades:

- topo e ações em blocos compactos para evitar barras vazias grandes;
- menu da tela controlado pelo OakBit;
- fullscreen;
- Pokédex integrada;
- controles atualizados por console/core;
- retomada automática de ROM local depois do F5 quando existe vínculo salvo;
- importação/exportação de saves;
- PS1 com BIOS local `scph5501.bin`; botões/inputs de BIOS devem ficar ocultos em ROMs que não sejam PS1;
- botão de voltar Home no menu do OakBit.

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

Observações técnicas:

- ROMs, saves e BIOS ficam apenas no navegador do usuário via IndexedDB.
- O EmulatorJS depende de CDN.
- O fullscreen usa a UI do projeto.
- No fullscreen, OakBit usa Pixel como modo seguro; o modelo 3D fica bloqueado.
- A Pokédex integrada usa `pokedex.html?embed=1` dentro de iframe.

## Oak Challenge

Oak Challenge é a área dedicada a runs Pokémon, especialmente Nuzlocke, Hardcore e Hackroms.

Funcionalidades principais:

- Runs com templates: `custom`, `emerald`, `fireRed`, `radicalRed`, `unbound`.
- Time com limite de `MAX_TEAM_SIZE = 6`; excedentes devem ir para `box`.
- Cadastro/edição de Pokémon via PokeAPI, preenchendo sprite, tipos e habilidade.
- Box visível na aba Time, com sprite e ações para mover entre time e box.
- Dashboard com encontros, cemitério, badges, notas e timeline.
- Fraquezas e vantagens calculadas por tipo.
- Rotas por template para marcar encontros pendentes/capturados.
- Backup/importação JSON da run.

Overlay OBS:

- URL: `oak-challenge.html?obs=1&run=<id>`.
- Usa EmulatorJS diretamente no DOM principal do overlay para preservar menus nativos e configuração de controle.
- Evitar chamar `render()` ou recriar `.streamer-scene` quando o emulador estiver ativo no OBS.
- Para salvar mudanças no OBS, usar `commitRunChange(run, { refreshTeam })` em vez de `upsertRun(run)`.
- Para atualizar sprites sem reiniciar o emulador, usar `refreshObsTeamOverlay(run)`.
- Ações como adicionar Pokémon, mover box/time, morte, reset de layout e troca por box não devem recriar `#obs-emulator-player`.
- Sprites do time usam `layout.x`, `layout.y` e `layout.zoom`; há drag livre, zoom individual e reset geral.
- Pokédex integrada abre no overlay via `pokedex.html?embed=1` e atalho `P`.
- Narração da lore no overlay é feita por `postMessage` da Pokédex embed para o Oak Challenge, que executa `speechSynthesis` no documento pai.
- OakBit aparece no overlay, abre a Pokédex integrada e possui tutorial rápido específico.
- Fullscreen no overlay pode ser bloqueado pelo navegador; não depender do fullscreen nativo do EmulatorJS para a UI do Oak Challenge.
- A tela nativa de configuração de controle do EmulatorJS usa `.ejs_control_body input[type="text"]`; no Oak Challenge há override específico para melhorar contraste desses campos no OBS. Evitar CSS amplo dentro do player.

Ao mexer no Oak Challenge, verificar:

- `oak-challenge.html`
- `oak-challenge.js`
- `oak-challenge.css`
- `pokedex.css` se afetar modo embed
- `app.js` se afetar eventos/narração da Pokédex integrada
- `mascot.js`/`mascot.css` se afetar OakBit

## OakBit

OakBit é o mascote assistente do projeto.

Recursos:

- Menu por categorias: Sessão, Saves e OakBit.
- Ações contextuais: Voltar Home, Menu da tela, Tela cheia, Pokédex, Importar save, Exportar save.
- Tutorial flutuante contextual.
- Tutorial da página da ROM deve apontar para blocos visíveis; botões de tela cheia/Pokédex podem existir como DOM oculto e serem acionados pelo OakBit.
- Tutorial flutuante específico no Oak Challenge acionado pelo menu do OakBit.
- Modos: `library`, `emulator`, `pokedex`, `system-alert`.
- Energia persistente.
- Memória contextual da sessão.
- Skins: `normal`, `shiny`, `tech`, `night` e `secret`.
- Modelo Pixel e modelo 3D experimental.
- Restore button quando oculto.
- Migra para o elemento fullscreen quando necessário.
- No Oak Challenge OBS, deve permanecer disponível sem bloquear o emulador.

Ao mexer no OakBit, verificar:

- `mascot.js`
- `mascot.css`
- `mascot-3d.js`
- `home-library.js` se a mudança aparecer no dashboard
- `emulator.js` se a mudança depender do emulador/fullscreen/Pokédex

## Pokédex

A Pokédex principal possui:

- busca por nome ou número;
- filtro por tipo;
- detalhes, stats, moves, forms e lore;
- sprites animados quando disponíveis;
- cries quando a PokeAPI fornece audio;
- comando de voz quando suportado;
- modo embed para o emulador.

No modo embed, `app.js` envia eventos para o parent com `postMessage`, permitindo OakBit reagir a busca, seleção, cry, voz e erros.

No Oak Challenge, a Pokédex embed também envia `pokedex-narrate-lore` para o parent para a narração rodar fora do iframe.

## Páginas informativas

- `sobre.html`: visão do projeto.
- `como-usar.html`: guia atualizado com OakBit, modo foco, dashboard, saves e PS1.
- `patch-notes.html`: histórico com Oak Challenge, OakBit Assistente, emulador modernizado, dashboard e multi-console.

## Backend

`server.js`:

1. serve arquivos estáticos;
2. oferece endpoints auxiliares, incluindo narração quando configurada.

ElevenLabs local usa:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_MODEL_ID`

No deploy, a narração pode cair para voz nativa do navegador.

## Checklist antes de editar

### Home/dashboard

- Verificar `index.html`, `home-library.js` e `home.css`.
- Conferir se mudanças no dashboard precisam atualizar a aba OakBit.
- Preservar IndexedDB e limpeza/backup.

### Emulador/ROM

- Verificar `rom.html`, `rom-page.js`, `rom-page.css`, `emulator.js` e `emulator.css`.
- Preservar boot do EmulatorJS.
- Preservar fullscreen e Pokédex integrada.
- Testar OakBit em fullscreen.
- Conferir controles por console.
- Conferir que a importação de BIOS PS1 não aparece em GBA/GB/GBC/NES/SNES/N64/Mega Drive/Master System/Game Gear.
- Conferir que sair do fullscreen não deixa scroll residual perceptível.

### Oak Challenge

- Evitar `upsertRun(run)` em handlers usados no overlay OBS quando o emulador estiver ativo.
- Não substituir `.streamer-scene` nem `#obs-emulator-player` para atualizar HUD/sprites.
- Depois de mudar dados da run no OBS, usar `commitRunChange`.
- Depois de mudar time/layout no OBS, usar `refreshObsTeamOverlay`.
- Manter limite de 6 Pokémon no time.
- Preservar atalho `P` para Pokédex integrada.
- Testar que a narração da lore funciona no iframe embed.
- Conferir que o painel de rotas e o reset de sprites não reiniciam o emulador.

### OakBit

- Verificar menu, grupos e labels em `mascot.js`.
- Conferir z-index e fullscreen em `mascot.css`.
- Não habilitar modelo 3D em fullscreen sem testar canvas.
- Se mudar estado do OakBit, atualizar getters usados pelo dashboard.

### Pokédex

- Verificar `pokedex.html`, `app.js` e `pokedex.css`.
- Preservar modo embed.
- Preservar eventos `postMessage` para o emulador.

### Informativas

- Se adicionar recurso grande, atualizar `como-usar.html`, `patch-notes.html`, `README.md` e este `GPT.md`.

## Riscos conhecidos

- EmulatorJS depende de CDN.
- IndexedDB pode ser bloqueado pelo navegador.
- SpeechRecognition varia por navegador/permissão.
- O modelo 3D do OakBit depende de Three.js via CDN e não deve ser usado como requisito para jogar.
- Mudanças no fullscreen podem afetar OakBit, Pokédex integrada e controles do EmulatorJS ao mesmo tempo.
- No overlay OBS, re-renderizar a cena inteira pode derrubar o EmulatorJS.
- Menus nativos do EmulatorJS podem quebrar com CSS amplo aplicado dentro de `.obs-emulator-player`; preferir classes específicas como `.oak-obs-native-toolbar`.
- Para a tela nativa de controles do EmulatorJS, preferir seletor específico `.ejs_control_body input[type="text"]`.
- Backups não incluem ROMs nem BIOS.

## Validações úteis

```powershell
node --check mascot.js
node --check mascot-3d.js
node --check emulator.js
node --check home-library.js
node --check oak-challenge.js
node --check app.js
```

Checar páginas:

- `http://localhost:5500/`
- `http://localhost:5500/rom.html?id=fire-red`
- `http://localhost:5500/oak-challenge.html`
- `http://localhost:5500/oak-challenge.html?obs=1`
- `http://localhost:5500/pokedex.html?embed=1`
- `http://localhost:5500/como-usar.html`
- `http://localhost:5500/patch-notes.html`
