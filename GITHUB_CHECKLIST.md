# GitHub Checklist

Use este checklist sempre antes de fazer commit ou push para o GitHub.

## Segurança

- Confirmar que `.env` não será commitado.
- Confirmar que BIOS de PS1 não será commitada.
- Confirmar que a pasta `bios/` não será commitada.
- Confirmar que arquivos `.bin` não serão commitados.
- Confirmar que ROMs comerciais não serão commitadas.
- Confirmar que `socialrom_repo/` não será commitado.
- Confirmar que backups em `_backups/` não serão commitados.
- Confirmar que arquivos grandes ou privados não aparecem como `A` no Git.

## `.gitignore` obrigatório

O `.gitignore` deve manter pelo menos:

```gitignore
.env
node_modules/
bios/
*.bin
socialrom_repo/
_backups/
```

## Comandos obrigatórios antes do commit

```powershell
git status --short --ignored
git diff -- .gitignore
git check-ignore -v bios/scph5501.bin
git check-ignore -v *.bin
```

Resultado esperado:

- `.env` aparece apenas como ignorado (`!! .env`), se existir.
- `_backups/` aparece apenas como ignorado (`!! _backups/`), se existir.
- `socialrom_repo/` aparece apenas como ignorado (`!! socialrom_repo/`), se existir.
- `bios/scph5501.bin` é ignorado por `bios/`.
- `*.bin` é ignorado por `*.bin`.

## Conferir arquivos rastreados

Antes de fazer `git add`, confira se nenhum arquivo proibido já está rastreado:

```powershell
git ls-files *.bin bios socialrom_repo _backups .env
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
- ROMs comerciais
- `socialrom_repo/`
- `_backups/`

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
