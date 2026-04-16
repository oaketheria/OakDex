const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5500;
const HOST = "127.0.0.1";
const ROOT = __dirname;

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

const server = http.createServer((request, response) => {
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
