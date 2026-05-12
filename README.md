# OakRom

Projeto web em HTML, CSS e JavaScript vanilla que combina biblioteca local de ROMs, emulador via EmulatorJS, Pokédex principal, Pokédex integrada ao jogo, OakDuo e Oak Challenge.

## Como Executar

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois abra:

- `http://127.0.0.1:5500/`
- `http://127.0.0.1:5500/emulator.html`
- `http://127.0.0.1:5500/oakduo.html`
- `http://127.0.0.1:5500/oak-challenge.html`
- `http://127.0.0.1:5500/oak-rogue.html`
- `http://127.0.0.1:5500/pokedex.html`
- `http://127.0.0.1:5500/como-usar.html`
- `http://127.0.0.1:5500/patch-notes.html`

## Principais Recursos

- Home com biblioteca local de ROMs, capas, filtros, busca e jogados recentes.
- Upload local de ROMs salvo no navegador via IndexedDB.
- Suporte a GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64 e PS1.
- BIOS PS1 `scph5501.bin` importada pelo usuário e mantida apenas no navegador.
- Página dedicada da ROM em `rom.html`, com layout compacto, fullscreen, saves e Pokédex integrada.
- Pokédex principal com busca, filtros, detalhes, sprites, cries e modo embed.
- Pokédex integrada no emulador, no OakDuo e no Oak Challenge.
- OakBit como assistente contextual, com tutorial, atalhos, skins, energia, voz e suporte a fullscreen.
- OakDuo em `oakduo.html`, com dois emuladores lado a lado, fluxo por papel, conexão manual WebRTC, convite por sala, transmissão remota, tela cheia, Pokédex integrada e OakBit fora dos iframes.
- Oak Challenge para runs Pokémon, Nuzlocke e hackroms, com overlay OBS, time, box, rotas, badges, notas e Pokédex integrada.
- Oak Rogue em `oak-rogue.html`, roguelike de ginásios com modo Normal/Nuzlocke, mapa ramificado, combate automático, sinergias por tipo, recrutamento, relíquias separadas por atributo e chefes.
- Favicon próprio em `assets/favicon.svg`.

## OakDuo

Arquivos principais:

- `oakduo.html`
- `oakduo.js`
- `oakduo.css`

Recursos atuais:

- Dois emuladores lado a lado: Jogador 1 no lado esquerdo e Jogador 2 no lado direito.
- Fluxo inicial por papel: `Criar oferta` para o Jogador 1 e `Entrar na sala` para o Jogador 2.
- Cada navegador escolhe ROM, controla e transmite apenas o próprio lado.
- O lado remoto aparece como `Recebendo` quando a transmissão do outro jogador chega.
- Separador central reduzido, sem texto duplicado.
- Card da sala com código, jogador no controle, botão para nova sala, copiar convite e tela cheia.
- Botão `Nova sala` para gerar outro código, atualizar a URL, limpar códigos WebRTC antigos e desconectar a sessão anterior.
- Conexão manual grátis via WebRTC: o Jogador 1 cria a oferta, o Jogador 2 gera a resposta e o Jogador 1 conclui a conexão.
- Estados contextuais para sala, jogadores, ROMs carregadas, conexão, código pronto, transmissão e erros.
- Campos WebRTC com rascunho por sala, restauração após recarregar, limpeza ao desconectar e proteção contra colar o próprio código.
- Botões contextuais sem controles extras: trocar ROM, lado no controle, transmitir apenas quando a sessão e a ROM estiverem prontas.
- Feedback discreto para próximo passo, último evento, código copiado, transmissão remota e ações WebRTC em processamento.
- Sincronização do nome da ROM remota entre os navegadores.
- OakBit único no canto da página, fora dos emuladores.
- Tutorial do OakBit específico para OakDuo, com passos diferentes para o setup e para os emuladores abertos.
- Pokédex integrada em tela cheia com:
  - `P` para abrir/fechar;
  - `V` para comando de voz;
  - `Esc` para fechar;
  - comandos como “abrir pokédex”, “fechar pokédex” e “buscar pikachu na pokédex”.
- Som e animação ao abrir a Pokédex integrada.

Observações:

- O código da sala identifica o convite e ajuda os dois navegadores a usarem a mesma sala visual.
- A conexão real ainda depende da troca manual dos códigos WebRTC.
- Se a conexão cair de verdade, normalmente é preciso refazer oferta, resposta e conclusão da conexão.
- Para testar depois de mudanças no WebRTC, recarregue as duas abas e refaça oferta/resposta antes de transmitir.

## OakBit

OakBit é o mascote assistente do projeto.

Recursos atuais:

- Menu contextual por categorias: Sessão, Saves e OakBit.
- Atalhos para Home, menu da tela, tela cheia, Pokédex, voz da Pokédex, importar save e exportar save.
- Tutorial flutuante contextual na Home, na página da ROM, no OakDuo, no Oak Challenge e no Oak Rogue.
- Modos internos: biblioteca, emulador, Pokédex e alerta.
- Energia visual persistente.
- Memória contextual da sessão atual.
- Skins, humor, silenciar, ocultar e restaurar.
- Modelo Pixel e teste de modelo 3D via Three.js.
- Em fullscreen, o Pixel é usado como modo seguro.
- Integração com OakDuo: tela cheia, Pokédex integrada, voz da Pokédex e tutorial específico.
- Integração com Oak Challenge: OakBit aparece no overlay OBS, abre a Pokédex integrada e oferece tutorial rápido.
- Integração com Oak Rogue: OakBit explica modos, mapa, relíquias, Pokédex da run e regras de Nuzlocke.

