# GitHub Checklist

Use este checklist sempre antes de fazer commit ou push para o GitHub.

## Segurança

- Confirmar que `.env` não será commitado.
- Confirmar que BIOS de PS1 não será commitada.
- Confirmar que a pasta `bios/` não será commitada.
- Confirmar que arquivos `.bin` não serão commitados.
- Confirmar que arquivos `.gba` e `.sav` não serão commitados.
- Confirmar que ROMs comerciais não serão commitadas.
- Confirmar que saídas locais de `tools/firered-extraction/` não serão commitadas.
- Confirmar que `socialrom_repo/` não será commitado.
- Confirmar que backups em `_backups/` não serão commitados.
- Confirmar que arquivos de log locais (`server.log`, `server.err`, `server-*.log`, `server-*.err`) não serão commitados.
- Confirmar que `.env` e valores reais de `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET` ou chaves privadas não aparecem em arquivos versionados.
- Confirmar que arquivos grandes ou privados não aparecem como `A` no Git.

## `.gitignore` obrigatório

O `.gitignore` deve manter pelo menos:

```gitignore
.env
node_modules/
bios/
*.bin
*.gba
*.sav
tools/firered-extraction/input/
tools/firered-extraction/output/
tools/firered-extraction/extracted/
socialrom_repo/
_backups/
server*.log
server*.err
```

## Comandos obrigatórios antes do commit

```powershell
git status --short --ignored
git diff -- .gitignore
git check-ignore -v bios/scph5501.bin
git check-ignore -v *.bin
git check-ignore -v fire-red.gba fire-red.sav
```

Resultado esperado:

- `.env` aparece apenas como ignorado (`!! .env`), se existir.
- `_backups/` aparece apenas como ignorado (`!! _backups/`), se existir.
- `socialrom_repo/` aparece apenas como ignorado (`!! socialrom_repo/`), se existir.
- `bios/scph5501.bin` é ignorado por `bios/`.
- `*.bin` é ignorado por `*.bin`.
- `fire-red.gba` e `fire-red.sav` são ignorados por `*.gba` e `*.sav`.

## Conferir arquivos rastreados

Antes de fazer `git add`, confira se nenhum arquivo proibido já está rastreado:

```powershell
git ls-files *.bin *.gba *.sav bios socialrom_repo _backups .env
```

Esse comando deve voltar vazio. Se voltar algum arquivo, pare e resolva antes de commitar.

## Procurar ROMs e BIOS no projeto

Antes do commit, confira se existem arquivos de ROM/BIOS no workspace:

```powershell
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' -and ($_.Extension -in '.gba','.gb','.gbc','.nes','.sfc','.smc','.gen','.sms','.gg','.n64','.z64','.v64','.chd','.pbp','.iso','.bin') } | Select-Object -ExpandProperty FullName
```

Se aparecer algo fora de pastas ignoradas ou fora do esperado, não faça commit.

Observação: Mega Drive também pode usar extensão `.md`, mas `.md` é a mesma extensão de arquivos Markdown. Por isso, não incluir `.md` nesse comando automático. Se houver suspeita de ROM Mega Drive com `.md`, conferir manualmente pelo nome, tamanho e localização do arquivo.

## Verificação técnica recomendada

Antes de subir mudanças de JavaScript:

```powershell
node --check emulator.js
node --check home-library.js
node --check rom-page.js
node --check server.js
```

Se também foram alterados scripts compartilhados, rode:

```powershell
node --check info-pages.js
node --check roms.js
```

Se `oak-rogue.js` ou `server.js` foram alterados, rode também:

```powershell
node --check oak-rogue.js
node --check server.js
```

## Checagem antes de commitar

Depois de `git add`, revisar:

```powershell
git status --short
git diff --cached --name-only
git diff --cached --check
```

Confirmar que a lista staged não inclui:

- `.env`
- `bios/`
- `*.bin`
- `*.gba`
- `*.sav`
- `server.log`
- `server.err`
- `server-*.log`
- `server-*.err`
- ROMs comerciais
- saídas locais de `tools/firered-extraction/`
- `socialrom_repo/`
- `_backups/`

## Arquivos esperados na atualização do Draft Battle online

Se o commit for da atualização de contas/Supabase/Draft Battle, estes arquivos podem entrar:

- `README.md`
- `GPT.md`
- `GITHUB_CHECKLIST.md`
- `oak-rogue.html`
- `oak-rogue.css`
- `oak-rogue.js`
- `server.js`
- `package.json`
- `package-lock.json`
- `draft-pokemon-pools.json`
- `assets/draft-sprites/`
- `tools/build-draft-pokemon-pools.js`
- `tools/download-draft-sprites.js`

Antes de subir essa atualização, conferir no Render:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

No Supabase, conferir em `Authentication > URL Configuration > Redirect URLs`:

- URL pública do Render terminando em `/oak-rogue.html`
- opcional para teste local: `http://127.0.0.1:5500/oak-rogue.html`

Não colocar valores reais dessas variáveis em README, GPT, checklist ou código.

## Commit e push

Somente depois das verificações:

```powershell
git commit -m "mensagem do commit"
git status --short --ignored
git push origin main
```

Antes do push, `git status --short --ignored` deve mostrar somente arquivos ignorados esperados, como `.env`, `_backups/` e `socialrom_repo/`.

## Regras do projeto

- A BIOS PS1 deve ser importada pelo botão `Importar BIOS PS1`.
- A BIOS PS1 fica salva no navegador via IndexedDB.
- A BIOS PS1 não deve ser salva no repositório.
- O arquivo esperado para PS1 é `scph5501.bin`, fornecido pelo próprio usuário.
- ROMs locais devem ficar apenas no navegador do usuário, não no repositório.
- Saves locais também não devem ser salvos no repositório.
- `tools/firered-extraction/README.md` e `manifest.json` podem ser versionados; entradas, saídas e arquivos extraídos da ROM devem ficar ignorados.
