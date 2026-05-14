# GPT.md

## Visão Geral

OakRom é um projeto web vanilla com servidor Node.js simples. Ele combina:

- Home com biblioteca local de ROMs.
- Pokédex principal.
- Página de destaques.
- Emulador via EmulatorJS.
- Página dedicada de ROM.
- Pokédex integrada ao emulador.
- OakDuo com dois emuladores lado a lado, fluxo por papel e conexão manual WebRTC.
- Mascote OakBit com menu, tutorial, atalhos e comportamento contextual.
- Oak Challenge para runs Pokémon/Nuzlocke/Hackroms com overlay OBS.
- Oak Rogue com roguelike de ginásios, modo Normal/Nuzlocke, combate automático, mapa ramificado e relíquias.

Não há React, Vue, bundler ou build step.

## Stack

- HTML
- CSS
- JavaScript vanilla
- Node.js com `http`
- IndexedDB para ROMs, saves, BIOS e metadados locais
- EmulatorJS via CDN
- Three.js via CDN apenas para teste do modelo 3D do OakBit

## Como Rodar

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Servidor padrão:

- `http://127.0.0.1:5500`
- `http://localhost:5500`

## Estrutura Importante

- `index.html`: Home, biblioteca e dashboard.
- `home-library.js`: lógica da Home, ROMs locais, dashboard, backups e integração com OakBit.
- `home.css`: Home, dashboard, páginas informativas e biblioteca.
- `rom.html`: página dedicada da ROM.
- `rom-page.js`: textos, rota da ROM e modo foco da página dedicada.
- `rom-page.css`: layout da página dedicada da ROM.
- `emulator.html`: tela completa do emulador antigo/launcher.
- `emulator.js`: boot do EmulatorJS, biblioteca local, fullscreen, saves, Pokédex integrada e eventos do OakBit.
- `emulator.css`: layout do emulador e Pokédex integrada.
- `oakduo.html`: tela OakDuo com setup por papel, dois emuladores, sala, conexão manual, OakBit e Pokédex integrada.
- `oakduo.js`: lógica de sala, papel do jogador, WebRTC, transmissão remota, nova sala, Pokédex integrada e sincronização de ROM remota.
- `oakduo.css`: layout do OakDuo, botões, separador central, conexão manual e overlay da Pokédex.
- `oak-challenge.html`: página de runs Pokémon, modo streamer, emulador Challenge e overlay OBS.
- `oak-challenge.js`: lógica de runs, time/box, PokeAPI, rotas, overlay OBS, EmulatorJS direto no overlay e Pokédex integrada.
- `oak-challenge.css`: layout do Oak Challenge, HUD de streamer, overlay OBS, painéis e tutorial.
- `oak-rogue.html`: tela Oak Rogue com escolha de modo, mapa, batalha, escolhas, Pokédex da run e fim da expedição.
- `oak-rogue.js`: lógica do roguelike, Nuzlocke, saves por modo, combate automático, relíquias, mapa, eventos, recrutamento e chefes.
- `oak-rogue.css`: layout do Oak Rogue, cards de rota, batalha, popups, relíquias e responsividade.
- `pokedex.html`: Pokédex principal e modo embed.
- `app.js`: lógica da Pokédex, busca, voz, cries e `postMessage`.
- `pokedex.css`: visual da Pokédex e overrides do modo embed.
- `mascot.js`: OakBit, menu, tutorial, energia, modos, skins, eventos e ações contextuais.
- `mascot.css`: visual do OakBit e tutorial flutuante.
- `mascot-3d.js`: teste 3D procedural com Three.js.
- `roms.js`: utilitários compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS.
- `info-pages.js`: textos dinâmicos e tradução BR/US das páginas informativas.
- `server.js`: servidor estático e endpoints auxiliares.

## Regra Obrigatória Antes de GitHub

Sempre que o usuário pedir commit, push ou publicação no GitHub, ler e seguir `GITHUB_CHECKLIST.md` antes de executar `git add`, `git commit` ou `git push`.

Nunca subir:

- `.env`
- BIOS de PS1
- pasta `bios/`
- arquivos `.bin`
- arquivos `.gba`
- arquivos `.sav`
- ROMs comerciais
- saídas locais de `tools/firered-extraction/`
- `socialrom_repo/`
- `_backups/`

Conferir:

```powershell
git status --short --ignored
```

