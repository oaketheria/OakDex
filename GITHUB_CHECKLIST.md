# GitHub Checklist

Use este checklist sempre antes de fazer commit ou push para o GitHub.

## Segurança

- Confirmar que `.env` nao sera commitado.
- Confirmar que BIOS de PS1 nao sera commitada.
- Confirmar que a pasta `bios/` nao sera commitada.
- Confirmar que arquivos `.bin` nao serao commitados.
- Confirmar que ROMs comerciais nao serao commitadas.
- Confirmar que `socialrom_repo/` nao sera commitado.
- Confirmar que backups grandes em `_backups/` so serao commitados se isso for intencional.

## Comandos obrigatorios antes do commit

```powershell
git status --short
git diff -- .gitignore
git check-ignore -v bios/scph5501.bin
```

Se existir qualquer BIOS ou arquivo `.bin` na pasta do projeto, confirmar tambem:

```powershell
git check-ignore -v *.bin
```

## Regras do projeto

- A BIOS PS1 deve ser importada pelo botao `Importar BIOS PS1`.
- A BIOS PS1 fica salva no navegador via IndexedDB.
- A BIOS PS1 nao deve ser salva no repositorio.
- O arquivo esperado para PS1 e `scph5501.bin`, fornecido pelo proprio usuario.
- O `.gitignore` deve manter:

```gitignore
.env
node_modules/
bios/
*.bin
socialrom_repo/
```

## Verificacao tecnica recomendada

Antes de subir mudancas de JavaScript:

```powershell
node --check emulator.js
node --check home-library.js
node --check rom-page.js
node --check server.js
```

## Antes do push

- Revisar `git status --short`.
- Revisar se nao ha arquivos inesperados marcados como `A`.
- Revisar se arquivos grandes ou privados nao entraram no commit.
- So depois fazer `git add`, `git commit` e `git push`.
