const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const POOL_PATH = path.join(ROOT, "draft-pokemon-pools.json");
const OUT_ROOT = path.join(ROOT, "assets", "draft-sprites");
const BASE = "https://play.pokemonshowdown.com/sprites";
const STATIC_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
const POKEAPI_BASE = "https://pokeapi.co/api/v2";
const SHOWDOWN_SLUG_ALIASES = {
  "wormadam-plant": "wormadam",
  "darmanitan-standard": "darmanitan",
  "jellicent-male": "jellicent",
  "pyroar-male": "pyroar",
  "meowstic-male": "meowstic",
  "meowstic-female": "meowstic",
  "aegislash-shield": "aegislash",
  "gourgeist-average": "gourgeist",
  "oricorio-baile": "oricorio",
  "oricorio-pom-pom": "oricorio",
  "oricorio-pau": "oricorio",
  "lycanroc-midday": "lycanroc",
  "wishiwashi-solo": "wishiwashi",
  "minior-red-meteor": "minior",
  "mimikyu-disguised": "mimikyu",
  "kommo-o": "kommoo",
  "toxtricity-amped": "toxtricity",
  "toxtricity-low-key": "toxtricity",
  "mr-rime": "mrrime",
  "eiscue-ice": "eiscue",
  "indeedee-male": "indeedee",
  "indeedee-female": "indeedee",
  "morpeko-full-belly": "morpeko",
  "basculegion-male": "basculegion",
  "basculegion-female": "basculegion",
  "oinkologne-male": "oinkologne",
  "oinkologne-female": "oinkologne",
  "maushold-family-of-four": "maushold",
  "maushold-family-of-three": "maushold",
  "squawkabilly-green-plumage": "squawkabilly",
  "squawkabilly-blue-plumage": "squawkabilly",
  "squawkabilly-yellow-plumage": "squawkabilly",
  "squawkabilly-white-plumage": "squawkabilly",
  "palafin-zero": "palafin",
  "tatsugiri-curly": "tatsugiri",
  "dudunsparce-two-segment": "dudunsparce",
  "dudunsparce-three-segment": "dudunsparce",
  "great-tusk": "greattusk",
  "scream-tail": "screamtail",
  "brute-bonnet": "brutebonnet",
  "flutter-mane": "fluttermane",
  "slither-wing": "slitherwing",
  "sandy-shocks": "sandyshocks",
  "iron-treads": "irontreads",
  "iron-bundle": "ironbundle",
  "iron-hands": "ironhands",
  "iron-jugulis": "ironjugulis",
  "iron-moth": "ironmoth",
  "iron-thorns": "ironthorns",
  "roaring-moon": "roaringmoon",
  "iron-valiant": "ironvaliant",
  "walking-wake": "walkingwake",
  "iron-leaves": "ironleaves",
  "gouging-fire": "gougingfire",
  "raging-bolt": "ragingbolt",
  "iron-boulder": "ironboulder",
  "iron-crown": "ironcrown",
  "ho-oh": "hooh",
  "deoxys-normal": "deoxys",
  "giratina-altered": "giratina",
  "shaymin-land": "shaymin",
  "tornadus-incarnate": "tornadus",
  "thundurus-incarnate": "thundurus",
  "landorus-incarnate": "landorus",
  "keldeo-ordinary": "keldeo",
  "meloetta-aria": "meloetta",
  "zygarde-50": "zygarde",
  "tapu-koko": "tapukoko",
  "tapu-lele": "tapulele",
  "tapu-bulu": "tapubulu",
  "tapu-fini": "tapufini",
  "urshifu-single-strike": "urshifu",
  "urshifu-rapid-strike": "urshifu",
  "enamorus-incarnate": "enamorus",
  "koraidon-limited-build": "koraidon",
  "koraidon-sprinting-build": "koraidon",
  "koraidon-swimming-build": "koraidon",
  "koraidon-gliding-build": "koraidon",
  "wo-chien": "wochien",
  "chien-pao": "chienpao",
  "ting-lu": "tinglu",
  "chi-yu": "chiyu",
  "minior-red": "minior-violet",
  "minior-orange": "minior-violet",
  "minior-yellow": "minior-violet",
  "minior-green": "minior-violet",
  "minior-blue": "minior-violet",
  "minior-indigo": "minior-violet",
  "minior-red-meteor": "minior",
  "minior-orange-meteor": "minior",
  "minior-yellow-meteor": "minior",
  "minior-green-meteor": "minior",
  "minior-blue-meteor": "minior",
  "minior-indigo-meteor": "minior",
  "minior-violet-meteor": "minior",
  "miraidon-low-power-mode": "miraidon",
  "miraidon-drive-mode": "miraidon",
  "miraidon-aquatic-mode": "miraidon",
  "miraidon-glide-mode": "miraidon",
};

