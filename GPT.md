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
- `emulator.html`: tela principal do emulador com HUD e Quick Dex
- `app.js`: busca, filtros, tabs, detalhes, audio e integracao com PokeAPI
- `destaques.js`: busca, filtro, paginacao e cards da pagina de destaques
- `emulator.js`: boot do EmulatorJS, HUD, fullscreen, Quick Dex e biblioteca local de ROMs
- `styles.css`: base compartilhado
- `home.css`: estilos da home
- `highlights.css`: estilos da pagina de destaques
- `pokedex.css`: estilos da PokeDex
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

Estado atual da home:

- sem navbar tradicional
- logo/texto principal vindo de imagem transparente
- card da arte principal com inclinacao 3D
- fundo da tela usando imagem cosmica derivada

Assets da home que importam hoje:

- `assets/logo2.png`: texto/logo principal usado no hero
- `assets/legendary.png`: arte principal usada no hero
- `assets/cosmic-hero-bg.png`: fundo da home

Assets secundarios/legado no projeto:

- `assets/logo1.png`: versao com fundo da arte textual
- `assets/legendary-birds-3d.png`: arte antiga de passaros
- `assets/psychic-legendary-3d.png`: arte antiga intermediaria
- `assets/anime-left.png`
- `assets/anime-right.png`
- `assets/anime-sidebars.png`

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

Observacoes visuais:

- usa o mesmo fundo cosmico da home
- o filtro `Todos os tipos` recebeu tratamento visual mais moderno em `highlights.css`
- a pagina ainda pode ser refinada em design e organizacao

## PokeDex atual

A PokeDex esta separada da home em `pokedex.html`.

Ela depende de:

- `app.js`
- `pokedex.css`

Funcionalidades relevantes:

- busca por nome ou numero
- filtro por tipo
- tabs de detalhes
- destaque/spotlight do Pokemon
- audio/narracao

## Pagina do emulador atual

A pagina do emulador fica em `emulator.html`.

Ela depende de:

- `emulator.js`
- `emulator.css`

Funcionalidades relevantes:

- upload local de ROM `.gba`
- boot do EmulatorJS via CDN
- HUD visual inspirado em GBA
- botoes externos para `Play`, `Save`, `Load` e `Fullscreen`
- Quick Dex lateral dentro da pagina do emulador
- busca de Pokemon via PokeAPI sem alterar `pokedex.html`
- fullscreen proprio da pagina, separado do fullscreen interno do EmulatorJS
- biblioteca local de ROMs via `IndexedDB`
- restauracao automatica da ultima ROM usada neste navegador

Observacoes tecnicas importantes:

- a biblioteca de ROMs e privada por navegador/dispositivo, sem backend
- o upload deve continuar funcionando mesmo se o `IndexedDB` falhar
- o fullscreen correto para manter a Quick Dex e o da nossa UI, nao o interno do EmulatorJS
- a Quick Dex do emulador vive em `emulator.js` e `emulator.css`, nao em `app.js`

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

## Decisoes recentes de design

- A home nao deve usar layout generico; a direcao visual atual e Pokemon hero screen
- O topo da home foi simplificado e o navbar foi removido
- O texto principal do hero nao esta em texto HTML puro; ele vem da imagem `assets/logo2.png`
- O efeito 3D principal da home esta no card da arte (`pokemon-art-card`) e no tratamento do logo
- O fundo cosmico atual pode permanecer mesmo quando a arte principal for trocada, salvo pedido contrario
- A separacao de CSS por pagina e uma decisao atual importante e deve ser preservada

## Arquivos para nunca esquecer

- `index.html`: define quais assets da home estao realmente sendo usados
- `destaques.html`: entrada da pagina de destaques
- `pokedex.html`: nao confundir com a home
- `emulator.html`: tela do emulador e Quick Dex embutida
- `styles.css`: base compartilhado e utilitarios
- `home.css`: visual da home
- `highlights.css`: visual da pagina de destaques
- `pokedex.css`: visual da PokeDex
- `emulator.css`: visual da pagina do emulador
- `app.js`: toda logica principal da PokeDex esta aqui
- `destaques.js`: toda logica da pagina de destaques esta aqui
- `emulator.js`: toda logica do emulador, biblioteca local e Quick Dex lateral esta aqui
- `server.js`: necessario para servir tudo localmente