## OakDuo

OakDuo fica em `oakduo.html` e usa dois `emulator.html?duo=1&player=<n>` dentro de iframes.

Funcionalidades:

- Dois emuladores lado a lado.
- Setup por papel: `Criar oferta` seleciona o Jogador 1/lado esquerdo; `Entrar na sala` seleciona o Jogador 2/lado direito.
- Cada navegador escolhe ROM, controla e transmite apenas o próprio lado.
- O lado remoto deve aparecer como `Recebendo` quando a transmissão do outro navegador chega.
- Separador central fino, sem informações duplicadas.
- Card de sala com código, jogador no controle, nova sala, copiar convite e tela cheia.
- Botão `Nova sala` gera outro código, atualiza a URL, limpa códigos WebRTC antigos e desconecta a sessão anterior.
- Conexão manual por WebRTC: Jogador 1 cria oferta, Jogador 2 gera resposta e Jogador 1 conclui a conexão.
- Transmissão do lado escolhido por `captureStream`.
- Sincronização do status e nome da ROM remota entre navegadores.
- OakBit único no canto da página, fora dos iframes.
- OakBit controla tela cheia, Pokédex integrada e voz da Pokédex.
- Pokédex integrada abre em tela cheia com `P`, fecha com `P` ou `Esc`, e usa `V` para voz.
- O atalho `P` também funciona quando o foco está dentro do iframe da Pokédex.
- Abertura da Pokédex tem som curto e animação.

Observações técnicas:

- O código da sala é visual e usado no convite; não é uma sala persistida em servidor.
- A conexão real depende dos códigos WebRTC manuais.
- Se a conexão cair, normalmente é preciso refazer oferta, resposta e conclusão.
- Depois de alterar WebRTC ou transmissão, recarregue as duas abas e refaça oferta/resposta antes de testar.
- `mascot.js` não monta OakBit dentro dos iframes `duo=1`; o OakBit fica apenas na página OakDuo.

## Emulador e ROM

A página dedicada da ROM (`rom.html`) é o fluxo principal atual para jogar.

Funcionalidades:

- Topo e ações em blocos compactos para evitar barras vazias grandes.
- Menu da tela controlado pelo OakBit.
- Fullscreen.
- Pokédex integrada.
- Controles atualizados por console/core.
- Retomada automática de ROM local depois do F5 quando existe vínculo salvo.
- Importação/exportação de saves.
- PS1 com BIOS local `scph5501.bin`; botões/inputs de BIOS devem ficar ocultos em ROMs que não sejam PS1.
- Botão de voltar Home no menu do OakBit.

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
- ROMs e saves locais no workspace, como `fire-red.gba` e `fire-red.sav`, devem ficar ignorados pelo Git.
- O EmulatorJS depende de CDN.
- O fullscreen usa a interface do projeto.
- No fullscreen, OakBit usa Pixel como modo seguro; o modelo 3D fica bloqueado.
- A Pokédex integrada usa `pokedex.html?embed=1` dentro de iframe.

## Oak Challenge

Oak Challenge é a área dedicada a runs Pokémon, especialmente Nuzlocke, Hardcore e hackroms.

Funcionalidades principais:

- Runs com templates: `custom`, `emerald`, `fireRed`, `radicalRed`, `unbound`.
- Time com limite de `MAX_TEAM_SIZE = 6`; excedentes devem ir para `box`.
- Cadastro/edição de Pokémon via PokeAPI.
- Dashboard com encontros, cemitério, badges, notas e timeline.
- Fraquezas e vantagens calculadas por tipo.
- Rotas por template para marcar encontros pendentes/capturados.
- Backup/importação JSON da run.

Overlay OBS:

- URL: `oak-challenge.html?obs=1&run=<id>`.
- Usa EmulatorJS diretamente no DOM principal do overlay.
- Evitar chamar `render()` ou recriar `.streamer-scene` quando o emulador estiver ativo no OBS.
- Para salvar mudanças no OBS, usar `commitRunChange(run, { refreshTeam })` em vez de `upsertRun(run)`.
- Para atualizar sprites sem reiniciar o emulador, usar `refreshObsTeamOverlay(run)`.
- Sprites do time usam `layout.x`, `layout.y` e `layout.zoom`.
- Pokédex integrada abre no overlay via `pokedex.html?embed=1` e atalho `P`.
- Narração da lore no overlay é feita por `postMessage` da Pokédex embed para o Oak Challenge.
- OakBit aparece no overlay, abre a Pokédex integrada e possui tutorial rápido específico.

