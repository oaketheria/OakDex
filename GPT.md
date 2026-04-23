# GPT.md

## Visao geral

Projeto web simples de PokeDex com frontend estatico e um servidor Node.js proprio.

- A home fica em `index.html`
- A pagina de destaques fica em `destaques.html`
- A PokeDex principal fica em `pokedex.html`
- A pagina do emulador fica em `emulator.html`
- A logica da PokeDex fica em `app.js`
- A logica da pagina de destaques fica em `destaques.js`
- A logica da pagina do emulador fica em `emulator.js`
- Os estilos base ficam em `styles.css`
- A home usa `home.css`
- A pagina de destaques usa `highlights.css`
- A PokeDex usa `pokedex.css`
- A pagina do emulador usa `emulator.css`
- O servidor local e de deploy fica em `server.js`

O projeto consome a PokeAPI no frontend, usa EmulatorJS no frontend para o player GBA e tem um endpoint opcional para narracao com ElevenLabs no backend.

## Stack

- HTML
- CSS
- JavaScript vanilla
- Node.js com `http`, sem framework

Nao ha React, Vue, build step nem bundler.

## Como rodar

```powershell
npm start
```

Servidor padrao:

- `http://127.0.0.1:5500`

## Estrutura importante

- `index.html`: landing page/home atual
- `destaques.html`: catalogo de Pokemon em destaque
- `pokedex.html`: tela principal da PokeDex
- `emulator.html`: tela principal do emulador com HUD e Pokedex integrada
- `app.js`: busca, filtros, tabs, detalhes, audio e integracao com PokeAPI
- `destaques.js`: busca, filtro, paginacao e cards da pagina de destaques
- `emulator.js`: boot do EmulatorJS, HUD, fullscreen, voz, biblioteca local de ROMs e Pokedex integrada
- `styles.css`: base compartilhado
- `home.css`: estilos da home
- `highlights.css`: estilos da pagina de destaques
- `pokedex.css`: visual da PokeDex
- `emulator.css`: visual da pagina do emulador
- `server.js`: servidor estatico + endpoint `POST /api/narrate`
- `assets/`: imagens usadas pela home e laterais visuais
- `README.md`: instrucoes gerais de execucao/deploy
- `render.yaml`: configuracao para Render

## Home atual

A home usa:

- fundo cosmico em `assets/cosmic-hero-bg.png`
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

## Pagina de destaques atual

A pagina de destaques fica em `destaques.html`.

Ela depende de:

- `destaques.js`
- `highlights.css`

Funcionalidades relevantes:

- 50 Pokemon por pagina
- busca por nome ou numero
- filtro por tipo
- cards clicaveis com animacao
- paginacao entre paginas
- clique no card levando para `pokedex.html?pokemon=...`
- sprites animados quando disponiveis

## PokeDex atual

A PokeDex esta em `pokedex.html`.

Ela depende de:

- `app.js`
- `pokedex.css`

Funcionalidades relevantes:

- busca por nome ou numero
- filtro por tipo
- tabs `Dados`, `Stats`, `Moves`, `Forms` e `Lore`
- sprites animados com prioridade para `black-white animated`, `showdown`, `crystal animated` e fallback estatico
- suporte a modo embutido via `?embed=1`
- leitura de query string `?pokemon=...` para abrir um Pokemon direto

Observacoes tecnicas importantes:

- o modo `embed` e ativado em `pokedex.html` via classe `pokedex-embed` no `html`
- `pokedex.css` contem overrides especificos para o modo embutido
- `app.js` usa `IS_EMBED` para compactar alguns blocos como `Moves`

## Pagina do emulador atual

A pagina do emulador fica em `emulator.html`.

Ela depende de:

- `emulator.js`
- `emulator.css`

Funcionalidades relevantes:

- upload local de ROM `.gba`
- boot do EmulatorJS via CDN `4.2.3`
- visual proprio da pagina em volta do player
- botao externo de fullscreen da UI
- biblioteca local de ROMs via `IndexedDB`
- abrir ROM da biblioteca com um clique
- card superior de `Retomar agora` com a ROM recente principal
- tempo jogado persistido para biblioteca e retomada
- capas locais para ROMs conhecidas e fallback automatico para outras ROMs
- gamepad visual nativo do EmulatorJS no mobile
- importacao de save por fluxo proprio da pagina via seletor de arquivo
- exportacao de save pela acao integrada ao EmulatorJS
- saves importados persistidos localmente e vinculados a ROM
- lista de saves recentes na aba `Sessao`, com reaplicar e excluir
- launcher interno reorganizado em `Biblioteca`, `Sessao` e `Controles`
- Pokedex integrada aberta em painel proprio, usando um `iframe` da `pokedex.html?embed=1`
- atalhos da Pokedex integrada:
  - `P`: abrir ou fechar
  - `V`: ativar voz
  - `Esc`: fechar
- comando de voz restrito a Pokedex integrada:
  - `abrir pokedex`
  - `fechar pokedex`
  - `abrir pokedex e buscar <pokemon>`
  - `buscar <pokemon> na pokedex`

Observacoes tecnicas importantes:

