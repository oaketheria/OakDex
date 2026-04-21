const http = require("http");
const fs = require("fs");
const https = require("https");
const path = require("path");

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;

function loadDotEnv() {
  const envPath = path.join(ROOT, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadDotEnv();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "EbuvaInXUGWtpYRUnKLQ";
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const RAWG_API_KEY = process.env.RAWG_API_KEY || "";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function resolvePath(urlPath) {
  const pathname = String(urlPath || "").split("?")[0].split("#")[0] || "/";
  const sanitizedPath = pathname === "/" ? "/index.html" : pathname;
  const normalized = path.normalize(sanitizedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(ROOT, normalized);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (upstreamResponse) => {
        const chunks = [];

        upstreamResponse.on("data", (chunk) => {
          chunks.push(chunk);
        });

        upstreamResponse.on("end", () => {
          const buffer = Buffer.concat(chunks);

          if (upstreamResponse.statusCode && upstreamResponse.statusCode >= 200 && upstreamResponse.statusCode < 300) {
            try {
              resolve(JSON.parse(buffer.toString("utf8")));
            } catch (error) {
              reject(new Error("Resposta JSON invalida."));
            }
            return;
          }

          reject(new Error(buffer.toString("utf8") || "Falha na requisicao upstream."));
        });
      })
      .on("error", reject);
  });
}

function normalizeCoverSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.(gba|zip|7z)$/gi, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\bwww\.[^\s]+/g, " ")
    .replace(/\bromsportugues(?:\.com)?\b/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(v|ver|version|rev|beta|usa|eur|europe|european|japan|jpn|proto|hack|patched|ptbr|pt-br|br|portugues|portuguese|translated|translation)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCoverSearchTokens(value) {
  return normalizeCoverSearchValue(value)
    .split(" ")
    .filter((token) => token.length >= 2);
}

function scoreRomCoverMatch(searchTerm, entry) {
  const query = normalizeCoverSearchValue(searchTerm);
  const name = normalizeCoverSearchValue(entry?.name || "");
  const slug = normalizeCoverSearchValue(entry?.slug || "");
  const queryTokens = getCoverSearchTokens(query);
  const candidateTokens = new Set([...getCoverSearchTokens(name), ...getCoverSearchTokens(slug)]);

  if (!query || !candidateTokens.size) {
    return -1;
  }

  let score = 0;
  let matchedTokens = 0;

  queryTokens.forEach((token) => {
    if (candidateTokens.has(token)) {
      matchedTokens += 1;
      score += token.length >= 5 ? 3 : 2;
    } else if (name.includes(token) || slug.includes(token)) {
      matchedTokens += 1;
      score += 1;
    }
  });

  if (name === query || slug === query) {
    score += 20;
  } else {
    if (name.includes(query) || slug.includes(query)) {
      score += 8;
    }

    if (query.includes(name) || query.includes(slug)) {
      score += 5;
    }
  }

  const coverage = queryTokens.length ? matchedTokens / queryTokens.length : 0;

  if (coverage < 0.6) {
    return -1;
  }

  return score + Math.round(coverage * 10);
}

function pickBestRomCoverMatch(searchTerm, results) {
  const rankedResults = results
    .filter((entry) => entry && entry.background_image)
    .map((entry) => ({
      entry,
      score: scoreRomCoverMatch(searchTerm, entry),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((first, second) => second.score - first.score);

  if (!rankedResults.length) {
    return null;
  }

  const [bestMatch, secondMatch] = rankedResults;

  if (bestMatch.score < 12) {
    return null;
  }

  if (secondMatch && bestMatch.score - secondMatch.score <= 1) {
    return null;
  }

  return bestMatch.entry;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1e6) {
        reject(new Error("Payload muito grande."));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("JSON invalido."));
      }
    });

    request.on("error", reject);
  });
}