## Oak Rogue

Oak Rogue é a experiência roguelike de Pokémon do projeto, separada do emulador e do Oak Challenge.

Funcionalidades principais:

- Tela inicial com modos Normal e Nuzlocke.
- Saves ficam vinculados ao modo escolhido; não permitir continuar uma run Normal como Nuzlocke nem o inverso.
- No Nuzlocke, Pokémon derrotados devem sair imediatamente de `state.team` e de `state.battle.playerTeam`.
- Baixas do Nuzlocke devem ser preservadas em `state.fallenTeam` para a tela final de derrota.
- O popup de batalha deve renderizar apenas o time vivo no lado do jogador para não ocupar espaço com derrotados.
- Antes de remover o último Pokémon derrotado, renderizar HP 0 e animação de queda.
- Na batalha da torre, o lado do jogador deve mostrar somente o Pokémon ativo em campo; o time reserva aparece como Pokébolas animadas abaixo do card.
- Pokébolas de Pokémon derrotados devem ficar cinzas, e o próximo Pokémon vivo deve entrar automaticamente.
- Cards de batalha devem mostrar os tipos do Pokémon com marcadores compactos, sem aumentar o card, deslocar sprites ou tirar o VS do centro.
- A seleção de torre na tela inicial usa carrossel com setas e arraste horizontal.
- Temporariamente, somente a Torre Curta fica disponível; as demais torres devem permanecer visíveis, bloqueadas e sem iniciar ao clicar.
- Mapa ramificado por arenas, oito ginásios e Liga.
- Combate automático com velocidade, energia, moves, itens, status, XP, evolução e troca automática de ativo.
- SFX do Oak Rogue usam Web Audio local para início de batalha, golpes, queda e evolução.
- Efeitos de batalha devem ficar contidos no modal e não podem criar scroll temporário na página.
- Relíquias separadas por efeito: `damage`, `atk`, `spd`, `def`, `hp`, `heal`, `crit`, `synergy` e `sash`.
- `damage` é dano final; `atk`, `spd`, `def` e `hp` alteram atributos separados.
- Preview de relíquias deve mostrar HP, ATK, DEF e VEL separadamente.
- OakBit tem tutorial específico no Oak Rogue para modos, mapa, relíquias, Pokédex da run e Nuzlocke.
- Textos visíveis do Oak Rogue devem ficar em português revisado, com acentos e termos consistentes.
- Validar mudanças com `node --check oak-rogue.js`.

## OakBit

OakBit é o mascote assistente do projeto.

Recursos:

- Menu por categorias: Sessão, Saves e OakBit.
- Ações contextuais: Voltar Home, Menu da tela, Tela cheia, Pokédex, Voz da Pokédex, Importar save e Exportar save.
- Tutorial flutuante contextual.
- Tutorial específico para OakDuo com passos contextuais: setup por papel, códigos WebRTC, ROM, transmissão, estado `Recebendo` e Pokédex.
- Tutorial específico no Oak Challenge.
- Tutorial específico no Oak Rogue para modos, mapa, relíquias, Pokédex da run e Nuzlocke.
- Modos: `library`, `emulator`, `pokedex`, `system-alert`.
- Energia persistente.
- Memória contextual da sessão.
- Skins: `normal`, `shiny`, `tech`, `night` e `secret`.
- Modelo Pixel e modelo 3D experimental.
- Botão de restauração quando oculto.
- Migra para o elemento fullscreen quando necessário.

Ao mexer no OakBit, verificar:

- `mascot.js`
- `mascot.css`
- `mascot-3d.js`
- `oakduo.js` se envolver tela cheia, Pokédex ou voz no OakDuo
- `emulator.js` se envolver emulador/fullscreen/Pokédex
- `home-library.js` se a mudança aparecer no dashboard

## Pokédex

A Pokédex principal possui:

- busca por nome ou número;
- filtro por tipo;
- detalhes, stats, moves, forms e lore;
- sprites animados quando disponíveis;
- cries quando a PokeAPI fornece áudio;
- comando de voz quando suportado;
- modo embed para emulador, OakDuo e Oak Challenge.

