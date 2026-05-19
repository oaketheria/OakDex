const http = require("http");
const fs = require("fs");
const https = require("https");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
let SocketIOServer = null;
let PgPool = null;

try {
  ({ Server: SocketIOServer } = require("socket.io"));
} catch (error) {
  SocketIOServer = null;
}

try {
  ({ Pool: PgPool } = require("pg"));
} catch (error) {
  PgPool = null;
}

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
const DATABASE_URL = process.env.DATABASE_URL || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const dbPool = PgPool && DATABASE_URL
  ? new PgPool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes("supabase") || DATABASE_URL.includes("pooler")
        ? { rejectUnauthorized: false }
        : undefined,
    })
  : null;
let dbInitPromise = null;

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
  if (pathname === "/rom" || pathname.startsWith("/rom/")) {
    return path.join(ROOT, "rom.html");
  }

  const sanitizedPath = pathname === "/" ? "/index.html" : pathname;
  const normalized = path.normalize(sanitizedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(ROOT, normalized);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signAuthPayload(payload) {
  if (!JWT_SECRET) return "";
  const body = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyAuthToken(token = "") {
  if (!JWT_SECRET || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", JWT_SECRET).update(body).digest("base64url");
  const a = Buffer.from(signature || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload?.userId || (payload.exp && Date.now() > payload.exp)) return null;
    return payload;
  } catch {
    return null;
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password || ""), salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored = "") {
  const [salt, expected] = String(stored || "").split(":");
  if (!salt || !expected) return false;
  const actual = hashPassword(password, salt).split(":")[1];
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function hasSupabaseAuth() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function supabaseAuthRequest(pathname, options = {}) {
  return new Promise((resolve, reject) => {
    if (!hasSupabaseAuth()) {
      reject(new Error("Supabase Auth indisponivel no servidor."));
      return;
    }
    const payload = options.body ? JSON.stringify(options.body) : null;
    const url = new URL(pathname, SUPABASE_URL);
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    };
    if (payload) headers["Content-Length"] = Buffer.byteLength(payload);
    const upstream = https.request(url, {
      method: options.method || "GET",
      headers,
    }, (upstreamResponse) => {
      const chunks = [];
      upstreamResponse.on("data", (chunk) => chunks.push(chunk));
      upstreamResponse.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        const data = text ? JSON.parse(text) : {};
        if (upstreamResponse.statusCode >= 200 && upstreamResponse.statusCode < 300) {
          resolve(data);
          return;
        }
        const message = data?.msg || data?.message || data?.error_description || data?.error || "Falha no Supabase Auth.";
        const error = new Error(message);
        error.statusCode = upstreamResponse.statusCode;
        reject(error);
      });
    });
    upstream.on("error", reject);
    if (payload) upstream.write(payload);
    upstream.end();
  });
}

function authRedirectUrl(request, mode = "reset") {
  const proto = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers["x-forwarded-host"] || request.headers.host || "";
  return `${proto}://${host}/oak-rogue.html#auth=${mode}`;
}

function sanitizeNick(nick = "") {
  return String(nick || "").trim().replace(/\s+/g, " ").slice(0, 18);
}

function sanitizeLogin(value = "") {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, 24);
}

function sanitizeEmail(value = "") {
  return String(value || "").trim().toLowerCase().slice(0, 120);
}

async function ensureDb() {
  if (!dbPool) return false;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      await dbPool.query(`
        create table if not exists users (
          id bigserial primary key,
          login text not null unique,
          nick text not null unique,
          password_hash text not null,
          auth_id uuid unique,
          email text unique,
          created_at timestamptz not null default now()
        );
        alter table users add column if not exists auth_id uuid unique;
        alter table users add column if not exists email text unique;
        alter table users alter column password_hash drop not null;
        create table if not exists rank_profiles (
          user_id bigint primary key references users(id) on delete cascade,
          points integer not null default 0,
          wins integer not null default 0,
          losses integer not null default 0,
          streak integer not null default 0,
          updated_at timestamptz not null default now()
        );
        create table if not exists match_history (
          id bigserial primary key,
          match_id text not null,
          user_id bigint not null references users(id) on delete cascade,
          rival_user_id bigint,
          rival_nick text not null,
          won boolean not null,
          score_me integer not null default 0,
          score_rival integer not null default 0,
          arena_id text,
          arena_name text,
          rank_delta integer not null default 0,
          points_after integer not null default 0,
          duration_ms integer not null default 0,
          created_at timestamptz not null default now()
        );
      `);
      return true;
    })().catch((error) => {
      console.error("[auth] Falha ao inicializar banco:", error);
      dbInitPromise = null;
      return false;
    });
  }
  return dbInitPromise;
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: Number(row.id || row.user_id),
    login: row.login || row.email,
    email: row.email,
    nick: row.nick,
    points: Number(row.points || 0),
    wins: Number(row.wins || 0),
    losses: Number(row.losses || 0),
    streak: Number(row.streak || 0),
  };
}

async function profileForAuthUser(authUser) {
  if (!authUser?.id || !(await ensureDb())) return null;
  const { rows } = await dbPool.query(`
    select u.id, u.login, u.email, u.nick, r.points, r.wins, r.losses, r.streak
    from users u
    left join rank_profiles r on r.user_id = u.id
    where u.auth_id = $1
  `, [authUser.id]);
  return publicUser(rows[0]);
}

