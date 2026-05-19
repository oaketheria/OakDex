# OakRom

Projeto web em HTML, CSS e JavaScript vanilla que reúne biblioteca local de ROMs, emulador via EmulatorJS, Pokédex, OakDuo, Oak Challenge, Oak Rogue e o assistente OakBit.

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

- Home com biblioteca local de ROMs, capas, filtros, busca e jogos recentes.
- Upload local de ROMs salvo no navegador via IndexedDB.
- Suporte a GBA, GB, GBC, NES, SNES, Mega Drive, Master System, Game Gear, N64 e PS1.
- BIOS PS1 `scph5501.bin` importada pelo usuário e mantida apenas no navegador.
- Página dedicada da ROM em `rom.html`, com layout compacto, tela cheia, saves e Pokédex integrada.
- Pokédex principal com busca, filtros, detalhes, sprites, cries e modo embed.
- Pokédex integrada no emulador, no OakDuo, no Oak Challenge e no Oak Rogue.
- OakBit como assistente contextual, com tutorial, atalhos, skins, energia, voz e suporte a tela cheia.
- OakDuo em `oakduo.html`, com dois emuladores lado a lado, fluxo por papel, conexão manual WebRTC, convite por sala, transmissão remota, tela cheia, Pokédex integrada e OakBit fora dos iframes.
- Oak Challenge para runs Pokémon, Nuzlocke e hackroms, com overlay OBS, time, box, rotas, badges, notas e Pokédex integrada.
- Oak Rogue em `oak-rogue.html`, roguelike de ginásios com modo Normal/Nuzlocke, mapa ramificado, combate automático, sinergias por tipo, recrutamento, Torre, relíquias, formas regionais, shinies e chefes.
- Favicon próprio em `assets/favicon.svg`.

## Oak Rogue

Arquivos principais:

- `oak-rogue.html`
- `oak-rogue.js`
- `oak-rogue.css`

Draft Battle online:

- Para contas online, ranqueada e recuperação de senha, configure no Render as variáveis `DATABASE_URL`, `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
- O Supabase Auth guarda e recupera senha por e-mail; a tabela local `users` guarda apenas perfil do jogo, nick, pontos e histórico.
- No Supabase, adicione a URL do jogo em Authentication > URL Configuration > Redirect URLs, por exemplo `https://SEU-APP.onrender.com/oak-rogue.html`.
- Em desenvolvimento local, use também `http://127.0.0.1:5500/oak-rogue.html` como Redirect URL se for testar recuperação de senha.
- O modo Contra IA é casual. O modo Contra Player exige conta online e salva ranking/histórico no banco.
- A recuperação de senha aparece em `Esqueci` na tela de conta e usa o link enviado pelo Supabase para abrir `oak-rogue.html#auth=reset`.
- O Draft usa `draft-pokemon-pools.json` e sprites locais em `assets/draft-sprites/`.

Recursos:

- Roguelike Pokémon com oito ginásios, Liga, mapa ramificado, NPCs por arena, eventos, treino, move tutor e evolução.
- Modos Normal e Nuzlocke escolhidos na tela inicial.
- Saves separados por modo: uma run Normal não pode ser continuada como Nuzlocke, nem o inverso.
- No Nuzlocke, Pokémon derrotados saem do time e ficam registrados em `fallenTeam`.
- Torre com preparação de equipe, escolha de ordem, relíquias, tutor técnico, recrutamento, eventos e segunda chance até o andar 10.
- Na Torre, derrotados só permanecem durante a regra de segunda chance; após o limite, deixam de ocupar espaço no time.
- Combate automático com ordem por velocidade, energia, moves, relíquias, críticos, efeitos de status, XP, evolução e troca automática do ativo.
- Velocidade de batalha começa em 2x e ativa 3x automaticamente após 15 segundos na mesma batalha.
- Animações reais de golpes usam assets locais em `assets/battle-animations/real/graphics` e áudio em `assets/battle-animations/real/audio`.
- Golpes do tipo Normal só entram automaticamente para Pokémon que também têm tipo Normal.
- Shinies aparecem em todos os modos e mantêm a forma shiny ao evoluir.
- A Pokédex da run possui abas para vistos, capturados, shinies e variações.
- Formas regionais e especiais incluem Alola, Galar, Hisui, Paldea, formas de Pikachu, Rotom, Deoxys e outras variações registradas no jogo.
- Pokébolas exibidas no time variam conforme raridade, lendário ou shiny.
- Relíquias separadas por efeito: dano final, ataque, velocidade, defesa, HP, cura, crítico, sinergia e sobrevivência.
- Cada Pokémon pode equipar até duas relíquias; saves antigos com `heldItem` são migrados para slots.
- Telas com vários Pokémon usam carrossel horizontal por arraste para evitar scroll vertical e cards comprimidos.
- OakBit explica modos, mapa, relíquias, Pokédex da run, Torre e regras de Nuzlocke.

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
- Card da sala com código, jogador no controle, botão para nova sala, copiar convite e tela cheia.
- Conexão manual gratuita via WebRTC: o Jogador 1 cria a oferta, o Jogador 2 gera a resposta e o Jogador 1 conclui a conexão.
- Campos WebRTC com rascunho por sala, restauração após recarregar, limpeza ao desconectar e proteção contra colar o próprio código.
- Sincronização do nome da ROM remota entre os navegadores.
- OakBit único no canto da página, fora dos emuladores.
- Pokédex integrada em tela cheia com atalhos `P`, `V` e `Esc`.
- Som e animação ao abrir a Pokédex integrada.

Observações:

- O código da sala identifica o convite e ajuda os dois navegadores a usarem a mesma sala visual.
- A conexão real ainda depende da troca manual dos códigos WebRTC.
- Se a conexão cair de verdade, normalmente é preciso refazer oferta, resposta e conclusão da conexão.

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
- Em tela cheia, o Pixel é usado como modo seguro.

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
- A tela cheia correta é a da interface do projeto.
- A Pokédex integrada abre sobre o emulador em tela cheia.
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
- `assets/battle-animations/real/`: sprites e áudios reais de golpes usados no Oak Rogue.
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
- arquivos `.gba`
- arquivos `.sav`
- ROMs comerciais
- saídas locais de `tools/firered-extraction/`
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
