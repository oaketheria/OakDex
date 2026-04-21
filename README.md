# PokeDex + Emulator

Projeto web com frontend estatico que combina:

- PokeDex principal consumindo a [PokeAPI](https://pokeapi.co/)
- pagina de destaques
- pagina de emulador GBA com HUD proprio
- Quick Dex lateral dentro da pagina do emulador

O projeto permite buscar Pokemon por nome ou numero, filtrar por tipo, visualizar detalhes como habilidades, status, peso e altura e, na pagina do emulador, carregar ROMs locais de GBA no navegador com biblioteca local, cards de capas e Quick Dex embutida.

## Como executar

Use o start ja preparado no projeto:

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois, abra `http://127.0.0.1:5500`.

Paginas principais:

- `http://127.0.0.1:5500/`
- `http://127.0.0.1:5500/pokedex.html`
- `http://127.0.0.1:5500/destaques.html`
- `http://127.0.0.1:5500/emulator.html`

### Narracao

- Em `localhost`, a narracao usa ElevenLabs se o `.env` estiver configurado.
- No site online, a narracao usa a voz nativa do navegador em `pt-BR`, sem depender da API da ElevenLabs.

## Deploy no Render

Este projeto ja esta pronto para deploy no Render com frontend e backend juntos.

### Antes de publicar

- Confirme que `.env` nao foi commitado.
- Se a chave atual ja foi exposta, gere uma nova no painel da ElevenLabs.

### Passo a passo

1. Suba o projeto para um repositorio no GitHub.
2. Entre em `https://render.com` e clique em `New +` > `Web Service`.
3. Conecte seu repositorio.
4. No setup do servico, use:
   - `Runtime`: `Node`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
5. Nao e necessario configurar variaveis da ElevenLabs no Render para a narracao online funcionar.
6. Clique em `Create Web Service`.
7. Quando o deploy terminar, abra a URL publica gerada pelo Render.

### Observacoes

- O arquivo `render.yaml` pode ser usado pelo Render para pre-preencher parte da configuracao.
- O servidor agora escuta em `0.0.0.0`, que e o formato esperado em hospedagem.
- A narracao online depende da voz disponivel no navegador do visitante, entao a qualidade pode variar entre Chrome, Edge, Android e desktop.
- Se voce quiser testar ElevenLabs localmente, mantenha o `.env` apenas na sua maquina.

## Recursos

- Busca por nome ou numero
- Filtro por tipo
- Paginacao do catalogo
- Card de detalhes com status e habilidades
- Destaque aleatorio no topo da pagina
- Pagina de emulador com visual proprio
- Upload local de ROM `.gba`
- Quick Dex embutida no emulador
- Biblioteca local de ROMs via `IndexedDB`
- Restauracao automatica da ultima ROM usada no navegador
- Historico local de ROMs recentes
- Capas locais para ROMs conhecidas com fallback para busca automatica
- Ajustes de layout para mobile/tablet

## Pagina do emulador

A tela `emulator.html` usa `EmulatorJS` no frontend para rodar ROMs de GBA localmente no navegador.

Arquivos principais:

- `emulator.html`
- `emulator.js`
- `emulator.css`

Funcionalidades atuais:

- carregar ROM `.gba` manualmente
- tentar iniciar o emulador sem depender da biblioteca local
- salvar ROMs no navegador via `IndexedDB`
- listar ROMs salvas em uma biblioteca particular local
- mostrar ROMs recentes no mesmo navegador
- reabrir a ultima ROM usada ao voltar ao site
- usar capas locais para ROMs conhecidas como Emerald, Fire Red, Leaf Green, Ruby e Sapphire
- tentar buscar capa automatica para outras ROMs via backend
- Quick Dex lateral com busca via PokeAPI
- fullscreen proprio da UI do projeto
- fullscreen com tentativa de orientacao horizontal no mobile

Observacoes:

- a biblioteca local fica disponivel apenas no navegador/dispositivo do usuario
- nao ha backend para armazenar ROMs
- se o navegador bloquear `IndexedDB`, o upload ainda deve tentar iniciar o emulador
- o EmulatorJS depende de acesso a CDN para baixar o core
- a busca automatica de capas depende de `RAWG_API_KEY` no ambiente para ROMs sem capa local
- as capas locais atuais ficam em `assets/rom-covers/`

## Estrutura principal

- `index.html`: home
- `pokedex.html`: PokeDex principal
- `destaques.html`: pagina de destaques
- `emulator.html`: pagina do emulador
- `app.js`: logica da PokeDex principal
- `destaques.js`: logica da pagina de destaques
- `emulator.js`: logica do emulador, Quick Dex e biblioteca local
- `styles.css`: estilos base compartilhados
- `home.css`: estilos da home
- `highlights.css`: estilos da pagina de destaques
- `pokedex.css`: estilos da PokeDex
- `emulator.css`: estilos da pagina do emulador
- `server.js`: servidor local
- `assets/rom-covers/`: capas locais das ROMs conhecidas