async function authUserFromRequest(request) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  if (hasSupabaseAuth()) {
    try {
      return await profileForAuthUser(await supabaseAuthRequest("/auth/v1/user", { token }));
    } catch {
      return null;
    }
  }
  const payload = verifyAuthToken(token);
  if (!payload || !(await ensureDb())) return null;
  const { rows } = await dbPool.query(`
    select u.id, u.login, u.email, u.nick, r.points, r.wins, r.losses, r.streak
    from users u
    left join rank_profiles r on r.user_id = u.id
    where u.id = $1
  `, [payload.userId]);
  return publicUser(rows[0]);
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
  if (request.method === "POST" && request.url === "/api/auth/register") {
    readJsonBody(request)
      .then(async (payload) => {
        if (!(await ensureDb())) return sendJson(response, 503, { error: "Banco indisponivel no servidor." });
        if (hasSupabaseAuth()) {
          const email = sanitizeEmail(payload.email || payload.login);
          const nick = sanitizeNick(payload.nick || payload.login || email.split("@")[0]);
          const password = String(payload.password || "");
          if (!email.includes("@")) return sendJson(response, 400, { error: "Informe um e-mail valido." });
          if (nick.length < 3) return sendJson(response, 400, { error: "Nick precisa ter pelo menos 3 caracteres." });
          if (password.length < 6) return sendJson(response, 400, { error: "Senha precisa ter pelo menos 6 caracteres." });
          const existingNick = await dbPool.query("select 1 from users where lower(nick) = lower($1) limit 1", [nick]);
          if (existingNick.rows.length) return sendJson(response, 409, { error: "Esse nick ja esta em uso." });
          try {
            const auth = await supabaseAuthRequest("/auth/v1/signup", {
              method: "POST",
              body: { email, password, data: { nick }, email_redirect_to: authRedirectUrl(request, "verified") },
            });
            const authUser = auth.user;
            const session = auth.session || auth;
            if (!authUser?.id) return sendJson(response, 500, { error: "Supabase nao retornou o usuario criado." });
            const { rows } = await dbPool.query(`
              insert into users (login, email, nick, password_hash, auth_id)
              values ($1, $2, $3, '', $4)
              returning id, login, email, nick
            `, [email, email, nick, authUser.id]);
            await dbPool.query("insert into rank_profiles (user_id) values ($1) on conflict do nothing", [rows[0].id]);
            const user = publicUser({ ...rows[0], points: 0, wins: 0, losses: 0, streak: 0 });
            sendJson(response, 200, {
              user,
              token: session.access_token || "",
              refreshToken: session.refresh_token || "",
              needsEmailConfirmation: !session.access_token,
              message: session.access_token ? "Conta criada." : "Conta criada. Confirme seu e-mail antes de entrar.",
            });
          } catch (error) {
            const message = String(error.message || "");
            const emailUsed = /already|registered|exists|user/i.test(message);
            sendJson(response, error.statusCode === 422 || emailUsed ? 409 : 500, {
              error: emailUsed ? "Esse e-mail ja esta em uso." : message || "Falha ao criar conta.",
            });
          }
          return;
        }
        if (!JWT_SECRET) return sendJson(response, 503, { error: "Auth indisponivel no servidor." });
        const login = sanitizeLogin(payload.login || payload.nick);
        const nick = sanitizeNick(payload.nick || payload.login);
        const password = String(payload.password || "");
        if (login.length < 3) return sendJson(response, 400, { error: "Login precisa ter pelo menos 3 caracteres." });
        if (nick.length < 3) return sendJson(response, 400, { error: "Nick precisa ter pelo menos 3 caracteres." });
        if (password.length < 6) return sendJson(response, 400, { error: "Senha precisa ter pelo menos 6 caracteres." });
        const passwordHash = hashPassword(password);
        try {
          const { rows } = await dbPool.query(`
            insert into users (login, nick, password_hash)
            values ($1, $2, $3)
            returning id, login, nick
          `, [login, nick, passwordHash]);
          await dbPool.query("insert into rank_profiles (user_id) values ($1) on conflict do nothing", [rows[0].id]);
          const user = publicUser({ ...rows[0], points: 0, wins: 0, losses: 0, streak: 0 });
          const token = signAuthPayload({ userId: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 });
          sendJson(response, 200, { user, token });
        } catch (error) {
          const duplicated = String(error.code) === "23505";
          if (!duplicated) {
            sendJson(response, 500, { error: "Falha ao criar conta." });
            return;
          }
          const constraint = String(error.constraint || "");
          if (constraint.includes("users_login")) {
            sendJson(response, 409, { error: "Esse login ja esta em uso." });
            return;
          }
          if (constraint.includes("users_nick")) {
            sendJson(response, 409, { error: "Esse nick ja esta em uso." });
            return;
          }
          const [{ rows: loginRows }, { rows: nickRows }] = await Promise.all([
            dbPool.query("select 1 from users where login = $1 limit 1", [login]),
            dbPool.query("select 1 from users where nick = $1 limit 1", [nick]),
          ]);
          sendJson(response, 409, {
            error: loginRows.length
              ? "Esse login ja esta em uso."
              : nickRows.length
              ? "Esse nick ja esta em uso."
              : "Login ou nick ja esta em uso.",
          });
        }
      })
      .catch((error) => sendJson(response, 400, { error: error.message || "JSON invalido." }));
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/login") {
    readJsonBody(request)
      .then(async (payload) => {
        if (!(await ensureDb())) return sendJson(response, 503, { error: "Banco indisponivel no servidor." });
        if (hasSupabaseAuth()) {
          const email = sanitizeEmail(payload.email || payload.login);
          const password = String(payload.password || "");
          try {
            const auth = await supabaseAuthRequest("/auth/v1/token?grant_type=password", {
              method: "POST",
              body: { email, password },
            });
            const user = await profileForAuthUser(auth.user);
            if (!user) return sendJson(response, 403, { error: "Conta sem perfil de jogo. Crie a conta novamente ou fale com o admin." });
            sendJson(response, 200, { user, token: auth.access_token, refreshToken: auth.refresh_token });
          } catch (error) {
            const message = /confirm|verified/i.test(String(error.message || ""))
              ? "Confirme seu e-mail antes de entrar."
              : "E-mail ou senha invalidos.";
            sendJson(response, error.statusCode || 401, { error: message });
          }
          return;
        }
        if (!JWT_SECRET) return sendJson(response, 503, { error: "Auth indisponivel no servidor." });
        const login = sanitizeLogin(payload.login || payload.nick);
        const password = String(payload.password || "");
        const { rows } = await dbPool.query(`
          select u.id, u.login, u.email, u.nick, u.password_hash, r.points, r.wins, r.losses, r.streak
          from users u
          left join rank_profiles r on r.user_id = u.id
          where u.login = $1
        `, [login]);
        const row = rows[0];
        if (!row || !verifyPassword(password, row.password_hash)) return sendJson(response, 401, { error: "Login ou senha invalidos." });
        const user = publicUser(row);
        const token = signAuthPayload({ userId: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 });
        sendJson(response, 200, { user, token });
      })
      .catch((error) => sendJson(response, 400, { error: error.message || "JSON invalido." }));
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/recover") {
    readJsonBody(request)
      .then(async (payload) => {
        if (!hasSupabaseAuth()) return sendJson(response, 503, { error: "Recuperacao indisponivel no servidor." });
        const email = sanitizeEmail(payload.email || payload.login);
        if (!email.includes("@")) return sendJson(response, 400, { error: "Informe um e-mail valido." });
        await supabaseAuthRequest("/auth/v1/recover", {
          method: "POST",
          body: { email, redirect_to: authRedirectUrl(request, "reset") },
        });
        sendJson(response, 200, { message: "Se o e-mail existir, o Supabase enviara o link de recuperacao." });
      })
      .catch((error) => sendJson(response, error.statusCode || 400, { error: error.message || "Falha ao pedir recuperacao." }));
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/update-password") {
    readJsonBody(request)
      .then(async (payload) => {
        if (!hasSupabaseAuth()) return sendJson(response, 503, { error: "Reset indisponivel no servidor." });
        const header = request.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : String(payload.token || "");
        const password = String(payload.password || "");
        if (!token) return sendJson(response, 401, { error: "Link de recuperacao invalido ou expirado." });
        if (password.length < 6) return sendJson(response, 400, { error: "Senha precisa ter pelo menos 6 caracteres." });
        await supabaseAuthRequest("/auth/v1/user", { method: "PUT", token, body: { password } });
        sendJson(response, 200, { message: "Senha alterada. Entre com a nova senha." });
      })
      .catch((error) => sendJson(response, error.statusCode || 400, { error: error.message || "Falha ao alterar senha." }));
    return;
  }

  if (request.method === "GET" && request.url === "/api/me") {
    authUserFromRequest(request)
      .then((user) => sendJson(response, user ? 200 : 401, user ? { user } : { error: "Nao autenticado." }))
      .catch(() => sendJson(response, 500, { error: "Falha ao carregar usuario." }));
    return;
  }

  if (request.method === "GET" && request.url === "/api/ranked") {
    ensureDb()
      .then(async (ok) => {
        if (!ok) return sendJson(response, 503, { error: "Ranking online indisponivel." });
        const { rows } = await dbPool.query(`
          select u.id, u.nick, r.points, r.wins, r.losses, r.streak
          from rank_profiles r
          join users u on u.id = r.user_id
          order by r.points desc, r.wins desc, u.nick asc
          limit 100
        `);
        sendJson(response, 200, { rows: rows.map(publicUser) });
      })
      .catch(() => sendJson(response, 500, { error: "Falha ao carregar ranking." }));
    return;
  }

  if (request.method === "GET" && request.url === "/api/history") {
    authUserFromRequest(request)
      .then(async (user) => {
        if (!user) return sendJson(response, 401, { error: "Nao autenticado." });
        const { rows } = await dbPool.query(`
          select *
          from match_history
          where user_id = $1
          order by created_at desc
          limit 10
        `, [user.id]);
        sendJson(response, 200, { rows });
      })
      .catch(() => sendJson(response, 500, { error: "Falha ao carregar historico." }));
    return;
  }

  if (request.method === "GET" && request.url === "/api/draft-pool-status") {
    sendJson(response, 200, {
      loaded: draftPoolsLoaded,
      loading: draftPoolsLoading,
      normal: DRAFT_POKEMON_POOL.length,
      legendaryMythical: DRAFT_LEGENDARY_POOL.length,
      fallback: DRAFT_POKEMON_POOL === DRAFT_POKEMON_POOL_FALLBACK,
      sample: DRAFT_POKEMON_POOL.slice(0, 12).map((pokemon) => pokemon.name),
      specialSample: DRAFT_LEGENDARY_POOL.slice(0, 12).map((pokemon) => pokemon.name),
    });
    return;
  }

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

    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    response.end(data);
  });
});