Arquivos principais:

- `mascot.js`
- `mascot.css`
- `mascot-3d.js`

## Emulador

Arquivos principais:

- `emulator.html`
- `emulator.js`
- `emulator.css`
- `rom.html`
- `rom-page.js`
- `rom-page.css`

Observações:

- O EmulatorJS é carregado via CDN.
- As ROMs, saves e BIOS ficam no IndexedDB do navegador.
- Não há backend para armazenar ROMs, BIOS ou saves.
- O fullscreen correto é o da interface do projeto.
- A Pokédex integrada abre sobre o emulador em fullscreen.
- PS1 exige BIOS local importada pelo usuário.

## Oak Challenge

Arquivos principais:

- `oak-challenge.html`
- `oak-challenge.js`
- `oak-challenge.css`

Recursos:

- Runs Pokémon com templates para Emerald, FireRed/LeafGreen, Radical Red, Unbound e modo personalizado.
- Dashboard com time, box, encontros, cemitério, badges, notas e timeline.
- Busca de Pokémon via PokeAPI com sprite, tipos e habilidade.
- Limite de 6 Pokémon no time, enviando excedentes para a box.
- Overlay OBS em `oak-challenge.html?obs=1&run=<id>`.
- Emulador próprio no overlay OBS, sem redirecionar para a página da ROM.
- Sprites do time com arraste, zoom individual, base visual e reset de posição.
- Painel de rotas por template da ROM.
- Pokédex integrada no overlay com atalho `P`.
- OakBit no overlay com menu contextual e tutorial rápido.

## Oak Rogue

Arquivos principais:

- `oak-rogue.html`
- `oak-rogue.js`
- `oak-rogue.css`

Recursos:

- Roguelike Pokemon com oito ginasios, Liga, mapa ramificado, NPCs por arena, eventos, treino, move tutor e evolucao.
- Modos Normal e Nuzlocke escolhidos na tela inicial.
- Saves respeitam o modo da run: uma run Normal nao pode ser continuada como Nuzlocke apos F5.
- No Nuzlocke, Pokemon derrotados saem imediatamente do time e deixam de ocupar espaco no popup de batalha.
- Baixas do Nuzlocke ficam registradas em `fallenTeam` e voltam a aparecer na tela de Run perdida.
- Combate automatico com ordem por velocidade, energia, moves, itens equipados, criticos, efeitos de status e troca automatica do ativo.
- Sons via Web Audio para inicio de batalha, golpes, queda de Pokemon e evolucao.
- Animacoes de batalha ficam contidas no modal para nao criar scroll temporario na pagina.
- Reliquias separadas por efeito: dano final, ataque, velocidade, defesa, HP, cura, critico, sinergia e sobrevivencia.
- Preview de reliquias mostra HP, ATK, DEF e VEL separadamente antes de equipar.
- Recrutamento e Pokedex interna da run com vistos/capturados.
- OakBit com tutorial específico para modos, mapa, relíquias, Pokédex da run e Nuzlocke.
- Revisão dos textos visíveis em português na tela e nos popups do Oak Rogue.

## Pokédex

Arquivos principais:

- `pokedex.html`
- `app.js`
- `pokedex.css`

Recursos:

- Busca por nome ou número.
- Filtro por tipo.
- Abas Dados, Stats, Moves, Forms e Lore.
- Sprites animados quando disponíveis.
- Cries da PokeAPI quando disponíveis.
- Comando de voz quando suportado pelo navegador.
- Modo embed para uso dentro do emulador, OakDuo e Oak Challenge.

## Páginas Informativas

- `sobre.html`: apresenta o projeto, privacidade local, consoles e BIOS PS1.
- `como-usar.html`: guia de uso.
- `patch-notes.html`: histórico de versões e melhorias recentes.
- `info-pages.js`: textos dinâmicos e tradução básica BR/US.

## Estrutura Principal

- `index.html`: Home e biblioteca.
- `home-library.js`: lógica da Home, biblioteca local e dashboard.
- `roms.js`: utilitários compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS.
- `server.js`: servidor local e endpoints auxiliares.
- `styles.css`: estilos base.
- `home.css`: Home, dashboard e páginas informativas.
- `oak-rogue.html`, `oak-rogue.js`, `oak-rogue.css`: Oak Rogue.
- `assets/rom-covers/`: capas locais conhecidas.
- `assets/favicon.svg`: ícone da aba do navegador.

## Narração

- Em `localhost`, a narração pode usar ElevenLabs se o `.env` estiver configurado.
- No site online, a narração usa voz nativa do navegador em `pt-BR`, sem depender da ElevenLabs.

## Deploy no Render

Configuração:

- `Runtime`: Node
- `Build Command`: `npm install`
- `Start Command`: `npm start`

O arquivo `render.yaml` pode ajudar o Render a preencher parte da configuração.

## Checklist Antes de Subir para GitHub

Antes de commit ou push, siga `GITHUB_CHECKLIST.md`.

Não subir:

- `.env`
- BIOS de PS1
- pasta `bios/`
- arquivos `.bin`
- ROMs comerciais
- `socialrom_repo/`
- `_backups/`

Sempre conferir:

```powershell
git status --short --ignored
```

## Validações Úteis

```powershell
node --check oakduo.js
node --check oak-challenge.js
node --check app.js
node --check mascot.js
node --check emulator.js
node --check oak-rogue.js
```
