const fs = require("fs");

const LIMIT = 1025;
const BASE = "https://pokeapi.co/api/v2";
const OUT = "draft-pokemon-pools.json";

const SHOWDOWN_SLUG_ALIASES = {
  "wormadam-plant": "wormadam",
  "darmanitan-standard": "darmanitan",
  "jellicent-male": "jellicent",
  "pyroar-male": "pyroar",
  "meowstic-male": "meowstic",
  "meowstic-female": "meowstic",
  "aegislash-shield": "aegislash",
  "gourgeist-average": "gourgeist",
  "lycanroc-midday": "lycanroc",
  "wishiwashi-solo": "wishiwashi",
  "mimikyu-disguised": "mimikyu",
  "toxtricity-amped": "toxtricity",
  "toxtricity-low-key": "toxtricity",
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
  "ho-oh": "hooh",
  "kommo-o": "kommoo",
  "mr-rime": "mrrime",
  "tapu-koko": "tapukoko",
  "tapu-lele": "tapulele",
  "tapu-bulu": "tapubulu",
  "tapu-fini": "tapufini",
  "wo-chien": "wochien",
  "chien-pao": "chienpao",
  "ting-lu": "tinglu",
  "chi-yu": "chiyu",
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
  "deoxys-normal": "deoxys",
  "giratina-altered": "giratina",
  "shaymin-land": "shaymin",
  "tornadus-incarnate": "tornadus",
  "thundurus-incarnate": "thundurus",
  "landorus-incarnate": "landorus",
  "keldeo-ordinary": "keldeo",
  "meloetta-aria": "meloetta",
  "zygarde-50": "zygarde",
  "urshifu-single-strike": "urshifu",
  "urshifu-rapid-strike": "urshifu",
  "enamorus-incarnate": "enamorus",
  "koraidon-limited-build": "koraidon",
  "koraidon-sprinting-build": "koraidon",
  "koraidon-swimming-build": "koraidon",
  "koraidon-gliding-build": "koraidon",
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
  "oricorio-baile": "oricorio",
  "oricorio-pom-pom": "oricorio",
  "oricorio-pau": "oricorio",
  "miraidon-low-power-mode": "miraidon",
  "miraidon-drive-mode": "miraidon",
  "miraidon-aquatic-mode": "miraidon",
  "miraidon-glide-mode": "miraidon",
};

function formatName(name = "") {
  return String(name)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slug(name = "") {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function showdownSlug(name = "") {
  const base = slug(name);
  return SHOWDOWN_SLUG_ALIASES[base] || base;
}

async function get(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let index = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current], current);
    }
  }));
  return results;
}

function shouldSkipVariety(apiName = "") {
  return /(^|-)mega($|-)|(^|-)gmax($|-)|(^|-)totem($|-)|eternamax|cosplay|rock-star|belle|pop-star|phd|libre|cap$|cap-/.test(apiName);
}

function displayName(speciesName, apiName, isDefault) {
  if (isDefault) return formatName(speciesName);
  const prefix = `${speciesName}-`;
  const form = apiName.startsWith(prefix) ? apiName.slice(prefix.length) : apiName;
  return `${formatName(speciesName)} ${formatName(form)}`;
}

async function main() {
  const list = await get(`${BASE}/pokemon-species?limit=${LIMIT}`);
  const entries = list.results
    .map((entry, index) => ({
      id: Number(entry.url.match(/\/pokemon-species\/(\d+)\//)?.[1]) || index + 1,
      name: entry.name,
    }))
    .filter((entry) => entry.id > 0 && entry.id <= LIMIT);

  const speciesList = await mapLimit(entries, 16, async (entry) => {
    const species = await get(`${BASE}/pokemon-species/${entry.id}`);
    return {
      id: entry.id,
      name: species.name || entry.name,
      evolvesFromId: Number(species.evolves_from_species?.url?.match(/\/pokemon-species\/(\d+)\//)?.[1]) || 0,
      legendary: !!species.is_legendary,
      mythical: !!species.is_mythical,
      varieties: species.varieties || [],
    };
  });

  const evolvesFromIds = new Set(speciesList.map((species) => species.evolvesFromId).filter(Boolean));
  const finalSpecies = speciesList.filter((species) => !evolvesFromIds.has(species.id));
  const varieties = finalSpecies.flatMap((species) => species.varieties.map((variety) => ({
    species,
    isDefault: !!variety.is_default,
    apiName: variety.pokemon?.name || species.name,
    url: variety.pokemon?.url,
  }))).filter((entry) => entry.url && !shouldSkipVariety(entry.apiName));

  const hydrated = await mapLimit(varieties, 16, async (entry) => {
    const pokemon = await get(entry.url);
    const apiName = pokemon.name || entry.apiName;
    const name = displayName(entry.species.name, apiName, entry.isDefault);
    const artwork = pokemon.sprites?.other?.["official-artwork"];
    const home = pokemon.sprites?.other?.home;
    return {
      id: entry.species.id,
      pokemonId: pokemon.id,
      name,
      types: (pokemon.types || []).sort((a, b) => a.slot - b.slot).map((type) => formatName(type.type?.name)),
      legendary: entry.species.legendary || entry.species.mythical,
      mythical: entry.species.mythical,
      spriteSlug: showdownSlug(apiName),
      sprite: artwork?.front_default || home?.front_default || pokemon.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      shinySprite: artwork?.front_shiny || home?.front_shiny || pokemon.sprites?.front_shiny || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemon.id}.png`,
    };
  });

  const unique = [...new Map(hydrated.filter((pokemon) => pokemon.types.length).map((pokemon) => [`${pokemon.pokemonId}:${pokemon.spriteSlug}`, pokemon])).values()];
  const normal = unique.filter((pokemon) => !pokemon.legendary);
  const legendaryMythical = unique.filter((pokemon) => pokemon.legendary);
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), normal, legendaryMythical }, null, 2));
  console.log(`wrote ${normal.length} normal/forms, ${legendaryMythical.length} legendary/mythical/forms`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
