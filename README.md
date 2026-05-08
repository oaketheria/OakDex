# OakRom

Projeto web em HTML, CSS e JavaScript vanilla que combina biblioteca local de ROMs, emulador via EmulatorJS, Pokédex principal e Pokédex integrada ao jogo.

## Como executar

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois abra:

- `http://127.0.0.1:5500/`
- `http://127.0.0.1:5500/pokedex.html`
- `http://127.0.0.1:5500/emulator.html`
- `http://127.0.0.1:5500/oak-challenge.html`
- `http://127.0.0.1:5500/como-usar.html`
- `http://127.0.0.1:5500/patch-notes.html`

## Principais recursos

- Home com nova imagem de fundo arcade neon, biblioteca de ROMs, capas padronizadas e jogados recentes.
- Upload local de ROMs salvo no navegador via IndexedDB.
- Suporte a GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64 e PS1.
- BIOS PS1 `scph5501.bin` importada pelo usuário e mantida apenas no navegador. O botão de BIOS aparece apenas em páginas PS1.
- Página dedicada da ROM em `rom.html`, com fundo novo, topo em blocos compactos e layout moderno.
- Retomada automática de ROM local vinculada à capa depois do F5.
- Controles exibidos conforme o console/core detectado, com área lateral de tutorial/saves mais limpa.
- Saves locais com importar, exportar, reaplicar e remover.
- Dashboard local com abas: ROMs, Saves, BIOS, Backup, OakBit e Limpeza.
- Backup de metadados e capas em JSON. O backup não inclui ROMs nem BIOS.
- Pokédex principal com busca, filtros, detalhes, sprites e modo embed.
- Pokédex integrada no emulador via `pokedex.html?embed=1`.
- Oak Challenge para runs Pokémon, hackroms e Nuzlocke com aba Jogar, importação direta de ROM local, emulador próprio via EmulatorJS, overlay OBS transparente via `oak-challenge.html?obs=1`, badges visuais, painel de rotas por template, sprites arrastáveis com chão, zoom individual e reset de posição, HUD da run, templates, ROM local vinculada, time com busca na PokeAPI, box automática após 6 Pokémon, troca entre time/box no overlay, encontros, badges, level caps, cemitério, notas, linha do tempo, fraquezas/vantagens do time e backup JSON.
- Overlay OBS do Oak Challenge com ajuste de contraste nos campos de texto da tela nativa de configuração de controles do EmulatorJS.
- Pokédex integrada também no overlay OBS do Oak Challenge, com atalho `P`, painel responsivo e narração de lore pelo documento principal.
- Comando de voz na Pokédex integrada, quando o navegador suporta SpeechRecognition.
- Atalhos da Pokédex integrada: `P`, `V` e `Esc`.
- Favicon próprio em `assets/favicon.svg`.

## OakBit

OakBit é o mascote assistente do projeto.

Recursos atuais:

- Menu contextual por categorias: Sessão, Saves e OakBit.
- Atalhos para voltar Home, menu da tela, tela cheia, Pokédex, importar save e exportar save.
- Tutorial flutuante contextual na Home e na página da ROM, atualizado para os novos blocos do emulador.
- Modos internos: biblioteca, emulador, Pokédex e alerta.
- Energia visual persistente.
- Memória contextual da sessão atual.
- Skins, humor, silenciar, ocultar e restaurar.
- Modelo Pixel e teste de modelo 3D via Three.js. Em fullscreen, o Pixel e usado como modo seguro.
- Painel OakBit dentro de Gerenciar Biblioteca com energia, modo, modelo, skin, voz, estado e tutorial.
- Integração com Oak Challenge: OakBit aparece no overlay OBS, abre a Pokédex integrada, centraliza atalhos como tela cheia/Pokédex e oferece tutorial flutuante específico da página.

Arquivos principais do OakBit:

- `mascot.js`
- `mascot.css`
- `mascot-3d.js`

## Emulador

Arquivos principais:

- `rom.html`
- `rom-page.js`
- `rom-page.css`
- `oak-challenge.html`
- `oak-challenge.js`
- `oak-challenge.css`
- `emulator.html`
- `emulator.js`
- `emulator.css`

Observações:

- O EmulatorJS é carregado via CDN.
- As ROMs e saves ficam no IndexedDB do navegador.
- Não há backend para armazenar ROMs, BIOS ou saves.
- O fullscreen correto é o da UI do projeto.
- A Pokédex integrada abre sobre o emulador em fullscreen.
- A tela da ROM usa blocos compactos para status, runtime e importação de ROM, evitando barras vazias grandes.
- O layout tenta evitar scroll residual ao voltar do fullscreen.
- PS1 exige BIOS local importada pelo usuário.

## Oak Challenge

Arquivos principais:

- `oak-challenge.html`
- `oak-challenge.js`
- `oak-challenge.css`

Recursos:

- runs Pokémon com templates para Emerald, FireRed/LeafGreen, Radical Red, Unbound e modo personalizado;
- dashboard com time, box, encontros, cemitério, badges, notas e timeline;
- busca de Pokémon via PokeAPI com sprite, tipos e habilidade;
- limite de 6 Pokémon no time, enviando excedentes para a box;
- overlay OBS em `oak-challenge.html?obs=1&run=<id>`;
- emulador próprio no overlay OBS, sem redirecionar para a página da ROM;
- campos de texto da configuração nativa de controle do EmulatorJS com contraste ajustado no OBS;
- sprites do time com drag, zoom individual, base visual, tooltip de tipos, fraquezas e vantagens;
- botão para resetar o layout dos sprites no overlay;
- painel de rotas por template da ROM para marcar encontros pendentes/capturados;
- Pokédex integrada no overlay com atalho `P`;
- OakBit no overlay com menu contextual e tutorial rápido.

## Pokédex

Arquivos principais:

- `pokedex.html`
- `app.js`
- `pokedex.css`

Recursos:

- busca por nome ou número;
- filtro por tipo;
- abas Dados, Stats, Moves, Forms e Lore;
- sprites animados quando disponíveis;
- cries da PokeAPI quando disponíveis;
- modo embed para uso dentro do emulador.
- modo embed também usado no Oak Challenge, com layout responsivo dentro do painel OBS.

## Páginas informativas

- `sobre.html`: apresenta o projeto, privacidade local, consoles e BIOS PS1.
- `como-usar.html`: guia atualizado de uso.
- `patch-notes.html`: histórico de versões e melhorias recentes.
- `info-pages.js`: textos dinâmicos e tradução básica BR/US.

## Estrutura principal

- `index.html`: Home e biblioteca.
- `home-library.js`: lógica da Home, biblioteca local e dashboard.
- `roms.js`: utilitários compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS.
- `server.js`: servidor local e endpoints auxiliares.
- `styles.css`: estilos base.
- `home.css`: Home, dashboard e páginas informativas.
- `assets/rom-covers/`: capas locais conhecidas.
- `assets/favicon.svg`: ícone da aba do navegador.

## Narração

- Em `localhost`, a narração pode usar ElevenLabs se o `.env` estiver configurado.
- No site online, a narração usa voz nativa do navegador em `pt-BR`, sem depender da ElevenLabs.

## Deploy no Render

O projeto está pronto para deploy no Render com frontend e backend juntos.

Configuração:

- `Runtime`: Node
- `Build Command`: `npm install`
- `Start Command`: `npm start`

O arquivo `render.yaml` pode ajudar o Render a preencher parte da configuração.

## Checklist antes de subir para GitHub

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

## Validações úteis

```powershell
node --check oak-challenge.js
node --check app.js
node --check mascot.js
node --check emulator.js
```
