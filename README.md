# PokeDex

Site responsivo que consome a [PokeAPI](https://pokeapi.co/) para listar Pokemon, buscar por nome ou numero, filtrar por tipo e visualizar detalhes como habilidades, status, peso e altura.

## Como executar

Use o start ja preparado no projeto:

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois, abra `http://127.0.0.1:5500`.

## Deploy no Render

Este projeto ja esta pronto para deploy no Render com backend e frontend juntos, o que permite proteger a chave da ElevenLabs no servidor.

### Antes de publicar

- Confirme que `.env` nao foi commitado.
- Deixe a chave apenas nas variaveis de ambiente do Render.
- Se a chave atual ja foi exposta, gere uma nova no painel da ElevenLabs.

### Passo a passo

1. Suba o projeto para um repositorio no GitHub.
2. Entre em `https://render.com` e clique em `New +` > `Web Service`.
3. Conecte seu repositorio.
4. No setup do servico, use:
   - `Runtime`: `Node`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
5. Em `Environment Variables`, configure:
   - `ELEVENLABS_API_KEY` = sua chave
   - `ELEVENLABS_VOICE_ID` = `onwK4e9ZLuTAKqWW03F9`
   - `ELEVENLABS_MODEL_ID` = `eleven_multilingual_v2`
6. Clique em `Create Web Service`.
7. Quando o deploy terminar, abra a URL publica gerada pelo Render.

### Observacoes

- O arquivo `render.yaml` pode ser usado pelo Render para pre-preencher parte da configuracao.
- O servidor agora escuta em `0.0.0.0`, que e o formato esperado em hospedagem.
- O endpoint `/api/narrate` continua server-side, entao a API Key nao vai para o navegador.

## Recursos

- Busca por nome ou numero
- Filtro por tipo
- Paginacao do catalogo
- Card de detalhes com status e habilidades
- Destaque aleatorio no topo da pagina
