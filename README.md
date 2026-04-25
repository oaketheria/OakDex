# Pokédex + Emulator

Projeto web com frontend estático que combina:

- Pokédex principal consumindo a [PokeAPI](https://pokeapi.co/)
- página de destaques
- página de emulador com `EmulatorJS`
- Pokédex integrada dentro da página do emulador
- biblioteca local de ROMs por console
- dashboard local para gerenciar ROMs, saves, BIOS, backup e limpeza

O projeto permite buscar Pokémon por nome ou número, filtrar por tipo, visualizar detalhes como habilidades, status, peso e altura e, na página do emulador, carregar ROMs locais no navegador com biblioteca local, saves persistidos, capas de ROM e Pokédex integrada.

## Como executar

Use o start já preparado no projeto:

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois, abra `http://127.0.0.1:5500`.

Páginas principais:

- `http://127.0.0.1:5500/`
- `http://127.0.0.1:5500/pokedex.html`
- `http://127.0.0.1:5500/destaques.html`
- `http://127.0.0.1:5500/emulator.html`
- `http://127.0.0.1:5500/patch-notes.html`

### Narração

- Em `localhost`, a narração usa ElevenLabs se o `.env` estiver configurado.
- No site online, a narração usa a voz nativa do navegador em `pt-BR`, sem depender da API da ElevenLabs.

## Deploy no Render

Este projeto já está pronto para deploy no Render com frontend e backend juntos.

## Checklist antes de subir para o GitHub

Antes de fazer commit ou push, siga o arquivo [`GITHUB_CHECKLIST.md`](./GITHUB_CHECKLIST.md).

Pontos principais:

- não subir `.env`
- não subir BIOS de PS1
- não subir pasta `bios/`
- não subir arquivos `.bin`
- não subir ROMs comerciais
- não subir `socialrom_repo/`, que é apenas repositório de referência local
- não subir `_backups/`
- confirmar `git status --short --ignored` antes do commit

### Antes de publicar

- Confirme que `.env` não foi commitado.
- Confirme que BIOS/ROMs locais não foram commitadas.
- Confirme que `socialrom_repo/` não foi commitado.
- Confirme que `_backups/` não foi commitado.
- Se a chave atual já foi exposta, gere uma nova no painel da ElevenLabs.

### Passo a passo

1. Suba o projeto para um repositório no GitHub.
2. Entre em `https://render.com` e clique em `New +` > `Web Service`.
3. Conecte seu repositório.
4. No setup do serviço, use:
   - `Runtime`: `Node`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
5. Não é necessário configurar variáveis da ElevenLabs no Render para a narração online funcionar.
6. Clique em `Create Web Service`.
7. Quando o deploy terminar, abra a URL pública gerada pelo Render.

### Observações

- O arquivo `render.yaml` pode ser usado pelo Render para preencher parte da configuração.
- O servidor escuta em `0.0.0.0`, que é o formato esperado em hospedagem.
- A narração online depende da voz disponível no navegador do visitante, então a qualidade pode variar entre Chrome, Edge, Android e desktop.
- Se você quiser testar ElevenLabs localmente, mantenha o `.env` apenas na sua máquina.

## Recursos

- Busca por nome ou número
- Filtro por tipo
- Paginação do catálogo
- Card de detalhes com status, habilidades, formas, lore e moves
- Sprites animados quando disponíveis via PokeAPI
- Página de destaques com sprites animados
- Página de emulador com visual próprio
- Upload local de ROM
- Suporte a GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64 e PS1
- BIOS PS1 importada pelo usuário e salva localmente via IndexedDB
- Pokédex integrada no emulador usando a própria `pokedex.html` em modo `embed`
- Biblioteca local de ROMs via `IndexedDB`
- Card superior de `Retomar agora` com a ROM mais recente e tempo jogado
- Capas locais para ROMs conhecidas com fallback para busca automática
- Saves importados persistidos no navegador, com reaplicação por clique
- Favoritos, filtros por versão e ordenação da biblioteca
- Comando de voz da Pokédex integrada para abrir, fechar e buscar Pokémon
- Atalhos `P`, `V` e `Esc` para a Pokédex integrada
- Dashboard local com abas para ROMs, Saves, BIOS, Backup e Limpeza
- Patch Notes com histórico de versões
- Ajustes de layout para desktop, tablet e mobile

## Plano do Dashboard da Biblioteca

Fases planejadas para organizar melhor o painel local:

1. Separar o dashboard por abas com botões: ROMs, Saves, BIOS, Backup e Limpeza. Implementado.
2. Melhorar o layout visual com acabamento mais premium, hierarquia mais clara e seções mais fáceis de entender. Em andamento.
3. Organizar ROMs por console dentro do dashboard. Implementado.
4. Quando um console tiver muitas ROMs, usar rolagem horizontal ou carrossel por console. Implementado com rolagem horizontal por console.
5. Manter busca, filtro por console e ordenação dentro da aba de ROMs. Implementado.
6. Expandir a aba Saves com listagem, exclusão individual e possível exportação futura. Em andamento.
7. Deixar BIOS PS1 em uma aba própria, com status claro e ações de importar, substituir e remover. Implementado.

## Página do emulador

A tela `emulator.html` usa `EmulatorJS` no frontend para rodar ROMs localmente no navegador.

Arquivos principais:

- `emulator.html`
- `emulator.js`
- `emulator.css`

Funcionalidades atuais:

- carregar ROM local manualmente
- boot do EmulatorJS via CDN
- salvar ROMs no navegador via `IndexedDB`
- listar ROMs salvas em uma biblioteca particular local
- abrir ROM da biblioteca com um clique
- destacar a retomada principal no card superior da sessão
- mostrar tempo jogado na biblioteca e no card `Retomar agora`
- usar capas locais para ROMs conhecidas como Emerald, Fire Red, Leaf Green, Ruby e Sapphire
- tentar buscar capa automática para outras ROMs via backend
- fullscreen próprio da UI do projeto
- gamepad visual nativo do `EmulatorJS` no mobile
- importação de save por fluxo próprio da página, com seletor de arquivo
- exportação de save pela integração com as ações internas do EmulatorJS
- persistência local de saves importados
- lista de saves recentes na aba `Sessão`, com reaplicar e excluir
- launcher interno reorganizado em `Biblioteca`, `Sessão` e `Controles`
- Pokédex integrada embutida por `iframe`, usando `pokedex.html?embed=1`
- comando de voz da Pokédex integrada para:
  - abrir a Pokédex
  - fechar a Pokédex
  - abrir a Pokédex e buscar um Pokémon

Observações:

- a biblioteca local fica disponível apenas no navegador/dispositivo do usuário
- não há backend para armazenar ROMs
- se o navegador bloquear `IndexedDB`, o upload ainda deve tentar iniciar o emulador
- o EmulatorJS depende de acesso a CDN para baixar o core
- no mobile, o projeto prioriza o gamepad visual nativo do EmulatorJS
- a busca automática de capas depende de `RAWG_API_KEY` no ambiente para ROMs sem capa local
- as capas locais atuais ficam em `assets/rom-covers/`
- o comando de voz da Pokédex depende de suporte do navegador a `SpeechRecognition` ou `webkitSpeechRecognition`

## Pokédex principal

Arquivos principais:

- `pokedex.html`
- `app.js`
- `pokedex.css`

Funcionalidades atuais:

- busca por nome ou número
- filtro por tipo
- tabs `Dados`, `Stats`, `Moves`, `Forms` e `Lore`
- sprites animados com prioridade para:
  - `generation-v / black-white / animated`
  - `other / showdown`
  - `generation-ii / crystal / animated`
  - fallback para sprite estático
- modo `embed` para uso dentro do emulador

## Páginas informativas

- `sobre.html`: apresenta o projeto, privacidade local, consoles e BIOS PS1.
- `como-usar.html`: guia rápido de uso.
- `patch-notes.html`: histórico de versões, melhorias e correções.
- `info-pages.js`: textos dinâmicos e tradução básica BR/US das páginas informativas.

## Estrutura principal

- `index.html`: home
- `pokedex.html`: Pokédex principal
- `destaques.html`: página de destaques
- `emulator.html`: página do emulador
- `rom.html`: página dedicada da ROM
- `sobre.html`: página sobre o projeto
- `como-usar.html`: página de guia de uso
- `patch-notes.html`: página de histórico de atualizações
- `app.js`: lógica da Pokédex principal
- `destaques.js`: lógica da página de destaques
- `emulator.js`: lógica do emulador, Pokédex integrada e biblioteca local
- `home-library.js`: lógica da home, biblioteca local e dashboard
- `rom-page.js`: lógica da página dedicada da ROM
- `roms.js`: utilitários compartilhados de ROMs, sistemas, IndexedDB, saves e BIOS
- `info-pages.js`: lógica das páginas informativas
- `styles.css`: estilos base compartilhados
- `home.css`: estilos da home, biblioteca, dashboard e páginas informativas
- `rom-page.css`: estilos da página dedicada da ROM
- `highlights.css`: estilos da página de destaques
- `pokedex.css`: estilos da Pokédex
- `emulator.css`: estilos da página do emulador
- `server.js`: servidor local
- `assets/rom-covers/`: capas locais das ROMs conhecidas