function requestNarrationFromElevenLabs(text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      text,
      model_id: ELEVENLABS_MODEL_ID,
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.78,
        style: 0.55,
        use_speaker_boost: true,
      },
    });

    const requestOptions = {
      hostname: "api.elevenlabs.io",
      path: `/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        Accept: "audio/mpeg",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    };

    const upstreamRequest = https.request(requestOptions, (upstreamResponse) => {
      const chunks = [];

      upstreamResponse.on("data", (chunk) => {
        chunks.push(chunk);
      });

      upstreamResponse.on("end", () => {
        const buffer = Buffer.concat(chunks);

        if (upstreamResponse.statusCode && upstreamResponse.statusCode >= 200 && upstreamResponse.statusCode < 300) {
          resolve(buffer);
          return;
        }

        let parsedMessage = "";

        try {
          const parsed = JSON.parse(buffer.toString("utf8"));
          parsedMessage =
            parsed.detail?.message ||
            parsed.detail?.status ||
            parsed.detail?.type ||
            parsed.message ||
            "";
        } catch (error) {
          parsedMessage = "";
        }

        reject(
          new Error(
            parsedMessage || buffer.toString("utf8") || "Falha ao gerar audio na ElevenLabs.",
          ),
        );
      });
    });

    upstreamRequest.on("error", reject);
    upstreamRequest.write(payload);
    upstreamRequest.end();
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "GET" && String(request.url || "").startsWith("/api/rom-cover")) {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);
    const searchTerm = String(requestUrl.searchParams.get("q") || "").trim();

    if (!RAWG_API_KEY) {
      sendJson(response, 200, { coverUrl: "", source: "fallback", reason: "rawg_key_missing" });
      return;
    }

    if (!searchTerm) {
      sendJson(response, 400, { error: "Consulta vazia para busca de capa." });
      return;
    }

    const rawgUrl =
      `https://api.rawg.io/api/games?key=${encodeURIComponent(RAWG_API_KEY)}` +
      `&search=${encodeURIComponent(searchTerm)}` +
      "&search_precise=true&page_size=5";

    requestJson(rawgUrl)
      .then((payload) => {
        const results = Array.isArray(payload.results) ? payload.results : [];
        const match = pickBestRomCoverMatch(searchTerm, results);

        sendJson(response, 200, {
          coverUrl: match?.background_image || "",
          matchedName: match?.name || "",
          source: match ? "rawg" : "fallback",
        });
      })
      .catch((error) => {
        sendJson(response, 200, {
          coverUrl: "",
          source: "fallback",
          reason: "rawg_error",
          details: String(error.message || ""),
        });
      });
    return;
  }

  if (request.method === "POST" && request.url === "/api/narrate") {
    console.log("[narrate] Requisicao recebida");
    readJsonBody(request)
      .then(async (payload) => {
        if (!ELEVENLABS_API_KEY) {
          console.error("[narrate] ELEVENLABS_API_KEY ausente no ambiente");
          sendJson(response, 500, {
            error: "Configure ELEVENLABS_API_KEY no ambiente do servidor antes de usar a narracao.",
          });
          return;
        }

        const text = String(payload.text || "").trim();

        if (!text) {
          console.error("[narrate] Texto vazio recebido");
          sendJson(response, 400, { error: "Texto vazio para narracao." });
          return;
        }

        const audioBuffer = await requestNarrationFromElevenLabs(text);
        console.log(`[narrate] Audio gerado com sucesso (${audioBuffer.length} bytes)`);
        response.writeHead(200, {
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBuffer.length,
          "Cache-Control": "no-store",
        });
        response.end(audioBuffer);
      })
      .catch((error) => {
        const normalizedMessage = String(error.message || "");
        const quotaError =
          normalizedMessage.includes("payment_required") ||
          normalizedMessage.includes("quota_exceeded") ||
          normalizedMessage.includes("credit") ||
          normalizedMessage.includes("subscription");

        console.error("[narrate] Falha ao gerar audio:", normalizedMessage);

        sendJson(response, 500, {
          error: quotaError
            ? "A ElevenLabs recusou a narracao por falta de creditos ou plano ativo."
            : "Nao foi possivel gerar a narracao agora.",
          details: normalizedMessage,
        });
      });
    return;
  }

  const filePath = resolvePath(request.url);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Arquivo nao encontrado.");
        return;
      }

      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Erro interno do servidor.");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[extension] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`PokeDex online em http://${HOST}:${PORT}`);
});