No modo embed, `app.js` envia eventos para o parent com `postMessage`, permitindo OakBit reagir a busca, seleção, cry, voz e erros.

## Páginas Informativas

- `sobre.html`: visão do projeto.
- `como-usar.html`: guia atualizado.
- `patch-notes.html`: histórico com OakDuo, Oak Challenge, Oak Rogue, OakBit, emulador, dashboard e multi-console.

## Backend

`server.js`:

1. serve arquivos estáticos;
2. oferece endpoints auxiliares, incluindo narração quando configurada.

ElevenLabs local usa:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_MODEL_ID`

No deploy, a narração pode cair para voz nativa do navegador.

## Checklist Antes de Editar

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
- Conferir que a importação de BIOS PS1 não aparece em sistemas que não sejam PS1.

### OakDuo

- Verificar `oakduo.html`, `oakduo.js`, `oakduo.css` e `mascot.js`.
- Preservar os iframes `emulator.html?duo=1&player=1/2`.
- Não montar OakBit dentro dos iframes duo.
- Conferir tela cheia, OakBit, Pokédex integrada, `P`, `V`, `Esc` e voz.
- Conferir sincronização do nome da ROM remota.
- Conferir que `Nova sala` limpa sinais antigos.

### Oak Challenge

- Evitar `upsertRun(run)` em handlers usados no overlay OBS quando o emulador estiver ativo.
- Não substituir `.streamer-scene` nem `#obs-emulator-player` para atualizar HUD/sprites.
- Depois de mudar dados da run no OBS, usar `commitRunChange`.
- Depois de mudar time/layout no OBS, usar `refreshObsTeamOverlay`.
- Manter limite de 6 Pokémon no time.
- Preservar atalho `P` para Pokédex integrada.

### Oak Rogue

- Verificar `oak-rogue.html`, `oak-rogue.js` e `oak-rogue.css`.
- Preservar a separação entre saves Normal e Nuzlocke no botão Continuar run.
- Em Nuzlocke, manter derrotados fora do time e fora do popup de batalha.
- Preservar `fallenTeam` para mostrar os mortos quando a run for perdida.
- Manter overflow/containment das animações de batalha para evitar scroll.
- Na torre, preservar o layout com um Pokémon ativo por lado, Pokébolas animadas do time abaixo do jogador e VS centralizado entre os cards.
- Ao mexer na tela inicial, manter o carrossel de torres com clique funcional na Torre Curta, setas, arraste e bloqueio das outras torres.
- Ao adicionar relíquias, classificar corretamente entre dano final, ataque, velocidade, defesa, HP, cura, crítico, sinergia ou sobrevivência.
- Manter OakBit contextual no Oak Rogue ao mudar telas ou textos principais.
- Conferir preview de atributos e `node --check oak-rogue.js`.

### Pokédex

- Verificar `pokedex.html`, `app.js` e `pokedex.css`.
- Preservar modo embed.
- Preservar eventos `postMessage`.

### Informativas

- Se adicionar recurso grande, atualizar `como-usar.html`, `patch-notes.html`, `README.md` e este `GPT.md`.

## Riscos Conhecidos

- EmulatorJS depende de CDN.
- IndexedDB pode ser bloqueado pelo navegador.
- SpeechRecognition varia por navegador/permissão.
- O modelo 3D do OakBit depende de Three.js via CDN e não deve ser requisito para jogar.
- Mudanças no fullscreen podem afetar OakBit, Pokédex integrada e controles do EmulatorJS ao mesmo tempo.
- No overlay OBS, re-renderizar a cena inteira pode derrubar o EmulatorJS.
- Backups não incluem ROMs nem BIOS.

## Validações Úteis

```powershell
node --check oakduo.js
node --check mascot.js
node --check mascot-3d.js
node --check emulator.js
node --check home-library.js
node --check oak-challenge.js
node --check oak-rogue.js
node --check app.js
```

Checar páginas:

- `http://localhost:5500/`
- `http://localhost:5500/rom.html?id=fire-red`
- `http://localhost:5500/oakduo.html`
- `http://localhost:5500/oak-challenge.html`
- `http://localhost:5500/oak-challenge.html?obs=1`
- `http://localhost:5500/oak-rogue.html`
- `http://localhost:5500/pokedex.html?embed=1`
- `http://localhost:5500/como-usar.html`
- `http://localhost:5500/patch-notes.html`