- a biblioteca de ROMs e privada por navegador/dispositivo, sem backend
- o upload deve continuar funcionando mesmo se o `IndexedDB` falhar
- o fullscreen correto da experiencia e o da nossa UI, nao o interno do EmulatorJS
- no mobile, o fullscreen tenta orientar em paisagem quando o navegador permitir
- no mobile, o projeto usa o gamepad visual nativo do EmulatorJS
- a Pokedex integrada nao vive mais como implementacao separada; ela reutiliza a propria `pokedex.html`
- o comando de voz depende de `SpeechRecognition` ou `webkitSpeechRecognition`
- capas locais conhecidas ficam em `assets/rom-covers/`
- capas automaticas dependem de `RAWG_API_KEY` via backend em `server.js`

## Backend

`server.js` faz duas coisas:

1. serve arquivos estaticos do projeto
2. responde `POST /api/narrate`

Observacoes:

- `.env` e carregado manualmente
- ElevenLabs usa:
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_VOICE_ID`
  - `ELEVENLABS_MODEL_ID`

## Convencoes uteis

- Projeto pequeno e centralizado: geralmente vale editar poucos arquivos
- O projeto nao usa mais um CSS unico para todas as telas
- Cada pagina principal carrega seu CSS especifico alem do `styles.css`
- Sempre verificar se a mudanca afeta `index.html`, `destaques.html`, `pokedex.html` ou `emulator.html`
- Assets de imagem ficam em `assets/`
- Antes de trocar imagens da home, confirmar qual asset esta realmente em uso no `index.html`

## Arquivos para nunca esquecer

- `index.html`: define quais assets da home estao realmente sendo usados
- `destaques.html`: entrada da pagina de destaques
- `pokedex.html`: nao confundir com a home
- `emulator.html`: tela do emulador e painel da Pokedex integrada
- `styles.css`: base compartilhado e utilitarios
- `home.css`: visual da home
- `highlights.css`: visual da pagina de destaques
- `pokedex.css`: visual da PokeDex, incluindo `embed`
- `emulator.css`: visual da pagina do emulador
- `app.js`: toda logica principal da PokeDex esta aqui
- `destaques.js`: toda logica da pagina de destaques esta aqui
- `emulator.js`: toda logica do emulador, biblioteca local, voz e Pokedex integrada
- `server.js`: necessario para servir tudo localmente

## Checklist antes de editar

### Se for mexer na home

- confirmar quais imagens estao em uso em `index.html`
- verificar se a mudanca e so na home ou afeta tambem destaques ou PokeDex
- revisar as classes `pokemon-*` em `home.css`
- evitar reaproveitar asset antigo por engano

### Se for mexer na pagina de destaques

- confirmar se a mudanca e visual (`destaques.html` e `highlights.css`) ou logica (`destaques.js`)
- revisar busca, filtro por tipo, cards e paginacao
- lembrar que o clique no card deve abrir a PokeDex com query string
- ao mexer em sprites, verificar fallback animado e fallback estatico

### Se for mexer na PokeDex

- confirmar se a mudanca e estrutural (`pokedex.html`) ou logica (`app.js`)
- checar impacto em `pokedex.css`
- preservar busca, filtros e tabs
- se a mudanca puder afetar o emulador, verificar tambem o modo `embed`

### Se for mexer no emulador

- confirmar se a mudanca e estrutural (`emulator.html`) ou logica (`emulator.js`)
- checar impacto em `emulator.css`
- preservar boot do EmulatorJS, upload local, capas e biblioteca local
- preservar a Pokedex integrada via `iframe`
- lembrar que a biblioteca de ROMs usa `IndexedDB`
- ao mexer em fullscreen, verificar a tela do emulador e a Pokedex integrada
- ao mexer em voz, verificar `V`, botao `Voz` e navegadores sem suporte
- ao mexer em tempo jogado, verificar biblioteca, `Retomar agora` e persistencia apos reload

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

### Se a tarefa for PokeDex

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

- Mudancas grandes no topo da home podem desalinhar o hero
- Mudancas em `app.js` podem afetar varias partes da PokeDex porque a logica esta concentrada em um unico arquivo
- Mudancas em `destaques.js` podem quebrar busca, filtro, paginacao e links para a PokeDex
- Mudancas em `emulator.js` podem afetar ao mesmo tempo boot da ROM, fullscreen, voz, biblioteca local e Pokedex integrada
- Mudancas em `emulator.js` tambem podem afetar capas locais, historico recente, restauracao da ROM ativa e gamepad touch
- O EmulatorJS depende de CDN; falhas de rede podem parecer bug local mesmo quando o frontend esta correto
- O `IndexedDB` pode falhar ou estar bloqueado no navegador; o upload nao deve depender exclusivamente dele
- O reconhecimento de voz varia conforme navegador e permissao de microfone
- E facil quebrar o modo `embed` da PokeDex se editar apenas a tela principal e esquecer os overrides em `pokedex.css`

## Resumo rapido

- Home: `index.html` + `home.css` + `assets/`
- Destaques: `destaques.html` + `destaques.js` + `highlights.css`
- PokeDex: `pokedex.html` + `app.js` + `pokedex.css`
- Emulador: `emulator.html` + `emulator.js` + `emulator.css`
- Servidor: `server.js`
