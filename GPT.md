# GPT.md

## VisÃ£o geral

Projeto web simples de PokÃ©dex com frontend estÃ¡tico e um servidor Node.js prÃ³prio.

- A home fica em `index.html`
- A pÃ¡gina de destaques fica em `destaques.html`
- A PokÃ©dex principal fica em `pokedex.html`
- A pÃ¡gina do emulador fica em `emulator.html`
- A lÃ³gica da PokÃ©dex fica em `app.js`
- A lÃ³gica da pÃ¡gina de destaques fica em `destaques.js`
- A lÃ³gica da pÃ¡gina do emulador fica em `emulator.js`
- Os estilos base ficam em `styles.css`
- A home usa `home.css`
- A pÃ¡gina de destaques usa `highlights.css`
- A PokÃ©dex usa `pokedex.css`
- A pÃ¡gina do emulador usa `emulator.css`
- O servidor local e de deploy fica em `server.js`

O projeto consome a PokeAPI no frontend, usa EmulatorJS no frontend para o player GBA e tem um endpoint opcional para narraÃ§Ã£o com ElevenLabs no backend.

## Stack

- HTML
- CSS
- JavaScript vanilla
- Node.js com `http`, sem framework

NÃ£o hÃ¡ React, Vue, build step nem bundler.

## Como rodar

```powershell
npm start
```

Servidor padrÃ£o:

- `http://127.0.0.1:5500`

## Estrutura importante

- `index.html`: landing page/home atual
- `destaques.html`: catÃ¡logo de PokÃ©mon em destaque
- `pokedex.html`: tela principal da PokÃ©dex
- `emulator.html`: tela principal do emulador com HUD e PokÃ©dex integrada
- `app.js`: busca, filtros, tabs, detalhes, Ã¡udio e integraÃ§Ã£o com PokeAPI
- `destaques.js`: busca, filtro, paginaÃ§Ã£o e cards da pÃ¡gina de destaques
- `emulator.js`: boot do EmulatorJS, HUD, fullscreen, voz, biblioteca local de ROMs e PokÃ©dex integrada
- `styles.css`: base compartilhado
- `home.css`: estilos da home
- `highlights.css`: estilos da pÃ¡gina de destaques
- `pokedex.css`: visual da PokÃ©dex
- `emulator.css`: visual da pÃ¡gina do emulador
- `server.js`: servidor estÃ¡tico + endpoint `POST /api/narrate`
- `assets/`: imagens usadas pela home e laterais visuais
- `README.md`: instruÃ§Ãµes gerais de execuÃ§Ã£o/deploy
- `GITHUB_CHECKLIST.md`: checklist obrigatÃ³rio antes de commit/push para GitHub
- `render.yaml`: configuraÃ§Ã£o para Render

## Regra obrigatÃ³ria antes de subir para o GitHub

Sempre que o usuÃ¡rio pedir para commitar ou subir atualizaÃ§Ã£o para o GitHub, ler e seguir `GITHUB_CHECKLIST.md` antes de executar `git add`, `git commit` ou `git push`.

Cuidados principais:

- nunca subir `.env`
- nunca subir BIOS de PS1
- nunca subir pasta `bios/`
- nunca subir arquivos `.bin`
- nunca subir ROMs comerciais
- nunca subir `socialrom_repo/`, que Ã© apenas repositÃ³rio de referÃªncia local
- conferir `git status --short`
- conferir `.gitignore`
- se existir `bios/scph5501.bin`, conferir `git check-ignore -v bios/scph5501.bin`

## Home atual

A home usa:

- fundo cÃ³smico em `assets/cosmic-hero-bg.png`
- logo textual transparente em `assets/logo2.png`
- arte principal em `assets/legendary.png`

Arquivos mais relevantes para mexer na home:

- `index.html`
- `home.css`
- `assets/*`

Classes principais da home:

- `pokemon-home`
- `pokemon-hero`
- `pokemon-hero-inner`
- `pokemon-copy`
- `pokemon-logo-lockup`
- `pokemon-logo-image`
- `pokemon-artboard`
- `pokemon-art-card`
- `pokemon-art-image`

## PÃ¡gina de destaques atual

A pÃ¡gina de destaques fica em `destaques.html`.

Ela depende de:

- `destaques.js`
- `highlights.css`

Funcionalidades relevantes:

- 50 PokÃ©mon por pÃ¡gina
- busca por nome ou nÃºmero
- filtro por tipo
- cards clicÃ¡veis com animaÃ§Ã£o
- paginaÃ§Ã£o entre pÃ¡ginas
- clique no card levando para `pokedex.html?pokemon=...`
- sprites animados quando disponÃ­veis

## PokÃ©dex atual

A PokÃ©dex estÃ¡ em `pokedex.html`.

Ela depende de:

- `app.js`
- `pokedex.css`

Funcionalidades relevantes:

- busca por nome ou nÃºmero
- filtro por tipo
- tabs `Dados`, `Stats`, `Moves`, `Forms` e `Lore`
- sprites animados com prioridade para `black-white animated`, `showdown`, `crystal animated` e fallback estÃ¡tico
- suporte a modo embutido via `?embed=1`
- leitura de query string `?pokemon=...` para abrir um PokÃ©mon direto

ObservaÃ§Ãµes tÃ©cnicas importantes:

- o modo `embed` Ã© ativado em `pokedex.html` via classe `pokedex-embed` no `html`
- `pokedex.css` contÃ©m overrides especÃ­ficos para o modo embutido
- `app.js` usa `IS_EMBED` para compactar alguns blocos como `Moves`

## PÃ¡gina do emulador atual

A pÃ¡gina do emulador fica em `emulator.html`.

Ela depende de:

- `emulator.js`
- `emulator.css`

Funcionalidades relevantes:

- upload local de ROM `.gba`
- boot do EmulatorJS via CDN `4.2.3`
- visual prÃ³prio da pÃ¡gina em volta do player
- botÃ£o externo de fullscreen da UI
- biblioteca local de ROMs via `IndexedDB`
- abrir ROM da biblioteca com um clique
- card superior de `Retomar agora` com a ROM recente principal
- tempo jogado persistido para biblioteca e retomada
- capas locais para ROMs conhecidas e fallback automÃ¡tico para outras ROMs
- gamepad visual nativo do EmulatorJS no mobile
- importaÃ§Ã£o de save por fluxo prÃ³prio da pÃ¡gina via seletor de arquivo
- exportaÃ§Ã£o de save pela aÃ§Ã£o integrada ao EmulatorJS
- saves importados persistidos localmente e vinculados a ROM
- lista de saves recentes na aba `SessÃ£o`, com reaplicar e excluir
- launcher interno reorganizado em `Biblioteca`, `SessÃ£o` e `Controles`
- PokÃ©dex integrada aberta em painel prÃ³prio, usando um `iframe` da `pokedex.html?embed=1`
- atalhos da PokÃ©dex integrada:
  - `P`: abrir ou fechar
  - `V`: ativar voz
  - `Esc`: fechar
- comando de voz restrito a PokÃ©dex integrada:
  - `abrir pokedex`
  - `fechar pokedex`
  - `abrir pokedex e buscar <pokemon>`
  - `buscar <pokemon> na pokedex`

ObservaÃ§Ãµes tÃ©cnicas importantes:

- a biblioteca de ROMs Ã© privada por navegador/dispositivo, sem backend
- o upload deve continuar funcionando mesmo se o `IndexedDB` falhar
- o fullscreen correto da experiÃªncia e o da nossa UI, nÃ£o o interno do EmulatorJS
- no mobile, o fullscreen tenta orientar em paisagem quando o navegador permitir
- no mobile, o projeto usa o gamepad visual nativo do EmulatorJS
- a PokÃ©dex integrada nÃ£o vive mais como implementaÃ§Ã£o separada; ela reutiliza a prÃ³pria `pokedex.html`
- o comando de voz depende de `SpeechRecognition` ou `webkitSpeechRecognition`
- capas locais conhecidas ficam em `assets/rom-covers/`
- capas automÃ¡ticas dependem de `RAWG_API_KEY` via backend em `server.js`

## Backend

`server.js` faz duas coisas:

1. serve arquivos estÃ¡ticos do projeto
2. responde `POST /api/narrate`

ObservaÃ§Ãµes:

- `.env` Ã© carregado manualmente
- ElevenLabs usa:
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_VOICE_ID`
  - `ELEVENLABS_MODEL_ID`

## ConvenÃ§Ãµes Ãºteis

- Projeto pequeno e centralizado: geralmente vale editar poucos arquivos
- O projeto nÃ£o usa mais um CSS Ãºnico para todas as telas
- Cada pÃ¡gina principal carrega seu CSS especÃ­fico alÃ©m do `styles.css`
- Sempre verificar se a mudanÃ§a afeta `index.html`, `destaques.html`, `pokedex.html` ou `emulator.html`
- Assets de imagem ficam em `assets/`
- Antes de trocar imagens da home, confirmar qual asset estÃ¡ realmente em uso no `index.html`

## Arquivos para nunca esquecer

- `index.html`: define quais assets da home estÃ£o realmente sendo usados
- `destaques.html`: entrada da pÃ¡gina de destaques
- `pokedex.html`: nÃ£o confundir com a home
- `emulator.html`: tela do emulador e painel da PokÃ©dex integrada
- `styles.css`: base compartilhado e utilitÃ¡rios
- `home.css`: visual da home
- `highlights.css`: visual da pÃ¡gina de destaques
- `pokedex.css`: visual da PokÃ©dex, incluindo `embed`
- `emulator.css`: visual da pÃ¡gina do emulador
- `app.js`: toda lÃ³gica principal da PokÃ©dex estÃ¡ aqui
- `destaques.js`: toda lÃ³gica da pÃ¡gina de destaques estÃ¡ aqui
- `emulator.js`: toda lÃ³gica do emulador, biblioteca local, voz e PokÃ©dex integrada
- `server.js`: necessÃ¡rio para servir tudo localmente

## Checklist antes de editar

### Se for mexer na home

- confirmar quais imagens estÃ£o em uso em `index.html`
- verificar se a mudanÃ§a Ã© sÃ³ na home ou afeta tambÃ©m destaques ou PokÃ©dex
- revisar as classes `pokemon-*` em `home.css`
- evitar reaproveitar asset antigo por engano

### Se for mexer na pÃ¡gina de destaques

- confirmar se a mudanÃ§a Ã© visual (`destaques.html` e `highlights.css`) ou lÃ³gica (`destaques.js`)
- revisar busca, filtro por tipo, cards e paginaÃ§Ã£o
- lembrar que o clique no card deve abrir a PokÃ©dex com query string
- ao mexer em sprites, verificar fallback animado e fallback estÃ¡tico

### Se for mexer na PokÃ©dex

- confirmar se a mudanÃ§a Ã© estrutural (`pokedex.html`) ou lÃ³gica (`app.js`)
- checar impacto em `pokedex.css`
- preservar busca, filtros e tabs
- se a mudanÃ§a puder afetar o emulador, verificar tambÃ©m o modo `embed`

### Se for mexer no emulador

- confirmar se a mudanÃ§a Ã© estrutural (`emulator.html`) ou lÃ³gica (`emulator.js`)
- checar impacto em `emulator.css`
- preservar boot do EmulatorJS, upload local, capas e biblioteca local
- preservar a PokÃ©dex integrada via `iframe`
- lembrar que a biblioteca de ROMs usa `IndexedDB`
- ao mexer em fullscreen, verificar a tela do emulador e a PokÃ©dex integrada
- ao mexer em voz, verificar `V`, botÃ£o `Voz` e navegadores sem suporte
- ao mexer em tempo jogado, verificar biblioteca, `Retomar agora` e persistÃªncia apÃ³s reload

### Se for mexer em assets

- preferir criar novo arquivo em vez de sobrescrever um asset importante sem necessidade
- registrar no `GPT.md` quando o asset principal da home mudar

## Onde olhar primeiro por tipo de tarefa

### Se a tarefa for visual/home

- `index.html`
- `home.css`
- `assets/`

### Se a tarefa for destaques

- `destaques.html`
- `destaques.js`
- `highlights.css`

### Se a tarefa for PokÃ©dex

- `pokedex.html`
- `app.js`
- `pokedex.css`

### Se a tarefa for emulador

- `emulator.html`
- `emulator.js`
- `emulator.css`

### Se a tarefa for servidor ou deploy

- `server.js`
- `package.json`
- `README.md`
- `render.yaml`

## Riscos conhecidos

- MudanÃ§as grandes no topo da home podem desalinhar o hero
- MudanÃ§as em `app.js` podem afetar vÃ¡rias partes da PokÃ©dex porque a lÃ³gica estÃ¡ concentrada em um Ãºnico arquivo
- MudanÃ§as em `destaques.js` podem quebrar busca, filtro, paginaÃ§Ã£o e links para a PokÃ©dex
- MudanÃ§as em `emulator.js` podem afetar ao mesmo tempo boot da ROM, fullscreen, voz, biblioteca local e PokÃ©dex integrada
- MudanÃ§as em `emulator.js` tambÃ©m podem afetar capas locais, histÃ³rico recente, restauraÃ§Ã£o da ROM ativa e gamepad touch
- O EmulatorJS depende de CDN; falhas de rede podem parecer bug local mesmo quando o frontend estÃ¡ correto
- O `IndexedDB` pode falhar ou estar bloqueado no navegador; o upload nÃ£o deve depender exclusivamente dele
- O reconhecimento de voz varia conforme navegador e permissÃ£o de microfone
- Ã‰ fÃ¡cil quebrar o modo `embed` da PokÃ©dex se editar apenas a tela principal e esquecer os overrides em `pokedex.css`

## Resumo rÃ¡pido

- Home: `index.html` + `home.css` + `assets/`
- Destaques: `destaques.html` + `destaques.js` + `highlights.css`
- PokÃ©dex: `pokedex.html` + `app.js` + `pokedex.css`
- Emulador: `emulator.html` + `emulator.js` + `emulator.css`
- Servidor: `server.js`