const DRAFT_POKEMON_POOL_FALLBACK = [
  { id: 3, name: "Venusaur", types: ["Grass", "Poison"] },
  { id: 6, name: "Charizard", types: ["Fire", "Flying"] },
  { id: 9, name: "Blastoise", types: ["Water"] },
  { id: 26, name: "Raichu", types: ["Electric"] },
  { id: 31, name: "Nidoqueen", types: ["Poison", "Ground"] },
  { id: 34, name: "Nidoking", types: ["Poison", "Ground"] },
  { id: 36, name: "Clefable", types: ["Fairy"] },
  { id: 38, name: "Ninetales", types: ["Fire"] },
  { id: 40, name: "Wigglytuff", types: ["Normal", "Fairy"] },
  { id: 59, name: "Arcanine", types: ["Fire"] },
  { id: 65, name: "Alakazam", types: ["Psychic"] },
  { id: 68, name: "Machamp", types: ["Fighting"] },
  { id: 76, name: "Golem", types: ["Rock", "Ground"] },
  { id: 80, name: "Slowbro", types: ["Water", "Psychic"] },
  { id: 94, name: "Gengar", types: ["Ghost", "Poison"] },
  { id: 103, name: "Exeggutor", types: ["Grass", "Psychic"] },
  { id: 121, name: "Starmie", types: ["Water", "Psychic"] },
  { id: 123, name: "Scyther", types: ["Bug", "Flying"] },
  { id: 130, name: "Gyarados", types: ["Water", "Flying"] },
  { id: 131, name: "Lapras", types: ["Water", "Ice"] },
  { id: 134, name: "Vaporeon", types: ["Water"] },
  { id: 135, name: "Jolteon", types: ["Electric"] },
  { id: 136, name: "Flareon", types: ["Fire"] },
  { id: 143, name: "Snorlax", types: ["Normal"] },
  { id: 149, name: "Dragonite", types: ["Dragon", "Flying"] },
].map((pokemon) => ({
  ...pokemon,
  sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
}));

const DRAFT_LEGENDARY_POOL_FALLBACK = [
  { id: 144, name: "Articuno", types: ["Ice", "Flying"] },
  { id: 145, name: "Zapdos", types: ["Electric", "Flying"] },
  { id: 146, name: "Moltres", types: ["Fire", "Flying"] },
  { id: 150, name: "Mewtwo", types: ["Psychic"] },
  { id: 243, name: "Raikou", types: ["Electric"] },
  { id: 244, name: "Entei", types: ["Fire"] },
  { id: 245, name: "Suicune", types: ["Water"] },
  { id: 249, name: "Lugia", types: ["Psychic", "Flying"] },
  { id: 250, name: "Ho-Oh", types: ["Fire", "Flying"] },
  { id: 384, name: "Rayquaza", types: ["Dragon", "Flying"] },
].map((pokemon) => ({
  ...pokemon,
  legendary: true,
  sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
}));

let DRAFT_POKEMON_POOL = DRAFT_POKEMON_POOL_FALLBACK;
let DRAFT_LEGENDARY_POOL = DRAFT_LEGENDARY_POOL_FALLBACK;
let draftPoolsLoading = false;
let draftPoolsLoaded = false;
let draftPoolsPromise = null;
const DRAFT_NATIONAL_DEX_LIMIT = 1025;
const POKEAPI_BASE = "https://pokeapi.co/api/v2";
const DRAFT_POOL_CACHE_PATH = path.join(ROOT, "draft-pokemon-pools.json");

function draftPokemonSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function formatDraftPokemonName(name = "") {
  return String(name)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function loadDraftPokemonPoolsFromCache() {
  try {
    if (!fs.existsSync(DRAFT_POOL_CACHE_PATH)) return false;
    const cache = JSON.parse(fs.readFileSync(DRAFT_POOL_CACHE_PATH, "utf8"));
    if (!Array.isArray(cache.normal) || !Array.isArray(cache.legendaryMythical)) return false;
    if (!cache.normal.length || !cache.legendaryMythical.length) return false;
    DRAFT_POKEMON_POOL = cache.normal;
    DRAFT_LEGENDARY_POOL = cache.legendaryMythical;
    draftPoolsLoaded = true;
    console.log(`[draft-battle] Pool local carregado: ${DRAFT_POKEMON_POOL.length} finais, ${DRAFT_LEGENDARY_POOL.length} lendarios/miticos.`);
    return true;
  } catch (error) {
    console.warn("[draft-battle] Falha ao ler cache local do pool. Tentando PokeAPI.", error?.message || error);
    return false;
  }
}

async function fetchDraftJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PokeAPI ${response.status} em ${url}`);
  return response.json();
}

async function mapDraftPoolLimited(items, limit, mapper) {
  const results = new Array(items.length);
  let index = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

async function loadDraftPokemonPools() {
  if (draftPoolsLoaded || typeof fetch !== "function") return draftPoolsPromise;
  if (draftPoolsLoading) return draftPoolsPromise;
  draftPoolsLoading = true;
  draftPoolsPromise = (async () => {
    const list = await fetchDraftJson(`${POKEAPI_BASE}/pokemon-species?limit=${DRAFT_NATIONAL_DEX_LIMIT}`);
    const entries = (list.results || [])
      .map((entry, index) => ({
        id: Number(entry.url?.match(/\/pokemon-species\/(\d+)\//)?.[1]) || index + 1,
        name: entry.name,
      }))
      .filter((entry) => entry.id > 0 && entry.id <= DRAFT_NATIONAL_DEX_LIMIT);

    const speciesList = await mapDraftPoolLimited(entries, 16, async (entry) => {
      const species = await fetchDraftJson(`${POKEAPI_BASE}/pokemon-species/${entry.id}`);
      return {
        id: entry.id,
        name: species.name || entry.name,
        evolvesFromId: Number(species.evolves_from_species?.url?.match(/\/pokemon-species\/(\d+)\//)?.[1]) || 0,
        legendary: !!species.is_legendary,
        mythical: !!species.is_mythical,
      };
    });

    const evolvesFromIds = new Set(speciesList.map((species) => species.evolvesFromId).filter(Boolean));
    const finalSpecies = speciesList.filter((species) => !evolvesFromIds.has(species.id));
    const hydrated = await mapDraftPoolLimited(finalSpecies, 16, async (species) => {
      const pokemon = await fetchDraftJson(`${POKEAPI_BASE}/pokemon/${species.id}`);
      return {
        id: species.id,
        name: formatDraftPokemonName(pokemon.name || species.name),
        types: (pokemon.types || []).sort((a, b) => a.slot - b.slot).map((entry) => formatDraftPokemonName(entry.type?.name)),
        legendary: species.legendary || species.mythical,
        mythical: species.mythical,
        sprite: draftPokemonSprite(species.id),
      };
    });

    const normalPool = hydrated.filter((pokemon) => !pokemon.legendary && pokemon.types.length);
    const legendaryPool = hydrated.filter((pokemon) => pokemon.legendary && pokemon.types.length);
    if (normalPool.length) DRAFT_POKEMON_POOL = normalPool;
    if (legendaryPool.length) DRAFT_LEGENDARY_POOL = legendaryPool;
    draftPoolsLoaded = true;
    console.log(`[draft-battle] Pools expandidos: ${DRAFT_POKEMON_POOL.length} finais, ${DRAFT_LEGENDARY_POOL.length} lendarios/miticos.`);
  })();
  try {
    await draftPoolsPromise;
  } catch (error) {
    console.warn("[draft-battle] Nao foi possivel expandir pools pela PokeAPI. Usando fallback.", error?.message || error);
  } finally {
    draftPoolsLoading = false;
  }
  return draftPoolsPromise;
}

if (!loadDraftPokemonPoolsFromCache()) loadDraftPokemonPools();

const DRAFT_MOVE_POOL = {
  Normal: ["Investida", "Ataque Rapido", "Corpo Pesado"],
  Fire: ["Lanca-chamas", "Presas de Fogo", "Roda de Fogo"],
  Water: ["Surf", "Cauda Aqua", "Jato d'Agua"],
  Grass: ["Folha Navalha", "Mega Dreno", "Chicote de Vinha"],
  Electric: ["Raio", "Trovao", "Onda Trovao"],
  Psychic: ["Psiquico", "Confusao", "Barreira"],
  Fighting: ["Soco Dinamico", "Chute Baixo", "Quebra Guarda"],
  Poison: ["Veneno X", "Acido", "Toxico"],
  Ground: ["Terremoto", "Tapa de Lama", "Magnitude"],
  Rock: ["Pedra Afiada", "Arremesso", "Defesa Rochosa"],
  Ghost: ["Bola Sombria", "Lambida", "Assombrar"],
  Fairy: ["Brilho Magico", "Voz Encantada", "Beijo Drenante"],
  Flying: ["Vendaval", "Ataque Aereo", "Corte de Ar"],
  Ice: ["Raio de Gelo", "Nevasca", "Vento Gelado"],
  Bug: ["Corte Furia", "Zumbido", "Picada"],
  Dragon: ["Pulso Dragao", "Cauda Dragao", "Garra Dragao"],
};

const DRAFT_RELIC_POOL = [
  { id: "focus-band", name: "Faixa Foco", text: "Sobrevive a 1 golpe fatal, mas nao da bonus de dano.", sprite: "focus-band", kind: "sash" },
  { id: "shell-bell", name: "Sino Concha", text: "Cura ao causar dano, mas reduz o dano final.", sprite: "shell-bell", kind: "heal" },
  { id: "quick-claw", name: "Garra Rapida", text: "Mais velocidade, com ataque um pouco menor.", sprite: "quick-claw", kind: "spd" },
  { id: "scope-lens", name: "Lente Mira", text: "Mais chance critica, porem recebe mais dano.", sprite: "scope-lens", kind: "crit" },
  { id: "leftovers", name: "Restos", text: "Cura constante, mas bate com menos forca.", sprite: "leftovers", kind: "heal" },
  { id: "type-charm", name: "Amuleto de Tipo", text: "STAB mais forte, golpes fora do tipo ficam menores.", sprite: "expert-belt", kind: "damage" },
  { id: "life-orb", name: "Orbe Vida", text: "Dano alto, mas sofre recuo ao atacar.", sprite: "life-orb", kind: "damage" },
  { id: "muscle-band", name: "Faixa Musculo", text: "Ataque maior, porem fica mais vulneravel.", sprite: "muscle-band", kind: "atk" },
  { id: "wise-glasses", name: "Oculos Sabios", text: "Dano tecnico maior, mas defesa menor.", sprite: "wise-glasses", kind: "damage" },
  { id: "choice-scarf", name: "Lenco Escolha", text: "Velocidade alta, mas dano reduzido.", sprite: "choice-scarf", kind: "spd" },
  { id: "assault-vest", name: "Colete Assalto", text: "Recebe menos dano, mas perde velocidade.", sprite: "assault-vest", kind: "def" },
  { id: "rocky-helmet", name: "Capacete", text: "Recebe menos dano e pune quem ataca.", sprite: "rocky-helmet", kind: "def" },
  { id: "sitrus-berry", name: "Fruta Sitrus", text: "Cura emergencial sem penalidade ofensiva.", sprite: "sitrus-berry", kind: "heal" },
  { id: "lum-berry", name: "Fruta Lum", text: "Mais resistencia, mas dano um pouco menor.", sprite: "lum-berry", kind: "def" },
  { id: "metronome", name: "Metronomo", text: "Comeca fraco e escala a cada duelo vencido.", sprite: "metronome", kind: "damage" },
  { id: "razor-claw", name: "Garra Navalha", text: "Critico agressivo, mas defesa pior.", sprite: "razor-claw", kind: "crit" },
  { id: "king-rock", name: "Pedra Rei", text: "Pressiona com mais dano, mas perde defesa.", sprite: "kings-rock", kind: "damage" },
  { id: "bright-powder", name: "Po Claro", text: "Recebe menos dano, mas causa menos dano.", sprite: "bright-powder", kind: "def" },
  { id: "charcoal", name: "Carvao Vivo", text: "Fire forte, mas sofre mais contra Water.", sprite: "charcoal", kind: "damage" },
  { id: "mystic-water", name: "Agua Mistica", text: "Water forte, mas Fire causa menos impacto.", sprite: "mystic-water", kind: "damage" },
  { id: "magnet", name: "Ima", text: "Electric forte, mas perde defesa.", sprite: "magnet", kind: "damage" },
  { id: "miracle-seed", name: "Semente Milagre", text: "Grass forte e pequena cura, mas dano neutro menor.", sprite: "miracle-seed", kind: "damage" },
  { id: "black-belt", name: "Faixa Preta", text: "Fighting forte, mas recebe mais dano especial.", sprite: "black-belt", kind: "damage" },
  { id: "dragon-fang", name: "Presa Dragao", text: "Dragon muito forte, mas velocidade menor.", sprite: "dragon-fang", kind: "damage" },
];

const DRAFT_TURN_MS = 20000;
const DRAFT_BUILD_MS = 90000;
const DRAFT_ARENAS = [
  { id: "neutral", name: "Arena Neutra", icon: "VS", text: "Sem bonus. So draft e build." },
  { id: "rain", name: "Chuva", icon: "WA", text: "Water +10%, Fire -5%." },
  { id: "sun", name: "Sol Forte", icon: "FI", text: "Fire +10%, Water -5%." },
  { id: "electric", name: "Campo Eletrico", icon: "EL", text: "Electric +10%." },
  { id: "mist", name: "Nevoa", icon: "CR", text: "Criticos reduzidos." },
  { id: "storm", name: "Tempestade", icon: "DF", text: "Rock, Ground e Steel recebem defesa." },
  { id: "garden", name: "Jardim Vivo", icon: "GR", text: "Grass cura ao atacar. Poison pressiona Grass." },
  { id: "toxic", name: "Pantano Toxico", icon: "PO", text: "Poison +10%. Fairy e Grass recebem +5% dano." },
  { id: "glacier", name: "Glacial", icon: "IC", text: "Ice +12%. Dragon e Flying -6% no dano." },
  { id: "spirit", name: "Ruinas", icon: "GH", text: "Ghost e Psychic +10%. Normal -8%." },
  { id: "drake", name: "Covil Draconico", icon: "DR", text: "Dragon +12%. Fairy recebe -8% dano." },
  { id: "forge", name: "Forja Steel", icon: "ST", text: "Steel +10%. Fire causa +6% contra Steel." },
  { id: "gravity", name: "Gravidade Pesada", icon: "GV", text: "Flying perde defesa. Ground +8%." },
  { id: "tide", name: "Mare Alta", icon: "MA", text: "Water cura ao vencer. Electric pressiona Water." },
  { id: "gale", name: "Vento Cortante", icon: "VE", text: "Flying e Bug aceleram. Rock pressiona esses tipos." },
  { id: "night", name: "Noite Sombria", icon: "NO", text: "Dark e Ghost +10%. Psychic -6% no dano." },
  { id: "psychic", name: "Campo Psiquico", icon: "PS", text: "Psychic +12%. Velocidade pesa menos." },
  { id: "forest", name: "Floresta Fechada", icon: "FL", text: "Grass e Bug defendem melhor. Fire pressiona." },
  { id: "eruption", name: "Erupcao", icon: "ER", text: "Fire +12%. Ice e Grass recebem +6% dano." },
  { id: "crystal", name: "Caverna Cristalina", icon: "CC", text: "Rock e Ice defendem melhor. Steel +6% contra eles." },
];

function selectDraftArena() {
  return DRAFT_ARENAS[Math.floor(Math.random() * DRAFT_ARENAS.length)] || DRAFT_ARENAS[0];
}

const DRAFT_BAN_STAGE = { id: "normal", title: "Ban", copy: "Escolha 1 das 6 opcoes para remover do draft desta partida." };

function draftSpriteSlug(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function draftBannedList(match) {
  return Object.values(match?.bans || {})
    .flatMap((bans) => Array.isArray(bans) ? bans : bans ? [bans] : [])
    .filter(Boolean);
}

function draftBannedIds(match) {
  return new Set(draftBannedList(match).map((pokemon) => pokemon.id));
}

function createDraftPokemonOptions(match, count = 3) {
  const pickIndex = (match.teams?.[match.turn]?.length || 0) + 1;
  const source = pickIndex === 6 ? DRAFT_LEGENDARY_POOL : DRAFT_POKEMON_POOL;
  const pickedIds = new Set(
    Object.values(match.teams || {})
      .flat()
      .map((pokemon) => pokemon.id),
  );
  const pendingIds = new Set(
    Object.values(match.options || {})
      .flat()
      .map((pokemon) => pokemon.id),
  );
  const available = source.filter((pokemon) => !pickedIds.has(pokemon.id) && !pendingIds.has(pokemon.id));
  const bannedIds = draftBannedIds(match);
  const filteredAvailable = available.filter((pokemon) => !bannedIds.has(pokemon.id));
  return filteredAvailable.sort(() => Math.random() - 0.5).slice(0, count).map((pokemon) => {
    if (pickIndex !== 3) return pokemon;
    return {
      ...pokemon,
      shiny: true,
      spriteSlug: draftSpriteSlug(pokemon.name),
      sprite: `https://play.pokemonshowdown.com/sprites/ani-shiny/${draftSpriteSlug(pokemon.name)}.gif`,
    };
  });
}

