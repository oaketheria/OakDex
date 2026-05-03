# OakRom

Projeto web em HTML, CSS e JavaScript vanilla que combina biblioteca local de ROMs, emulador via EmulatorJS, Pokedex principal e Pokedex integrada ao jogo.

## Como executar

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois abra:

- `http://127.0.0.1:5500/`
- `http://127.0.0.1:5500/pokedex.html`
- `http://127.0.0.1:5500/emulator.html`
- `http://127.0.0.1:5500/como-usar.html`
- `http://127.0.0.1:5500/patch-notes.html`

## Principais recursos

- Home com biblioteca de ROMs, capas padronizadas e jogados recentes.
- Upload local de ROMs salvo no navegador via IndexedDB.
- Suporte a GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64 e PS1.
- BIOS PS1 `scph5501.bin` importada pelo usuario e mantida apenas no navegador.
- Pagina dedicada da ROM em `rom.html`, com modo foco e layout moderno.
- Retomada automatica de ROM local vinculada a capa depois do F5.
- Controles exibidos conforme o console/core detectado.
- Saves locais com importar, exportar, reaplicar e remover.
- Dashboard local com abas: ROMs, Saves, BIOS, Backup, OakBit e Limpeza.
- Backup de metadados e capas em JSON. O backup nao inclui ROMs nem BIOS.
- Pokedex principal com busca, filtros, detalhes, sprites e modo embed.
- Pokedex integrada no emulador via `pokedex.html?embed=1`.
- Comando de voz na Pokedex integrada, quando o navegador suporta SpeechRecognition.
- Atalhos da Pokedex integrada: `P`, `V` e `Esc`.
- Favicon proprio em `assets/favicon.svg`.

## OakBit

OakBit e o mascote assistente do projeto.

Recursos atuais:

- Menu contextual por categorias: Sessao, Saves e OakBit.
- Atalhos para voltar Home, menu da tela, tela cheia, Pokedex, importar save e exportar save.
- Tutorial flutuante contextual na Home e na pagina da ROM.
- Modos internos: biblioteca, emulador, Pokedex e alerta.
- Energia visual persistente.
- Memoria contextual da sessao atual.
- Skins, humor, silenciar, ocultar e restaurar.
- Modelo Pixel e teste de modelo 3D via Three.js. Em fullscreen, o Pixel e usado como modo seguro.
- Painel OakBit dentro de Gerenciar Biblioteca com energia, modo, modelo, skin, voz, estado e tutorial.

Arquivos principais do OakBit:

- `mascot.js`
- `mascot.css`
- `mascot-3d.js`

## Emulador

Arquivos principais:

- `rom.html`
- `rom-page.js`
- `rom-page.css`
- `emulator.html`
- `emulator.js`
- `emulator.css`

Observacoes:

- O EmulatorJS e carregado via CDN.
- As ROMs e saves ficam no IndexedDB do navegador.
- Nao ha backend para armazenar ROMs, BIOS ou saves.
- O fullscreen correto e o da UI do projeto.
- A Pokedex integrada abre sobre o emulador em fullscreen.
- PS1 exige BIOS local importada pelo usuario.

## Pokedex

Arquivos principais:

- `pokedex.html`
- `app.js`
- `pokedex.css`

Recursos:

- busca por nome ou numero;
- filtro por tipo;
- abas Dados, Stats, Moves, Forms e Lore;
- sprites animados quando disponiveis;
- cries da PokeAPI quando disponiveis;
- modo embed para uso dentro do emulador.

## Paginas informativas

- `sobre.html`: apresenta o projeto, privacidade local, consoles e BIOS PS1.
- `como-usar.html`: guia atualizado de uso.
- `patch-notes.html`: historico de versoes e melhorias recentes.
- `info-pages.js`: textos dinamicos e traducao basica BR/US.

## Estrutura principal

- `index.html`: Home e biblioteca.
- `home-library.js`: logica da Home, biblioteca local e dashboard.
- `roms.js`: utilitarios compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS.
- `server.js`: servidor local e endpoints auxiliares.
- `styles.css`: estilos base.
- `home.css`: Home, dashboard e paginas informativas.
- `assets/rom-covers/`: capas locais conhecidas.
- `assets/favicon.svg`: icone da aba do navegador.

## Narracao

- Em `localhost`, a narracao pode usar ElevenLabs se o `.env` estiver configurado.
- No site online, a narracao usa voz nativa do navegador em `pt-BR`, sem depender da ElevenLabs.

## Deploy no Render

O projeto esta pronto para deploy no Render com frontend e backend juntos.

Configuracao:

- `Runtime`: Node
- `Build Command`: `npm install`
- `Start Command`: `npm start`

O arquivo `render.yaml` pode ajudar o Render a preencher parte da configuracao.

## Checklist antes de subir para GitHub

Antes de commit ou push, siga `GITHUB_CHECKLIST.md`.

Nao subir:

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