function slug(name = "") {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function showdownSlug(entry) {
  const base = slug(entry.spriteSlug || entry.name);
  return SHOWDOWN_SLUG_ALIASES[base] || base;
}

function staticSpriteUrl(entry, shiny = false) {
  if (shiny && entry.shinySprite) return entry.shinySprite;
  if (!shiny && entry.sprite) return entry.sprite;
  const id = entry.pokemonId || entry.id;
  return `${STATIC_BASE}${shiny ? "/shiny" : ""}/${id}.png`;
}

function baseStaticSpriteUrl(entry, shiny = false) {
  return `${STATIC_BASE}${shiny ? "/shiny" : ""}/${entry.id}.png`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, destination) {
  return new Promise((resolve) => {
    if (fs.existsSync(destination) && fs.statSync(destination).size > 0) {
      resolve({ ok: true, cached: true });
      return;
    }
    const file = fs.createWriteStream(destination);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close(() => fs.rm(destination, { force: true }, () => resolve({ ok: false, status: response.statusCode })));
        response.resume();
        return;
      }
      response.pipe(file);
      file.on("finish", () => file.close(() => resolve({ ok: true, cached: false })));
    }).on("error", () => {
      file.close(() => fs.rm(destination, { force: true }, () => resolve({ ok: false })));
    });
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => body += chunk);
      response.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function downloadPokeApiAnimated(entry, shiny, destination) {
  if (fs.existsSync(destination) && fs.statSync(destination).size > 0) return { ok: true, cached: true };
  try {
    const data = await fetchJson(`${POKEAPI_BASE}/pokemon/${entry.id}`);
    const animated = data?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated;
    const url = shiny ? animated?.front_shiny : animated?.front_default;
    if (!url) return { ok: false };
    return download(url, destination);
  } catch {
    return { ok: false };
  }
}

async function mapLimit(items, limit, mapper) {
  let index = 0;
  const results = [];
  await Promise.all(Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current], current);
    }
  }));
  return results;
}

async function main() {
  const pool = JSON.parse(fs.readFileSync(POOL_PATH, "utf8"));
  const pokemon = [...(pool.normal || []), ...(pool.legendaryMythical || [])];
  const unique = [...new Map(pokemon.map((entry) => [`${entry.pokemonId || entry.id}:${entry.spriteSlug || entry.name}`, entry])).values()];
  ensureDir(path.join(OUT_ROOT, "ani"));
  ensureDir(path.join(OUT_ROOT, "ani-shiny"));
  ensureDir(path.join(OUT_ROOT, "static"));
  ensureDir(path.join(OUT_ROOT, "static-shiny"));

  let ok = 0;
  let failed = 0;
  await mapLimit(unique, 12, async (entry) => {
    const name = showdownSlug(entry);
    const normalPath = path.join(OUT_ROOT, "ani", `${name}.gif`);
    const shinyPath = path.join(OUT_ROOT, "ani-shiny", `${name}.gif`);
    const staticKey = entry.spriteSlug || String(entry.pokemonId || entry.id);
    const staticPath = path.join(OUT_ROOT, "static", `${staticKey}.png`);
    const staticShinyPath = path.join(OUT_ROOT, "static-shiny", `${staticKey}.png`);
    const normal = await download(`${BASE}/ani/${name}.gif`, normalPath);
    const shiny = await download(`${BASE}/ani-shiny/${name}.gif`, shinyPath);
    const normalWithFallback = normal.ok ? normal : await downloadPokeApiAnimated(entry, false, normalPath);
    const shinyWithFallback = shiny.ok ? shiny : await downloadPokeApiAnimated(entry, true, shinyPath);
    const staticNormalAttempt = await download(staticSpriteUrl(entry, false), staticPath);
    const staticShinyAttempt = await download(staticSpriteUrl(entry, true), staticShinyPath);
    const staticNormal = staticNormalAttempt.ok ? staticNormalAttempt : await download(baseStaticSpriteUrl(entry, false), staticPath);
    const staticShiny = staticShinyAttempt.ok ? staticShinyAttempt : await download(baseStaticSpriteUrl(entry, true), staticShinyPath);
    ok += Number(normalWithFallback.ok) + Number(shinyWithFallback.ok) + Number(staticNormal.ok) + Number(staticShiny.ok);
    failed += Number(!normalWithFallback.ok) + Number(!shinyWithFallback.ok) + Number(!staticNormal.ok) + Number(!staticShiny.ok);
  });

  console.log(`Sprites baixadas/cacheadas: ${ok}. Falhas: ${failed}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
