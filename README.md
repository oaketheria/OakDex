# PokeDex

Site responsivo que consome a [PokeAPI](https://pokeapi.co/) para listar Pokemon, buscar por nome ou numero, filtrar por tipo e visualizar detalhes como habilidades, status, peso e altura.

## Como executar

Use o start ja preparado no projeto:

```powershell
cd "C:\Users\os_ap\Documents\New project"
npm start
```

Depois, abra `http://127.0.0.1:5500`.

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