## Checklist antes de editar

### Se for mexer na home

- confirmar quais imagens estao em uso em `index.html`
- verificar se a mudanca e so na home ou afeta tambem destaques ou PokeDex
- revisar as classes `pokemon-*` em `home.css`
- evitar reaproveitar asset antigo por engano
- se o usuario citar um nome de arquivo, conferir em `assets/` antes de editar

### Se for mexer na pagina de destaques

- confirmar se a mudanca e visual (`destaques.html` e `highlights.css`) ou logica (`destaques.js`)
- revisar busca, filtro por tipo, cards e paginacao
- lembrar que o clique no card deve abrir a PokeDex com query string

### Se for mexer na PokeDex

- confirmar se a mudanca e estrutural (`pokedex.html`) ou logica (`app.js`)
- checar impacto em `pokedex.css`
- preservar busca, filtros e tabs

### Se for mexer no emulador

- confirmar se a mudanca e estrutural (`emulator.html`) ou logica (`emulator.js`)
- checar impacto em `emulator.css`
- preservar boot do EmulatorJS, upload local e Quick Dex
- lembrar que a biblioteca de ROMs usa `IndexedDB`
- nao mover a logica da Quick Dex do emulador para `app.js`
- ao mexer em fullscreen, verificar o comportamento da Quick Dex e do botao `Pokedex`

### Se for mexer em assets

- preferir criar novo arquivo em vez de sobrescrever um asset importante sem necessidade
- registrar no `GPT.md` quando o asset principal da home mudar

## Onde olhar primeiro por tipo de tarefa

### Se a tarefa for visual/home

Abrir primeiro:

- `index.html`
- `home.css`
- `assets/`

### Se a tarefa for destaques

Abrir primeiro:

- `destaques.html`
- `destaques.js`
- `highlights.css`

### Se a tarefa for PokeDex

Abrir primeiro:

- `pokedex.html`
- `app.js`
- `pokedex.css`

### Se a tarefa for emulador

Abrir primeiro:

- `emulator.html`
- `emulator.js`
- `emulator.css`

### Se a tarefa for servidor ou deploy

Abrir primeiro:

- `server.js`
- `package.json`
- `README.md`
- `render.yaml`

## Riscos conhecidos

- Mudancas grandes no topo da home podem desalinhar o hero
- Mudancas em `app.js` podem afetar varias partes da PokeDex porque a logica esta concentrada em um unico arquivo
- Mudancas em `destaques.js` podem quebrar busca, filtro, paginacao e links para a PokeDex
- Mudancas em `emulator.js` podem afetar ao mesmo tempo boot da ROM, Quick Dex, fullscreen e biblioteca local
- O EmulatorJS depende de CDN; falhas de rede podem parecer bug local mesmo quando o frontend esta correto
- O `IndexedDB` pode falhar ou estar bloqueado no navegador; o upload nao deve depender exclusivamente dele
- O fullscreen interno do EmulatorJS nao deve ser tratado como fullscreen principal da experiencia
- E facil usar o asset errado na home se nao conferir o `src` atual em `index.html`
- Algumas imagens antigas continuam em `assets/`, mas nao sao necessariamente as que estao em uso

## Resumo rapido

Se precisar economizar leitura inicial:

- Home: `index.html` + `home.css` + `assets/`
- Destaques: `destaques.html` + `destaques.js` + `highlights.css`
- PokeDex: `pokedex.html` + `app.js` + `pokedex.css`
- Emulador: `emulator.html` + `emulator.js` + `emulator.css`
- Servidor: `server.js`

## Resumo ultra rapido para agente

- Quer editar a home: abra `index.html`, depois `home.css`, depois confira `assets/logo2.png`, `assets/legendary.png` e `assets/cosmic-hero-bg.png`
- Quer editar destaques: abra `destaques.html`, `destaques.js` e `highlights.css`
- Quer editar a PokeDex: abra `pokedex.html`, `app.js` e so depois revise `pokedex.css`
- Quer editar o emulador: abra `emulator.html`, `emulator.js` e `emulator.css`
- Quer trocar imagem: confirme primeiro qual arquivo esta referenciado no HTML atual
