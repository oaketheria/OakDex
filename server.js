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

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function resolvePath(urlPath) {
  const sanitizedPath = urlPath === "/" ? "/index.html" : urlPath;
  const normalized = path.normalize(sanitizedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(ROOT, normalized);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
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
  if (request.method === "POST" && request.url === "/api/narrate") {
    readJsonBody(request)
      .then(async (payload) => {
        if (!ELEVENLABS_API_KEY) {
          sendJson(response, 500, {
            error: "Configure ELEVENLABS_API_KEY no ambiente do servidor antes de usar a narracao.",
          });
          return;
        }

        const text = String(payload.text || "").trim();

        if (!text) {
          sendJson(response, 400, { error: "Texto vazio para narracao." });
          return;
        }

        const audioBuffer = await requestNarrationFromElevenLabs(text);
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