function draftBanCountForPlayer(match, playerId) {
  const bans = match?.bans?.[playerId];
  return Array.isArray(bans) ? bans.filter(Boolean).length : bans ? 1 : 0;
}

function draftBanStageForPickNumber(pickNumber = 1) {
  if (pickNumber === 3) return { id: "shiny", title: "Ban shiny", copy: "Remova uma opcao shiny da terceira rodada de bans." };
  if (pickNumber === 6) return { id: "legendary", title: "Ban lendario", copy: "Remova um lendario da sexta rodada de bans." };
  return DRAFT_BAN_STAGE;
}

function draftBanStageForPlayer(match, playerId) {
  return draftBanStageForPickNumber(draftBanCountForPlayer(match, playerId) + 1);
}

function createBanOptions(match, playerId, count = 6) {
  const stage = draftBanStageForPlayer(match, playerId);
  const bannedIds = draftBannedIds(match);
  const source = stage.id === "legendary" ? DRAFT_LEGENDARY_POOL : DRAFT_POKEMON_POOL;
  return source
    .filter((pokemon) => !bannedIds.has(pokemon.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((pokemon) => stage.id === "shiny"
      ? {
          ...pokemon,
          shiny: true,
          banStage: stage.id,
          spriteSlug: draftSpriteSlug(pokemon.name),
          sprite: `https://play.pokemonshowdown.com/sprites/ani-shiny/${draftSpriteSlug(pokemon.name)}.gif`,
        }
      : { ...pokemon, banStage: stage.id });
}

function createBuildOptionsForPokemon(pokemon) {
  const typedMoves = (pokemon.types || ["Normal"]).flatMap((type) => DRAFT_MOVE_POOL[type] || []);
  const fallbackMoves = DRAFT_MOVE_POOL.Normal;
  const moves = [...new Set([...typedMoves, ...fallbackMoves])]
    .slice(0, 5)
    .map((name, index) => ({ id: `${pokemon.id}-move-${index}`, name }));
  const relicStart = pokemon.id % DRAFT_RELIC_POOL.length;
  const relics = Array.from({ length: 3 }, (_, index) => DRAFT_RELIC_POOL[(relicStart + index) % DRAFT_RELIC_POOL.length]);
  return { pokemonId: pokemon.id, moves, relics };
}

function defaultBuildSelections(options = []) {
  return options.map((entry) => ({
    pokemonId: entry.pokemonId,
    moves: (entry.moves || []).slice(0, 2),
    relic: (entry.relics || [])[0],
  })).filter((entry) => entry.moves.length === 2 && entry.relic);
}

function draftArenaPowerModifier(pokemon = {}, build = {}, arena = null, opponent = {}) {
  const types = pokemon.types || [];
  const opponentTypes = opponent.types || [];
  const moveTypes = (build.moves || []).map((move) => move.type || types[0] || "Normal");
  const hasMoveType = (type) => moveTypes.includes(type);
  let modifier = 0;
  if (arena?.id === "rain") modifier += hasMoveType("Water") ? 10 : hasMoveType("Fire") ? -5 : 0;
  if (arena?.id === "sun") modifier += hasMoveType("Fire") ? 10 : hasMoveType("Water") ? -5 : 0;
  if (arena?.id === "electric" && hasMoveType("Electric")) modifier += 10;
  if (arena?.id === "storm" && types.some((type) => ["Rock", "Ground", "Steel"].includes(type))) modifier += 8;
  if (arena?.id === "garden") {
    if (types.includes("Grass")) modifier += 8;
    if (hasMoveType("Poison") && opponentTypes.includes("Grass")) modifier += 8;
  }
  if (arena?.id === "toxic") {
    if (hasMoveType("Poison")) modifier += 10;
    if (types.some((type) => ["Fairy", "Grass"].includes(type))) modifier -= 5;
  }
  if (arena?.id === "glacier") {
    if (hasMoveType("Ice")) modifier += 12;
    if (types.some((type) => ["Dragon", "Flying"].includes(type))) modifier -= 6;
  }
  if (arena?.id === "spirit") {
    if (moveTypes.some((type) => ["Ghost", "Psychic"].includes(type))) modifier += 10;
    if (hasMoveType("Normal")) modifier -= 8;
  }
  if (arena?.id === "drake") {
    if (hasMoveType("Dragon")) modifier += 12;
    if (types.includes("Fairy")) modifier += 8;
  }
  if (arena?.id === "forge") {
    if (hasMoveType("Steel")) modifier += 10;
    if (hasMoveType("Fire") && opponentTypes.includes("Steel")) modifier += 6;
  }
  if (arena?.id === "gravity") {
    if (hasMoveType("Ground")) modifier += 8;
    if (opponentTypes.includes("Flying")) modifier += 6;
  }
  if (arena?.id === "tide") {
    if (types.includes("Water")) modifier += 7;
    if (hasMoveType("Electric") && opponentTypes.includes("Water")) modifier += 6;
  }
  if (arena?.id === "gale") {
    if (types.some((type) => ["Flying", "Bug"].includes(type))) modifier += 6;
    if (hasMoveType("Rock") && opponentTypes.some((type) => ["Flying", "Bug"].includes(type))) modifier += 8;
  }
  if (arena?.id === "night") {
    if (moveTypes.some((type) => ["Dark", "Ghost"].includes(type))) modifier += 10;
    if (hasMoveType("Psychic")) modifier -= 6;
  }
  if (arena?.id === "psychic") {
    if (hasMoveType("Psychic")) modifier += 12;
    if ((pokemon.spd || 0) > (opponent.spd || 0)) modifier -= 3;
  }
  if (arena?.id === "forest") {
    if (types.some((type) => ["Grass", "Bug"].includes(type))) modifier += 8;
    if (hasMoveType("Fire") && opponentTypes.some((type) => ["Grass", "Bug"].includes(type))) modifier += 8;
  }
  if (arena?.id === "eruption") {
    if (hasMoveType("Fire")) modifier += 12;
    if (types.some((type) => ["Ice", "Grass"].includes(type))) modifier -= 6;
  }
  if (arena?.id === "crystal") {
    if (types.some((type) => ["Rock", "Ice"].includes(type))) modifier += 8;
    if (hasMoveType("Steel") && opponentTypes.some((type) => ["Rock", "Ice"].includes(type))) modifier += 6;
  }
  return modifier;
}

function draftPowerForPokemon(pokemon, build = {}, arena = null, opponent = {}) {
  const base = 80 + (pokemon.id % 70);
  const typeBonus = (pokemon.types || []).length > 1 ? 8 : 0;
  const moveBonus = (build.moves || []).reduce((total, move) => total + String(move.name || "").length, 0);
  const relicBonus = {
    "focus-band": 18,
    "shell-bell": 16,
    "quick-claw": 14,
    "scope-lens": 17,
    leftovers: 16,
    "type-charm": 18,
    "life-orb": 22,
    "muscle-band": 17,
    "wise-glasses": 17,
    "choice-scarf": 16,
    "assault-vest": 19,
    "rocky-helmet": 15,
    "sitrus-berry": 16,
    "lum-berry": 14,
    metronome: 18,
    "razor-claw": 18,
    "king-rock": 16,
    "bright-powder": 15,
    charcoal: 17,
    "mystic-water": 17,
    magnet: 17,
    "miracle-seed": 17,
    "black-belt": 17,
    "dragon-fang": 20,
  }[build.relic?.id] || 10;
  return base + typeBonus + moveBonus + relicBonus + draftArenaPowerModifier(pokemon, build, arena, opponent);
}

function simulateDraftBattle(match) {
  const [first, second] = match.players;
  const firstBuilds = match.builds[first.id] || [];
  const secondBuilds = match.builds[second.id] || [];
  const firstTeam = match.order?.[first.id]?.map((pokemonId) => match.teams[first.id].find((pokemon) => pokemon.id === pokemonId)).filter(Boolean) || match.teams[first.id];
  const secondTeam = match.order?.[second.id]?.map((pokemonId) => match.teams[second.id].find((pokemon) => pokemon.id === pokemonId)).filter(Boolean) || match.teams[second.id];
  const rounds = [];
  let firstIndex = 0;
  let secondIndex = 0;
  let firstCarry = 0;
  let secondCarry = 0;

  while (firstIndex < firstTeam.length && secondIndex < secondTeam.length && rounds.length < 24) {
    const firstMon = firstTeam[firstIndex];
    const secondMon = secondTeam[secondIndex];
    const firstBuild = firstBuilds.find((build) => build.pokemonId === firstMon?.id);
    const secondBuild = secondBuilds.find((build) => build.pokemonId === secondMon?.id);
    const firstPower = draftPowerForPokemon(firstMon || {}, firstBuild, match.arena, secondMon || {}) - firstCarry;
    const secondPower = draftPowerForPokemon(secondMon || {}, secondBuild, match.arena, firstMon || {}) - secondCarry;
    const winnerId = firstPower >= secondPower ? first.id : second.id;
    rounds.push({
      index: rounds.length + 1,
      winnerId,
      left: { playerId: first.id, pokemon: firstMon, power: firstPower, build: firstBuild },
      right: { playerId: second.id, pokemon: secondMon, power: secondPower, build: secondBuild },
    });

    if (winnerId === first.id) {
      secondIndex += 1;
      firstCarry += 12;
      secondCarry = 0;
    } else {
      firstIndex += 1;
      secondCarry += 12;
      firstCarry = 0;
    }
  }

  const wins = rounds.reduce((score, round) => {
    score[round.winnerId] = (score[round.winnerId] || 0) + 1;
    return score;
  }, {});
  const winnerId = firstIndex < firstTeam.length ? first.id : second.id;
  return {
    winnerId,
    score: {
      [first.id]: secondIndex,
      [second.id]: firstIndex,
    },
    rounds,
  };
}

function rankedDeltaFor(profile = {}, won = false) {
  const streakBonus = won ? Math.min(10, Math.max(0, profile.streak || 0) * 2) : 0;
  return won ? 25 + streakBonus : -15;
}

async function rankedProfileForUser(userId) {
  if (!userId || !(await ensureDb())) return null;
  await dbPool.query("insert into rank_profiles (user_id) values ($1) on conflict do nothing", [userId]);
  const { rows } = await dbPool.query("select * from rank_profiles where user_id = $1", [userId]);
  return rows[0] || null;
}

async function applyRankedResultForPlayer(match, result, player, rival) {
  if (!player?.userId || !rival) return null;
  const profile = await rankedProfileForUser(player.userId);
  if (!profile) return null;
  const won = result.winnerId === player.id;
  const delta = rankedDeltaFor(profile, won);
  const points = Math.max(0, Number(profile.points || 0) + delta);
  const wins = Number(profile.wins || 0) + (won ? 1 : 0);
  const losses = Number(profile.losses || 0) + (won ? 0 : 1);
  const streak = won ? Number(profile.streak || 0) + 1 : 0;
  await dbPool.query(`
    update rank_profiles
    set points = $2, wins = $3, losses = $4, streak = $5, updated_at = now()
    where user_id = $1
  `, [player.userId, points, wins, losses, streak]);
  await dbPool.query(`
    insert into match_history (
      match_id, user_id, rival_user_id, rival_nick, won, score_me, score_rival,
      arena_id, arena_name, rank_delta, points_after, duration_ms
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
  `, [
    match.id,
    player.userId,
    rival.userId || null,
    rival.name || "Rival",
    won,
    result.score?.[player.id] || 0,
    result.score?.[rival.id] || 0,
    match.arena?.id || "",
    match.arena?.name || "",
    delta,
    points,
    0,
  ]);
  return { points, wins, losses, streak, delta };
}

async function persistRankedResult(match, result) {
  if (!dbPool || match?.mode !== "ranked") return result;
  try {
    const [first, second] = match.players || [];
    if (!first?.userId || !second?.userId) return result;
    const firstRank = await applyRankedResultForPlayer(match, result, first, second);
    const secondRank = await applyRankedResultForPlayer(match, result, second, first);
    result.rankByPlayer = {
      [first.id]: firstRank,
      [second.id]: secondRank,
    };
    return result;
  } catch (error) {
    console.error("[draft-battle] Falha ao salvar ranking:", error);
    return result;
  }
}

function createDraftBattleServer(httpServer) {
  if (!SocketIOServer) {
    console.warn("[draft-battle] Socket.IO nao instalado. Rode npm install para ativar o PvP online.");
    return;
  }

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });
  const queue = [];
  const matches = new Map();

  function publicMatchState(match) {
    return {
      id: match.id,
      phase: match.phase,
      turn: match.turn,
      round: match.round,
      maxTeamSize: match.maxTeamSize,
      bans: match.bans || {},
      banList: draftBannedList(match),
      banRound: match.banRound || 1,
      banStep: match.banPickNumber || draftBanCountForPlayer(match, match.banTurn) + 1,
      banStage: draftBanStageForPlayer(match, match.banTurn),
      banTurn: match.banTurn || null,
      arena: match.arena || null,
      mode: match.mode || "ranked",
      players: match.players.map((player) => ({
        id: player.id,
        name: player.name,
        bot: !!player.bot,
        team: match.teams[player.id] || [],
        buildReady: !!match.builds?.[player.id],
      })),
    };
  }

  function isBotPlayer(match, playerId) {
    return !!match?.players?.find((player) => player.id === playerId)?.bot;
  }

  function emitBanStart(match) {
    clearMatchTimer(match);
    match.phase = "ban";
    match.turn = null;
    match.bans ||= {};
    match.banOptions = {};
    match.banTurn = match.banTurn || match.players[0].id;
    match.banPickNumber = draftBanCountForPlayer(match, match.banTurn) + 1;
    match.banDeadline = Date.now() + DRAFT_TURN_MS;
    const options = createBanOptions(match, match.banTurn);
    match.banOptions[match.banTurn] = options;
    const stage = draftBanStageForPlayer(match, match.banTurn);
    match.players.forEach((player) => {
      io.to(player.id).emit(player.id === match.banTurn ? "ban:start" : "ban:waiting", {
        match: publicMatchState(match),
        options: player.id === match.banTurn ? options : [],
        stage,
        deadline: match.banDeadline,
      });
    });
    match.turnTimer = setTimeout(() => autoBanPick(match.id, match.banTurn), DRAFT_TURN_MS);
    if (isBotPlayer(match, match.banTurn)) {
      clearTimeout(match.turnTimer);
      match.turnTimer = setTimeout(() => autoBanPick(match.id, match.banTurn), 420);
    }
  }

  function maybeStartDraft(match) {
    if (!match || match.phase !== "ban") return;
    clearMatchTimer(match);
    if ((match.banRound || 1) < 12) {
      match.banRound = (match.banRound || 1) + 1;
      match.banTurn = match.players[(match.banRound - 1) % match.players.length].id;
      io.to(match.id).emit("ban:stage-complete", { match: publicMatchState(match) });
      emitBanStart(match);
      return;
    }
    match.phase = "draft";
    match.turn = match.players[0].id;
    match.round = 1;
    io.to(match.id).emit("ban:complete", { match: publicMatchState(match) });
    emitDraftOptions(match);
  }

  function pickBanPokemon(match, playerId, pokemonId, automatic = false) {
    const stageIndex = draftBanCountForPlayer(match, playerId);
    if (!match || match.phase !== "ban" || match.banTurn !== playerId || match.bans?.[playerId]?.[stageIndex]) return false;
    const options = match.banOptions?.[playerId] || [];
    const bannedIds = draftBannedIds(match);
    const requested = options.find((pokemon) => pokemon.id === Number(pokemonId));
    const picked = requested && !bannedIds.has(requested.id)
      ? requested
      : options.find((pokemon) => !bannedIds.has(pokemon.id)) || null;
    if (!picked) return false;
    match.bans[playerId] ||= [];
    match.bans[playerId][stageIndex] = picked;
    io.to(match.id).emit("ban:update", { match: publicMatchState(match), bannedBy: playerId, banned: picked, automatic });
    maybeStartDraft(match);
    return true;
  }

  function autoBanPicks(matchId) {
    const match = matches.get(matchId);
    if (!match || match.phase !== "ban") return;
    if (match.banTurn) pickBanPokemon(match, match.banTurn, 0, true);
    maybeStartDraft(match);
  }

  function autoBanPick(matchId, playerId) {
    const match = matches.get(matchId);
    pickBanPokemon(match, playerId, 0, true);
  }

  function emitDraftOptions(match) {
    clearMatchTimer(match);
    const options = createDraftPokemonOptions(match);
    match.options[match.turn] = options;
    match.turnDeadline = Date.now() + DRAFT_TURN_MS;
    io.to(match.turn).emit("draft:options", { match: publicMatchState(match), options, deadline: match.turnDeadline });
    match.players
      .filter((player) => player.id !== match.turn)
      .forEach((player) => io.to(player.id).emit("draft:waiting", { match: publicMatchState(match), deadline: match.turnDeadline }));
    match.turnTimer = setTimeout(() => autoDraftPick(match.id, match.turn), DRAFT_TURN_MS);
    if (isBotPlayer(match, match.turn)) {
      clearTimeout(match.turnTimer);
      match.turnTimer = setTimeout(() => autoDraftPick(match.id, match.turn), 520);
    }
  }

  function clearMatchTimer(match) {
    if (!match?.turnTimer) return;
    clearTimeout(match.turnTimer);
    match.turnTimer = null;
  }

  function pickDraftPokemon(match, playerId, pokemonId, automatic = false) {
    if (!match || match.phase !== "draft" || match.turn !== playerId) return false;
    const options = match.options[playerId] || [];
    const picked = options.find((pokemon) => pokemon.id === Number(pokemonId)) || (automatic ? options[0] : null);
    if (!picked || match.teams[playerId].length >= match.maxTeamSize) return false;
    clearMatchTimer(match);
    match.teams[playerId].push(picked);
    match.options[playerId] = [];
    io.to(match.id).emit("draft:update", { match: publicMatchState(match), pickedBy: playerId, picked, automatic });
    nextDraftTurn(match);
    return true;
  }

  function autoDraftPick(matchId, playerId) {
    const match = matches.get(matchId);
    pickDraftPokemon(match, playerId, 0, true);
  }

  function emitBuildStart(match) {
    clearMatchTimer(match);
    match.phase = "build";
    match.turn = null;
    match.builds = {};
    match.buildOptions = {};
    match.buildDeadline = Date.now() + DRAFT_BUILD_MS;
    match.players.forEach((player) => {
      match.buildOptions[player.id] = (match.teams[player.id] || []).map(createBuildOptionsForPokemon);
      io.to(player.id).emit("build:start", {
        match: publicMatchState(match),
        options: match.buildOptions[player.id],
        deadline: match.buildDeadline,
      });
    });
    match.players.forEach((player) => {
      if (!player.bot) return;
      match.builds[player.id] = defaultBuildSelections(match.buildOptions[player.id] || []);
      io.to(match.id).emit("build:update", { match: publicMatchState(match), readyBy: player.id, automatic: true });
    });
    match.turnTimer = setTimeout(() => autoSubmitBuilds(match.id), DRAFT_BUILD_MS);
    maybeStartOrderDraft(match);
  }

  function maybeStartOrderDraft(match) {
    if (!match || match.phase !== "build") return;
    if (!match.players.every((player) => match.builds[player.id])) return;
    clearMatchTimer(match);
    startOrderDraft(match);
  }

  function autoSubmitBuilds(matchId) {
    const match = matches.get(matchId);
    if (!match || match.phase !== "build") return;
    match.players.forEach((player) => {
      if (match.builds[player.id]) return;
      const options = match.buildOptions?.[player.id] || [];
      match.builds[player.id] = defaultBuildSelections(options);
      io.to(match.id).emit("build:update", { match: publicMatchState(match), readyBy: player.id, automatic: true });
    });
    maybeStartOrderDraft(match);
  }

  function publicOrderState(match) {
    return {
      match: publicMatchState(match),
      order: match.order || {},
      orderTurn: match.orderTurn,
      deadline: match.orderDeadline,
      maxTeamSize: match.maxTeamSize,
    };
  }

  function startOrderDraft(match) {
    match.phase = "order";
    match.order = {};
    match.orderTurn = match.players[0].id;
    match.players.forEach((player) => {
      match.order[player.id] = [];
    });
    startOrderTimer(match);
    io.to(match.id).emit("order:start", publicOrderState(match));
  }

  function startOrderTimer(match) {
    clearMatchTimer(match);
    match.orderDeadline = Date.now() + DRAFT_TURN_MS;
    match.turnTimer = setTimeout(() => autoOrderPick(match.id, match.orderTurn), DRAFT_TURN_MS);
    if (isBotPlayer(match, match.orderTurn)) {
      clearTimeout(match.turnTimer);
      match.turnTimer = setTimeout(() => autoOrderPick(match.id, match.orderTurn), 420);
    }
  }

  async function nextOrderTurn(match) {
    const [first, second] = match.players;
    const firstCount = match.order[first.id].length;
    const secondCount = match.order[second.id].length;

    if (firstCount >= match.maxTeamSize && secondCount >= match.maxTeamSize) {
      clearMatchTimer(match);
      match.arena = selectDraftArena();
      const result = await persistRankedResult(match, simulateDraftBattle(match));
      result.arena = match.arena;
      result.arenaId = match.arena.id;
      result.casual = match.mode === "casual-ai";
      match.phase = "battle-complete";
      match.result = result;
      io.to(match.id).emit("battle:start", { match: publicMatchState(match), order: match.order || {}, arena: match.arena });
      io.to(match.id).emit("battle:end", { match: publicMatchState(match), order: match.order || {}, builds: match.builds, result, arena: match.arena });
      return;
    }

    match.orderTurn = firstCount === secondCount ? first.id : second.id;
    startOrderTimer(match);
    io.to(match.id).emit("order:update", publicOrderState(match));
  }

  function pickOrderPokemon(match, playerId, pokemonId, automatic = false) {
    if (!match || match.phase !== "order" || match.orderTurn !== playerId) return false;
    const team = match.teams[playerId] || [];
    const pickedId = Number(pokemonId);
    const picked = team.find((pokemon) => pokemon.id === pickedId && !match.order[playerId].includes(pokemon.id))
      || (automatic ? team.find((pokemon) => !match.order[playerId].includes(pokemon.id)) : null);
    if (!picked || match.order[playerId].length >= match.maxTeamSize) return false;
    clearMatchTimer(match);
    match.order[playerId].push(picked.id);
    nextOrderTurn(match);
    return true;
  }

  function autoOrderPick(matchId, playerId) {
    const match = matches.get(matchId);
    pickOrderPokemon(match, playerId, 0, true);
  }

  function nextDraftTurn(match) {
    const [first, second] = match.players;
    const firstCount = match.teams[first.id].length;
    const secondCount = match.teams[second.id].length;

    if (firstCount >= match.maxTeamSize && secondCount >= match.maxTeamSize) {
      io.to(match.id).emit("draft:complete", { match: publicMatchState(match) });
      emitBuildStart(match);
      return;
    }

    if (firstCount === secondCount) {
      match.turn = first.id;
    } else {
      match.turn = second.id;
    }

    match.round = firstCount + secondCount + 1;
    emitDraftOptions(match);
  }

  function createMatch(firstSocket, secondSocket, mode = "ranked") {
    const match = {
      id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      phase: "ban",
      turn: null,
      round: 0,
      maxTeamSize: 6,
      mode,
      players: [
        { id: firstSocket.id, userId: firstSocket.data.user?.id || null, name: firstSocket.data.playerName || firstSocket.data.user?.nick || "Player A", bot: !!firstSocket.bot },
        { id: secondSocket.id, userId: secondSocket.data.user?.id || null, name: secondSocket.data.playerName || secondSocket.data.user?.nick || "Player B", bot: !!secondSocket.bot },
      ],
      teams: {
        [firstSocket.id]: [],
        [secondSocket.id]: [],
      },
      options: {},
      bans: {},
      banOptions: {},
      banRound: 1,
      banTurn: firstSocket.id,
    };

    matches.set(match.id, match);
    firstSocket.join?.(match.id);
    secondSocket.join?.(match.id);
    firstSocket.data.matchId = match.id;
    secondSocket.data.matchId = match.id;
    io.to(match.id).emit("match:found", { match: publicMatchState(match) });
    emitBanStart(match);
  }

  function createAiOpponent() {
    const id = `bot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return {
      id,
      bot: true,
      data: { playerName: "IA OakBot", matchId: "" },
      join() {},
      leave() {},
    };
  }

  function startRematch(match) {
    const firstSocket = io.sockets.sockets.get(match.players[0]?.id);
    const secondSocket = io.sockets.sockets.get(match.players[1]?.id);
    if (!firstSocket || !secondSocket) {
      io.to(match.id).emit("rematch:unavailable", { matchId: match.id });
      return;
    }
    clearMatchTimer(match);
    firstSocket.leave(match.id);
    secondSocket.leave(match.id);
    matches.delete(match.id);
    firstSocket.data.matchId = "";
    secondSocket.data.matchId = "";
    createMatch(firstSocket, secondSocket);
  }

  function removeFromQueue(socketId) {
    const index = queue.findIndex((socket) => socket.id === socketId);
    if (index >= 0) queue.splice(index, 1);
  }

  function abandonMatch(socket, reason = "left") {
    const match = matches.get(socket.data.matchId);
    if (!match) {
      socket.data.matchId = "";
      return;
    }

    match.phase = "abandoned";
    clearMatchTimer(match);
    match.players.forEach((player) => {
      const playerSocket = io.sockets.sockets.get(player.id);
      if (playerSocket) {
        playerSocket.data.matchId = "";
      }
    });
    socket.to(match.id).emit("match:abandoned", { matchId: match.id, reason });
    matches.delete(match.id);
    socket.leave(match.id);
  }

  io.on("connection", (socket) => {
    socket.emit("draft:ready", { playerId: socket.id });

    socket.on("auth:token", async (payload = {}) => {
      const token = String(payload.token || "");
      if (!token || !(await ensureDb())) {
        socket.data.user = null;
        socket.emit("auth:status", { user: null });
        return;
      }
      let user = null;
      if (hasSupabaseAuth()) {
        try {
          user = await profileForAuthUser(await supabaseAuthRequest("/auth/v1/user", { token }));
        } catch {
          user = null;
        }
      } else {
        const tokenPayload = verifyAuthToken(token);
        if (tokenPayload) {
          const { rows } = await dbPool.query(`
            select u.id, u.login, u.email, u.nick, r.points, r.wins, r.losses, r.streak
            from users u
            left join rank_profiles r on r.user_id = u.id
            where u.id = $1
          `, [tokenPayload.userId]);
          user = publicUser(rows[0]);
        }
      }
      socket.data.user = user;
      socket.data.playerName = user?.nick || socket.data.playerName;
      socket.emit("auth:status", { user });
    });

    socket.on("queue:join", async (payload = {}) => {
      socket.data.playerName = socket.data.user?.nick || String(payload.playerName || "").trim().slice(0, 18) || "Player";
      if (payload.mode !== "ai" && !socket.data.user) {
        socket.emit("queue:status", { position: 0, message: "Entre na sua conta para jogar ranqueada contra player." });
        return;
      }
      if (socket.data.matchId && !matches.has(socket.data.matchId)) socket.data.matchId = "";
      if (socket.data.matchId && matches.get(socket.data.matchId)?.phase === "battle-complete") {
        abandonMatch(socket, "new-queue");
      }
      if (socket.data.matchId || queue.some((queued) => queued.id === socket.id)) return;
      if (!draftPoolsLoaded) {
        socket.emit("queue:status", { position: 0, message: "Carregando pool nacional do Draft..." });
        await loadDraftPokemonPools();
      }
      if (payload.mode === "ai") {
        socket.emit("queue:status", { position: 0, message: "Preparando partida casual contra IA..." });
        createMatch(socket, createAiOpponent(), "casual-ai");
        return;
      }
      queue.push(socket);
      socket.emit("queue:status", { position: queue.length });
      if (queue.length >= 2) createMatch(queue.shift(), queue.shift());
    });

    socket.on("queue:leave", () => {
      removeFromQueue(socket.id);
      abandonMatch(socket, "left");
      socket.emit("queue:status", { position: 0 });
    });

    socket.on("draft:pick", (payload = {}) => {
      const match = matches.get(socket.data.matchId);
      pickDraftPokemon(match, socket.id, payload.pokemonId, false);
    });

    socket.on("ban:pick", (payload = {}) => {
      const match = matches.get(socket.data.matchId);
      pickBanPokemon(match, socket.id, payload.pokemonId, false);
    });

    socket.on("build:submit", (payload = {}) => {
      const match = matches.get(socket.data.matchId);
      if (!match || match.phase !== "build") return;
      if (match.builds[socket.id]) return;
      const options = match.buildOptions?.[socket.id] || [];
      const selections = Array.isArray(payload.selections) ? payload.selections : [];
      if (selections.length !== options.length) return;

      const normalized = options.map((entry) => {
        const selected = selections.find((selection) => Number(selection.pokemonId) === entry.pokemonId) || {};
        const moveIds = Array.isArray(selected.moveIds) ? selected.moveIds.map(String) : [];
        const relicId = String(selected.relicId || "");
        const moves = entry.moves.filter((move) => moveIds.includes(move.id)).slice(0, 2);
        const relic = entry.relics.find((candidate) => candidate.id === relicId);
        if (moves.length !== 2 || !relic) return null;
        return { pokemonId: entry.pokemonId, moves, relic };
      });

      if (normalized.some((entry) => !entry)) return;
      match.builds[socket.id] = normalized;
      io.to(match.id).emit("build:update", { match: publicMatchState(match), readyBy: socket.id });

      maybeStartOrderDraft(match);
    });

    socket.on("order:pick", (payload = {}) => {
      const match = matches.get(socket.data.matchId);
      pickOrderPokemon(match, socket.id, payload.pokemonId, false);
    });

    socket.on("rematch:request", () => {
      const match = matches.get(socket.data.matchId);
      if (!match || match.phase !== "battle-complete") {
        socket.emit("rematch:unavailable", { matchId: socket.data.matchId || "" });
        return;
      }
      if (!match.players.some((player) => player.id === socket.id)) return;
      match.rematchRequests ||= {};
      match.rematchRequests[socket.id] = true;
      const acceptedIds = Object.keys(match.rematchRequests).filter((id) => match.rematchRequests[id]);
      io.to(match.id).emit("rematch:update", {
        matchId: match.id,
        requestedBy: socket.id,
        accepted: acceptedIds,
        waitingFor: match.players.filter((player) => !match.rematchRequests[player.id]).map((player) => player.id),
      });
      if (match.players.every((player) => match.rematchRequests[player.id])) startRematch(match);
    });

    socket.on("disconnect", () => {
      removeFromQueue(socket.id);
      abandonMatch(socket, "disconnect");
    });
  });

  console.log("[draft-battle] Socket.IO ativo para fila e draft PvP.");
}

createDraftBattleServer(server);

server.listen(PORT, HOST, () => {
  console.log(`PokeDex online em http://${HOST}:${PORT}`);
});
