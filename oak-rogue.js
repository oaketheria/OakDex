(function () {
  "use strict";

  const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const MINI_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
  const ANIM_BASE = "https://play.pokemonshowdown.com/sprites/ani/";
  const ANIM_SHINY_BASE = "https://play.pokemonshowdown.com/sprites/ani-shiny/";
  const LOCAL_DRAFT_ANIM_BASE = "assets/draft-sprites/ani/";
  const LOCAL_DRAFT_ANIM_SHINY_BASE = "assets/draft-sprites/ani-shiny/";
  const LOCAL_DRAFT_STATIC_BASE = "assets/draft-sprites/static/";
  const LOCAL_DRAFT_STATIC_SHINY_BASE = "assets/draft-sprites/static-shiny/";
  const ITEM_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/";
  const BADGE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/";
  const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers/";
  const TRAINER_BACK_BASE = "https://play.pokemonshowdown.com/sprites/trainers-back/";
  const PLAYER_TRAINER_BACK_SPRITE = "assets/battle-animations/red-back-sheet-transparent.png";
  const API_BASE = "https://pokeapi.co/api/v2";
  const SPRITE_SLUG_ALIASES = {
    "great-tusk": "greattusk",
    "scream-tail": "screamtail",
    "brute-bonnet": "brutebonnet",
    "flutter-mane": "fluttermane",
    "slither-wing": "slitherwing",
    "sandy-shocks": "sandyshocks",
    "roaring-moon": "roaringmoon",
    "walking-wake": "walkingwake",
    "gouging-fire": "gougingfire",
    "raging-bolt": "ragingbolt",
    "iron-treads": "irontreads",
    "iron-bundle": "ironbundle",
    "iron-hands": "ironhands",
    "iron-jugulis": "ironjugulis",
    "iron-moth": "ironmoth",
    "iron-thorns": "ironthorns",
    "iron-valiant": "ironvaliant",
    "iron-leaves": "ironleaves",
    "iron-boulder": "ironboulder",
    "iron-crown": "ironcrown",
  };
  const DRAFT_STATIC_ONLY_SPRITES = new Set([
    "ironboulder",
    "ironbundle",
    "ironcrown",
    "ironhands",
    "ironjugulis",
    "ironleaves",
    "ironmoth",
    "ironthorns",
    "irontreads",
    "ironvaliant",
  ]);
  const NATIONAL_DEX_LIMIT = 1025;
  const MAX_HELD_ITEMS = 2;
  const BATTLE_SENDOUT_DURATION = 2360;
  const BATTLE_AUTO_3X_AFTER_MS = 15000;
  const TOWER_BAG_POSITION_KEY = "oak_rogue_tower_bag_position_v2";
  const REAL_MOVE_ANIMS = {
    "air-slash": { image: "air-cutter-trim.png", audio: "air-cutter.ogg", frames: 5, w: 80, h: 80, scale: 1.45 },
    "aqua-tail": { image: "clamp-trim.png", audio: "clamp.ogg", frames: 3, w: 52, h: 140, scale: 1.06, variant: "sweep" },
    "aura-sphere": { image: "bulk-up-trim.png", audio: "bulk-up.ogg", frames: 4, w: 48, h: 48, scale: 2.0 },
    bite: { image: "bite-trim.png", audio: "bite.ogg", frames: 3, w: 140, h: 80, scale: 1.25 },
    "body-slam": { image: "stomp-trim.png", audio: "stomp.ogg", frames: 2, w: 80, h: 80, scale: 1.45 },
    bubble: { image: "lovely-kiss-trim.png", audio: "lovely-kiss.ogg", frames: 2, w: 76, h: 60, scale: 1.65 },
    "bullet-punch": { image: "comet-punch-trim.png", audio: "comet-punch.ogg", frames: 2, w: 64, h: 64, scale: 1.65 },
    burn: { image: "barrier-trim.png", audio: "barrier.ogg", frames: 10, w: 100, h: 144, scale: 0.98 },
    burst: { image: "protect-trim.png", audio: "protect.ogg", frames: 10, w: 142, h: 136, scale: 1.05 },
    confusion: { image: "calm-mind-trim.png", audio: "calm-mind.ogg", frames: 1, w: 132, h: 132, scale: 1.05, variant: "pulse" },
    "dazzling-gleam": { image: "magic-coat-trim.png", audio: "magic-coat.ogg", frames: 10, w: 100, h: 144, scale: 1.08, variant: "flare" },
    "disarming-voice": { image: "growl-trim.png", audio: "supersonic.ogg", frames: 4, w: 76, h: 60, scale: 1.6 },
    "double-spark": { image: "thunder-punch-trim.png", audio: "thunder-punch.ogg", frames: 10, w: 80, h: 80, scale: 1.55 },
    "dragon-pulse": { image: "mind-reader-trim.png", audio: "mind-reader.ogg", frames: 5, w: 140, h: 140, scale: 1.02 },
    "draining-kiss": { image: "sweet-kiss-trim.png", audio: "sweet-kiss.ogg", frames: 2, w: 78, h: 66, scale: 1.85, variant: "float" },
    "earth-power": { image: "bone-rush-trim.png", audio: "bone-rush.ogg", frames: 2, w: 76, h: 56, scale: 1.75 },
    ember: { image: "ember-trim.png", audio: "ember.ogg", frames: 5, w: 64, h: 64, scale: 1.85 },
    "fire-fang": { image: "crush-claw-trim.png", audio: "crush-claw.ogg", frames: 5, w: 74, h: 74, scale: 1.55 },
    flail: { image: "flail-trim.png", audio: "flail.ogg", frames: 2, w: 80, h: 80, scale: 1.6 },
    flamethrower: { image: "magic-coat-trim.png", audio: "magic-coat.ogg", frames: 10, w: 100, h: 144, scale: 1.0 },
    "flame-wheel": { image: "bounce-trim.png", audio: "bounce.ogg", frames: 2, w: 100, h: 132, scale: 1.05, variant: "flare" },
    focus: { image: "focus-energy-trim.png", audio: "focus-energy.ogg", frames: 4, w: 38, h: 80, scale: 1.75 },
    foresight: { image: "foresight-trim.png", audio: "foresight.ogg", frames: 10, w: 60, h: 60, scale: 1.5 },
    "fairy-wind": { image: "gust-trim.png", audio: "gust.ogg", frames: 10, w: 80, h: 142, scale: 1.08, variant: "float" },
    "fury-cutter": { image: "fury-swipes-trim.png", audio: "fury-swipes.ogg", frames: 4, w: 78, h: 78, scale: 1.4 },
    "guard-break": { image: "rock-smash-trim.png", audio: "rock-smash.ogg", frames: 3, w: 80, h: 80, scale: 1.45 },
    gust: { image: "gust-trim.png", audio: "gust.ogg", frames: 10, w: 80, h: 142, scale: 1.0, variant: "sweep" },
    "acid-spray": { image: "toxic-trim.png", audio: "toxic.ogg", frames: 5, w: 48, h: 68, scale: 1.7, variant: "spray" },
    "ancient-power": { image: "defense-curl-trim.png", audio: "defense-curl.ogg", frames: 7, w: 32, h: 72, scale: 1.7 },
    blizzard: { image: "gust-trim.png", audio: "gust.ogg", frames: 10, w: 80, h: 142, scale: 1.22, variant: "storm" },
    "bug-bite": { image: "vise-grip-trim.png", audio: "vise-grip.ogg", frames: 4, w: 68, h: 68, scale: 1.55, variant: "snap" },
    "charge-beam": { image: "lock-on-trim.png", audio: "lock-on.ogg", frames: 10, w: 60, h: 60, scale: 1.5 },
    charm: { image: "charm-trim.png", audio: "charm.ogg", frames: 2, w: 76, h: 76, scale: 1.7 },
    crunch: { image: "bite-trim.png", audio: "bite.ogg", frames: 3, w: 140, h: 80, scale: 1.35, variant: "snap" },
    "dark-pulse": { image: "mean-look-trim.png", audio: "night-shade.ogg", frames: 1, w: 92, h: 84, scale: 1.65, variant: "pulse" },
    detect: { image: "detect-trim.png", audio: "detect.ogg", frames: 4, w: 80, h: 80, scale: 1.45 },
    "double-kick": { image: "double-kick-trim.png", audio: "double-kick.ogg", frames: 2, w: 80, h: 80, scale: 1.55 },
    "double-slap": { image: "double-slap-trim.png", audio: "double-slap.ogg", frames: 2, w: 80, h: 80, scale: 1.55 },
    "dragon-claw": { image: "scratch-trim.png", audio: "scratch.ogg", frames: 5, w: 74, h: 76, scale: 1.55 },
    "dragon-tail": { image: "vise-grip-trim.png", audio: "vise-grip.ogg", frames: 4, w: 68, h: 68, scale: 1.4, variant: "sweep" },
    endure: { image: "endure-trim.png", audio: "endure.ogg", frames: 10, w: 100, h: 144, scale: 1.02 },
    "false-swipe": { image: "false-swipe-trim.png", audio: "false-swipe.ogg", frames: 5, w: 76, h: 76, scale: 1.45 },
    "ice-beam": { image: "light-screen-trim.png", audio: "light-screen.ogg", frames: 15, w: 100, h: 144, scale: 1.0 },
    "ice-fang": { image: "clamp-trim.png", audio: "clamp.ogg", frames: 3, w: 52, h: 140, scale: 1.12, variant: "snap" },
    "ice-shard": { image: "sharpen-trim.png", audio: "sharpen.ogg", frames: 5, w: 80, h: 72, scale: 1.45, variant: "sweep" },
    "icicle-spear": { image: "sharpen-trim.png", audio: "sharpen.ogg", frames: 5, w: 80, h: 72, scale: 1.65, variant: "lunge" },
    "powder-snow": { image: "sleep-powder-trim.png", audio: "sleep-powder.ogg", frames: 10, w: 30, h: 48, scale: 2.15, variant: "float" },
    "icy-wind": { image: "gust-trim.png", audio: "gust.ogg", frames: 10, w: 80, h: 142, scale: 1.12, variant: "drift" },
    "karate-chop": { image: "karate-chop-trim.png", audio: "karate-chop.ogg", frames: 2, w: 80, h: 80, scale: 1.45 },
    "flash-cannon": { image: "mirror-coat-trim.png", audio: "mirror-coat.ogg", frames: 15, w: 100, h: 144, scale: 1.0, variant: "beam" },
    "headbutt": { image: "headbutt-trim.png", audio: "headbutt.ogg", frames: 1, w: 80, h: 80, scale: 1.55 },
    "hex": { image: "spore-trim.png", audio: "night-shade.ogg", frames: 1, w: 40, h: 40, scale: 2.4 },
    "iron-head": { image: "block-trim.png", audio: "block.ogg", frames: 1, w: 140, h: 140, scale: 1.0 },
    "low-kick": { image: "low-kick-trim.png", audio: "low-kick.ogg", frames: 2, w: 80, h: 80, scale: 1.5 },
    leech: { image: "needle-arm-trim.png", audio: "needle-arm.ogg", frames: 3, w: 80, h: 80, scale: 1.45 },
    leer: { image: "leer-trim.png", audio: "leer.ogg", frames: 4, w: 76, h: 60, scale: 1.55 },
    lick: { image: "lick-trim.png", audio: "lick.ogg", frames: 5, w: 48, h: 80, scale: 1.75 },
    "mega-drain": { image: "milk-drink-trim.png", audio: "milk-drink.ogg", frames: 2, w: 132, h: 132, scale: 1.05 },
    "magnitude": { image: "belly-drum-trim.png", audio: "belly-drum.ogg", frames: 10, w: 76, h: 74, scale: 1.18 },
    moonblast: { image: "sweet-kiss-trim.png", audio: "sweet-kiss.ogg", frames: 2, w: 78, h: 66, scale: 1.7, variant: "pulse" },
    "mud-slap": { image: "dig-trim.png", audio: "dig.ogg", frames: 3, w: 144, h: 64, scale: 1.12 },
    "metal-claw": { image: "metal-claw-trim.png", audio: "metal-claw.ogg", frames: 5, w: 74, h: 74, scale: 1.55 },
    metronome: { image: "metronome-trim.png", audio: "metronome.ogg", frames: 10, w: 78, h: 78, scale: 1.35 },
    "night-shade": { image: "mean-look-trim.png", audio: "night-shade.ogg", frames: 1, w: 92, h: 84, scale: 1.5, variant: "fade" },
    "night-slash": { image: "slash-trim.png", audio: "slash.ogg", frames: 4, w: 80, h: 80, scale: 1.45 },
    "ominous-wind": { image: "cotton-spore-trim.png", audio: "cotton-spore.ogg", frames: 1, w: 40, h: 40, scale: 2.35 },
    "peck": { image: "peck-trim.png", audio: "peck.ogg", frames: 1, w: 52, h: 52, scale: 1.85 },
    "petal-storm": { image: "sleep-powder-trim.png", audio: "sleep-powder.ogg", frames: 10, w: 30, h: 48, scale: 2.3, variant: "storm" },
    "pound": { image: "pound-trim.png", audio: "pound.ogg", frames: 1, w: 80, h: 80, scale: 1.55 },
    "play-rough": { image: "crush-claw-trim.png", audio: "crush-claw.ogg", frames: 5, w: 74, h: 74, scale: 1.62, variant: "bounce" },
    "poison-sting": { image: "poison-powder-trim.png", audio: "poison-powder.ogg", frames: 10, w: 30, h: 48, scale: 2.2 },
    psybeam: { image: "supersonic-trim.png", audio: "supersonic.ogg", frames: 1, w: 48, h: 80, scale: 1.8 },
    psyshock: { image: "mirror-coat-trim.png", audio: "mirror-coat.ogg", frames: 15, w: 100, h: 144, scale: 1.0, variant: "pulse" },
    pulse: { image: "conversion-trim.png", audio: "conversion.ogg", frames: 5, w: 48, h: 48, scale: 2.0 },
    quick: { image: "assist-trim.png", audio: "assist.ogg", frames: 1, w: 66, h: 66, scale: 1.7 },
    "rock-throw": { image: "rock-throw-trim.png", audio: "rock-throw.ogg", frames: 2, w: 44, h: 46, scale: 2.15 },
    "rock-smash": { image: "rock-smash-trim.png", audio: "rock-smash.ogg", frames: 3, w: 80, h: 80, scale: 1.5, variant: "drop" },
    "seed-bomb": { image: "recycle-trim.png", audio: "recycle.ogg", frames: 1, w: 112, h: 108, scale: 1.15 },
    "silver-wind": { image: "safeguard-trim.png", audio: "safeguard.ogg", frames: 1, w: 140, h: 40, scale: 1.65 },
    "snarl": { image: "roar-trim.png", audio: "roar.ogg", frames: 4, w: 76, h: 60, scale: 1.55 },
    "stomping-tantrum": { image: "stomp-trim.png", audio: "stomp.ogg", frames: 2, w: 80, h: 80, scale: 1.6, variant: "quake" },
    shadow: { image: "mean-look-trim.png", audio: "mean-look.ogg", frames: 1, w: 92, h: 84, scale: 1.45, variant: "lunge" },
    "shadow-ball": { image: "shadow-ball-trim.png", audio: "shadow-ball.ogg", frames: 1, w: 80, h: 80, scale: 1.42 },
    sludge: { image: "toxic-trim.png", audio: "toxic.ogg", frames: 5, w: 48, h: 68, scale: 1.85 },
    "smelling-salts": { image: "smelling-salts-trim.png", audio: "smelling-salts.ogg", frames: 2, w: 80, h: 80, scale: 1.55 },
    spark: { image: "thunder-wave-trim.png", audio: "thunder-wave.ogg", frames: 4, w: 144, h: 48, scale: 1.15 },
    "stone-edge": { image: "bone-club-trim.png", audio: "bone-club.ogg", frames: 2, w: 80, h: 80, scale: 1.55 },
    "stored-power": { image: "calm-mind-trim.png", audio: "calm-mind.ogg", frames: 1, w: 132, h: 132, scale: 1.2 },
    struggle: { image: "struggle-trim.png", audio: "struggle.ogg", frames: 3, w: 80, h: 80, scale: 1.5 },
    surf: { image: "reflect-trim.png", audio: "reflect.ogg", frames: 15, w: 100, h: 144, scale: 1.0 },
    tackle: { image: "tackle-trim.png", audio: "tackle.ogg", frames: 1, w: 80, h: 80, scale: 1.45 },
    thundershock: { image: "thunder-shock-trim.png", audio: "thunder-shock.ogg", frames: 10, w: 42, h: 48, scale: 2.35 },
    twister: { image: "constrict-trim.png", audio: "constrict.ogg", frames: 4, w: 138, h: 80, scale: 1.02 },
    venoshock: { image: "stun-spore-trim.png", audio: "stun-spore.ogg", frames: 10, w: 30, h: 48, scale: 2.25 },
    "vine-whip": { image: "vine-whip-trim.png", audio: "vine-whip.ogg", frames: 4, w: 74, h: 70, scale: 1.55 },
    "volt-switch": { image: "baton-pass-trim.png", audio: "baton-pass.ogg", frames: 1, w: 48, h: 48, scale: 2.0 },
    "wing-attack": { image: "bounce-trim.png", audio: "bounce.ogg", frames: 2, w: 100, h: 132, scale: 1.0, variant: "sweep" },
    "water-pulse": { image: "health-up-trim.png", audio: "health-up.ogg", frames: 10, w: 76, h: 76, scale: 1.45 },
    wave: { image: "soft-boiled-trim.png", audio: "soft-boiled.ogg", frames: 4, w: 132, h: 132, scale: 1.02 },
    "x-scissor": { image: "cut-trim.png", audio: "cut.ogg", frames: 4, w: 80, h: 80, scale: 1.45 }
  };

  const TYPE_COLOR = {
    Grass: "#7ee081", Fire: "#ff8a5c", Water: "#6bb7ff", Electric: "#ffe16b",
    Psychic: "#ff7dc8", Rock: "#c7ad73", Ground: "#d39d66", Flying: "#9bbcff",
    Poison: "#c77dff", Bug: "#b6d957", Ghost: "#9a84ff", Dragon: "#8fa1ff",
    Steel: "#9bc4cf", Ice: "#8eeaff", Fighting: "#ff766d", Dark: "#8b9298",
    Normal: "#d8d0c0", Fairy: "#ff9cda"
  };

  const STARTERS = [
    { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], hp: 48, atk: 49, def: 49, spd: 45, trait: "Controle", text: "Cura gradual e veneno. Otimo para runs longas." },
    { id: 4, name: "Charmander", types: ["Fire"], hp: 43, atk: 57, def: 40, spd: 65, trait: "Pressão", text: "Alto dano, pouca margem de erro. Vence rápido ou sofre." },
    { id: 7, name: "Squirtle", types: ["Water"], hp: 52, atk: 48, def: 65, spd: 43, trait: "Guarda", text: "Tanque sólido, combina com relíquias defensivas." },
    { id: 152, name: "Chikorita", types: ["Grass"], hp: 45, atk: 49, def: 65, spd: 45, trait: "Folha", text: "Defensivo e estável. Segura pressão enquanto o time cresce." },
    { id: 155, name: "Cyndaquil", types: ["Fire"], hp: 39, atk: 60, def: 43, spd: 65, trait: "Brasa", text: "Rápido e agressivo. Bom para abrir vantagem cedo." },
    { id: 158, name: "Totodile", types: ["Water"], hp: 50, atk: 65, def: 64, spd: 43, trait: "Mordida", text: "Ataque físico alto e boa resistência para trocas." },
    { id: 252, name: "Treecko", types: ["Grass"], hp: 40, atk: 65, def: 35, spd: 70, trait: "Agilidade", text: "Velocidade alta para vencer antes de apanhar." },
    { id: 255, name: "Torchic", types: ["Fire"], hp: 45, atk: 70, def: 40, spd: 45, trait: "Chama", text: "Ataque forte e evolução com ótimo potencial ofensivo." },
    { id: 258, name: "Mudkip", types: ["Water"], hp: 50, atk: 70, def: 50, spd: 40, trait: "Lama", text: "Muito consistente. Poucas fraquezas depois de evoluir." },
    { id: 387, name: "Turtwig", types: ["Grass"], hp: 55, atk: 68, def: 64, spd: 31, trait: "Raiz", text: "Lento, resistente e ótimo com relíquias defensivas." },
    { id: 390, name: "Chimchar", types: ["Fire"], hp: 44, atk: 58, def: 44, spd: 61, trait: "Ímpeto", text: "Ofensivo e flexível. Cresce rápido em lutas curtas." },
    { id: 393, name: "Piplup", types: ["Water"], hp: 53, atk: 61, def: 53, spd: 40, trait: "Orgulho", text: "Bom equilíbrio e defesa especial natural." },
    { id: 495, name: "Snivy", types: ["Grass"], hp: 45, atk: 45, def: 55, spd: 63, trait: "Elegância", text: "Rápido e seguro, com boa defesa para reposicionar." },
    { id: 498, name: "Tepig", types: ["Fire"], hp: 65, atk: 63, def: 45, spd: 45, trait: "Carga", text: "HP alto e dano constante para rotas perigosas." },
    { id: 501, name: "Oshawott", types: ["Water"], hp: 55, atk: 55, def: 45, spd: 45, trait: "Concha", text: "Versátil, aprende bem e encaixa em muitos times." },
    { id: 650, name: "Chespin", types: ["Grass"], hp: 56, atk: 61, def: 65, spd: 38, trait: "Casca", text: "Tanque físico inicial para runs de atrito." },
    { id: 653, name: "Fennekin", types: ["Fire"], hp: 40, atk: 62, def: 40, spd: 60, trait: "Mente", text: "Atacante especial veloz com boa cobertura futura." },
    { id: 656, name: "Froakie", types: ["Water"], hp: 41, atk: 60, def: 40, spd: 71, trait: "Ninja", text: "Muito rápido. Excelente para finalizar inimigos frágeis." },
    { id: 722, name: "Rowlet", types: ["Grass", "Flying"], hp: 68, atk: 55, def: 55, spd: 42, trait: "Pluma", text: "HP alto e tipo extra para cobertura desde o começo." },
    { id: 725, name: "Litten", types: ["Fire"], hp: 45, atk: 65, def: 40, spd: 70, trait: "Garra", text: "Dano físico rápido e bom ritmo para batalhas selvagens." },
    { id: 728, name: "Popplio", types: ["Water"], hp: 50, atk: 65, def: 54, spd: 40, trait: "Canção", text: "Ofensivo especial com boa sustentação inicial." },
    { id: 810, name: "Grookey", types: ["Grass"], hp: 50, atk: 65, def: 50, spd: 65, trait: "Ritmo", text: "Atacante físico equilibrado e fácil de encaixar." },
    { id: 813, name: "Scorbunny", types: ["Fire"], hp: 50, atk: 71, def: 40, spd: 69, trait: "Arranque", text: "Muito veloz, pressiona cedo e escala bem com dano." },
    { id: 816, name: "Sobble", types: ["Water"], hp: 50, atk: 60, def: 40, spd: 70, trait: "Disparo", text: "Rápido e ofensivo, ótimo para vencer por velocidade." },
    { id: 906, name: "Sprigatito", types: ["Grass"], hp: 40, atk: 61, def: 54, spd: 65, trait: "Flor", text: "Ágil e preciso, bom para abrir lutas com vantagem." },
    { id: 909, name: "Fuecoco", types: ["Fire"], hp: 67, atk: 45, def: 59, spd: 36, trait: "Fornalha", text: "Resistente e forte em rotas longas." },
    { id: 912, name: "Quaxly", types: ["Water"], hp: 55, atk: 65, def: 45, spd: 50, trait: "Passo", text: "Ataque confiável e bom equilíbrio para montar cobertura." }
  ];

  const POOL = [
    { id: 25, name: "Pikachu", types: ["Electric"], hp: 42, atk: 64, def: 36, spd: 90, trait: "Voltagem" },
    { id: 39, name: "Jigglypuff", types: ["Normal", "Fairy"], hp: 86, atk: 45, def: 28, spd: 24, trait: "Encore" },
    { id: 58, name: "Growlithe", types: ["Fire"], hp: 55, atk: 70, def: 45, spd: 60, trait: "Brasa" },
    { id: 63, name: "Abra", types: ["Psychic"], hp: 34, atk: 88, def: 28, spd: 90, trait: "Foco" },
    { id: 66, name: "Machop", types: ["Fighting"], hp: 68, atk: 80, def: 50, spd: 35, trait: "Punho" },
    { id: 74, name: "Geodude", types: ["Rock", "Ground"], hp: 50, atk: 70, def: 95, spd: 20, trait: "Casca" },
    { id: 92, name: "Gastly", types: ["Ghost", "Poison"], hp: 38, atk: 83, def: 32, spd: 80, trait: "Assombro" },
    { id: 123, name: "Scyther", types: ["Bug", "Flying"], hp: 62, atk: 92, def: 58, spd: 105, trait: "Corte" },
    { id: 131, name: "Lapras", types: ["Water", "Ice"], hp: 96, atk: 72, def: 70, spd: 52, trait: "Mare" },
    { id: 133, name: "Eevee", types: ["Normal"], hp: 58, atk: 58, def: 50, spd: 55, trait: "Adaptar" },
    { id: 147, name: "Dratini", types: ["Dragon"], hp: 50, atk: 70, def: 45, spd: 50, trait: "Escalar" },
    { id: 215, name: "Sneasel", types: ["Dark", "Ice"], hp: 52, atk: 82, def: 45, spd: 105, trait: "Emboscada" }
  ];

  const LEGENDARY_POOL = [
    { id: 144, name: "Articuno", types: ["Ice", "Flying"], hp: 90, atk: 95, def: 105, spd: 85, trait: "Nevasca" },
    { id: 145, name: "Zapdos", types: ["Electric", "Flying"], hp: 90, atk: 125, def: 90, spd: 100, trait: "Trovao" },
    { id: 146, name: "Moltres", types: ["Fire", "Flying"], hp: 90, atk: 125, def: 90, spd: 90, trait: "Chama Solar" },
    { id: 150, name: "Mewtwo", types: ["Psychic"], hp: 106, atk: 154, def: 90, spd: 130, trait: "Genetica" },
    { id: 243, name: "Raikou", types: ["Electric"], hp: 90, atk: 115, def: 85, spd: 115, trait: "Relampago" },
    { id: 244, name: "Entei", types: ["Fire"], hp: 115, atk: 115, def: 85, spd: 100, trait: "Vulcao" },
    { id: 245, name: "Suicune", types: ["Water"], hp: 100, atk: 90, def: 115, spd: 85, trait: "Aurora" },
    { id: 249, name: "Lugia", types: ["Psychic", "Flying"], hp: 106, atk: 100, def: 130, spd: 110, trait: "Guardiao" },
    { id: 250, name: "Ho-Oh", types: ["Fire", "Flying"], hp: 106, atk: 130, def: 110, spd: 90, trait: "Arco-iris" },
    { id: 384, name: "Rayquaza", types: ["Dragon", "Flying"], hp: 105, atk: 150, def: 90, spd: 95, trait: "Ceu Delta" }
  ];

  const GYM_POOLS = {
    rock: [
      { id: 27, name: "Sandshrew", types: ["Ground"], hp: 55, atk: 75, def: 85, spd: 40, trait: "Areia" },
      { id: 50, name: "Diglett", types: ["Ground"], hp: 28, atk: 65, def: 30, spd: 95, trait: "Tunel" },
      { id: 74, name: "Geodude", types: ["Rock", "Ground"], hp: 50, atk: 70, def: 95, spd: 20, trait: "Casca" },
      { id: 95, name: "Onix", types: ["Rock", "Ground"], hp: 58, atk: 62, def: 120, spd: 70, trait: "Muralha" },
      { id: 111, name: "Rhyhorn", types: ["Ground", "Rock"], hp: 80, atk: 85, def: 95, spd: 25, trait: "Chifre" }
    ],
    water: [
      { id: 54, name: "Psyduck", types: ["Water"], hp: 58, atk: 56, def: 48, spd: 55, trait: "Enxaqueca" },
      { id: 60, name: "Poliwag", types: ["Water"], hp: 45, atk: 55, def: 45, spd: 90, trait: "Bolhas" },
      { id: 90, name: "Shellder", types: ["Water"], hp: 40, atk: 65, def: 100, spd: 40, trait: "Concha" },
      { id: 98, name: "Krabby", types: ["Water"], hp: 45, atk: 105, def: 90, spd: 50, trait: "Pinça" },
      { id: 120, name: "Staryu", types: ["Water"], hp: 42, atk: 70, def: 58, spd: 85, trait: "Estrela" }
    ],
    electric: [
      { id: 25, name: "Pikachu", types: ["Electric"], hp: 42, atk: 64, def: 36, spd: 90, trait: "Voltagem" },
      { id: 81, name: "Magnemite", types: ["Electric", "Steel"], hp: 35, atk: 75, def: 70, spd: 45, trait: "Ima" },
      { id: 100, name: "Voltorb", types: ["Electric"], hp: 45, atk: 70, def: 55, spd: 100, trait: "Estouro" },
      { id: 125, name: "Electabuzz", types: ["Electric"], hp: 65, atk: 83, def: 57, spd: 105, trait: "Descarga" }
    ],
    grass: [
      { id: 43, name: "Oddish", types: ["Grass", "Poison"], hp: 48, atk: 65, def: 55, spd: 30, trait: "Po" },
      { id: 69, name: "Bellsprout", types: ["Grass", "Poison"], hp: 50, atk: 75, def: 35, spd: 40, trait: "Cipo" },
      { id: 102, name: "Exeggcute", types: ["Grass", "Psychic"], hp: 60, atk: 70, def: 80, spd: 40, trait: "Casca" },
      { id: 114, name: "Tangela", types: ["Grass"], hp: 65, atk: 80, def: 95, spd: 60, trait: "Raizes" }
    ],
    poison: [
      { id: 23, name: "Ekans", types: ["Poison"], hp: 42, atk: 72, def: 44, spd: 55, trait: "Constricao" },
      { id: 41, name: "Zubat", types: ["Poison", "Flying"], hp: 40, atk: 55, def: 35, spd: 75, trait: "Morcego" },
      { id: 88, name: "Grimer", types: ["Poison"], hp: 80, atk: 80, def: 50, spd: 25, trait: "Lodo" },
      { id: 109, name: "Koffing", types: ["Poison"], hp: 52, atk: 70, def: 95, spd: 35, trait: "Gas" }
    ],
    psychic: [
      { id: 63, name: "Abra", types: ["Psychic"], hp: 34, atk: 88, def: 28, spd: 90, trait: "Foco" },
      { id: 96, name: "Drowzee", types: ["Psychic"], hp: 70, atk: 62, def: 55, spd: 42, trait: "Hipnose" },
      { id: 122, name: "Mr. Mime", types: ["Psychic", "Fairy"], hp: 55, atk: 85, def: 65, spd: 90, trait: "Barreira" },
      { id: 102, name: "Exeggcute", types: ["Grass", "Psychic"], hp: 60, atk: 70, def: 80, spd: 40, trait: "Oraculo" }
    ],
    fire: [
      { id: 37, name: "Vulpix", types: ["Fire"], hp: 42, atk: 65, def: 45, spd: 65, trait: "Raposa" },
      { id: 58, name: "Growlithe", types: ["Fire"], hp: 55, atk: 70, def: 45, spd: 60, trait: "Brasa" },
      { id: 77, name: "Ponyta", types: ["Fire"], hp: 50, atk: 85, def: 55, spd: 90, trait: "Galope" },
      { id: 126, name: "Magmar", types: ["Fire"], hp: 65, atk: 95, def: 57, spd: 93, trait: "Magma" }
    ],
    ground: [
      { id: 27, name: "Sandshrew", types: ["Ground"], hp: 55, atk: 75, def: 85, spd: 40, trait: "Areia" },
      { id: 50, name: "Diglett", types: ["Ground"], hp: 28, atk: 65, def: 30, spd: 95, trait: "Tunel" },
      { id: 104, name: "Cubone", types: ["Ground"], hp: 50, atk: 65, def: 95, spd: 35, trait: "Osso" },
      { id: 111, name: "Rhyhorn", types: ["Ground", "Rock"], hp: 80, atk: 85, def: 95, spd: 25, trait: "Chifre" },
      { id: 31, name: "Nidoqueen", types: ["Poison", "Ground"], hp: 90, atk: 82, def: 87, spd: 76, trait: "Rainha" }
    ]
  };

  const GYM_NPCS = {
    rock: [
      { name: "Hiker", trainer: "hiker", team: ["Geodude", "Sandshrew"] },
      { name: "Camper", trainer: "camper", team: ["Diglett", "Rhyhorn"] }
    ],
    water: [
      { name: "Fisher", trainer: "fisherman", team: ["Poliwag", "Krabby"] },
      { name: "Swimmer", trainer: "swimmerm", team: ["Shellder", "Staryu"] }
    ],
    electric: [
      { name: "Engineer", trainer: "engineer", team: ["Magnemite", "Voltorb"] },
      { name: "Rocker", trainer: "guitarist", team: ["Pikachu", "Electabuzz"] }
    ],
    grass: [
      { name: "Lass", trainer: "lass", team: ["Oddish", "Bellsprout"] },
      { name: "Beauty", trainer: "beauty", team: ["Tangela", "Exeggcute"] }
    ],
    poison: [
      { name: "Ninja", trainer: "ninja", team: ["Zubat", "Koffing"] },
      { name: "Rocket", trainer: "rocketgrunt", team: ["Ekans", "Grimer"] }
    ],
    psychic: [
      { name: "Psychic", trainer: "psychic", team: ["Abra", "Drowzee"] },
      { name: "Channeler", trainer: "channeler", team: ["Mr. Mime", "Exeggcute"] }
    ],
    fire: [
      { name: "Burglar", trainer: "burglar", team: ["Vulpix", "Growlithe"] },
      { name: "Firebreather", trainer: "firebreather", team: ["Ponyta", "Magmar"] }
    ],
    ground: [
      { name: "Tamer", trainer: "tamer", team: ["Cubone", "Rhyhorn"] },
      { name: "Ace Trainer", trainer: "acetrainer", team: ["Sandshrew", "Nidoqueen"] }
    ]
  };

  const BOSSES = [
    {
      leader: "Brock", trainer: "brock", badge: 1, arena: "Pedra",
      team: [
        { id: 74, name: "Geodude", types: ["Rock", "Ground"], hp: 72, atk: 78, def: 112, spd: 22, trait: "Pedregulho" },
        { id: 95, name: "Onix Alfa", types: ["Rock", "Ground"], hp: 120, atk: 64, def: 120, spd: 38, trait: "Muralha" }
      ]
    },
    {
      leader: "Misty", trainer: "misty", badge: 2, arena: "Cascata",
      team: [
        { id: 120, name: "Staryu", types: ["Water"], hp: 82, atk: 72, def: 58, spd: 92, trait: "Corrente" },
        { id: 121, name: "Starmie Prisma", types: ["Water", "Psychic"], hp: 115, atk: 88, def: 76, spd: 118, trait: "Refração" }
      ]
    },
    {
      leader: "Lt. Surge", trainer: "ltsurge", badge: 3, arena: "Trovão",
      team: [
        { id: 100, name: "Voltorb", types: ["Electric"], hp: 88, atk: 78, def: 64, spd: 116, trait: "Estouro" },
        { id: 25, name: "Pikachu Tenente", types: ["Electric"], hp: 92, atk: 92, def: 52, spd: 124, trait: "Carga" },
        { id: 26, name: "Raichu Condutor", types: ["Electric"], hp: 120, atk: 96, def: 62, spd: 120, trait: "Sobrecarga" }
      ]
    },
    {
      leader: "Erika", trainer: "erika", badge: 4, arena: "Arco-iris",
      team: [
        { id: 70, name: "Weepinbell", types: ["Grass", "Poison"], hp: 110, atk: 94, def: 62, spd: 64, trait: "Cipo" },
        { id: 114, name: "Tangela", types: ["Grass"], hp: 122, atk: 88, def: 98, spd: 68, trait: "Raizes" },
        { id: 45, name: "Vileplume Jardim", types: ["Grass", "Poison"], hp: 140, atk: 92, def: 86, spd: 58, trait: "Esporos" }
      ]
    },
    {
      leader: "Koga", trainer: "koga", badge: 5, arena: "Alma",
      team: [
        { id: 109, name: "Koffing", types: ["Poison"], hp: 118, atk: 86, def: 102, spd: 58, trait: "Gas" },
        { id: 89, name: "Muk", types: ["Poison"], hp: 152, atk: 104, def: 92, spd: 54, trait: "Lodo" },
        { id: 110, name: "Weezing Toxico", types: ["Poison"], hp: 142, atk: 98, def: 112, spd: 66, trait: "Névoa" }
      ]
    },
    {
      leader: "Sabrina", trainer: "sabrina", badge: 6, arena: "Pântano",
      team: [
        { id: 64, name: "Kadabra", types: ["Psychic"], hp: 100, atk: 112, def: 54, spd: 118, trait: "Dobra" },
        { id: 122, name: "Mr. Mime", types: ["Psychic", "Fairy"], hp: 118, atk: 102, def: 74, spd: 102, trait: "Barreira" },
        { id: 65, name: "Alakazam Prisma", types: ["Psychic"], hp: 132, atk: 126, def: 64, spd: 128, trait: "Predicao" }
      ]
    },
    {
      leader: "Blaine", trainer: "blaine", badge: 7, arena: "Vulcao",
      team: [
        { id: 58, name: "Growlithe", types: ["Fire"], hp: 118, atk: 102, def: 68, spd: 94, trait: "Brasa" },
        { id: 78, name: "Rapidash", types: ["Fire"], hp: 136, atk: 116, def: 78, spd: 126, trait: "Galope" },
        { id: 59, name: "Arcanine Vulcao", types: ["Fire"], hp: 162, atk: 124, def: 82, spd: 105, trait: "Combustao" }
      ]
    },
    {
      leader: "Giovanni", trainer: "giovanni", badge: 8, arena: "Terra",
      team: [
        { id: 51, name: "Dugtrio", types: ["Ground"], hp: 126, atk: 118, def: 68, spd: 134, trait: "Tunel" },
        { id: 31, name: "Nidoqueen", types: ["Poison", "Ground"], hp: 168, atk: 118, def: 104, spd: 86, trait: "Rainha" },
        { id: 34, name: "Nidoking", types: ["Poison", "Ground"], hp: 166, atk: 126, def: 96, spd: 94, trait: "Rei" },
        { id: 112, name: "Rhydon Sismico", types: ["Ground", "Rock"], hp: 190, atk: 138, def: 118, spd: 58, trait: "Terremoto" }
      ]
    }
  ];

  const LEAGUE_BOSSES = [
    {
      leader: "Lorelei", trainer: "lorelei-gen1", arena: "Gelo",
      team: [
        { id: 87, name: "Dewgong", types: ["Water", "Ice"], hp: 156, atk: 98, def: 104, spd: 70, trait: "Nevasca" },
        { id: 91, name: "Cloyster", types: ["Water", "Ice"], hp: 142, atk: 112, def: 180, spd: 78, trait: "Concha" },
        { id: 124, name: "Jynx", types: ["Ice", "Psychic"], hp: 132, atk: 122, def: 66, spd: 118, trait: "Hipnose" },
        { id: 131, name: "Lapras Elite", types: ["Water", "Ice"], hp: 190, atk: 116, def: 112, spd: 92, trait: "Aurora" }
      ]
    },
    {
      leader: "Bruno", trainer: "bruno", arena: "Luta",
      team: [
        { id: 95, name: "Onix Guarda", types: ["Rock", "Ground"], hp: 150, atk: 96, def: 160, spd: 80, trait: "Muralha" },
        { id: 107, name: "Hitmonchan", types: ["Fighting"], hp: 146, atk: 138, def: 110, spd: 96, trait: "Punhos" },
        { id: 106, name: "Hitmonlee", types: ["Fighting"], hp: 142, atk: 150, def: 88, spd: 128, trait: "Chute" },
        { id: 68, name: "Machamp Elite", types: ["Fighting"], hp: 188, atk: 160, def: 114, spd: 82, trait: "Forca" }
      ]
    },
    {
      leader: "Agatha", trainer: "agatha-gen1", arena: "Fantasma",
      team: [
        { id: 94, name: "Gengar Sombra", types: ["Ghost", "Poison"], hp: 146, atk: 154, def: 82, spd: 144, trait: "Pesadelo" },
        { id: 42, name: "Golbat", types: ["Poison", "Flying"], hp: 148, atk: 118, def: 96, spd: 128, trait: "Morcego" },
        { id: 24, name: "Arbok", types: ["Poison"], hp: 154, atk: 130, def: 98, spd: 112, trait: "Intimidar" },
        { id: 94, name: "Gengar Ancia", types: ["Ghost", "Poison"], hp: 178, atk: 166, def: 92, spd: 154, trait: "Assombro" }
      ]
    },
    {
      leader: "Lance", trainer: "lance", arena: "Dragao",
      team: [
        { id: 130, name: "Gyarados", types: ["Water", "Flying"], hp: 172, atk: 154, def: 108, spd: 112, trait: "Fúria" },
        { id: 148, name: "Dragonair", types: ["Dragon"], hp: 150, atk: 128, def: 104, spd: 118, trait: "Escalar" },
        { id: 142, name: "Aerodactyl", types: ["Rock", "Flying"], hp: 158, atk: 150, def: 98, spd: 170, trait: "Rapina" },
        { id: 149, name: "Dragonite Elite", types: ["Dragon", "Flying"], hp: 206, atk: 178, def: 124, spd: 112, trait: "Imperio" }
      ]
    },
    {
      leader: "Campeao Blue", trainer: "blue-gen1champion", arena: "Campeao",
      team: [
        { id: 18, name: "Pidgeot Campeao", types: ["Normal", "Flying"], hp: 170, atk: 138, def: 106, spd: 148, trait: "Vendaval" },
        { id: 65, name: "Alakazam Campeao", types: ["Psychic"], hp: 158, atk: 172, def: 82, spd: 166, trait: "Mente" },
        { id: 112, name: "Rhydon Campeao", types: ["Ground", "Rock"], hp: 206, atk: 176, def: 142, spd: 72, trait: "Terremoto" },
        { id: 59, name: "Arcanine Campeao", types: ["Fire"], hp: 188, atk: 164, def: 112, spd: 132, trait: "Chama" },
        { id: 9, name: "Blastoise Campeao", types: ["Water"], hp: 214, atk: 158, def: 150, spd: 104, trait: "Canhão" }
      ]
    }
  ];

  const ALL_BOSSES = [...BOSSES, ...LEAGUE_BOSSES];

  const ITEMS = [
    { id: "leftovers", sprite: "leftovers", name: "Restos", text: "Cura 8% do ativo após atacar.", kind: "heal" },
    { id: "scope", sprite: "scope-lens", name: "Lente Crítica", text: "+18% de chance de crítico.", kind: "crit" },
    { id: "vest", sprite: "assault-vest", name: "Colete Tecnico", text: "Time recebe +12% de defesa.", kind: "def" },
    { id: "orb", sprite: "life-orb", name: "Orbe de Risco", text: "+16% dano final dos ataques.", kind: "damage" },
    { id: "charm", sprite: "shiny-charm", name: "Charme de Sinergia", text: "Sinergias de tipo contam +1.", kind: "synergy" },
    { id: "sash", sprite: "focus-sash", name: "Faixa Foco", text: "Uma vez por run, sobrevive a um golpe fatal.", kind: "sash" },
    { id: "shell-bell", sprite: "shell-bell", name: "Sino Concha", text: "Cura o ativo após causar dano.", kind: "heal" },
    { id: "sitrus-berry", sprite: "sitrus-berry", name: "Fruta Sitrus", text: "Recuperacao constante entre ataques.", kind: "heal" },
    { id: "oran-berry", sprite: "oran-berry", name: "Fruta Oran", text: "Ajuda a sustentar lutas longas.", kind: "heal" },
    { id: "black-sludge", sprite: "black-sludge", name: "Lodo Preto", text: "Cura gradual em runs defensivas.", kind: "heal" },
    { id: "scope-lens", sprite: "scope-lens", name: "Scope Lens", text: "Aumenta chance de golpes críticos.", kind: "crit" },
    { id: "razor-claw", sprite: "razor-claw", name: "Garra Navalha", text: "Aumenta chance de golpes críticos.", kind: "crit" },
    { id: "razor-fang", sprite: "razor-fang", name: "Presa Navalha", text: "Pressiona inimigos com críticos.", kind: "crit" },
    { id: "muscle-band", sprite: "muscle-band", name: "Faixa Muscular", text: "+14% de ataque.", kind: "atk" },
    { id: "wise-glasses", sprite: "wise-glasses", name: "Oculos Sabios", text: "+14% de ataque.", kind: "atk" },
    { id: "choice-band", sprite: "choice-band", name: "Choice Band", text: "+16% de dano final.", kind: "damage" },
    { id: "choice-specs", sprite: "choice-specs", name: "Choice Specs", text: "+16% de dano final.", kind: "damage" },
    { id: "expert-belt", sprite: "expert-belt", name: "Faixa Expert", text: "+16% de dano final.", kind: "damage" },
    { id: "black-belt", sprite: "black-belt", name: "Black Belt", text: "+14% de ataque.", kind: "atk" },
    { id: "mystic-water", sprite: "mystic-water", name: "Água Mística", text: "+14% de ataque.", kind: "atk" },
    { id: "charcoal", sprite: "charcoal", name: "Carvao", text: "+14% de ataque.", kind: "atk" },
    { id: "miracle-seed", sprite: "miracle-seed", name: "Semente Milagrosa", text: "+14% de ataque.", kind: "atk" },
    { id: "magnet", sprite: "magnet", name: "Ima", text: "+14% de ataque.", kind: "atk" },
    { id: "hard-stone", sprite: "hard-stone", name: "Pedra Dura", text: "+14% de ataque.", kind: "atk" },
    { id: "soft-sand", sprite: "soft-sand", name: "Areia Fina", text: "+14% de ataque.", kind: "atk" },
    { id: "poison-barb", sprite: "poison-barb", name: "Farpas Veneno", text: "+14% de ataque.", kind: "atk" },
    { id: "spell-tag", sprite: "spell-tag", name: "Spell Tag", text: "+14% de ataque.", kind: "atk" },
    { id: "twisted-spoon", sprite: "twisted-spoon", name: "Colher Torta", text: "+14% de ataque.", kind: "atk" },
    { id: "dragon-fang", sprite: "dragon-fang", name: "Presa Dragao", text: "+14% de ataque.", kind: "atk" },
    { id: "never-melt-ice", sprite: "never-melt-ice", name: "Gelo Eterno", text: "+14% de ataque.", kind: "atk" },
    { id: "metal-coat", sprite: "metal-coat", name: "Revestimento Metal", text: "+12% de defesa.", kind: "def" },
    { id: "silk-scarf", sprite: "silk-scarf", name: "Lenco Seda", text: "+14% de ataque.", kind: "atk" },
    { id: "power-bracer", sprite: "power-bracer", name: "Bracelete Poder", text: "+14% de ataque.", kind: "atk" },
    { id: "sharp-beak", sprite: "sharp-beak", name: "Bico Afiado", text: "+14% de ataque.", kind: "atk" },
    { id: "silver-powder", sprite: "silver-powder", name: "Po de Prata", text: "+14% de ataque.", kind: "atk" },
    { id: "life-orb-plus", sprite: "life-orb", name: "Orbe Instavel", text: "+16% de dano final.", kind: "damage" },
    { id: "power-lens", sprite: "power-lens", name: "Lente Poder", text: "+16% de dano final.", kind: "damage" },
    { id: "eviolite", sprite: "eviolite", name: "Eviolite", text: "Aumenta defesa e consistencia.", kind: "def" },
    { id: "rocky-helmet", sprite: "rocky-helmet", name: "Capacete Rochoso", text: "Aumenta defesa e consistencia.", kind: "def" },
    { id: "bright-powder", sprite: "bright-powder", name: "Po Brilhante", text: "Aumenta defesa e consistencia.", kind: "def" },
    { id: "light-clay", sprite: "light-clay", name: "Barro Claro", text: "Aumenta defesa e consistencia.", kind: "def" },
    { id: "air-balloon", sprite: "air-balloon", name: "Balao", text: "Aumenta defesa e consistencia.", kind: "def" },
    { id: "safety-goggles", sprite: "safety-goggles", name: "Oculos Protetor", text: "Aumenta defesa e consistencia.", kind: "def" },
    { id: "power-belt", sprite: "power-belt", name: "Cinto Poder", text: "+12% de defesa.", kind: "def" },
    { id: "metal-powder", sprite: "metal-powder", name: "Po Metalico", text: "+12% de defesa.", kind: "def" },
    { id: "power-weight", sprite: "power-weight", name: "Peso Poder", text: "+12% de HP máximo.", kind: "hp" },
    { id: "big-root", sprite: "big-root", name: "Raiz Grande", text: "+12% de HP máximo.", kind: "hp" },
    { id: "thick-club", sprite: "thick-club", name: "Osso Robusto", text: "+12% de HP máximo.", kind: "hp" },
    { id: "healthy-feather", sprite: "health-wing", name: "Pena Vigor", text: "+12% de HP máximo.", kind: "hp" },
    { id: "lucky-egg", sprite: "lucky-egg", name: "Lucky Egg", text: "Ajuda o time a escalar melhor.", kind: "synergy" },
    { id: "amulet-coin", sprite: "amulet-coin", name: "Moeda Amuleto", text: "Ajuda a run a escalar melhor.", kind: "synergy" },
    { id: "wide-lens", sprite: "wide-lens", name: "Wide Lens", text: "Melhora consistencia da equipe.", kind: "synergy" },
    { id: "zoom-lens", sprite: "zoom-lens", name: "Zoom Lens", text: "Melhora consistencia da equipe.", kind: "synergy" },
    { id: "metronome", sprite: "metronome", name: "Metronomo", text: "Melhora sinergias de ataques.", kind: "synergy" },
    { id: "king-s-rock", sprite: "kings-rock", name: "King's Rock", text: "Melhora sinergias de ataques.", kind: "synergy" },
    { id: "quick-claw", sprite: "quick-claw", name: "Garra Rapida", text: "+15% de velocidade.", kind: "spd" },
    { id: "choice-scarf", sprite: "choice-scarf", name: "Choice Scarf", text: "+15% de velocidade.", kind: "spd" },
    { id: "power-anklet", sprite: "power-anklet", name: "Tornozeleira Poder", text: "+15% de velocidade.", kind: "spd" },
    { id: "swift-feather", sprite: "swift-wing", name: "Pena Rapida", text: "+15% de velocidade.", kind: "spd" },
    { id: "focus-band", sprite: "focus-band", name: "Faixa Foco", text: "Pode salvar uma derrota fatal.", kind: "sash" },
    { id: "red-card", sprite: "red-card", name: "Cartao Vermelho", text: "Uma vez por run, ajuda a sobreviver.", kind: "sash" }
  ];

  const MOVES = [
    { id: "quick", name: "Ataque Rapido", type: "Normal", power: 0.92, cost: 0 },
    { id: "focus", name: "Golpe Focado", type: null, power: 1.32, cost: 1 },
    { id: "guard-break", name: "Quebra Guarda", type: "Fighting", power: 1.18, cost: 1 },
    { id: "pulse", name: "Pulso Arcano", type: "Psychic", power: 1.2, cost: 1 },
    { id: "burst", name: "Explosao Elemental", type: null, power: 1.55, cost: 2 }
    ,{ id: "leech", name: "Drenar Energia", type: "Grass", power: 1.05, cost: 1, drain: 0.24 }
    ,{ id: "burn", name: "Chama Viva", type: "Fire", power: 1.18, cost: 1, burn: true }
    ,{ id: "wave", name: "Onda Curativa", type: "Water", power: 1.0, cost: 1, teamHeal: 0.08 }
    ,{ id: "double-spark", name: "Centelha Dupla", type: "Electric", power: 1.08, cost: 1, extra: 0.35 }
    ,{ id: "shadow", name: "Sombra Final", type: "Ghost", power: 1.16, cost: 1, execute: 0.18 }
  ];

  const TYPE_MOVES = {
    Grass: [
      { id: "vine-whip", name: "Chicote de Vinha", type: "Grass", power: 0.95, cost: 0, level: 1 },
      { id: "mega-drain", name: "Mega Dreno", type: "Grass", power: 1.12, cost: 1, drain: 0.22, level: 12 },
      { id: "seed-bomb", name: "Bomba Semente", type: "Grass", power: 1.28, cost: 1, level: 20 },
      { id: "petal-storm", name: "Tempestade Floral", type: "Grass", power: 1.42, cost: 2, level: 28 }
    ],
    Poison: [
      { id: "poison-sting", name: "Agulha Venenosa", type: "Poison", power: 0.9, cost: 0, level: 1 },
      { id: "acid-spray", name: "Jato Acido", type: "Poison", power: 1.05, cost: 1, level: 10 },
      { id: "sludge", name: "Lodo", type: "Poison", power: 1.14, cost: 1, burn: true, level: 14 },
      { id: "venoshock", name: "Veneno Choque", type: "Poison", power: 1.36, cost: 2, burn: true, level: 28 }
    ],
    Fire: [
      { id: "ember", name: "Brasas", type: "Fire", power: 0.98, cost: 0, level: 1, burn: true },
      { id: "flame-wheel", name: "Roda de Fogo", type: "Fire", power: 1.18, cost: 1, burn: true, level: 12 },
      { id: "fire-fang", name: "Presa de Fogo", type: "Fire", power: 1.3, cost: 1, burn: true, level: 22 },
      { id: "flamethrower", name: "Lanca-Chamas", type: "Fire", power: 1.48, cost: 2, burn: true, level: 28 }
    ],
    Water: [
      { id: "bubble", name: "Bolha", type: "Water", power: 0.92, cost: 0, level: 1 },
      { id: "water-pulse", name: "Pulso d'Agua", type: "Water", power: 1.16, cost: 1, teamHeal: 0.05, level: 12 },
      { id: "aqua-tail", name: "Cauda Aqua", type: "Water", power: 1.32, cost: 1, level: 24 },
      { id: "surf", name: "Surfar", type: "Water", power: 1.44, cost: 2, teamHeal: 0.08, level: 30 }
    ],
    Electric: [
      { id: "thundershock", name: "Choque do Trovao", type: "Electric", power: 0.96, cost: 0, level: 1, extra: 0.2 },
      { id: "spark", name: "Centelha", type: "Electric", power: 1.18, cost: 1, extra: 0.32, level: 13 },
      { id: "charge-beam", name: "Raio Carga", type: "Electric", power: 1.24, cost: 1, extra: 0.35, level: 22 },
      { id: "volt-switch", name: "Troca Volt", type: "Electric", power: 1.34, cost: 2, extra: 0.45, level: 28 }
    ],
    Psychic: [
      { id: "confusion", name: "Confusao", type: "Psychic", power: 1.0, cost: 0, level: 1 },
      { id: "stored-power", name: "Poder Guardado", type: "Psychic", power: 1.12, cost: 1, level: 10 },
      { id: "foresight", name: "Clarividencia", type: "Psychic", power: 1.16, cost: 1, extra: 0.12, level: 14 },
      { id: "psybeam", name: "Raio Psiquico", type: "Psychic", power: 1.22, cost: 1, level: 16 },
      { id: "psyshock", name: "Psicochoque", type: "Psychic", power: 1.38, cost: 2, level: 30 }
    ],
    Rock: [
      { id: "rock-throw", name: "Pedrada", type: "Rock", power: 1.0, cost: 0, level: 1 },
      { id: "rock-smash", name: "Quebra Rocha", type: "Rock", power: 1.14, cost: 1, level: 12 },
      { id: "ancient-power", name: "Poder Ancestral", type: "Rock", power: 1.26, cost: 1, extra: 0.18, level: 22 },
      { id: "stone-edge", name: "Gume de Pedra", type: "Rock", power: 1.42, cost: 2, level: 30 }
    ],
    Ground: [
      { id: "mud-slap", name: "Tapa de Lama", type: "Ground", power: 0.96, cost: 0, level: 1 },
      { id: "stomping-tantrum", name: "Birra Pisoteante", type: "Ground", power: 1.18, cost: 1, level: 14 },
      { id: "magnitude", name: "Magnitude", type: "Ground", power: 1.26, cost: 1, extra: 0.2, level: 22 },
      { id: "earth-power", name: "Poder da Terra", type: "Ground", power: 1.36, cost: 2, level: 28 }
    ],
    Fighting: [
      { id: "karate-chop", name: "Golpe Karaté", type: "Fighting", power: 1.02, cost: 0, level: 1 },
      { id: "detect", name: "Detectar", type: "Fighting", power: 1.06, cost: 0, extra: 0.12, level: 6 },
      { id: "low-kick", name: "Chute Baixo", type: "Fighting", power: 1.12, cost: 1, level: 10 },
      { id: "double-kick", name: "Chute Duplo", type: "Fighting", power: 1.2, cost: 1, extra: 0.25, level: 18 },
      { id: "smelling-salts", name: "Despertar Brutal", type: "Fighting", power: 1.26, cost: 1, level: 24 },
      { id: "aura-sphere", name: "Esfera Aura", type: "Fighting", power: 1.34, cost: 2, level: 28 }
    ],
    Ghost: [
      { id: "lick", name: "Lambida", type: "Ghost", power: 0.94, cost: 0, level: 1 },
      { id: "night-shade", name: "Sombra Noturna", type: "Ghost", power: 1.12, cost: 1, level: 12 },
      { id: "ominous-wind", name: "Vento Sinistro", type: "Ghost", power: 1.22, cost: 1, execute: 0.08, level: 20 },
      { id: "shadow-ball", name: "Bola Sombria", type: "Ghost", power: 1.36, cost: 2, execute: 0.12, level: 28 }
    ],
    Bug: [
      { id: "fury-cutter", name: "Corte Furioso", type: "Bug", power: 1.0, cost: 0, level: 1 },
      { id: "bug-bite", name: "Picada", type: "Bug", power: 1.12, cost: 1, level: 12 },
      { id: "silver-wind", name: "Vento Prata", type: "Bug", power: 1.22, cost: 1, extra: 0.2, level: 18 },
      { id: "x-scissor", name: "Tesoura X", type: "Bug", power: 1.3, cost: 1, level: 24 }
    ],
    Flying: [
      { id: "gust", name: "Lufada", type: "Flying", power: 0.98, cost: 0, level: 1 },
      { id: "peck", name: "Bicada", type: "Flying", power: 1.06, cost: 0, level: 6 },
      { id: "wing-attack", name: "Ataque de Asa", type: "Flying", power: 1.18, cost: 1, level: 14 },
      { id: "air-slash", name: "Corte de Ar", type: "Flying", power: 1.28, cost: 1, level: 22 }
    ],
    Ice: [
      { id: "powder-snow", name: "Pó de Neve", type: "Ice", power: 0.9, cost: 0, level: 1 },
      { id: "ice-shard", name: "Estilhaço de Gelo", type: "Ice", power: 1.0, cost: 0, level: 1 },
      { id: "icy-wind", name: "Vento Gelado", type: "Ice", power: 1.12, cost: 1, level: 12 },
      { id: "ice-fang", name: "Presa de Gelo", type: "Ice", power: 1.24, cost: 1, level: 20 },
      { id: "icicle-spear", name: "Lança de Gelo", type: "Ice", power: 1.3, cost: 1, level: 24 },
      { id: "ice-beam", name: "Raio de Gelo", type: "Ice", power: 1.38, cost: 2, level: 30 },
      { id: "blizzard", name: "Nevasca", type: "Ice", power: 1.52, cost: 2, level: 34 }
    ],
    Dragon: [
      { id: "twister", name: "Twister", type: "Dragon", power: 1.0, cost: 0, level: 1 },
      { id: "dragon-tail", name: "Cauda Dragao", type: "Dragon", power: 1.18, cost: 1, level: 14 },
      { id: "dragon-claw", name: "Garra Dragao", type: "Dragon", power: 1.28, cost: 1, level: 22 },
      { id: "dragon-pulse", name: "Pulso Dragao", type: "Dragon", power: 1.38, cost: 2, level: 30 }
    ],
    Dark: [
      { id: "bite", name: "Mordida", type: "Dark", power: 1.02, cost: 0, level: 1 },
      { id: "snarl", name: "Rosnado Sombrio", type: "Dark", power: 1.12, cost: 1, level: 12 },
      { id: "crunch", name: "Triturar", type: "Dark", power: 1.24, cost: 1, level: 20 },
      { id: "night-slash", name: "Corte Noturno", type: "Dark", power: 1.3, cost: 1, level: 24 },
      { id: "dark-pulse", name: "Pulso Sombrio", type: "Dark", power: 1.38, cost: 2, level: 30 }
    ],
    Normal: [
      { id: "tackle", name: "Investida", type: "Normal", power: 0.92, cost: 0, level: 1 },
      { id: "pound", name: "Pancada", type: "Normal", power: 1.0, cost: 0, level: 1 },
      { id: "leer", name: "Encarar", type: "Normal", power: 1.04, cost: 0, level: 4 },
      { id: "double-slap", name: "Tapa Duplo", type: "Normal", power: 1.1, cost: 1, extra: 0.18, level: 10 },
      { id: "headbutt", name: "Cabecada", type: "Normal", power: 1.16, cost: 1, level: 14 },
      { id: "false-swipe", name: "Falso Corte", type: "Normal", power: 1.2, cost: 1, level: 18 },
      { id: "body-slam", name: "Corpo Pesado", type: "Normal", power: 1.24, cost: 1, level: 22 }
      ,{ id: "flail", name: "Debatér", type: "Normal", power: 1.3, cost: 1, level: 26 }
      ,{ id: "endure", name: "Resistir", type: "Normal", power: 1.34, cost: 2, level: 30 }
      ,{ id: "metronome", name: "Metronomo", type: "Normal", power: 1.38, cost: 2, extra: 0.22, level: 32 }
    ],
    Steel: [
      { id: "metal-claw", name: "Garra Metal", type: "Steel", power: 1.02, cost: 0, level: 1 },
      { id: "bullet-punch", name: "Soco Bala", type: "Steel", power: 1.12, cost: 1, level: 10 },
      { id: "iron-head", name: "Cabeca de Ferro", type: "Steel", power: 1.22, cost: 1, level: 16 },
      { id: "flash-cannon", name: "Canhão Flash", type: "Steel", power: 1.38, cost: 2, level: 28 }
    ],
    Fairy: [
      { id: "fairy-wind", name: "Vento Fada", type: "Fairy", power: 0.94, cost: 0, level: 1 },
      { id: "disarming-voice", name: "Voz Encantada", type: "Fairy", power: 0.98, cost: 0, level: 1 },
      { id: "charm", name: "Charme", type: "Fairy", power: 1.04, cost: 0, level: 8 },
      { id: "draining-kiss", name: "Beijo Drenante", type: "Fairy", power: 1.08, cost: 1, drain: 0.3, level: 12 },
      { id: "dazzling-gleam", name: "Brilho Mágico", type: "Fairy", power: 1.28, cost: 1, level: 22 },
      { id: "play-rough", name: "Carinho", type: "Fairy", power: 1.34, cost: 2, level: 26 },
      { id: "moonblast", name: "Explosão Lunar", type: "Fairy", power: 1.4, cost: 2, level: 30 }
    ]
  };

  function specialForm(id, apiName, name, types, hp, atk, def, spd, trait, text = "Forma regional ou especial encontrada nas rotas do Oak Rogue.") {
    return { id, apiName, spriteSlug: apiName, name, types, hp, atk, def, spd, trait, text, national: true, specialForm: true };
  }

  const SPECIAL_FORMS = [
    specialForm(20025, "pikachu-original", "Pikachu Original Cap", ["Electric"], 35, 58, 45, 90, "Boné Original"),
    specialForm(20026, "pikachu-hoenn", "Pikachu Hoenn Cap", ["Electric"], 35, 58, 45, 90, "Boné Hoenn"),
    specialForm(20027, "pikachu-sinnoh", "Pikachu Sinnoh Cap", ["Electric"], 35, 58, 45, 90, "Boné Sinnoh"),
    specialForm(20028, "pikachu-unova", "Pikachu Unova Cap", ["Electric"], 35, 58, 45, 90, "Boné Unova"),
    specialForm(20029, "pikachu-kalos", "Pikachu Kalos Cap", ["Electric"], 35, 58, 45, 90, "Boné Kalos"),
    specialForm(20030, "pikachu-alola", "Pikachu Alola Cap", ["Electric"], 35, 58, 45, 90, "Boné Alola"),
    specialForm(20031, "pikachu-partner", "Pikachu Partner Cap", ["Electric"], 35, 58, 45, 90, "Parceiro"),
    specialForm(20032, "pikachu-world", "Pikachu World Cap", ["Electric"], 35, 58, 45, 90, "Campeão Mundial"),
    specialForm(20037, "vulpix-alola", "Vulpix de Alola", ["Ice"], 38, 50, 65, 65, "Neve"),
    specialForm(20038, "ninetales-alola", "Ninetales de Alola", ["Ice", "Fairy"], 73, 81, 100, 109, "Véu Nevado"),
    specialForm(20052, "meowth-alola", "Meowth de Alola", ["Dark"], 40, 65, 40, 90, "Astúcia"),
    specialForm(20053, "persian-alola", "Persian de Alola", ["Dark"], 65, 75, 60, 115, "Pelagem Real"),
    specialForm(20074, "geodude-alola", "Geodude de Alola", ["Rock", "Electric"], 40, 75, 100, 20, "Magnetismo"),
    specialForm(20075, "graveler-alola", "Graveler de Alola", ["Rock", "Electric"], 55, 95, 115, 35, "Magnetismo"),
    specialForm(20076, "golem-alola", "Golem de Alola", ["Rock", "Electric"], 80, 120, 130, 45, "Canhão Magnético"),
    specialForm(20103, "exeggutor-alola", "Exeggutor de Alola", ["Grass", "Dragon"], 95, 125, 85, 45, "Draco Palmeira"),
    specialForm(20105, "marowak-alola", "Marowak de Alola", ["Fire", "Ghost"], 60, 80, 110, 45, "Dança Flamejante"),
    specialForm(20026.1, "raichu-alola", "Raichu de Alola", ["Electric", "Psychic"], 60, 95, 75, 110, "Surfe Psíquico"),
    specialForm(20077, "ponyta-galar", "Ponyta de Galar", ["Psychic"], 50, 75, 55, 90, "Pastel"),
    specialForm(20078, "rapidash-galar", "Rapidash de Galar", ["Psychic", "Fairy"], 65, 100, 80, 105, "Galope Místico"),
    specialForm(20110, "weezing-galar", "Weezing de Galar", ["Poison", "Fairy"], 65, 95, 120, 60, "Chaminé Real"),
    specialForm(20215, "sneasel-hisui", "Sneasel de Hisui", ["Fighting", "Poison"], 55, 95, 55, 115, "Escalada"),
    specialForm(20019, "rattata-alola", "Rattata de Alola", ["Dark", "Normal"], 30, 56, 35, 72, "Noturno"),
    specialForm(20020, "raticate-alola", "Raticaté de Alola", ["Dark", "Normal"], 75, 71, 70, 77, "Chefe Noturno"),
    specialForm(20027.1, "sandshrew-alola", "Sandshrew de Alola", ["Ice", "Steel"], 50, 75, 90, 40, "Iglu"),
    specialForm(20028.1, "sandslash-alola", "Sandslash de Alola", ["Ice", "Steel"], 75, 100, 120, 65, "Garras Geladas"),
    specialForm(20050, "diglett-alola", "Diglett de Alola", ["Ground", "Steel"], 10, 55, 40, 90, "Cabelo Metal"),
    specialForm(20051, "dugtrio-alola", "Dugtrio de Alola", ["Ground", "Steel"], 35, 100, 60, 110, "Trio Metal"),
    specialForm(20088, "grimer-alola", "Grimer de Alola", ["Poison", "Dark"], 80, 80, 50, 25, "Lodo Colorido"),
    specialForm(20089, "muk-alola", "Muk de Alola", ["Poison", "Dark"], 105, 105, 100, 50, "Lodo Prismático"),
    specialForm(20052.1, "meowth-galar", "Meowth de Galar", ["Steel"], 50, 65, 55, 40, "Sucata"),
    specialForm(20863, "perrserker", "Perrserker", ["Steel"], 70, 110, 100, 50, "Barba de Ferro"),
    specialForm(20083, "farfetchd-galar", "Farfetch'd de Galar", ["Fighting"], 52, 95, 55, 55, "Alho Valente"),
    specialForm(20865, "sirfetchd", "Sirfetch'd", ["Fighting"], 62, 135, 95, 65, "Cavaleiro"),
    specialForm(20199, "slowpoke-galar", "Slowpoke de Galar", ["Psychic"], 90, 65, 65, 15, "Tempero"),
    specialForm(20080, "slowbro-galar", "Slowbro de Galar", ["Poison", "Psychic"], 95, 100, 95, 30, "Canhão Tóxico"),
    specialForm(20199.1, "slowking-galar", "Slowking de Galar", ["Poison", "Psychic"], 95, 110, 95, 30, "Poço Real"),
    specialForm(20122, "mr-mime-galar", "Mr. Mime de Galar", ["Ice", "Psychic"], 50, 90, 75, 100, "Sapateado"),
    specialForm(20866, "mr-rime", "Mr. Rime", ["Ice", "Psychic"], 80, 110, 85, 70, "Mímico Gelado"),
    specialForm(20144, "articuno-galar", "Articuno de Galar", ["Psychic", "Flying"], 90, 110, 95, 95, "Olhar Congelante"),
    specialForm(20145, "zapdos-galar", "Zapdos de Galar", ["Fighting", "Flying"], 90, 115, 90, 100, "Chute Trovejante"),
    specialForm(20146, "moltres-galar", "Moltres de Galar", ["Dark", "Flying"], 90, 120, 95, 90, "Fúria Sombria"),
    specialForm(20222, "corsola-galar", "Corsola de Galar", ["Ghost"], 60, 65, 100, 30, "Coral Pálido"),
    specialForm(20864, "cursola", "Cursola", ["Ghost"], 60, 145, 100, 30, "Casca Vazia"),
    specialForm(20263, "zigzagoon-galar", "Zigzagoon de Galar", ["Dark", "Normal"], 38, 45, 41, 60, "Ziguezague"),
    specialForm(20264, "linoone-galar", "Linoone de Galar", ["Dark", "Normal"], 78, 70, 61, 100, "Disparo"),
    specialForm(20862, "obstagoon", "Obstagoon", ["Dark", "Normal"], 93, 90, 101, 95, "Bloqueio"),
    specialForm(20554, "darumaka-galar", "Darumaka de Galar", ["Ice"], 70, 90, 45, 50, "Boneco de Neve"),
    specialForm(20555, "darmanitan-galar", "Darmanitan de Galar", ["Ice"], 105, 130, 65, 95, "Modo Gelado"),
    specialForm(20562, "yamask-galar", "Yamask de Galar", ["Ground", "Ghost"], 38, 65, 85, 30, "Máscara Rúnica"),
    specialForm(20867, "runerigus", "Runerigus", ["Ground", "Ghost"], 58, 95, 145, 30, "Runas"),
    specialForm(20618, "stunfisk-galar", "Stunfisk de Galar", ["Ground", "Steel"], 109, 81, 99, 32, "Armadilha"),
    specialForm(20058, "growlithe-hisui", "Growlithe de Hisui", ["Fire", "Rock"], 60, 75, 55, 55, "Guarda Rochosa"),
    specialForm(20059, "arcanine-hisui", "Arcanine de Hisui", ["Fire", "Rock"], 95, 115, 80, 90, "Fera Vulcânica"),
    specialForm(20100, "voltorb-hisui", "Voltorb de Hisui", ["Electric", "Grass"], 40, 60, 50, 100, "Apricorn"),
    specialForm(20101, "electrode-hisui", "Electrode de Hisui", ["Electric", "Grass"], 60, 80, 70, 150, "Explosão Verde"),
    specialForm(20157, "typhlosion-hisui", "Typhlosion de Hisui", ["Fire", "Ghost"], 73, 113, 78, 95, "Chama Espiritual"),
    specialForm(20503, "samurott-hisui", "Samurott de Hisui", ["Water", "Dark"], 90, 108, 85, 85, "Lâmina Cruel"),
    specialForm(20724, "decidueye-hisui", "Decidueye de Hisui", ["Grass", "Fighting"], 88, 112, 95, 60, "Arqueiro Marcial"),
    specialForm(20570, "zorua-hisui", "Zorua de Hisui", ["Normal", "Ghost"], 35, 85, 40, 70, "Ilusão Pálida"),
    specialForm(20571, "zoroark-hisui", "Zoroark de Hisui", ["Normal", "Ghost"], 55, 125, 60, 110, "Rancor"),
    specialForm(20705, "sliggoo-hisui", "Sliggoo de Hisui", ["Steel", "Dragon"], 58, 83, 113, 40, "Caracol Metal"),
    specialForm(20706, "goodra-hisui", "Goodra de Hisui", ["Steel", "Dragon"], 80, 110, 150, 60, "Gosma Blindada"),
    specialForm(20713, "avalugg-hisui", "Avalugg de Hisui", ["Ice", "Rock"], 95, 117, 184, 38, "Geleira Rochosa"),
    specialForm(20194, "wooper-paldea", "Wooper de Paldea", ["Poison", "Ground"], 55, 45, 45, 15, "Lama Tóxica"),
    specialForm(20980, "clodsire", "Clodsire", ["Poison", "Ground"], 130, 75, 90, 20, "Pântano"),
    specialForm(20128, "tauros-paldeacombat", "Tauros de Paldea Combat", ["Fighting"], 75, 110, 105, 100, "Raça Combat"),
    specialForm(20128.1, "tauros-paldeablaze", "Tauros de Paldea Blaze", ["Fighting", "Fire"], 75, 110, 105, 100, "Raça Blaze"),
    specialForm(20128.2, "tauros-paldeaaqua", "Tauros de Paldea Aqua", ["Fighting", "Water"], 75, 110, 105, 100, "Raça Aqua"),
    specialForm(20386.1, "deoxys-attack", "Deoxys Ataque", ["Psychic"], 50, 180, 20, 150, "Forma Ataque"),
    specialForm(20386.2, "deoxys-defense", "Deoxys Defesa", ["Psychic"], 50, 70, 160, 90, "Forma Defesa"),
    specialForm(20386.3, "deoxys-speed", "Deoxys Velocidade", ["Psychic"], 50, 95, 90, 180, "Forma Velocidade"),
    specialForm(20479.1, "rotom-heat", "Rotom Heat", ["Electric", "Fire"], 50, 105, 107, 86, "Forno"),
    specialForm(20479.2, "rotom-wash", "Rotom Wash", ["Electric", "Water"], 50, 105, 107, 86, "Lavadora"),
    specialForm(20479.3, "rotom-frost", "Rotom Frost", ["Electric", "Ice"], 50, 105, 107, 86, "Geladeira"),
    specialForm(20479.4, "rotom-fan", "Rotom Fan", ["Electric", "Flying"], 50, 105, 107, 86, "Ventilador"),
    specialForm(20479.5, "rotom-mow", "Rotom Mow", ["Electric", "Grass"], 50, 105, 107, 86, "Cortador"),
    specialForm(20487, "giratina-origin", "Giratina Origem", ["Ghost", "Dragon"], 150, 110, 100, 90, "Mundo Reverso"),
    specialForm(20492, "shaymin-sky", "Shaymin Céu", ["Grass", "Flying"], 100, 115, 75, 127, "Gratidão Celeste"),
    specialForm(20903, "sneasler", "Sneasler", ["Fighting", "Poison"], 80, 130, 70, 120, "Garra Íngreme")
  ];

  const SPECIAL_FORMS_BY_ID = new Map(SPECIAL_FORMS.map((form) => [form.id, form]));

  const EVOLUTIONS = {
    1: { into: { id: 2, name: "Ivysaur", types: ["Grass", "Poison"], hp: 62, atk: 62, def: 63, spd: 60, trait: "Controle" }, level: 16 },
    2: { into: { id: 3, name: "Venusaur", types: ["Grass", "Poison"], hp: 82, atk: 82, def: 83, spd: 80, trait: "Florescer" }, level: 32 },
    4: { into: { id: 5, name: "Charmeleon", types: ["Fire"], hp: 58, atk: 72, def: 58, spd: 80, trait: "Pressão" }, level: 16 },
    5: { into: { id: 6, name: "Charizard", types: ["Fire", "Flying"], hp: 78, atk: 96, def: 78, spd: 100, trait: "Inferno" }, level: 36 },
    7: { into: { id: 8, name: "Wartortle", types: ["Water"], hp: 66, atk: 63, def: 80, spd: 58, trait: "Guarda" }, level: 16 },
    8: { into: { id: 9, name: "Blastoise", types: ["Water"], hp: 84, atk: 88, def: 105, spd: 78, trait: "Canhão" }, level: 36 },
    25: { into: { id: 26, name: "Raichu", types: ["Electric"], hp: 66, atk: 90, def: 55, spd: 110, trait: "Voltagem" }, stone: "thunder" },
    27: { into: { id: 28, name: "Sandslash", types: ["Ground"], hp: 75, atk: 100, def: 110, spd: 65, trait: "Areia" }, level: 22 },
    37: { into: { id: 38, name: "Ninetales", types: ["Fire"], hp: 73, atk: 90, def: 75, spd: 100, trait: "Raposa" }, stone: "fire" },
    39: { into: { id: 40, name: "Wigglytuff", types: ["Normal", "Fairy"], hp: 140, atk: 85, def: 45, spd: 45, trait: "Encore" }, stone: "moon" },
    41: { into: { id: 42, name: "Golbat", types: ["Poison", "Flying"], hp: 75, atk: 80, def: 70, spd: 90, trait: "Morcego" }, level: 22 },
    42: { into: { id: 169, name: "Crobat", types: ["Poison", "Flying"], hp: 85, atk: 90, def: 80, spd: 130, trait: "Morcego" }, level: 36 },
    43: { into: { id: 44, name: "Gloom", types: ["Grass", "Poison"], hp: 60, atk: 75, def: 70, spd: 40, trait: "Po" }, level: 21 },
    44: {
      options: [
        { into: { id: 45, name: "Vileplume", types: ["Grass", "Poison"], hp: 75, atk: 100, def: 85, spd: 50, trait: "Esporos" }, stone: "leaf" },
        { into: { id: 182, name: "Bellossom", types: ["Grass"], hp: 75, atk: 90, def: 95, spd: 50, trait: "Dança" }, stone: "sun" }
      ],
      stone: "choice"
    },
    50: { into: { id: 51, name: "Dugtrio", types: ["Ground"], hp: 35, atk: 100, def: 50, spd: 120, trait: "Tunel" }, level: 26 },
    54: { into: { id: 55, name: "Golduck", types: ["Water"], hp: 80, atk: 95, def: 78, spd: 85, trait: "Enxaqueca" }, level: 33 },
    58: { into: { id: 59, name: "Arcanine", types: ["Fire"], hp: 90, atk: 110, def: 80, spd: 95, trait: "Brasa" }, stone: "fire" },
    60: { into: { id: 61, name: "Poliwhirl", types: ["Water"], hp: 65, atk: 65, def: 65, spd: 90, trait: "Bolhas" }, level: 25 },
    61: {
      options: [
        { into: { id: 62, name: "Poliwrath", types: ["Water", "Fighting"], hp: 90, atk: 95, def: 95, spd: 70, trait: "Punho" }, stone: "water" },
        { into: { id: 186, name: "Politoed", types: ["Water"], hp: 90, atk: 90, def: 75, spd: 70, trait: "Chuva" }, stone: "king" }
      ],
      stone: "choice"
    },
    63: { into: { id: 64, name: "Kadabra", types: ["Psychic"], hp: 40, atk: 105, def: 35, spd: 105, trait: "Foco" }, level: 16 },
    64: { into: { id: 65, name: "Alakazam", types: ["Psychic"], hp: 55, atk: 135, def: 45, spd: 120, trait: "Foco" }, level: 36 },
    66: { into: { id: 67, name: "Machoke", types: ["Fighting"], hp: 80, atk: 100, def: 70, spd: 45, trait: "Punho" }, level: 28 },
    67: { into: { id: 68, name: "Machamp", types: ["Fighting"], hp: 90, atk: 130, def: 80, spd: 55, trait: "Forca" }, level: 40 },
    69: { into: { id: 70, name: "Weepinbell", types: ["Grass", "Poison"], hp: 65, atk: 90, def: 50, spd: 55, trait: "Cipo" }, level: 21 },
    70: { into: { id: 71, name: "Victreebel", types: ["Grass", "Poison"], hp: 80, atk: 105, def: 65, spd: 70, trait: "Cipo" }, stone: "leaf" },
    74: { into: { id: 75, name: "Graveler", types: ["Rock", "Ground"], hp: 65, atk: 95, def: 115, spd: 35, trait: "Casca" }, level: 25 },
    75: { into: { id: 76, name: "Golem", types: ["Rock", "Ground"], hp: 80, atk: 120, def: 130, spd: 45, trait: "Casca" }, level: 40 },
    77: { into: { id: 78, name: "Rapidash", types: ["Fire"], hp: 65, atk: 100, def: 70, spd: 105, trait: "Galope" }, level: 40 },
    81: { into: { id: 82, name: "Magneton", types: ["Electric", "Steel"], hp: 50, atk: 105, def: 95, spd: 70, trait: "Ima" }, level: 30 },
    82: { into: { id: 462, name: "Magnezone", types: ["Electric", "Steel"], hp: 70, atk: 130, def: 115, spd: 60, trait: "Ima" }, stone: "thunder" },
    88: { into: { id: 89, name: "Muk", types: ["Poison"], hp: 105, atk: 105, def: 75, spd: 50, trait: "Lodo" }, level: 38 },
    90: { into: { id: 91, name: "Cloyster", types: ["Water", "Ice"], hp: 50, atk: 95, def: 180, spd: 70, trait: "Concha" }, stone: "water" },
    92: { into: { id: 93, name: "Haunter", types: ["Ghost", "Poison"], hp: 45, atk: 105, def: 45, spd: 95, trait: "Assombro" }, level: 25 },
    93: { into: { id: 94, name: "Gengar", types: ["Ghost", "Poison"], hp: 60, atk: 130, def: 60, spd: 110, trait: "Assombro" }, level: 40 },
    96: { into: { id: 97, name: "Hypno", types: ["Psychic"], hp: 85, atk: 83, def: 80, spd: 67, trait: "Hipnose" }, level: 26 },
    98: { into: { id: 99, name: "Kingler", types: ["Water"], hp: 55, atk: 130, def: 115, spd: 75, trait: "Pinça" }, level: 28 },
    100: { into: { id: 101, name: "Electrode", types: ["Electric"], hp: 60, atk: 80, def: 70, spd: 150, trait: "Estouro" }, level: 30 },
    102: { into: { id: 103, name: "Exeggutor", types: ["Grass", "Psychic"], hp: 95, atk: 125, def: 85, spd: 55, trait: "Oraculo" }, stone: "leaf" },
    104: { into: { id: 105, name: "Marowak", types: ["Ground"], hp: 60, atk: 80, def: 110, spd: 45, trait: "Osso" }, level: 28 },
    109: { into: { id: 110, name: "Weezing", types: ["Poison"], hp: 65, atk: 90, def: 120, spd: 60, trait: "Gas" }, level: 35 },
    111: { into: { id: 112, name: "Rhydon", types: ["Ground", "Rock"], hp: 105, atk: 130, def: 120, spd: 40, trait: "Chifre" }, level: 42 },
    112: { into: { id: 464, name: "Rhyperior", types: ["Ground", "Rock"], hp: 115, atk: 140, def: 130, spd: 40, trait: "Terremoto" }, stone: "protector" },
    120: { into: { id: 121, name: "Starmie", types: ["Water", "Psychic"], hp: 60, atk: 100, def: 85, spd: 115, trait: "Estrela" }, stone: "water" },
    123: { into: { id: 212, name: "Scizor", types: ["Bug", "Steel"], hp: 70, atk: 130, def: 100, spd: 65, trait: "Corte Metal" }, stone: "metal" },
    125: { into: { id: 466, name: "Electivire", types: ["Electric"], hp: 75, atk: 123, def: 67, spd: 95, trait: "Descarga" }, stone: "thunder" },
    126: { into: { id: 467, name: "Magmortar", types: ["Fire"], hp: 75, atk: 125, def: 67, spd: 83, trait: "Magma" }, stone: "fire" },
    147: { into: { id: 148, name: "Dragonair", types: ["Dragon"], hp: 61, atk: 84, def: 65, spd: 70, trait: "Escalar" }, level: 30 },
    148: { into: { id: 149, name: "Dragonite", types: ["Dragon", "Flying"], hp: 91, atk: 134, def: 95, spd: 80, trait: "Escalar" }, level: 55 },
    152: { into: { id: 153, name: "Bayleef", types: ["Grass"], hp: 60, atk: 62, def: 80, spd: 60, trait: "Folha" }, level: 16 },
    153: { into: { id: 154, name: "Meganium", types: ["Grass"], hp: 80, atk: 82, def: 100, spd: 80, trait: "Folha Solar" }, level: 32 },
    155: { into: { id: 156, name: "Quilava", types: ["Fire"], hp: 58, atk: 75, def: 58, spd: 80, trait: "Brasa" }, level: 14 },
    156: { into: { id: 157, name: "Typhlosion", types: ["Fire"], hp: 78, atk: 109, def: 78, spd: 100, trait: "Erupcao" }, level: 36 },
    158: { into: { id: 159, name: "Croconaw", types: ["Water"], hp: 65, atk: 80, def: 80, spd: 58, trait: "Mordida" }, level: 18 },
    159: { into: { id: 160, name: "Feraligatr", types: ["Water"], hp: 85, atk: 105, def: 100, spd: 78, trait: "Mandíbula" }, level: 30 },
    252: { into: { id: 253, name: "Grovyle", types: ["Grass"], hp: 50, atk: 85, def: 45, spd: 95, trait: "Agilidade" }, level: 16 },
    253: { into: { id: 254, name: "Sceptile", types: ["Grass"], hp: 70, atk: 105, def: 65, spd: 120, trait: "Lâmina" }, level: 36 },
    255: { into: { id: 256, name: "Combusken", types: ["Fire", "Fighting"], hp: 60, atk: 85, def: 60, spd: 55, trait: "Chama" }, level: 16 },
    256: { into: { id: 257, name: "Blaziken", types: ["Fire", "Fighting"], hp: 80, atk: 120, def: 70, spd: 80, trait: "Impeto" }, level: 36 },
    258: { into: { id: 259, name: "Marshtomp", types: ["Water", "Ground"], hp: 70, atk: 85, def: 70, spd: 50, trait: "Lama" }, level: 16 },
    259: { into: { id: 260, name: "Swampert", types: ["Water", "Ground"], hp: 100, atk: 110, def: 90, spd: 60, trait: "Pântano" }, level: 36 },
    280: { into: { id: 281, name: "Kirlia", types: ["Psychic", "Fairy"], hp: 38, atk: 65, def: 45, spd: 50, trait: "Sincronia" }, level: 20 },
    281: {
      options: [
        { into: { id: 282, name: "Gardevoir", types: ["Psychic", "Fairy"], hp: 68, atk: 100, def: 80, spd: 80, trait: "Graca Psi" }, level: 30 },
        { into: { id: 475, name: "Gallade", types: ["Psychic", "Fighting"], hp: 68, atk: 125, def: 85, spd: 80, trait: "Lâmina Psi" }, level: 30 }
      ],
      level: 30
    },
    387: { into: { id: 388, name: "Grotle", types: ["Grass"], hp: 75, atk: 89, def: 85, spd: 36, trait: "Raiz" }, level: 18 },
    388: { into: { id: 389, name: "Torterra", types: ["Grass", "Ground"], hp: 95, atk: 109, def: 105, spd: 56, trait: "Continente" }, level: 32 },
    390: { into: { id: 391, name: "Monferno", types: ["Fire", "Fighting"], hp: 64, atk: 78, def: 52, spd: 81, trait: "Impeto" }, level: 14 },
    391: { into: { id: 392, name: "Infernape", types: ["Fire", "Fighting"], hp: 76, atk: 104, def: 71, spd: 108, trait: "Punho Flamejante" }, level: 36 },
    393: { into: { id: 394, name: "Prinplup", types: ["Water"], hp: 64, atk: 81, def: 68, spd: 50, trait: "Orgulho" }, level: 16 },
    394: { into: { id: 395, name: "Empoleon", types: ["Water", "Steel"], hp: 84, atk: 111, def: 88, spd: 60, trait: "Imperador" }, level: 36 },
    495: { into: { id: 496, name: "Servine", types: ["Grass"], hp: 60, atk: 60, def: 75, spd: 83, trait: "Elegancia" }, level: 17 },
    496: { into: { id: 497, name: "Serperior", types: ["Grass"], hp: 75, atk: 75, def: 95, spd: 113, trait: "Nobreza" }, level: 36 },
    498: { into: { id: 499, name: "Pignite", types: ["Fire", "Fighting"], hp: 90, atk: 93, def: 55, spd: 55, trait: "Carga" }, level: 17 },
    499: { into: { id: 500, name: "Emboar", types: ["Fire", "Fighting"], hp: 110, atk: 123, def: 65, spd: 65, trait: "Investida" }, level: 36 },
    501: { into: { id: 502, name: "Dewott", types: ["Water"], hp: 75, atk: 75, def: 60, spd: 60, trait: "Concha" }, level: 17 },
    502: { into: { id: 503, name: "Samurott", types: ["Water"], hp: 95, atk: 108, def: 85, spd: 70, trait: "Lâmina" }, level: 36 },
    650: { into: { id: 651, name: "Quilladin", types: ["Grass"], hp: 61, atk: 78, def: 95, spd: 57, trait: "Casca" }, level: 16 },
    651: { into: { id: 652, name: "Chesnaught", types: ["Grass", "Fighting"], hp: 88, atk: 107, def: 122, spd: 64, trait: "Escudo" }, level: 36 },
    653: { into: { id: 654, name: "Braixen", types: ["Fire"], hp: 59, atk: 85, def: 58, spd: 73, trait: "Mente" }, level: 16 },
    654: { into: { id: 655, name: "Delphox", types: ["Fire", "Psychic"], hp: 75, atk: 114, def: 72, spd: 104, trait: "Oraculo" }, level: 36 },
    656: { into: { id: 657, name: "Frogadier", types: ["Water"], hp: 54, atk: 83, def: 52, spd: 97, trait: "Ninja" }, level: 16 },
    657: { into: { id: 658, name: "Greninja", types: ["Water", "Dark"], hp: 72, atk: 108, def: 67, spd: 122, trait: "Sombra" }, level: 36 },
    722: { into: { id: 723, name: "Dartrix", types: ["Grass", "Flying"], hp: 78, atk: 75, def: 75, spd: 52, trait: "Pluma" }, level: 17 },
    723: { into: { id: 724, name: "Decidueye", types: ["Grass", "Ghost"], hp: 78, atk: 107, def: 75, spd: 70, trait: "Arqueiro" }, level: 34 },
    725: { into: { id: 726, name: "Torracat", types: ["Fire"], hp: 65, atk: 85, def: 50, spd: 90, trait: "Garra" }, level: 17 },
    726: { into: { id: 727, name: "Incineroar", types: ["Fire", "Dark"], hp: 95, atk: 115, def: 90, spd: 60, trait: "Intimidar" }, level: 34 },
    728: { into: { id: 729, name: "Brionne", types: ["Water"], hp: 60, atk: 91, def: 69, spd: 50, trait: "Canção" }, level: 17 },
    729: { into: { id: 730, name: "Primarina", types: ["Water", "Fairy"], hp: 80, atk: 126, def: 74, spd: 60, trait: "Sereia" }, level: 34 },
    810: { into: { id: 811, name: "Thwackey", types: ["Grass"], hp: 70, atk: 85, def: 70, spd: 80, trait: "Ritmo" }, level: 16 },
    811: { into: { id: 812, name: "Rillaboom", types: ["Grass"], hp: 100, atk: 125, def: 90, spd: 85, trait: "Tambor" }, level: 35 },
    813: { into: { id: 814, name: "Raboot", types: ["Fire"], hp: 65, atk: 86, def: 60, spd: 94, trait: "Arranque" }, level: 16 },
    814: { into: { id: 815, name: "Cinderace", types: ["Fire"], hp: 80, atk: 116, def: 75, spd: 119, trait: "Artilheiro" }, level: 35 },
    816: { into: { id: 817, name: "Drizzile", types: ["Water"], hp: 65, atk: 85, def: 55, spd: 90, trait: "Disparo" }, level: 16 },
    817: { into: { id: 818, name: "Inteleon", types: ["Water"], hp: 70, atk: 125, def: 65, spd: 120, trait: "Mira" }, level: 35 },
    906: { into: { id: 907, name: "Floragato", types: ["Grass"], hp: 61, atk: 80, def: 63, spd: 83, trait: "Flor" }, level: 16 },
    907: { into: { id: 908, name: "Meowscarada", types: ["Grass", "Dark"], hp: 76, atk: 110, def: 70, spd: 123, trait: "Mascara" }, level: 36 },
    909: { into: { id: 910, name: "Crocalor", types: ["Fire"], hp: 81, atk: 75, def: 78, spd: 49, trait: "Fornalha" }, level: 16 },
    910: { into: { id: 911, name: "Skeledirge", types: ["Fire", "Ghost"], hp: 104, atk: 110, def: 100, spd: 66, trait: "Canção Flamejante" }, level: 36 },
    912: { into: { id: 913, name: "Quaxwell", types: ["Water"], hp: 70, atk: 85, def: 65, spd: 65, trait: "Passo" }, level: 16 },
    913: { into: { id: 914, name: "Quaquaval", types: ["Water", "Fighting"], hp: 85, atk: 120, def: 80, spd: 85, trait: "Dança" }, level: 36 },
    133: {
      options: [
        { into: { id: 134, name: "Vaporeon", types: ["Water"], hp: 130, atk: 80, def: 70, spd: 65, trait: "Absorver Água" }, stone: "water" },
        { into: { id: 135, name: "Jolteon", types: ["Electric"], hp: 65, atk: 110, def: 60, spd: 130, trait: "Voltagem" }, stone: "thunder" },
        { into: { id: 136, name: "Flareon", types: ["Fire"], hp: 65, atk: 130, def: 70, spd: 65, trait: "Chama" }, stone: "fire" },
        { into: { id: 196, name: "Espeon", types: ["Psychic"], hp: 65, atk: 130, def: 60, spd: 110, trait: "Sincronia" }, stone: "sun" },
        { into: { id: 197, name: "Umbreon", types: ["Dark"], hp: 95, atk: 65, def: 110, spd: 65, trait: "Muralha" }, stone: "moon" },
        { into: { id: 470, name: "Leafeon", types: ["Grass"], hp: 65, atk: 110, def: 130, spd: 95, trait: "Folhagem" }, stone: "leaf" },
        { into: { id: 471, name: "Glaceon", types: ["Ice"], hp: 65, atk: 130, def: 110, spd: 65, trait: "Nevasca" }, stone: "ice" },
        { into: { id: 700, name: "Sylveon", types: ["Fairy"], hp: 95, atk: 110, def: 65, spd: 60, trait: "Encanto" }, stone: "shiny" }
      ],
      stone: "choice"
    },
    215: { into: { id: 461, name: "Weavile", types: ["Dark", "Ice"], hp: 70, atk: 120, def: 65, spd: 125, trait: "Emboscada" }, stone: "dark" },
    624: { into: { id: 625, name: "Bisharp", types: ["Dark", "Steel"], hp: 65, atk: 125, def: 100, spd: 70, trait: "Lâmina Sombria" }, level: 52 },
    625: { into: { id: 983, name: "Kingambit", types: ["Dark", "Steel"], hp: 100, atk: 135, def: 120, spd: 50, trait: "General Supremo" }, stone: "leader" }
  };

  Object.assign(EVOLUTIONS, {
    25: {
      options: [
        { into: { id: 26, name: "Raichu", types: ["Electric"], hp: 66, atk: 90, def: 55, spd: 110, trait: "Voltagem" }, stone: "thunder" },
        { into: { ...SPECIAL_FORMS_BY_ID.get(20026.1) }, stone: "alola" }
      ],
      stone: "choice"
    },
    20037: { into: { ...SPECIAL_FORMS_BY_ID.get(20038) }, stone: "ice" },
    20019: { into: { ...SPECIAL_FORMS_BY_ID.get(20020) }, level: 20 },
    20027.1: { into: { ...SPECIAL_FORMS_BY_ID.get(20028.1) }, stone: "ice" },
    20050: { into: { ...SPECIAL_FORMS_BY_ID.get(20051) }, level: 26 },
    20088: { into: { ...SPECIAL_FORMS_BY_ID.get(20089) }, level: 38 },
    20052: { into: { ...SPECIAL_FORMS_BY_ID.get(20053) }, level: 28 },
    20052.1: { into: { ...SPECIAL_FORMS_BY_ID.get(20863) }, level: 28 },
    20083: { into: { ...SPECIAL_FORMS_BY_ID.get(20865) }, level: 32 },
    20199: {
      options: [
        { into: { ...SPECIAL_FORMS_BY_ID.get(20080) }, stone: "poison" },
        { into: { ...SPECIAL_FORMS_BY_ID.get(20199.1) }, stone: "king" }
      ],
      stone: "choice"
    },
    20122: { into: { ...SPECIAL_FORMS_BY_ID.get(20866) }, level: 32 },
    20222: { into: { ...SPECIAL_FORMS_BY_ID.get(20864) }, level: 38 },
    20263: { into: { ...SPECIAL_FORMS_BY_ID.get(20264) }, level: 20 },
    20264: { into: { ...SPECIAL_FORMS_BY_ID.get(20862) }, level: 35 },
    20554: { into: { ...SPECIAL_FORMS_BY_ID.get(20555) }, stone: "ice" },
    20562: { into: { ...SPECIAL_FORMS_BY_ID.get(20867) }, level: 34 },
    20074: { into: { ...SPECIAL_FORMS_BY_ID.get(20075) }, level: 25 },
    20075: { into: { ...SPECIAL_FORMS_BY_ID.get(20076) }, level: 40 },
    20077: { into: { ...SPECIAL_FORMS_BY_ID.get(20078) }, level: 40 },
    20058: { into: { ...SPECIAL_FORMS_BY_ID.get(20059) }, stone: "fire" },
    20100: { into: { ...SPECIAL_FORMS_BY_ID.get(20101) }, stone: "leaf" },
    20570: { into: { ...SPECIAL_FORMS_BY_ID.get(20571) }, level: 30 },
    20705: { into: { ...SPECIAL_FORMS_BY_ID.get(20706) }, level: 50 },
    20215: { into: { ...SPECIAL_FORMS_BY_ID.get(20903) }, level: 36 },
    20194: { into: { ...SPECIAL_FORMS_BY_ID.get(20980) }, level: 20 }
  });

  const NODE_TYPES = [
    { type: "battle", label: "Batalha", icon: "B", sprite: "trainer", copy: "Inimigo escalado pelo andar." },
    { type: "grass", label: "Mato", icon: "G", sprite: "grass", copy: "Batalha selvagem aleatória." },
    { type: "catch", label: "Recrutar", icon: "P", sprite: "pokeball", copy: "Escolha um novo aliado." },
    { type: "item", label: "Relíquia", icon: "I", sprite: "item", copy: "Escolha uma melhoria passiva." },
    { type: "question", label: "Evento", icon: "?", sprite: "question", copy: "Evento aleatório de risco/recompensa." },
    { type: "move_tutor", label: "Tutor", icon: "M", sprite: "tm", copy: "Desbloqueia habilidade ou move." },
    { type: "stone", label: "Pedra", icon: "E", sprite: "stone", copy: "Força evolução compatível." },
    { type: "legendary", label: "Lendário", icon: "MB", sprite: "masterball", copy: "Uma Master Ball desperta um lendário aleatório." },
    { type: "camp", label: "Centro", icon: "+", sprite: "center", copy: "Cura o time e reduz risco." },
    { type: "train", label: "Treino", icon: "T", sprite: "npc", copy: "Fortalece um membro." }
  ];

  const ARENAS = [
    { id: "rock", name: "Ginasio Rocha Basalto", trainer: "brock", npc: "Brock", floorFrom: 0, floorTo: 8, badge: 1 },
    { id: "water", name: "Ginásio Aquário Prisma", trainer: "misty", npc: "Misty", floorFrom: 8, floorTo: 16, badge: 2 },
    { id: "electric", name: "Ginasio Usina Neon", trainer: "ltsurge", npc: "Lt. Surge", floorFrom: 16, floorTo: 24, badge: 3 },
    { id: "grass", name: "Ginásio Jardim Celadon", trainer: "erika", npc: "Erika", floorFrom: 24, floorTo: 32, badge: 4 },
    { id: "poison", name: "Ginasio Dojo Toxico", trainer: "koga", npc: "Koga", floorFrom: 32, floorTo: 40, badge: 5 },
    { id: "psychic", name: "Ginasio Sala Psiquica", trainer: "sabrina", npc: "Sabrina", floorFrom: 40, floorTo: 48, badge: 6 },
    { id: "fire", name: "Ginasio Caldeira Cinnabar", trainer: "blaine", npc: "Blaine", floorFrom: 48, floorTo: 56, badge: 7 },
    { id: "ground", name: "Ginasio Terra Viridian", trainer: "giovanni", npc: "Giovanni", floorFrom: 56, floorTo: 64, badge: 8 },
    { id: "league", name: "Liga Indigo", trainer: "blue-gen1champion", npc: "Liga", floorFrom: 64, floorTo: 69, badge: 8, levelCap: 100 }
  ];

  const ROUTE_LAYOUT = [
    [{ x: 50, y: 4, special: "start" }],
    [{ x: 36, y: 14 }, { x: 64, y: 14 }],
    [{ x: 25, y: 25 }, { x: 50, y: 25 }, { x: 75, y: 25 }],
    [{ x: 16, y: 37 }, { x: 39, y: 37 }, { x: 61, y: 37 }, { x: 84, y: 37 }],
    [{ x: 22, y: 49 }, { x: 50, y: 49 }, { x: 78, y: 49 }],
    [{ x: 16, y: 61 }, { x: 39, y: 61 }, { x: 61, y: 61 }, { x: 84, y: 61 }],
    [{ x: 25, y: 73 }, { x: 50, y: 73 }, { x: 75, y: 73 }],
    [{ x: 36, y: 86 }, { x: 64, y: 86 }],
    [{ x: 50, y: 97, special: "boss" }]
  ];
  const LEAGUE_LAYOUT = [
    [{ x: 50, y: 4, special: "start" }],
    [{ x: 50, y: 20, special: "boss" }],
    [{ x: 50, y: 38, special: "boss" }],
    [{ x: 50, y: 56, special: "boss" }],
    [{ x: 50, y: 74, special: "boss" }],
    [{ x: 50, y: 92, special: "boss" }]
  ];
  const ROUTE_VERSION = 10;
  const RUN_FLOORS = 69;

  const state = {
    screen: "title",
    floor: 0,
    branch: 0,
    threat: 1,
    team: [],
    items: [],
    map: [],
    battle: null,
    sashUsed: false,
    badges: [],
    offer: [],
    starterChoices: [],
    fallenTeam: [],
    pendingItem: null,
    pendingEvolutions: [],
    pendingEvolutionChoices: [],
    pendingMapFloor: null,
    pendingTowerOrder: [],
    tower: null,
    lastTowerMode: null,
    routeVersion: ROUTE_VERSION,
    autoBattling: false,
    battleSpeed: 2,
    nuzlockeMode: false,
    levelCapEnabled: true
  };

  const $ = (id) => document.getElementById(id);
  const nationalPokemonCache = new Map();
  const dynamicEvolutionCache = new Map();
  let nationalDexIndex = [];
  let nationalDexLoadStarted = false;
  const slug = (name) => String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const normalizedSpriteSlug = (value) => {
    const key = slug(value);
    return SPRITE_SLUG_ALIASES[key] || key;
  };
  const pokemonSpriteSlug = (p) => normalizedSpriteSlug(p?.spriteSlug || baseDexName(p));
  const sprite = (p) => p.spriteSlug
    ? `${p.shiny ? ANIM_SHINY_BASE : ANIM_BASE}${pokemonSpriteSlug(p)}.gif`
    : `${SPRITE_BASE}${p.shiny ? "shiny/" : ""}${p.id}.png`;
  const draftStaticKey = (p) => p?.spriteSlug ? pokemonSpriteSlug(p) : p?.pokemonId || p?.id;
  const draftPreviewSprite = (p) => `${p?.shiny ? LOCAL_DRAFT_STATIC_SHINY_BASE : LOCAL_DRAFT_STATIC_BASE}${draftStaticKey(p)}.png`;
  const staticSprite = (p) => state.battle?.draft
    ? `${p.shiny ? LOCAL_DRAFT_STATIC_SHINY_BASE : LOCAL_DRAFT_STATIC_BASE}${draftStaticKey(p)}.png`
    : `${SPRITE_BASE}${p.shiny ? "shiny/" : ""}${p.id}.png`;
  const mini = (p) => p.spriteSlug
    ? `${p.shiny ? ANIM_SHINY_BASE : ANIM_BASE}${pokemonSpriteSlug(p)}.gif`
    : `${MINI_BASE}${p.shiny ? "shiny/" : ""}${p.id}.png`;
  const localDraftAnimated = (p) => {
    const key = pokemonSpriteSlug(p);
    if (DRAFT_STATIC_ONLY_SPRITES.has(key)) return `${p.shiny ? LOCAL_DRAFT_STATIC_SHINY_BASE : LOCAL_DRAFT_STATIC_BASE}${key}.png`;
    return `${p.shiny ? LOCAL_DRAFT_ANIM_SHINY_BASE : LOCAL_DRAFT_ANIM_BASE}${key}.gif`;
  };
  const animated = (p) => state.battle?.draft
    ? localDraftAnimated(p)
    : `${p.shiny ? ANIM_SHINY_BASE : ANIM_BASE}${pokemonSpriteSlug(p)}.gif`;
  const itemSprite = (item) => `${ITEM_BASE}${item.sprite || item.id}.png`;
  const badgeSprite = (badge) => `${BADGE_BASE}${badge}.png`;
  const trainerSprite = (name) => `${TRAINER_BASE}${name}.png`;
  const trainerBackSprite = (name) => `${TRAINER_BACK_BASE}${name}.png`;
  const PLAYER_TRAINER_SPRITE = "red";
  const playerTrainerSprite = () => PLAYER_TRAINER_SPRITE;
  const playerTrainerBackSprite = () => PLAYER_TRAINER_BACK_SPRITE;
  const tmSprite = (move) => `${ITEM_BASE}tm-${String(move?.type || "normal").toLowerCase()}.png`;
  const pokemonRarityScore = (p) => (p?.hp || 0) + (p?.atk || 0) + (p?.def || 0) + (p?.spd || 0);
  const pokemonBallSprite = (p) => {
    const legendary = p?.legendary || LEGENDARY_POOL.some((mon) => mon.id === p?.id);
    if (legendary) return `${ITEM_BASE}master-ball.png`;
    if (p?.shiny) return `${ITEM_BASE}luxury-ball.png`;
    const score = pokemonRarityScore(p);
    if (score >= 390) return `${ITEM_BASE}ultra-ball.png`;
    if (score >= 310) return `${ITEM_BASE}great-ball.png`;
    if (score >= 260) return `${ITEM_BASE}premier-ball.png`;
    return `${ITEM_BASE}poke-ball.png`;
  };
  const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const DEX_KEY = "oak_rogue_dex_seen";
  const SHINY_DEX_KEY = "oak_rogue_dex_shiny_seen";
  const VARIATION_DEX_KEY = "oak_rogue_dex_variation_seen";
  const UNLOCKS_KEY = "oak_rogue_unlocks";
  let towerBagSuppressClickUntil = 0;
  let towerOrderSuppressClickUntil = 0;
  let towerBagGlobalDropReady = false;
  let battleSpeedCountdownTimer = null;
  let draftSocket = null;
  let draftBattlePlaybackTimer = null;
  let draftBattleStartFallbackTimer = null;
  let draftTurnCountdownTimer = null;
  let draftMatchClockTimer = null;
  let draftAuthWaiter = null;
  let draftHistoryViewRows = null;
  const DRAFT_HISTORY_KEY = "oak_rogue_draft_history_v1";
  const DRAFT_RANK_KEY = "oak_rogue_draft_rank_v1";
  const DRAFT_AUTH_KEY = "oak_rogue_draft_auth_v1";
  const DRAFT_RANKED_PAGE_SIZE = 10;
  const DRAFT_ARENA_EVENTS = [
    { id: "neutral", name: "Arena Neutra", icon: "VS", text: "Sem bônus. Só draft e build." },
    { id: "rain", name: "Chuva", icon: "WA", text: "Water +10%, Fire -5%." },
    { id: "sun", name: "Sol Forte", icon: "FI", text: "Fire +10%, Water -5%." },
    { id: "electric", name: "Campo Eletrico", icon: "EL", text: "Electric +10%." },
    { id: "mist", name: "Névoa", icon: "CR", text: "Críticos reduzidos." },
    { id: "storm", name: "Tempestade", icon: "DF", text: "Rock, Ground e Steel recebem defesa." },
    { id: "garden", name: "Jardim Vivo", icon: "GR", text: "Grass cura ao atacar. Poison pressiona Grass." },
    { id: "toxic", name: "Pântano Tóxico", icon: "PO", text: "Poison +10%. Fairy e Grass recebem +5% dano." },
    { id: "glacier", name: "Glacial", icon: "IC", text: "Ice +12%. Dragon e Flying -6% no dano." },
    { id: "spirit", name: "Ruínas", icon: "GH", text: "Ghost e Psychic +10%. Normal -8%." },
    { id: "drake", name: "Covil Dracônico", icon: "DR", text: "Dragon +12%. Fairy recebe -8% dano." },
    { id: "forge", name: "Forja Steel", icon: "ST", text: "Steel +10%. Fire causa +6% contra Steel." },
    { id: "gravity", name: "Gravidade Pesada", icon: "GV", text: "Flying perde defesa. Ground +8%." },
    { id: "tide", name: "Maré Alta", icon: "MA", text: "Water cura ao vencer. Electric pressiona Water." },
    { id: "gale", name: "Vento Cortante", icon: "VE", text: "Flying e Bug aceleram. Rock pressiona esses tipos." },
    { id: "night", name: "Noite Sombria", icon: "NO", text: "Dark e Ghost +10%. Psychic -6% no dano." },
    { id: "psychic", name: "Campo Psíquico", icon: "PS", text: "Psychic +12%. Velocidade pesa menos." },
    { id: "forest", name: "Floresta Fechada", icon: "FL", text: "Grass e Bug defendem melhor. Fire pressiona." },
    { id: "eruption", name: "Erupção", icon: "ER", text: "Fire +12%. Ice e Grass recebem +6% dano." },
    { id: "crystal", name: "Caverna Cristalina", icon: "CC", text: "Rock e Ice defendem melhor. Steel +6% contra eles." },
  ];
  const DRAFT_RELIC_DETAILS = [
    { id: "focus-band", name: "Faixa Foco", sprite: "focus-band" },
    { id: "shell-bell", name: "Sino Concha", sprite: "shell-bell" },
    { id: "quick-claw", name: "Garra Rápida", sprite: "quick-claw" },
    { id: "scope-lens", name: "Lente Mira", sprite: "scope-lens" },
    { id: "leftovers", name: "Restos", sprite: "leftovers" },
    { id: "type-charm", name: "Amuleto de Tipo", sprite: "expert-belt" },
    { id: "life-orb", name: "Orbe Vida", sprite: "life-orb" },
    { id: "muscle-band", name: "Faixa Músculo", sprite: "muscle-band" },
    { id: "wise-glasses", name: "Óculos Sábios", sprite: "wise-glasses" },
    { id: "choice-scarf", name: "Lenço Escolha", sprite: "choice-scarf" },
    { id: "assault-vest", name: "Colete Assalto", sprite: "assault-vest" },
    { id: "rocky-helmet", name: "Capacete Rochoso", sprite: "rocky-helmet" },
    { id: "sitrus-berry", name: "Fruta Sitrus", sprite: "sitrus-berry" },
    { id: "lum-berry", name: "Fruta Lum", sprite: "lum-berry" },
    { id: "metronome", name: "Metrônomo", sprite: "metronome" },
    { id: "razor-claw", name: "Garra Navalha", sprite: "razor-claw" },
    { id: "king-rock", name: "Pedra Rei", sprite: "kings-rock" },
    { id: "bright-powder", name: "Pó Claro", sprite: "bright-powder" },
    { id: "charcoal", name: "Carvão Vivo", sprite: "charcoal" },
    { id: "mystic-water", name: "Água Mística", sprite: "mystic-water" },
    { id: "magnet", name: "Ímã", sprite: "magnet" },
    { id: "miracle-seed", name: "Semente Milagre", sprite: "miracle-seed" },
    { id: "black-belt", name: "Faixa Preta", sprite: "black-belt" },
    { id: "dragon-fang", name: "Presa Dragão", sprite: "dragon-fang" },
  ];
  let draftState = {
    playerId: "",
    match: null,
    options: [],
    banOptions: [],
    activeBanStep: 0,
    submittedBanStep: 0,
    arena: null,
    buildOptions: [],
    buildSelections: {},
    builds: {},
    battleResult: null,
    lockedArenaId: "",
    rouletteArenaId: "",
    battleStartArenaId: "",
    matchStartedAt: 0,
    matchDurationMs: 0,
    order: {},
    orderTurn: "",
    deadline: 0,
    status: "offline"
  };
  let draftRankedPage = 0;
  const TOWER_DEBUG_UNLOCK_ALL = false;
  const TEMP_AVAILABLE_TOWER_MODES = new Set(["short"]);
  const SHINY_RATE = 0.12;
  const TOWER_MODES = [
    { id: "short", title: "Torre Curta", floors: 50, requirement: "nuzlockeCleared", unlockText: "Vença uma run Nuzlocke para abrir.", reward: "Libera Torre Liga." },
    { id: "league", title: "Torre Liga", floors: 100, requirement: "towerShortCleared", unlockText: "Complete a Torre Curta para abrir.", reward: "Libera Torre Nacional." },
    { id: "national", title: "Torre Nacional", floors: 151, requirement: "towerLeagueCleared", unlockText: "Complete a Torre Liga para abrir.", reward: "Libera Torre Infinita e Nacional Completa." },
    { id: "complete", title: "Nacional Completa", floors: NATIONAL_DEX_LIMIT, requirement: "towerNationalCleared", unlockText: "Complete a Torre Nacional para abrir.", reward: "Desafio extra com a Pokédex completa." },
    { id: "infinite", title: "Torre Infinita", floors: null, requirement: "towerNationalCleared", unlockText: "Complete a Torre Nacional para abrir.", reward: "Recorde salvo por maior andar." }
  ];
  let rogueAudioContext = null;

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function formatNationalName(name) {
    return String(name || "")
      .split("-")
      .map((part) => part ? part[0].toUpperCase() + part.slice(1) : part)
      .join(" ");
  }

  function capitalizeType(type) {
    return String(type || "Normal").replace(/^./, (char) => char.toUpperCase());
  }

  async function loadNationalDexIndex() {
    if (nationalDexLoadStarted) return nationalDexIndex;
    nationalDexLoadStarted = true;
    try {
      const data = await fetchJson(`${API_BASE}/pokemon-species?limit=${NATIONAL_DEX_LIMIT}`);
      nationalDexIndex = (data.results || []).map((entry, index) => {
        const id = Number(entry.url?.match(/\/pokemon-species\/(\d+)\//)?.[1]) || index + 1;
        return { id, name: formatNationalName(entry.name), national: true };
      }).filter((entry) => entry.id <= NATIONAL_DEX_LIMIT);
      nationalDexIndex = [...nationalDexIndex, ...SPECIAL_FORMS];
      renderDexBadge();
      if ($("rogue-dex-modal")?.classList.contains("is-open")) renderRogueDex();
    } catch {
      nationalDexIndex = [...SPECIAL_FORMS];
    }
    return nationalDexIndex;
  }

  async function hydrateNationalPokemon(ref) {
    if (!ref?.id) return null;
    if (ref.specialForm) return { ...ref };
    if (SPECIAL_FORMS_BY_ID.has(ref.id)) return { ...SPECIAL_FORMS_BY_ID.get(ref.id) };
    if (ref.types?.length && Number.isFinite(ref.hp)) return ref;
    if (nationalPokemonCache.has(ref.id)) return { ...nationalPokemonCache.get(ref.id) };
    const data = await fetchJson(`${API_BASE}/pokemon/${ref.id}`);
    const stats = Object.fromEntries((data.stats || []).map((entry) => [entry.stat.name, entry.base_stat]));
    const mon = {
      id: data.id,
      name: formatNationalName(data.name),
      types: (data.types || []).map((entry) => capitalizeType(entry.type.name)),
      hp: stats.hp || 50,
      atk: Math.round(((stats.attack || 50) + (stats["special-attack"] || stats.attack || 50)) / 2),
      def: Math.round(((stats.defense || 50) + (stats["special-defense"] || stats.defense || 50)) / 2),
      spd: stats.speed || 50,
      trait: formatNationalName(data.abilities?.[0]?.ability?.name || "Adaptavel"),
      text: "Registro nacional importado para as rotas do Oak Rogue.",
      national: true
    };
    nationalPokemonCache.set(mon.id, mon);
    return { ...mon };
  }

  function extractApiId(url, resource = "pokemon-species") {
    return Number(String(url || "").match(new RegExp(`/${resource}/(\\d+)/?`))?.[1]) || null;
  }

  function findEvolutionNode(chain, speciesId) {
    if (!chain) return null;
    if (extractApiId(chain.species?.url) === speciesId) return chain;
    for (const next of chain.evolves_to || []) {
      const found = findEvolutionNode(next, speciesId);
      if (found) return found;
    }
    return null;
  }

  async function dynamicEvolutionOptionsFor(p) {
    if (!p?.id) return [];
    const local = EVOLUTIONS[p.id];
    if (local) return local.options?.length ? local.options : [local];
    if (dynamicEvolutionCache.has(p.id)) return dynamicEvolutionCache.get(p.id);
    const promise = (async () => {
      try {
        const species = await fetchJson(`${API_BASE}/pokemon-species/${p.id}`);
        const chainUrl = species.evolution_chain?.url;
        if (!chainUrl) return [];
        const chainData = await fetchJson(chainUrl);
        const node = findEvolutionNode(chainData.chain, p.id);
        const nextSpecies = node?.evolves_to || [];
        const options = [];
        for (const next of nextSpecies) {
          const nextId = extractApiId(next.species?.url);
          if (!nextId) continue;
          const into = await hydrateNationalPokemon({ id: nextId });
          if (into) options.push({ into, stone: "dynamic" });
        }
        return options;
      } catch {
        return [];
      }
    })();
    dynamicEvolutionCache.set(p.id, promise);
    const resolved = await promise;
    dynamicEvolutionCache.set(p.id, resolved);
    return resolved;
  }

  async function teamEvolutionOptions() {
    const entries = await Promise.all(state.team.map(async (p, index) => ({
      index,
      mon: p,
      options: await dynamicEvolutionOptionsFor(p)
    })));
    return entries;
  }

  async function towerEvolutionCandidate() {
    const entries = await teamEvolutionOptions();
    return entries.find(({ mon, options }) => mon?.currentHp > 0 && options?.length);
  }

  async function randomNationalPokemon(excludedIds = new Set()) {
    const index = await loadNationalDexIndex();
    const candidates = index.filter((entry) => !excludedIds.has(entry.id));
    if (!candidates.length) return null;
    const ref = candidates[Math.floor(Math.random() * candidates.length)];
    try {
      return await hydrateNationalPokemon(ref);
    } catch {
      return null;
    }
  }

  function baseDexName(p) {
    return String(p?.name || "").replace(/\s+(Alfa|Prisma|Condutor|Jardim|Toxico|Vulcao|Sismico|Tenente|Elite|Campeao|Ancia)$/i, "");
  }

  function dexCatalog() {
    const entries = nationalDexIndex.length
      ? [...nationalDexIndex, ...STARTERS, ...POOL, ...Object.values(GYM_POOLS).flat(), ...ALL_BOSSES.flatMap((boss) => boss.team)]
      : [...STARTERS, ...POOL, ...Object.values(GYM_POOLS).flat(), ...ALL_BOSSES.flatMap((boss) => boss.team), ...SPECIAL_FORMS];
    const unique = new Map();
    entries.forEach((p) => {
      if (!p?.id || unique.has(p.id)) return;
      const cached = nationalPokemonCache.get(p.id);
      unique.set(p.id, { ...(cached || p), name: baseDexName(cached || p) });
    });
    return [...unique.values()].sort((a, b) => a.id - b.id);
  }

  function dexGeneration(id) {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    return 6;
  }

  function dexKeyFor(tab = "normal") {
    if (tab === "variations") return VARIATION_DEX_KEY;
    return tab === "shiny" ? SHINY_DEX_KEY : DEX_KEY;
  }

  function loadDexSeen(tab = "normal") {
    try {
      return new Set(JSON.parse(localStorage.getItem(dexKeyFor(tab)) || "[]").map(Number).filter(Number.isFinite));
    } catch {
      return new Set();
    }
  }

  function saveDexSeen(seen, tab = "normal") {
    try {
      localStorage.setItem(dexKeyFor(tab), JSON.stringify([...seen].sort((a, b) => a - b)));
    } catch {}
  }

  function registerDexSeen(mon) {
    if (!mon?.id) return;
    const seen = loadDexSeen();
    if (!seen.has(mon.id)) {
      seen.add(mon.id);
      saveDexSeen(seen);
    }
    if (mon.shiny) {
      const shinySeen = loadDexSeen("shiny");
      if (!shinySeen.has(mon.id)) {
        shinySeen.add(mon.id);
        saveDexSeen(shinySeen, "shiny");
      }
    }
    if (mon.specialForm) {
      const variationSeen = loadDexSeen("variations");
      if (!variationSeen.has(mon.id)) {
        variationSeen.add(mon.id);
        saveDexSeen(variationSeen, "variations");
      }
    }
    renderDexBadge();
  }

  function registerDexSeenMany(mons) {
    (mons || []).forEach(registerDexSeen);
  }

  function renderDexBadge() {
    const count = $("route-dex-count");
    if (!count) return;
    const total = dexCatalog().length;
    count.textContent = `${loadDexSeen().size}/${total}`;
  }

  function shinySprite(p) {
    return `${ANIM_SHINY_BASE}${pokemonSpriteSlug(p)}.gif`;
  }

  function maybeMarkShiny(mon) {
    if (mon && Math.random() < SHINY_RATE) mon.shiny = true;
    return mon;
  }

  function renderRogueDex(tab = document.querySelector(".rogue-dex-tabs .is-active")?.dataset.dexTab || "normal") {
    const catalog = tab === "variations" ? [...SPECIAL_FORMS] : dexCatalog();
    const seen = loadDexSeen(tab);
    const genOne = catalog.filter((p) => dexGeneration(p.id) === 1);
    const genSeen = genOne.filter((p) => seen.has(p.id)).length;
    const genPct = genOne.length ? Math.round((genSeen / genOne.length) * 100) : 0;
    const pct = catalog.length ? Math.round((seen.size / catalog.length) * 100) : 0;
    if ($("rogue-dex-generation")) $("rogue-dex-generation").textContent = tab === "variations" ? `Variações - ${seen.size}/${catalog.length}` : `Gen I - ${genPct}%`;
    if ($("rogue-dex-generation-bar")) $("rogue-dex-generation-bar").style.width = `${tab === "variations" ? pct : genPct}%`;
    if ($("rogue-dex-summary")) $("rogue-dex-summary").textContent = tab === "variations" ? `Regionais e formas - ${pct}%` : `Todas as gens - ${pct}%`;
    if ($("rogue-dex-seen-bar")) $("rogue-dex-seen-bar").style.width = `${pct}%`;
    if ($("rogue-dex-grid")) $("rogue-dex-grid").innerHTML = catalog.map((p) => {
      const unlocked = seen.has(p.id);
      const isShinyTab = tab === "shiny";
      const isVariationTab = tab === "variations";
      const art = isShinyTab ? shinySprite(p) : animated(p);
      const fallback = isShinyTab ? mini({ ...p, shiny: true }) : mini(p);
      return `<button class="rogue-dex-card ${unlocked ? "seen" : "unknown"} ${tab === "shiny" ? "shiny-tab" : ""} ${isVariationTab ? "variation-tab" : ""}" type="button" ${unlocked ? `data-dex-mon="${p.id}"` : "disabled"}>
        <span>#${String(p.id).padStart(3, "0")}</span>
        <img src="${art}" alt="${unlocked ? p.name : ""}" onerror="this.src='${fallback}'">
        <strong>${unlocked ? p.name : "à"}</strong>
        ${unlocked ? renderTypeChips(p.types || []) : "<small>Não visto</small>"}
      </button>`;
    }).join("");
  }

  function dexEvolutionLine(p) {
    const chain = [p];
    let current = p;
    let guard = 0;
    while ((EVOLUTIONS[current.id]?.into || EVOLUTIONS[current.id]?.options?.length) && guard < 4) {
      const evo = EVOLUTIONS[current.id];
      if (evo.options?.length) {
        return `<div class="rogue-dex-evo">${[p, ...evo.options.map((option) => option.into)].map((mon, index) => `
          <span>
            <img src="${animated(mon)}" alt="${mon.name}" onerror="this.src='${mini(mon)}'">
            <strong>${baseDexName(mon)}</strong>
            ${index > 0 ? `<small>Escolha</small>` : ""}
          </span>
        `).join("")}</div>`;
      }
      current = { ...evo.into, level: evo.level };
      chain.push(current);
      guard += 1;
    }
    if (chain.length <= 1) return `<small>Sem evolução registrada no Oak Rogue.</small>`;
    return `<div class="rogue-dex-evo">${chain.map((mon, index) => `
      <span>
        <img src="${animated(mon)}" alt="${mon.name}" onerror="this.src='${mini(mon)}'">
        <strong>${baseDexName(mon)}</strong>
        ${index > 0 ? `<small>Lv.${mon.level || "?"}</small>` : ""}
      </span>
    `).join("")}</div>`;
  }

  function dexWhereLine(p) {
    const places = [];
    if (STARTERS.some((entry) => entry.id === p.id)) places.push("Inicial");
    if (POOL.some((entry) => entry.id === p.id)) places.push("Recrutamento/rotas");
    const gyms = Object.entries(GYM_POOLS).filter(([, mons]) => mons.some((entry) => entry.id === p.id)).map(([id]) => id);
    if (gyms.length) places.push(`Ginasio: ${gyms.join(", ")}`);
    if (ALL_BOSSES.some((boss) => boss.team.some((entry) => entry.id === p.id))) places.push("Líder/Liga");
    return places.length ? places.join(" ? ") : "Aparece em eventos especiais da run";
  }

  async function showDexDetail(id) {
    const activeDexTab = document.querySelector(".rogue-dex-tabs .is-active")?.dataset.dexTab || "normal";
    let p = (activeDexTab === "variations" ? SPECIAL_FORMS : dexCatalog()).find((entry) => entry.id === id);
    const detail = $("rogue-dex-detail");
    const backdrop = $("rogue-dex-detail-backdrop");
    if (!p || !detail) return;
    if (!p.types?.length || !Number.isFinite(p.hp)) {
      try {
        p = await hydrateNationalPokemon(p);
      } catch {}
    }
    const isShinyDetail = activeDexTab === "shiny";
    if (isShinyDetail) p = { ...p, shiny: true };
    if (backdrop) backdrop.hidden = false;
    detail.innerHTML = `
      <header class="rogue-dex-detail-title">
        <strong>#${String(p.id).padStart(3, "0")} ${p.name}</strong>
        <button class="rogue-dex-detail-close" type="button" data-dex-detail-close="1">x</button>
      </header>
      <div class="rogue-dex-detail-body">
        <div class="rogue-dex-detail-head">
          <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
          <div>
            <h3>${p.name}</h3>
            <span>#${String(p.id).padStart(3, "0")}</span>
            ${renderTypeChips(p.types || [])}
            <p>${p.text || p.trait || "Registro encontrado durante uma run do Oak Rogue."}</p>
          </div>
        </div>
        ${statBars({ ...p, level: p.level || 5, maxHp: hpMax({ ...p, level: p.level || 5 }), currentHp: hpMax({ ...p, level: p.level || 5 }) }, "dex")}
        <section>
          <h4>Cadeia de evolução</h4>
          ${dexEvolutionLine(p)}
        </section>
        <section>
          <h4>Onde encontrar</h4>
          <small>${dexWhereLine(p)}</small>
        </section>
      </div>
    `;
  }

  function hideDexDetail() {
    const detail = $("rogue-dex-detail");
    const backdrop = $("rogue-dex-detail-backdrop");
    if (backdrop) backdrop.hidden = true;
    if (detail) detail.innerHTML = "";
  }

  function setRogueDexTab(tab) {
    document.querySelectorAll("[data-dex-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.dexTab === tab));
    hideDexDetail();
    renderRogueDex(tab);
  }

  function setRogueDexOpen(open) {
    const modal = $("rogue-dex-modal");
    if (!modal) return;
    modal.setAttribute("aria-hidden", String(!open));
    modal.classList.toggle("is-open", open);
    if (open) renderRogueDex();
  }

  function hasItem(kind) {
    return state.items.some((item) => item.kind === kind);
  }

  function normalizeHeldItems(p) {
    if (!p) return [];
    const savedItems = Array.isArray(p.heldItems) ? p.heldItems : [];
    const legacyItem = p.heldItem ? [p.heldItem] : [];
    const normalized = [...savedItems, ...legacyItem].map(normalizeItem).filter(Boolean);
    const unique = [];
    normalized.forEach((item) => {
      const key = item.id || item.name || item.sprite;
      if (!unique.some((entry) => (entry.id || entry.name || entry.sprite) === key)) unique.push(item);
    });
    return unique.slice(0, MAX_HELD_ITEMS);
  }

  function setHeldItems(p, items) {
    if (!p) return [];
    const normalized = (items || []).map(normalizeItem).filter(Boolean).slice(0, MAX_HELD_ITEMS);
    p.heldItems = normalized;
    p.heldItem = normalized[0] || null;
    return normalized;
  }

  function heldItems(p) {
    return setHeldItems(p, normalizeHeldItems(p));
  }

  function heldItemIds(p) {
    return new Set(heldItems(p).map((item) => item?.id).filter(Boolean));
  }

  function hasHeldItemId(p, id) {
    return heldItemIds(p).has(id);
  }

  function heldItemSummary(p) {
    const equipped = heldItems(p);
    if (!equipped.length) return "sem item";
    return equipped.length === 1 ? equipped[0].name : `${equipped[0].name} +${equipped.length - 1}`;
  }

  function heldItemsDetailText(p) {
    const equipped = heldItems(p);
    return equipped.length ? equipped.map((item) => item.name).join(", ") : "Sem relíquia equipada";
  }

  function heldSlotsMarkup(p) {
    const equipped = heldItems(p);
    if (!equipped.length) {
      return `
        <span class="held-slot empty"><span></span><b>Slot livre</b></span>
        <span class="held-slot empty"><span></span><b>Slot livre</b></span>
      `;
    }
    return Array.from({ length: MAX_HELD_ITEMS }, (_, index) => {
      const item = equipped[index];
      return item
        ? `<span class="held-slot" tabindex="0" data-held-tooltip="${item.name}" data-held-tooltip-text="${itemShortText(item)}"><img class="animated-item" src="${itemSprite(item)}" alt="${item.name}"><b>${item.name}</b></span>`
        : `<span class="held-slot empty"><span></span><b>Slot livre</b></span>`;
    }).join("");
  }

  function towerHeldSlotsMarkup(p, monIndex) {
    const equipped = heldItems(p);
    return Array.from({ length: MAX_HELD_ITEMS }, (_, slotIndex) => {
      const item = equipped[slotIndex];
      return item
        ? `<span class="held-slot tower-held-slot" role="button" tabindex="0" draggable="true" data-held-drop="${monIndex}" data-held-slot="${slotIndex}" data-held-drag-mon="${monIndex}" data-held-drag-slot="${slotIndex}" data-held-tooltip="${item.name}" data-held-tooltip-text="${itemShortText(item)}"><span class="tower-held-item-art"><img class="animated-item" src="${itemSprite(item)}" alt="${item.name}"></span><b>${item.name}</b></span>`
        : `<span class="held-slot tower-held-slot empty" data-held-drop="${monIndex}" data-held-slot="${slotIndex}"><span></span><b>Slot livre</b></span>`;
    }).join("");
  }

  function hasStatItem(p, kind) {
    return heldItems(p).some((item) => item.kind === kind) || hasItem(kind);
  }

  function itemBonusValue(item) {
    const values = {
      leftovers: 0.08,
      "shell-bell": 0.09,
      "sitrus-berry": 0.07,
      "oran-berry": 0.05,
      "black-sludge": 0.1,
      scope: 0.18,
      "scope-lens": 0.16,
      "razor-claw": 0.2,
      "razor-fang": 0.14,
      vest: 0.12,
      "metal-coat": 0.1,
      eviolite: 0.15,
      "rocky-helmet": 0.13,
      "bright-powder": 0.08,
      "light-clay": 0.11,
      "air-balloon": 0.09,
      "safety-goggles": 0.1,
      "power-belt": 0.12,
      "metal-powder": 0.14,
      orb: 0.16,
      "choice-band": 0.18,
      "choice-specs": 0.17,
      "expert-belt": 0.14,
      "type-charm": 0.14,
      "life-orb": 0.2,
      "life-orb-plus": 0.2,
      "power-lens": 0.15,
      charm: 1,
      "lucky-egg": 1,
      "amulet-coin": 1,
      "wide-lens": 1,
      "zoom-lens": 1,
      metronome: 2,
      "king-s-rock": 1,
      "king-rock": 0.12,
      sash: 1,
      "focus-band": 1,
      "red-card": 1,
      "muscle-band": 0.14,
      "wise-glasses": 0.13,
      "black-belt": 0.15,
      "mystic-water": 0.14,
      charcoal: 0.16,
      "miracle-seed": 0.14,
      magnet: 0.15,
      "hard-stone": 0.13,
      "soft-sand": 0.13,
      "poison-barb": 0.14,
      "spell-tag": 0.15,
      "twisted-spoon": 0.16,
      "dragon-fang": 0.17,
      "never-melt-ice": 0.14,
      "silk-scarf": 0.12,
      "power-bracer": 0.16,
      "sharp-beak": 0.13,
      "silver-powder": 0.13,
      "power-weight": 0.12,
      "big-root": 0.14,
      "thick-club": 0.16,
      "healthy-feather": 0.1,
      "quick-claw": 0.15,
      "choice-scarf": 0.18,
      "assault-vest": 0.12,
      "lum-berry": 0.08,
      "power-anklet": 0.14,
      "swift-feather": 0.12
    };
    const fallback = { heal: 0.08, crit: 0.18, atk: 0.14, spd: 0.15, def: 0.12, hp: 0.12, damage: 0.16, synergy: 1, sash: 1 };
    return values[item?.id] ?? fallback[item?.kind] ?? 0;
  }

  function itemBonusText(item) {
    const value = itemBonusValue(item);
    if (["synergy", "sash"].includes(item?.kind)) return value > 1 ? `+${value}` : "1x";
    return `+${Math.round(value * 100)}%`;
  }

  function draftRelicOutgoingModifier(attacker, type) {
    if (!state.battle?.draft || !attacker) return 1;
    const ids = heldItemIds(attacker);
    let modifier = 1;
    if (ids.has("life-orb")) modifier *= 1.2;
    if (ids.has("wise-glasses")) modifier *= 1.08;
    if (ids.has("king-rock")) modifier *= 1.08;
    if (ids.has("quick-claw")) modifier *= 0.95;
    if (ids.has("choice-scarf")) modifier *= 0.92;
    if (ids.has("shell-bell")) modifier *= 0.94;
    if (ids.has("leftovers")) modifier *= 0.94;
    if (ids.has("bright-powder")) modifier *= 0.94;
    if (ids.has("lum-berry")) modifier *= 0.96;
    if (ids.has("type-charm")) modifier *= attacker.types?.includes(type) ? 1.14 : 0.95;
    const typedRelics = {
      charcoal: "Fire",
      "mystic-water": "Water",
      magnet: "Electric",
      "miracle-seed": "Grass",
      "black-belt": "Fighting",
      "dragon-fang": "Dragon",
    };
    Object.entries(typedRelics).forEach(([id, relicType]) => {
      if (!ids.has(id)) return;
      modifier *= type === relicType ? (id === "dragon-fang" ? 1.18 : 1.14) : 0.96;
    });
    if (ids.has("metronome")) {
      const wonRounds = (state.battle.draftRounds || []).filter((round) => {
        const side = round?.left?.pokemon?.id === attacker.id ? round.left : round?.right?.pokemon?.id === attacker.id ? round.right : null;
        return side && round.winnerId === side.playerId;
      }).length;
      modifier *= Math.max(0.94, 0.94 + Math.min(0.24, wonRounds * 0.06));
    }
    return modifier;
  }

  function draftRelicIncomingModifier(defender) {
    if (!state.battle?.draft || !defender) return 1;
    const ids = heldItemIds(defender);
    let modifier = 1;
    if (ids.has("assault-vest")) modifier *= 0.88;
    if (ids.has("rocky-helmet")) modifier *= 0.94;
    if (ids.has("bright-powder")) modifier *= 0.92;
    if (ids.has("lum-berry")) modifier *= 0.94;
    if (ids.has("muscle-band")) modifier *= 1.06;
    if (ids.has("scope-lens")) modifier *= 1.05;
    if (ids.has("razor-claw")) modifier *= 1.08;
    if (ids.has("king-rock")) modifier *= 1.04;
    if (ids.has("wise-glasses")) modifier *= 1.04;
    if (ids.has("magnet")) modifier *= 1.04;
    if (ids.has("black-belt")) modifier *= 1.05;
    return modifier;
  }

  function draftRelicStatModifier(p, stat) {
    if (!state.battle?.draft || !p) return 1;
    const ids = heldItemIds(p);
    let modifier = 1;
    if (stat === "spd") {
      if (ids.has("choice-scarf")) modifier *= 1.18;
      if (ids.has("quick-claw")) modifier *= 1.15;
      if (ids.has("assault-vest")) modifier *= 0.92;
      if (ids.has("muscle-band")) modifier *= 0.94;
      if (ids.has("dragon-fang")) modifier *= 0.94;
    }
    if (stat === "def") {
      if (ids.has("scope-lens")) modifier *= 0.95;
      if (ids.has("razor-claw")) modifier *= 0.92;
      if (ids.has("king-rock")) modifier *= 0.96;
      if (ids.has("wise-glasses")) modifier *= 0.96;
      if (ids.has("muscle-band")) modifier *= 0.94;
    }
    return modifier;
  }

  function draftRelicAfterHit(attacker, defender, amount) {
    if (!state.battle?.draft || !attacker || !defender || amount <= 0) return "";
    const notes = [];
    if (hasHeldItemId(attacker, "life-orb") && attacker.currentHp > 1) {
      const recoil = Math.min(attacker.currentHp - 1, Math.max(1, Math.ceil(attacker.maxHp * 0.06)));
      attacker.currentHp -= recoil;
      draftEnsureStats(attacker).taken += recoil;
      notes.push(` ${attacker.name} sofreu ${recoil} de recuo.`);
    }
    if (hasHeldItemId(defender, "rocky-helmet") && attacker.currentHp > 1) {
      const returnDamage = Math.min(attacker.currentHp - 1, Math.max(1, Math.ceil(attacker.maxHp * 0.04)));
      attacker.currentHp -= returnDamage;
      draftEnsureStats(attacker).taken += returnDamage;
      notes.push(` ${attacker.name} sofreu ${returnDamage} do Capacete.`);
    }
    if (hasHeldItemId(attacker, "miracle-seed") && attacker.currentHp < attacker.maxHp) {
      const beforeHeal = attacker.currentHp;
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + Math.max(1, Math.ceil(amount * 0.04)));
      draftTrackHealing(attacker, beforeHeal);
      const healed = attacker.currentHp - beforeHeal;
      if (healed > 0) notes.push(` ${attacker.name} curou ${healed}.`);
    }
    return notes.join("");
  }

  function bonusItems(kind, p = null) {
    return [...heldItems(p), ...(state.items || [])].filter((item) => item?.kind === kind);
  }

  function statBonus(kind, p = null) {
    return bonusItems(kind, p).reduce((total, item) => total + itemBonusValue(item), 0);
  }

  function strongestBonus(kind, p = null) {
    return Math.max(0, ...bonusItems(kind, p).map(itemBonusValue));
  }

  function countTypes() {
    const counts = {};
    state.team.forEach((p) => {
      if (p.currentHp <= 0) return;
      p.types.forEach((t) => counts[t] = (counts[t] || 0) + 1);
    });
    const synergyBonus = Math.round(statBonus("synergy"));
    if (synergyBonus > 0) Object.keys(counts).forEach((t) => counts[t] += synergyBonus);
    return counts;
  }

  function synergyTier(types) {
    const counts = countTypes();
    return Math.max(0, ...types.map((t) => counts[t] >= 4 ? 2 : counts[t] >= 2 ? 1 : 0));
  }

  function scaledStat(base, level, hp = false) {
    const value = hp
      ? Math.floor(((2 * base * level) / 100) + level + 10)
      : Math.floor(((2 * base * level) / 100) + 5);
    return Math.max(hp ? 10 + level : 5, value);
  }

  function hpMax(p) {
    return Math.round(scaledStat(p.hp || 1, p.level || 1, true) * (1 + statBonus("hp", p)));
  }

  function displayStats(p) {
    return {
      hp: hpMax(p),
      atk: atkVal(p),
      def: defVal(p),
      spd: speedVal(p)
    };
  }

  function currentLevelCap() {
    if (!state.levelCapEnabled) return 100;
    const arena = getArena();
    return arena.levelCap || 12 + arena.badge * 6;
  }

  function levelCapForArena(arena = getArena()) {
    return arena.levelCap || 12 + arena.badge * 6;
  }

  function levelCapForFloor(floor = state.floor || 1) {
    return levelCapForArena(getArenaForFloor(floor));
  }

  function applyLevelCap(p) {
    if (!p || !state.levelCapEnabled) return;
    p.level = Math.min(p.level, currentLevelCap());
  }

  function applyNuzlockeLosses() {
    if (!state.nuzlockeMode) return;
    state.fallenTeam ||= [];
    state.team
      .filter((p) => p.currentHp <= 0 && !isPendingBattleFaint(p) && !state.fallenTeam.some((fallen) => fallen.runId === p.runId))
      .forEach((p) => state.fallenTeam.push({ ...p, currentHp: 0, runId: p.runId }));
    const aliveTeam = state.team.filter((p) => p.currentHp > 0 || isPendingBattleFaint(p));
    if (aliveTeam.length === state.team.length) return;
    state.team = aliveTeam;
    if (!state.battle) return;
    state.battle.playerTeam = aliveTeam;
    state.battle.playerIndex = Math.max(0, aliveTeam.findIndex((p) => p.currentHp > 0));
  }

  function applyTowerLosses() {
    if (!state.tower?.active) return;
    if ((state.floor || 0) > 10) {
      const aliveTeam = state.team.filter((p) => p.currentHp > 0 || isPendingBattleFaint(p));
      if (aliveTeam.length !== state.team.length) {
        state.team = aliveTeam;
      }
    }
    if (!state.battle) return;
    state.battle.playerTeam = state.team;
    state.battle.playerIndex = Math.max(0, state.team.findIndex((p) => p.currentHp > 0));
  }

  function applyBattleLosses() {
    if (state.tower?.active) return applyTowerLosses();
    return applyNuzlockeLosses();
  }

  function xpToNext(p) {
    return 58 + p.level * 14;
  }

  function gainXp(p, amount) {
    if (!p || p.currentHp <= 0) return 0;
    p.xp = (p.xp || 0) + amount;
    let levels = 0;
    while (p.xp >= xpToNext(p) && (!state.levelCapEnabled || p.level < currentLevelCap())) {
      p.xp -= xpToNext(p);
      p.level += 1;
      levels += 1;
    }
    applyLevelCap(p);
    if (state.levelCapEnabled && p.level >= currentLevelCap()) p.xp = Math.min(p.xp, xpToNext(p) - 1);
    if (levels > 0) {
      const oldMax = p.maxHp;
      p.maxHp = hpMax(p);
      p.currentHp = Math.min(p.maxHp, p.currentHp + (p.maxHp - oldMax) + Math.ceil(p.maxHp * 0.08));
      syncMoves(p);
      maybeAutoEvolve(p);
    }
    return levels;
  }

  function awardBattleXp(enemy, boss = false) {
    const aliveTeam = state.team.filter((p) => p.currentHp > 0);
    const recipients = aliveTeam.length ? aliveTeam : state.team;
    const teamAverage = averageTeamLevel();
    const arena = getArenaForFloor(state.floor || 1);
    const mapMultiplier = arena.id === "league" ? 2.1 : 1 + Math.max(0, (arena.badge || 1) - 1) * 0.22;
    const kindMultiplier = (boss ? 3.2 : state.battle?.legendary ? 3.4 : state.battle?.npc ? 1.9 : 1.45) * mapMultiplier;
    const base = 72 + enemy.level * (boss ? 20 : state.battle?.legendary ? 24 : state.battle?.npc ? 14 : 11);
    const total = Math.round(base * kindMultiplier);
    const partyScale = Math.max(1, Math.sqrt(recipients.length));
    const sharedXp = Math.round(total / partyScale);
    let levels = 0;
    recipients.forEach((p) => {
      if (p.currentHp <= 0) return;
      const activeBonus = p === activePlayer() ? Math.round(total * 0.55) : Math.round(sharedXp * 0.18);
      const levelGap = Math.max(0, teamAverage - (p.level || 1));
      const catchUpBonus = Math.round(sharedXp * Math.min(1.1, levelGap * 0.22));
      levels += gainXp(p, sharedXp + activeBonus + catchUpBonus);
    });
    return { xp: total, levels };
  }

  function atkVal(p) {
    return Math.round(scaledStat(p.atk || 1, p.level || 1) * (1 + synergyTier(p.types) * 0.05) * (1 + statBonus("atk", p)));
  }

  function defVal(p) {
    return Math.round(scaledStat(p.def || 1, p.level || 1) * (1 + statBonus("def", p)) * draftRelicStatModifier(p, "def"));
  }

  function speedVal(p) {
    return Math.round(scaledStat(p.spd || 1, p.level || 1) * (1 + statBonus("spd", p)) * draftRelicStatModifier(p, "spd"));
  }

  function legalMovesFor(p) {
    const typeMoves = p.types.flatMap((type) => TYPE_MOVES[type] || []);
    const normalMoves = p.types.includes("Normal") ? TYPE_MOVES.Normal || [] : [];
    const legal = [...typeMoves, ...normalMoves]
      .filter((move) => (move.level || 1) <= (p.level || 1))
      .sort((a, b) => (b.level || 1) - (a.level || 1));
    const unique = [];
    legal.forEach((move) => {
      if (!unique.some((entry) => entry.id === move.id)) unique.push({ ...move });
    });
    return unique.slice(0, 4);
  }

  function syncMoves(p) {
    const legal = legalMovesFor(p);
    const existing = (p.moves || []).filter((move) => legal.some((entry) => entry.id === move.id));
    const merged = [...existing];
    legal.forEach((move) => {
      if (merged.length < 4 && !merged.some((entry) => entry.id === move.id)) merged.push({ ...move });
    });
    p.moves = merged.length ? merged : [{ ...TYPE_MOVES.Normal[0], type: p.types[0] || "Normal" }];
  }

  function canLearnMove(p, move) {
    if (!p || !move) return false;
    if ((p.moves || []).some((entry) => entry.id === move.id)) return false;
    return !!move.type && p.types.includes(move.type);
  }

  function moveCooldown(move) {
    if (Number.isFinite(move?.cooldown)) return move.cooldown;
    if ((move?.cost || 0) >= 2 || (move?.power || 1) >= 1.4) return 3;
    if ((move?.cost || 0) >= 1 || (move?.power || 1) >= 1.12) return 2;
    return 1;
  }

  function cloneMon(base, level) {
    const mon = JSON.parse(JSON.stringify(base));
    mon.runId = mon.runId || uid("mon");
    mon.level = level;
    mon.maxHp = hpMax(mon);
    mon.currentHp = mon.maxHp;
    mon.energy = 2;
    mon.xp = mon.xp || 0;
    syncMoves(mon);
    setHeldItems(mon, normalizeHeldItems(mon));
    return mon;
  }

  function show(screen) {
    const previousScreen = state.screen;
    const useTowerBattleStyle = screen === "battle";
    if (screen !== "battle") {
      applyTowerBattleInlineLayout(false);
    }
    document.querySelectorAll(".rogue-screen").forEach((el) => el.classList.remove("is-active"));
    document.querySelector(".rogue-stage")?.classList.remove("has-choice-modal", "has-battle-modal", "has-victory-modal", "has-evolution-modal", "has-simple-modal", "has-center-modal", "has-tower-event-modal", "has-tower-choice-modal", "has-tower-order-modal", "has-tower-learn-modal", "has-recruit-replace-modal", "has-equip-item-modal", "has-draft-modal");
    $("choice-grid")?.classList.remove("many-evolution-options");
    document.body.classList.toggle("is-rogue-battle-open", screen === "battle");
    document.body.classList.toggle("is-tower-battle", useTowerBattleStyle);
    document.body.classList.toggle("is-tower-run", !!state.tower?.active);
    const keepMapBehindModal = !state.tower?.active && ((screen === "choice" && (previousScreen === "map" || previousScreen === "choice")) || (screen === "battle" && previousScreen === "map"));
    if (keepMapBehindModal) {
      $("screen-map").classList.add("is-active");
      document.querySelector(".rogue-stage")?.classList.add(screen === "choice" ? "has-choice-modal" : "has-battle-modal");
    }
    if (state.tower?.active && screen === "choice") {
      document.querySelector(".rogue-stage")?.classList.add("has-choice-modal", "has-tower-choice-modal");
    }
    $(`screen-${screen}`).classList.add("is-active");
    state.screen = screen;
    if (screen === "battle") {
      applyTowerBattleInlineLayout(useTowerBattleStyle);
      startBattleSpeedCountdown();
    } else {
      stopBattleSpeedCountdown();
    }
    renderHud();
  }

  function save() {
    try {
      localStorage.setItem(saveKeyForMode(runModeForSave(state)), JSON.stringify(state));
    } catch {}
  }

  function defaultUnlocks() {
    return {
      nuzlockeCleared: false,
      towerShortCleared: false,
      towerLeagueCleared: false,
      towerNationalCleared: false,
      towerCompleteCleared: false,
      bestInfiniteFloor: 0
    };
  }

  function loadUnlocks() {
    try {
      return { ...defaultUnlocks(), ...JSON.parse(localStorage.getItem(UNLOCKS_KEY) || "{}") };
    } catch {
      return defaultUnlocks();
    }
  }

  function saveUnlocks(unlocks) {
    try {
      localStorage.setItem(UNLOCKS_KEY, JSON.stringify({ ...defaultUnlocks(), ...unlocks }));
    } catch {}
  }

  function unlockLabelFor(mode, unlocked, unlocks) {
    if (unlocked) return mode.id === "infinite" && unlocks.bestInfiniteFloor ? `Recorde: ${unlocks.bestInfiniteFloor}` : mode.reward;
    return mode.unlockText;
  }

  function isTowerModeUnlocked(mode, unlocks = loadUnlocks()) {
    if (!TEMP_AVAILABLE_TOWER_MODES.has(mode.id)) return false;
    return TOWER_DEBUG_UNLOCK_ALL || mode.id === "short" || !!unlocks[mode.requirement];
  }

  function renderTowerModes() {
    const grid = $("tower-mode-grid");
    const runGrid = document.querySelector(".run-mode-grid");
    if (!grid || !runGrid) return;
    const savedTower = savedRunForMode("tower");
    const savedTowerMode = savedTower?.tower?.mode || null;
    const unlocks = loadUnlocks();
    runGrid.querySelectorAll(".tower-mode-card").forEach((card) => card.remove());
    const towerCards = TOWER_MODES.map((mode) => {
      const unlocked = isTowerModeUnlocked(mode, unlocks);
      const hasSavedRun = savedTowerMode === mode.id;
      const floorLabel = mode.floors ? `${mode.floors}` : "âˆž";
      const towerCardImage = mode.id === "short" ? ` style="--run-card-image: url('assets/oak-rogue-card-tower.png');"` : "";
      return `
        <article class="tower-mode-card tower-card-${mode.id} ${unlocked ? "is-unlocked" : "is-locked"} ${hasSavedRun ? "has-save" : ""}" role="button" tabindex="0" data-tower-mode="${mode.id}"${towerCardImage} ${unlocked ? "" : "aria-disabled=\"true\""}>
          <span class="tower-lock" aria-hidden="true">${hasSavedRun ? "CONT" : unlocked ? "OK" : "X"}</span>
          <strong>${mode.title}</strong>
          <small>${unlockLabelFor(mode, unlocked, unlocks)}</small>
          <em>${floorLabel} andares</em>
          <span class="run-card-actions">
            <button class="${unlocked ? "run-card-primary" : "run-card-secondary"}" type="button" data-tower-mode="${mode.id}">${hasSavedRun ? "Continuar torre" : unlocked ? "Subir torre" : "Bloqueada"}</button>
          </span>
        </article>
      `;
    }).join("");
    grid.insertAdjacentHTML("beforebegin", towerCards);
    setupRunModeCarousel();
    const modeGrid = document.querySelector(".run-mode-grid");
    modeGrid?.scrollTo({ left: 0, behavior: "auto" });
    window.requestAnimationFrame(() => centerNearestRunModeCard());
    updateRunModeCarouselFocus();
  }

  function scrollTowerCarousel(direction) {
    const grid = $("tower-mode-grid");
    const card = grid?.querySelector(".tower-mode-card");
    if (!grid || !card) return;
    const gap = 8;
    grid.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  function updateRunModeCarouselFocus() {
    const grid = document.querySelector(".run-mode-grid");
    if (!grid) return;
    const cards = [...grid.querySelectorAll(".run-mode-card, .tower-mode-card")];
    if (!cards.length) return;
    const gridBox = grid.getBoundingClientRect();
    const center = gridBox.left + gridBox.width / 2;
    let active = cards[0];
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      if (distance < best) {
        best = distance;
        active = card;
      }
    });
    cards.forEach((card) => card.classList.toggle("is-carousel-active", card === active));
  }

  function centerNearestRunModeCard() {
    const grid = document.querySelector(".run-mode-grid");
    if (!grid) return;
    const cards = [...grid.querySelectorAll(".run-mode-card, .tower-mode-card")];
    if (!cards.length) return;
    const gridBox = grid.getBoundingClientRect();
    const center = gridBox.left + gridBox.width / 2;
    let active = cards[0];
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      if (distance < best) {
        best = distance;
        active = card;
      }
    });
    const targetLeft = active.offsetLeft - (grid.clientWidth - active.offsetWidth) / 2;
    grid.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    updateRunModeCarouselFocus();
  }

  function setupRunModeCarousel() {
    const grid = document.querySelector(".run-mode-grid");
    if (!grid || grid.dataset.carouselReady) return;
    grid.dataset.carouselReady = "true";
    let frame = 0;
    let dragging = false;
    let didDrag = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let handledPointerSelection = false;
    const scheduleFocus = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateRunModeCarouselFocus);
    };
    grid.addEventListener("scroll", scheduleFocus, { passive: true });
    window.addEventListener("resize", scheduleFocus);
    grid.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button, input, a")) return;
      dragging = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = grid.scrollLeft;
      grid.classList.add("is-dragging");
      grid.setPointerCapture?.(event.pointerId);
    });
    const moveDrag = (event) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 3) didDrag = true;
      grid.scrollLeft = dragStartScroll - delta;
      event.preventDefault();
    };
    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      grid.classList.remove("is-dragging");
      grid.releasePointerCapture?.(event.pointerId);
      centerNearestRunModeCard();
    };
    grid.addEventListener("pointermove", moveDrag);
    grid.addEventListener("pointerup", stopDrag);
    grid.addEventListener("pointercancel", stopDrag);
    grid.addEventListener("click", (event) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    }, true);
    grid.addEventListener("click", (event) => {
      const towerCard = event.target.closest("[data-tower-mode]");
      if (!towerCard || didDrag) return;
      handleTowerMode(towerCard.dataset.towerMode);
    });
    grid.addEventListener("keydown", (event) => {
      const towerCard = event.target.closest("[data-tower-mode]");
      if (!towerCard || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      handleTowerMode(towerCard.dataset.towerMode);
    });
    scheduleFocus();
  }

  function setupTowerCarousel() {
    const grid = $("tower-mode-grid");
    if (!grid || grid.dataset.carouselReady) return;
    grid.dataset.carouselReady = "true";
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragMoved = false;
    grid.addEventListener("pointerdown", (event) => {
      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartScroll = grid.scrollLeft;
      grid.setPointerCapture?.(event.pointerId);
    });
    grid.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 4) dragMoved = true;
      grid.scrollLeft = dragStartScroll - delta;
    });
    const endDrag = (event) => {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("[data-tower-mode]");
      const shouldOpen = !dragMoved && target && grid.contains(target);
      dragging = false;
      window.setTimeout(() => { dragMoved = false; }, 0);
      if (shouldOpen) handleTowerMode(target.dataset.towerMode);
    };
    grid.addEventListener("pointerup", endDrag);
    grid.addEventListener("pointercancel", endDrag);
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tower-mode]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  function registerNuzlockeClear() {
    if (!state.nuzlockeMode) return;
    const unlocks = loadUnlocks();
    if (unlocks.nuzlockeCleared) return;
    unlocks.nuzlockeCleared = true;
    saveUnlocks(unlocks);
    renderTowerModes();
  }

  function registerTowerClear() {
    if (!state.tower?.active) return;
    const unlocks = loadUnlocks();
    if (state.tower.mode === "short") unlocks.towerShortCleared = true;
    if (state.tower.mode === "league") unlocks.towerLeagueCleared = true;
    if (state.tower.mode === "national") unlocks.towerNationalCleared = true;
    if (state.tower.mode === "complete") unlocks.towerCompleteCleared = true;
    if (state.tower.mode === "infinite") unlocks.bestInfiniteFloor = Math.max(unlocks.bestInfiniteFloor || 0, state.floor || 0);
    saveUnlocks(unlocks);
    renderTowerModes();
  }

  function showTowerLocked(mode) {
    $("choice-kicker").textContent = "Torre bloqueada";
    $("choice-title").textContent = mode.title;
    $("choice-copy").textContent = mode.unlockText;
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="title"><strong>Voltar</strong><small>Retornar ao menu inicial.</small></button>`;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal");
  }

  function showTowerPreview(mode) {
    const savedTower = savedRunForMode("tower");
    if (savedTower?.tower?.mode === mode.id && load("tower")) {
      continueTowerRun();
      return;
    }
    void startTowerRun(mode);
  }

  function selectRunMode(mode) {
    const input = mode === "nuzlocke" ? $("run-nuzlocke") : $("run-normal");
    if (input) input.checked = true;
    updateContinueRunButton();
  }

  function handleTowerMode(id) {
    const mode = TOWER_MODES.find((entry) => entry.id === id);
    if (!mode) return;
    const unlocks = loadUnlocks();
    if (!isTowerModeUnlocked(mode, unlocks)) return showTowerLocked(mode);
    showTowerPreview(mode);
  }

  function draftAuthState() {
    return draftStorageRead(DRAFT_AUTH_KEY, null);
  }

  function draftAuthToken() {
    return draftAuthState()?.token || "";
  }

  function draftAuthUser() {
    return draftAuthState()?.user || null;
  }

  function draftAuthHeader() {
    const token = draftAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function readSupabaseRecoveryToken() {
    const hash = new URLSearchParams(String(location.hash || "").replace(/^#/, ""));
    const query = new URLSearchParams(location.search || "");
    const accessToken = hash.get("access_token") || query.get("access_token") || "";
    const type = hash.get("type") || query.get("type") || hash.get("auth") || "";
    return type === "recovery" || type === "reset" ? accessToken : "";
  }

  async function draftApi(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...draftAuthHeader(),
        ...(options.headers || {}),
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Falha na comunicação online.");
    return payload;
  }

  function waitDraftAuth(socket, timeoutMs = 5000) {
    const token = draftAuthToken();
    if (!token) return Promise.resolve(null);
    return new Promise((resolve) => {
      let done = false;
      const finish = (user) => {
        if (done) return;
        done = true;
        if (draftAuthWaiter?.finish === finish) draftAuthWaiter = null;
        resolve(user || null);
      };
      draftAuthWaiter = { finish };
      socket.emit("auth:token", { token });
      window.setTimeout(() => finish(draftAuthUser()), timeoutMs);
    });
  }

  function saveDraftAuth(payload) {
    draftStorageWrite(DRAFT_AUTH_KEY, payload);
    updateDraftAccountButton();
    if (draftSocket?.connected && payload?.token) draftSocket.emit("auth:token", { token: payload.token });
  }

  function clearDraftAuth() {
    try { localStorage.removeItem(DRAFT_AUTH_KEY); } catch {}
    updateDraftAccountButton();
    if (draftSocket?.connected) draftSocket.emit("auth:token", { token: "" });
  }

  function draftAccountLabel() {
    const user = draftAuthUser();
    return user ? user.nick : "Entrar";
  }

  function updateDraftAccountButton() {
    const label = $("draft-account-shortcut-label");
    if (label) label.textContent = draftAccountLabel();
  }

  function showDraftAuth(mode = "login", message = "") {
    const creating = mode === "register";
    const recovering = mode === "recover";
    const resetting = mode === "reset";
    const title = creating ? "Criar conta" : recovering ? "Recuperar senha" : resetting ? "Nova senha" : "Entrar";
    $("choice-kicker").textContent = "Conta online";
    $("choice-title").textContent = title;
    $("choice-copy").textContent = message || (
      creating
        ? "Crie sua conta com e-mail, senha e nick público."
        : recovering
        ? "Informe o e-mail da conta para receber o link de recuperação."
        : resetting
        ? "Defina uma nova senha para sua conta."
        : "Entre para jogar Contra Player e disputar elo."
    );
    $("choice-grid").innerHTML = `
      <div class="draft-auth-panel">
        <div class="draft-auth-card-head">
          <span class="draft-auth-mark" aria-hidden="true">ID</span>
          <div>
            <strong>${creating ? "Novo treinador" : recovering ? "Recuperação" : resetting ? "Trocar senha" : "Conta do treinador"}</strong>
            <small>${creating ? "Seu nick aparece nas partidas e na tabela." : recovering ? "O Supabase envia um link seguro por e-mail." : resetting ? "Use pelo menos 6 caracteres." : "Use seu e-mail para jogar ranqueada online."}</small>
          </div>
        </div>
        ${resetting ? "" : `
          <label>
            <span>E-mail</span>
            <input id="draft-auth-email" maxlength="120" autocomplete="email" placeholder="voce@email.com">
          </label>
        `}
        ${creating ? `
          <label>
            <span>Nick público</span>
            <input id="draft-auth-nick" maxlength="18" autocomplete="nickname" placeholder="Seu Nick">
          </label>
        ` : ""}
        ${recovering ? "" : `
          <label>
            <span>Senha</span>
            <input id="draft-auth-password" type="password" maxlength="80" autocomplete="${creating || resetting ? "new-password" : "current-password"}" placeholder="${resetting ? "Nova senha" : "Mínimo 6 caracteres"}">
          </label>
        `}
        <div class="draft-rules-actions">
          <button class="draft-menu-action" type="button" data-action="${creating ? "draft-register-submit" : recovering ? "draft-recover-submit" : resetting ? "draft-reset-submit" : "draft-login-submit"}">
            <strong>${creating ? "Criar conta" : recovering ? "Enviar link" : resetting ? "Salvar senha" : "Entrar"}</strong>
            <small>${creating ? "Salvar nick online." : recovering ? "Enviar por e-mail." : resetting ? "Atualizar conta." : "Usar minha conta."}</small>
          </button>
          ${resetting ? "" : `<button class="draft-menu-action" type="button" data-action="${creating ? "draft-login" : "draft-register"}">
            <strong>${creating ? "Já tenho conta" : "Criar conta"}</strong>
            <small>${creating ? "Ir para login." : "Novo jogador."}</small>
          </button>`}
          ${creating || recovering || resetting ? "" : `
            <button class="draft-menu-action" type="button" data-action="draft-recover">
              <strong>Esqueci</strong>
              <small>Recuperar senha.</small>
            </button>
          `}
          <button class="draft-menu-action" type="button" data-action="draft-rules">
            <strong>Voltar</strong>
            <small>Retornar ao Draft.</small>
          </button>
          ${draftAuthUser() ? `
            <button class="draft-menu-action subtle" type="button" data-action="draft-logout">
              <strong>Sair</strong>
              <small>Desconectar conta.</small>
            </button>
          ` : ""}
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  async function submitDraftAuth(mode = "login") {
    const email = $("draft-auth-email")?.value || "";
    const nick = $("draft-auth-nick")?.value || email.split("@")[0] || "";
    const password = $("draft-auth-password")?.value || "";
    try {
      const endpoint = mode === "register"
        ? "/api/auth/register"
        : mode === "recover"
        ? "/api/auth/recover"
        : mode === "reset"
        ? "/api/auth/update-password"
        : "/api/auth/login";
      const payload = await draftApi(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, login: email, nick, password, token: readSupabaseRecoveryToken() }),
      });
      if (mode === "recover") return showDraftAuth("login", payload.message || "Se o e-mail existir, o link de recuperação será enviado.");
      if (mode === "reset") {
        history.replaceState(null, "", location.pathname);
        clearDraftAuth();
        return showDraftAuth("login", payload.message || "Senha alterada. Entre com a nova senha.");
      }
      if (!payload.needsEmailConfirmation && payload.token) saveDraftAuth(payload);
      showDraftBattleIntro("preview");
      $("choice-copy").textContent = payload.needsEmailConfirmation
        ? "Conta criada. Confirme seu e-mail antes de entrar."
        : `Conta conectada como ${payload.user?.nick || "jogador"}.`;
    } catch (error) {
      showDraftAuth(mode, error.message || "Não foi possível entrar.");
    }
  }

  function draftArenaDetailChips(arena) {
    const chips = {
      neutral: ["Sem bônus", "Sem penalidade"],
      rain: ["Water +10%", "Fire -5%"],
      sun: ["Fire +10%", "Water -5%"],
      electric: ["Electric +10%"],
      mist: ["Críticos reduzidos", "Menos explosão de dano"],
      storm: ["Rock/Ground/Steel defendem melhor", "Dano contra eles -8%"],
      garden: ["Grass cura 4% ao atacar", "Poison +10% contra Grass"],
      toxic: ["Poison +10%", "Fairy/Grass recebem +5% dano"],
      glacier: ["Ice +12%", "Dragon/Flying causam -6% dano"],
      spirit: ["Ghost/Psychic +10%", "Normal -8% dano"],
      drake: ["Dragon +12%", "Fairy recebe -8% dano"],
      forge: ["Steel +10%", "Fire +6% contra Steel"],
      gravity: ["Ground +8%", "Flying perde defesa"],
      tide: ["Water cura ao vencer", "Electric +6% contra Water"],
      gale: ["Flying/Bug aceleram", "Rock +8% contra eles"],
      night: ["Dark/Ghost +10%", "Psychic -6% dano"],
      psychic: ["Psychic +12%", "Velocidade pesa menos"],
      forest: ["Grass/Bug defendem melhor", "Fire +8% contra eles"],
      eruption: ["Fire +12%", "Ice/Grass recebem +6% dano"],
      crystal: ["Rock/Ice defendem melhor", "Steel +6% contra eles"],
    };
    return (chips[arena?.id] || [arena?.text || "Efeito especial"]).map((chip) => `<span>${chip}</span>`).join("");
  }

  function draftDetailsMarkup() {
    return `
      <div class="draft-details-panel">
        <section class="draft-detail-section">
          <header>
            <strong>Arenas</strong>
            <small>Bônus e penalidades aplicados na batalha automática.</small>
          </header>
          <div class="draft-detail-grid arenas">
            ${DRAFT_ARENA_EVENTS.map((arena) => `
              <article class="draft-detail-card arena" data-arena="${arena.id}">
                <b>${arena.icon}</b>
                <span>
                  <strong>${arena.name}</strong>
                  <small>${arena.text}</small>
                </span>
                <div>${draftArenaDetailChips(arena)}</div>
              </article>
            `).join("")}
          </div>
        </section>
        <section class="draft-detail-section">
          <header>
            <strong>Relíquias</strong>
            <small>Itens escolhidos na build. Cada Pokémon usa 1 relíquia.</small>
          </header>
          <div class="draft-detail-grid relics">
            ${DRAFT_RELIC_DETAILS.map((relic) => `
              <article class="draft-detail-card relic">
                <img src="${itemSprite(relic)}" alt="" loading="lazy">
                <span>
                  <strong>${relic.name}</strong>
                  <small>${draftRelicBonusSummary(relic)}</small>
                </span>
              </article>
            `).join("")}
          </div>
        </section>
        <div class="draft-rules-actions">
          <button class="draft-menu-action" type="button" data-action="draft-rules-back">
            <strong>Escolher modo</strong>
            <small>Voltar para as opções.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="title">
            <strong>Voltar</strong>
            <small>Retornar aos modos.</small>
          </button>
        </div>
      </div>
    `;
  }

  function showDraftBattleIntro(intent = "preview") {
    draftState.status = intent === "queue" ? "queue" : draftState.status;
    $("choice-kicker").textContent = intent === "queue" ? "Fila ranqueada" : intent === "details" ? "Detalhes" : "Modo online";
    $("choice-title").textContent = intent === "details" ? "Arenas e relíquias" : "Draft Battle";
    $("choice-copy").textContent = intent === "details"
      ? "Veja melhor os efeitos que podem mudar o plano da build antes da batalha."
      : intent === "queue"
      ? "O ponto de entrada do PvP está pronto. A próxima etapa ? ligar o servidor Node.js com Socket.IO para buscar outro jogador em tempo real."
      : "Dois jogadores montam times por draft alternado: cada turno mostra 3 Pokémon em forma final, o jogador escolhe 1, e a batalha automática começa depois das builds.";
    $("choice-grid").innerHTML = intent === "preview" ? `
      <div class="draft-rules-panel">
        <section class="draft-rule-list">
          <article><strong>Draft alternado</strong><small>Cada jogador escolhe 1 de 3 Pokémon por turno até fechar 6 no time.</small></article>
          <article><strong>Formas finais</strong><small>A fila usa Pokémon em estágio final para reduzir desequilíbrio.</small></article>
          <article><strong>Build antes da luta</strong><small>Escolha 2 moves e 1 relíquia para cada Pokémon do seu time.</small></article>
          <article><strong>Ordem de entrada</strong><small>Depois da build, os jogadores definem a ordem da batalha alternadamente.</small></article>
          <article><strong>Batalha automática</strong><small>O motor da Torre resolve a luta. Quem vence continua em campo.</small></article>
          <article><strong>Resultado ranqueado</strong><small>A tela final mostra placar, dano causado, dano recebido e cura.</small></article>
        </section>
        <div class="draft-rules-actions">
          <button class="draft-menu-action" type="button" data-action="draft-ai">
            <strong>Contra IA</strong>
            <small>Casual para jogar agora.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="draft-queue">
            <strong>Contra Player</strong>
            <small>Fila online ranqueada.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="draft-history">
            <strong>Histórico</strong>
            <small>Ver últimas partidas.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="draft-ranked">
            <strong>Ranqueada</strong>
            <small>Ver elo e tabela.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="draft-details">
            <strong>Detalhes</strong>
            <small>Arenas e relíquias.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="title">
            <strong>Voltar</strong>
            <small>Retornar aos modos.</small>
          </button>
        </div>
      </div>
    ` : intent === "rules" ? `
      <div class="draft-rules-panel">
        <section class="draft-rule-list">
          <article><strong>Draft alternado</strong><small>Cada jogador escolhe 1 de 3 Pokémon por turno até fechar 6 no time.</small></article>
          <article><strong>Formas finais</strong><small>A fila usa Pokémon em estágio final para reduzir desequilíbrio.</small></article>
          <article><strong>Build antes da luta</strong><small>Escolha 2 moves e 1 relíquia para cada Pokémon do seu time.</small></article>
          <article><strong>Ordem de entrada</strong><small>Depois da build, os jogadores definem a ordem da batalha alternadamente.</small></article>
          <article><strong>Batalha automática</strong><small>O motor da Torre resolve a luta. Quem vence continua em campo.</small></article>
          <article><strong>Resultado ranqueado</strong><small>A tela final mostra placar, dano causado, dano recebido e cura.</small></article>
        </section>
        <div class="draft-rules-actions">
          <button class="draft-menu-action" type="button" data-action="draft-rules-back">
            <strong>Escolher modo</strong>
            <small>Voltar para as opções.</small>
          </button>
          <button class="draft-menu-action" type="button" data-action="title">
            <strong>Voltar</strong>
            <small>Retornar aos modos.</small>
          </button>
        </div>
      </div>
    ` : intent === "details" ? draftDetailsMarkup() : `
      <div class="draft-menu">
        <button class="draft-menu-action" type="button" data-action="draft-ai">
          <strong>Contra IA</strong>
          <small>Casual para jogar agora.</small>
        </button>
        <button class="draft-menu-action" type="button" data-action="draft-queue">
          <strong>Contra Player</strong>
          <small>Fila online ranqueada.</small>
        </button>
        <button class="draft-menu-action" type="button" data-action="draft-rules">
          <strong>Regras</strong>
          <small>Formas finais, 6 escolhas e batalha automática.</small>
        </button>
        <button class="draft-menu-action" type="button" data-action="draft-history">
          <strong>Histórico</strong>
          <small>Ver últimas partidas.</small>
        </button>
        <button class="draft-menu-action" type="button" data-action="draft-ranked">
          <strong>Ranqueada</strong>
          <small>Ver elo e posição.</small>
        </button>
        <button class="draft-menu-action" type="button" data-action="draft-details">
          <strong>Detalhes</strong>
          <small>Arenas e relíquias.</small>
        </button>
        <button class="draft-menu-action" type="button" data-action="title">
          <strong>Voltar</strong>
          <small>Retornar aos modos.</small>
        </button>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  function draftPlayerName() {
    const user = draftAuthUser();
    if (user?.nick) return user.nick;
    try {
      const saved = localStorage.getItem("oak_rogue_draft_name");
      if (saved) return saved;
    } catch {}
    return `Player ${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function draftTypeText(pokemon) {
    const tags = [];
    if (pokemon?.shiny) tags.push("Shiny");
    if (pokemon?.mythical) tags.push("Mítico");
    else if (pokemon?.legendary) tags.push("Lendário");
    tags.push((pokemon.types || ["Normal"]).join(" / "));
    return tags.join(" - ");
  }

  function draftRelicSprite(relic) {
    return `${ITEM_BASE}${relic?.sprite || relic?.id || "poke-ball"}.png`;
  }

  function draftArenaById(id) {
    return DRAFT_ARENA_EVENTS.find((arena) => arena.id === id) || DRAFT_ARENA_EVENTS[0];
  }

  function resolveDraftArenaId(...candidates) {
    const valid = (id) => id && DRAFT_ARENA_EVENTS.some((arena) => arena.id === id);
    const nonNeutral = (id) => valid(id) && id !== "neutral";
    const candidateIds = candidates.map((entry) => entry?.id || entry).filter(Boolean);
    const priorityIds = [
      draftState.rouletteArenaId,
      draftState.lockedArenaId,
      ...candidateIds,
      draftState.match?.arena?.id,
      draftState.battleStartArenaId,
      draftState.arena?.id,
    ];
    return priorityIds.find(nonNeutral) || priorityIds.find(valid) || "neutral";
  }

  function draftArenaEffectMarkup(arenaInput = null) {
    const arena = draftArenaById(arenaInput?.id || arenaInput || "neutral");
    const effects = {
      neutral: { buff: "Sem bônus", nerf: "Sem penalidade" },
      rain: { buff: "Water +10%", nerf: "Fire -5%" },
      sun: { buff: "Fire +10%", nerf: "Water -5%" },
      electric: { buff: "Electric +10%", nerf: "Sem penalidade" },
      mist: { buff: "Críticos reduzidos", nerf: "Menos explosão de dano" },
      storm: { buff: "Rock, Ground e Steel defendem melhor", nerf: "Dano contra esses tipos -8%" },
      garden: { buff: "Grass cura 4% ao atacar", nerf: "Poison causa +8% em Grass" },
      toxic: { buff: "Poison +10%", nerf: "Fairy e Grass recebem +5% dano" },
      glacier: { buff: "Ice +12%", nerf: "Dragon e Flying -6% no dano" },
      spirit: { buff: "Ghost e Psychic +10%", nerf: "Normal -8%" },
      drake: { buff: "Dragon +12%", nerf: "Fairy recebe -8% dano" },
      forge: { buff: "Steel +10%", nerf: "Fire +6% contra Steel" },
      gravity: { buff: "Ground +8%", nerf: "Flying perde defesa" },
      tide: { buff: "Water cura ao vencer", nerf: "Electric +6% contra Water" },
      gale: { buff: "Flying e Bug aceleram", nerf: "Rock +8% contra eles" },
      night: { buff: "Dark e Ghost +10%", nerf: "Psychic -6% no dano" },
      psychic: { buff: "Psychic +12%", nerf: "Velocidade pesa menos" },
      forest: { buff: "Grass e Bug defendem melhor", nerf: "Fire +8% contra eles" },
      eruption: { buff: "Fire +12%", nerf: "Ice e Grass recebem +6% dano" },
      crystal: { buff: "Rock e Ice defendem melhor", nerf: "Steel +6% contra eles" },
    }[arena.id] || { buff: arena.text || "Evento ativo", nerf: "Sem penalidade" };
    const chips = [effects.buff, effects.nerf].filter((text) => text && text !== "Sem penalidade");
    return `
      <div class="draft-arena-effect">
        <span><b>${arena.name}</b></span>
        <div>
          ${chips.map((text, index) => `<em class="${index === 0 ? "buff" : "nerf"}">${text}</em>`).join("")}
        </div>
      </div>
    `;
  }

  function draftArenaBonusForPokemon(pokemon, arenaInput = null) {
    const arena = draftArenaById(arenaInput?.id || arenaInput || "neutral");
    const types = pokemon?.types || [];
    if (arena.id === "rain") {
      if (types.includes("Water")) return "Arena: Water +10% no dano";
      if (types.includes("Fire")) return "Arena: Fire -5% no dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "sun") {
      if (types.includes("Fire")) return "Arena: Fire +10% no dano";
      if (types.includes("Water")) return "Arena: Water -5% no dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "electric") return types.includes("Electric") ? "Arena: Electric +10% no dano" : "Arena: sem bônus direto";
    if (arena.id === "mist") return "Arena: chance de crítico reduzida";
    if (arena.id === "storm") return types.some((type) => ["Rock", "Ground", "Steel"].includes(type))
      ? "Arena: recebe 8% menos dano"
      : "Arena: sem bônus direto";
    if (arena.id === "garden") {
      if (types.includes("Grass")) return "Arena: cura 4% ao atacar";
      if (types.includes("Poison")) return "Arena: Poison pressiona Grass";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "toxic") {
      if (types.includes("Poison")) return "Arena: Poison +10% no dano";
      if (types.some((type) => ["Fairy", "Grass"].includes(type))) return "Arena: recebe +5% dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "glacier") {
      if (types.includes("Ice")) return "Arena: Ice +12% no dano";
      if (types.some((type) => ["Dragon", "Flying"].includes(type))) return "Arena: dano causado -6%";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "spirit") {
      if (types.some((type) => ["Ghost", "Psychic"].includes(type))) return "Arena: Ghost/Psychic +10%";
      if (types.includes("Normal")) return "Arena: Normal -8% no dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "drake") {
      if (types.includes("Dragon")) return "Arena: Dragon +12% no dano";
      if (types.includes("Fairy")) return "Arena: recebe 8% menos dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "forge") {
      if (types.includes("Steel")) return "Arena: Steel +10% no dano";
      if (types.includes("Fire")) return "Arena: Fire +6% contra Steel";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "gravity") {
      if (types.includes("Ground")) return "Arena: Ground +8% no dano";
      if (types.includes("Flying")) return "Arena: Flying perde defesa";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "tide") {
      if (types.includes("Water")) return "Arena: Water cura ao vencer";
      if (types.includes("Electric")) return "Arena: Electric +6% contra Water";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "gale") {
      if (types.some((type) => ["Flying", "Bug"].includes(type))) return "Arena: velocidade melhor";
      if (types.includes("Rock")) return "Arena: Rock pressiona Flying/Bug";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "night") {
      if (types.some((type) => ["Dark", "Ghost"].includes(type))) return "Arena: Dark/Ghost +10% no dano";
      if (types.includes("Psychic")) return "Arena: Psychic -6% no dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "psychic") return types.includes("Psychic") ? "Arena: Psychic +12% no dano" : "Arena: velocidade pesa menos";
    if (arena.id === "forest") {
      if (types.some((type) => ["Grass", "Bug"].includes(type))) return "Arena: recebe 8% menos dano";
      if (types.includes("Fire")) return "Arena: Fire +8% contra Grass/Bug";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "eruption") {
      if (types.includes("Fire")) return "Arena: Fire +12% no dano";
      if (types.some((type) => ["Ice", "Grass"].includes(type))) return "Arena: recebe +6% dano";
      return "Arena: sem bônus direto";
    }
    if (arena.id === "crystal") {
      if (types.some((type) => ["Rock", "Ice"].includes(type))) return "Arena: recebe 8% menos dano";
      if (types.includes("Steel")) return "Arena: Steel +6% contra Rock/Ice";
      return "Arena: sem bônus direto";
    }
    return arena.id === "neutral" ? "Arena: sem bônus" : arena.text || "Arena ativa";
  }

  function draftSecondsLeft() {
    if (!draftState.deadline) return 0;
    return Math.max(0, Math.ceil((draftState.deadline - Date.now()) / 1000));
  }

  function formatDraftDuration(ms = 0) {
    const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function draftCurrentDurationMs() {
    if (!draftState.matchStartedAt) return draftState.matchDurationMs || 0;
    return Math.max(draftState.matchDurationMs || 0, Date.now() - draftState.matchStartedAt);
  }

  function setDraftMatchStarted(startedAt = Date.now()) {
    draftState.matchStartedAt = startedAt || Date.now();
    draftState.matchDurationMs = 0;
  }

  function stopDraftMatchClock(finalDuration = null) {
    if (draftMatchClockTimer) {
      window.clearInterval(draftMatchClockTimer);
      draftMatchClockTimer = null;
    }
    draftState.matchDurationMs = finalDuration === null ? draftCurrentDurationMs() : Math.max(0, finalDuration || 0);
    draftState.matchStartedAt = 0;
  }

  function updateDraftBattleClock() {
    const node = document.querySelector("[data-draft-match-clock]");
    if (node) node.textContent = formatDraftDuration(draftCurrentDurationMs());
  }

  function startDraftMatchClock() {
    if (draftMatchClockTimer) window.clearInterval(draftMatchClockTimer);
    updateDraftBattleClock();
    draftMatchClockTimer = window.setInterval(updateDraftBattleClock, 1000);
  }

  function draftTimerMarkup(active = false) {
    const seconds = draftSecondsLeft();
    if (!seconds) return "";
    return `
      <div class="draft-turn-bar ${seconds <= 5 ? "is-low" : ""}">
        <span>${active ? "Sua vez" : "Tempo do turno"}</span>
        <strong>${seconds}s</strong>
      </div>
    `;
  }

  function startDraftCountdown(render) {
    if (draftTurnCountdownTimer) window.clearInterval(draftTurnCountdownTimer);
    if (!draftState.deadline) return;
    draftTurnCountdownTimer = window.setInterval(() => {
      if (!draftState.deadline || Date.now() > draftState.deadline + 1000) {
        window.clearInterval(draftTurnCountdownTimer);
        draftTurnCountdownTimer = null;
        return;
      }
      render();
    }, 1000);
  }

  function draftTeamMarkup(player) {
    const team = player?.team || [];
    const slots = Array.from({ length: 6 }, (_, index) => team[index]);
    return `
      <article class="draft-team-card ${player?.id === draftState.playerId ? "is-player" : ""}">
        <strong>${player?.id === draftState.playerId ? "Você" : player?.name || "Rival"}</strong>
        <div class="draft-team-slots">
          ${slots.map((pokemon) => pokemon ? `<span><img src="${draftPreviewSprite(pokemon)}" alt="${pokemon.name}" loading="lazy">${pokemon.name}</span>` : "<span>...</span>").join("")}
        </div>
      </article>
    `;
  }

  function draftBannedPokemon(match = draftState.match) {
    const seen = new Set();
    return Object.values(match?.bans || {})
      .flatMap((entry) => Array.isArray(entry) ? entry : entry ? [entry] : [])
      .filter((pokemon) => {
        if (!pokemon || seen.has(pokemon.id)) return false;
        seen.add(pokemon.id);
        return true;
      });
  }

  function draftBansMarkup(match = draftState.match, compact = false) {
    const bans = draftBannedPokemon(match);
    if (!bans.length) return "";
    const players = match?.players || [];
    const playerGroups = players.map((player) => ({
      player,
      label: player.id === draftState.playerId ? "Você" : player.name || "Rival",
      bans: (match?.bans?.[player.id] || []).filter(Boolean),
    }));
    const groups = playerGroups.some((entry) => entry.bans.length)
      ? playerGroups
      : [{ label: "Bans", bans }];
    const banPill = (pokemon) => `
      <span class="${pokemon.shiny ? "is-shiny" : ""} ${pokemon.legendary ? "is-legendary" : ""}">
        <img src="${draftPreviewSprite(pokemon)}" alt="" loading="lazy">
        <b>${pokemon.name}</b>
        <small>${pokemon.shiny ? "Shiny" : pokemon.mythical ? "Mítico" : pokemon.legendary ? "Lendário" : "Normal"}</small>
      </span>
    `;
    return `
      <div class="draft-bans-strip ${compact ? "compact" : ""}">
        <strong>Bans da partida</strong>
        <div class="draft-bans-groups">
          ${groups.map((group) => `
            <section class="draft-bans-side">
              <em>${group.label}</em>
              <div>${group.bans.map(banPill).join("") || "<i>...</i>"}</div>
            </section>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderDraftBanScreen(message = "") {
    const match = draftState.match;
    if (!match) return showDraftBattleIntro("queue");
    if (draftSocket?.id) draftState.playerId = draftSocket.id;
    const banRound = match.banRound || 1;
    const banStep = match.banStep || Math.ceil(banRound / 2);
    const stage = match.banStage || { id: "normal", title: "Ban normal", copy: "Remova um Pokémon final do draft comum." };
    const hasLocalBanOptions = draftState.banOptions.length > 0;
    const activeBanStep = hasLocalBanOptions ? (draftState.activeBanStep || banStep) : banStep;
    const serverBan = match.bans?.[draftState.playerId]?.[activeBanStep - 1];
    const myBan = serverBan || (hasLocalBanOptions && draftState.submittedBanStep === activeBanStep);
    const isMyTurn = match.banTurn === draftState.playerId || hasLocalBanOptions;
    $("choice-kicker").textContent = `Banimento ${banRound}/12`;
    $("choice-title").textContent = "Draft Battle";
    $("choice-copy").textContent = message || (!isMyTurn
      ? "Aguarde o rival banir. O ban ? alternado, um jogador por vez."
      : myBan
      ? "Ban enviado. Preparando a próxima etapa."
      : `${stage.copy || "Escolha 1 Pokémon para remover do draft desta partida."} Cada jogador bane 1 nesta etapa.`);
    $("choice-grid").innerHTML = `
      <div class="draft-ban">
        <button class="draft-exit-button" type="button" data-action="draft-leave" aria-label="Sair do Draft Battle">Sair</button>
        <div class="draft-top-status">${draftTimerMarkup(isMyTurn && !myBan)}</div>
        ${draftBansMarkup(match, true)}
        <div class="draft-ban-grid ${!isMyTurn || myBan ? "is-locked" : ""}">
          ${draftState.banOptions.map((pokemon) => `
            <button class="choice-button draft-ban-card ${pokemon.shiny ? "is-shiny" : ""} ${pokemon.legendary ? "is-legendary" : ""}" type="button" data-draft-ban="${pokemon.id}" ${!isMyTurn || myBan ? "disabled" : ""}>
              <span class="draft-card-badge">${pokemon.shiny ? "Shiny" : pokemon.mythical ? "Mítico" : pokemon.legendary ? "Lendário" : "Normal"}</span>
              <img src="${draftPreviewSprite(pokemon)}" alt="${pokemon.name}" loading="lazy">
              <strong>${pokemon.name}</strong>
              <small>${draftTypeText(pokemon)}</small>
            </button>
          `).join("") || `
            <article class="draft-wait-card">
              <strong>Turno do rival</strong>
              <small>Quando ele escolher, a próxima etapa de banimento aparece aqui.</small>
            </article>
          `}
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
    startDraftCountdown(() => renderDraftBanScreen(message));
  }

  function renderDraftBattleRoom(message = "") {
    const match = draftState.match;
    if (!match) return showDraftBattleIntro("queue");
    const isMyTurn = match.turn === draftState.playerId;
    const myPickNumber = ((match.teams?.[draftState.playerId] || []).length || 0) + 1;
    const specialDraftLabel = isMyTurn && match.phase === "draft"
      ? myPickNumber === 3 ? "Shiny garantido" : myPickNumber === 6 ? "Lendário final" : ""
      : "";
    $("choice-kicker").textContent = match.phase === "build" ? "Times completos" : isMyTurn ? "Sua escolha" : "Turno do rival";
    $("choice-title").textContent = "Draft Battle";
    $("choice-copy").textContent = message || (match.phase === "build"
      ? "O draft terminou. A próxima etapa será escolher moves e relíquias antes da batalha automática."
      : isMyTurn
      ? "Escolha 1 dos 3 Pokémon para adicionar ao seu time."
      : "Aguarde o rival escolher. O servidor mantém o turno e valida as opções.");
    $("choice-grid").innerHTML = `
      <div class="draft-room">
        <button class="draft-exit-button" type="button" data-action="draft-leave" aria-label="Sair do Draft Battle">Sair</button>
        ${match.phase === "draft" ? `<div class="draft-top-status">${draftTimerMarkup(isMyTurn)}</div>` : ""}
        ${specialDraftLabel ? `<span class="draft-special-banner">${specialDraftLabel}</span>` : ""}
        ${match.phase === "draft" ? draftBansMarkup(match, true) : ""}
        <div class="draft-team-grid">
          ${(match.players || []).map(draftTeamMarkup).join("")}
        </div>
        <div class="draft-option-grid ${isMyTurn && draftState.options.length ? "" : "is-waiting"}">
          ${isMyTurn && draftState.options.length ? draftState.options.map((pokemon) => `
            <button class="choice-button draft-pick-card ${pokemon.shiny ? "is-shiny" : ""} ${pokemon.legendary ? "is-legendary" : ""}" type="button" data-draft-pick="${pokemon.id}">
              ${pokemon.shiny ? `<span class="draft-card-badge">Shiny</span>` : pokemon.mythical ? `<span class="draft-card-badge">Mítico</span>` : pokemon.legendary ? `<span class="draft-card-badge">Lendário</span>` : ""}
              <img src="${draftPreviewSprite(pokemon)}" alt="${pokemon.name}" loading="lazy">
              <strong>${pokemon.name}</strong>
              <small>${draftTypeText(pokemon)}</small>
            </button>
          `).join("") : `
            <div class="draft-waiting-status" aria-live="polite">
              <strong>${match.phase === "build" ? "Build em breve" : "Aguardando"}</strong>
              <small>${match.phase === "build" ? "Moves e relíquias entram na próxima etapa." : "O outro jogador está escolhendo."}</small>
            </div>
          `}
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
    if (match.phase === "draft") startDraftCountdown(() => renderDraftBattleRoom(message));
  }

  function ensureDraftBuildSelections() {
    draftState.buildOptions.forEach((entry) => {
      if (draftState.buildSelections[entry.pokemonId]) return;
      draftState.buildSelections[entry.pokemonId] = {
        moveIds: entry.moves.slice(0, 2).map((move) => move.id),
        relicId: entry.relics[0]?.id || "",
      };
    });
  }

  function draftBuildComplete() {
    return draftState.buildOptions.every((entry) => {
      const selected = draftState.buildSelections[entry.pokemonId];
      return selected?.moveIds?.length === 2 && !!selected.relicId;
    });
  }

  function draftStorageRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function draftStorageWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  const DRAFT_RANK_TIERS = [
    { name: "Treinador", min: 0, next: 300 },
    { name: "Lider de Ginasio", min: 300, next: 700 },
    { name: "Elite Four", min: 700, next: 1200 },
    { name: "Campeao", min: 1200, next: null },
  ];

  function draftRankInfo(points = 0) {
    const safePoints = Math.max(0, Math.round(points || 0));
    const tier = [...DRAFT_RANK_TIERS].reverse().find((entry) => safePoints >= entry.min) || DRAFT_RANK_TIERS[0];
    const needed = tier.next === null ? 0 : Math.max(0, tier.next - safePoints);
    const span = tier.next === null ? 1 : Math.max(1, tier.next - tier.min);
    const progress = tier.next === null ? 100 : Math.max(0, Math.min(100, Math.round(((safePoints - tier.min) / span) * 100)));
    const nextName = tier.next === null ? "Elo máximo" : DRAFT_RANK_TIERS.find((entry) => entry.min === tier.next)?.name || "próximo elo";
    return { ...tier, points: safePoints, needed, progress, nextName };
  }

  function draftRankTier(points = 0) {
    return draftRankInfo(points).name;
  }

  function draftRankState() {
    return { points: 0, wins: 0, losses: 0, streak: 0, ...draftStorageRead(DRAFT_RANK_KEY, {}) };
  }

  function applyDraftRank(won) {
    const rank = draftRankState();
    const streakBonus = won ? Math.min(10, Math.max(0, rank.streak) * 2) : 0;
    const delta = won ? 25 + streakBonus : -15;
    rank.points = Math.max(0, Math.round((rank.points || 0) + delta));
    rank.wins = Math.max(0, (rank.wins || 0) + (won ? 1 : 0));
    rank.losses = Math.max(0, (rank.losses || 0) + (won ? 0 : 1));
    rank.streak = won ? Math.max(0, rank.streak || 0) + 1 : 0;
    rank.tier = draftRankTier(rank.points);
    draftStorageWrite(DRAFT_RANK_KEY, rank);
    return { ...rank, delta };
  }

  function draftAllStats(result) {
    return Object.entries(result?.stats || {}).flatMap(([playerId, stats]) => (stats || []).map((entry) => ({ ...entry, playerId })));
  }

  function draftFindMvp(result) {
    return draftAllStats(result)
      .map((entry) => ({ ...entry, mvpScore: (entry.dealt || 0) + (entry.healed || 0) * 0.7 - (entry.taken || 0) * 0.12 }))
      .sort((a, b) => b.mvpScore - a.mvpScore)[0] || null;
  }

  function draftSaveHistory(result, match, rank) {
    if (!result || result.historySaved) return;
    const me = match?.players?.find((player) => player.id === draftState.playerId);
    const rival = match?.players?.find((player) => player.id !== draftState.playerId);
    const mvp = result.mvp || draftFindMvp(result);
    const cleanPlayer = (player) => player ? {
      id: player.id,
      name: player.name,
      team: (player.team || []).map((pokemon) => ({
        id: pokemon.id,
        pokemonId: pokemon.pokemonId,
        spriteSlug: pokemon.spriteSlug,
        name: pokemon.name,
        types: pokemon.types,
        shiny: !!pokemon.shiny,
        legendary: !!pokemon.legendary,
        mythical: !!pokemon.mythical,
      })),
      bans: (player.bans || []).map((pokemon) => ({
        id: pokemon.id,
        pokemonId: pokemon.pokemonId,
        spriteSlug: pokemon.spriteSlug,
        name: pokemon.name,
        types: pokemon.types,
        shiny: !!pokemon.shiny,
        legendary: !!pokemon.legendary,
        mythical: !!pokemon.mythical,
      })),
    } : null;
    const entry = {
      id: `${match?.id || "draft"}-${Date.now()}`,
      date: Date.now(),
      casual: !!result.casual,
      won: result.winnerId === draftState.playerId,
      score: {
        me: result.score?.[draftState.playerId] || 0,
        rival: result.score?.[rival?.id] || 0,
      },
      rival: rival?.name || "Rival",
      mvp: mvp ? { name: mvp.name, sprite: draftPreviewSprite(mvp), dealt: mvp.dealt, healed: mvp.healed, taken: mvp.taken } : null,
      rankDelta: rank?.delta || 0,
      points: rank?.points || 0,
      durationMs: result.durationMs || draftState.matchDurationMs || 0,
      team: (me?.team || []).map((pokemon) => pokemon.name),
      playerId: draftState.playerId,
      result: {
        winnerId: result.winnerId,
        score: result.score,
        stats: result.stats,
        mvp,
        rank,
        arena: result.arena,
        arenaId: result.arenaId,
        durationMs: result.durationMs || draftState.matchDurationMs || 0,
      },
      match: {
        id: match?.id || "",
        players: [cleanPlayer(me), cleanPlayer(rival)].filter(Boolean),
        bans: match?.bans || {},
      },
    };
    const history = draftStorageRead(DRAFT_HISTORY_KEY, []);
    draftStorageWrite(DRAFT_HISTORY_KEY, [entry, ...history].slice(0, 10));
    result.historySaved = true;
  }

  function draftBuildText() {
    const me = draftState.match?.players?.find((player) => player.id === draftState.playerId);
    if (!me) return "Draft Battle";
    const lines = [`Draft Battle - ${me.name || "Você"}`];
    (me.team || []).forEach((pokemon) => {
      const selected = draftState.buildSelections[pokemon.id] || {};
      const entry = draftState.buildOptions.find((option) => option.pokemonId === pokemon.id);
      const moves = (entry?.moves || []).filter((move) => (selected.moveIds || []).includes(move.id)).map((move) => move.name).join(", ");
      const relic = (entry?.relics || []).find((item) => item.id === selected.relicId);
      lines.push(`${pokemon.name}: ${moves || "moves padrão"} | ${relic?.name || "relíquia padrão"}`);
    });
    return lines.join("\n");
  }

  function draftMoveTooltip(pokemon, move, selected) {
    const typeHint = (pokemon.types || ["Normal"]).join(" / ");
    return `${selected ? "Selecionado." : "Clique para escolher."} Golpe da build. Escolha 2 moves para este Pokémon. Tipo do Pokémon: ${typeHint}.`;
  }

  function draftRelicBonusSummary(relic) {
    const summaries = {
      "focus-band": "Sobrevive a 1 golpe fatal. Bônus de dano: 0%.",
      "shell-bell": "Cura +9% do HP máximo ao agir. Dano final -6%.",
      "quick-claw": "Velocidade +15%. Dano final -5%.",
      "scope-lens": "Crítico +16%. Dano recebido +5%.",
      leftovers: "Cura +8% do HP máximo ao agir. Dano final -6%.",
      "type-charm": "STAB +14%. Golpes fora do tipo -5%.",
      "life-orb": "Dano final +20%. Recuo de 6% do HP máximo.",
      "muscle-band": "Ataque +14%. Defesa -6% e velocidade -6%.",
      "wise-glasses": "Dano final +8%. Defesa -4%.",
      "choice-scarf": "Velocidade +18%. Dano final -8%.",
      "assault-vest": "Dano recebido -12%. Velocidade -8%.",
      "rocky-helmet": "Dano recebido -6%. Atacante sofre 4% de recuo.",
      "sitrus-berry": "Cura +7% do HP máximo ao agir. Sem penalidade.",
      "lum-berry": "Dano recebido -6%. Dano final -4%.",
      metronome: "Começa com dano -6%. Ganha +6% por duelo vencido, até +18%.",
      "razor-claw": "Crítico +20%. Dano recebido +8%.",
      "king-rock": "Dano final +8%. Defesa -4%.",
      "bright-powder": "Dano recebido -8%. Dano final -6%.",
      charcoal: "Fire +14%. Golpes fora do tipo -4%.",
      "mystic-water": "Water +14%. Golpes fora do tipo -4%.",
      magnet: "Electric +14%. Defesa -4%.",
      "miracle-seed": "Grass +14%. Cura 4% do dano causado. Fora do tipo -4%.",
      "black-belt": "Fighting +14%. Dano recebido +5%.",
      "dragon-fang": "Dragon +18%. Velocidade -6%.",
    };
    return summaries[relic?.id] || relic?.text || "Bônus especial de relíquia.";
  }

  function renderDraftBuildScreen(message = "") {
    const match = draftState.match;
    const me = match?.players?.find((player) => player.id === draftState.playerId);
    const rival = match?.players?.find((player) => player.id !== draftState.playerId);
    if (!match || !me) return showDraftBattleIntro("queue");
    const buildSent = !!me.buildReady;
    ensureDraftBuildSelections();
    $("choice-kicker").textContent = "Preparação";
    $("choice-title").textContent = "Moves e relíquias";
    $("choice-copy").textContent = message || (buildSent ? "Sua build foi enviada. Aguardando o rival confirmar." : "Você está editando apenas o seu time.");
    $("choice-grid").innerHTML = `
      <div class="draft-build">
        <button class="draft-exit-button" type="button" data-action="draft-leave" aria-label="Sair do Draft Battle">Sair</button>
        <div class="draft-build-toolbar">
          <span><strong>Seu time</strong>
          <small>${buildSent ? "Build bloqueada após confirmação." : "Escolha 2 moves e 1 relíquia por Pokémon."}</small>
          </span>
          ${draftTimerMarkup(false)}
        </div>
        <div class="draft-build-rival-preview">
          <strong>Time rival</strong>
          <div>
            ${(rival?.team || []).map((pokemon) => `<span><img src="${draftPreviewSprite(pokemon)}" alt="" loading="lazy">${pokemon.name}</span>`).join("")}
          </div>
        </div>
        <div class="draft-build-list">
          ${me.team.map((pokemon) => {
            const entry = draftState.buildOptions.find((option) => option.pokemonId === pokemon.id);
            const selected = draftState.buildSelections[pokemon.id] || { moveIds: [], relicId: "" };
            if (!entry) return "";
            return `
              <article class="draft-build-card">
                <header>
                  <img src="${draftPreviewSprite(pokemon)}" alt="${pokemon.name}" loading="lazy">
                  <span><strong>${pokemon.name}</strong><small>${draftTypeText(pokemon)}</small></span>
                </header>
                <div class="draft-build-section moves">
                  <b>Moves</b>
                  <div class="draft-build-pills">
                    ${entry.moves.map((move) => `
                      <button class="${selected.moveIds.includes(move.id) ? "is-picked" : ""}" type="button" data-held-tooltip="${move.name}" data-held-tooltip-text="${draftMoveTooltip(pokemon, move, selected.moveIds.includes(move.id))}" data-draft-build-move="${pokemon.id}:${move.id}" ${buildSent ? "disabled" : ""}>
                        ${move.name}
                      </button>
                    `).join("")}
                  </div>
                </div>
                <div class="draft-build-section relics">
                  <b>Relíquia</b>
                  <div class="draft-build-pills relics">
                    ${entry.relics.map((relic) => `
                      <button class="${selected.relicId === relic.id ? "is-picked" : ""}" type="button" data-held-tooltip="${relic.name}" data-held-tooltip-text="${draftRelicBonusSummary(relic)}" title="${draftRelicBonusSummary(relic)}" data-draft-build-relic="${pokemon.id}:${relic.id}" ${buildSent ? "disabled" : ""}>
                        <img src="${draftRelicSprite(relic)}" alt="" loading="lazy">
                        <span><b>${relic.name}</b></span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              </article>
            `;
          }).join("")}
        </div>
        <div class="draft-build-footer">
          <span>${buildSent ? "Build enviada. Aguardando o rival." : draftBuildComplete() ? "Build pronta para envio." : "Escolha 2 moves e 1 relíquia por Pokémon."}</span>
          <button class="draft-confirm-button" type="button" data-action="draft-submit-build" ${!buildSent && draftBuildComplete() ? "" : "disabled"}>${buildSent ? "Confirmada" : "Confirmar build"}</button>
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  function renderDraftBattleResult() {
    clearTimeout(draftBattlePlaybackTimer);
    const match = draftState.match;
    const result = draftState.battleResult;
    if (!match || !result) return renderDraftBuildScreen("Aguardando resultado da batalha.");
    const won = result.winnerId === draftState.playerId;
    const me = match.players.find((player) => player.id === draftState.playerId);
    const rival = match.players.find((player) => player.id !== draftState.playerId);
    const fallbackStats = (player) => (player?.team || []).map((pokemon) => ({
      ...pokemon,
      dealt: 0,
      taken: 0,
      healed: 0,
      defeated: false,
    }));
    const myStats = result.stats?.[draftState.playerId]?.length ? result.stats[draftState.playerId] : fallbackStats(me);
    const rivalStats = result.stats?.[rival?.id]?.length ? result.stats[rival.id] : fallbackStats(rival);
    const mvp = result.mvp || draftFindMvp(result);
    const rank = result.rank || draftRankState();
    const arena = draftArenaById(result.arena?.id || draftState.arena?.id || "neutral");
    const durationLabel = formatDraftDuration(result.durationMs || draftState.matchDurationMs || 0);
    const statRows = (stats, winnerId) => stats.map((pokemon) => `
      <article class="${pokemon.defeated ? "is-fainted" : ""}">
        <img src="${draftPreviewSprite(pokemon)}" alt="">
        <strong>${pokemon.name}</strong>
        <span><b>${pokemon.dealt}</b><small>Dano causado</small></span>
        <span><b>${pokemon.taken}</b><small>Dano recebido</small></span>
        <span><b>${pokemon.healed}</b><small>Cura</small></span>
      </article>
    `).join("");
    $("choice-kicker").textContent = result.casual ? "Casual" : (won ? "Vitória" : "Derrota");
    $("choice-title").textContent = "Batalha automática";
    $("choice-copy").textContent = won ? "Sua build venceu o duelo automático." : "A build rival levou a melhor no duelo automático.";
    $("choice-grid").innerHTML = `
      <div class="draft-result">
        <div class="draft-result-hero">
          <div class="draft-result-duration"><span>Duração</span><strong>${durationLabel}</strong></div>
          <span>${won ? "Vitória" : "Derrota"} - ${result.casual ? "Contra IA" : `${rank.tier || draftRankTier(rank.points)} ${rank.delta ? `${rank.delta > 0 ? "+" : ""}${rank.delta}` : ""}`}</span>
          <p>${arena.name}: ${arena.text}</p>
        </div>
        ${draftBansMarkup(match, true)}
        <div class="draft-result-score">
          <article class="${won ? "is-winner" : ""}">
            <strong>Você</strong>
            <b>${result.score?.[draftState.playerId] || 0}</b>
          </article>
          <span>VS</span>
          <article class="${!won ? "is-winner" : ""}">
            <strong>${rival?.name || "Rival"}</strong>
            <b>${result.score?.[rival?.id] || 0}</b>
          </article>
        </div>
        ${mvp ? `
          <div class="draft-mvp-card">
            <span>MVP</span>
            <img src="${draftPreviewSprite(mvp)}" alt="">
            <strong>${mvp.name}</strong>
            <small>${mvp.dealt || 0} causado / ${mvp.taken || 0} recebido / ${mvp.healed || 0} cura</small>
          </div>
        ` : ""}
        <div class="draft-result-rounds draft-result-stat-board">
          <section class="draft-result-stats">
            <header><strong>Você</strong><span><b>Causado</b><b>Recebido</b><b>Cura</b></span></header>
            ${statRows(myStats)}
          </section>
          <section class="draft-result-stats">
            <header><strong>${rival?.name || "Rival"}</strong><span><b>Causado</b><b>Recebido</b><b>Cura</b></span></header>
            ${statRows(rivalStats)}
          </section>
        </div>
        <div class="draft-build-footer">
          <span>${result.casual ? "Partida casual não altera seu elo." : won ? "Pontos ranqueados entram na próxima etapa." : "Ajuste draft e build na próxima fila."}</span>
          <div class="draft-result-actions">
            <button class="draft-secondary-button" type="button" data-action="draft-copy-build">Copiar build</button>
            <button class="draft-secondary-button" type="button" data-action="draft-history">Histórico</button>
            ${result.casual ? "" : `<button class="draft-secondary-button" type="button" data-action="draft-rematch">Revanche</button>`}
            <button class="draft-confirm-button" type="button" data-action="${result.casual ? "draft-ai" : "draft-queue"}">${result.casual ? "Jogar de novo" : "Nova fila"}</button>
          </div>
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  async function showDraftHistory() {
    let history = draftStorageRead(DRAFT_HISTORY_KEY, []);
    let rank = draftRankState();
    let sourceLabel = history.length ? "Clique em uma partida para abrir o resultado final salvo." : "Nenhuma partida salva ainda.";
    if (draftAuthToken()) {
      try {
        const [mePayload, historyPayload] = await Promise.all([
          draftApi("/api/me"),
          draftApi("/api/history"),
        ]);
        const user = mePayload.user || {};
        rank = {
          points: user.points || 0,
          wins: user.wins || 0,
          losses: user.losses || 0,
          streak: user.streak || 0,
          tier: draftRankTier(user.points || 0),
        };
        history = (Array.isArray(historyPayload.rows) ? historyPayload.rows : []).map((entry) => ({
          id: entry.id,
          date: entry.created_at,
          casual: false,
          won: !!entry.won,
          score: { me: entry.score_me || 0, rival: entry.score_rival || 0 },
          rival: entry.rival_nick || "Rival",
          rankDelta: entry.rank_delta || 0,
          points: entry.points_after || 0,
          durationMs: entry.duration_ms || 0,
          arena: entry.arena_name || "",
          onlineSummary: true,
        }));
        sourceLabel = history.length ? "Histórico ranqueado salvo no servidor." : "Nenhuma partida ranqueada salva no servidor.";
      } catch (error) {
        sourceLabel = `${error.message || "Histórico online indisponível."} Mostrando histórico local deste navegador.`;
      }
    }
    draftHistoryViewRows = history;
    const formatDate = (date) => {
      if (!date) return "sem data";
      try {
        return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
      } catch (_) {
        return "sem data";
      }
    };
    $("choice-kicker").textContent = "Histórico";
    $("choice-title").textContent = "Draft Battle";
    $("choice-copy").textContent = sourceLabel;
    $("choice-grid").innerHTML = `
      <div class="draft-history-panel">
        <div class="draft-history-summary">
          <article><span>Rank</span><strong>${rank.tier || draftRankTier(rank.points)}</strong><small>${rank.points || 0} pts</small></article>
          <article><span>Vitórias</span><strong>${rank.wins || 0}</strong><small>Sequência ${rank.streak || 0}</small></article>
          <article><span>Derrotas</span><strong>${rank.losses || 0}</strong><small>${history.length} salvas</small></article>
        </div>
        <div class="draft-history-list">
          ${history.map((entry, index) => `
            <button class="draft-history-row" type="button" data-draft-history-detail="${index}">
              <span class="${entry.won ? "is-win" : "is-loss"}">${entry.won ? "Vitória" : "Derrota"}</span>
              <strong>${entry.score?.me || 0} x ${entry.score?.rival || 0} vs ${entry.rival || "Rival"}</strong>
              <small>${formatDate(entry.date)}</small>
              <p>${formatDraftDuration(entry.durationMs || entry.result?.durationMs || 0)} - ${entry.casual ? "Casual" : entry.onlineSummary ? `${entry.arena || "Arena"} / ${entry.rankDelta > 0 ? "+" : ""}${entry.rankDelta || 0} pts` : `MVP ${entry.mvp?.name || "-"} / ${entry.rankDelta > 0 ? "+" : ""}${entry.rankDelta || 0} pts`}</p>
            </button>
          `).join("") || "<p>Jogue uma partida para preencher o histórico.</p>"}
        </div>
        <div class="draft-build-footer">
          <span>${rank.tier || draftRankTier(rank.points)} - ${rank.points || 0} pts</span>
          <button class="draft-confirm-button" type="button" data-action="draft-rules">Voltar</button>
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  function showDraftHistoryDetail(index) {
    const history = draftHistoryViewRows || draftStorageRead(DRAFT_HISTORY_KEY, []);
    const entry = history[index];
    if (!entry) return showDraftHistory();
    const previous = {
      playerId: draftState.playerId,
      match: draftState.match,
      battleResult: draftState.battleResult,
      arena: draftState.arena,
    };
    if (entry.match && entry.result && entry.playerId) {
      draftState.playerId = entry.playerId;
      draftState.match = entry.match;
      draftState.battleResult = entry.result;
      draftState.arena = draftArenaById(entry.result.arena?.id || entry.result.arenaId || "neutral");
      renderDraftBattleResult();
      draftState.playerId = previous.playerId;
      draftState.match = previous.match;
      draftState.battleResult = previous.battleResult;
      draftState.arena = previous.arena;
      const footer = document.querySelector(".draft-result .draft-build-footer");
      if (footer) {
        footer.innerHTML = `
          <span>Resultado salvo em ${new Date(entry.date || Date.now()).toLocaleString("pt-BR")} ? Duração ${formatDraftDuration(entry.durationMs || entry.result?.durationMs || 0)}.</span>
          <div class="draft-result-actions">
            <button class="draft-secondary-button" type="button" data-action="draft-history">Voltar ao historico</button>
            <button class="draft-confirm-button" type="button" data-action="draft-queue">Nova fila</button>
          </div>
        `;
      }
      $("choice-kicker").textContent = "Histórico";
      $("choice-copy").textContent = "Resultado final salvo desta partida.";
      return;
    }
    $("choice-kicker").textContent = entry.won ? "Vitória salva" : "Derrota salva";
    $("choice-title").textContent = `${entry.score?.me || 0} x ${entry.score?.rival || 0}`;
    $("choice-copy").textContent = entry.onlineSummary
      ? "Resumo ranqueado salvo no servidor. Os detalhes completos ficam disponíveis nas partidas salvas neste navegador."
      : "Esta partida foi salva antes do histórico detalhado existir.";
    $("choice-grid").innerHTML = `
      <div class="draft-history-panel draft-history-detail">
        <div class="draft-history-summary">
          <article><span>Rival</span><strong>${entry.rival || "Rival"}</strong><small>${entry.won ? "Vitória" : "Derrota"}</small></article>
          <article><span>${entry.onlineSummary ? "Arena" : "MVP"}</span><strong>${entry.onlineSummary ? entry.arena || "-" : entry.mvp?.name || "-"}</strong><small>${entry.onlineSummary ? `${entry.rankDelta > 0 ? "+" : ""}${entry.rankDelta || 0} pts` : `${entry.mvp?.dealt || 0} dano`}</small></article>
          <article><span>Duração</span><strong>${formatDraftDuration(entry.durationMs || 0)}</strong><small>${entry.points || 0} pts</small></article>
        </div>
        <div class="draft-history-old-team">
          ${(entry.team || []).map((name) => `<span>${name}</span>`).join("") || "<p>Time não registrado.</p>"}
        </div>
        <div class="draft-build-footer">
          <span>${entry.onlineSummary ? "Resumo online da partida ranqueada." : "Resumo antigo do histórico."}</span>
          <button class="draft-confirm-button" type="button" data-action="draft-history">Voltar</button>
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  function draftRankedLeaderboard() {
    const rank = draftRankState();
    const history = draftStorageRead(DRAFT_HISTORY_KEY, []);
    const rivals = new Map();
    history.filter((entry) => !entry.casual).forEach((entry) => {
      const name = entry.rival || "Rival";
      const current = rivals.get(name) || { name, points: 100, wins: 0, losses: 0, played: 0 };
      current.played += 1;
      if (entry.won) {
        current.losses += 1;
        current.points = Math.max(0, current.points - 12);
      } else {
        current.wins += 1;
        current.points += 25;
      }
      rivals.set(name, current);
    });
    const me = {
      name: "Você",
      points: rank.points || 0,
      wins: rank.wins || 0,
      losses: rank.losses || 0,
      played: (rank.wins || 0) + (rank.losses || 0),
      me: true,
    };
    return [me, ...rivals.values()]
      .map((entry) => ({ ...entry, tier: draftRankTier(entry.points || 0) }))
      .sort((a, b) => (b.points || 0) - (a.points || 0) || (b.wins || 0) - (a.wins || 0));
  }

  async function showDraftRanked() {
    let rank = draftRankState();
    let rows = draftRankedLeaderboard();
    let sourceLabel = "Tabela local baseada nas partidas salvas neste navegador.";
    let countLabel = rows.length > 1 ? `${rows.length} jogadores na tabela local.` : "Jogue partidas para preencher a tabela.";
    const authUser = draftAuthUser();
    if (draftAuthToken()) {
      try {
        const payload = await draftApi("/api/ranked");
        const serverRows = Array.isArray(payload.rows) ? payload.rows : [];
        rows = serverRows.map((entry) => ({
          id: entry.id,
          name: entry.nick || entry.login || "Jogador",
          points: entry.points || 0,
          wins: entry.wins || 0,
          losses: entry.losses || 0,
          streak: entry.streak || 0,
          played: (entry.wins || 0) + (entry.losses || 0),
          me: authUser?.id && Number(entry.id) === Number(authUser.id),
          tier: draftRankTier(entry.points || 0),
        }));
        const serverMe = rows.find((entry) => entry.me);
        if (serverMe) {
          rank = {
            points: serverMe.points || 0,
            wins: serverMe.wins || 0,
            losses: serverMe.losses || 0,
            streak: serverMe.streak || 0,
            tier: serverMe.tier,
          };
          saveDraftAuth({ token: draftAuthToken(), user: { ...authUser, ...serverMe, nick: serverMe.name } });
        }
        sourceLabel = "Tabela online baseada nas partidas ranqueadas salvas no servidor.";
        countLabel = rows.length ? `${rows.length} jogadores na tabela online.` : "Nenhum jogador ranqueado ainda.";
      } catch (error) {
        sourceLabel = `${error.message || "Ranking online indisponivel."} Mostrando dados locais deste navegador.`;
      }
    }
    const rankInfo = draftRankInfo(rank.points);
    const myIndex = Math.max(0, rows.findIndex((entry) => entry.me));
    const next = rows[myIndex - 1];
    const totalPages = Math.max(1, Math.ceil(rows.length / DRAFT_RANKED_PAGE_SIZE));
    draftRankedPage = Math.min(Math.max(0, draftRankedPage || 0), totalPages - 1);
    const pageStart = draftRankedPage * DRAFT_RANKED_PAGE_SIZE;
    const visibleRows = rows.slice(pageStart, pageStart + DRAFT_RANKED_PAGE_SIZE);
    const winRate = ((rank.wins || 0) + (rank.losses || 0)) ? Math.round(((rank.wins || 0) / ((rank.wins || 0) + (rank.losses || 0))) * 100) : 0;
    $("choice-kicker").textContent = "Ranqueada";
    $("choice-title").textContent = "Draft Battle";
    $("choice-copy").textContent = sourceLabel;
    $("choice-grid").innerHTML = `
      <div class="draft-ranked-panel">
        <div class="draft-ranked-hero">
          <article>
            <span>Elo atual</span>
            <strong>${rankInfo.name}</strong>
            <small>${rankInfo.points} pts</small>
          </article>
          <article>
            <span>Posicao</span>
            <strong>#${myIndex + 1}</strong>
            <small>${next ? `${Math.max(0, (next.points || 0) - (rank.points || 0))} pts até #${myIndex}` : "Topo da tabela"}</small>
          </article>
          <article>
            <span>Win rate</span>
            <strong>${winRate}%</strong>
            <small>${rank.wins || 0}V / ${rank.losses || 0}D</small>
          </article>
        </div>
        <div class="draft-ranked-progress">
          <div>
            <span>${rankInfo.name}</span>
            <b>${rankInfo.next === null ? "Elo máximo" : `${rankInfo.needed} pts para ${rankInfo.nextName}`}</b>
          </div>
          <i style="--rank-progress:${rankInfo.progress}%"><em></em></i>
          <small>${rankInfo.next === null ? `${rankInfo.points}+ pts` : `${rankInfo.points} / ${rankInfo.next} pts`}</small>
        </div>
        <div class="draft-ranked-pager">
          <span>Pagina ${draftRankedPage + 1} / ${totalPages}</span>
          <div>
            <button class="draft-secondary-button" type="button" data-action="draft-ranked-prev" ${draftRankedPage <= 0 ? "disabled" : ""}>Anterior</button>
            <button class="draft-secondary-button" type="button" data-action="draft-ranked-next" ${draftRankedPage >= totalPages - 1 ? "disabled" : ""}>Próxima</button>
          </div>
        </div>
        <div class="draft-ranked-table">
          <header><span>#</span><strong>Jogador</strong><b>Elo</b><b>Pts</b><b>V/D</b></header>
          ${visibleRows.map((entry, index) => `
            <article class="${entry.me ? "is-you" : ""}">
              <span>${pageStart + index + 1}</span>
              <strong>${entry.name}</strong>
              <b>${entry.tier}</b>
              <b>${entry.points || 0}</b>
              <small>${entry.wins || 0}/${entry.losses || 0}</small>
            </article>
          `).join("")}
        </div>
        <div class="draft-build-footer">
          <span>${countLabel}</span>
          <div class="draft-result-actions">
            <button class="draft-secondary-button" type="button" data-action="draft-history">Histórico</button>
            <button class="draft-confirm-button" type="button" data-action="draft-rules">Voltar</button>
          </div>
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
  }

  function renderDraftArenaRoulette(arena, serverResult) {
    const authoritativeArenaId = resolveDraftArenaId(arena?.id || arena, serverResult?.arena?.id, serverResult?.arenaId);
    const selected = draftArenaById(authoritativeArenaId);
    const selectedArenaIndex = Math.max(0, DRAFT_ARENA_EVENTS.findIndex((entry) => entry.id === selected.id));
    const spinEntries = [
      ...DRAFT_ARENA_EVENTS,
      ...DRAFT_ARENA_EVENTS,
      ...DRAFT_ARENA_EVENTS,
      ...DRAFT_ARENA_EVENTS.slice(0, selectedArenaIndex + 1),
    ];
    const selectedSpinIndex = spinEntries.length - 1;
    const arenaSpinOffset = Math.max(0, selectedSpinIndex * 128 - 249);
    $("choice-kicker").textContent = "Arena";
    $("choice-title").textContent = "Roleta da arena";
    $("choice-copy").textContent = "O evento da batalha foi sorteado para os dois jogadores.";
    $("choice-grid").innerHTML = `
      <div class="draft-arena-roulette">
        <div class="draft-arena-wheel" style="--arena-spin-offset:${arenaSpinOffset}px">
          <div class="draft-arena-track">
            ${spinEntries.map((entry, index) => `
              <span class="${index === selectedSpinIndex ? "is-selected" : ""}">
                <b>${entry.icon}</b>
                <small>${entry.name}</small>
              </span>
            `).join("")}
          </div>
        </div>
        <div class="draft-arena-result-slot" data-draft-arena-result>
          <small>Sorteando arena...</small>
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
    clearTimeout(draftBattlePlaybackTimer);
    clearTimeout(draftBattleStartFallbackTimer);
    if (!serverResult) return;
    const lockedResult = { ...serverResult, matchId: draftState.match?.id || serverResult.matchId || "", arenaId: selected.id, arena: selected };
    draftState.arena = selected;
    draftState.lockedArenaId = selected.id;
    draftState.rouletteArenaId = selected.id;
    draftState.battleResult = lockedResult;
    window.setTimeout(() => {
      const resultSlot = document.querySelector("[data-draft-arena-result]");
      if (!resultSlot || draftState.rouletteArenaId !== selected.id) return;
      resultSlot.innerHTML = `
        <article class="draft-arena-card is-revealed">
          <span>${selected.icon}</span>
          <strong>${selected.name}</strong>
          <small>${selected.text}</small>
        </article>
      `;
    }, 5600);
    draftBattlePlaybackTimer = window.setTimeout(() => {
      if (state.battle?.draft || state.screen === "battle") return;
      const sameMatch = !lockedResult.matchId || lockedResult.matchId === draftState.match?.id;
      const sameArena = lockedResult.arenaId === draftState.rouletteArenaId;
      if (!sameMatch || !sameArena) return;
      startDraftAutoBattle(lockedResult);
    }, 7600);
  }

  function scheduleDraftBattleStart(result, delay = 8200) {
    clearTimeout(draftBattleStartFallbackTimer);
    if (!result) return;
    const lockedArena = draftArenaById(resolveDraftArenaId(result?.arena?.id, result?.arenaId));
    const lockedResult = { ...result, matchId: result.matchId || draftState.match?.id || "", arenaId: lockedArena.id, arena: lockedArena };
    draftBattleStartFallbackTimer = window.setTimeout(() => {
      if (state.battle?.draft || state.screen === "battle") return;
      const sameMatch = !lockedResult.matchId || lockedResult.matchId === draftState.match?.id;
      const sameArena = !draftState.rouletteArenaId || lockedResult.arenaId === draftState.rouletteArenaId;
      if (!sameMatch || !sameArena) return;
      startDraftAutoBattle(lockedResult);
    }, delay);
  }

  function draftBattleViewMon(pokemon, defeated = false, power = 0, build = null) {
    const maxHp = Math.max(1, Math.round(power || 150));
    return {
      ...pokemon,
      spriteSlug: pokemon?.spriteSlug || slug(pokemon?.name),
      level: pokemon?.level || 50,
      maxHp,
      currentHp: defeated ? 0 : maxHp,
      moves: build?.moves || [],
      held: build?.relic ? [build.relic] : [],
    };
  }

  function draftBattleDefeatedIds(rounds, uptoIndex, playerId) {
    const defeated = new Set();
    rounds.slice(0, uptoIndex + 1).forEach((entry) => {
      const side = entry.left.playerId === playerId ? entry.left : entry.right.playerId === playerId ? entry.right : null;
      if (side && entry.winnerId !== playerId && side.pokemon?.id) defeated.add(side.pokemon.id);
    });
    return defeated;
  }

  function draftBattleTeamForView(playerId, activePokemon, activePower, activeBuild, defeatedIds = new Set()) {
    const player = draftState.match?.players?.find((entry) => entry.id === playerId);
    const orderedIds = draftState.order?.[playerId] || player?.team?.map((pokemon) => pokemon.id) || [];
    const orderedTeam = orderedIds
      .map((pokemonId) => player?.team?.find((pokemon) => pokemon.id === pokemonId))
      .filter(Boolean);
    const team = orderedTeam.length ? orderedTeam : (player?.team || []);
    return team.map((pokemon) => {
      const active = pokemon.id === activePokemon?.id;
      return draftBattleViewMon(pokemon, !active && defeatedIds.has(pokemon.id), active ? activePower : 150, active ? activeBuild : null);
    });
  }

  function draftMoveType(name, fallback = "Normal") {
    const text = String(name || "").toLowerCase();
    if (/fogo|chamas/.test(text)) return "Fire";
    if (/surf|agua/.test(text)) return "Water";
    if (/folha|dreno|vinha/.test(text)) return "Grass";
    if (/raio|trovao|onda/.test(text)) return "Electric";
    if (/psiquico|confusao|barreira/.test(text)) return "Psychic";
    if (/soco|chute|guarda/.test(text)) return "Fighting";
    if (/veneno|acido|toxico/.test(text)) return "Poison";
    if (/terremoto|lama|magnitude/.test(text)) return "Ground";
    if (/pedra|arremesso|rochosa/.test(text)) return "Rock";
    if (/sombra|lambida|assombrar/.test(text)) return "Ghost";
    if (/brilho|voz|beijo/.test(text)) return "Fairy";
    if (/vendaval|aereo|ar/.test(text)) return "Flying";
    if (/gelo|nevasca|gelado/.test(text)) return "Ice";
    if (/furia|zumbido|picada/.test(text)) return "Bug";
    if (/dragao/.test(text)) return "Dragon";
    return fallback;
  }

  function draftMoveForBattle(move, fallbackType) {
    const type = draftMoveType(move?.name, fallbackType);
    return {
      id: slug(move?.name || "tackle"),
      name: move?.name || "Investida",
      type,
      power: /barreira|defesa|onda/.test(String(move?.name || "").toLowerCase()) ? 0.82 : 1.05,
      cost: 0,
    };
  }

  function draftBattleMonForEngine(pokemon, build = null, side = "player") {
    const level = 50;
    const typeCount = Math.max(1, pokemon?.types?.length || 1);
    const base = 95 + (pokemon?.id % 55) + typeCount * 8;
    const mon = {
      ...pokemon,
      spriteSlug: pokemon?.spriteSlug || slug(pokemon?.name),
      level,
      hp: base,
      atk: 72 + ((pokemon?.id * 7) % 46),
      def: 68 + ((pokemon?.id * 5) % 44),
      spd: 58 + ((pokemon?.id * 11) % 52),
      energy: 2,
      xp: 0,
      currentHp: base,
      maxHp: base,
      leader: side === "enemy" ? "Rival" : "Você",
      moves: (build?.moves || []).slice(0, 2).map((move) => draftMoveForBattle(move, pokemon?.types?.[0] || "Normal")),
    };
    if (!mon.moves.length) mon.moves = legalMovesFor(mon).slice(0, 2);
    setHeldItems(mon, build?.relic ? [build.relic] : []);
    return mon;
  }

  function draftBuildMapFromPayload(payload = null) {
    const map = new Map();
    Object.values(payload || {}).flat().forEach((build) => {
      if (build?.pokemonId) map.set(build.pokemonId, build);
    });
    return map;
  }

  function draftBuildMapFromServerResult(result) {
    const map = draftBuildMapFromPayload(draftState.builds);
    (result?.rounds || []).forEach((round) => {
      [round.left, round.right].forEach((side) => {
        if (side?.pokemon?.id && side.build && !map.has(side.pokemon.id)) map.set(side.pokemon.id, side.build);
      });
    });
    return map;
  }

  function startDraftAutoBattle(serverResult) {
    const match = draftState.match;
    const leftPlayer = match?.players?.[0];
    const rightPlayer = match?.players?.[1];
    if (!match || !leftPlayer || !rightPlayer) return renderDraftBattleResult();
    const builds = draftBuildMapFromServerResult(serverResult);
    const orderedTeam = (player) => {
      const orderedIds = draftState.order?.[player.id] || [];
      const ids = [
        ...orderedIds,
        ...player.team.map((pokemon) => pokemon.id).filter((id) => !orderedIds.includes(id)),
      ];
      return ids.map((id) => player.team.find((pokemon) => pokemon.id === id)).filter(Boolean).slice(0, player.team.length);
    };
    const playerTeam = orderedTeam(leftPlayer).map((pokemon) => draftBattleMonForEngine(pokemon, builds.get(pokemon.id), "player"));
    const enemyTeam = orderedTeam(rightPlayer).map((pokemon) => draftBattleMonForEngine(pokemon, builds.get(pokemon.id), "enemy"));
    resetBattleHpVisuals(playerTeam);
    resetBattleHpVisuals(enemyTeam);
    state.autoBattling = false;
    state.battleSpeed = 2;
    const lockedArenaId = resolveDraftArenaId(serverResult?.arena?.id, serverResult?.arenaId);
    const lockedArena = draftArenaById(lockedArenaId);
    serverResult = { ...(serverResult || {}), arenaId: lockedArena.id, arena: lockedArena };
    draftState.lockedArenaId = lockedArena.id;
    draftState.rouletteArenaId = lockedArena.id;
    draftState.arena = lockedArena;
    setDraftMatchStarted();
    state.battle = {
      draft: true,
      playerTeam,
      enemyTeam,
      enemyIndex: 0,
      playerIndex: 0,
      enemy: enemyTeam[0],
      boss: false,
      legendary: false,
      npc: true,
      tower: true,
      arenaId: null,
      draftArena: lockedArena,
      draftCasual: !!serverResult?.casual || match?.mode === "casual-ai",
      draftStartedAt: draftState.matchStartedAt,
      trainerName: "Rival",
      trainerSpriteId: null,
      draftLeftId: leftPlayer.id,
      draftRightId: rightPlayer.id,
      draftLeftLabel: leftPlayer.id === draftState.playerId ? "Você" : leftPlayer.name || "Player 1",
      draftRightLabel: rightPlayer.id === draftState.playerId ? "Você" : rightPlayer.name || "Player 2",
      speedBoostStartedAt: Date.now(),
      rngSeed: hashDraftBattleSeed(match.id || "draft"),
      draftRounds: [],
      draftScore: { [leftPlayer.id]: 0, [rightPlayer.id]: 0 },
      draftServerResult: serverResult || null,
    };
    $("battle-title").textContent = `Draft Battle - ${state.battle.draftArena.name}`;
    $("battle-log").textContent = `${state.battle.draftArena.name}: ${state.battle.draftArena.text}`;
    renderBattle();
    playBattleSfx("start");
    show("battle");
    window.setTimeout(() => animateBattleSendOut(), sendoutDelay(80));
    scheduleAutoBattle(980);
  }

  function recordDraftBattleRound(winnerSide, playerMon = null, enemyMon = null) {
    const battle = state.battle;
    if (!battle?.draft) return;
    const player = playerMon || activePlayer() || battle.playerTeam[battle.playerIndex] || battle.playerTeam.find((mon) => mon.currentHp <= 0) || battle.playerTeam[0];
    const enemy = enemyMon || battle.enemy;
    const playerPower = Math.max(0, player?.currentHp || 0);
    const enemyPower = Math.max(0, enemy?.currentHp || 0);
    const winnerId = winnerSide === "player" ? battle.draftLeftId : battle.draftRightId;
    if (winnerId) battle.draftScore[winnerId] = (battle.draftScore[winnerId] || 0) + 1;
    battle.draftRounds.push({
      index: battle.draftRounds.length + 1,
      winnerId,
      left: { playerId: battle.draftLeftId, pokemon: player, power: playerPower },
      right: { playerId: battle.draftRightId, pokemon: enemy, power: enemyPower },
    });
  }

  function finishDraftAutoBattle(leftWon) {
    const battle = state.battle;
    const draftStats = {
      [battle?.draftLeftId]: (battle?.playerTeam || []).map(draftPokemonStatsSummary),
      [battle?.draftRightId]: (battle?.enemyTeam || []).map(draftPokemonStatsSummary),
    };
    draftState.battleResult = {
      matchId: draftState.match?.id || "",
      winnerId: leftWon ? battle?.draftLeftId : battle?.draftRightId,
      score: battle?.draftScore || { [battle?.draftLeftId]: 0, [battle?.draftRightId]: 0 },
      rounds: battle?.draftRounds || [],
      stats: draftStats,
      arena: battle?.draftArena || draftState.arena || null,
      arenaId: battle?.draftArena?.id || draftState.arena?.id || null,
      casual: !!battle?.draftCasual,
      rankByPlayer: battle?.draftServerResult?.rankByPlayer || null,
      durationMs: draftCurrentDurationMs(),
    };
    stopDraftMatchClock(draftState.battleResult.durationMs);
    draftState.battleResult.mvp = draftFindMvp(draftState.battleResult);
    const serverRank = draftState.battleResult.rankByPlayer?.[draftState.playerId];
    draftState.battleResult.rank = draftState.battleResult.casual
      ? { ...draftRankState(), delta: 0, casual: true }
      : serverRank || applyDraftRank(draftState.battleResult.winnerId === draftState.playerId);
    draftSaveHistory(draftState.battleResult, draftState.match, draftState.battleResult.rank);
    state.battle = null;
    state.autoBattling = false;
    stopBattleSpeedCountdown();
    renderDraftBattleResult();
  }

  function draftPokemonStatsSummary(pokemon) {
    return {
      id: pokemon?.id,
      name: pokemon?.name || "?",
      sprite: pokemon?.sprite,
      dealt: Math.max(0, Math.round(pokemon?.draftStats?.dealt || 0)),
      taken: Math.max(0, Math.round(pokemon?.draftStats?.taken || 0)),
      healed: Math.max(0, Math.round(pokemon?.draftStats?.healed || 0)),
      defeated: pokemon?.currentHp <= 0,
    };
  }

  function renderDraftBattlePlaybackLegacy(roundIndex = 0) {
    const match = draftState.match;
    const result = draftState.battleResult;
    const rounds = result?.rounds || [];
    const round = rounds[Math.min(roundIndex, rounds.length - 1)];
    if (!match || !result || !round) return renderDraftBattleResult();
    const leftIsMe = round.left.playerId === draftState.playerId;
    const mine = leftIsMe ? round.left : round.right;
    const theirs = leftIsMe ? round.right : round.left;
    const roundWon = round.winnerId === draftState.playerId;
    $("choice-kicker").textContent = "Batalha automática";
    $("choice-title").textContent = `Round ${round.index}`;
    $("choice-copy").textContent = roundWon ? `${mine.pokemon?.name} venceu e continua em campo.` : `${mine.pokemon?.name} caiu. Seu próximo Pokémon entra.`;
    $("choice-grid").innerHTML = `
      <div class="draft-battle-playback draft-tower-battle">
        <div class="draft-tower-arena">
          <article class="draft-tower-side player ${roundWon ? "is-winner" : "is-loser"}">
            <header><span>Você</span><b>${roundWon ? "Continua" : "Caiu"}</b></header>
            <div class="draft-tower-platform">
              <img src="${mine.pokemon?.sprite || ""}" alt="">
            </div>
            <strong>${mine.pokemon?.name || "?"}</strong>
            <small>Poder ${mine.power}</small>
          </article>
          <div class="draft-tower-vs">VS</div>
          <article class="draft-tower-side enemy ${!roundWon ? "is-winner" : "is-loser"}">
            <header><span>Rival</span><b>${!roundWon ? "Continua" : "Caiu"}</b></header>
            <div class="draft-tower-platform">
              <img src="${theirs.pokemon?.sprite || ""}" alt="">
            </div>
            <strong>${theirs.pokemon?.name || "?"}</strong>
            <small>Poder ${theirs.power}</small>
          </article>
        </div>
        <div class="draft-battle-progress">
          ${rounds.map((entry, index) => `<span class="${index < roundIndex ? "is-done" : index === roundIndex ? "is-active" : ""}">${entry.index}</span>`).join("")}
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
    clearTimeout(draftBattlePlaybackTimer);
    draftBattlePlaybackTimer = setTimeout(() => {
      if (roundIndex + 1 >= rounds.length) return renderDraftBattleResult();
      renderDraftBattlePlayback(roundIndex + 1);
    }, 1150);
  }

  function renderDraftBattlePlayback(roundIndex = 0) {
    const match = draftState.match;
    const result = draftState.battleResult;
    const rounds = result?.rounds || [];
    const round = rounds[Math.min(roundIndex, rounds.length - 1)];
    if (!match || !result || !round) return renderDraftBattleResult();
    const leftIsMe = round.left.playerId === draftState.playerId;
    const mine = leftIsMe ? round.left : round.right;
    const theirs = leftIsMe ? round.right : round.left;
    const roundWon = round.winnerId === draftState.playerId;
    const myDefeatedIds = draftBattleDefeatedIds(rounds, roundIndex, draftState.playerId);
    const rivalDefeatedIds = draftBattleDefeatedIds(rounds, roundIndex, theirs.playerId);
    const myTeam = draftBattleTeamForView(draftState.playerId, mine.pokemon, mine.power, mine.build, myDefeatedIds);
    const rivalTeam = draftBattleTeamForView(theirs.playerId, theirs.pokemon, theirs.power, theirs.build, rivalDefeatedIds);
    const myActive = myTeam.find((pokemon) => pokemon.id === mine.pokemon?.id) || draftBattleViewMon(mine.pokemon, !roundWon, mine.power, mine.build);
    const rivalActive = rivalTeam.find((pokemon) => pokemon.id === theirs.pokemon?.id) || draftBattleViewMon(theirs.pokemon, roundWon, theirs.power, theirs.build);
    $("battle-title").textContent = "Batalha automática";
    $("battle-log").textContent = roundWon
      ? `${mine.pokemon?.name || "Seu Pokémon"} venceu e continua em campo.`
      : `${mine.pokemon?.name || "Seu Pokémon"} caiu. Seu próximo Pokémon entra.`;
    renderBattleRoster("player-card", myTeam, myActive, "Você", playerTrainerSprite(), "player", true, true);
    renderBattleRoster("enemy-card", rivalTeam, rivalActive, "Rival", null, "enemy", true, true);
    $("move-grid").innerHTML = `
      <div class="battle-auto-status draft-battle-status">
        <span>Round ${round.index}</span>
        <div class="draft-battle-progress">
          ${rounds.map((entry, index) => `<span class="${index < roundIndex ? "is-done" : index === roundIndex ? "is-active" : ""}">${entry.index}</span>`).join("")}
        </div>
      </div>
    `;
    $("battle-title").textContent = `Draft Battle - Round ${round.index}`;
    $("battle-log").textContent = roundWon
      ? `${mine.pokemon?.name || "Seu Pokémon"} venceu e continua em campo.`
      : `${mine.pokemon?.name || "Seu Pokémon"} caiu. Seu próximo Pokémon entra.`;
    renderBattleRoster("player-card", myTeam, myActive, "Seu time", playerTrainerSprite(), "player", true, true);
    renderBattleRoster("enemy-card", rivalTeam, rivalActive, "Inimigo", null, "enemy", true, true);
    $("move-grid").innerHTML = `<button class="battle-speed-toggle is-active" type="button" disabled aria-label="Batalha automática">2x<small>${round.index}/${rounds.length}</small></button>`;
    show("battle");
    document.querySelector(".rogue-stage")?.classList.add("has-battle-modal");
    document.querySelector(".battle-grid")?.classList.add("tower-battle-grid");
    positionTowerVsBadge();
    animateRenderedHpBars();
    clearTimeout(draftBattlePlaybackTimer);
    draftBattlePlaybackTimer = setTimeout(() => {
      if (roundIndex + 1 >= rounds.length) return renderDraftBattleResult();
      renderDraftBattlePlayback(roundIndex + 1);
    }, 1150);
  }

  function renderDraftOrderScreen(message = "") {
    const match = draftState.match;
    const me = match?.players?.find((player) => player.id === draftState.playerId);
    const rival = match?.players?.find((player) => player.id !== draftState.playerId);
    if (!match || !me) return showDraftBattleIntro("queue");
    const myOrder = draftState.order?.[draftState.playerId] || [];
    const rivalOrder = draftState.order?.[rival?.id] || [];
    const isMyTurn = draftState.orderTurn === draftState.playerId;
    $("choice-kicker").textContent = isMyTurn ? "Sua ordem" : "Ordem do rival";
    $("choice-title").textContent = "Ordem de batalha";
    $("choice-copy").textContent = message || (isMyTurn ? "Escolha o próximo Pokémon que entra na batalha." : "Aguarde o rival definir o próximo slot da ordem.");
    $("choice-grid").innerHTML = `
      <div class="draft-order">
        <button class="draft-exit-button" type="button" data-action="draft-leave" aria-label="Sair do Draft Battle">Sair</button>
        <div class="draft-top-status">${draftTimerMarkup(isMyTurn)}</div>
        <div class="draft-order-lanes">
          <article>
            <strong>Você</strong>
            <div>${Array.from({ length: 6 }, (_, index) => {
              const pokemon = me.team.find((entry) => entry.id === myOrder[index]);
              return pokemon ? `<span><img src="${draftPreviewSprite(pokemon)}" alt="">${pokemon.name}</span>` : `<span>${index + 1}</span>`;
            }).join("")}</div>
          </article>
          <article>
            <strong>${rival?.name || "Rival"}</strong>
            <div>${Array.from({ length: 6 }, (_, index) => {
              const pokemon = rival?.team?.find((entry) => entry.id === rivalOrder[index]);
              return pokemon ? `<span><img src="${draftPreviewSprite(pokemon)}" alt="">${pokemon.name}</span>` : `<span>${index + 1}</span>`;
            }).join("")}</div>
          </article>
        </div>
        <div class="draft-order-picks">
          ${me.team.map((pokemon) => {
            const picked = myOrder.includes(pokemon.id);
            return `
              <button class="${picked ? "is-picked" : ""}" type="button" data-draft-order-pick="${pokemon.id}" ${picked || !isMyTurn ? "disabled" : ""}>
                <img src="${draftPreviewSprite(pokemon)}" alt="${pokemon.name}">
                <strong>${pokemon.name}</strong>
                <small>${picked ? `Slot ${myOrder.indexOf(pokemon.id) + 1}` : draftTypeText(pokemon)}</small>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
    startDraftCountdown(() => renderDraftOrderScreen(message));
  }

  function connectDraftBattle() {
    if (draftSocket) return draftSocket;
    if (typeof window.io !== "function") return null;
    draftSocket = window.io();
    draftSocket.on("connect", () => {
      draftState.playerId = draftSocket.id || draftState.playerId;
      const token = draftAuthToken();
      if (token) draftSocket.emit("auth:token", { token });
    });
    draftSocket.on("auth:status", ({ user }) => {
      if (user) saveDraftAuth({ token: draftAuthToken(), user });
      if (draftAuthWaiter) draftAuthWaiter.finish(user || null);
    });
    draftSocket.on("draft:ready", ({ playerId }) => {
      draftState.playerId = draftSocket.id || playerId;
      draftState.status = "ready";
    });
    draftSocket.on("queue:status", ({ position, message }) => {
      $("choice-copy").textContent = message || (position ? `Aguardando outro treinador. Posi??o na fila: ${position}.` : "Fora da fila.");
    });
    draftSocket.on("match:found", ({ match }) => {
      clearTimeout(draftBattlePlaybackTimer);
      clearTimeout(draftBattleStartFallbackTimer);
      draftState.match = match;
      draftState.options = [];
      draftState.banOptions = [];
      draftState.activeBanStep = 0;
      draftState.submittedBanStep = 0;
      stopDraftMatchClock(0);
      draftState.lockedArenaId = "";
      draftState.rouletteArenaId = "";
      draftState.battleStartArenaId = "";
      if (match?.phase === "ban") return renderDraftBanScreen("Partida encontrada. Comece banindo uma ameaça.");
      renderDraftBattleRoom("Partida encontrada. O draft alternado começou.");
    });
    draftSocket.on("ban:start", ({ match, options, deadline }) => {
      draftState.match = match;
      draftState.options = [];
      draftState.banOptions = options || [];
      draftState.activeBanStep = match?.banStep || 0;
      draftState.submittedBanStep = 0;
      draftState.deadline = deadline || 0;
      renderDraftBanScreen();
    });
    draftSocket.on("ban:waiting", ({ match, deadline }) => {
      draftState.match = match;
      draftState.options = [];
      draftState.banOptions = [];
      draftState.activeBanStep = 0;
      draftState.submittedBanStep = 0;
      draftState.deadline = deadline || 0;
      renderDraftBanScreen();
    });
    draftSocket.on("ban:update", ({ match, banned }) => {
      draftState.match = match;
      renderDraftBanScreen(`${banned?.name || "Um Pokémon"} foi banido.`);
    });
    draftSocket.on("ban:stage-complete", ({ match }) => {
      draftState.match = match;
      draftState.banOptions = [];
      draftState.activeBanStep = 0;
      draftState.submittedBanStep = 0;
      renderDraftBanScreen("Próxima etapa de banimento preparada.");
    });
    draftSocket.on("ban:complete", ({ match }) => {
      draftState.match = match;
      draftState.banOptions = [];
      draftState.activeBanStep = 0;
      draftState.submittedBanStep = 0;
      draftState.deadline = 0;
      renderDraftBattleRoom("Bans concluídos. O draft alternado começou.");
    });
    draftSocket.on("draft:options", ({ match, options, deadline }) => {
      draftState.match = match;
      draftState.options = options || [];
      draftState.banOptions = [];
      draftState.deadline = deadline || 0;
      renderDraftBattleRoom();
    });
    draftSocket.on("draft:waiting", ({ match, deadline }) => {
      draftState.match = match;
      draftState.options = [];
      draftState.deadline = deadline || 0;
      renderDraftBattleRoom();
    });
    draftSocket.on("draft:update", ({ match, picked }) => {
      draftState.match = match;
      draftState.options = [];
      draftState.deadline = 0;
      renderDraftBattleRoom(`${picked?.name || "Um Pokémon"} entrou no draft.`);
    });
    draftSocket.on("draft:complete", ({ match }) => {
      draftState.match = match;
      draftState.options = [];
      draftState.deadline = 0;
      renderDraftBattleRoom("Times completos. Moves, relíquias e batalha automática vêm a seguir.");
    });
    draftSocket.on("build:start", ({ match, options, deadline }) => {
      draftState.match = match;
      draftState.options = [];
      draftState.buildOptions = options || [];
      draftState.buildSelections = {};
      draftState.builds = {};
      draftState.deadline = deadline || 0;
      startDraftCountdown(() => renderDraftBuildScreen());
      renderDraftBuildScreen();
    });
    draftSocket.on("build:update", ({ match, readyBy }) => {
      draftState.match = match;
      const isMe = readyBy === draftState.playerId;
      renderDraftBuildScreen(isMe ? "Build enviada. Aguardando o rival confirmar." : "O rival confirmou a build. Finalize suas escolhas.");
    });
    draftSocket.on("battle:start", ({ match, order, arena }) => {
      draftState.match = match;
      draftState.order = order || draftState.order || {};
      const startArenaId = arena?.id || match?.arena?.id || "";
      if (startArenaId) {
        draftState.battleStartArenaId = startArenaId;
        if (!draftState.rouletteArenaId) {
          const startArena = draftArenaById(startArenaId);
          draftState.arena = startArena;
          draftState.lockedArenaId = startArena.id;
        }
      }
      draftState.deadline = 0;
      clearTimeout(draftBattlePlaybackTimer);
      if (draftTurnCountdownTimer) {
        window.clearInterval(draftTurnCountdownTimer);
        draftTurnCountdownTimer = null;
      }
      renderDraftBuildScreen("Builds confirmadas. Sorteando arena...");
    });
    draftSocket.on("order:start", ({ match, order, orderTurn, deadline }) => {
      draftState.match = match;
      draftState.order = order || {};
      draftState.orderTurn = orderTurn || "";
      draftState.deadline = deadline || 0;
      renderDraftOrderScreen();
    });
    draftSocket.on("order:update", ({ match, order, orderTurn, deadline }) => {
      draftState.match = match;
      draftState.order = order || {};
      draftState.orderTurn = orderTurn || "";
      draftState.deadline = deadline || 0;
      renderDraftOrderScreen();
    });
    draftSocket.on("battle:end", ({ match, order, result, arena, builds }) => {
      clearTimeout(draftBattlePlaybackTimer);
      draftState.match = match;
      draftState.order = order || draftState.order || {};
      const authoritativeArenaId = resolveDraftArenaId(arena?.id, match?.arena?.id, result?.arena?.id, result?.arenaId);
      const lockedArena = draftArenaById(authoritativeArenaId);
      draftState.arena = lockedArena;
      draftState.lockedArenaId = lockedArena.id;
      draftState.rouletteArenaId = lockedArena.id;
      draftState.builds = builds || draftState.builds || {};
      draftState.deadline = 0;
      if (draftTurnCountdownTimer) {
        window.clearInterval(draftTurnCountdownTimer);
        draftTurnCountdownTimer = null;
      }
      draftState.battleResult = { ...(result || {}), matchId: match?.id || "", arenaId: lockedArena.id, arena: lockedArena, durationMs: 0 };
      renderDraftArenaRoulette(lockedArena, draftState.battleResult);
      scheduleDraftBattleStart(draftState.battleResult);
    });
    draftSocket.on("match:abandoned", () => {
      draftState.match = null;
      draftState.options = [];
      showDraftBattleIntro("queue");
      $("choice-copy").textContent = "O outro jogador saiu da sala.";
    });
    draftSocket.on("rematch:update", ({ accepted = [], waitingFor = [] }) => {
      const acceptedMe = accepted.includes(draftState.playerId);
      const waitingForMe = waitingFor.includes(draftState.playerId);
      if (waitingForMe) {
        $("choice-copy").textContent = "O rival pediu revanche. Aceite para jogar outra contra ele.";
      } else if (acceptedMe) {
        $("choice-copy").textContent = "Revanche enviada. Aguardando o rival aceitar.";
      }
    });
    draftSocket.on("rematch:unavailable", () => {
      $("choice-copy").textContent = "Revanche indisponível: o rival saiu ou a partida expirou.";
    });
    draftSocket.on("connect_error", () => {
      $("choice-copy").textContent = "Não foi possível conectar ao servidor do Draft Battle. Abra a página pelo servidor Node, não pelo Live Server: npm start e depois /oak-rogue.html na porta do servidor.";
    });
    return draftSocket;
  }

  async function joinDraftBattleQueue(mode = "ranked") {
    const socket = connectDraftBattle();
    const casual = mode === "ai";
    if (!casual && !draftAuthToken()) return showDraftAuth("login", "Entre ou crie uma conta para jogar Contra Player ranqueado.");
    $("choice-kicker").textContent = casual ? "Modo casual" : "Fila ranqueada";
    $("choice-title").textContent = "Draft Battle";
    if (!socket) {
      $("choice-copy").textContent = "Socket.IO não carregou porque esta página não veio do servidor Node. Rode npm start e abra http://127.0.0.1:5500/oak-rogue.html; se a porta 5500 estiver ocupada, use PORT=5600 e abra http://127.0.0.1:5600/oak-rogue.html.";
      $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="title"><strong>Voltar</strong><small>Retornar para os modos.</small></button>`;
      show("choice");
      document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
      return;
    }
    if (!casual) {
      const user = await waitDraftAuth(socket);
      if (!user) return showDraftAuth("login", "Sua sessão expirou. Entre novamente para jogar Contra Player ranqueado.");
    }
    $("choice-copy").textContent = casual ? "Preparando uma partida casual contra a IA." : "Aguardando outro treinador para iniciar o draft alternado.";
    $("choice-grid").innerHTML = `
      <div class="draft-queue-panel">
        <span class="draft-queue-pulse" aria-hidden="true"></span>
        <strong>${casual ? "Chamando IA" : "Buscando rival"}</strong>
        <small>${casual ? "A partida casual não altera seu elo." : `Jogando como ${draftPlayerName()}.`}</small>
        <button class="draft-menu-action compact" type="button" data-action="draft-leave">Cancelar</button>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-draft-modal");
    if (draftAuthToken()) socket.emit("auth:token", { token: draftAuthToken() });
    socket.emit("queue:join", { playerName: draftPlayerName(), mode, token: draftAuthToken() });
  }

  function applyPendingMapFloor() {
    if (!Number.isFinite(state.pendingMapFloor)) return;
    state.floor = state.pendingMapFloor;
    state.pendingMapFloor = null;
  }

  function savedRunMode() {
    return availableSavedRunModes()[0] || null;
  }

  function selectedRunMode() {
    return $("run-nuzlocke")?.checked ? "nuzlocke" : "normal";
  }

  function runModeForSave(run) {
    if (run?.tower?.active) return "tower";
    return run?.nuzlockeMode ? "nuzlocke" : "normal";
  }

  function saveKeyForMode(mode) {
    return `oak_rogue_run_${mode}`;
  }

  function savedRunForMode(mode) {
    try {
      let saved = JSON.parse(localStorage.getItem(saveKeyForMode(mode)) || "null");
      if (!saved && mode === savedRunModeFromLegacy()) {
        saved = JSON.parse(localStorage.getItem("oak_rogue_run") || "null");
      }
      if (!saved?.team?.length) return null;
      return runModeForSave(saved) === mode ? saved : null;
    } catch {
      return null;
    }
  }

  function savedRunModeFromLegacy() {
    try {
      const saved = JSON.parse(localStorage.getItem("oak_rogue_run") || "null");
      if (!saved?.team?.length) return null;
      return runModeForSave(saved);
    } catch {
      return null;
    }
  }

  function availableSavedRunModes() {
    return ["normal", "nuzlocke", "tower"].filter((mode) => !!savedRunForMode(mode));
  }

  function continueRunLabel(mode) {
    if (mode === "tower") return "Continuar torre";
    return `Continuar ${mode === "nuzlocke" ? "Nuzlocke" : "Normal"}`;
  }

  function updateContinueRunButton() {
    const button = $("continue-run");
    const modes = availableSavedRunModes();
    document.querySelectorAll("[data-continue-mode]").forEach((cardButton) => {
      const mode = cardButton.dataset.continueMode;
      cardButton.hidden = !modes.includes(mode);
    });
    if (!button) return;
    const selectedMode = selectedRunMode();
    const preferred = modes.includes(selectedMode)
      ? selectedMode
      : modes.includes("tower")
      ? "tower"
      : null;
    button.dataset.continueMode = "";
    button.hidden = !preferred;
    if (!preferred) return;
    button.textContent = continueRunLabel(preferred);
    button.dataset.continueMode = preferred;
  }

  function normalizeItem(item) {
    if (!item) return null;
    const fresh = ITEMS.find((entry) => entry.id === item.id || entry.name === item.name || entry.sprite === item.sprite);
    return fresh ? { ...fresh } : { ...item };
  }

  function normalizeSavedHp(p, oldMax) {
    if (!Number.isFinite(p.currentHp)) return p.maxHp;
    if (p.currentHp <= 0) return 0;
    const hpPct = oldMax ? p.currentHp / oldMax : 1;
    return Math.max(1, Math.min(p.maxHp, Math.ceil(p.maxHp * hpPct)));
  }

  function load(mode) {
    try {
      const requestedMode = mode;
      const saved = requestedMode ? savedRunForMode(requestedMode) : null;
      const raw = saved ? JSON.stringify(saved) : localStorage.getItem("oak_rogue_run");
      if (!raw) return false;
      Object.assign(state, JSON.parse(raw));
      if (!Array.isArray(state.badges)) state.badges = [];
      if (!Array.isArray(state.offer)) state.offer = [];
      if (!Array.isArray(state.items)) state.items = [];
      if (!Array.isArray(state.fallenTeam)) state.fallenTeam = [];
      if (!Array.isArray(state.pendingEvolutions)) state.pendingEvolutions = [];
      if (!Array.isArray(state.pendingEvolutionChoices)) state.pendingEvolutionChoices = [];
      if (!Number.isFinite(state.pendingMapFloor)) state.pendingMapFloor = null;
      state.pendingTowerEvent = !!state.pendingTowerEvent;
      state.items = state.items.map(normalizeItem).filter(Boolean);
      state.pendingItem = normalizeItem(state.pendingItem);
      state.nuzlockeMode = !!state.nuzlockeMode;
      state.levelCapEnabled = state.levelCapEnabled !== false;
      state.battleSpeed = [1, 2, 3].includes(state.battleSpeed) ? state.battleSpeed : 2;
      state.autoBattling = false;
      if (!Array.isArray(state.pendingTowerOrder)) state.pendingTowerOrder = [];
      if (state.tower?.active) {
        state.tower.secondChanceUsed = !!state.tower.secondChanceUsed;
        state.tower.guaranteedRecruitUsed = !!state.tower.guaranteedRecruitUsed;
      }
    if (!state.tower?.active && (!Array.isArray(state.map) || state.map.length !== RUN_FLOORS || state.routeVersion !== ROUTE_VERSION)) buildMap();
      state.routeVersion = ROUTE_VERSION;
      state.team.forEach((p) => {
        p.runId ||= uid("mon");
        restoreShinyFromEvolutionDex(p);
        setHeldItems(p, normalizeHeldItems(p));
        const oldMax = p.maxHp || hpMax(p);
        p.maxHp = hpMax(p);
        p.currentHp = normalizeSavedHp(p, oldMax);
        syncMoves(p);
        p.xp = p.xp || 0;
        maybeAutoEvolve(p);
      });
      state.fallenTeam = state.fallenTeam.map((p) => ({ ...p, runId: p.runId || uid("mon"), currentHp: 0 }));
      state.battle?.enemyTeam?.forEach((p) => {
        p.maxHp = Number.isFinite(p.maxHp) ? p.maxHp : hpMax(p);
        p.currentHp = Number.isFinite(p.currentHp)
          ? Math.max(0, Math.min(p.maxHp, p.currentHp))
          : p.maxHp;
        syncMoves(p);
      });
      if (state.battle && !Array.isArray(state.battle.enemyTeam) && state.battle.enemy) {
        state.battle.enemyTeam = [state.battle.enemy];
        state.battle.enemyIndex = 0;
      }
      if (state.battle?.tower) {
        state.battle.playerTeam = state.team;
      }
      if (state.battle && !Number.isFinite(state.battle.playerIndex)) {
        state.battle.playerTeam = state.battle.playerTeam || state.team;
        state.battle.playerIndex = state.battle.playerTeam.findIndex((p) => p.currentHp > 0);
      }
      if (state.battle) {
        resetBattleHpVisuals(state.battle.playerTeam || state.team);
        resetBattleHpVisuals(state.battle.enemyTeam || []);
      }
      state.pendingEvolutionChoices = state.pendingEvolutionChoices.filter((entry) => {
        const p = state.team.find((mon) => mon.runId === entry.runId);
        const evo = EVOLUTIONS[p?.id];
        return p && p.currentHp > 0 && evo?.options?.length && (p.level || 1) >= (evo.level || Math.min(...evo.options.map((option) => option.level || 1)));
      });
      save();
      return state.team.length > 0;
    } catch {
      return false;
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(saveKeyForMode(runModeForSave(state)));
      if (savedRunModeFromLegacy() === runModeForSave(state)) localStorage.removeItem("oak_rogue_run");
    } catch {}
  }

  function getRogueAudioContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    rogueAudioContext ||= new AudioCtor();
    if (rogueAudioContext.state === "suspended") rogueAudioContext.resume().catch(() => {});
    return rogueAudioContext;
  }

  function playTone({ frequency = 440, endFrequency = null, duration = 0.12, delay = 0, volume = 0.035, type = "square" } = {}) {
    try {
      const audio = getRogueAudioContext();
      if (!audio) return;
      const speed = battleSpeedFactor();
      const scaledDuration = duration / speed;
      const start = audio.currentTime + delay / speed;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + scaledDuration);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + Math.min(0.025, scaledDuration * 0.35));
      gain.gain.exponentialRampToValueAtTime(0.0001, start + scaledDuration);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + scaledDuration + 0.02);
    } catch {
      // Audio can be blocked by browser policy; gameplay continues silently.
    }
  }

  function playBattleSfx(kind = "hit", detail = {}) {
    if (kind === "start") {
      playTone({ frequency: 330, endFrequency: 520, duration: 0.09, volume: 0.03, type: "triangle" });
      playTone({ frequency: 520, endFrequency: 780, duration: 0.12, delay: 0.08, volume: 0.032, type: "square" });
      playTone({ frequency: 196, endFrequency: 160, duration: 0.18, delay: 0.02, volume: 0.018, type: "sawtooth" });
      return;
    }
    if (kind === "faint") {
      playTone({ frequency: 420, endFrequency: 90, duration: 0.42, volume: 0.04, type: "sawtooth" });
      playTone({ frequency: 210, endFrequency: 70, duration: 0.36, delay: 0.08, volume: 0.025, type: "triangle" });
      return;
    }
    if (kind === "evolution") {
      playTone({ frequency: 392, endFrequency: 523, duration: 0.13, volume: 0.032, type: "triangle" });
      playTone({ frequency: 523, endFrequency: 659, duration: 0.13, delay: 0.12, volume: 0.035, type: "triangle" });
      playTone({ frequency: 659, endFrequency: 784, duration: 0.16, delay: 0.24, volume: 0.04, type: "square" });
      playTone({ frequency: 262, endFrequency: 392, duration: 0.42, delay: 0.02, volume: 0.018, type: "sawtooth" });
      return;
    }
    const effectiveBoost = detail.eff > 1 ? 1.22 : detail.eff > 0 && detail.eff < 1 ? 0.82 : 1;
    const critBoost = detail.crit ? 1.35 : 1;
    playTone({ frequency: 180 * effectiveBoost * critBoost, endFrequency: 90, duration: 0.08, volume: detail.crit ? 0.055 : 0.04, type: "square" });
    playTone({ frequency: 620 * effectiveBoost, endFrequency: 260, duration: 0.055, delay: 0.015, volume: 0.025, type: "sawtooth" });
  }

  function effectiveness(type, defenderTypes) {
    const strong = {
      Fire: ["Grass", "Bug", "Ice", "Steel"],
      Water: ["Fire", "Rock", "Ground"],
      Grass: ["Water", "Rock", "Ground"],
      Electric: ["Water", "Flying"],
      Psychic: ["Fighting", "Poison"],
      Fighting: ["Normal", "Rock", "Dark", "Ice", "Steel"],
      Ground: ["Fire", "Electric", "Poison", "Rock", "Steel"],
      Rock: ["Fire", "Ice", "Flying", "Bug"],
      Ice: ["Grass", "Ground", "Flying", "Dragon"],
      Ghost: ["Psychic", "Ghost"],
      Dark: ["Psychic", "Ghost"],
      Dragon: ["Dragon"],
      Fairy: ["Fighting", "Dark", "Dragon"],
      Flying: ["Grass", "Fighting", "Bug"],
      Bug: ["Grass", "Psychic", "Dark"],
      Poison: ["Grass", "Fairy"],
      Steel: ["Rock", "Ice", "Fairy"]
    };
    const weak = {
      Normal: ["Rock", "Steel"],
      Fire: ["Water", "Rock", "Dragon", "Fire"],
      Water: ["Grass", "Dragon", "Water"],
      Grass: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
      Electric: ["Electric", "Grass", "Dragon"],
      Psychic: ["Psychic", "Steel"],
      Fighting: ["Poison", "Flying", "Psychic", "Bug", "Fairy"],
      Ground: ["Grass", "Bug"],
      Rock: ["Fighting", "Ground", "Steel"],
      Ice: ["Fire", "Water", "Ice", "Steel"],
      Ghost: ["Dark"],
      Dark: ["Fighting", "Dark", "Fairy"],
      Dragon: ["Steel"],
      Fairy: ["Fire", "Poison", "Steel"],
      Flying: ["Electric", "Rock", "Steel"],
      Bug: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"],
      Poison: ["Poison", "Ground", "Rock", "Ghost"],
      Steel: ["Fire", "Water", "Electric", "Steel"]
    };
    const immune = {
      Normal: ["Ghost"],
      Fighting: ["Ghost"],
      Poison: ["Steel"],
      Ground: ["Flying"],
      Electric: ["Ground"],
      Psychic: ["Dark"],
      Ghost: ["Normal"],
      Dragon: ["Fairy"]
    };
    return defenderTypes.reduce((mult, t) => {
      if (immune[type]?.includes(t)) return 0;
      if (strong[type]?.includes(t)) return mult * 1.6;
      if (weak[type]?.includes(t)) return mult * 0.65;
      return mult;
    }, 1);
  }

  function renderTypeChips(types) {
    return `<div class="type-row">${types.map((t) => `<span class="type-chip" style="background:${TYPE_COLOR[t] || "#fff"}">${t}</span>`).join("")}</div>`;
  }

  function statBars(p, variant = "") {
    const scaled = displayStats(p);
    const stats = [
      ["HP", scaled.hp],
      ["ATK", scaled.atk],
      ["DEF", scaled.def],
      ["VEL", scaled.spd]
    ];
    return `<div class="stat-bars ${variant}">${stats.map(([label, value]) => `
      <span><i>${label}</i><b style="width:${Math.min(100, Math.round((value / 140) * 100))}%"></b><em>${value}</em></span>
    `).join("")}</div>`;
  }

  function statList(p) {
    const scaled = displayStats(p);
    const stats = [
      ["ATK", scaled.atk],
      ["VEL", scaled.spd],
      ["HP", scaled.hp],
      ["DEF", scaled.def]
    ];
    return `<div class="team-hover-stat-list">${stats.map(([label, value]) => `
      <span><i>${label}</i><em>${value}</em></span>
    `).join("")}</div>`;
  }

  function renderEvolutionSummary(entry) {
    if (!entry) return "";
    return `<div class="evolution-summary">
      <div>
        <img src="${animated(entry.from)}" alt="${entry.from.name}" onerror="this.src='${mini(entry.from)}'">
        <strong>${entry.from.name}</strong>
      </div>
      <span>â†’</span>
      <div>
        <img src="${animated(entry.to)}" alt="${entry.to.name}" onerror="this.src='${mini(entry.to)}'">
        <strong>${entry.to.name}</strong>
      </div>
    </div>`;
  }

  function badgeInfo(badge) {
    const boss = BOSSES.find((entry) => entry.badge === badge);
    const arena = ARENAS.find((entry) => entry.badge === badge && entry.id !== "league");
    return {
      name: boss?.arena ? `Ins?gnia ${boss.arena}` : `Ins?gnia ${badge}`,
      leader: boss?.leader || arena?.npc || "Líder desconhecido"
    };
  }

  function renderHud() {
    $("rogue-floor").textContent = `${state.floor}/${RUN_FLOORS}`;
    const arena = currentVisualArena();
    $("rogue-biome").textContent = arena.name;
    const risk = state.threat <= 1 ? "Est?vel" : state.threat < 2.5 ? "Perigoso" : "Cr?tico";
    $("rogue-threat").textContent = `${risk} ? Cap ${currentLevelCap()}${state.nuzlockeMode ? " ? Nuzlocke" : ""}`;
    document.body.dataset.arena = arena.id;
    if ($("team-count")) $("team-count").textContent = `${state.team.length}/6`;
    if ($("item-count")) $("item-count").textContent = String(state.items.length);
    if ($("team-list")) $("team-list").innerHTML = state.team.map((p) => `
      <div class="team-row ${p.currentHp <= 0 ? "fainted" : ""}">
        <img src="${mini(p)}" alt="${p.name}">
        <div>
          <strong>${p.name}</strong>
          <small>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp} · ${heldItemSummary(p)}</small>
          ${renderTypeChips(p.types)}
        </div>
      </div>
    `).join("") || `<div class="item-pill"><small>Nenhum parceiro ainda.</small></div>`;
    if ($("item-list")) $("item-list").innerHTML = state.items.map((item) => `
      <div class="item-pill item-with-icon">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <span><strong>${item.name}</strong><small>${itemShortText(item)}</small></span>
      </div>
    `).join("") || `<div class="item-pill"><small>Relíquias aparecem em n?s especiais.</small></div>`;
    if (!Array.isArray(state.badges)) state.badges = [];
    if ($("badge-count")) $("badge-count").textContent = `${state.badges.length}/8`;
    if ($("badge-list")) $("badge-list").innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map((badge) => {
      const earned = state.badges.includes(badge);
      return `<div class="badge-slot ${earned ? "earned" : ""}"><img src="${badgeSprite(badge)}" alt="Insignia ${badge}"><span>${earned ? "Conquistada" : "Bloqueada"}</span></div>`;
    }).join("");
    const active = Object.entries(countTypes()).filter(([, count]) => count >= 2);
    if ($("synergy-count")) $("synergy-count").textContent = String(active.length);
    if ($("synergy-list")) $("synergy-list").innerHTML = active.map(([type, count]) => {
      const tier = count >= 4 ? "T2" : "T1";
      return `<div class="synergy-pill"><strong>${type} ${tier}</strong><small>${count} pontos: +dano e habilidades melhores.</small></div>`;
    }).join("") || `<div class="synergy-pill"><small>Junte 2+ do mesmo tipo para ativar bônus.</small></div>`;
    renderRouteSidebars();
    renderDexBadge();
  }

  function gymPool(floor = state.floor || 1) {
    const arena = getArenaForFloor(floor);
    return GYM_POOLS[arena.id] || POOL;
  }

  function gymNpcs(floor = state.floor || 1) {
    const arena = getArenaForFloor(floor);
    return GYM_NPCS[arena.id] || [];
  }

  function findMonByName(name, floor = state.floor || 1) {
    return [...gymPool(floor), ...POOL, ...SPECIAL_FORMS].find((p) => p.name === name) || POOL[0];
  }

  function renderRouteSidebars() {
    const routeTeam = $("route-team");
    if (routeTeam) {
      const visualTeam = state.team
        .map((p, index) => ({ p, index }))
        .sort((a, b) => {
          if ((a.p.currentHp > 0) !== (b.p.currentHp > 0)) return a.p.currentHp > 0 ? -1 : 1;
          return a.index - b.index;
        });
      routeTeam.innerHTML = visualTeam.map(({ p, index }, visualIndex) => `
        <div class="route-team-mon ${p.currentHp <= 0 ? "fainted" : ""} ${visualIndex >= 3 ? "hover-up" : ""}" draggable="true" data-team-index="${index}">
          <b class="team-order">${visualIndex + 1}</b>
          <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
          ${heldItems(p).map((item) => `<img class="held-item-icon" src="${itemSprite(item)}" alt="${item.name}" title="${item.name}">`).join("")}
          <span>${p.name}</span>
          <small>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
          <i style="width:${Math.max(0, Math.round((p.currentHp / p.maxHp) * 100))}%"></i>
          <div class="team-hover-card" aria-label="Detalhes de ${p.name}">
            <div class="team-hover-hero is-hidden">
              <img src="${animated(p)}" alt="" onerror="this.src='${mini(p)}'">
              <div>
                <strong>${p.name}</strong>
            <small>Lv.${p.level} · ${heldItemSummary(p)}</small>
                <small>HP ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
              </div>
            </div>
            <img class="team-hover-sprite" src="${animated(p)}" alt="" onerror="this.src='${mini(p)}'">
            <strong>${p.name}</strong>
            <small>Nivel ${p.level}</small>
            ${renderTypeChips(p.types)}
            ${statList(p)}
            <div class="team-hover-hp">
              <i style="width:${Math.max(0, Math.round((p.currentHp / p.maxHp) * 100))}%"></i>
              <span>${Math.max(0, p.currentHp)}/${p.maxHp}</span>
            </div>
            <div class="team-hover-moves">
              <b>${(p.moves || [])[0]?.name || "Ataque Rapido"}</b>
              ${renderTypeChips([(p.moves || [])[0]?.type || p.types[0]])}
              <small>${(p.moves || [])[0]?.power || 50} PWR</small>
            </div>
            ${heldItems(p).map((item) => `<div class="team-hover-item"><img src="${itemSprite(item)}" alt=""><span><b>${item.name}</b><small>${item.text}</small></span></div>`).join("")}
          </div>
        </div>
      `).join("") || "<p>Sua equipe aparece aqui.</p>";
    }
    const routeItems = $("route-item-preview");
    if (routeItems) {
      routeItems.innerHTML = state.items.length
        ? state.items.slice(-4).map((item, index) => `<button class="bag-item-button" type="button" data-bag-item="${Math.max(0, state.items.length - 4) + index}" title="Equipar ${item.name}"><img src="${itemSprite(item)}" alt="${item.name}"></button>`).join("")
        : "Saco vazio";
    }
    const routeBadges = $("route-badges");
    if (routeBadges) {
      routeBadges.innerHTML = state.badges.length
        ? state.badges.map((badge) => {
          const info = badgeInfo(badge);
          return `<span class="earned route-badge" tabindex="0"><img src="${badgeSprite(badge)}" alt="${info.name}"><em><strong>${info.name}</strong><small>${info.leader}</small></em></span>`;
        }).join("")
        : `<small>Nenhuma ainda</small>`;
    }
  }

  function moveTeamMember(from, to) {
    if (from === to || from < 0 || to < 0 || from >= state.team.length || to >= state.team.length) return;
    const [mon] = state.team.splice(from, 1);
    state.team.splice(to, 0, mon);
    renderRouteSidebars();
    save();
  }

  function getArena() {
    if (state.floor === 0) return ARENAS[0];
    return ARENAS.find((arena) => state.floor >= arena.floorFrom && state.floor < arena.floorTo) || ARENAS[ARENAS.length - 1];
  }

  function nodePreview(node, floor) {
    const arena = getArenaForFloor(floor);
    const trainerNode = (trainer, label, variant = "") => `<span class="node-trainer ${variant}" aria-label="${label}"><img src="${trainerSprite(trainer)}" alt="${label}" onerror="this.remove();this.parentElement.classList.add('sprite-fallback')"></span>`;
    if (node.type === "boss") {
      const bossIndex = Number.isFinite(node.bossIndex) ? node.bossIndex : ARENAS.findIndex((entry) => entry.floorTo === floor);
      const boss = ALL_BOSSES[Math.max(0, bossIndex)];
      return trainerNode(boss.trainer, boss.leader, "boss-trainer-node");
    }
    if (node.type === "camp") {
      return trainerNode("pokemoncenterlady", "Centro Pokémon", "center-trainer-node");
    }
    if (node.type === "move_tutor") {
      return trainerNode("scientist", "Move Tutor", "tutor-trainer-node");
    }
    if (node.type === "train") {
      return trainerNode("acetrainer", "Treinador", "coach-trainer-node");
    }
    if (node.type === "question") {
      const eventNpcs = ["policeman", "rocketgrunt", "doctor", "janitor-gen7"];
      const trainer = eventNpcs[(floor + node.branchSeed) % eventNpcs.length];
      return trainerNode(trainer, "Evento", "event-trainer-node");
    }
    if (node.type === "catch") {
      return `<span class="node-icon pokeball-node" aria-hidden="true"></span>`;
    }
    if (node.sprite === "pokemon") {
      const pool = gymPool(floor);
      const mon = pool[(floor + node.branchSeed) % pool.length];
      return `<img class="node-sprite" src="${animated(mon)}" alt="${mon.name}" onerror="this.src='${mini(mon)}'">`;
    }
    if (node.sprite === "pokeball") {
      return `<span class="node-icon pokeball-node" aria-hidden="true"></span>`;
    }
    if (node.sprite === "tm") return trainerNode("scientist", "Move Tutor", "tutor-trainer-node");
    if (node.sprite === "item") {
      const item = ITEMS[(floor + node.branchSeed) % ITEMS.length];
      return `<img class="node-sprite node-item animated-item" src="${itemSprite(item)}" alt="${item.name}">`;
    }
    if (node.sprite === "grass") {
      return `<span class="node-icon grass-node" aria-hidden="true"></span>`;
    }
    if (node.sprite === "question") return trainerNode("policeman", "Evento", "event-trainer-node");
    if (node.sprite === "stone") {
      return `<img class="node-sprite node-item animated-item" src="${ITEM_BASE}fire-stone.png" alt="Pedra">`;
    }
    if (node.sprite === "masterball") {
      return `<img class="node-sprite node-item animated-item" src="${ITEM_BASE}master-ball.png" alt="Master Ball">`;
    }
    if (node.sprite === "center") return trainerNode("pokemoncenterlady", "Centro Pokémon", "center-trainer-node");
    if (node.sprite === "npc") {
      const npcs = gymNpcs(floor);
      const npc = npcs[(floor + node.branchSeed) % Math.max(1, npcs.length)] || arena;
      return trainerNode(npc.trainer || arena.trainer, npc.name || arena.npc, "battle-trainer-node");
    }
    const npcs = gymNpcs(floor);
    const npc = npcs[(floor + node.branchSeed) % Math.max(1, npcs.length)] || arena;
    return trainerNode(npc.trainer || arena.trainer, npc.name || arena.npc, "battle-trainer-node");
  }

  function getArenaForFloor(floor) {
    return ARENAS.find((arena) => floor > arena.floorFrom && floor <= arena.floorTo) || ARENAS[ARENAS.length - 1];
  }

  function routeLayoutFor(arena) {
    return arena?.id === "league" ? LEAGUE_LAYOUT : ROUTE_LAYOUT;
  }

  function isDirectRoute(prevLayer, nextLayer, fromIndex, toIndex) {
    if (prevLayer.length === 1 || nextLayer.length === 1) {
      const from = prevLayer[fromIndex];
      const to = nextLayer[toIndex];
      return from?.special || to?.special || Math.abs((from?.x || 50) - (to?.x || 50)) <= 30;
    }
    if (prevLayer.length === nextLayer.length) return Math.abs(fromIndex - toIndex) <= 1;
    if (prevLayer.length < nextLayer.length) {
      return toIndex === fromIndex || toIndex === fromIndex + 1;
    }
    return fromIndex === toIndex || fromIndex === toIndex + 1;
  }

  function routeConnections(arena) {
    const lines = [];
    const layout = routeLayoutFor(arena);
    for (let layer = 0; layer < layout.length - 1; layer += 1) {
      const prevLayer = layout[layer];
      const nextLayer = layout[layer + 1];
      prevLayer.forEach((from, i) => {
        nextLayer.forEach((to, j) => {
          const fromFloor = arena.floorFrom + layer;
          const toFloor = arena.floorFrom + layer + 1;
          const active = state.floor === fromFloor && toFloor === state.floor + 1 && connectedToCurrent(arena, layer + 1, j);
          const relevant = fromFloor <= state.floor || active;
          if (relevant && isDirectRoute(prevLayer, nextLayer, i, j)) {
            lines.push({ from, to, active });
          }
        });
      });
    }
    return lines;
  }

  function connectedToCurrent(arena, layer, branch) {
    if (state.floor !== arena.floorFrom + layer - 1) return false;
    if (layer === 1) return true;
    const layout = routeLayoutFor(arena);
    return isDirectRoute(layout[layer - 1], layout[layer], state.branch, branch);
  }

  function currentRoutePosition(arena) {
    const layout = routeLayoutFor(arena);
    if (state.floor <= arena.floorFrom) return layout[0][0];
    const layer = Math.min(layout.length - 1, state.floor - arena.floorFrom);
    return layout[layer]?.[state.branch] || layout[layer]?.[0] || layout[0][0];
  }

  function segmentNodes(arena) {
    const nodes = [];
    for (let floor = arena.floorFrom + 1; floor <= arena.floorTo; floor += 1) {
      const layer = floor - arena.floorFrom;
      (state.map[floor - 1] || []).forEach((node, branch) => {
        const layout = routeLayoutFor(arena);
        const layoutLayer = layout[layer] || layout[layout.length - 1];
        const pos = layoutLayer[branch] || layoutLayer[0];
        const visited = floor <= state.floor;
        const accessible = floor === state.floor + 1 && connectedToCurrent(arena, layer, branch);
        nodes.push({ node, floor, branch, pos, visited, accessible });
      });
    }
    return nodes;
  }

  function currentVisualArena() {
    if (!state.battle) return getArena();
    if (state.battle.draft && state.battle.draftArena) {
      return {
        id: state.battle.draftArena.id || "neutral",
        name: state.battle.draftArena.name || "Arena Draft",
      };
    }
    if (state.battle.arenaId) {
      const battleArena = ARENAS.find((arena) => arena.id === state.battle.arenaId);
      if (battleArena) return battleArena;
    }
    const enemyBadge = state.battle.enemy?.badge || state.battle.enemyTeam?.find((p) => p.badge)?.badge;
    if (enemyBadge) {
      const badgeArena = ARENAS.find((arena) => arena.badge === enemyBadge);
      if (badgeArena) return badgeArena;
    }
    return getArenaForFloor(state.floor || 1);
  }

  function randomStarterChoices() {
    return ["Grass", "Fire", "Water"].map((type) => {
      const candidates = STARTERS.filter((p) => p.types?.[0] === type);
      return candidates[Math.floor(Math.random() * candidates.length)];
    }).filter(Boolean);
  }

  async function randomTowerStarterChoices() {
    await loadNationalDexIndex();
    const picks = [];
    const used = new Set();
    while (picks.length < 3) {
      const mon = await randomNationalPokemon(used);
      if (!mon) break;
      used.add(mon.id);
      picks.push(mon);
    }
    return picks.length === 3 ? picks : [...STARTERS].sort(() => Math.random() - 0.5).slice(0, 3);
  }

  function towerTotalFloors(mode) {
    if (mode.id === "complete") return Math.max(NATIONAL_DEX_LIMIT, nationalDexIndex.length || NATIONAL_DEX_LIMIT);
    return mode.floors || Infinity;
  }

  function setupStarters() {
    state.starterChoices = randomStarterChoices();
    $("starter-grid").innerHTML = state.starterChoices.map((p) => `
      <button class="starter-card" type="button" data-starter="${p.id}">
        <span class="rogue-kicker">${p.trait}</span>
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${sprite(p)}'">
        <strong>${p.name}</strong>
        ${renderTypeChips(p.types)}
        <p>${p.text}</p>
        <small>HP ${p.hp} ? ATK ${p.atk} ? DEF ${p.def} ? VEL ${p.spd}</small>
      </button>
    `).join("");
  }

  async function setupTowerStarters() {
    try {
      state.starterChoices = await randomTowerStarterChoices();
    } catch {
      state.starterChoices = [...STARTERS].sort(() => Math.random() - 0.5).slice(0, 3);
    }
    $("starter-grid").innerHTML = state.starterChoices.map((p) => `
      <button class="starter-card" type="button" data-starter="${p.id}">
        <span class="rogue-kicker">Torre</span>
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${sprite(p)}'">
        <strong>${p.name}</strong>
        ${renderTypeChips(p.types)}
        <p>${p.trait || "Registro nacional"}</p>
        <small>HP ${p.hp} ? ATK ${p.atk} ? DEF ${p.def} ? VEL ${p.spd}</small>
      </button>
    `).join("");
  }

  async function startTowerRun(mode) {
    state.floor = 0;
    state.branch = 0;
    state.threat = 1;
    state.team = [];
    state.items = [];
    state.fallenTeam = [];
    state.map = [];
    state.battle = null;
    state.sashUsed = false;
    state.badges = [];
    state.offer = [];
    state.starterChoices = [];
    state.pendingItem = null;
    state.pendingEvolutions = [];
    state.pendingEvolutionChoices = [];
    state.pendingMapFloor = null;
    state.tower = { active: true, mode: mode.id, title: mode.title, totalFloors: towerTotalFloors(mode), clearsUnlock: mode.id, secondChanceUsed: false, guaranteedRecruitUsed: false };
    state.lastTowerMode = mode.id;
    state.routeVersion = ROUTE_VERSION;
    state.battleSpeed = 2;
    state.nuzlockeMode = false;
    state.levelCapEnabled = false;
    $("screen-starters")?.querySelector(".rogue-kicker") && ($("screen-starters").querySelector(".rogue-kicker").textContent = "Subir Torre");
    $("screen-starters")?.querySelector("h2") && ($("screen-starters").querySelector("h2").textContent = `Escolha o inicial da ${mode.title}`);
    show("starters");
    $("starter-grid").innerHTML = `<button class="starter-card" type="button" disabled><span class="rogue-kicker">Torre</span><strong>Carregando...</strong><p>Preparando escolhas iniciais.</p></button>`;
    await setupTowerStarters();
    save();
  }

  function newRun() {
    state.floor = 0;
    state.branch = 0;
    state.threat = 1;
    state.team = [];
    state.items = [];
    state.fallenTeam = [];
    state.map = [];
    state.battle = null;
    state.sashUsed = false;
    state.badges = [];
    state.offer = [];
    state.starterChoices = [];
    state.pendingEvolutions = [];
    state.pendingEvolutionChoices = [];
    state.pendingMapFloor = null;
    state.tower = null;
    state.lastTowerMode = null;
    state.routeVersion = ROUTE_VERSION;
    state.battleSpeed = 2;
    state.nuzlockeMode = !!$("run-nuzlocke")?.checked;
    state.levelCapEnabled = state.nuzlockeMode;
    $("screen-starters")?.querySelector(".rogue-kicker") && ($("screen-starters").querySelector(".rogue-kicker").textContent = "Laboratório do Professor Oak");
    $("screen-starters")?.querySelector("h2") && ($("screen-starters").querySelector("h2").textContent = "Escolha seu Pokémon inicial");
    setupStarters();
    show("starters");
  }

  async function chooseStarter(id) {
    const starter = (state.starterChoices?.length ? state.starterChoices : STARTERS).find((p) => p.id === id);
    if (!starter) return state.tower?.active ? setupTowerStarters() : setupStarters();
    state.team = [maybeMarkShiny(cloneMon(starter, state.tower?.active ? 8 : 5))];
    state.starterChoices = [];
    state.team[0].runId ||= uid("mon");
    registerDexSeen(state.team[0]);
    if (state.tower?.active) {
      state.team[0].energy = 4;
      save();
      return startTowerFloor(1);
    }
    buildMap();
    renderMap();
    save();
  }

  function pickNodeSet(floor) {
    const arena = getArenaForFloor(floor);
    if (arena.id === "league") {
      const leagueIndex = floor - arena.floorFrom - 1;
      const boss = LEAGUE_BOSSES[leagueIndex];
      return [{ type: "boss", label: boss?.leader || "Liga", icon: "L", branchSeed: floor, bossIndex: BOSSES.length + leagueIndex, copy: "Vença a Liga Pokémon para provar sua equipe." }];
    }
    if (ARENAS.some((entry) => entry.floorTo === floor)) return [{ type: "boss", label: "Líder", icon: "L", branchSeed: floor, copy: "Derrote o líder para ganhar a insígnia e abrir o próximo ginásio." }];
    const localLayer = floor - arena.floorFrom;
    if (floor === 1) return [
      { type: "catch", label: "Recrutar", icon: "P", sprite: "pokemon", copy: "Primeira rota de recrutamento.", branchSeed: 0 },
      { type: "catch", label: "Recrutar", icon: "P", sprite: "pokemon", copy: "Segunda rota de recrutamento.", branchSeed: 1 }
    ];
    if (floor === arena.floorTo - 1) {
      const centerBranch = Math.floor(Math.random() * 2);
      const sideTypes = ["battle", "item", "question", "move_tutor"];
      return [0, 1].map((branch) => {
        if (arena.badge >= 5 && branch !== centerBranch) {
          return { type: "legendary", label: "Lendário", icon: "MB", sprite: "masterball", copy: "Uma Master Ball chama um lendário aleatório antes do líder.", branchSeed: branch };
        }
        if (branch === centerBranch) {
          return { type: "camp", label: "Centro", icon: "+", sprite: "center", copy: "Cura o time e reduz risco antes do líder.", branchSeed: branch };
        }
        const type = sideTypes[(floor + branch + state.badges.length + (state.team[0]?.id || 0)) % sideTypes.length];
        const node = NODE_TYPES.find((entry) => entry.type === type) || NODE_TYPES[0];
        return { ...node, branchSeed: branch };
      });
    }
    const layout = routeLayoutFor(arena);
    const layoutLayer = layout[localLayer] || layout[layout.length - 1];
    const weighted = localLayer >= 7
      ? ["camp", "battle", "battle", "question", "item", "move_tutor"]
      : ["battle", "battle", "grass", "grass", "catch", "item", "question", "move_tutor", "train", "stone"];
    const wanted = layoutLayer.map((_, branch) => {
      const seed = (floor * 37 + branch * 17 + state.team[0]?.id * 13 + state.badges.length * 19) % weighted.length;
      return weighted[(seed + Math.floor(Math.random() * weighted.length)) % weighted.length];
    });
    if (!wanted.includes("battle") && !wanted.includes("grass")) wanted[0] = "battle";
    return wanted.map((type, branchSeed) => {
      const node = NODE_TYPES.find((entry) => entry.type === type) || NODE_TYPES[0];
      return { ...node, branchSeed };
    });
  }

  function buildMap() {
    state.map = Array.from({ length: RUN_FLOORS }, (_, i) => pickNodeSet(i + 1));
  }

  function renderMap() {
    const arena = getArena();
    $("map-title").textContent = arena.name;
    const currentPos = currentRoutePosition(arena);
    const lines = routeConnections(arena);
    const svgLines = lines.map((line) => `
      <line x1="${line.from.x}" y1="${line.from.y}" x2="${line.to.x}" y2="${line.to.y}" class="${line.active ? "active" : ""}" />
    `).join("");
    const nodeButtons = [
      `<div class="map-start-node animated-npc" style="left:${currentPos.x}%;top:${currentPos.y}%"><img src="${trainerSprite(getArenaForFloor(state.floor || 1).trainer)}" alt="Treinador" onerror="this.style.display='none'"></div>`,
      ...segmentNodes(arena).map(({ node, floor, branch, pos, visited, accessible }) => {
        const edgeClass = `${pos.x < 25 ? " tooltip-right" : ""}${pos.x > 75 ? " tooltip-left" : ""}${pos.y < 18 ? " tooltip-down" : ""}`;
        const displayLabel = node.type === "boss"
          ? ALL_BOSSES[Math.max(0, Number.isFinite(node.bossIndex) ? node.bossIndex : ARENAS.findIndex((entry) => entry.floorTo === floor))]?.leader || node.label
          : node.label;
        return `
          <button class="map-node route-node ${visited ? "is-visited" : ""} ${accessible ? "is-accessible" : "is-locked"}${edgeClass}" style="left:${pos.x}%;top:${pos.y}%" type="button" data-floor="${floor}" data-branch="${branch}" ${accessible ? "" : "disabled"}>
            ${nodePreview(node, floor)}
            <strong>${displayLabel}</strong>
            <span class="map-node-tooltip">
              <b>${displayLabel}</b>
              <small>${node.copy || "Evento da rota."}</small>
            </span>
          </button>
        `;
      })
    ].join("");
    $("rogue-map").innerHTML = `
      <div class="map-pixel-frame arena-${arena.id}">
        ${renderMapDecor(arena)}
        <svg class="route-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${svgLines}</svg>
        ${nodeButtons}
      </div>
    `;
    show("map");
  }

  function renderMapDecor(arena) {
    const sets = {
      rock: [["rock", 20, 24], ["rock", 74, 70], ["ledge", 14, 54], ["sign", 82, 88], ["tall-grass", 18, 72], ["mon", 16, 84, "geodude"], ["mon", 82, 38, "onix"]],
      water: [["pond", 20, 26], ["pond", 78, 66], ["reeds", 14, 76], ["sign", 84, 88], ["tall-grass", 82, 48], ["mon", 18, 86, "staryu"], ["mon", 82, 35, "psyduck"]],
      electric: [["coil", 18, 24], ["bolt", 78, 34], ["coil", 84, 76], ["sign", 14, 88], ["tall-grass", 18, 68], ["mon", 17, 82, "pikachu"], ["mon", 84, 42, "voltorb"]],
      grass: [["flower", 18, 24], ["flower", 82, 38], ["tree", 15, 78], ["tree", 84, 80], ["tall-grass", 50, 68], ["mon", 18, 86, "oddish"], ["mon", 82, 34, "bellsprout"]],
      poison: [["sludge", 20, 26], ["sludge", 80, 66], ["vent", 15, 78], ["sign", 84, 88], ["tall-grass", 82, 48], ["mon", 18, 84, "koffing"], ["mon", 82, 36, "grimer"]],
      psychic: [["rune", 22, 28], ["rune", 78, 62], ["orb", 16, 80], ["orb", 84, 82], ["tall-grass", 18, 68], ["mon", 18, 86, "abra"], ["mon", 82, 34, "drowzee"]],
      fire: [["lava", 20, 26], ["lava", 78, 68], ["ember", 16, 80], ["sign", 84, 88], ["tall-grass", 82, 48], ["mon", 18, 84, "growlithe"], ["mon", 82, 36, "ponyta"]],
      ground: [["crack", 20, 30], ["crack", 80, 68], ["rock", 16, 82], ["sign", 84, 88], ["tall-grass", 18, 68], ["mon", 18, 84, "sandshrew"], ["mon", 82, 36, "diglett"]],
      league: [["orb", 18, 18], ["rune", 82, 22], ["ice", 18, 34], ["rock", 82, 42], ["sludge", 18, 58], ["bolt", 82, 62], ["mon", 18, 82, "dragonite"], ["mon", 82, 84, "blastoise"]]
    };
    return (sets[arena.id] || sets.rock).map(([kind, x, y, mon]) => {
      if (kind === "mon") {
        return `<img class="map-decor decor-mon" style="left:${x}%;top:${y}%" src="${ANIM_BASE}${mon}.gif" alt="" onerror="this.style.display='none'">`;
      }
      return `<span class="map-decor decor-${kind}" style="left:${x}%;top:${y}%"></span>`;
    }).join("");
  }

  async function enterNode(floor, branch) {
    const node = state.map[floor - 1][branch];
    state.floor = floor;
    state.branch = branch;
    if (node.type === "boss" || ARENAS.some((arena) => arena.floorTo === floor)) return startBattle({ ...node, type: "boss" });
    if (node.type === "battle" || node.type === "grass" || node.type === "boss" || node.type === "legendary") await startBattle(node);
    if (node.type === "catch") await showCatch();
    if (node.type === "item") showItem();
    if (node.type === "question") showRandomEventExpanded();
    if (node.type === "move_tutor") showMoveTutor();
    if (node.type === "stone") await showEvolutionStone();
    if (node.type === "camp") showCamp();
    if (node.type === "train") showTrain();
    save();
  }

  function randomPool(count, boss = false, floor = state.floor || 1) {
    const source = boss ? BOSSES : gymPool(floor);
    return [...source].sort(() => Math.random() - 0.5).slice(0, count);
  }

  function recruitPool(count = 3) {
    const ownedIds = new Set(state.team.map((p) => p.id));
    const ownedNames = new Set(state.team.map((p) => p.name));
    const local = gymPool(state.floor);
    const mixed = [...local, ...POOL].sort(() => Math.random() - 0.5);
    const unique = [];
    mixed.forEach((p) => {
      if (ownedIds.has(p.id) || ownedNames.has(p.name)) return;
      if (!unique.some((entry) => entry.id === p.id || entry.name === p.name)) unique.push(p);
    });
    return unique.slice(0, count);
  }

  async function recruitPoolExpanded(count = 3) {
    const ownedIds = new Set(state.team.map((p) => p.id));
    const picks = recruitPool(count);
    while (picks.length < count) {
      const mon = await randomNationalPokemon(new Set([...ownedIds, ...picks.map((p) => p.id)]));
      if (!mon) break;
      picks.push(mon);
    }
    if (nationalDexIndex.length && Math.random() < 0.65) {
      const index = Math.floor(Math.random() * Math.max(1, picks.length));
      const mon = await randomNationalPokemon(new Set([...ownedIds, ...picks.map((p) => p.id)]));
      if (mon) picks[index] = mon;
    }
    return picks.slice(0, count);
  }

  function itemPool(count = 3) {
    const mixed = [...ITEMS].sort(() => Math.random() - 0.5);
    const unique = [];
    mixed.forEach((item) => {
      if (!unique.some((entry) => (entry.sprite || entry.id) === (item.sprite || item.id))) unique.push(item);
    });
    return unique.slice(0, count);
  }

  function itemBonusLines(item) {
    const value = itemBonusText(item);
    const lines = {
      heal: ["Sustento: cura após atacar", "HP efetivo maior em lutas longas"],
      crit: ["Crítico +18%", "Mais chance de dano explosivo"],
      atk: ["ATK +14%", "Aumenta o dano base"],
      spd: ["VEL +15%", "Ataca antes com mais frequencia"],
      def: ["DEF +12%", "Reduz dano recebido"],
      hp: ["HP +12%", "Mais margem para sobreviver"],
      damage: ["Dano final +16%", "Finaliza lutas mais rápido"],
      synergy: ["Sinergia +1", "Melhora consistencia do time"],
      sash: ["Sobrevive a golpe fatal 1x", "Seguro contra derrota inesperada"]
    };
    const dynamicLines = {
      heal: [`Cura ${value} apos atacar`, "HP efetivo maior em lutas longas"],
      crit: [`Crítico ${value}`, "Mais chance de dano explosivo"],
      atk: [`ATK ${value}`, "Aumenta o dano base"],
      spd: [`VEL ${value}`, "Ataca antes com mais frequencia"],
      def: [`DEF ${value}`, "Reduz dano recebido"],
      hp: [`HP ${value}`, "Mais margem para sobreviver"],
      damage: [`Dano final ${value}`, "Finaliza lutas mais rápido"],
      synergy: [`Sinergia ${value}`, "Melhora consistencia do time"],
      sash: lines.sash
    };
    return dynamicLines[item?.kind] || ["Bônus especial da run"];
  }

  function itemShortText(item) {
    return itemBonusLines(item)[0] || item?.text || "Bônus especial da run";
  }

  function itemBonusMarkup(item) {
    return `<div class="item-bonus-list">${itemBonusLines(item).map((line) => `<span>${line}</span>`).join("")}</div>`;
  }

  function statPreviewWithItem(p, item) {
    const before = displayStats(p);
    const after = {
      hp: Math.round(before.hp * (item?.kind === "hp" ? 1 + itemBonusValue(item) : 1)),
      atk: Math.round(before.atk * (item?.kind === "atk" ? 1 + itemBonusValue(item) : 1)),
      def: Math.round(before.def * (item?.kind === "def" ? 1 + itemBonusValue(item) : 1)),
      spd: Math.round(before.spd * (item?.kind === "spd" ? 1 + itemBonusValue(item) : 1))
    };
    return `<div class="stat-preview">
      ${[
        ["HP", before.hp, after.hp],
        ["ATK", before.atk, after.atk],
        ["DEF", before.def, after.def],
        ["VEL", before.spd, after.spd]
      ].map(([label, from, to]) => `<span class="${to > from ? "buffed" : ""}"><i>${label}</i><b>${from}</b><em>${to > from ? `â†’ ${to}` : "â€”"}</em></span>`).join("")}
    </div>`;
  }

  function activePlayer() {
    const playerTeam = state.battle?.playerTeam || state.team;
    if (!state.battle) return playerTeam.find((p) => p.currentHp > 0);
    const start = Math.max(0, state.battle.playerIndex || 0);
    const current = playerTeam[start];
    if (current?.currentHp > 0) return current;
    const nextIndex = playerTeam.findIndex((p, index) => index > start && p.currentHp > 0);
    if (nextIndex !== -1) {
      state.battle.playerIndex = nextIndex;
      return playerTeam[nextIndex];
    }
    return null;
  }

  function averageTeamLevel() {
    const alive = state.team.filter((p) => p.currentHp > 0);
    const source = alive.length ? alive : state.team;
    if (!source.length) return 5;
    return Math.round(source.reduce((total, p) => total + (p.level || 5), 0) / source.length);
  }

  function recruitLevel(floor = state.floor || 1) {
    const arena = getArenaForFloor(floor);
    const cap = levelCapForFloor(floor);
    const local = Math.max(1, floor - arena.floorFrom);
    const routeProgress = Math.floor((local - 1) / 2);
    const teamLevel = averageTeamLevel();
    const assist = state.tower?.active ? 2 : state.nuzlockeMode ? 1 : 0;
    const target = Math.max(5, Math.min(cap - 1, Math.round(teamLevel * 0.92) + routeProgress + 1 + assist));
    return Math.max(3, target);
  }

  function enemyLevel(kind = "wild", index = 0) {
    const arena = getArenaForFloor(state.floor || 1);
    const local = Math.max(1, (state.floor || 1) - arena.floorFrom);
    const teamLevel = averageTeamLevel();
    const routePressure = Math.floor((local - 1) / 3);
    const kindBoost = kind === "boss" ? (state.nuzlockeMode ? 1 : 2) : kind === "npc" ? 1 : kind === "grass" ? 0 : -1;
    const threatBoost = state.nuzlockeMode ? Math.max(0, Math.floor(state.threat - 1.6)) : Math.max(0, Math.floor(state.threat - 1));
    const arenaBaseline = arena.id === "league" ? 58 + index * 2 : 5 + (arena.badge - 1) * 4 + routePressure;
    const nuzlockeRelief = state.nuzlockeMode ? (kind === "boss" ? 1 : 2) : 0;
    const level = Math.max(teamLevel, arenaBaseline) + kindBoost + threatBoost + index - nuzlockeRelief;
    const gymSoftCap = arena.id === "league" ? 100 : levelCapForArena(arena) + (kind === "boss" ? (state.nuzlockeMode ? 0 : 1) : -2);
    const capped = Math.min(level, gymSoftCap);
    return state.levelCapEnabled ? Math.min(capped, currentLevelCap() + (kind === "boss" ? 1 : 0)) : capped;
  }

  function legendaryLevel() {
    const arena = getArenaForFloor(state.floor || 1);
    const cap = levelCapForArena(arena);
    const teamLevel = averageTeamLevel();
    const target = Math.max(teamLevel + 3, cap - 1);
    return state.levelCapEnabled ? Math.min(target, currentLevelCap() + 1) : target;
  }

  async function createEnemy(boss) {
    const arenaIndex = ARENAS.findIndex((arena) => arena.floorTo === state.floor);
    const leader = boss ? ALL_BOSSES[Math.max(0, arenaIndex)] : null;
    let base = boss ? leader.team[0] : randomPool(1, false, state.floor)[0];
    if (!boss && nationalDexIndex.length && Math.random() < 0.55) {
      base = await randomNationalPokemon() || base;
    }
    const level = enemyLevel(boss ? "boss" : "grass");
    const enemy = maybeMarkShiny(cloneMon(base, level));
    enemy.maxHp = Math.round(enemy.maxHp * (boss ? 1.35 : 1));
    enemy.currentHp = enemy.maxHp;
    if (leader) {
      enemy.leader = leader.leader;
      enemy.trainer = leader.trainer;
      enemy.badge = leader.badge;
      enemy.arena = leader.arena;
      enemy.teamIndex = 0;
    }
    return enemy;
  }

  function towerEnemyLevel() {
    const floor = Math.max(1, state.floor || 1);
    const teamLevel = averageTeamLevel();
    if (floor <= 8) return Math.max(5, Math.min(teamLevel, Math.round(teamLevel + Math.max(0, (floor - 1) * 0.08))));
    const pressure = floor <= 15
      ? 0.25 + (floor - 8) * 0.14
      : 1.25 + (floor - 15) * 0.22;
    return Math.max(5, Math.round(teamLevel + pressure));
  }

  async function createTowerEnemy() {
    const floor = Math.max(1, state.floor || 1);
    const protectedFloor = floor <= 5;
    const rareFloor = !protectedFloor && floor % 10 === 0;
    let base = rareFloor && Math.random() < 0.55
      ? LEGENDARY_POOL[Math.floor(Math.random() * LEGENDARY_POOL.length)]
      : await randomNationalPokemon() || randomPool(1, false, floor)[0];
    if (protectedFloor) {
      let attempts = 0;
      while (LEGENDARY_POOL.some((mon) => mon.id === base?.id) && attempts < 8) {
        base = await randomNationalPokemon() || randomPool(1, false, floor)[0];
        attempts += 1;
      }
      if (LEGENDARY_POOL.some((mon) => mon.id === base?.id)) base = randomPool(1, false, floor)[0];
    }
    const enemy = maybeMarkShiny(cloneMon(base, towerEnemyLevel()));
    if (rareFloor && !enemy.legendary) enemy.shiny = true;
    enemy.maxHp = Math.round(enemy.maxHp * (rareFloor ? 1.42 : 1 + Math.min(0.28, Math.max(0, floor - 6) * 0.003)));
    enemy.currentHp = enemy.maxHp;
    enemy.leader = rareFloor ? "Encontro raro" : "Torre";
    enemy.legendary = rareFloor && LEGENDARY_POOL.some((mon) => mon.id === base.id);
    return enemy;
  }

  function createLeaderTeam(node = {}) {
    const arenaIndex = ARENAS.findIndex((arena) => arena.floorTo === state.floor);
    const bossIndex = Number.isFinite(node.bossIndex) ? node.bossIndex : arenaIndex;
    const leader = ALL_BOSSES[Math.max(0, bossIndex)];
    return leader.team.map((mon, index) => {
      const enemy = maybeMarkShiny(cloneMon(mon, enemyLevel("boss", index)));
      const aceBoost = state.nuzlockeMode ? (index === leader.team.length - 1 ? 1.42 : 1.12) : (index === leader.team.length - 1 ? 1.65 : 1.22);
      enemy.maxHp = Math.round(enemy.maxHp * aceBoost);
      enemy.currentHp = enemy.maxHp;
      enemy.leader = leader.leader;
      enemy.trainer = leader.trainer;
      enemy.badge = leader.badge;
      enemy.arena = leader.arena;
      enemy.teamIndex = index;
      return enemy;
    });
  }

  function createLegendaryTeam(node = {}) {
    const seed = (state.floor * 17 + (node.branchSeed || 0) * 31 + state.badges.length * 13 + Math.floor(Math.random() * LEGENDARY_POOL.length)) % LEGENDARY_POOL.length;
    const base = LEGENDARY_POOL[seed];
    const enemy = maybeMarkShiny(cloneMon(base, legendaryLevel()));
    enemy.maxHp = Math.round(enemy.maxHp * 2.25);
    enemy.atk = Math.round(enemy.atk * 1.12);
    enemy.def = Math.round(enemy.def * 1.08);
    enemy.spd = Math.round(enemy.spd * 1.05);
    enemy.currentHp = enemy.maxHp;
    enemy.leader = "Master Ball";
    enemy.trainer = null;
    enemy.teamIndex = 0;
    enemy.legendary = true;
    return [enemy];
  }

  async function createNpcTeam(node) {
    const npcs = gymNpcs(state.floor);
    const npc = npcs[(state.floor + (node.branchSeed || 0)) % Math.max(1, npcs.length)];
    if (!npc) return { trainerName: "Oponente", trainerSpriteId: null, team: [await createEnemy(false)] };
    const team = [];
    for (const [index, name] of npc.team.entries()) {
      let base = findMonByName(name, state.floor);
      if (nationalDexIndex.length && Math.random() < 0.22) base = await randomNationalPokemon() || base;
      const enemy = maybeMarkShiny(cloneMon(base, enemyLevel("npc", index)));
      enemy.maxHp = Math.round(enemy.maxHp * 1.12);
      enemy.currentHp = enemy.maxHp;
      enemy.leader = npc.name;
      enemy.trainer = npc.trainer;
      team.push(enemy);
    }
    return { trainerName: npc.name, trainerSpriteId: npc.trainer, team };
  }

  async function startBattle(node) {
    if (!activePlayer()) return endRun(false);
    state.autoBattling = false;
    state.battleSpeed = 2;
    stopBattleSpeedCountdown();
    const towerBattle = !!state.tower?.active;
    const bossBattle = node.type === "boss" || ARENAS.some((arena) => arena.floorTo === state.floor);
    const legendaryBattle = node.type === "legendary";
    const npcBattle = node.type === "battle";
    const npcData = npcBattle ? await createNpcTeam(node) : null;
    const enemyTeam = towerBattle ? [await createTowerEnemy()] : bossBattle ? createLeaderTeam(node) : legendaryBattle ? createLegendaryTeam(node) : npcBattle ? npcData.team : [await createEnemy(false)];
    resetBattleHpVisuals(state.team);
    resetBattleHpVisuals(enemyTeam);
    registerDexSeenMany(enemyTeam);
    state.battle = { playerTeam: state.team, enemyTeam, enemyIndex: 0, playerIndex: state.team.findIndex((p) => p.currentHp > 0), enemy: enemyTeam[0], boss: !towerBattle && bossBattle, legendary: towerBattle ? !!enemyTeam[0].legendary : legendaryBattle, npc: !towerBattle && npcBattle, tower: towerBattle, arenaId: getArenaForFloor(state.floor || 1).id, trainerName: towerBattle ? "Torre" : npcData?.trainerName || null, trainerSpriteId: towerBattle ? null : npcData?.trainerSpriteId || enemyTeam[0]?.trainer || null, speedBoostStartedAt: Date.now() };
    $("battle-title").textContent = towerBattle
      ? `${state.tower.title} ? Andar ${state.floor}`
      : node.type === "boss"
      ? `${state.battle.enemy.leader} enviou ${state.battle.enemy.name}`
      : node.type === "legendary"
        ? `A Master Ball revelou ${state.battle.enemy.name}`
      : node.type === "battle"
        ? `${state.battle.trainerName} desafiou você`
        : `${state.battle.enemy.name} apareceu no mato`;
    $("battle-log").textContent = "Batalha iniciada. O time usa automaticamente energia, moves e itens equipados.";
    renderBattle();
    playBattleSfx("start");
    show("battle");
    save();
    window.setTimeout(() => animateBattleSendOut(), sendoutDelay(80));
    scheduleAutoBattle(980);
  }

  function scheduleAutoBattle(delay = 450) {
    window.setTimeout(() => {
      if (!state.battle || state.autoBattling) return;
      if (state.screen !== "battle") {
        scheduleAutoBattle(120);
        return;
      }
      runAutoBattle();
    }, delay);
  }

  function renderBattle() {
    if (!state.battle) return;
    maybeAutoPromoteBattleSpeed();
    const isTowerBattle = true;
    document.querySelector(".battle-grid")?.classList.toggle("tower-battle-grid", isTowerBattle);
    document.querySelector(".battle-grid")?.classList.toggle("battle-speed-3x", state.battleSpeed === 3);
    document.querySelector(".battle-grid")?.classList.toggle("battle-speed-2x", state.battleSpeed === 2);
    const playerTeam = state.battle.playerTeam || state.team;
    const currentPlayer = playerTeam[state.battle.playerIndex || 0];
    const player = isPendingBattleFaint(currentPlayer)
      ? currentPlayer
      : activePlayer() || currentPlayer || playerTeam.find((p) => p.currentHp <= 0) || playerTeam[0];
    if (!player) return;
    const playerLabel = state.battle.draft ? state.battle.draftLeftLabel || "Player 1" : "Seu time";
    const enemyLabel = state.battle.draft
      ? state.battle.draftRightLabel || "Player 2"
      : state.battle.boss ? state.battle.enemy.leader : state.battle.legendary ? "Lendário" : state.battle.npc ? state.battle.trainerName : "Inimigo";
    renderBattleRoster("player-card", state.battle.playerTeam || state.team, player, playerLabel, playerTrainerSprite(), "player", isTowerBattle);
    renderBattleRoster("enemy-card", state.battle.enemyTeam, state.battle.enemy, enemyLabel, state.battle.trainerSpriteId || state.battle.enemy.trainer, "enemy", isTowerBattle);
    renderDraftActivePopups(player, state.battle.enemy);
    const draftBansSlot = $("battle-draft-bans");
    if (draftBansSlot) {
      draftBansSlot.innerHTML = state.battle.draft ? `
        <div class="draft-battle-info">
          <div class="draft-match-clock">Tempo <b data-draft-match-clock>${formatDraftDuration(draftCurrentDurationMs())}</b></div>
          ${draftArenaEffectMarkup(state.battle.draftArena)}
        </div>
      ` : "";
    }
    if (state.battle.draft) startDraftMatchClock();
    animateRenderedHpBars();
    applyTowerBattleInlineLayout(isTowerBattle);
    const countdown = battleSpeedCountdownSeconds();
    $("move-grid").innerHTML = `<button class="battle-speed-toggle ${state.battleSpeed >= 2 ? "is-active" : ""} ${state.battleSpeed === 3 ? "is-3x" : ""}" type="button" data-battle-speed="1" aria-pressed="${state.battleSpeed >= 2 ? "true" : "false"}" title="${state.battleSpeed === 3 ? "Velocidade maxima ativa" : "Alternar velocidade"}" ${state.battleSpeed === 3 ? "disabled" : ""}>${state.battleSpeed === 3 ? "3x" : "2x"}${state.battleSpeed === 2 && countdown > 0 ? `<small>${countdown}s</small>` : ""}</button>`;
    if (isTowerBattle) positionTowerVsBadge();
  }

  function renderDraftActivePopups(leftMon, rightMon) {
    const leftSlot = $("draft-active-left");
    const rightSlot = $("draft-active-right");
    if (!leftSlot || !rightSlot) return;
    if (!state.battle?.draft) {
      leftSlot.innerHTML = "";
      rightSlot.innerHTML = "";
      return;
    }
    const leftLabel = state.battle.draftLeftLabel || "Player 1";
    const rightLabel = state.battle.draftRightLabel || "Player 2";
    leftSlot.innerHTML = draftActivePopupMarkup(leftMon, leftLabel, "left");
    rightSlot.innerHTML = draftActivePopupMarkup(rightMon, rightLabel, "right");
  }

  function signedPercent(value) {
    const pct = Math.round((value - 1) * 100);
    return `${pct > 0 ? "+" : ""}${pct}%`;
  }

  function draftRelicEffectLines(relic, mon = null) {
    if (!relic) return ["Nenhuma relíquia equipada"];
    const lines = {
      "focus-band": ["Sobrevive a 1 golpe fatal"],
      "shell-bell": ["Cura +9% HP ao agir", "Dano final -6%"],
      "quick-claw": ["Velocidade +15%", "Dano final -5%"],
      "scope-lens": ["Crítico +16%", "Recebe +5% dano"],
      leftovers: ["Cura +8% HP ao agir", "Dano final -6%"],
      "type-charm": ["STAB +14%", "Fora do tipo -5%"],
      "life-orb": ["Dano final +20%", "Recuo 6% HP"],
      "muscle-band": ["Ataque +14%", "Defesa -6%", "Velocidade -6%"],
      "wise-glasses": ["Dano final +8%", "Defesa -4%"],
      "choice-scarf": ["Velocidade +18%", "Dano final -8%"],
      "assault-vest": ["Recebe -12% dano", "Velocidade -8%"],
      "rocky-helmet": ["Recebe -6% dano", "Atacante sofre 4%"],
      "sitrus-berry": ["Cura +7% HP ao agir"],
      "lum-berry": ["Recebe -6% dano", "Dano final -4%"],
      metronome: [`Dano ${signedPercent(draftRelicOutgoingModifier(mon, mon?.types?.[0] || "Normal"))}`, "Escala por duelo vencido"],
      "razor-claw": ["Crítico +20%", "Recebe +8% dano"],
      "king-rock": ["Dano final +8%", "Defesa -4%"],
      "bright-powder": ["Recebe -8% dano", "Dano final -6%"],
      charcoal: ["Fire +14%", "Fora do tipo -4%"],
      "mystic-water": ["Water +14%", "Fora do tipo -4%"],
      magnet: ["Electric +14%", "Defesa -4%"],
      "miracle-seed": ["Grass +14%", "Cura 4% do dano", "Fora do tipo -4%"],
      "black-belt": ["Fighting +14%", "Recebe +5% dano"],
      "dragon-fang": ["Dragon +18%", "Velocidade -6%"],
    }[relic.id];
    return lines || [draftRelicBonusSummary(relic)];
  }

  function draftActivePopupMarkup(mon, label, side) {
    if (!mon) return "";
    const hpPct = Math.max(0, Math.min(100, Math.round(((mon.currentHp || 0) / Math.max(1, mon.maxHp || 1)) * 100)));
    const relic = heldItems(mon)[0] || null;
    const arenaNote = draftArenaBonusForPokemon(mon, state.battle?.draftArena);
    const statRows = [
      ["HP", `${Math.max(0, mon.currentHp || 0)}/${mon.maxHp || 1}`],
      ["ATK", atkVal(mon)],
      ["DEF", defVal(mon)],
      ["VEL", speedVal(mon)],
      ["ENE", mon.energy ?? 0],
    ];
    const relicLines = draftRelicEffectLines(relic, mon);
    return `
      <div class="draft-active-popup-card side-${side}">
        <header>
          <span>${label}</span>
          <strong>${mon.name}</strong>
          <small>${(mon.types || ["Normal"]).join(" / ")}</small>
        </header>
        <div class="draft-active-hp"><span style="width:${hpPct}%"></span></div>
        <div class="draft-active-stats">
          ${statRows.map(([name, value]) => `<span><b>${name}</b><em>${value}</em></span>`).join("")}
        </div>
        <div class="draft-active-bonus">
          ${relic ? `<img src="${itemSprite(relic)}" alt="">` : ""}
          <div>
            <span><b>Relíquia</b><em>${relic ? relic.name : "Nenhuma"}</em></span>
            ${relicLines.map((line) => `<span><b>Efeito</b><em>${line}</em></span>`).join("")}
            <span><b>Arena</b><em>${arenaNote}</em></span>
          </div>
        </div>
      </div>
    `;
  }

  function renderBattleRoster(id, mons, active, label, trainer, side = "", useTeamBalls = false, activeOnly = false) {
    const orderedMons = [...mons].sort((a, b) => {
      if (a === active) return -1;
      if (b === active) return 1;
      const aAlive = a.currentHp > 0 || isPendingBattleFaint(a);
      const bAlive = b.currentHp > 0 || isPendingBattleFaint(b);
      if (aAlive !== bAlive) return aAlive ? -1 : 1;
      return mons.indexOf(a) - mons.indexOf(b);
    });
    $(id).innerHTML = `
      <div class="battle-trainer-head ${side}">
        ${trainer ? `<img src="${trainerSprite(trainer)}" alt="${label}" onerror="this.style.display='none'">` : ""}
        <span class="rogue-kicker">${label}</span>
      </div>
      <div class="battle-stack count-${activeOnly || useTeamBalls ? 1 : Math.min(6, Math.max(1, mons.length))}">
        ${useTeamBalls || activeOnly ? renderBattleSlot(active || orderedMons[0], true, side) : orderedMons.map((p) => renderBattleSlot(p, p === active, side)).join("")}
        ${useTeamBalls ? renderBattleTeamBalls(mons, active) : ""}
      </div>
    `;
  }

  function renderBattleTeamBalls(mons, active) {
    return `<div class="battle-team-balls" aria-label="Pokémon do time">
      ${mons.map((p, index) => {
        const fainted = p.currentHp <= 0 && !isPendingBattleFaint(p);
        const pendingFaint = p.currentHp <= 0 && isPendingBattleFaint(p);
        const activeClass = p === active ? "is-active" : "";
        const faintedClass = fainted ? "is-fainted" : pendingFaint ? "is-pending-faint" : "";
        return `<span class="battle-team-ball ${activeClass} ${faintedClass}" title="${index + 1}. ${p.name}${fainted || pendingFaint ? " derrotado" : ""}" aria-label="${index + 1}. ${p.name}${fainted || pendingFaint ? " derrotado" : ""}">
          <img class="animated-item" src="${pokemonBallSprite(p)}" alt="">
        </span>`;
      }).join("")}
    </div>`;
  }

  function resetBattleHpVisuals(mons = []) {
    mons.forEach((p) => {
      if (!p) return;
      delete p.renderedHpPct;
      delete p.renderedHpValue;
      delete p.renderedMaxHpValue;
      delete p.pendingFaintUntil;
    });
  }

  function applyTowerBattleInlineLayout(isTowerBattle) {
    const grid = document.querySelector(".battle-grid");
    const screen = $("screen-battle");
    if (!grid) return;
    if (!isTowerBattle) {
      grid.removeAttribute("style");
      screen?.removeAttribute("style");
      document.querySelector(".tower-vs-badge")?.removeAttribute("style");
      document.querySelector(".battle-speed-toggle")?.removeAttribute("style");
      return;
    }
    if (screen) {
      Object.assign(screen.style, {
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        zIndex: "80",
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
        padding: "14px",
        background: "rgba(3, 9, 13, 0.48)",
        backdropFilter: "blur(3px)"
      });
    }
    Object.assign(grid.style, {
      position: "relative",
      left: "auto",
      top: "auto",
      zIndex: "81",
      margin: "0",
      transform: "none",
      width: "min(1040px, calc(100vw - 32px))",
      height: "auto",
      minHeight: "0",
      maxHeight: "calc(100vh - 28px)",
      gridTemplateColumns: "1fr 1fr",
      gridTemplateRows: "auto auto auto",
      gap: "10px",
      padding: "12px",
      borderRadius: "12px",
      border: "2px solid rgba(95, 255, 211, 0.35)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.42)",
      background: "linear-gradient(180deg, rgba(8, 18, 27, 0.98), rgba(9, 28, 28, 0.98))"
    });
    const vsBadge = document.querySelector(".tower-vs-badge");
    if (vsBadge) {
      positionTowerVsBadge();
    }
    document.querySelectorAll(".battle-roster").forEach((el) => Object.assign(el.style, {
      minHeight: "0",
      padding: "7px",
      display: "grid",
      gridTemplateRows: "40px 1fr",
      borderWidth: "1px",
      borderRadius: "9px",
      background: "linear-gradient(180deg, rgba(14, 33, 43, 0.98), rgba(8, 22, 25, 0.98))"
    }));
    document.querySelectorAll(".battle-trainer-head").forEach((el) => Object.assign(el.style, {
      minHeight: "40px",
      height: "40px",
      marginBottom: "7px"
    }));
    document.querySelectorAll(".battle-stack").forEach((el) => Object.assign(el.style, {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridAutoRows: "auto",
      alignContent: "stretch",
      width: "100%",
      gap: "8px"
    }));
    document.querySelectorAll(".battle-slot").forEach((el) => Object.assign(el.style, {
      width: "100%",
      minHeight: "210px",
      padding: "12px",
      gridTemplateColumns: "minmax(0, 1fr) minmax(170px, 42%)",
      borderWidth: "1px",
      borderRadius: "8px",
      background: "linear-gradient(180deg, rgba(22, 43, 55, 0.96), rgba(13, 58, 45, 0.92))"
    }));
    document.querySelectorAll(".battle-slot .pokemon-anim").forEach((el) => Object.assign(el.style, {
      right: "22px",
      bottom: "16px",
      width: "clamp(140px, 13vw, 190px)",
      height: "clamp(116px, 11vw, 158px)"
    }));
    positionTowerVsBadge();
  }

  function positionTowerVsBadge() {
    const grid = document.querySelector(".battle-grid");
    const vsBadge = document.querySelector(".tower-vs-badge");
    const playerCard = $("player-card");
    const enemyCard = $("enemy-card");
    if (!grid || !vsBadge || !playerCard || !enemyCard) return;
    const gridBox = grid.getBoundingClientRect();
    const playerBox = playerCard.getBoundingClientRect();
    const enemyBox = enemyCard.getBoundingClientRect();
    const rosterTop = Math.min(playerBox.top, enemyBox.top);
    const rosterBottom = Math.max(playerBox.bottom, enemyBox.bottom);
    const centerY = rosterTop + (rosterBottom - rosterTop) / 2 - gridBox.top;
    Object.assign(vsBadge.style, {
      display: "grid",
      top: `${centerY}px`
    });
    const speedButton = document.querySelector(".battle-speed-toggle");
    if (speedButton) {
      Object.assign(speedButton.style, {
        position: "absolute",
        left: "50%",
        top: `${centerY + 43}px`,
        transform: "translate(-50%, -50%)"
      });
    }
  }

  function renderBattleSlot(p, active, side = "") {
    const pct = Math.max(0, Math.round((p.currentHp / p.maxHp) * 100));
    const hpChanged = p.renderedHpValue !== p.currentHp || p.renderedMaxHpValue !== p.maxHp;
    const previousPct = hpChanged && Number.isFinite(p.renderedHpPct) ? p.renderedHpPct : pct;
    if (pct <= 0 && previousPct > 0) markPendingBattleFaint(p);
    const pendingFaint = pct <= 0 && isPendingBattleFaint(p);
    p.renderedHpPct = pct;
    p.renderedHpValue = p.currentHp;
    p.renderedMaxHpValue = p.maxHp;
    const hpState = pct <= 25 ? "danger" : pct <= 50 ? "watern" : "ok";
    const primaryType = p.types?.[0] || "Normal";
    const secondaryType = p.types?.[1] || primaryType;
    const primaryColor = TYPE_COLOR[primaryType] || "#6af0c1";
    const secondaryColor = TYPE_COLOR[secondaryType] || primaryColor;
    const sideClass = side ? `side-${side}` : "";
    const heldTooltipText = (item) => state.battle?.draft ? draftRelicBonusSummary(item) : itemShortText(item);
    return `<div class="battle-slot ${sideClass} ${active ? "active" : ""} ${p.currentHp <= 0 && !pendingFaint ? "fainted" : ""} ${pendingFaint ? "pending-faint" : ""}" data-battle-mon="${p.name}" style="--mon-type-color:${primaryColor};--mon-type-color-2:${secondaryColor};">
      <strong>${p.name} <small>Lv.${p.level}</small></strong>
      ${renderBattleTypeBadges(p.types || [])}
      ${heldItems(p).length ? `<div class="battle-held-items" aria-label="Relíquias equipadas">${heldItems(p).map((item) => `<span data-held-tooltip="${item.name}" data-held-tooltip-text="${heldTooltipText(item)}" title="${item.name}: ${heldTooltipText(item)}"><img src="${itemSprite(item)}" alt="${item.name}"></span>`).join("")}</div>` : ""}
      <div class="hp-bar ${hpState}" aria-label="HP"><span data-hp-target="${pct}" style="width:${previousPct}%"></span></div>
      <small>${Math.max(0, p.currentHp)}/${p.maxHp}</small>
      <img class="pokemon-anim" src="${animated(p)}" alt="${p.name}" onerror="this.onerror=null;this.src='${staticSprite(p)}'">
    </div>`;
  }

  function renderBattleTypeBadges(types) {
    if (!types?.length) return "";
    return `<div class="battle-type-row" aria-label="Tipos">
      ${types.slice(0, 2).map((type) => `<span class="battle-type-chip" style="--type-color:${TYPE_COLOR[type] || "#dfe7ea"}">${type}</span>`).join("")}
    </div>`;
  }

  function animateRenderedHpBars() {
    requestAnimationFrame(() => {
      document.querySelectorAll(".battle-slot .hp-bar span[data-hp-target]").forEach((bar) => {
        const targetWidth = `${bar.dataset.hpTarget}%`;
        if (bar.style.width === targetWidth) return;
        bar.style.transitionDuration = `${Math.max(180, Math.round(620 / battleSpeedFactor()))}ms`;
        bar.style.width = `${bar.dataset.hpTarget}%`;
        if (bar.dataset.hpTarget === "0") {
          const slot = bar.closest(".battle-slot.pending-faint");
          if (slot) {
            window.setTimeout(() => {
              slot.classList.remove("pending-faint");
              slot.classList.add("fainted", "is-fainting");
            }, 980);
          }
        }
      });
    });
  }

  function isPendingBattleFaint(p) {
    return Number.isFinite(p?.pendingFaintUntil) && Date.now() < p.pendingFaintUntil;
  }

  function markPendingBattleFaint(p) {
    if (!p || p.currentHp > 0) return;
    p.pendingFaintUntil = Math.max(p.pendingFaintUntil || 0, Date.now() + 980);
  }

  function pendingBattleFaintDelay() {
    const team = state.battle?.playerTeam || state.team || [];
    const until = Math.max(0, ...team.map((p) => p?.pendingFaintUntil || 0));
    return Math.max(0, until - Date.now());
  }

  function renderLeaderTeam() {
    return `<div class="leader-team-strip">${state.battle.enemyTeam.map((p, index) => `
      <span class="${p.currentHp <= 0 ? "fainted" : ""} ${index === state.battle.enemyIndex ? "active" : ""}">
        <img src="${animated(p)}" alt="${p.name}" title="${p.name}" onerror="this.src='${mini(p)}'">
      </span>
    `).join("")}</div>`;
  }

  function renderBattleCard(id, p, label, trainer) {
    const pct = Math.max(0, Math.round((p.currentHp / p.maxHp) * 100));
    $(id).innerHTML = `
      <span class="rogue-kicker">${label}</span>
      ${trainer ? `<img class="trainer-portrait" src="${trainerSprite(trainer)}" alt="${label}" onerror="this.style.display='none'">` : ""}
      <img class="pokemon-anim" src="${animated(p)}" alt="${p.name}" onerror="this.src='${sprite(p)}'">
      <h3>${p.name}</h3>
      ${renderTypeChips(p.types)}
      <div class="hp-bar" aria-label="HP"><span style="width:${pct}%"></span></div>
      ${id === "player-card" ? `<div class="xp-bar" aria-label="XP"><span style="width:${Math.round(((p.xp || 0) / xpToNext(p)) * 100)}%"></span></div><small class="xp-label">XP ${p.xp || 0}/${xpToNext(p)}</small>` : ""}
      <p>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp} · Energia ${p.energy}</p>
      <small class="move-summary">${(p.moves || []).map((m) => m.name).join(" / ")}</small>
    `;
  }

  function hashDraftBattleSeed(value) {
    let hash = 2166136261;
    String(value || "draft").split("").forEach((char) => {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
    return hash >>> 0 || 1;
  }

  function battleRandom() {
    if (!state.battle?.draft) return Math.random();
    let seed = state.battle.rngSeed >>> 0;
    seed = Math.imul(seed || 1, 1664525) + 1013904223;
    state.battle.rngSeed = seed >>> 0;
    return (state.battle.rngSeed >>> 0) / 4294967296;
  }

  function draftEnsureStats(pokemon) {
    if (!pokemon) return null;
    pokemon.draftStats ||= { dealt: 0, taken: 0, healed: 0 };
    return pokemon.draftStats;
  }

  function draftTrackDamage(attacker, defender, amount) {
    if (!state.battle?.draft) return;
    const dealt = Math.max(0, Math.min(amount, Math.max(0, defender?.currentHp || 0)));
    draftEnsureStats(attacker).dealt += dealt;
    draftEnsureStats(defender).taken += dealt;
  }

  function draftTrackHealing(pokemon, beforeHp) {
    if (!state.battle?.draft || !pokemon) return;
    const healed = Math.max(0, (pokemon.currentHp || 0) - Math.max(0, beforeHp || 0));
    if (healed > 0) draftEnsureStats(pokemon).healed += healed;
  }

  function calcDamage(attacker, defender, power, type) {
    const base = ((atkVal(attacker) * power) / Math.max(26, defVal(defender))) * (0.9 + battleRandom() * 0.14) * 14;
    const stab = attacker.types.includes(type) ? 1.12 : 1;
    const rawEff = effectiveness(type, defender.types);
    const eff = state.battle?.draft && rawEff === 0 ? 0.35 : rawEff;
    const draftArena = state.battle?.draft ? draftArenaById(state.battle.draftArena?.id) : null;
    const critPenalty = draftArena?.id === "mist" ? 0.04 : 0;
    const critChance = Math.min(0.75, Math.max(0.02, 0.08 + strongestBonus("crit", attacker) - critPenalty));
    const crit = battleRandom() < critChance ? 1.35 : 1;
    const orb = state.battle?.draft ? 1 : 1 + statBonus("damage", attacker);
    const earlyTowerGuard = !state.battle?.draft && state.battle?.tower && state.floor <= 5 && state.battle.enemyTeam?.includes(attacker) ? 0.9 : 1;
    const playerSide = state.battle?.playerTeam?.includes(attacker);
    const enemySide = state.battle?.enemyTeam?.includes(attacker);
    const runRelief = state.battle?.draft ? 1 : enemySide && (state.battle?.tower || state.nuzlockeMode) ? 0.9 : playerSide && (state.battle?.tower || state.nuzlockeMode) ? 1.06 : 1;
    let arenaBoost = 1;
    if (draftArena?.id === "rain") arenaBoost *= type === "Water" ? 1.1 : type === "Fire" ? 0.95 : 1;
    if (draftArena?.id === "sun") arenaBoost *= type === "Fire" ? 1.1 : type === "Water" ? 0.95 : 1;
    if (draftArena?.id === "electric" && type === "Electric") arenaBoost *= 1.1;
    if (draftArena?.id === "storm" && defender.types?.some((entry) => ["Rock", "Ground", "Steel"].includes(entry))) arenaBoost *= 0.92;
    if (draftArena?.id === "garden") {
      if (type === "Grass") arenaBoost *= 1.04;
      if (type === "Poison" && defender.types?.includes("Grass")) arenaBoost *= 1.08;
    }
    if (draftArena?.id === "toxic") {
      if (type === "Poison") arenaBoost *= 1.1;
      if (defender.types?.some((entry) => ["Fairy", "Grass"].includes(entry))) arenaBoost *= 1.05;
    }
    if (draftArena?.id === "glacier") {
      if (type === "Ice") arenaBoost *= 1.12;
      if (attacker.types?.some((entry) => ["Dragon", "Flying"].includes(entry))) arenaBoost *= 0.94;
    }
    if (draftArena?.id === "spirit") {
      if (["Ghost", "Psychic"].includes(type)) arenaBoost *= 1.1;
      if (type === "Normal") arenaBoost *= 0.92;
    }
    if (draftArena?.id === "drake") {
      if (type === "Dragon") arenaBoost *= 1.12;
      if (defender.types?.includes("Fairy")) arenaBoost *= 0.92;
    }
    if (draftArena?.id === "forge") {
      if (type === "Steel") arenaBoost *= 1.1;
      if (type === "Fire" && defender.types?.includes("Steel")) arenaBoost *= 1.06;
    }
    if (draftArena?.id === "gravity") {
      if (type === "Ground") arenaBoost *= 1.08;
      if (defender.types?.includes("Flying")) arenaBoost *= 1.06;
    }
    if (draftArena?.id === "tide") {
      if (type === "Water") arenaBoost *= 1.04;
      if (type === "Electric" && defender.types?.includes("Water")) arenaBoost *= 1.06;
    }
    if (draftArena?.id === "gale") {
      if (attacker.types?.some((entry) => ["Flying", "Bug"].includes(entry))) arenaBoost *= 1.06;
      if (type === "Rock" && defender.types?.some((entry) => ["Flying", "Bug"].includes(entry))) arenaBoost *= 1.08;
    }
    if (draftArena?.id === "night") {
      if (["Dark", "Ghost"].includes(type)) arenaBoost *= 1.1;
      if (type === "Psychic") arenaBoost *= 0.94;
    }
    if (draftArena?.id === "psychic") {
      if (type === "Psychic") arenaBoost *= 1.12;
      if ((attacker.spd || 0) > (defender.spd || 0)) arenaBoost *= 0.97;
    }
    if (draftArena?.id === "forest") {
      if (defender.types?.some((entry) => ["Grass", "Bug"].includes(entry))) arenaBoost *= 0.92;
      if (type === "Fire" && defender.types?.some((entry) => ["Grass", "Bug"].includes(entry))) arenaBoost *= 1.08;
    }
    if (draftArena?.id === "eruption") {
      if (type === "Fire") arenaBoost *= 1.12;
      if (defender.types?.some((entry) => ["Ice", "Grass"].includes(entry))) arenaBoost *= 1.06;
    }
    if (draftArena?.id === "crystal") {
      if (defender.types?.some((entry) => ["Rock", "Ice"].includes(entry))) arenaBoost *= 0.92;
      if (type === "Steel" && defender.types?.some((entry) => ["Rock", "Ice"].includes(entry))) arenaBoost *= 1.06;
    }
    const draftRelicBoost = draftRelicOutgoingModifier(attacker, type) * draftRelicIncomingModifier(defender);
    const amount = eff === 0 ? 0 : Math.max(1, Math.round(base * stab * eff * crit * orb * earlyTowerGuard * runRelief * arenaBoost * draftRelicBoost));
    if (draftArena?.id === "garden" && attacker.types?.includes("Grass") && amount > 0) {
      const beforeHeal = attacker.currentHp;
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + Math.ceil(attacker.maxHp * 0.04));
      draftTrackHealing(attacker, beforeHeal);
    }
    return { amount, eff, crit: crit > 1 };
  }

  function draftArenaAfterHit(attacker, defender, amount) {
    const draftArena = state.battle?.draft ? draftArenaById(state.battle.draftArena?.id) : null;
    if (draftArena?.id !== "tide" || !attacker?.types?.includes("Water") || amount <= 0 || defender?.currentHp > 0) return "";
    const beforeHeal = attacker.currentHp;
    attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + Math.ceil(attacker.maxHp * 0.06));
    draftTrackHealing(attacker, beforeHeal);
    const healed = attacker.currentHp - beforeHeal;
    return healed > 0 ? ` ${attacker.name} recuperou ${healed} HP pela Maré Alta.` : "";
  }

  function effectivenessText(eff) {
    if (eff === 0) return " não afetou";
    if (eff > 1) return " super efetivo";
    if (eff < 1) return " resistido";
    return "";
  }

  function chooseAutoMove(attacker, defender) {
    const moves = attacker.moves?.length ? attacker.moves : legalMovesFor(attacker);
    const usable = moves.filter((move) => (move.cost || 0) <= attacker.energy);
    const struggle = { id: "struggle", name: "Desespero", type: "Normal", power: 0.88, cost: 0 };
    const pool = usable.length ? usable : moves.length ? [moves[0]] : [struggle];
    return pool
      .map((move) => ({ move, score: (move.power || 1) * effectiveness(move.type || attacker.types[0], defender.types) }))
      .sort((a, b) => b.score - a.score)[0].move;
  }

  async function runAutoBattle() {
    if (state.autoBattling) return;
    if (!state.battle || !activePlayer() || state.battle.enemy?.currentHp <= 0) return;
    state.autoBattling = true;
    const button = document.querySelector("[data-auto-battle]");
    if (button) button.disabled = true;
    const actionDelay = 1850;
    const faintDelay = 1650;
    const hpDrainDelay = 1100;
    let guard = 0;
    try {
    while (state.battle && activePlayer() && state.battle.enemy?.currentHp > 0 && guard < 80) {
      guard += 1;
      const playerAtRoundStart = activePlayer();
      const enemyAtRoundStart = state.battle.enemy;
      const turnOrder = [
        { side: "player", speed: speedVal(playerAtRoundStart) },
        { side: "enemy", speed: speedVal(enemyAtRoundStart) }
      ].sort((a, b) => b.speed - a.speed || (a.side === "player" ? -1 : 1));

      for (const turn of turnOrder) {
        const p = activePlayer();
        const e = state.battle?.enemy;
        if (!p || !e || e.currentHp <= 0) break;

        if (turn.side === "player") {
          const pMove = chooseAutoMove(p, e);
          const pType = pMove.type || p.types[0];
          p.energy = Math.max(0, p.energy - (pMove.cost || 0));
          const hit = calcDamage(p, e, pMove.power || 1, pType);
          draftTrackDamage(p, e, hit.amount);
          e.currentHp -= hit.amount;
          const pArenaNote = draftArenaAfterHit(p, e, hit.amount);
          applyMoveEffect(pMove, p, e, hit.amount);
          const pRelicNote = draftRelicAfterHit(p, e, hit.amount);
          p.energy = Math.min(4, p.energy + 1);
          const healBonus = strongestBonus("heal", p);
          if (healBonus > 0) {
            const beforeHeal = p.currentHp;
            p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * healBonus));
            draftTrackHealing(p, beforeHeal);
            const healed = p.currentHp - beforeHeal;
          if (healed > 0) window.setTimeout(() => animateBattlePopup("player-card", p.name, `+${healed}`, "heal"), battleDelay(280));
          }
          const enemyStatus = tickStatus(e);
          $("battle-log").textContent = `${p.name} usou ${pMove.name}: ${hit.amount} dano${hit.crit ? " crítico" : ""}${effectivenessText(hit.eff)}.${pRelicNote}${pArenaNote}${enemyStatus}`;
          renderBattle();
          animateBattleAction("player-card", p.name, "enemy-card", e.name, hit.amount, hit.crit, hit.eff, pType, pMove);
          await wait(battleDelay(actionDelay));
          if (e.currentHp <= 0) {
            handleEnemyFaint(`${p.name} derrubou ${e.name}.`);
            if (!state.battle) {
              state.autoBattling = false;
              return;
            }
            await wait(battleDelay(faintDelay));
          }
        } else {
          const eMove = chooseAutoMove(e, p);
          const eType = eMove.type || e.types[0];
          const eHit = calcDamage(e, p, state.battle.boss ? (eMove.power || 1) * 1.06 : eMove.power || 1, eType);
          draftTrackDamage(e, p, eHit.amount);
          p.currentHp -= eHit.amount;
          const eArenaNote = draftArenaAfterHit(e, p, eHit.amount);
          applyMoveEffect(eMove, e, p, eHit.amount);
          const eRelicNote = draftRelicAfterHit(e, p, eHit.amount);
          const playerStatus = tickStatus(p);
          $("battle-log").textContent = `${e.name} usou ${eMove.name || e.trait}: ${eHit.amount} dano${eHit.crit ? " crítico" : ""}${effectivenessText(eHit.eff)}.${eRelicNote}${eArenaNote}${playerStatus}`;
          if (p.currentHp <= 0 && statBonus("sash", p) > 0 && !state.sashUsed) {
            p.currentHp = 1;
            state.sashUsed = true;
          }
          markPendingBattleFaint(p);
          renderBattle();
          animateBattleAction("enemy-card", e.name, "player-card", p.name, eHit.amount, eHit.crit, eHit.eff, eType, eMove);
          await wait(battleDelay(actionDelay));
          if (state.battle?.draft && p.currentHp <= 0) recordDraftBattleRound("enemy", p, e);
          const faintDelayLeft = pendingBattleFaintDelay();
          if (faintDelayLeft > 0) await wait(faintDelayLeft);
          const playerBeforeLosses = p;
          if (state.tower?.active && !state.team.some((mon) => mon.currentHp > 0)) {
            state.autoBattling = false;
            await wait(battleDelay(hpDrainDelay));
            endRun(false);
            return;
          }
          applyBattleLosses();
          const playerAfterLosses = activePlayer();
          if (!playerAfterLosses) {
            state.autoBattling = false;
            await wait(battleDelay(hpDrainDelay));
            if (state.battle?.draft) return finishDraftAutoBattle(false);
            endRun(false);
            return;
          }
          renderBattle();
          if (playerAfterLosses !== playerBeforeLosses) {
            window.setTimeout(() => animateBattleSendOut({ sides: ["player"] }), sendoutDelay(80));
            await wait(sendoutDelay(BATTLE_SENDOUT_DURATION));
          }
        }
      }
    }
    renderBattle();
    state.autoBattling = false;
    save();
    } catch (error) {
      console.error("Auto battle failed", error);
      state.autoBattling = false;
      if (button) button.disabled = false;
      $("battle-log").textContent = "A batalha encontrou um erro de animação. Tentando manter a partida ativa.";
      renderBattle();
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function battleSpeedFactor() {
    return state.battleSpeed === 3 ? 3 : state.battleSpeed === 2 ? 2 : 1;
  }

  function battleDelay(ms) {
    return Math.max(80, Math.round(ms / battleSpeedFactor()));
  }

  function sendoutDelay(ms) {
    const factor = state.battleSpeed === 3 ? 1.45 : state.battleSpeed === 2 ? 1.25 : 1;
    return Math.max(140, Math.round(ms / factor));
  }

  function ensureBattleSpeedTimer() {
    if (!state.battle) return;
    state.battle.speedBoostStartedAt ||= Date.now();
  }

  function battleSpeedCountdownSeconds() {
    if (!state.battle || state.battleSpeed !== 2) return 0;
    ensureBattleSpeedTimer();
    const left = BATTLE_AUTO_3X_AFTER_MS - (Date.now() - state.battle.speedBoostStartedAt);
    return Math.max(0, Math.ceil(left / 1000));
  }

  function maybeAutoPromoteBattleSpeed() {
    if (!state.battle || state.battleSpeed !== 2) return false;
    ensureBattleSpeedTimer();
    if (Date.now() - state.battle.speedBoostStartedAt < BATTLE_AUTO_3X_AFTER_MS) return false;
    state.battleSpeed = 3;
    save();
    return true;
  }

  function startBattleSpeedCountdown() {
    ensureBattleSpeedTimer();
    if (battleSpeedCountdownTimer) return;
    battleSpeedCountdownTimer = window.setInterval(() => {
      if (!state.battle || state.screen !== "battle") return stopBattleSpeedCountdown();
      const promoted = maybeAutoPromoteBattleSpeed();
      if (state.battleSpeed === 2 || promoted) renderBattle();
      if (state.battleSpeed !== 2) stopBattleSpeedCountdown();
    }, 250);
  }

  function stopBattleSpeedCountdown() {
    if (!battleSpeedCountdownTimer) return;
    window.clearInterval(battleSpeedCountdownTimer);
    battleSpeedCountdownTimer = null;
  }

  function moveEffectClass(type) {
    return `move-${String(type || "normal").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "normal"}`;
  }

  function moveIdClass(move) {
    return `move-id-${String(move?.id || "basic").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "basic"}`;
  }

  function realMoveAnim(move) {
    return REAL_MOVE_ANIMS[String(move?.id || "").toLowerCase()] || null;
  }

  const activeRealMoveAudios = new Set();
  const activeRealMoveTimers = new Set();
  const activeMoveAnimationFrames = new Set();

  function clearActiveMoveEffects(root = document) {
    activeRealMoveTimers.forEach((timer) => window.clearInterval(timer));
    activeRealMoveTimers.clear();
    activeMoveAnimationFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    activeMoveAnimationFrames.clear();
    root.querySelectorAll?.(".real-move-effect, .move-effect, .electric-beam-effect, .electric-body-shock, .psychic-wave-effect, .psychic-body-shock, .surf-wave-effect, .vine-whip-effect, .leaf-stream-effect, .leaf-impact-effect, .flame-stream-effect, .flame-target-effect, .blizzard-canvas-effect, .blizzard-freeze-effect, .bubble-canvas-effect, .bubble-impact-effect, .ice-beam-canvas-effect, .ice-freeze-shell-effect, .dark-pulse-canvas-effect, .dark-impact-effect, .dragon-pulse-canvas-effect, .dragon-impact-effect, .metronome-canvas-effect, .metronome-clock-effect, .metronome-impact-effect, .snarl-canvas-effect, .snarl-impact-effect, .bite-impact-effect, .move-impact-effect").forEach((effect) => effect.remove());
  }

  function playRealMoveAudio(anim) {
    if (!anim?.audio) return;
    activeRealMoveAudios.forEach((active) => {
      active.pause();
      active.currentTime = 0;
    });
    activeRealMoveAudios.clear();
    const audio = new Audio(`assets/battle-animations/real/audio/${anim.audio}`);
    audio.volume = 0.34;
    audio.playbackRate = battleSpeedFactor();
    activeRealMoveAudios.add(audio);
    const stopAudio = () => {
      if (!activeRealMoveAudios.has(audio)) return;
      const fade = window.setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.08);
        if (audio.volume > 0) return;
        window.clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        activeRealMoveAudios.delete(audio);
      }, 30);
    };
    audio.addEventListener("ended", () => activeRealMoveAudios.delete(audio), { once: true });
    window.setTimeout(stopAudio, battleDelay(820));
    void audio.play().catch(() => {});
  }

  function animateBattleAction(attackerId, attackerName, targetId, targetName, amount, crit, eff, type, move = null) {
    const attackerRoot = $(attackerId);
    const targetRoot = $(targetId);
    const attacker = attackerRoot?.querySelector(`[data-battle-mon="${CSS.escape(attackerName)}"]`) || attackerRoot;
    const target = targetRoot?.querySelector(`[data-battle-mon="${CSS.escape(targetName)}"]`) || targetRoot;
    if (attacker) {
      attacker.classList.remove("is-attacking");
      void attacker.offsetWidth;
      attacker.classList.add("is-attacking");
      window.setTimeout(() => attacker.classList.remove("is-attacking"), battleDelay(680));
    }
    animateMoveEffect(attacker, target, type, move, crit);
    animateHit(targetId, targetName, amount, crit, eff);
  }

  function animateBattleSendOut(options = {}) {
    const battleGrid = document.querySelector(".battle-grid");
    if (!battleGrid || !state.battle) return;
    const sides = options.sides ? new Set(options.sides) : null;
    const entries = [
      { side: "player", rootId: "player-card", mon: activePlayer(), trainer: playerTrainerSprite() },
      { side: "enemy", rootId: "enemy-card", mon: state.battle.enemy, trainer: state.battle.trainerSpriteId || state.battle.enemy?.trainer || null }
    ].filter(({ side }) => !sides || sides.has(side));
    const gridRect = battleGrid.getBoundingClientRect();
    entries.forEach(({ side, rootId, mon, trainer }, index) => {
      if (!mon) return;
      const root = $(rootId);
      const slot = root?.querySelector(`[data-battle-mon="${CSS.escape(mon.name)}"]`) || root;
      if (!slot) return;
      const slotRect = slot.getBoundingClientRect();
      const x = slotRect.left + slotRect.width / 2 - gridRect.left;
      const y = slotRect.top + slotRect.height * 0.56 - gridRect.top;
      slot.classList.remove("is-awaiting-sendout", "is-sent-out");
      void slot.offsetWidth;
      slot.classList.add("is-awaiting-sendout");
      const sendDelay = index * 180;
      const revealDelay = sendDelay + 1260;
      window.setTimeout(() => {
        slot.classList.remove("is-awaiting-sendout");
        slot.classList.add("is-sent-out");
      }, sendoutDelay(revealDelay));
      window.setTimeout(() => slot.classList.remove("is-sent-out"), sendoutDelay(revealDelay + 980));

      const effect = document.createElement("span");
      effect.className = `sendout-effect ${side}`;
      effect.style.setProperty("--send-x", `${x}px`);
      effect.style.setProperty("--send-y", `${y}px`);
      effect.style.setProperty("--send-delay", `${sendoutDelay(sendDelay)}ms`);
      const trainerImg = side === "player" ? playerTrainerBackSprite() : trainer ? trainerBackSprite(trainer) : "";
      const trainerFallback = trainer ? trainerSprite(trainer) : "";
      effect.innerHTML = `
        ${trainerImg ? side === "player"
          ? `<span class="sendout-trainer player-back" style="--trainer-sheet: url('${trainerImg}')"></span>`
          : `<img class="sendout-trainer enemy-back" src="${trainerImg}" alt="" onerror="${trainerFallback ? `this.classList.remove('enemy-back');this.classList.add('enemy-front');this.src='${trainerFallback}'` : "this.remove()"}">`
          : ""}
        <img class="sendout-ball" src="${pokemonBallSprite(mon)}" alt="">
        <span class="sendout-burst"></span>
      `;
      battleGrid.appendChild(effect);
      window.setTimeout(() => effect.remove(), sendoutDelay(2300 + sendDelay));
    });
  }

  function animateFlameStreamEffect(battleGrid, target, fromX, fromY, toX, toY, moveId, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const beam = document.createElement("canvas");
    const targetFire = document.createElement("canvas");
    beam.className = "flame-stream-effect";
    targetFire.className = "flame-target-effect";
    battleGrid.append(beam, targetFire);
    const beamCtx = beam.getContext("2d");
    const targetCtx = targetFire.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const fit = (canvas, ctx) => {
      canvas.width = Math.round(gridRect.width * dpr);
      canvas.height = Math.round(gridRect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit(beam, beamCtx);
    fit(targetFire, targetCtx);
    const rand = (min, max) => min + Math.random() * (max - min);
    const targetRect = target.getBoundingClientRect();
    const targetSprite = target.querySelector?.(".pokemon-anim");
    const spriteRect = targetSprite?.getBoundingClientRect() || targetRect;
    const box = {
      x: spriteRect.left - gridRect.left,
      y: spriteRect.top - gridRect.top,
      w: spriteRect.width,
      h: spriteRect.height
    };
    const beamParticles = Array.from({ length: moveId === "ember" ? 70 : 130 }, () => ({}));
    const targetFlames = Array.from({ length: moveId === "ember" ? 44 : 76 }, () => ({}));
    const embers = Array.from({ length: moveId === "ember" ? 26 : 48 }, () => ({}));
    const resetBeam = (p, burst = false) => {
      p.t = burst ? rand(0, 0.92) : 0;
      p.speed = rand(0.62, 1.08);
      p.offset = rand(-34, 34);
      p.wave = rand(0, Math.PI * 2);
      p.waveSpeed = rand(5, 9);
      p.size = rand(22, 58);
      p.grow = rand(0.72, 1.34);
      p.life = rand(0.78, 1);
      p.hot = Math.random() > 0.38;
    };
    const resetTargetFlame = (f, burst = false) => {
      f.x = box.x + rand(box.w * 0.12, box.w * 0.88);
      f.baseY = box.y + rand(box.h * 0.42, box.h * 0.94);
      f.t = burst ? rand(0, 1) : 0;
      f.speed = rand(0.86, 1.65);
      f.height = rand(box.h * 0.28, box.h * 0.62);
      f.width = rand(18, 42);
      f.wobble = rand(-18, 18);
      f.phase = rand(0, Math.PI * 2);
      f.hot = Math.random() > 0.32;
    };
    const resetEmber = (e, burst = false) => {
      e.t = burst ? rand(0, 0.95) : 0;
      e.speed = rand(0.48, 0.95);
      e.offset = rand(-52, 52);
      e.lift = rand(16, 58);
      e.size = rand(2, 6);
    };
    beamParticles.forEach((p) => resetBeam(p, true));
    targetFlames.forEach((f) => resetTargetFlame(f, true));
    embers.forEach((e) => resetEmber(e, true));
    const drawBlob = (ctx, x, y, radius, alpha, hot, squash = 0.82) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      if (hot) {
        gradient.addColorStop(0, `rgba(255,255,232,${alpha})`);
        gradient.addColorStop(0.22, `rgba(255,238,96,${alpha * 0.95})`);
        gradient.addColorStop(0.55, `rgba(255,126,24,${alpha * 0.72})`);
        gradient.addColorStop(1, "rgba(205,24,14,0)");
      } else {
        gradient.addColorStop(0, `rgba(255,214,70,${alpha * 0.85})`);
        gradient.addColorStop(0.42, `rgba(255,80,22,${alpha * 0.76})`);
        gradient.addColorStop(1, "rgba(116,12,10,0)");
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 1.35, radius * squash, rand(-0.7, 0.7), 0, Math.PI * 2);
      ctx.fill();
    };
    const pointOnBeam = (p, time) => {
      const x = fromX + (toX - fromX) * p.t;
      const y = fromY + (toY - fromY) * p.t;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const wobble = Math.sin(p.wave + time * p.waveSpeed + p.t * 9) * 12;
      const spread = p.offset * (0.42 + p.t * 0.88);
      return { x: x + nx * (spread + wobble), y: y + ny * (spread + wobble) - Math.sin(p.t * Math.PI) * 18 };
    };
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const time = now / 1000;
      beamCtx.clearRect(0, 0, gridRect.width, gridRect.height);
      targetCtx.clearRect(0, 0, gridRect.width, gridRect.height);
      beamCtx.globalCompositeOperation = "lighter";
      targetCtx.globalCompositeOperation = "lighter";
      beamParticles.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > p.life) resetBeam(p);
        const pos = pointOnBeam(p, time);
        const fade = Math.min(1, p.t / 0.18) * Math.max(0, 1 - Math.max(0, p.t - 0.78) / 0.22);
        drawBlob(beamCtx, pos.x, pos.y, p.size * (0.65 + Math.sin(p.t * Math.PI) * 0.45) * p.grow, 0.34 * fade, p.hot);
      });
      embers.forEach((e) => {
        e.t += dt * e.speed;
        if (e.t > 1) resetEmber(e);
        const x = fromX + (toX - fromX) * e.t;
        const y = fromY + (toY - fromY) * e.t + e.offset * 0.36 - Math.sin(e.t * Math.PI) * e.lift;
        const alpha = Math.sin(e.t * Math.PI);
        beamCtx.fillStyle = `rgba(255,238,120,${alpha})`;
        beamCtx.shadowColor = "rgba(255,72,20,0.9)";
        beamCtx.shadowBlur = 12;
        beamCtx.beginPath();
        beamCtx.arc(x, y, e.size, 0, Math.PI * 2);
        beamCtx.fill();
        beamCtx.shadowBlur = 0;
      });
      drawBlob(beamCtx, fromX, fromY, 30 + Math.sin(time * 18) * 5, 0.68, true);
      const glow = targetCtx.createRadialGradient(toX, toY, 0, toX, toY, box.w * 0.72);
      glow.addColorStop(0, "rgba(255,238,96,0.24)");
      glow.addColorStop(0.55, "rgba(255,80,22,0.18)");
      glow.addColorStop(1, "rgba(255,40,10,0)");
      targetCtx.fillStyle = glow;
      targetCtx.fillRect(box.x - 30, box.y - 30, box.w + 60, box.h + 60);
      targetFlames.forEach((f) => {
        f.t += dt * f.speed;
        if (f.t > 1) resetTargetFlame(f);
        const fade = Math.sin(f.t * Math.PI);
        const x = f.x + Math.sin(time * 9 + f.phase) * f.wobble * (0.2 + f.t);
        const y = f.baseY - f.height * f.t;
        const radius = f.width * (0.6 + fade * 0.9);
        drawBlob(targetCtx, x, y, radius, 0.42 * fade, f.hot, 1.18);
        drawBlob(targetCtx, x, y + radius * 0.32, radius * 0.62, 0.32 * fade, true, 0.74);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-burning-target");
    void target.offsetWidth;
    target.classList.add("is-burning-target");
    window.setTimeout(() => target.classList.remove("is-burning-target"), battleDelay(980));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      beam.remove();
      targetFire.remove();
    }, battleDelay(1150));
    playRealMoveAudio({ audio: moveId === "ember" ? "ember.ogg" : moveId === "flamethrower" ? "magic-coat.ogg" : moveId === "flame-wheel" ? "bounce.ogg" : "barrier.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateBlizzardEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "blizzard-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const snow = Array.from({ length: 150 }, () => ({}));
    const gusts = Array.from({ length: 34 }, () => ({}));
    const frost = Array.from({ length: 44 }, () => ({}));
    const resetSnow = (p, burst = false) => {
      p.t = burst ? rand(0, 1) : 0;
      p.speed = rand(0.7, 1.55);
      p.offset = rand(-70, 70);
      p.size = rand(2, 7);
      p.spin = rand(0, Math.PI * 2);
      p.spinSpeed = rand(5, 12);
      p.alpha = rand(0.45, 0.95);
    };
    const resetGust = (g, burst = false) => {
      g.t = burst ? rand(0, 1) : 0;
      g.speed = rand(0.52, 1);
      g.offset = rand(-82, 82);
      g.length = rand(80, 190);
      g.width = rand(2, 5);
      g.alpha = rand(0.16, 0.42);
    };
    const resetFrost = (f, burst = false) => {
      f.t = burst ? rand(0, 1) : 0;
      f.speed = rand(0.4, 0.85);
      f.x = toX + rand(-58, 58);
      f.y = toY + rand(-50, 62);
      f.r = rand(5, 18);
      f.drift = rand(-10, 12);
    };
    snow.forEach((p) => resetSnow(p, true));
    gusts.forEach((g) => resetGust(g, true));
    frost.forEach((f) => resetFrost(f, true));
    const beamPoint = (item, time) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const wobble = Math.sin(time * 7 + item.t * 11 + item.offset) * 14;
      return { x: fromX + dx * item.t + nx * (item.offset + wobble), y: fromY + dy * item.t + ny * (item.offset + wobble) };
    };
    const drawSnowflake = (x, y, r, spin, alpha) => {
      ctx.strokeStyle = `rgba(240,252,255,${alpha})`;
      ctx.lineWidth = Math.max(1, r * 0.22);
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i += 1) {
        const a = spin + i * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.lineTo(x - Math.cos(a) * r, y - Math.sin(a) * r);
        ctx.stroke();
      }
    };
    const impact = document.createElement("span");
    impact.className = "blizzard-freeze-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `<span class="frost-aura"></span>${Array.from({ length: 6 }, (_, i) => `<i class="ice-shard is${i + 1}"></i>`).join("")}`;
    battleGrid.appendChild(impact);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const time = now / 1000;
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      gusts.forEach((g) => {
        g.t += dt * g.speed;
        if (g.t > 1) resetGust(g);
        const pos = beamPoint(g, time);
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const alpha = Math.sin(g.t * Math.PI) * g.alpha;
        const grad = ctx.createLinearGradient(pos.x - Math.cos(angle) * g.length * 0.5, pos.y - Math.sin(angle) * g.length * 0.5, pos.x + Math.cos(angle) * g.length * 0.5, pos.y + Math.sin(angle) * g.length * 0.5);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, `rgba(230,250,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = g.width;
        ctx.beginPath();
        ctx.moveTo(pos.x - Math.cos(angle) * g.length * 0.5, pos.y - Math.sin(angle) * g.length * 0.5);
        ctx.lineTo(pos.x + Math.cos(angle) * g.length * 0.5, pos.y + Math.sin(angle) * g.length * 0.5);
        ctx.stroke();
      });
      snow.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > 1) resetSnow(p);
        const pos = beamPoint(p, time);
        drawSnowflake(pos.x, pos.y, p.size, p.spin + time * p.spinSpeed, Math.sin(p.t * Math.PI) * p.alpha);
      });
      frost.forEach((f) => {
        f.t += dt * f.speed;
        if (f.t > 1) resetFrost(f);
        const alpha = Math.sin(f.t * Math.PI) * 0.56;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.38, `rgba(202,248,255,${alpha * 0.72})`);
        grad.addColorStop(1, "rgba(88,190,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(f.x + f.drift * f.t, f.y - f.t * 22, f.r * 1.2, f.r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-frozen-hit");
    void target.offsetWidth;
    target.classList.add("is-frozen-hit");
    window.setTimeout(() => target.classList.remove("is-frozen-hit"), battleDelay(1000));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      impact.remove();
    }, battleDelay(1180));
    playRealMoveAudio({ audio: "ice-beam.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateBubbleEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "bubble-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const bubbles = Array.from({ length: 42 }, () => ({}));
    const bursts = Array.from({ length: 34 }, () => ({}));
    const resetBubble = (b, burst = false) => {
      b.t = burst ? rand(0, 1) : 0;
      b.speed = rand(0.42, 0.9);
      b.offset = rand(-48, 48);
      b.radius = rand(8, 24);
      b.phase = rand(0, Math.PI * 2);
      b.wobble = rand(10, 26);
      b.alpha = rand(0.58, 0.95);
    };
    const resetBurst = (p, burst = false) => {
      p.t = burst ? rand(0, 1) : 0;
      p.speed = rand(0.55, 1.1);
      p.x = toX + rand(-54, 54);
      p.y = toY + rand(-42, 50);
      p.radius = rand(5, 18);
      p.driftX = rand(-42, 42);
      p.driftY = rand(-54, 34);
    };
    bubbles.forEach((b) => resetBubble(b, true));
    bursts.forEach((p) => resetBurst(p, true));
    const beamPoint = (item, time) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const bob = Math.sin(time * 5 + item.phase + item.t * 8) * item.wobble;
      return {
        x: fromX + dx * item.t + nx * (item.offset + bob),
        y: fromY + dy * item.t + ny * (item.offset + bob) - Math.sin(item.t * Math.PI) * 18
      };
    };
    const drawBubble = (x, y, r, alpha) => {
      const grad = ctx.createRadialGradient(x - r * 0.28, y - r * 0.32, 0, x, y, r);
      grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.92})`);
      grad.addColorStop(0.18, `rgba(223,250,255,${alpha * 0.28})`);
      grad.addColorStop(0.72, `rgba(97,217,255,${alpha * 0.18})`);
      grad.addColorStop(1, `rgba(47,156,255,${alpha * 0.04})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(223,250,255,${alpha * 0.82})`;
      ctx.lineWidth = Math.max(1.5, r * 0.12);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.ellipse(x - r * 0.32, y - r * 0.38, r * 0.22, r * 0.14, -0.5, 0, Math.PI * 2);
      ctx.fill();
    };
    const impact = document.createElement("span");
    impact.className = "bubble-impact-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `<span class="wet-ring"></span><i class="pop p1"></i><i class="pop p2"></i><i class="pop p3"></i><i class="pop p4"></i>`;
    battleGrid.appendChild(impact);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const time = now / 1000;
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      bubbles.forEach((b) => {
        b.t += dt * b.speed;
        if (b.t > 1) resetBubble(b);
        const pos = beamPoint(b, time);
        const fade = Math.min(1, b.t / 0.16) * Math.max(0, 1 - Math.max(0, b.t - 0.82) / 0.18);
        drawBubble(pos.x, pos.y, b.radius * (0.82 + Math.sin(b.t * Math.PI) * 0.18), b.alpha * fade);
      });
      bursts.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > 1) resetBurst(p);
        drawBubble(p.x + p.driftX * p.t, p.y + p.driftY * p.t, p.radius * (0.5 + p.t * 0.9), Math.sin(p.t * Math.PI) * 0.75);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-bubbled-hit");
    void target.offsetWidth;
    target.classList.add("is-bubbled-hit");
    window.setTimeout(() => target.classList.remove("is-bubbled-hit"), battleDelay(900));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      impact.remove();
    }, battleDelay(1120));
    playRealMoveAudio({ audio: "lovely-kiss.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateIceBeamEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "ice-beam-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const particles = Array.from({ length: 90 }, () => ({}));
    const crystals = Array.from({ length: 28 }, () => ({}));
    const resetParticle = (p, burst = false) => {
      p.t = burst ? rand(0, 1) : 0;
      p.speed = rand(0.8, 1.55);
      p.offset = rand(-26, 26);
      p.size = rand(2, 6);
      p.phase = rand(0, Math.PI * 2);
      p.alpha = rand(0.42, 0.92);
    };
    const resetCrystal = (c, burst = false) => {
      c.t = burst ? rand(0, 1) : 0;
      c.speed = rand(0.52, 1.1);
      c.offset = rand(-42, 42);
      c.size = rand(8, 22);
      c.spin = rand(0, Math.PI * 2);
      c.spinSpeed = rand(4, 10);
    };
    particles.forEach((p) => resetParticle(p, true));
    crystals.forEach((c) => resetCrystal(c, true));
    const basis = () => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      return { dx, dy, len, nx: -dy / len, ny: dx / len };
    };
    const point = (item, time) => {
      const b = basis();
      const wobble = Math.sin(time * 10 + item.phase + item.t * 12) * 5;
      return { x: fromX + b.dx * item.t + b.nx * (item.offset + wobble), y: fromY + b.dy * item.t + b.ny * (item.offset + wobble) };
    };
    const drawCrystal = (x, y, size, angle, alpha) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle);
      ctx.fillStyle = `rgba(223,250,255,${alpha})`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.9})`;
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.42, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.42, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    const shell = document.createElement("span");
    shell.className = "ice-freeze-shell-effect";
    shell.style.setProperty("--impact-x", `${toX}px`);
    shell.style.setProperty("--impact-y", `${toY}px`);
    shell.innerHTML = `
      <span class="ice-glass"></span>
      <i class="crack c1"></i>
      <i class="crack c2"></i>
      <i class="crack c3"></i>
      <i class="ice-shard s1"></i>
      <i class="ice-shard s2"></i>
      <i class="ice-shard s3"></i>
      <i class="ice-shard s4"></i>
    `;
    battleGrid.appendChild(shell);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const time = now / 1000;
      const b = basis();
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = 0; i < 4; i += 1) {
        const wiggle = Math.sin(time * 18 + i) * 8;
        const grad = ctx.createLinearGradient(fromX, fromY, toX, toY);
        grad.addColorStop(0, "rgba(255,255,255,0.05)");
        grad.addColorStop(0.18, i === 0 ? "rgba(255,255,255,0.92)" : "rgba(184,240,255,0.46)");
        grad.addColorStop(0.72, i === 0 ? "rgba(202,248,255,0.88)" : "rgba(65,154,255,0.34)");
        grad.addColorStop(1, "rgba(255,255,255,0.02)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = i === 0 ? 8 : 20 + i * 9;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.bezierCurveTo(fromX + b.dx * 0.28 + b.nx * wiggle, fromY + b.dy * 0.28 + b.ny * wiggle, fromX + b.dx * 0.64 - b.nx * wiggle, fromY + b.dy * 0.64 - b.ny * wiggle, toX, toY);
        ctx.stroke();
      }
      particles.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > 1) resetParticle(p);
        const pos = point(p, time);
        const alpha = Math.sin(p.t * Math.PI) * p.alpha;
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 3);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.36, `rgba(202,248,255,${alpha * 0.72})`);
        grad.addColorStop(1, "rgba(65,154,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      crystals.forEach((c) => {
        c.t += dt * c.speed;
        if (c.t > 1) resetCrystal(c);
        const pos = point(c, time);
        drawCrystal(pos.x, pos.y, c.size, c.spin + time * c.spinSpeed, Math.sin(c.t * Math.PI) * 0.78);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-ice-beam-frozen");
    void target.offsetWidth;
    target.classList.add("is-ice-beam-frozen");
    window.setTimeout(() => target.classList.remove("is-ice-beam-frozen"), battleDelay(1000));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      shell.remove();
    }, battleDelay(1180));
    playRealMoveAudio({ audio: "light-screen.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateDarkPulseEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "dark-pulse-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const rings = Array.from({ length: 9 }, () => ({}));
    const motes = Array.from({ length: 72 }, () => ({}));
    const smoke = Array.from({ length: 24 }, () => ({}));
    const resetRing = (r, burst = false) => {
      r.t = burst ? rand(0, 1) : 0;
      r.speed = rand(0.52, 0.92);
      r.offset = rand(-30, 30);
      r.radius = rand(28, 58);
      r.phase = rand(0, Math.PI * 2);
    };
    const resetMote = (m, burst = false) => {
      m.t = burst ? rand(0, 1) : 0;
      m.speed = rand(0.62, 1.28);
      m.offset = rand(-58, 58);
      m.size = rand(3, 9);
      m.phase = rand(0, Math.PI * 2);
    };
    const resetSmoke = (s, burst = false) => {
      s.t = burst ? rand(0, 1) : 0;
      s.speed = rand(0.34, 0.74);
      s.offset = rand(-72, 72);
      s.radius = rand(28, 62);
      s.phase = rand(0, Math.PI * 2);
    };
    rings.forEach((r) => resetRing(r, true));
    motes.forEach((m) => resetMote(m, true));
    smoke.forEach((s) => resetSmoke(s, true));
    const basis = () => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      return { dx, dy, len, nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
    };
    const point = (item, time) => {
      const b = basis();
      const wobble = Math.sin(time * 6 + item.phase + item.t * 9) * 14;
      return { x: fromX + b.dx * item.t + b.nx * (item.offset + wobble), y: fromY + b.dy * item.t + b.ny * (item.offset + wobble) };
    };
    const drawRing = (x, y, radius, angle, alpha) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle);
      ctx.scale(1.25, 0.62);
      const grad = ctx.createRadialGradient(0, 0, radius * 0.48, 0, 0, radius);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.58, `rgba(68,18,118,${alpha * 0.52})`);
      grad.addColorStop(0.78, `rgba(184,92,255,${alpha})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(5, radius * 0.18);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    const drawMote = (x, y, size, alpha) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.4);
      grad.addColorStop(0, `rgba(245,215,255,${alpha})`);
      grad.addColorStop(0.32, `rgba(184,92,255,${alpha * 0.72})`);
      grad.addColorStop(1, "rgba(35,10,66,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
      ctx.fill();
    };
    const impact = document.createElement("span");
    impact.className = "dark-impact-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `
      <span class="shadow-core"></span>
      <span class="shadow-ring r1"></span>
      <span class="shadow-ring r2"></span>
      <i class="dark-spark s1"></i>
      <i class="dark-spark s2"></i>
      <i class="dark-spark s3"></i>
      <i class="dark-spark s4"></i>
      <i class="dark-spark s5"></i>
      <i class="dark-spark s6"></i>
    `;
    battleGrid.appendChild(impact);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const time = now / 1000;
      const b = basis();
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      smoke.forEach((s) => {
        s.t += dt * s.speed;
        if (s.t > 1) resetSmoke(s);
        const pos = point(s, time);
        const alpha = Math.sin(s.t * Math.PI) * 0.16;
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, s.radius);
        grad.addColorStop(0, `rgba(184,92,255,${alpha})`);
        grad.addColorStop(0.5, `rgba(61,20,108,${alpha * 0.82})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, s.radius * 1.4, s.radius * 0.8, b.angle, 0, Math.PI * 2);
        ctx.fill();
      });
      rings.forEach((r) => {
        r.t += dt * r.speed;
        if (r.t > 1) resetRing(r);
        const pos = point(r, time);
        drawRing(pos.x, pos.y, r.radius * (0.6 + r.t * 0.7), b.angle, Math.sin(r.t * Math.PI) * 0.9);
      });
      motes.forEach((m) => {
        m.t += dt * m.speed;
        if (m.t > 1) resetMote(m);
        const pos = point(m, time);
        drawMote(pos.x, pos.y, m.size, Math.sin(m.t * Math.PI) * 0.86);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-dark-pulsed");
    void target.offsetWidth;
    target.classList.add("is-dark-pulsed");
    window.setTimeout(() => target.classList.remove("is-dark-pulsed"), battleDelay(980));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      impact.remove();
    }, battleDelay(1150));
    playRealMoveAudio({ audio: "night-shade.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateBiteEffect(battleGrid, target, toX, toY, crit = false) {
    const impact = document.createElement("span");
    impact.className = "bite-impact-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `
      <span class="mouth-shadow"></span>
      <span class="jaw upper">
        <i class="fang t1"></i><i class="fang t2"></i><i class="fang t3"></i><i class="fang t4"></i>
      </span>
      <span class="jaw lower">
        <i class="fang t1"></i><i class="fang t2"></i><i class="fang t3"></i><i class="fang t4"></i>
      </span>
      <span class="tooth-hole h1"></span>
      <span class="tooth-hole h2"></span>
      <span class="tooth-hole h3"></span>
      <span class="tooth-hole h4"></span>
      <span class="tooth-hole h5"></span>
      <span class="tooth-hole h6"></span>
      <span class="tooth-hole h7"></span>
      <span class="tooth-hole h8"></span>
      <span class="pressure-ring"></span>
    `;
    battleGrid.appendChild(impact);

    target.classList.remove("is-bitten-target");
    void target.offsetWidth;
    target.classList.add("is-bitten-target");
    window.setTimeout(() => target.classList.remove("is-bitten-target"), battleDelay(900));
    window.setTimeout(() => impact.remove(), battleDelay(1050));
    playRealMoveAudio({ audio: "bite.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateDragonPulseEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "dragon-pulse-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const scale = Math.max(0.72, Math.min(1.18, gridRect.width / 920));
    const pulses = Array.from({ length: 7 }, () => ({}));
    const sparks = Array.from({ length: 70 }, () => ({}));
    const scales = Array.from({ length: 24 }, () => ({}));
    const basis = () => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      return { dx, dy, len, nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
    };
    const resetPulse = (p, burst = false) => {
      p.t = burst ? rand(0, 1) : 0;
      p.speed = rand(0.46, 0.78);
      p.offset = rand(-22, 22) * scale;
      p.radius = rand(30, 68) * scale;
      p.phase = rand(0, Math.PI * 2);
      p.twist = rand(-1, 1);
    };
    const resetSpark = (s, burst = false) => {
      s.t = burst ? rand(0, 1) : 0;
      s.speed = rand(0.72, 1.36);
      s.offset = rand(-54, 54) * scale;
      s.size = rand(3, 8) * scale;
      s.phase = rand(0, Math.PI * 2);
    };
    const resetScale = (s, burst = false) => {
      s.t = burst ? rand(0, 1) : 0;
      s.speed = rand(0.5, 1);
      s.offset = rand(-46, 46) * scale;
      s.size = rand(10, 21) * scale;
      s.spin = rand(0, Math.PI * 2);
      s.spinSpeed = rand(3, 8);
    };
    pulses.forEach((p) => resetPulse(p, true));
    sparks.forEach((s) => resetSpark(s, true));
    scales.forEach((s) => resetScale(s, true));
    const point = (item, time) => {
      const b = basis();
      const coil = Math.sin(time * 7 + item.phase + item.t * 12) * 18 * scale;
      return { x: fromX + b.dx * item.t + b.nx * (item.offset + coil), y: fromY + b.dy * item.t + b.ny * (item.offset + coil) };
    };
    const drawPulse = (x, y, radius, angle, alpha, twist) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle + twist);
      ctx.scale(1.55, 0.62);
      const grad = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.48, `rgba(98,118,255,${alpha * 0.42})`);
      grad.addColorStop(0.72, `rgba(116,255,220,${alpha})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(5, radius * 0.16);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    const drawSpark = (x, y, size, alpha) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.8);
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(0.35, `rgba(116,255,220,${alpha * 0.8})`);
      grad.addColorStop(1, "rgba(98,118,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.8, 0, Math.PI * 2);
      ctx.fill();
    };
    const drawScale = (x, y, size, angle, alpha) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle);
      ctx.fillStyle = `rgba(116,255,220,${alpha})`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.72, -size * 0.1);
      ctx.lineTo(size * 0.38, size);
      ctx.lineTo(-size * 0.38, size);
      ctx.lineTo(-size * 0.72, -size * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    const impact = document.createElement("span");
    impact.className = "dragon-impact-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `
      <span class="dragon-head">
        <i class="snout"></i>
        <i class="horn h1"></i>
        <i class="horn h2"></i>
        <i class="eye e1"></i>
        <i class="eye e2"></i>
      </span>
      <i class="fang f1"></i>
      <i class="fang f2"></i>
      <i class="fang f3"></i>
      <i class="fang f4"></i>
      <i class="arc a1"></i>
      <i class="arc a2"></i>
      <i class="arc a3"></i>
      <span class="shockwave"></span>
    `;
    battleGrid.appendChild(impact);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const b = basis();
      const time = now / 1000;
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i += 1) {
        const wobble = Math.sin(time * 9 + i * 2) * 16 * scale;
        const grad = ctx.createLinearGradient(fromX, fromY, toX, toY);
        grad.addColorStop(0, "rgba(255,255,255,0.02)");
        grad.addColorStop(0.16, i === 0 ? "rgba(255,255,255,0.74)" : "rgba(116,255,220,0.34)");
        grad.addColorStop(0.68, i === 0 ? "rgba(116,255,220,0.68)" : "rgba(98,118,255,0.34)");
        grad.addColorStop(1, "rgba(255,255,255,0.02)");
        ctx.strokeStyle = grad;
        ctx.lineCap = "round";
        ctx.lineWidth = i === 0 ? 7 * scale : (20 + i * 12) * scale;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.bezierCurveTo(fromX + b.dx * 0.28 + b.nx * wobble, fromY + b.dy * 0.28 + b.ny * wobble, fromX + b.dx * 0.66 - b.nx * wobble, fromY + b.dy * 0.66 - b.ny * wobble, toX, toY);
        ctx.stroke();
      }
      pulses.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > 1) resetPulse(p);
        const pos = point(p, time);
        drawPulse(pos.x, pos.y, p.radius * (0.7 + p.t * 0.7), b.angle, Math.sin(p.t * Math.PI) * 0.9, p.twist + time * 0.5);
      });
      sparks.forEach((s) => {
        s.t += dt * s.speed;
        if (s.t > 1) resetSpark(s);
        const pos = point(s, time);
        drawSpark(pos.x, pos.y, s.size, Math.sin(s.t * Math.PI) * 0.82);
      });
      scales.forEach((s) => {
        s.t += dt * s.speed;
        if (s.t > 1) resetScale(s);
        const pos = point(s, time);
        drawScale(pos.x, pos.y, s.size, s.spin + time * s.spinSpeed, Math.sin(s.t * Math.PI) * 0.58);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-dragon-pulsed");
    void target.offsetWidth;
    target.classList.add("is-dragon-pulsed");
    window.setTimeout(() => target.classList.remove("is-dragon-pulsed"), battleDelay(980));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      impact.remove();
    }, battleDelay(1180));
    playRealMoveAudio({ audio: "mind-reader.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateMetronomeEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "metronome-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const scale = Math.max(0.72, Math.min(1.18, gridRect.width / 920));
    const notes = Array.from({ length: 12 }, () => ({}));
    const stars = Array.from({ length: 42 }, () => ({}));
    const bolts = Array.from({ length: 18 }, () => ({}));
    const resetNote = (n, burst = false) => {
      n.t = burst ? rand(0, 1) : 0;
      n.speed = rand(0.28, 0.56);
      n.radius = rand(34, 108) * scale;
      n.angle = rand(0, Math.PI * 2);
      n.spin = rand(-1.8, 1.8);
      n.size = rand(16, 26) * scale;
      n.symbol = Math.random() > 0.5 ? "?" : "!";
    };
    const resetStar = (s, burst = false) => {
      s.t = burst ? rand(0, 1) : 0;
      s.speed = rand(0.5, 1.1);
      s.offset = rand(-70, 70) * scale;
      s.size = rand(6, 13) * scale;
      s.phase = rand(0, Math.PI * 2);
    };
    const resetBolt = (b, burst = false) => {
      b.t = burst ? rand(0.46, 1) : 0;
      b.speed = rand(0.9, 1.5);
      b.offset = rand(-36, 36) * scale;
      b.size = rand(7, 15) * scale;
      b.phase = rand(0, Math.PI * 2);
    };
    notes.forEach((n) => resetNote(n, true));
    stars.forEach((s) => resetStar(s, true));
    bolts.forEach((b) => resetBolt(b, true));
    const basis = () => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      return { dx, dy, len, nx: -dy / len, ny: dx / len };
    };
    const point = (item, time) => {
      const b = basis();
      const wobble = Math.sin(time * 10 + item.phase + item.t * 12) * 10 * scale;
      return { x: fromX + b.dx * item.t + b.nx * (item.offset + wobble), y: fromY + b.dy * item.t + b.ny * (item.offset + wobble) };
    };
    const drawStar = (x, y, size, alpha, angle) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle);
      ctx.fillStyle = `rgba(255, 246, 181, ${alpha})`;
      ctx.strokeStyle = `rgba(106, 240, 193, ${alpha * 0.8})`;
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const r = i % 2 === 0 ? size : size * 0.42;
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    const drawBolt = (x, y, size, alpha) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.fillStyle = `rgba(255, 219, 84, ${alpha})`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, -size);
      ctx.lineTo(size * 0.55, -size * 0.1);
      ctx.lineTo(size * 0.12, -size * 0.1);
      ctx.lineTo(size * 0.34, size);
      ctx.lineTo(-size * 0.58, -size * 0.02);
      ctx.lineTo(-size * 0.12, -size * 0.02);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    const clock = document.createElement("span");
    clock.className = "metronome-clock-effect";
    clock.style.setProperty("--clock-x", `${fromX}px`);
    clock.style.setProperty("--clock-y", `${fromY}px`);
    clock.innerHTML = `
      <span class="body"></span>
      <span class="dial"></span>
      <span class="pendulum"></span>
      <span class="bob"></span>
      <span class="pivot"></span>
      <span class="tick t1">?</span>
      <span class="tick t2">!</span>
      <span class="tick t3">*</span>
    `;
    const impact = document.createElement("span");
    impact.className = "metronome-impact-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `
      <span class="mystery-card">?</span>
      <span class="impact-pop"></span>
      <span class="wild-symbol q1">?</span>
      <span class="wild-symbol q2">!</span>
      <span class="wild-symbol q3">*</span>
      <span class="wild-symbol q4">?</span>
      <i class="burst-shard s1"></i>
      <i class="burst-shard s2"></i>
      <i class="burst-shard s3"></i>
      <i class="burst-shard s4"></i>
      <i class="burst-shard s5"></i>
      <i class="burst-shard s6"></i>
    `;
    battleGrid.append(clock, impact);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const time = now / 1000;
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      notes.forEach((n) => {
        n.t += dt * n.speed;
        if (n.t > 1) resetNote(n);
        const swirl = n.angle + time * n.spin + n.t * Math.PI * 2.4;
        const radius = n.radius * (1 - n.t * 0.35);
        const x = fromX + Math.cos(swirl) * radius;
        const y = fromY + Math.sin(swirl) * radius * 0.58 - n.t * 24 * scale;
        const alpha = Math.sin(n.t * Math.PI) * 0.9;
        ctx.font = `900 ${n.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255, 246, 181, ${alpha})`;
        ctx.strokeStyle = `rgba(106, 240, 193, ${alpha * 0.7})`;
        ctx.lineWidth = 3;
        ctx.strokeText(n.symbol, x, y);
        ctx.fillText(n.symbol, x, y);
      });
      stars.forEach((s) => {
        s.t += dt * s.speed;
        if (s.t > 1) resetStar(s);
        const pos = point(s, time);
        drawStar(pos.x, pos.y, s.size, Math.sin(s.t * Math.PI) * 0.82, time * 2 + s.phase);
      });
      bolts.forEach((b) => {
        b.t += dt * b.speed;
        if (b.t > 1) resetBolt(b);
        const pos = point(b, time);
        drawBolt(pos.x, pos.y, b.size, Math.sin(b.t * Math.PI) * 0.9);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-metronome-hit");
    void target.offsetWidth;
    target.classList.add("is-metronome-hit");
    window.setTimeout(() => target.classList.remove("is-metronome-hit"), battleDelay(1100));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      clock.remove();
      impact.remove();
    }, battleDelay(1350));
    playRealMoveAudio({ audio: "metronome.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateSnarlEffect(battleGrid, target, fromX, fromY, toX, toY, crit = false) {
    const gridRect = battleGrid.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.className = "snarl-canvas-effect";
    battleGrid.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(gridRect.width * dpr);
    canvas.height = Math.round(gridRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = (min, max) => min + Math.random() * (max - min);
    const scale = Math.max(0.72, Math.min(1.18, gridRect.width / 920));
    const waves = Array.from({ length: 8 }, () => ({}));
    const wisps = Array.from({ length: 34 }, () => ({}));
    const shards = Array.from({ length: 24 }, () => ({}));
    const basis = () => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      return { dx, dy, len, nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
    };
    const resetWave = (w, burst = false) => {
      w.t = burst ? rand(0, 1) : 0;
      w.speed = rand(0.5, 0.92);
      w.offset = rand(-26, 26) * scale;
      w.radius = rand(30, 72) * scale;
      w.phase = rand(0, Math.PI * 2);
    };
    const resetWisp = (w, burst = false) => {
      w.t = burst ? rand(0, 1) : 0;
      w.speed = rand(0.6, 1.2);
      w.offset = rand(-74, 74) * scale;
      w.size = rand(16, 42) * scale;
      w.phase = rand(0, Math.PI * 2);
    };
    const resetShard = (s, burst = false) => {
      s.t = burst ? rand(0, 1) : 0;
      s.speed = rand(0.8, 1.5);
      s.offset = rand(-44, 44) * scale;
      s.size = rand(8, 18) * scale;
      s.spin = rand(0, Math.PI * 2);
      s.spinSpeed = rand(4, 9);
    };
    waves.forEach((w) => resetWave(w, true));
    wisps.forEach((w) => resetWisp(w, true));
    shards.forEach((s) => resetShard(s, true));
    const point = (item, time) => {
      const b = basis();
      const tremble = Math.sin(time * 16 + item.phase + item.t * 18) * 12 * scale;
      return { x: fromX + b.dx * item.t + b.nx * (item.offset + tremble), y: fromY + b.dy * item.t + b.ny * (item.offset + tremble) };
    };
    const drawWave = (x, y, radius, angle, alpha) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle);
      ctx.scale(1.5, 0.58);
      ctx.strokeStyle = `rgba(185,160,255,${alpha})`;
      ctx.lineWidth = Math.max(5, radius * 0.14);
      ctx.beginPath();
      ctx.arc(0, 0, radius, -Math.PI * 0.82, Math.PI * 0.82);
      ctx.stroke();
      ctx.strokeStyle = `rgba(10,8,18,${alpha * 0.55})`;
      ctx.lineWidth = Math.max(3, radius * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.78, -Math.PI * 0.72, Math.PI * 0.72);
      ctx.stroke();
      ctx.restore();
    };
    const drawWisp = (x, y, size, alpha) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
      grad.addColorStop(0, `rgba(236,224,255,${alpha * 0.55})`);
      grad.addColorStop(0.45, `rgba(139,92,246,${alpha * 0.38})`);
      grad.addColorStop(1, "rgba(10,8,18,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, size * 1.35, size * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    const drawShard = (x, y, size, angle, alpha) => {
      ctx.save();
      ctx.translateeé(x, y);
      ctx.rotaté(angle);
      ctx.fillStyle = `rgba(185,160,255,${alpha})`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.65})`;
      ctx.lineWidth = Math.max(1, size * 0.1);
      ctx.beginPath();
      ctx.moveTo(-size, -size * 0.16);
      ctx.lineTo(size * 0.32, -size * 0.5);
      ctx.lineTo(size, size * 0.16);
      ctx.lineTo(-size * 0.28, size * 0.48);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    const impact = document.createElement("span");
    impact.className = "snarl-impact-effect";
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    impact.innerHTML = `
      <span class="shadow-vortex"></span>
      <span class="sound-ring r1"></span>
      <span class="sound-ring r2"></span>
      <i class="fear-mark m1">!</i>
      <i class="fear-mark m2">!</i>
      <i class="slash s1"></i>
      <i class="slash s2"></i>
      <i class="slash s3"></i>
    `;
    battleGrid.appendChild(impact);
    let last = performance.now();
    let frameId = 0;
    const draw = (now) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      const b = basis();
      const time = now / 1000;
      ctx.clearRect(0, 0, gridRect.width, gridRect.height);
      ctx.globalCompositeOperation = "lighter";
      wisps.forEach((w) => {
        w.t += dt * w.speed;
        if (w.t > 1) resetWisp(w);
        const pos = point(w, time);
        drawWisp(pos.x, pos.y, w.size, Math.sin(w.t * Math.PI) * 0.72);
      });
      waves.forEach((w) => {
        w.t += dt * w.speed;
        if (w.t > 1) resetWave(w);
        const pos = point(w, time);
        drawWave(pos.x, pos.y, w.radius * (0.65 + w.t * 0.85), b.angle, Math.sin(w.t * Math.PI) * 0.88);
      });
      shards.forEach((s) => {
        s.t += dt * s.speed;
        if (s.t > 1) resetShard(s);
        const pos = point(s, time);
        drawShard(pos.x, pos.y, s.size, s.spin + time * s.spinSpeed, Math.sin(s.t * Math.PI) * 0.66);
      });
      activeMoveAnimationFrames.delete(frameId);
      frameId = window.requestAnimationFrame(draw);
      activeMoveAnimationFrames.add(frameId);
    };
    frameId = window.requestAnimationFrame(draw);
    activeMoveAnimationFrames.add(frameId);
    target.classList.remove("is-snarled");
    void target.offsetWidth;
    target.classList.add("is-snarled");
    window.setTimeout(() => target.classList.remove("is-snarled"), battleDelay(920));
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      activeMoveAnimationFrames.delete(frameId);
      canvas.remove();
      impact.remove();
    }, battleDelay(1080));
    playRealMoveAudio({ audio: "supersonic.ogg" });
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
  }

  function animateMoveEffect(attacker, target, type, move = null, crit = false) {
    const battleGrid = document.querySelector(".battle-grid");
    if (!battleGrid || !attacker || !target) return;
    clearActiveMoveEffects(battleGrid);
    const gridRect = battleGrid.getBoundingClientRect();
    const fromRect = attacker.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();
    const attackerSprite = attacker.querySelector?.(".pokemon-anim");
    const attackerSpriteRect = attackerSprite?.getBoundingClientRect();
    const fromX = (attackerSpriteRect || fromRect).left + (attackerSpriteRect || fromRect).width / 2 - gridRect.left;
    const fromY = attackerSpriteRect
      ? attackerSpriteRect.top + attackerSpriteRect.height * 0.38 - gridRect.top
      : fromRect.top + fromRect.height * 0.45 - gridRect.top;
    const targetSprite = target.querySelector?.(".pokemon-anim");
    const targetSpriteRect = targetSprite?.getBoundingClientRect();
    const toX = (targetSpriteRect || toRect).left + (targetSpriteRect || toRect).width / 2 - gridRect.left;
    const toY = targetSpriteRect
      ? targetSpriteRect.top + targetSpriteRect.height * 0.48 - gridRect.top
      : toRect.top + toRect.height * 0.45 - gridRect.top;
    const useTowerStyle = battleGrid.classList.contains("tower-battle-grid") || document.body.classList.contains("is-tower-battle");
    const realAnim = realMoveAnim(move);
    const moveId = String(move?.id || "").toLowerCase();
    if (["ember", "flame-wheel", "flamethrower", "burn"].includes(moveId)) {
      animateFlameStreamEffect(battleGrid, target, fromX, fromY, toX, toY, moveId, crit);
      return;
    }
    if (moveId === "blizzard") {
      animateBlizzardEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "bubble") {
      animateBubbleEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "ice-beam") {
      animateIceBeamEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "dark-pulse") {
      animateDarkPulseEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "dragon-pulse") {
      animateDragonPulseEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "metronome") {
      animateMetronomeEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "snarl") {
      animateSnarlEffect(battleGrid, target, fromX, fromY, toX, toY, crit);
      return;
    }
    if (moveId === "bite") {
      animateBiteEffect(battleGrid, target, toX, toY, crit);
      return;
    }
    if (moveId === "thundershock") {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const beam = document.createElement("span");
      beam.className = `electric-beam-effect ${moveEffectClass(type)} ${moveIdClass(move)} ${crit ? "is-critical" : ""}`;
      beam.style.setProperty("--beam-x", `${fromX}px`);
      beam.style.setProperty("--beam-y", `${fromY}px`);
      beam.style.setProperty("--beam-length", `${length}px`);
      beam.style.setProperty("--beam-angle", `${angle}deg`);
      beam.innerHTML = `
        <svg viewBox="0 0 620 190" aria-hidden="true">
          <g>
            <polyline class="beam-bolt beam-wide beam-a" points="8,96 58,70 96,112 146,55 198,128 256,79 318,108 374,44 438,122 504,70 612,95"></polyline>
            <polyline class="beam-bolt beam-wide beam-b" points="8,96 66,120 112,78 168,132 226,62 286,114 342,73 414,135 466,64 530,112 612,95"></polyline>
            <polyline class="beam-bolt beam-core beam-a" points="8,96 58,70 96,112 146,55 198,128 256,79 318,108 374,44 438,122 504,70 612,95"></polyline>
            <polyline class="beam-bolt beam-core beam-b" points="8,96 66,120 112,78 168,132 226,62 286,114 342,73 414,135 466,64 530,112 612,95"></polyline>
            <polyline class="beam-bolt beam-branch branch-one" points="198,128 178,176 224,146"></polyline>
            <polyline class="beam-bolt beam-branch branch-two" points="374,44 414,16 402,68"></polyline>
            <polyline class="beam-bolt beam-branch branch-three" points="466,64 506,30 500,86"></polyline>
          </g>
        </svg>
      `;
      battleGrid.appendChild(beam);

      const shock = document.createElement("span");
      shock.className = "electric-body-shock";
      shock.style.setProperty("--impact-x", `${toX}px`);
      shock.style.setProperty("--impact-y", `${toY}px`);
      shock.innerHTML = `
        <span class="shock-aura"></span>
        <svg class="shock-body" viewBox="0 0 150 170" aria-hidden="true">
          <polyline class="shock-arc arc-a" points="44,18 30,48 50,74 28,106 48,144"></polyline>
          <polyline class="shock-arc arc-b" points="104,20 122,52 98,82 126,116 104,150"></polyline>
          <polyline class="shock-arc arc-c" points="62,8 84,36 66,66 88,98 70,132 84,164"></polyline>
          <polyline class="shock-arc arc-d" points="18,82 46,72 72,88 102,76 132,88"></polyline>
        </svg>
        <span class="contact-zap"></span>
      `;
      battleGrid.appendChild(shock);

      target.classList.remove("is-electrocuted");
      void target.offsetWidth;
      target.classList.add("is-electrocuted");
      window.setTimeout(() => target.classList.remove("is-electrocuted"), battleDelay(780));
      playRealMoveAudio({ audio: "thunder-shock.ogg" });
      battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
      void battleGrid.offsetWidth;
      battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
      window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
      window.setTimeout(() => beam.remove(), battleDelay(820));
      window.setTimeout(() => shock.remove(), battleDelay(920));
      return;
    }
    if (["confusion", "psyshock", "pulse", "psybeam"].includes(moveId)) {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const wave = document.createElement("span");
      wave.className = `psychic-wave-effect ${moveEffectClass(type)} ${moveIdClass(move)} ${crit ? "is-critical" : ""}`;
      wave.style.setProperty("--wave-x", `${fromX}px`);
      wave.style.setProperty("--wave-y", `${fromY}px`);
      wave.style.setProperty("--wave-length", `${length}px`);
      wave.style.setProperty("--wave-angle", `${angle}deg`);
      wave.innerHTML = `
        <span class="wave-front front-a"></span>
        <span class="wave-front front-b"></span>
        <span class="wave-front front-c"></span>
        <span class="wave-front front-d"></span>
        <span class="wave-trail"></span>
      `;
      battleGrid.appendChild(wave);

      const impact = document.createElement("span");
      impact.className = "psychic-body-shock";
      impact.style.setProperty("--impact-x", `${toX}px`);
      impact.style.setProperty("--impact-y", `${toY}px`);
      impact.innerHTML = `
        <span class="mind-ring ring-a"></span>
        <span class="mind-ring ring-b"></span>
        <span class="mind-ring ring-c"></span>
        <span class="mind-core"></span>
      `;
      battleGrid.appendChild(impact);

      target.classList.remove("is-psychic-hit");
      void target.offsetWidth;
      target.classList.add("is-psychic-hit");
      window.setTimeout(() => target.classList.remove("is-psychic-hit"), battleDelay(860));
      playRealMoveAudio({ audio: "calm-mind.ogg" });
      battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
      void battleGrid.offsetWidth;
      battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
      window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
      window.setTimeout(() => wave.remove(), battleDelay(880));
      window.setTimeout(() => impact.remove(), battleDelay(980));
      return;
    }
    if (moveId === "vine-whip") {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const vine = document.createElement("span");
      vine.className = `vine-whip-effect ${moveEffectClass(type)} ${crit ? "is-critical" : ""}`;
      vine.style.setProperty("--vine-x", `${fromX}px`);
      vine.style.setProperty("--vine-y", `${fromY}px`);
      vine.style.setProperty("--vine-length", `${length}px`);
      vine.style.setProperty("--vine-angle", `${angle}deg`);
      vine.style.setProperty("--vine-scale", useTowerStyle ? "1.5" : "1");
      vine.innerHTML = `
        <svg class="vine-svg" viewBox="0 0 620 210" preserveAspectRatio="none" aria-hidden="true">
          <path class="vine-shadow vine-one" pathLength="1" d="M14 116 C88 72 164 64 244 94 C326 124 390 80 500 84 C548 86 584 102 612 122"></path>
          <path class="vine-shadow vine-two" pathLength="1" d="M12 118 C90 140 170 150 246 122 C326 92 392 134 498 130 C548 128 584 112 612 90"></path>
          <path class="vine-main vine-one" pathLength="1" d="M14 116 C88 72 164 64 244 94 C326 124 390 80 500 84 C548 86 584 102 612 122"></path>
          <path class="vine-main vine-two" pathLength="1" d="M12 118 C90 140 170 150 246 122 C326 92 392 134 498 130 C548 128 584 112 612 90"></path>
          <path class="vine-highlight vine-one" pathLength="1" d="M14 116 C88 72 164 64 244 94 C326 124 390 80 500 84 C548 86 584 102 612 122"></path>
          <path class="vine-highlight vine-two" pathLength="1" d="M12 118 C90 140 170 150 246 122 C326 92 392 134 498 130 C548 128 584 112 612 90"></path>
        </svg>
        <i class="leaf l1"></i>
        <i class="leaf l2"></i>
        <i class="leaf l3"></i>
        <i class="leaf l4"></i>
        <span class="whip-tip tip-one"></span>
        <span class="whip-tip tip-two"></span>
        <span class="vine-impact">
          <span class="impact-flash"></span>
          <span class="hit-mark mark-one"></span>
          <span class="hit-mark mark-two"></span>
          <i class="impact-leaf il1"></i>
          <i class="impact-leaf il2"></i>
          <i class="impact-leaf il3"></i>
          <i class="impact-leaf il4"></i>
        </span>
      `;
      battleGrid.appendChild(vine);

      target.classList.remove("is-vine-whipped");
      void target.offsetWidth;
      target.classList.add("is-vine-whipped");
      window.setTimeout(() => target.classList.remove("is-vine-whipped"), battleDelay(900));
      playRealMoveAudio({ audio: "vine-whip.ogg" });
      battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
      void battleGrid.offsetWidth;
      battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
      window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
      window.setTimeout(() => vine.remove(), battleDelay(1220));
      return;
    }
    if (moveId === "petal-storm") {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const leaves = document.createElement("span");
      leaves.className = `leaf-stream-effect ${moveEffectClass(type)} ${crit ? "is-critical" : ""}`;
      leaves.style.setProperty("--leaf-x", `${fromX}px`);
      leaves.style.setProperty("--leaf-y", `${fromY}px`);
      leaves.style.setProperty("--leaf-length", `${length}px`);
      leaves.style.setProperty("--leaf-angle", `${angle}deg`);
      leaves.style.setProperty("--leaf-scale", useTowerStyle ? "1.45" : "1");
      leaves.innerHTML = `
        <span class="wind-ribbon"></span>
        <i class="leaf l1"></i>
        <i class="leaf l2"></i>
        <i class="leaf l3"></i>
        <i class="leaf l4"></i>
        <i class="leaf l5"></i>
        <i class="leaf l6"></i>
        <i class="leaf l7"></i>
        <i class="leaf l8"></i>
        <i class="leaf l9"></i>
        <i class="leaf l10"></i>
        <i class="leaf l11"></i>
        <i class="leaf l12"></i>
      `;
      battleGrid.appendChild(leaves);

      const impact = document.createElement("span");
      impact.className = "leaf-impact-effect";
      impact.style.setProperty("--impact-x", `${toX}px`);
      impact.style.setProperty("--impact-y", `${toY}px`);
      impact.style.setProperty("--leaf-scale", useTowerStyle ? "1.45" : "1");
      impact.innerHTML = `
        <i class="cut c1"></i>
        <i class="cut c2"></i>
        <i class="cut c3"></i>
        <i class="cut c4"></i>
        <i class="leaf burst b1"></i>
        <i class="leaf burst b2"></i>
        <i class="leaf burst b3"></i>
        <i class="leaf burst b4"></i>
        <i class="leaf burst b5"></i>
        <i class="leaf burst b6"></i>
      `;
      battleGrid.appendChild(impact);

      target.classList.remove("is-leaf-stormed");
      void target.offsetWidth;
      target.classList.add("is-leaf-stormed");
      window.setTimeout(() => target.classList.remove("is-leaf-stormed"), battleDelay(880));
      playRealMoveAudio({ audio: "sleep-powder.ogg" });
      battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
      void battleGrid.offsetWidth;
      battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
      window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
      window.setTimeout(() => leaves.remove(), battleDelay(1040));
      window.setTimeout(() => impact.remove(), battleDelay(1120));
      return;
    }
    if (moveId === "surf") {
      const surf = document.createElement("span");
      surf.className = `surf-wave-effect ${moveEffectClass(type)} ${crit ? "is-critical" : ""}`;
      surf.style.setProperty("--impact-x", `${toX}px`);
      surf.style.setProperty("--impact-y", `${toY}px`);
      surf.style.setProperty("--surf-scale", useTowerStyle ? "1.75" : "1");
      surf.innerHTML = `
        <span class="surf-water-pool"></span>
        <span class="surf-wave-break">
          <svg class="surf-sea-wave" viewBox="0 0 220 150" aria-hidden="true">
            <path class="surf-wave-shape shadow" d="M8 132 C34 108 62 98 96 104 C128 110 152 106 174 86 C194 68 196 46 174 36 C197 28 215 46 216 74 C218 110 184 137 130 141 C86 144 47 135 8 132 Z"></path>
            <path class="surf-wave-shape body" d="M8 132 C34 108 62 98 96 104 C128 110 152 106 174 86 C194 68 196 46 174 36 C197 28 215 46 216 74 C218 110 184 137 130 141 C86 144 47 135 8 132 Z"></path>
            <path class="surf-wave-shape light" d="M24 126 C58 108 88 111 116 116 C151 122 180 106 210 82 C200 116 166 138 121 139 C82 140 52 132 24 126 Z"></path>
            <path class="surf-foam crest" d="M151 38 C164 19 198 25 209 55 C195 47 184 50 176 62 C164 80 139 80 119 68 C136 62 155 54 151 38 Z"></path>
            <path class="surf-foam lip" d="M54 100 C88 78 120 87 146 84 C163 82 174 74 183 63"></path>
            <path class="surf-foam base" d="M18 132 C55 120 83 132 118 132 C151 132 178 121 210 104"></path>
            <circle class="surf-foam-dot fd1" cx="158" cy="47" r="7"></circle>
            <circle class="surf-foam-dot fd2" cx="178" cy="58" r="5"></circle>
            <circle class="surf-foam-dot fd3" cx="128" cy="64" r="4"></circle>
            <circle class="surf-foam-dot fd4" cx="68" cy="108" r="5"></circle>
          </svg>
        </span>
        <span class="surf-wet-impact">
          <span class="wet-sheen"></span>
          <i class="water-stream s1"></i>
          <i class="water-stream s2"></i>
          <i class="water-stream s3"></i>
          <i class="water-stream s4"></i>
          <i class="water-drop d1"></i>
          <i class="water-drop d2"></i>
          <i class="water-drop d3"></i>
          <i class="water-drop d4"></i>
          <i class="water-drop d5"></i>
          <i class="water-drop d6"></i>
        </span>
      `;
      battleGrid.appendChild(surf);

      target.classList.remove("is-surf-hit");
      void target.offsetWidth;
      target.classList.add("is-surf-hit");
      window.setTimeout(() => target.classList.remove("is-surf-hit"), battleDelay(980));
      playRealMoveAudio({ audio: "reflect.ogg" });
      battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
      void battleGrid.offsetWidth;
      battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
      window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
      window.setTimeout(() => surf.remove(), battleDelay(1220));
      return;
    }
    if (realAnim) {
      const effect = document.createElement("span");
      const variantClass = realAnim.variant ? ` real-variant-${String(realAnim.variant).replace(/[^a-z0-9-]/gi, "").toLowerCase()}` : "";
      effect.className = `real-move-effect ${moveEffectClass(type)} ${moveIdClass(move)}${variantClass} ${crit ? "is-critical" : ""}`;
      effect.style.setProperty("--impact-x", `${toX}px`);
      effect.style.setProperty("--impact-y", `${toY}px`);
      effect.style.setProperty("--real-move-image", `url("assets/battle-animations/real/graphics/${realAnim.image}")`);
      const frameCount = Math.max(1, Number(realAnim.frames) || 1);
      effect.style.setProperty("--real-move-frames", frameCount);
      effect.style.setProperty("--real-move-sheet-width", `${frameCount * 100}%`);
      effect.style.setProperty("--real-move-frame-x", "0%");
      effect.style.setProperty("--real-move-width", `${realAnim.w || 192}px`);
      effect.style.setProperty("--real-move-height", `${realAnim.h || 192}px`);
      effect.style.setProperty("--real-move-scale", (realAnim.scale ?? 1) * (useTowerStyle ? 1.9 : 1));
      effect.style.setProperty("--real-move-offset-x", `${realAnim.x || 0}px`);
      effect.style.setProperty("--real-move-offset-y", `${realAnim.y || 0}px`);
      battleGrid.appendChild(effect);
      if (frameCount > 1) {
        let frame = 0;
        const frameMs = Math.max(34, Math.round(battleDelay(720) / frameCount));
        const timer = window.setInterval(() => {
          frame = Math.min(frame + 1, frameCount - 1);
          effect.style.setProperty("--real-move-frame-x", `${-(frame * 100) / frameCount}%`);
          if (frame >= frameCount - 1) {
            window.clearInterval(timer);
            activeRealMoveTimers.delete(timer);
          }
        }, frameMs);
        activeRealMoveTimers.add(timer);
      }
      playRealMoveAudio(realAnim);
      battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
      void battleGrid.offsetWidth;
      battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
      window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
      window.setTimeout(() => {
        effect.remove();
      }, battleDelay(920));
      return;
    }
    const effect = document.createElement("span");
    const directionClass = toX >= fromX ? "moves-right" : "moves-left";
    effect.className = `move-effect ${moveEffectClass(type)} ${moveIdClass(move)} ${directionClass} ${crit ? "is-critical" : ""}`;
    effect.style.setProperty("--from-x", `${fromX}px`);
    effect.style.setProperty("--from-y", `${fromY}px`);
    effect.style.setProperty("--to-x", `${toX}px`);
    effect.style.setProperty("--to-y", `${toY}px`);
    for (let i = 0; i < 6; i += 1) {
      const particle = document.createElement("i");
      particle.style.setProperty("--particle", i);
      effect.appendChild(particle);
    }
    battleGrid.appendChild(effect);
    const impact = document.createElement("span");
    impact.className = `move-impact-effect ${moveEffectClass(type)} ${moveIdClass(move)} ${crit ? "is-critical" : ""}`;
    impact.style.setProperty("--impact-x", `${toX}px`);
    impact.style.setProperty("--impact-y", `${toY}px`);
    for (let i = 0; i < 8; i += 1) {
      const shard = document.createElement("i");
      shard.style.setProperty("--shard", i);
      impact.appendChild(shard);
    }
    battleGrid.appendChild(impact);
    battleGrid.classList.remove("is-battle-flash", "is-battle-critical");
    void battleGrid.offsetWidth;
    battleGrid.classList.add(crit ? "is-battle-critical" : "is-battle-flash");
    window.setTimeout(() => battleGrid.classList.remove("is-battle-flash", "is-battle-critical"), battleDelay(crit ? 520 : 320));
    window.setTimeout(() => effect.remove(), battleDelay(920));
    window.setTimeout(() => impact.remove(), battleDelay(1120));
  }

  function animateHit(id, monName, amount, crit, eff) {
    const root = $(id);
    const el = root?.querySelector(`[data-battle-mon="${CSS.escape(monName)}"]`) || root;
    if (!el) return;
    playBattleSfx("hit", { crit, eff });
    el.classList.remove("is-hit", "is-critical-hit");
    void el.offsetWidth;
    el.classList.add("is-hit");
    if (crit) el.classList.add("is-critical-hit");
    if (el.classList.contains("fainted") || el.classList.contains("pending-faint")) {
      el.classList.add("is-fainting");
      playBattleSfx("faint");
    }
    const damage = document.createElement("span");
    damage.className = `damage-pop ${crit ? "critical" : ""} ${eff === 0 ? "immune" : eff > 1 ? "effective" : eff < 1 ? "resisted" : ""}`;
    damage.textContent = `${crit ? "Crit! " : ""}-${amount}`;
    el.appendChild(damage);
    window.setTimeout(() => damage.remove(), battleDelay(1900));
    if (crit) window.setTimeout(() => el.classList.remove("is-critical-hit"), battleDelay(620));
  }

  function animateBattlePopup(id, monName, text, kind = "info") {
    const root = $(id);
    const el = root?.querySelector(`[data-battle-mon="${CSS.escape(monName)}"]`) || root;
    if (!el) return;
    const popup = document.createElement("span");
    popup.className = `damage-pop battle-pop-${kind}`;
    popup.textContent = text;
    el.appendChild(popup);
    window.setTimeout(() => popup.remove(), battleDelay(1900));
  }

  function applyMoveEffect(move, attacker, defender, damage) {
    if (move.drain) {
      const beforeHeal = attacker.currentHp;
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + Math.ceil(damage * move.drain));
      draftTrackHealing(attacker, beforeHeal);
    }
    if (move.teamHeal) {
      (state.battle?.playerTeam || state.team).forEach((p) => {
        if (p.currentHp > 0) {
          const beforeHeal = p.currentHp;
          p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * move.teamHeal));
          draftTrackHealing(p, beforeHeal);
        }
      });
    }
    if (move.extra && battleRandom() < move.extra) {
      const extraDamage = Math.ceil(damage * 0.45);
      draftTrackDamage(attacker, defender, extraDamage);
      defender.currentHp -= extraDamage;
    }
    if (move.execute && defender.currentHp > 0 && defender.currentHp / defender.maxHp <= move.execute) defender.currentHp = 0;
    if (move.burn) defender.burn = 2;
  }

  function tickStatus(p) {
    if (!p?.burn) return "";
    const burnDamage = Math.ceil(p.maxHp * 0.06);
    if (state.battle?.draft) draftEnsureStats(p).taken += Math.max(0, Math.min(burnDamage, Math.max(0, p.currentHp || 0)));
    p.currentHp -= burnDamage;
    p.burn -= 1;
    return ` ${p.name} sofreu ${burnDamage} de queimadura.`;
  }

  function playerMove(move) {
    const p = activePlayer();
    const e = state.battle.enemy;
    let log = "";
    if (move === "swap") return showSwap();
    if (move === "guard") {
      p.guard = true;
      p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.05));
      log = `${p.name} defendeu e recuperou folego.`;
    } else if (move === "skill") {
      if (p.energy < 2) {
        $("battle-log").textContent = "Energia insuficiente. Ataque ou defenda para carregar.";
        return;
      }
      p.energy -= 2;
      const type = p.types[0];
      const hit = calcDamage(p, e, 1.35 + synergyTier(p.types) * 0.18, type);
      e.currentHp -= hit.amount;
      if (type === "Grass") p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(hit.amount * 0.25));
      if (type === "Electric" && Math.random() < 0.35) e.stunned = true;
      if (type === "Fire") e.burn = 2;
      if (type === "Water") e.weaken = 2;
      log = `${p.name} usou ${p.trait}: ${hit.amount} dano${hit.crit ? " crítico" : ""}.`;
    } else {
      const hit = calcDamage(p, e, 1, p.types[0]);
      e.currentHp -= hit.amount;
      p.energy = Math.min(4, p.energy + 1);
      log = `${p.name} atacou: ${hit.amount} dano${effectivenessText(hit.eff)}.`;
    }
    const healBonus = strongestBonus("heal", p);
    if (healBonus > 0) {
      const beforeHeal = p.currentHp;
      p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * healBonus));
      const healed = p.currentHp - beforeHeal;
      if (healed > 0) window.setTimeout(() => animateBattlePopup("player-card", p.name, `+${healed}`, "heal"), battleDelay(280));
    }
    if (e.currentHp <= 0) return handleEnemyFaint(log);
    enemyTurn(log);
  }

  function handleEnemyFaint(prefix) {
    const battle = state.battle;
    if (battle?.draft) {
      recordDraftBattleRound("player", activePlayer(), battle.enemy);
      battle.enemy.currentHp = 0;
      const nextIndex = battle.enemyTeam.findIndex((p, index) => index > battle.enemyIndex && p.currentHp > 0);
      if (nextIndex === -1) return finishDraftAutoBattle(true);
      battle.enemyIndex = nextIndex;
      battle.enemy = battle.enemyTeam[nextIndex];
      $("battle-title").textContent = `Draft Battle - ${battle.draftArena?.name || "Arena"}`;
      $("battle-log").textContent = `${prefix} O rival enviou ${battle.enemy.name}.`;
      renderBattle();
      window.setTimeout(() => animateBattleSendOut({ sides: ["enemy"] }), sendoutDelay(80));
      return;
    }
    const reward = awardBattleXp(battle.enemy, battle.boss);
    const xpLog = ` +${reward.xp} XP${reward.levels ? `, ${reward.levels} nível(is) ganho(s)` : ""}.`;
    if (!battle?.boss && !battle?.npc) return winBattle(`${prefix}${xpLog}`, reward);
    battle.enemy.currentHp = 0;
    const nextIndex = battle.enemyTeam.findIndex((p, index) => index > battle.enemyIndex && p.currentHp > 0);
    if (nextIndex === -1) return winBattle(`${prefix} ${battle.enemy.name} caiu.${xpLog}`, reward);
    battle.enemyIndex = nextIndex;
    battle.enemy = battle.enemyTeam[nextIndex];
    $("battle-title").textContent = `${battle.enemy.leader} enviou ${battle.enemy.name}`;
    $("battle-log").textContent = `${prefix}${xpLog} ${battle.enemy.leader} chamou ${battle.enemy.name}.`;
    renderBattle();
    window.setTimeout(() => animateBattleSendOut({ sides: ["enemy"] }), sendoutDelay(80));
    save();
  }

  function enemyTurn(log) {
    const p = activePlayer();
    const e = state.battle.enemy;
    if (e.stunned) {
      e.stunned = false;
      $("battle-log").textContent = `${log} ${e.name} perdeu o turno.`;
      renderBattle();
      save();
      return;
    }
    let power = state.battle.boss ? 1.1 : 0.92;
    if (e.weaken) {
      power *= 0.75;
      e.weaken -= 1;
    }
    const hit = calcDamage(e, p, power, e.types[0]);
    const amount = p.guard ? Math.ceil(hit.amount * 0.48) : hit.amount;
    p.guard = false;
    p.currentHp -= amount;
    if (e.burn) {
      e.currentHp -= Math.ceil(e.maxHp * 0.06);
      e.burn -= 1;
    }
    if (p.currentHp <= 0 && statBonus("sash", p) > 0 && !state.sashUsed) {
      p.currentHp = 1;
      state.sashUsed = true;
      log += " A Faixa Foco segurou o golpe fatal.";
    }
    markPendingBattleFaint(p);
    $("battle-log").textContent = `${log} ${e.name} respondeu com ${amount} dano.`;
    renderBattle();
    if (p.currentHp <= 0) {
      window.setTimeout(() => {
        const finishFaint = () => {
          const playerBeforeLosses = p;
          if (state.battle?.draft && !state.battle.playerTeam.some((mon) => mon.currentHp > 0)) return finishDraftAutoBattle(false);
          if (state.tower?.active && !state.team.some((mon) => mon.currentHp > 0)) return endRun(false);
          applyBattleLosses();
          const playerAfterLosses = activePlayer();
          if (!playerAfterLosses) return state.battle?.draft ? finishDraftAutoBattle(false) : endRun(false);
          renderBattle();
          if (playerAfterLosses !== playerBeforeLosses) {
            window.setTimeout(() => animateBattleSendOut({ sides: ["player"] }), sendoutDelay(80));
          }
          window.setTimeout(save, playerAfterLosses !== playerBeforeLosses ? sendoutDelay(BATTLE_SENDOUT_DURATION) : 0);
        };
        const faintDelayLeft = pendingBattleFaintDelay();
        if (faintDelayLeft > 0) window.setTimeout(finishFaint, faintDelayLeft);
        else finishFaint();
      }, 0);
      return;
    }
    if (e.currentHp <= 0) return handleEnemyFaint(log);
    save();
  }

  function victorySummaryMarkup({ prefix, reward, boss, defeated, defeatedName, recoveryLog, evolution }) {
    const battleType = state.battle?.tower
      ? "Torre"
      : boss
      ? defeated?.badge ? "Líder de ginásio" : "Liga"
      : state.battle?.legendary ? "Lendário" : state.battle?.npc ? "Treinador" : "Rota";
    return `
      <div class="victory-summary">
        <span><b>Batalha</b><strong>${battleType}</strong><small>${defeatedName || "Oponente"} derrotado</small></span>
        <span><b>XP total</b><strong>+${reward?.xp || 0}</strong><small>${reward?.levels || 0} nível(is) ganho(s)</small></span>
        <span><b>Recuperacao</b><strong>${boss ? "Total" : "Parcial"}</strong><small>${recoveryLog.trim()}</small></span>
        ${evolution ? `<span><b>Evolucao</b><strong>${evolution.to.name}</strong><small>${evolution.from.name} evoluiu</small></span>` : ""}
      </div>
      <p class="victory-log">${prefix}</p>
    `;
  }

  function winBattle(prefix, reward = { xp: 0, levels: 0 }) {
    if (state.battle?.tower) return winTowerBattle(prefix, reward);
    const battleArena = ARENAS.find((arena) => arena.floorTo === state.floor);
    const boss = state.battle.boss || !!battleArena;
    const defeated = boss ? state.battle.enemyTeam[state.battle.enemyTeam.length - 1] : null;
    const defeatedName = state.battle?.enemy?.name || defeated?.name || "Oponente";
    const earnedBadge = defeated?.badge && !state.badges.includes(defeated.badge) ? defeated.badge : null;
    let recoveryLog = "";
    state.team.forEach((p) => {
      if (p.currentHp > 0) {
        p.energy = Math.min(4, p.energy + 1);
        const routeRecovery = state.nuzlockeMode ? 0.32 : 0.18;
        p.currentHp = boss ? p.maxHp : Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * routeRecovery));
      } else if (boss && !state.nuzlockeMode) {
        p.currentHp = p.maxHp;
      }
    });
    recoveryLog = boss
      ? " O time foi totalmente recuperado."
      : " O time recuperou um pouco de HP.";
    state.threat = Math.min(3, state.threat + (boss ? 0 : state.nuzlockeMode ? 0.18 : 0.35));
    if (earnedBadge) state.badges.push(earnedBadge);
    if (boss && defeated?.badge) {
      const clearedArena = ARENAS.find((arena) => arena.badge === defeated.badge);
      const nextArena = ARENAS.find((arena) => arena.floorFrom === clearedArena?.floorTo);
      if (nextArena) {
        state.pendingMapFloor = nextArena.floorFrom;
      } else if (clearedArena) {
        state.pendingMapFloor = clearedArena.floorTo;
      }
    }
    state.battle = null;
    state.autoBattling = false;
    if (boss) state.branch = 0;
    if ((state.pendingMapFloor || state.floor) >= RUN_FLOORS) return endRun(true);
    const evolution = state.pendingEvolutions?.shift();
    $("choice-kicker").textContent = boss ? (defeated?.badge ? "Líder derrotado" : "Liga vencida") : evolution ? "Evolução" : "Vitória";
    $("choice-title").textContent = boss ? `${defeated?.leader || "Líder"} derrotado` : evolution ? `${evolution.from.name} evoluiu` : "Rota liberada";
    $("choice-copy").textContent = boss && defeated
      ? defeated.badge
        ? `${prefix} ${defeated.leader} entregou a insígnia ${defeated.arena}. O mapa mudou para a próxima arena.${recoveryLog}`
        : `${prefix} ${defeated.leader} caiu na Liga ${defeated.arena}. A próxima sala foi aberta.${recoveryLog}`
      : evolution
        ? `${prefix} ${evolution.from.name} virou ${evolution.to.name}. O time ganhou experiência.${recoveryLog}`
        : `${prefix} O time ganhou experiência.${recoveryLog} Escolha quando avançar.`;
    $("choice-grid").innerHTML = `
      ${earnedBadge ? `<div class="badge-reward-card"><img src="${badgeSprite(earnedBadge)}" alt="Insignia ${earnedBadge}"><strong>Insignia ${defeated.arena}</strong><small>Conquistada de ${defeated.leader}</small></div>` : ""}
      ${renderEvolutionSummary(evolution)}
      <button class="choice-button" type="button" data-action="map"><strong>Continuar rota</strong><small>Voltar ao mapa e escolher o próximo andar.</small></button>
    `;
    $("choice-copy").innerHTML = victorySummaryMarkup({ prefix, reward, boss, defeated, defeatedName, recoveryLog, evolution });
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-choice-modal", "has-victory-modal");
    save();
  }

  function showSwap() {
    const playerTeam = state.battle?.playerTeam || state.team;
    $("choice-kicker").textContent = "Troca tatica";
    $("choice-title").textContent = "Escolha o novo ativo";
    $("choice-copy").textContent = "Trocar consome seu turno. Use quando o tipo do inimigo está ruim para você.";
    $("choice-grid").innerHTML = playerTeam.map((p, i) => `
      <button class="choice-button" type="button" data-swap="${i}" ${p.currentHp <= 0 || p === activePlayer() ? "disabled" : ""}>
        <strong>${p.name}</strong>
        <small>Lv.${p.level} · HP ${p.currentHp}/${p.maxHp}</small>
        ${renderTypeChips(p.types)}
      </button>
    `).join("");
    show("choice");
  }

  function towerFaintedSlotIndex() {
    return state.tower?.active ? state.team.findIndex((p) => p?.currentHp <= 0) : -1;
  }

  function hasRecruitSlot() {
    return state.team.length < 6 || (state.team.length >= 6 && towerFaintedSlotIndex() >= 0);
  }

  async function showCatch() {
    const picks = (await recruitPoolExpanded(3)).map((p) => maybeMarkShiny(cloneMon(p, recruitLevel())));
    registerDexSeenMany(picks);
    const teamIsFull = !hasRecruitSlot();
    const continueAction = state.tower?.active ? "tower-order" : "map";
    const continueLabel = state.tower?.active ? "Continuar subida" : "Continuar rota";
    const continueCopy = state.tower?.active ? "Ir para o próximo andar." : teamIsFull ? "Manter seu time atual." : "Pular este recrutamento.";
    $("choice-kicker").textContent = "Recrutamento";
    $("choice-title").textContent = teamIsFull ? "Time completo" : "Um aliado pode entrar";
    $("choice-copy").textContent = teamIsFull
      ? "Seu time já tem 6 Pokémon. Escolha um aliado novo para trocar ou siga a rota."
      : "Tipos repetidos ativam sinergias, mas cobertura de tipo salva runs.";
    const recruitChoices = picks.map((p, i) => `
      <button class="choice-button pokemon-choice" type="button" data-catch="${i}">
        <img src="${animated(p)}" alt="" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>${teamIsFull ? "Trocar por alguém do time" : `Lv.${p.level} ? ${p.trait}`}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${p.trait}</span>
          ${statPreviewWithItem(p, null)}
          ${statBars(p)}
          <small>HP ${p.maxHp}/${p.maxHp} · Energia ${p.energy}</small>
        </span>
      </button>
    `).join("");
    $("choice-grid").innerHTML = recruitChoices
      ? `${recruitChoices}
        <button class="choice-button" type="button" data-action="${continueAction}">
          <strong>${continueLabel}</strong>
          <small>${continueCopy}</small>
        </button>`
      : `<button class="choice-button" type="button" data-action="${continueAction}"><strong>${continueLabel}</strong><small>${state.tower?.active ? "Nenhum aliado apareceu agora." : "Nenhum Pokémon novo apareceu."}</small></button>`;
    state.offer = picks;
    show("choice");
  }

  function showRecruitReplace(mon) {
    if (!mon) return renderMap();
    const continueAction = state.tower?.active ? "tower-order" : "map";
    const continueLabel = state.tower?.active ? "Continuar subida" : "Continuar rota";
    state.pendingRecruit = mon;
    $("choice-kicker").textContent = "Troca de time";
    $("choice-title").textContent = `Recrutar ${mon.name}`;
    $("choice-copy").textContent = "Escolha qual Pokémon sai do time. O novo aliado entra com HP cheio e mantém o nível da oferta.";
    $("choice-copy").textContent = "Escolha qual Pokémon sai do time. Se ele segurar uma relíquia, ela volta para a bag.";
    $("choice-grid").innerHTML = state.team.map((p, i) => `
      <button class="choice-button pokemon-choice" type="button" data-replace-recruit="${i}">
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>Sai do time</span>
          ${statPreviewWithItem(p, heldItems(p)[0])}
          ${statBars(p)}
          <small>${heldItems(p).length ? `${heldItemsDetailText(p)} voltam para a bag` : "Sem item equipado"}</small>
        </span>
      </button>
    `).join("") + `
      <button class="choice-button pokemon-choice" type="button" data-action="catch">
        <img src="${animated(mon)}" alt="${mon.name}" onerror="this.src='${mini(mon)}'">
        <strong>Voltar</strong>
        <small>Escolher outro recruta.</small>
      </button>
      <button class="choice-button" type="button" data-action="${continueAction}">
        <strong>${continueLabel}</strong>
        <small>${state.tower?.active ? "Ir para o próximo andar." : "Cancelar recrutamento."}</small>
      </button>
    `;
    show("choice");
  }

  function showRecruitReplace(mon) {
    if (!mon) return renderMap();
    const continueAction = state.tower?.active ? "tower-order" : "map";
    const continueLabel = state.tower?.active ? "Continuar subida" : "Continuar rota";
    state.pendingRecruit = mon;
    $("choice-kicker").textContent = "Troca de time";
    $("choice-title").textContent = `Recrutar ${mon.name}`;
    $("choice-copy").textContent = "Escolha qual Pokémon sai do time. Se ele segurar uma relíquia, ela volta para a bag.";
    const recruitPreview = `
      <div class="recruit-replace-preview">
        <img src="${animated(mon)}" alt="${mon.name}" onerror="this.src='${mini(mon)}'">
        <div>
          <strong>${mon.name}</strong>
          <small>Lv.${mon.level} - HP ${mon.maxHp}/${mon.maxHp} - ${mon.trait || "Novo aliado"}</small>
          ${renderTypeChips(mon.types)}
        </div>
      </div>
    `;
    const teamCards = state.team.map((p, i) => `
      <button class="choice-button pokemon-choice tower-order-choice recruit-replace-choice" type="button" data-replace-recruit="${i}">
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <span class="tower-order-rank">Sai</span>
        <strong>${p.name}</strong>
        <span class="held-slot-grid tower-card-slots">${towerHeldSlotsMarkup(p, i)}</span>
        <small>Lv.${p.level} - HP ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${p.trait || "Atual no time"}</span>
          ${statBars(p)}
          <small>${heldItems(p).length ? `${heldItemsDetailText(p)} voltam para a bag` : "Sem relíquia equipada"}</small>
          <small>Moves: ${(p.moves || []).map((move) => move.name).join(", ") || "Ataque basico"}</small>
        </span>
        <span class="tower-card-action" data-replace-recruit="${i}">Substituir</span>
      </button>
    `).join("");
    $("choice-grid").innerHTML = `
      ${recruitPreview}
      <div class="tower-order-mons recruit-replace-mons">${teamCards}</div>
      <div class="tower-order-actions recruit-replace-actions">
        <button class="choice-button tower-order-action" type="button" data-action="catch">
          <strong>Voltar</strong>
          <small>Escolher outro recruta.</small>
        </button>
        <button class="choice-button tower-order-action" type="button" data-action="${continueAction}">
          <strong>${continueLabel}</strong>
          <small>${state.tower?.active ? "Ir para o próximo andar." : "Cancelar recrutamento."}</small>
        </button>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-tower-order-modal", "has-recruit-replace-modal");
    setupRecruitReplaceCarousel();
  }

  function setupRecruitReplaceCarousel() {
    const track = document.querySelector(".recruit-replace-mons");
    if (!track || track.dataset.carouselReady) return;
    track.dataset.carouselReady = "true";
    let dragging = false;
    let didDrag = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let handledPointerSelection = false;
    track.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".tower-order-action, .tower-held-slot")) return;
      dragging = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(event.pointerId);
    });
    track.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 14) didDrag = true;
      track.scrollLeft = dragStartScroll - delta;
      event.preventDefault();
    });
    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      track.releasePointerCapture?.(event.pointerId);
      if (!didDrag) {
        const button = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("[data-replace-recruit]");
        if (button && track.contains(button)) {
          handledPointerSelection = true;
          replacePokemon(Number(button.dataset.replaceRecruit));
        }
      }
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-replace-recruit]");
      if (handledPointerSelection) {
        event.preventDefault();
        event.stopPropagation();
        handledPointerSelection = false;
        return;
      }
      if (!didDrag && button && track.contains(button)) {
        event.preventDefault();
        event.stopPropagation();
        return replacePokemon(Number(button.dataset.replaceRecruit));
      }
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    }, true);
  }

  function showItem() {
    const picks = itemPool(3);
    $("choice-kicker").textContent = "Relíquia";
    $("choice-title").textContent = "Escolha uma melhoria";
    $("choice-copy").textContent = state.tower?.active
      ? "Escolha uma relíquia. Ela vai para a mochila e você prepara o time em seguida."
      : "Escolha um item e equipe em um Pokémon. Alguns efeitos também contam como relíquia da run.";
    $("choice-grid").innerHTML = picks.map((item, i) => `
      <button class="choice-button item-choice" type="button" data-item="${i}">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <strong>${item.name}</strong>
        <small>${itemShortText(item)}</small>
        <span class="choice-hover-detail">
          <span>Relíquia</span>
          <small>${itemShortText(item)}</small>
          ${itemBonusMarkup(item)}
        </span>
      </button>
    `).join("");
    state.offer = picks;
    show("choice");
  }

  function showEquipItem(item) {
    state.pendingItem = item;
    $("choice-kicker").textContent = "Equipar item";
    $("choice-title").textContent = item.name;
    $("choice-copy").textContent = itemShortText(item);
    const equipCards = state.team.map((p, i) => `
      <button class="choice-button pokemon-choice tower-order-choice equip-item-choice" type="button" data-equip="${i}">
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <span class="equipped-item-pill ${heldItems(p).length ? "" : "empty"}">
          <span class="held-slot-grid">${towerHeldSlotsMarkup(p, i)}</span>
          <span>
            <b>${heldItems(p).length ? `${heldItems(p).length}/${MAX_HELD_ITEMS} relíquias` : "Slot livre"}</b>
            <small>${heldItems(p).length ? heldItemsDetailText(p) : "Sem relíquia equipada"}</small>
          </span>
        </span>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${heldItems(p).length ? `Atual: ${heldItemsDetailText(p)}` : "Livre"}</span>
          ${statBars(p)}
          <small>HP ${Math.max(0, p.currentHp)}/${p.maxHp} · Energia ${p.energy}</small>
        </span>
        <span class="tower-card-action" data-equip="${i}">Equipar aqui</span>
      </button>
    `).join("");
    $("choice-grid").innerHTML = `
      <div class="pending-item-card">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <span>
          <strong>${item.name}</strong>
          <small>${itemShortText(item)}</small>
        </span>
        ${itemBonusMarkup(item)}
      </div>
      <div class="tower-equip-mons equip-item-mons">${equipCards}</div>
      <button class="choice-button item-choice store-item-choice" type="button" data-store-item="1">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <strong>Guardar na bag</strong>
        <small>${itemShortText(item)}</small>
      </button>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-equip-item-modal");
    setupTowerEquipCarousel();
    setupHeldSlotDragDrop();
  }

  function setupTowerEquipCarousel() {
    const track = document.querySelector(".tower-equip-mons");
    if (!track || track.dataset.carouselReady) return;
    track.dataset.carouselReady = "true";
    let dragging = false;
    let didDrag = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let handledPointerSelection = false;
    track.addEventListener("pointerdown", (event) => {
      dragging = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(event.pointerId);
    });
    track.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 14) didDrag = true;
      track.scrollLeft = dragStartScroll - delta;
      event.preventDefault();
    });
    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      track.releasePointerCapture?.(event.pointerId);
      if (!didDrag) {
        const button = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("[data-equip]");
        if (button && track.contains(button)) {
          handledPointerSelection = true;
          equipPendingItem(Number(button.dataset.equip));
        }
      }
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("mouseup", (event) => {
      if (didDrag) return;
      const button = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("[data-equip]");
      if (button && track.contains(button)) equipPendingItem(Number(button.dataset.equip));
    });
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-equip]");
      if (handledPointerSelection) {
        event.preventDefault();
        event.stopPropagation();
        handledPointerSelection = false;
        return;
      }
      if (didDrag) {
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
        return;
      }
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      equipPendingItem(Number(button.dataset.equip));
    }, true);
  }

  function ensureHeldTooltip() {
    let tooltip = document.querySelector(".held-slot-floating-tooltip");
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.className = "held-slot-floating-tooltip";
    tooltip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function showHeldTooltip(slot) {
    const tooltip = ensureHeldTooltip();
    const title = slot.dataset.heldTooltip || "";
    const text = slot.dataset.heldTooltipText || "";
    tooltip.innerHTML = `<strong>${title}</strong><small>${text}</small>`;
    tooltip.classList.add("is-visible");
    tooltip.setAttribute("aria-hidden", "false");
    positionHeldTooltip(slot, tooltip);
  }

  function positionHeldTooltip(slot, tooltip = ensureHeldTooltip()) {
    if (!tooltip.classList.contains("is-visible")) return;
    const rect = slot.getBoundingClientRect();
    const width = tooltip.offsetWidth || 190;
    const height = tooltip.offsetHeight || 62;
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2));
    const top = rect.top - height - 10 > 8 ? rect.top - height - 10 : rect.bottom + 10;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - height - 8, top))}px`;
  }

  function hideHeldTooltip() {
    const tooltip = document.querySelector(".held-slot-floating-tooltip");
    if (!tooltip) return;
    tooltip.classList.remove("is-visible");
    tooltip.setAttribute("aria-hidden", "true");
  }

  function showReplaceItem(index) {
    const p = state.team[index];
    if (!p || !state.pendingItem) return renderMap();
    const equipped = heldItems(p);
    const replacedItem = equipped[0];
    state.pendingEquipIndex = index;
    $("choice-kicker").textContent = "Item equipado";
    $("choice-title").textContent = p.name;
    $("choice-copy").textContent = `${p.name} já usa ${MAX_HELD_ITEMS} relíquias. Trocar o primeiro slot ou guardar na bag?`;
    $("choice-grid").innerHTML = `
      <button class="choice-button item-choice" type="button" data-confirm-equip="1">
        <img class="animated-item" src="${itemSprite(state.pendingItem)}" alt="${state.pendingItem.name}">
        <strong>Trocar slot 1</strong>
        <small>${state.pendingItem.name} entra. ${replacedItem.name} volta para a bag.</small>
      </button>
      <button class="choice-button item-choice" type="button" data-store-item="1">
        <img class="animated-item" src="${itemSprite(state.pendingItem)}" alt="${state.pendingItem.name}">
        <strong>Guardar novo</strong>
        <small>Mantem ${heldItemsDetailText(p)} em ${p.name}.</small>
      </button>
    `;
    show("choice");
  }

  function storePendingItem() {
    if (!state.pendingItem) return;
    state.items.push({ ...state.pendingItem });
    state.pendingItem = null;
    state.pendingEquipIndex = null;
    if (state.tower?.active) return towerPrepareNextStep();
    renderMap();
    save();
  }

  function equipPendingItem(index, replace = false) {
    const p = state.team[index];
    if (!p || !state.pendingItem) return;
    const equipped = heldItems(p);
    if (equipped.length >= MAX_HELD_ITEMS && !replace) return showReplaceItem(index);
    if (equipped.length >= MAX_HELD_ITEMS && replace) {
      state.items.push({ ...equipped.shift() });
    }
    equipped.push({ ...state.pendingItem });
    setHeldItems(p, equipped);
    state.pendingItem = null;
    state.pendingEquipIndex = null;
    if (state.tower?.active) return towerPrepareNextStep();
    renderMap();
    save();
  }

  function showCamp() {
    const beforeThreat = state.threat;
    const recoveryRows = state.team.map((p) => ({
      p,
      beforeHp: Math.max(0, p.currentHp),
      beforeEnergy: p.energy || 0
    }));
    state.team.forEach((p) => {
      p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.62));
      p.energy = Math.min(4, p.energy + 1);
    });
    state.threat = Math.max(1, state.threat - 0.75);
    const healedHp = recoveryRows.reduce((total, row) => total + Math.max(0, row.p.currentHp - row.beforeHp), 0);
    const gainedEnergy = recoveryRows.reduce((total, row) => total + Math.max(0, (row.p.energy || 0) - row.beforeEnergy), 0);
    $("choice-kicker").textContent = "Centro";
    $("choice-title").textContent = "Time recuperado";
    $("choice-copy").textContent = "A equipe recebeu atendimento antes de voltar para a rota.";
    $("choice-grid").innerHTML = `
      <div class="center-popup-card">
        <span class="center-popup-icon" aria-hidden="true">
          <img src="${trainerSprite("pokemoncenterlady")}" alt="">
        </span>
        <div class="center-popup-stats">
          <span><b>HP</b><strong>+${healedHp}</strong></span>
          <span><b>Energia</b><strong>+${gainedEnergy}</strong></span>
          <span><b>Risco</b><strong>-${(beforeThreat - state.threat).toFixed(2).replace(/\.00$/, "")}</strong></span>
        </div>
        <div class="center-popup-team">
          ${recoveryRows.map(({ p, beforeHp, beforeEnergy }) => `
            <span>
              <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
              <strong>${p.name}</strong>
              <small>HP ${beforeHp}/${p.maxHp} -> ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
              <i>EN ${beforeEnergy} -> ${p.energy}</i>
            </span>
          `).join("")}
        </div>
      </div>
      <button class="choice-button center-continue-button" type="button" data-action="map"><strong>Continuar</strong><small>Escolher o próximo nó.</small></button>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal", "has-center-modal");
    save();
  }

  function showTrain() {
    $("choice-kicker").textContent = "Treino";
    $("choice-title").textContent = "Fortalecer um parceiro";
    $("choice-copy").textContent = "Treino d? n?vel e energia, mas aumenta o risco das próximas batalhas.";
    $("choice-grid").innerHTML = state.team.map((p, i) => `
      <button class="choice-button pokemon-choice" type="button" data-train="${i}">
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>Lv.${p.level} para Lv.${p.level + 1}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${p.trait}</span>
          ${statBars(p)}
          <small>HP ${Math.max(0, p.currentHp)}/${p.maxHp} · Energia ${p.energy}</small>
        </span>
      </button>
    `).join("");
    show("choice");
  }

  function showRandomEventExpanded() {
    const randomItem = () => ({ ...ITEMS[Math.floor(Math.random() * ITEMS.length)] });
    const livingTeam = () => state.team.filter((p) => p.currentHp > 0);
    const weakestLiving = () => [...livingTeam()].sort((a, b) => (a.level - b.level) || (a.currentHp - b.currentHp))[0];
    const refreshLeveledMon = (p, healRatio = 1) => {
      applyLevelCap(p);
      p.maxHp = hpMax(p);
      p.currentHp = Math.min(p.maxHp, Math.max(1, p.currentHp) + Math.ceil(p.maxHp * healRatio));
      syncMoves(p);
      maybeAutoEvolve(p);
    };
    const events = [
      { name: "Fonte escondida", text: "Um brilho entre as pedras revela água limpa o bastante para recuperar o fôlego antes da próxima luta.", effect: "Cura 35% do HP máximo de todo o time.", run: () => {
        state.team.forEach((p) => p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.35)));
        return "Todo o time recuperou vida.";
      } },
      { name: "Atalho perigoso", text: "Você corta caminho por uma passagem instável. A rota fica mais segura, mas o time sai arranhado.", effect: "Risco -0.5. Cada Pokémon perde 12% do HP máximo, sem cair abaixo de 1 HP.", run: () => {
        state.threat = Math.max(1, state.threat - 0.5);
        state.team.forEach((p) => p.currentHp = Math.max(1, p.currentHp - Math.ceil(p.maxHp * 0.12)));
        return "O risco da rota diminuiu, mas o time recebeu dano leve.";
      } },
      { name: "Treinador generoso", text: "Um treinador veterano reconhece sua run e divide macetes de ritmo para a próxima batalha.", effect: "Todos ganham +1 energia.", run: () => {
        state.team.forEach((p) => p.energy = Math.min(4, p.energy + 1));
        return "A energia do time subiu.";
      } },
      { name: "Armadilha", text: "O baú estava protegido. Você aciona o alarme, mas consegue puxar uma relíquia antes de fugir.", effect: "Risco +0.45. Ganha 1 relíquia aleatória na bag.", run: () => {
        const item = randomItem();
        state.threat = Math.min(3, state.threat + 0.45);
        state.items.push(item);
        return `${item.name} foi para a bag.`;
      } },
      { name: "Doce raro", text: "Um pacote lacrado aparece na trilha. O parceiro mais atrasado recebe um impulso para acompanhar o grupo.", effect: "O Pokémon vivo de menor nível ganha +2 níveis e cura totalmente.", run: () => {
        const target = weakestLiving();
        if (!target) return "Não havia Pokémon ativo para receber o bônus.";
        target.level += 2;
        refreshLeveledMon(target, 1);
        return `${target.name} ganhou 2 níveis.`;
      } },
      { name: "Especialista de tipos", text: "Uma pesquisadora nota a sinergia do time e ajusta a estratégia dos Pokémon que compartilham tipos.", effect: "Pokémon com tipo repetido no time ganham +2 energia.", run: () => {
        const counts = countTypes();
        state.team.forEach((p) => { if (p.types.some((t) => counts[t] >= 2)) p.energy = Math.min(4, p.energy + 2); });
        return "As linhas de tipo repetido ficaram prontas para agir.";
      } },
      { name: "Mercador estranho", text: "Um vendedor aparece com uma pedra remendada e jura que ela funciona. Estranhamente, funciona.", effect: "Tenta evoluir o primeiro Pokémon compatível do time.", run: () => {
        const target = state.team.find((p) => EVOLUTIONS[p.id]);
        if (!target) return "Ninguém no time reagiu à pedra.";
        evolvePokemon(target);
        return `${target.name} recebeu a pedra improvisada.`;
      } },
      { name: "Chuva de faíscas", text: "Faíscas cruzam o céu da rota e deixam o time em alerta, como se a batalha já tivesse começado.", effect: "Atualiza golpes do time e concede +1 energia.", run: () => {
        state.team.forEach((p) => { syncMoves(p); p.energy = Math.min(4, p.energy + 1); });
        return "O time revisou seus golpes e ganhou energia.";
      } },
      { name: "Acampamento seguro", text: "Você encontra uma clareira protegida. D? para respirar fundo sem perder totalmente o embalo da run.", effect: "Cura 20% do time e reduz o risco em 0.25.", run: () => {
        state.threat = Math.max(1, state.threat - 0.25);
        state.team.forEach((p) => p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.2)));
        return "O time descansou e a rota ficou menos perigosa.";
      } },
      { name: "Bolsa perdida", text: "Uma mochila abandonada guarda itens bons demais para ignorar. Mexer nela faz barulho na rota.", effect: "Ganha 2 relíquias aleatórias, mas o risco sobe +0.35.", run: () => {
        const found = [randomItem(), randomItem()];
        state.items.push(...found);
        state.threat = Math.min(3, state.threat + 0.35);
        return `${found.map((item) => item.name).join(" e ")} foram para a bag.`;
      } },
      { name: "Santuario antigo", text: "Um altar gasto responde ao time. A run fica mais pesada, mas seus parceiros saem revigorados.", effect: "Todos ganham +1 energia e o risco sobe +0.2.", run: () => {
        state.threat = Math.min(3, state.threat + 0.2);
        state.team.forEach((p) => p.energy = Math.min(4, p.energy + 1));
        return "O time ganhou energia, mas chamou aten??o na rota.";
      } },
      { name: "Oficina de relíquias", text: "Uma mecânica viajante ajusta a primeira relíquia solta da bag para encaixar melhor no time.", effect: "Se houver item na bag, troca o primeiro por uma nova relíquia aleatória.", run: () => {
        if (!state.items.length) {
          const item = randomItem();
          state.items.push(item);
          return `A bag estava vazia, então ${item.name} foi criada.`;
        }
        const oldItem = state.items.shift();
        const item = randomItem();
        state.items.push(item);
        return `${oldItem.name} virou ${item.name}.`;
      } },
      { name: "Rival apressado", text: "Um rival passa correndo e provoca seu líder de time. A resposta vem em forma de treino rápido.", effect: "O primeiro Pokémon vivo ganha +1 nível, +1 energia e uma cura pequena.", run: () => {
        const target = livingTeam()[0];
        if (!target) return "O time não tinha ninguém em pé para responder.";
        target.level += 1;
        target.energy = Math.min(4, target.energy + 1);
        refreshLeveledMon(target, 0.25);
        return `${target.name} treinou no susto.`;
      } },
      { name: "Neblina densa", text: "A visibilidade cai e os inimigos perdem seu rastro por alguns minutos.", effect: "Risco -0.35, mas todos perdem 1 energia.", run: () => {
        state.threat = Math.max(1, state.threat - 0.35);
        state.team.forEach((p) => p.energy = Math.max(0, p.energy - 1));
        return "A rota ficou mais calma, mas o time perdeu ritmo.";
      } },
      { name: "Fruta madura", text: "Uma árvore baixa tem frutas suficientes para salvar o Pokémon mais machucado.", effect: "O Pokémon vivo com menor porcentagem de HP cura 50%.", run: () => {
        const target = [...livingTeam()].sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0];
        if (!target) return "Não havia Pokémon ativo para comer a fruta.";
        target.currentHp = Math.min(target.maxHp, target.currentHp + Math.ceil(target.maxHp * 0.5));
        return `${target.name} recuperou bastante HP.`;
      } }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    const eventResult = event.run();
    const evolution = state.pendingEvolutions?.shift();
    if (evolution) return showEvolutionPopup(evolution);
    $("choice-kicker").textContent = "Evento aleatorio";
    $("choice-title").textContent = event.name;
    $("choice-copy").innerHTML = `${event.text}<br><strong>Efeito:</strong> ${event.effect}<br><strong>Resultado:</strong> ${eventResult || "Evento aplicado."}`;
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="map"><strong>Continuar</strong><small>Voltar para a rota.</small></button>`;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal");
    save();
  }

  function towerProgressLabel() {
    if (!state.tower?.active) return "";
    if (!Number.isFinite(state.tower.totalFloors)) return `Andar ${state.floor}`;
    return `Andar ${state.floor}/${state.tower.totalFloors}`;
  }

  function towerUpcomingHint() {
    const nextFloor = (state.floor || 0) + 1;
    if (nextFloor <= 5) return "inimigo protegido, nível parecido e dano reduzido";
    if (nextFloor % 10 === 0) return "andar raro, maior chance de tipo incomum ou lendário";
    const teamTypes = state.team.flatMap((p) => p.types || []);
    const leadType = teamTypes[nextFloor % Math.max(1, teamTypes.length)] || "Normal";
    return `tipo prov?vel variado, prepare cobertura contra ${leadType}`;
  }

  function showTowerTeamOrder(options = {}) {
    if (!state.tower?.active) return towerNextStep();
    document.querySelector(".rogue-stage")?.classList.remove("has-tower-learn-modal");
    towerOrderSuppressClickUntil = 0;
    towerOrderPointerStart = null;
    if ((state.floor || 0) >= 10) {
      const aliveOnly = state.team.filter((p) => p.currentHp > 0);
      if (aliveOnly.length !== state.team.length) {
        state.team = aliveOnly;
        state.pendingTowerOrder = [];
      }
    }
    const aliveTeam = state.team
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p?.currentHp > 0);
    if (aliveTeam.length <= 1 && !state.items.length && !options.keepPreparing) return towerNextStep();
    state.pendingTowerOrder = Array.isArray(state.pendingTowerOrder)
      ? state.pendingTowerOrder.filter((index) => aliveTeam.some((entry) => entry.i === index))
      : [];
    const selected = new Set(state.pendingTowerOrder);
    const complete = state.pendingTowerOrder.length >= aliveTeam.length;
    $("choice-kicker").textContent = "Preparar equipe";
    $("choice-title").textContent = "Escolha a ordem";
    $("choice-copy").textContent = complete
      ? "Ordem definida. Confirme para subir com essa forma??o."
      : `Clique na sequência desejada. Próxima posição: ${state.pendingTowerOrder.length + 1}.`;
    $("choice-copy").textContent += ` Próximo andar: ${towerUpcomingHint()}.`;
    $("choice-grid").innerHTML = `
      ${towerBagDockMarkup()}
      <div class="tower-order-mons">
    ${aliveTeam.map(({ p, i }) => `
      <button class="choice-button pokemon-choice tower-order-choice ${selected.has(i) ? "is-picked" : ""}" type="button" data-tower-order-pick="${i}" ${selected.has(i) ? "disabled" : ""}>
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <span class="tower-order-rank">${selected.has(i) ? `${state.pendingTowerOrder.indexOf(i) + 1}?` : "..."}</span>
        <strong>${p.name}</strong>
        <span class="held-slot-grid tower-card-slots">${towerHeldSlotsMarkup(p, i)}</span>
        <small>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${p.trait || "Líder da subida"}</span>
          ${statBars(p)}
          <small>Energia ${p.energy || 0} · ${heldItemSummary(p)}</small>
          <small>Moves: ${(p.moves || []).map((move) => move.name).join(", ") || "Ataque básico"}</small>
        </span>
        <span class="tower-card-action" data-tower-order-pick="${i}">${selected.has(i) ? "Escolhido" : "Escolher"}</span>
      </button>
    `).join("")}
      </div>
      <div class="tower-order-actions">
        <button class="choice-button tower-order-action" type="button" data-action="${complete ? "tower-confirm-order" : "tower-reset-order"}">
          <strong>${complete ? "Confirmar ordem" : "Recomeçar"}</strong>
          <small>${complete ? "Subir com essa forma??o." : "Limpar escolhas."}</small>
        </button>
      </div>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-tower-order-modal");
    setupTowerOrderCarousel();
    setupTowerOrderCardSelection();
    setupTowerBagDock();
    save();
  }

  function pickTowerOrderIndex(index) {
    if (!state.tower?.active) return false;
    const aliveIndexes = state.team.map((p, i) => (p?.currentHp > 0 ? i : null)).filter((i) => i !== null);
    state.pendingTowerOrder = Array.isArray(state.pendingTowerOrder) ? state.pendingTowerOrder : [];
    if (!aliveIndexes.includes(index) || state.pendingTowerOrder.includes(index)) return false;
    state.pendingTowerOrder.push(index);
    showTowerTeamOrder();
    return true;
  }

  function setupTowerOrderCardSelection() {
    document.querySelectorAll(".tower-order-choice[data-tower-order-pick]").forEach((button) => {
      if (button.dataset.orderClickReady) return;
      button.dataset.orderClickReady = "true";
      let startX = 0;
      let startY = 0;
      button.addEventListener("pointerdown", (event) => {
        if (event.target.closest?.(".tower-held-slot")) return;
        startX = event.clientX;
        startY = event.clientY;
      });
      button.addEventListener("pointerup", (event) => {
        if (event.target.closest?.(".tower-held-slot")) return;
        if (Math.hypot(event.clientX - startX, event.clientY - startY) > 10) return;
        event.preventDefault();
        event.stopPropagation();
        pickTowerOrderIndex(Number(button.dataset.towerOrderPick));
      });
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    });
  }

  function towerBagDockMarkup() {
    return `
      <div class="tower-bag-dock">
        <button class="tower-bag-icon" type="button" data-tower-bag-toggle="1" aria-label="Abrir mochila de relíquias" title="Mochila de relíquias">
          <span aria-hidden="true"></span>
          <b>${state.items.length}</b>
        </button>
        <div class="tower-bag-popover" data-tower-bag-popover>
          <strong>Mochila</strong>
          <small>${state.items.length ? "Arraste uma relíquia para um slot." : "Sem relíquias guardadas."}</small>
          <div class="tower-bag-dropzone" data-bag-drop="1">Solte aqui para guardar</div>
          <div class="tower-bag-items">
            ${state.items.length ? state.items.map((item, index) => `
              <button class="tower-bag-item" type="button" draggable="true" data-bag-item="${index}" data-bag-drag="${index}" data-held-tooltip="${item.name}" data-held-tooltip-text="${itemShortText(item)}">
                <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
                <span><b>${item.name}</b><small>${itemShortText(item)}</small></span>
              </button>
            `).join("") : `<span class="tower-bag-empty">A mochila está vazia.</span>`}
          </div>
        </div>
      </div>
    `;
  }

  function setupTowerBagDock() {
    const docks = [...document.querySelectorAll(".tower-bag-dock")];
    const dock = docks.find((entry) => !entry.dataset.ready) || docks[docks.length - 1];
    if (!dock) return;
    docks.filter((oldDock) => oldDock !== dock).forEach((oldDock) => oldDock.remove());
    if (dock.parentElement !== document.body) {
      document.body.appendChild(dock);
    }
    if (dock.dataset.ready) return;
    dock.dataset.ready = "true";
    const popover = dock.querySelector("[data-tower-bag-popover]");
    const toggle = dock.querySelector("[data-tower-bag-toggle]");
    applyTowerBagPosition(dock);
    setupDraggableTowerBag(dock, toggle);
    toggle?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (performance.now() < towerBagSuppressClickUntil) {
        return;
      }
      dock.classList.toggle("is-open");
      if (dock.classList.contains("is-open")) positionTowerBagPopover(dock);
    });
    document.addEventListener("click", (event) => {
      if (!dock.contains(event.target)) dock.classList.remove("is-open");
    });
    popover?.addEventListener("click", (event) => event.stopPropagation());
    document.querySelectorAll("[data-bag-drag]").forEach((el) => {
      el.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        towerOrderSuppressClickUntil = performance.now() + 900;
        event.dataTransfer.setData("text/plain", JSON.stringify({ source: "bag", itemIndex: Number(el.dataset.bagDrag) }));
        event.dataTransfer.effectAllowed = "move";
      });
    });
    document.querySelectorAll("[data-held-drag-mon]").forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      el.addEventListener("pointerdown", (event) => event.stopPropagation());
      el.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        towerOrderSuppressClickUntil = performance.now() + 900;
        hideHeldTooltip();
        event.dataTransfer.setData("text/plain", JSON.stringify({
          source: "held",
          monIndex: Number(el.dataset.heldDragMon),
          slotIndex: Number(el.dataset.heldDragSlot)
        }));
        event.dataTransfer.effectAllowed = "move";
      });
    });
    document.querySelectorAll("[data-held-drop]").forEach((el) => {
      el.addEventListener("dragover", (event) => {
        event.preventDefault();
        el.classList.add("is-drop-target");
      });
      el.addEventListener("dragleave", () => el.classList.remove("is-drop-target"));
      el.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        el.classList.remove("is-drop-target");
        const payload = dragPayload(event);
        const monIndex = Number(el.dataset.heldDrop);
        const slotIndex = Number(el.dataset.heldSlot);
        if (payload?.source === "bag") equipBagItemToSlot(payload.itemIndex, monIndex, slotIndex);
        if (payload?.source === "held") moveHeldItemToSlot(payload.monIndex, payload.slotIndex, monIndex, slotIndex);
      });
    });
    document.querySelector("[data-bag-drop]")?.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.classList.add("is-drop-target");
    });
    document.querySelector("[data-bag-drop]")?.addEventListener("dragleave", (event) => {
      event.currentTarget.classList.remove("is-drop-target");
    });
    document.querySelector("[data-bag-drop]")?.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.classList.remove("is-drop-target");
      const payload = dragPayload(event);
      if (payload?.source === "held") unequipHeldItemToBag(payload.monIndex, payload.slotIndex);
    });
    setupTowerBagGlobalDrop();
    positionTowerBagPopover(dock);
  }

  function setupTowerBagGlobalDrop() {
    if (towerBagGlobalDropReady) return;
    towerBagGlobalDropReady = true;
    document.addEventListener("dragover", (event) => {
      const bagDrop = event.target.closest?.("[data-bag-drop]");
      const heldDrop = event.target.closest?.("[data-held-drop]");
      if (!bagDrop && !heldDrop) return;
      event.preventDefault();
      event.stopPropagation();
      (bagDrop || heldDrop).classList.add("is-drop-target");
    }, true);
    document.addEventListener("drop", (event) => {
      const bagDrop = event.target.closest?.("[data-bag-drop]");
      const heldDrop = event.target.closest?.("[data-held-drop]");
      if (!bagDrop && !heldDrop) return;
      event.preventDefault();
      event.stopPropagation();
      towerOrderSuppressClickUntil = performance.now() + 900;
      bagDrop?.classList.remove("is-drop-target");
      heldDrop?.classList.remove("is-drop-target");
      const payload = dragPayload(event);
      if (bagDrop && payload?.source === "held") return unequipHeldItemToBag(payload.monIndex, payload.slotIndex);
      if (heldDrop) {
        const monIndex = Number(heldDrop.dataset.heldDrop);
        const slotIndex = Number(heldDrop.dataset.heldSlot);
        if (payload?.source === "bag") return equipBagItemToSlot(payload.itemIndex, monIndex, slotIndex);
        if (payload?.source === "held") return moveHeldItemToSlot(payload.monIndex, payload.slotIndex, monIndex, slotIndex);
      }
    }, true);
  }

  function positionTowerBagPopover(dock) {
    const popover = dock.querySelector("[data-tower-bag-popover]");
    const toggle = dock.querySelector("[data-tower-bag-toggle]");
    if (!popover || !toggle) return;
    const margin = 8;
    const gap = 10;
    const iconRect = toggle.getBoundingClientRect();
    const popoverWidth = Math.min(320, Math.max(260, window.innerWidth - margin * 2));
    popover.style.width = `${popoverWidth}px`;
    popover.style.left = "0px";
    popover.style.top = `${iconRect.height + gap}px`;
    popover.style.maxHeight = `${Math.max(180, window.innerHeight - margin * 2)}px`;
    const estimatedHeight = Math.min(popover.scrollHeight || 260, window.innerHeight - margin * 2);
    let left = 0;
    let top = iconRect.height + gap;
    if (iconRect.left + popoverWidth > window.innerWidth - margin) {
      left = iconRect.width - popoverWidth;
    }
    if (iconRect.left + left < margin) {
      left = margin - iconRect.left;
    }
    if (iconRect.bottom + gap + estimatedHeight > window.innerHeight - margin) {
      top = -estimatedHeight - gap;
    }
    if (iconRect.top + top < margin) {
      top = margin - iconRect.top;
    }
    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
    popover.style.maxHeight = `${Math.max(160, Math.min(430, window.innerHeight - iconRect.top - top - margin))}px`;
  }

  function readTowerBagPosition() {
    try {
      const position = JSON.parse(localStorage.getItem(TOWER_BAG_POSITION_KEY) || "null");
      if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return null;
      return position;
    } catch {
      return null;
    }
  }

  function clampTowerBagPosition(x, y, handle) {
    const rect = handle?.getBoundingClientRect?.() || {};
    const margin = 8;
    const width = rect.width || 54;
    const height = rect.height || 54;
    return {
      x: Math.min(Math.max(margin, x), Math.max(margin, window.innerWidth - width - margin)),
      y: Math.min(Math.max(margin, y), Math.max(margin, window.innerHeight - height - margin))
    };
  }

  function applyTowerBagPosition(dock) {
    const position = readTowerBagPosition();
    if (!position) return;
    const next = clampTowerBagPosition(position.x, position.y, dock.querySelector("[data-tower-bag-toggle]") || dock);
    dock.style.left = `${next.x}px`;
    dock.style.top = `${next.y}px`;
  }

  function saveTowerBagPosition(dock) {
    const rect = dock.getBoundingClientRect();
    localStorage.setItem(TOWER_BAG_POSITION_KEY, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));
  }

  function setupDraggableTowerBag(dock, handle) {
    if (!handle) return;
    let dragging = false;
    let didDrag = false;
    let startX = 0;
    let startY = 0;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      dragging = true;
      didDrag = false;
      startX = event.clientX;
      startY = event.clientY;
      const rect = dock.getBoundingClientRect();
      grabOffsetX = event.clientX - rect.left;
      grabOffsetY = event.clientY - rect.top;
      const current = clampTowerBagPosition(rect.left, rect.top, handle);
      dock.style.left = `${current.x}px`;
      dock.style.top = `${current.y}px`;
      dock.classList.add("is-moving");
      handle.setPointerCapture?.(event.pointerId);
    });
    window.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (Math.hypot(deltaX, deltaY) > 6) didDrag = true;
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      dock.classList.remove("is-open");
      const next = clampTowerBagPosition(event.clientX - grabOffsetX, event.clientY - grabOffsetY, handle);
      dock.style.left = `${next.x}px`;
      dock.style.top = `${next.y}px`;
      positionTowerBagPopover(dock);
    }, { capture: true });
    const stopDrag = (event) => {
      if (!dragging) return;
      event.preventDefault();
      event.stopPropagation();
      dragging = false;
      dock.classList.remove("is-moving");
      handle.releasePointerCapture?.(event.pointerId);
      if (didDrag) {
        towerBagSuppressClickUntil = performance.now() + 350;
        saveTowerBagPosition(dock);
      }
    };
    window.addEventListener("pointerup", stopDrag, { capture: true });
    window.addEventListener("pointercancel", stopDrag, { capture: true });
    window.addEventListener("resize", () => {
      const rect = dock.getBoundingClientRect();
      const next = clampTowerBagPosition(rect.left, rect.top, handle);
      dock.style.left = `${next.x}px`;
      dock.style.top = `${next.y}px`;
      positionTowerBagPopover(dock);
      saveTowerBagPosition(dock);
    });
  }

  function dragPayload(event) {
    try {
      return JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
    } catch {
      return null;
    }
  }

  function refreshHeldItemScreen() {
    state.pendingTowerOrder = [];
    save();
    if (state.pendingItem && state.screen === "choice" && document.querySelector(".rogue-stage")?.classList.contains("has-equip-item-modal")) {
      return showEquipItem(state.pendingItem);
    }
    if (state.tower?.active) return showTowerTeamOrder({ keepPreparing: true });
    renderHud();
  }

  function equipBagItemToSlot(itemIndex, monIndex, slotIndex) {
    const p = state.team[monIndex];
    if (!p || itemIndex < 0 || itemIndex >= state.items.length) return;
    const item = state.items.splice(itemIndex, 1)[0];
    const equipped = heldItems(p);
    const replaced = equipped[slotIndex];
    equipped[slotIndex] = { ...item };
    if (replaced) state.items.push({ ...replaced });
    setHeldItems(p, equipped.filter(Boolean));
    refreshHeldItemScreen();
  }

  function moveHeldItemToSlot(fromMonIndex, fromSlotIndex, toMonIndex, toSlotIndex) {
    const fromMon = state.team[fromMonIndex];
    const toMon = state.team[toMonIndex];
    if (!fromMon || !toMon) return;
    const fromItems = heldItems(fromMon);
    const moving = fromItems[fromSlotIndex];
    if (!moving) return;
    const toItems = heldItems(toMon);
    const replaced = toItems[toSlotIndex];
    fromItems.splice(fromSlotIndex, 1);
    toItems[toSlotIndex] = { ...moving };
    if (replaced) fromItems.push({ ...replaced });
    setHeldItems(fromMon, fromItems.filter(Boolean));
    setHeldItems(toMon, toItems.filter(Boolean));
    refreshHeldItemScreen();
  }

  function unequipHeldItemToBag(monIndex, slotIndex) {
    const p = state.team[monIndex];
    if (!p) return;
    const equipped = heldItems(p);
    const [item] = equipped.splice(slotIndex, 1);
    if (!item) return;
    state.items.push({ ...item });
    setHeldItems(p, equipped);
    refreshHeldItemScreen();
  }

  function setupHeldSlotDragDrop() {
    document.querySelectorAll("[data-held-drag-mon]").forEach((el) => {
      if (el.dataset.heldDndReady) return;
      el.dataset.heldDndReady = "true";
      el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      el.addEventListener("pointerdown", (event) => event.stopPropagation());
      el.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        towerOrderSuppressClickUntil = performance.now() + 900;
        hideHeldTooltip();
        event.dataTransfer.setData("text/plain", JSON.stringify({
          source: "held",
          monIndex: Number(el.dataset.heldDragMon),
          slotIndex: Number(el.dataset.heldDragSlot)
        }));
        event.dataTransfer.effectAllowed = "move";
      });
    });
    document.querySelectorAll("[data-held-drop]").forEach((el) => {
      if (el.dataset.heldDropReady) return;
      el.dataset.heldDropReady = "true";
      el.addEventListener("dragover", (event) => {
        event.preventDefault();
        el.classList.add("is-drop-target");
      });
      el.addEventListener("dragleave", () => el.classList.remove("is-drop-target"));
      el.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        el.classList.remove("is-drop-target");
        const payload = dragPayload(event);
        const monIndex = Number(el.dataset.heldDrop);
        const slotIndex = Number(el.dataset.heldSlot);
        if (payload?.source === "bag") equipBagItemToSlot(payload.itemIndex, monIndex, slotIndex);
        if (payload?.source === "held") moveHeldItemToSlot(payload.monIndex, payload.slotIndex, monIndex, slotIndex);
      });
    });
    setupTowerBagGlobalDrop();
  }

  function setupTowerOrderCarousel() {
    const track = document.querySelector(".tower-order-mons");
    if (!track || track.dataset.carouselReady) return;
    track.dataset.carouselReady = "true";
    track.scrollLeft = 0;
    let dragging = false;
    let didDrag = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    track.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".tower-order-action, .tower-held-slot, .tower-bag-dock")) return;
      dragging = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(event.pointerId);
    });
    track.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 14) didDrag = true;
      track.scrollLeft = dragStartScroll - delta;
      if (didDrag) event.preventDefault();
    });
    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      track.releasePointerCapture?.(event.pointerId);
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-tower-order-pick]");
      if (didDrag) {
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
        return;
      }
      if (!button || !track.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      pickTowerOrderIndex(Number(button.dataset.towerOrderPick));
    }, true);
  }

  function showTowerBag() {
    if (!state.tower?.active) return renderMap();
    $("choice-kicker").textContent = "Bag da Torre";
    $("choice-title").textContent = "Equipar relíquias";
    $("choice-copy").textContent = state.items.length
      ? "Escolha uma relíquia da bag para equipar antes do próximo andar."
      : "A bag está vazia. Escolha relíquias nos eventos da Torre para equipar aqui.";
    $("choice-grid").innerHTML = (state.items.length ? state.items.map((item, index) => `
      <button class="choice-button item-choice" type="button" data-bag-item="${index}">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <strong>${item.name}</strong>
        <small>${itemShortText(item)}</small>
        <span class="choice-hover-detail">
          <span>Relíquia</span>
          <small>${itemShortText(item)}</small>
          ${itemBonusMarkup(item)}
        </span>
      </button>
    `).join("") : "") + `
      <button class="choice-button tower-order-action" type="button" data-action="tower-order">
        <strong>Voltar</strong>
        <small>Retornar para a prepara??o.</small>
      </button>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal", "has-tower-choice-modal");
    save();
  }

  function towerPrepareNextStep() {
    if (!state.tower?.active) return renderMap();
    return showTowerTeamOrder();
  }

  function towerNextStep() {
    if (!state.tower?.active) return renderMap();
    state.pendingTowerEvent = false;
    if (Number.isFinite(state.tower.totalFloors) && state.floor >= state.tower.totalFloors) return endRun(true);
    const nextFloor = state.floor + 1;
    return startTowerFloor(nextFloor);
  }

  async function startTowerFloor(floor) {
    state.floor = floor;
    state.branch = 0;
    state.pendingMapFloor = null;
    prepareTowerTeamForBattle();
    await startBattle({ type: "tower" });
  }

  function prepareTowerTeamForBattle() {
    if ((state.floor || 0) > 10) {
      state.team = state.team.filter((p) => p.currentHp > 0);
      state.pendingTowerOrder = [];
    }
    const energyFloor = (state.floor || 1) <= 10 ? 3 : 2;
    state.team.forEach((p) => {
      if (p.currentHp > 0) p.energy = Math.max(energyFloor, p.energy || 0);
    });
  }

  function winTowerBattle(prefix, reward = { xp: 0, levels: 0 }) {
    const defeatedName = state.battle?.enemy?.name || "Oponente";
    const rare = state.floor % 10 === 0;
    const recoveryRate = rare ? 0.5 : state.floor <= 10 ? 0.44 : 0.34;
    let recoveryLog = "";
    state.team.forEach((p) => {
      if (p.currentHp > 0) {
        p.energy = Math.min(4, Math.max(state.floor <= 10 ? 3 : 2, p.energy || 0) + 1);
        p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * recoveryRate));
      }
    });
    recoveryLog = rare ? " O time recuperou bem após o encontro raro." : " O time recuperou HP e estabilizou energia.";
    state.threat = Math.min(3, state.threat + 0.03);
    state.battle = null;
    state.autoBattling = false;
    if (Number.isFinite(state.tower.totalFloors) && state.floor >= state.tower.totalFloors) return endRun(true);
    const earlyEventFloor = state.floor <= 20 && state.floor % 2 === 0;
    const regularEventFloor = state.floor > 20 && state.floor % 3 === 0;
    if (state.floor > 0 && (earlyEventFloor || regularEventFloor)) {
      state.pendingTowerEvent = true;
      save();
      return showTowerEvent();
    }
    const evolution = state.pendingEvolutions?.shift();
    $("choice-kicker").textContent = rare ? "Encontro raro vencido" : "Andar vencido";
    $("choice-title").textContent = towerProgressLabel();
    $("choice-copy").innerHTML = victorySummaryMarkup({ prefix, reward, boss: false, defeatedName, recoveryLog, evolution });
    $("choice-grid").innerHTML = `
      ${renderEvolutionSummary(evolution)}
      <button class="choice-button" type="button" data-action="tower-next"><strong>Subir</strong><small>Avançar para o próximo andar.</small></button>
    `;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-choice-modal", "has-victory-modal");
    save();
  }

  function showTowerEventOld() {
    const eventType = state.floor % 15 === 0 ? "recruit" : state.floor % 10 === 5 ? "item" : "choice";
    if (eventType === "recruit") return showCatch();
    if (eventType === "item") return showItem();
    const heal = Math.ceil(averageTeamLevel() * 1.8);
    state.team.forEach((p) => {
      if (p.currentHp > 0) p.currentHp = Math.min(p.maxHp, p.currentHp + heal);
    });
    $("choice-kicker").textContent = "Evento da Torre";
    $("choice-title").textContent = `Andar ${state.floor}`;
    $("choice-copy").textContent = "Uma sala segura apareceu entre os andares. O time recuperou HP antes da próxima batalha.";
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="tower-next"><strong>Continuar subida</strong><small>Ir para o próximo andar.</small></button>`;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal");
    save();
  }

  async function showTowerEvent() {
    state.pendingTowerEvent = true;
    const evolutionCandidate = await towerEvolutionCandidate();
    let eventOptions = [
      { type: "heal", title: "Fonte segura", copy: "Cura 60% do HP do time vivo.", trainer: "pokemoncenterlady" },
      { type: "relic", title: "Baú de relíquia", copy: "Escolha 1 entre 3 relíquias.", trainer: "scientist" },
      { type: "recruit", title: "Sinal aliado", copy: "Escolha 1 entre 3 Pokémon para recrutar.", trainer: "pokemonbreederf" },
      { type: "tutor", title: "Tutor técnico", copy: "Ensine um move compatível a um Pokémon vivo.", trainer: "gentleman" },
      { type: "risk", title: "Pacto de risco", copy: "Próximo inimigo mais forte, time ganha nível e energia.", trainer: "blackbelt" }
    ];
    eventOptions = eventOptions.map((option) => option.type === "risk"
      ? { ...option, copy: "Inimigos mais fortes, mas cura o mais ferido e melhora o time." }
      : option);
    if (!state.tower.guaranteedRecruitUsed && state.floor <= 4) {
      eventOptions = eventOptions.filter((option) => option.type === "recruit");
    }
    if (evolutionCandidate) {
      eventOptions.splice(3, 0, { type: "evolve", title: "Catalisador", copy: `Evoluir ${evolutionCandidate.mon.name}.`, trainer: "psychic" });
    }
    $("choice-kicker").textContent = "Evento da Torre";
    $("choice-title").textContent = `Andar ${state.floor}`;
    $("choice-copy").textContent = "Uma sala muda o ritmo da subida. Escolha uma vantagem antes do próximo andar.";
    show("choice");
    $("choice-grid").innerHTML = eventOptions.map((option) => `
      <button class="choice-button tower-event-option" type="button" data-tower-event="${option.type}">
        <span class="tower-event-npc">
          <img src="${trainerSprite(option.trainer)}" alt="" onerror="this.style.display='none'">
        </span>
        <strong>${option.title}</strong>
        <small>${option.copy}</small>
      </button>
    `).join("");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal", "has-tower-event-modal");
    save();
  }

  async function applyTowerEvent(type) {
    state.pendingTowerEvent = false;
    if (type === "heal") {
      state.team.forEach((p) => {
        if (p.currentHp > 0) {
          p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.6));
          p.energy = Math.min(4, p.energy + 1);
        }
      });
      save();
      return towerPrepareNextStep();
    }
    if (type === "relic") return showItem();
    if (type === "recruit") {
      if (state.tower?.active) state.tower.guaranteedRecruitUsed = true;
      return showCatch();
    }
    if (type === "tutor") return showMoveTutor();
    if (type === "evolve") {
      const candidate = await towerEvolutionCandidate();
      state.pendingTowerEvent = false;
      if (candidate?.options?.length > 1) return showEvolutionChoice(candidate.index);
      if (candidate?.options?.length === 1 && evolvePokemon(candidate.mon, 0, candidate.options)) {
        save();
        return showEvolutionPopup(state.pendingEvolutions?.shift());
      }
      save();
      return towerPrepareNextStep();
    }
    if (type === "risk") {
      state.threat = Math.min(3, state.threat + 0.25);
      const injured = state.team
        .filter((p) => p.currentHp > 0 && p.currentHp < p.maxHp)
        .sort((a, b) => (a.currentHp / Math.max(1, a.maxHp)) - (b.currentHp / Math.max(1, b.maxHp)))[0];
      if (injured) injured.currentHp = injured.maxHp;
      state.team.forEach((p) => {
        if (p.currentHp > 0) {
          p.level += 1;
          p.energy = Math.min(4, p.energy + 2);
          p.maxHp = hpMax(p);
          p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.25));
          syncMoves(p);
          maybeAutoEvolve(p);
        }
      });
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      save();
    }
    return towerPrepareNextStep();
  }

  function continueTowerRun() {
    if (!state.tower?.active) return false;
    if (state.battle) {
      state.autoBattling = false;
      renderBattle();
      show("battle");
      scheduleAutoBattle(300);
      return true;
    }
    if (state.pendingTowerEvent) {
      showTowerEvent();
      return true;
    }
    $("choice-kicker").textContent = "Subir Torre";
    $("choice-title").textContent = state.tower.title || "Torre";
    $("choice-copy").textContent = Number.isFinite(state.floor) && state.floor > 0
      ? `Você parou após o andar ${state.floor}. Continue a subida para o próximo desafio.`
      : "Sua subida está pronta para começar.";
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="tower-next"><strong>Continuar subida</strong><small>Retomar a Torre de onde parou.</small></button>`;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-choice-modal", "has-simple-modal");
    save();
    return true;
  }

  function showRandomEvent() {
    const events = [
      { name: "Fonte escondida", text: "Cura 35% do time.", run: () => state.team.forEach((p) => p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.35))) },
      { name: "Atalho perigoso", text: "Reduz risco, mas causa 12% de dano no time.", run: () => { state.threat = Math.max(1, state.threat - 0.5); state.team.forEach((p) => p.currentHp = Math.max(1, p.currentHp - Math.ceil(p.maxHp * 0.12))); } },
      { name: "Treinador generoso", text: "Todos ganham 1 energia.", run: () => state.team.forEach((p) => p.energy = Math.min(4, p.energy + 1)) },
      { name: "Armadilha", text: "Risco sobe, mas você ganha uma relíquia aleatória.", run: () => { state.threat = Math.min(3, state.threat + 0.45); state.items.push({ ...ITEMS[Math.floor(Math.random() * ITEMS.length)] }); } },
      { name: "Doce raro", text: "O Pokémon mais fraco ganha 2 níveis.", run: () => {
        const target = [...state.team].filter((p) => p.currentHp > 0).sort((a, b) => a.level - b.level)[0];
        if (target) { target.level += 2; applyLevelCap(target); target.maxHp = hpMax(target); target.currentHp = target.maxHp; syncMoves(target); maybeAutoEvolve(target); }
      } },
      { name: "Especialista de tipos", text: "Pokémon com tipo repetido ganham energia.", run: () => {
        const counts = countTypes();
        state.team.forEach((p) => { if (p.types.some((t) => counts[t] >= 2)) p.energy = Math.min(4, p.energy + 2); });
      } },
      { name: "Mercador estranho", text: "Recebe uma pedra de evolução improvisada.", run: () => {
        const targetIndex = state.team.findIndex((p) => EVOLUTIONS[p.id]);
        const target = state.team[targetIndex];
        if (target && evolutionOptionsFor(target).length > 1) {
          showEvolutionChoice(targetIndex);
          return "evolution-choice";
        }
        if (target) evolvePokemon(target);
      } },
      { name: "Chuva de faíscas", text: "Todos aprendem Ataque Rapido elemental.", run: () => {
        state.team.forEach((p) => {
          syncMoves(p);
        });
      } }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    const eventResult = event.run();
    if (eventResult === "evolution-choice") return;
    const evolution = state.pendingEvolutions?.shift();
    if (evolution) return showEvolutionPopup(evolution);
    $("choice-kicker").textContent = "Evento aleatório";
    $("choice-title").textContent = event.name;
    $("choice-copy").textContent = event.text;
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="map"><strong>Continuar</strong><small>Voltar para a rota.</small></button>`;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-simple-modal");
    save();
  }

  function showMoveTutor() {
    const tutorTeam = state.tower?.active ? state.team.filter((p) => p.currentHp > 0) : state.team;
    const fallbackMoves = MOVES
      .filter((move) => !move.type || move.type === "Normal")
      .map((move) => ({ ...move, level: 1 }));
    const teamTypes = [...new Set(tutorTeam.flatMap((p) => p.types || []))];
    const typedPool = teamTypes.flatMap((type) => [
      ...(TYPE_MOVES[type] || []),
      ...MOVES.filter((move) => move.type === type)
    ]);
    const uniqueTyped = [];
    typedPool.forEach((move) => {
      if (!uniqueTyped.some((entry) => entry.id === move.id)) uniqueTyped.push({ ...move });
    });
    let moves = uniqueTyped
      .filter((move) => tutorTeam.some((p) => canLearnMove(p, move)))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    if (moves.length < 3) {
      const filler = fallbackMoves
        .filter((move) => tutorTeam.some((p) => canLearnMove(p, move)) && !moves.some((entry) => entry.id === move.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - moves.length);
      moves = [...moves, ...filler];
    }
    state.offer = moves;
    $("choice-kicker").textContent = "Move Tutor";
    $("choice-title").textContent = "Desbloquear habilidade";
    $("choice-copy").textContent = "Escolha um move do tipo do Pokémon. O tutor ignora nível, mas respeita o elemento.";
    $("choice-grid").innerHTML = moves.length ? moves.map((move, i) => `
      <button class="choice-button item-choice" type="button" data-move-learn="${i}">
        <img class="animated-item" src="${tmSprite(move)}" alt="${move.name}" onerror="this.src='${ITEM_BASE}tm-normal.png'">
        <strong>${move.name}</strong>
        <span class="move-cd-pill">CD ${moveCooldown(move)}</span>
        <small>${move.type || "Tipo do usuário"} · poder ${Math.round(move.power * 100)} · custo ${move.cost}</small>
      </button>
    `).join("") : `<button class="choice-button item-choice" type="button" data-action="${state.tower?.active ? "tower-order" : "map"}"><img class="animated-item" src="${ITEM_BASE}tm-normal.png" alt=""><strong>${state.tower?.active ? "Preparar equipe" : "Continuar rota"}</strong><small>Nenhum move novo compatível agora.</small></button>`;
    show("choice");
  }

  function showMoveLearner(move) {
    state.pendingMove = move;
    const canLearnFromTutor = (p) => (!state.tower?.active || p.currentHp > 0) && canLearnMove(p, move);
    const canAnyLearn = state.team.some((p) => canLearnFromTutor(p));
    $("choice-kicker").textContent = "Aprender move";
    $("choice-title").textContent = move.name;
    $("choice-copy").textContent = canAnyLearn ? "Escolha quem aprende. Cada Pokémon pode carregar até 4 moves." : "Nenhum Pokémon do time pode aprender esse move agora.";
    const learnCards = state.team.map((p, i) => `
      <button class="choice-button" type="button" ${canLearnFromTutor(p) ? `data-learn="${i}"` : "disabled"}>
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>${canLearnFromTutor(p) ? (p.moves || []).map((m) => m.name).join(", ") : p.currentHp <= 0 && state.tower?.active ? "Derrotado na torre" : "Tipo incompatível"}</small>
        ${canLearnFromTutor(p) ? `<span class="tower-card-action" data-learn="${i}">Aprender</span>` : ""}
      </button>
    `).join("");
    const learnActions = `
      ${canAnyLearn ? "" : `<button class="choice-button ${state.tower?.active ? "tower-order-action" : ""}" type="button" data-action="move-tutor"><strong>Escolher outro move</strong><small>Voltar para o tutor.</small></button>`}
      <button class="choice-button ${state.tower?.active ? "tower-order-action" : ""}" type="button" data-action="${state.tower?.active ? "tower-order" : "map"}"><strong>${state.tower?.active ? "Preparar equipe" : "Continuar rota"}</strong><small>Pular este tutor.</small></button>
    `;
    $("choice-grid").innerHTML = state.tower?.active
      ? `<div class="tower-learn-mons">${learnCards}</div><div class="tower-learn-actions">${learnActions}</div>`
      : `${learnCards}${learnActions}`;
    show("choice");
    if (state.tower?.active) {
      document.querySelector(".rogue-stage")?.classList.add("has-tower-learn-modal");
      setupTowerLearnCarousel();
    }
  }

  function learnPendingMove(index) {
    const p = state.team[Number(index)];
    if (p && state.pendingMove && (!state.tower?.active || p.currentHp > 0) && canLearnMove(p, state.pendingMove)) {
      p.moves = p.moves || legalMovesFor(p);
      const move = { ...state.pendingMove, type: state.pendingMove.type || p.types[0] };
      if (p.moves.length >= 4) p.moves.shift();
      if (!p.moves.some((entry) => entry.id === move.id)) p.moves.push(move);
      state.pendingMove = null;
    }
    if (state.tower?.active) {
      save();
      return towerPrepareNextStep();
    }
    renderMap();
    save();
  }

  function setupTowerLearnCarousel() {
    const track = document.querySelector(".tower-learn-mons");
    if (!track || track.dataset.carouselReady) return;
    track.dataset.carouselReady = "true";
    track.scrollLeft = 0;
    let dragging = false;
    let didDrag = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let pointerDownButton = null;
    let suppressNextClick = false;
    track.addEventListener("pointerdown", (event) => {
      dragging = true;
      didDrag = false;
      pointerDownButton = event.target.closest("[data-learn]");
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(event.pointerId);
    });
    track.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 14) didDrag = true;
      track.scrollLeft = dragStartScroll - delta;
      if (didDrag) event.preventDefault();
    });
    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      track.releasePointerCapture?.(event.pointerId);
      if (!didDrag && pointerDownButton && track.contains(pointerDownButton) && !pointerDownButton.disabled) {
        suppressNextClick = true;
        learnPendingMove(pointerDownButton.dataset.learn);
      }
      pointerDownButton = null;
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-learn]");
      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressNextClick = false;
        return;
      }
      if (didDrag) {
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
        return;
      }
      if (!button || !track.contains(button) || button.disabled) return;
      event.stopPropagation();
      learnPendingMove(button.dataset.learn);
    }, true);
  }

  async function showEvolutionStone() {
    $("choice-kicker").textContent = "Pedra de evolução";
    $("choice-title").textContent = "Forçar evolução";
    $("choice-copy").textContent = "Verificando evoluções compatíveis do time.";
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" disabled><strong>Verificando...</strong><small>Consultando cadeia de evolução.</small></button>`;
    show("choice");
    const entries = await teamEvolutionOptions();
    const candidates = entries.filter((entry) => entry.options.length);
    $("choice-copy").textContent = candidates.length ? "Escolha um Pokémon compatível para evoluir agora." : "Nenhum Pokémon compatível no time. A pedra virou cura.";
    if (!candidates.length) {
      state.team.forEach((p) => p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.25)));
      $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="map"><strong>Continuar</strong><small>Time curado parcialmente.</small></button>`;
    } else {
      $("choice-grid").innerHTML = entries.map(({ mon: p, index: i, options }) => {
        const canEvolve = options.length > 0;
        const evo = canEvolve ? { into: options[0].into } : null;
        return `<button class="choice-button" type="button" data-evolve="${i}" ${canEvolve ? "" : "disabled"}>
          <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
          <strong>${p.name}</strong>
          <small>${options.length ? "Escolher evolução" : evo ? `Evoluir para ${evo.into.name}` : "Sem evolução disponível"}</small>
        </button>`;
      }).join("");
    }
  }

  function evolutionOptionsFor(p) {
    const evo = EVOLUTIONS[p?.id];
    const dynamic = dynamicEvolutionCache.get(p?.id);
    if (!evo && Array.isArray(dynamic)) return dynamic;
    if (!evo) return [];
    return evo.options?.length ? evo.options : [evo];
  }

  function evolutionPredecessorIds(targetId) {
    return Object.entries(EVOLUTIONS)
      .filter(([, evo]) => {
        const options = evo?.options?.length ? evo.options : evo ? [evo] : [];
        return options.some((option) => Number(option?.into?.id) === Number(targetId));
      })
      .map(([id]) => Number(id));
  }

  function restoreShinyFromEvolutionDex(p) {
    if (!p || p.shiny) return;
    const shinySeen = loadDexSeen("shiny");
    if (!shinySeen.size) return;
    const predecessors = evolutionPredecessorIds(p.id);
    if (predecessors.some((id) => shinySeen.has(id))) p.shiny = true;
  }

  function carryEvolutionIdentity(from, to) {
    if (!from || !to) return to;
    to.runId = from.runId || to.runId || uid("mon");
    if (from.shiny) to.shiny = true;
    setHeldItems(to, normalizeHeldItems(from));
    return to;
  }

  function renderEvolutionChoice(index, options) {
    const p = state.team[index];
    if (!p || options.length <= 1) return false;
    state.pendingEvolutionChoiceIndex = index;
    $("choice-kicker").textContent = "Evolução";
    $("choice-title").textContent = `Escolha a evolução de ${p.name}`;
    $("choice-copy").textContent = "Cada forma muda tipo, atributos e golpes disponíveis.";
    $("choice-grid").classList.toggle("many-evolution-options", options.length > 4);
    $("choice-grid").innerHTML = options.map((option, i) => {
      const evolved = carryEvolutionIdentity(p, { ...p, ...option.into, level: p.level || 1 });
      evolved.maxHp = hpMax(evolved);
      evolved.currentHp = evolved.maxHp;
      evolved.moves = legalMovesFor(evolved);
      return `
        <button class="choice-button pokemon-choice" type="button" data-evolution-option="${i}">
          <img src="${animated(evolved)}" alt="${evolved.name}" onerror="this.src='${mini(evolved)}'">
          <strong>${evolved.name}</strong>
          <small>${evolved.trait}</small>
          ${renderTypeChips(evolved.types)}
          <span class="choice-hover-detail">
            <span>${evolved.trait}</span>
            ${statBars(evolved)}
            <small>HP ${evolved.maxHp} · Energia ${evolved.energy || p.energy || 2}</small>
          </span>
        </button>
      `;
    }).join("") + `
      <button class="choice-button" type="button" data-cancel-evolution-choice="1">
        <strong>Cancelar</strong>
        <small>Voltar para a rota sem evoluir.</small>
      </button>
    `;
    show("choice");
    $("choice-grid").classList.toggle("many-evolution-options", options.length > 4);
    document.querySelector(".rogue-stage")?.classList.add("has-choice-modal");
    return true;
  }

  async function showEvolutionChoice(index) {
    const p = state.team[index];
    const options = await dynamicEvolutionOptionsFor(p);
    return renderEvolutionChoice(index, options);
  }

  function showPendingEvolutionChoice() {
    state.pendingEvolutionChoices = state.pendingEvolutionChoices || [];
    while (state.pendingEvolutionChoices.length) {
      const entry = state.pendingEvolutionChoices[0];
      const index = state.team.findIndex((p) => p.runId === entry.runId);
      const p = state.team[index];
      const options = evolutionOptionsFor(p);
      const requiredLevel = options.length ? Math.min(...options.map((option) => option.level || 1)) : Infinity;
      if (p && p.currentHp > 0 && options.length > 1 && (p.level || 1) >= requiredLevel) {
        const shown = renderEvolutionChoice(index, options);
        if (shown) save();
        return shown;
      }
      state.pendingEvolutionChoices.shift();
    }
    return false;
  }

  function evolvePokemon(p, optionIndex = 0, optionsOverride = null) {
    const options = optionsOverride || evolutionOptionsFor(p);
    const option = options[optionIndex] || options[0];
    if (!option?.into) return false;
    const oldHpPct = p.maxHp ? p.currentHp / p.maxHp : 1;
    const wasShiny = !!p.shiny;
    const from = JSON.parse(JSON.stringify(p));
    Object.assign(p, JSON.parse(JSON.stringify(option.into)));
    if (wasShiny) p.shiny = true;
    carryEvolutionIdentity(from, p);
    p.level = p.level || 1;
    p.maxHp = hpMax(p);
    p.currentHp = oldHpPct <= 0 ? 0 : Math.max(1, Math.ceil(p.maxHp * oldHpPct));
    p.energy = Math.min(4, (p.energy || 2) + 1);
    syncMoves(p);
    state.pendingEvolutions = state.pendingEvolutions || [];
    state.pendingEvolutions.push({ from, to: JSON.parse(JSON.stringify(p)) });
    return true;
  }

  function showEvolutionPopup(entry) {
    if (!entry) return state.tower?.active ? towerPrepareNextStep() : renderMap();
    const hasNext = (state.pendingEvolutions?.length || 0) > 0;
    $("choice-kicker").textContent = "Evolução";
    $("choice-title").textContent = `${entry.from.name} evoluiu`;
    $("choice-copy").textContent = `${entry.from.name} virou ${entry.to.name}. Novos atributos e golpes foram atualizados pelo nível.`;
    $("choice-grid").innerHTML = `
      ${renderEvolutionSummary(entry)}
      <button class="choice-button" type="button" data-action="next-evolution"><strong>${hasNext ? "Próxima evolução" : state.tower?.active ? "Continuar subida" : "Continuar rota"}</strong><small>${hasNext ? "Ver a próxima evolução pendente." : state.tower?.active ? "Voltar para a torre." : "Voltar ao mapa."}</small></button>
    `;
    playBattleSfx("evolution");
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-victory-modal", "has-evolution-modal");
    save();
  }

  function maybeAutoEvolve(p) {
    const evo = EVOLUTIONS[p.id];
    if (!evo?.level || p.level < evo.level || p.currentHp <= 0) return false;
    if (evo.options?.length > 1) {
      state.pendingEvolutionChoices = state.pendingEvolutionChoices || [];
      if (!state.pendingEvolutionChoices.some((entry) => entry.runId === p.runId)) {
        state.pendingEvolutionChoices.push({ runId: p.runId });
      }
      return "choice";
    }
    return evolvePokemon(p);
  }

  function addPokemon(mon) {
    if (!mon || state.team.some((p) => p.currentHp > 0 && (p.id === mon.id || p.name === mon.name))) return renderMap();
    const faintedSlot = state.team.length >= 6 ? towerFaintedSlotIndex() : -1;
    if (state.team.length >= 6 && faintedSlot < 0) return showRecruitReplace(mon);
    registerDexSeen(mon);
    mon.runId ||= uid("mon");
    setHeldItems(mon, normalizeHeldItems(mon));
    if (faintedSlot >= 0) {
      const replaced = state.team[faintedSlot];
      heldItems(replaced).forEach((item) => state.items.push({ ...item }));
      state.team.splice(faintedSlot, 1, mon);
    } else {
      state.team.push(mon);
    }
    const evolved = maybeAutoEvolve(mon);
    if (evolved === "choice") return showPendingEvolutionChoice();
    if (evolved) return showEvolutionPopup(state.pendingEvolutions?.shift());
    if (state.tower?.active) {
      state.pendingTowerOrder = [];
      return towerPrepareNextStep();
    }
    renderMap();
    save();
  }

  function replacePokemon(index) {
    const mon = state.pendingRecruit;
    if (!mon || index < 0 || index >= state.team.length || state.team.some((p, i) => i !== index && p.currentHp > 0 && (p.id === mon.id || p.name === mon.name))) return renderMap();
    const replaced = state.team[index];
    heldItems(replaced).forEach((item) => state.items.push({ ...item }));
    setHeldItems(replaced, []);
    registerDexSeen(mon);
    mon.runId ||= uid("mon");
    setHeldItems(mon, normalizeHeldItems(mon));
    state.team.splice(index, 1, mon);
    state.pendingRecruit = null;
    const evolved = maybeAutoEvolve(mon);
    if (evolved === "choice") return showPendingEvolutionChoice();
    if (evolved) return showEvolutionPopup(state.pendingEvolutions?.shift());
    if (state.tower?.active) {
      state.pendingTowerOrder = [];
      return towerPrepareNextStep();
    }
    renderMap();
    save();
  }

  function tryTowerSecondChance() {
    if (!state.tower?.active || state.tower.secondChanceUsed || (state.floor || 0) > 10) return false;
    state.tower.secondChanceUsed = true;
    state.battle = null;
    state.autoBattling = false;
    state.floor = Math.max(0, (state.floor || 1) - 1);
    state.team.forEach((p) => {
      p.currentHp = Math.max(1, Math.ceil(p.maxHp * 0.35));
      p.energy = Math.max((state.floor || 1) <= 10 ? 3 : 2, p.energy || 0);
    });
    $("choice-kicker").textContent = "Segunda chance";
    $("choice-title").textContent = "A subida continua";
    $("choice-copy").textContent = "Até o andar 10, a Torre revive o time com 35% de HP e recua um andar.";
    $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="tower-next"><strong>Continuar subida</strong><small>Reorganizar e tentar de novo.</small></button>`;
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-choice-modal", "has-simple-modal");
    save();
    return true;
  }

  function endRun(won) {
    if (!won && tryTowerSecondChance()) return;
    if (won) registerNuzlockeClear();
    if (won) registerTowerClear();
    const towerTitle = state.tower?.title || "Torre";
    if (state.tower?.active) state.lastTowerMode = state.tower.mode;
    state.battle = null;
    state.autoBattling = false;
    applyTowerBattleInlineLayout(false);
    document.querySelector(".end-panel")?.classList.toggle("is-win", won);
    document.querySelector(".end-panel")?.classList.toggle("is-loss", !won);
    $("end-kicker").textContent = won ? "Campeão da torre" : "Expedição encerrada";
    $("end-title").textContent = won ? "Você venceu" : "Run perdida";
    $("end-copy").textContent = state.tower?.active
      ? won
        ? `${towerTitle} concluída. A próxima torre fica marcada para teste e progressão.`
        : `A subida terminou no andar ${state.floor}. Ajuste o time e tente de novo.`
      : won
      ? "Seu time atravessou os oito ginásios e derrotou Giovanni. A Liga agora pode virar a próxima camada."
      : "O time caiu. Ajuste sinergias, preserve energia e respeite matchups de tipo na próxima tentativa.";
    const finalTeam = won ? state.team : [...(state.fallenTeam || []), ...state.team];
    $("end-team").innerHTML = finalTeam.map((p) => `<div class="team-row ${p.currentHp <= 0 ? "fainted" : ""}"><img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'"><div><strong>${p.name}</strong><small>Lv.${p.level}</small></div></div>`).join("");
    $("restart-run").textContent = state.tower?.active ? "Tentar torre de novo" : "Jogar de novo";
    clearSave();
    show("end");
  }

  document.addEventListener("click", async (event) => {
    if (event.target.closest?.(".tower-held-slot, .tower-bag-dock, .tower-bag-item, .tower-bag-dropzone")) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.startMode) {
      selectRunMode(button.dataset.startMode);
      return newRun();
    }
    if (button.dataset.draftBattle) {
      return showDraftBattleIntro(button.dataset.draftBattle);
    }
    if (button.dataset.towerMode) return handleTowerMode(button.dataset.towerMode);
    if (button.id === "start-run") newRun();
    if (button.id === "restart-run") {
      if (state.lastTowerMode) {
        const mode = TOWER_MODES.find((entry) => entry.id === state.lastTowerMode) || TOWER_MODES[0];
        return startTowerRun(mode);
      }
      newRun();
    }
    if (button.id === "route-dex-open") setRogueDexOpen(true);
    if (button.id === "rogue-dex-close") setRogueDexOpen(false);
    if (button.dataset.dexTab) setRogueDexTab(button.dataset.dexTab);
    if (button.dataset.dexMon) showDexDetail(Number(button.dataset.dexMon));
    if (button.dataset.dexDetailClose) hideDexDetail();
    if (button.id === "continue-run" || button.dataset.continueMode) {
      const mode = button.dataset.continueMode || savedRunMode();
      if (!mode) return updateContinueRunButton();
      if (!load(mode)) return updateContinueRunButton();
      if (state.tower?.active) return continueTowerRun();
      if (!state.map.length) buildMap();
      if (showPendingEvolutionChoice()) return;
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      if (!state.battle) applyPendingMapFloor();
      if (state.battle) {
        state.autoBattling = false;
        renderBattle();
        show("battle");
        scheduleAutoBattle(300);
      } else {
        renderMap();
      }
    }
    if (button.dataset.starter) await chooseStarter(Number(button.dataset.starter));
    if (button.dataset.floor) await enterNode(Number(button.dataset.floor), Number(button.dataset.branch));
    if (button.dataset.autoBattle) runAutoBattle();
    if (button.dataset.battleSpeed) {
      if (state.battle?.draft && state.battleSpeed === 2) return;
      if (state.battleSpeed === 3) return;
      state.battleSpeed = state.battleSpeed >= 2 ? 1 : 2;
      if (state.battleSpeed === 2 && state.battle) state.battle.speedBoostStartedAt = Date.now();
      if (state.battleSpeed === 2) startBattleSpeedCountdown();
      if (state.battleSpeed === 1) stopBattleSpeedCountdown();
      renderBattle();
      save();
    }
    if (button.dataset.move) playerMove(button.dataset.move);
    if (button.dataset.action === "map") {
      if (state.screen === "battle" && state.battle && !state.battle.boss) state.battle = null;
      applyPendingMapFloor();
      state.pendingEvolutionChoiceIndex = null;
      if (showPendingEvolutionChoice()) return;
      if (state.tower?.active) return towerPrepareNextStep();
      renderMap();
    }
    if (button.dataset.action === "title") {
      show("title");
      updateRunModeCarouselFocus();
    }
    if (button.dataset.action === "draft-ai") return joinDraftBattleQueue("ai");
    if (button.dataset.action === "draft-queue") return joinDraftBattleQueue("ranked");
    if (button.dataset.action === "draft-login") return showDraftAuth("login");
    if (button.dataset.action === "draft-register") return showDraftAuth("register");
    if (button.dataset.action === "draft-recover") return showDraftAuth("recover");
    if (button.dataset.action === "draft-logout") {
      clearDraftAuth();
      return showDraftAuth("login", "Conta desconectada.");
    }
    if (button.dataset.action === "draft-login-submit") return await submitDraftAuth("login");
    if (button.dataset.action === "draft-register-submit") return await submitDraftAuth("register");
    if (button.dataset.action === "draft-recover-submit") return await submitDraftAuth("recover");
    if (button.dataset.action === "draft-reset-submit") return await submitDraftAuth("reset");
    if (button.dataset.action === "draft-rules") return showDraftBattleIntro("rules");
    if (button.dataset.action === "draft-details") return showDraftBattleIntro("details");
    if (button.dataset.action === "draft-rules-back") return showDraftBattleIntro("preview");
    if (button.dataset.action === "draft-history") return showDraftHistory();
    if (button.dataset.action === "draft-ranked") return showDraftRanked();
    if (button.dataset.action === "draft-ranked-prev") {
      draftRankedPage = Math.max(0, draftRankedPage - 1);
      return showDraftRanked();
    }
    if (button.dataset.action === "draft-ranked-next") {
      draftRankedPage += 1;
      return showDraftRanked();
    }
    if (button.dataset.draftHistoryDetail) return showDraftHistoryDetail(Number(button.dataset.draftHistoryDetail));
    if (button.dataset.action === "draft-copy-build") {
      const text = draftBuildText();
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      return renderDraftBattleResult();
    }
    if (button.dataset.action === "draft-rematch") {
      draftSocket?.emit("rematch:request");
      $("choice-copy").textContent = "Revanche enviada. Aguardando o rival aceitar.";
      button.disabled = true;
      return;
    }
    if (button.dataset.action === "draft-leave") {
      draftSocket?.emit("queue:leave");
      draftState.match = null;
      draftState.options = [];
      draftState.banOptions = [];
      draftState.lockedArenaId = "";
      draftState.rouletteArenaId = "";
      draftState.battleStartArenaId = "";
      draftState.matchStartedAt = 0;
      draftState.matchDurationMs = 0;
      clearTimeout(draftBattlePlaybackTimer);
      clearTimeout(draftBattleStartFallbackTimer);
      stopDraftMatchClock(0);
      return showDraftBattleIntro("preview");
    }
    if (button.dataset.draftPick) {
      draftSocket?.emit("draft:pick", { pokemonId: Number(button.dataset.draftPick) });
      draftState.options = [];
      return renderDraftBattleRoom("Escolha enviada. Aguardando o servidor.");
    }
    if (button.dataset.draftBan) {
      draftSocket?.emit("ban:pick", { pokemonId: Number(button.dataset.draftBan) });
      draftState.submittedBanStep = draftState.activeBanStep || draftState.match?.banStep || 0;
      return renderDraftBanScreen("Ban enviado. Aguardando o servidor.");
    }
    if (button.dataset.draftBuildMove) {
      const me = draftState.match?.players?.find((player) => player.id === draftState.playerId);
      if (me?.buildReady) return renderDraftBuildScreen();
      const [pokemonIdRaw, moveId] = button.dataset.draftBuildMove.split(":");
      const pokemonId = Number(pokemonIdRaw);
      const selected = draftState.buildSelections[pokemonId] || { moveIds: [], relicId: "" };
      if (selected.moveIds.includes(moveId)) {
        selected.moveIds = selected.moveIds.filter((id) => id !== moveId);
      } else {
        selected.moveIds = [...selected.moveIds, moveId].slice(-2);
      }
      draftState.buildSelections[pokemonId] = selected;
      return renderDraftBuildScreen();
    }
    if (button.dataset.draftBuildRelic) {
      const me = draftState.match?.players?.find((player) => player.id === draftState.playerId);
      if (me?.buildReady) return renderDraftBuildScreen();
      const [pokemonIdRaw, relicId] = button.dataset.draftBuildRelic.split(":");
      const pokemonId = Number(pokemonIdRaw);
      const selected = draftState.buildSelections[pokemonId] || { moveIds: [], relicId: "" };
      selected.relicId = relicId;
      draftState.buildSelections[pokemonId] = selected;
      return renderDraftBuildScreen();
    }
    if (button.dataset.action === "draft-submit-build") {
      const me = draftState.match?.players?.find((player) => player.id === draftState.playerId);
      if (me?.buildReady) return renderDraftBuildScreen();
      const selections = draftState.buildOptions.map((entry) => ({
        pokemonId: entry.pokemonId,
        moveIds: draftState.buildSelections[entry.pokemonId]?.moveIds || [],
        relicId: draftState.buildSelections[entry.pokemonId]?.relicId || "",
      }));
      draftSocket?.emit("build:submit", { selections });
      return renderDraftBuildScreen("Build enviada. Aguardando confirmação do servidor.");
    }
    if (button.dataset.draftOrderPick) {
      draftSocket?.emit("order:pick", { pokemonId: Number(button.dataset.draftOrderPick) });
      return renderDraftOrderScreen("Ordem enviada. Aguardando o servidor.");
    }
    if (button.dataset.action === "tower-order") return towerPrepareNextStep();
    if (button.dataset.action === "tower-bag") return showTowerBag();
    if (button.dataset.action === "tower-reset-order") {
      state.pendingTowerOrder = [];
      return showTowerTeamOrder();
    }
    if (button.dataset.action === "tower-confirm-order") {
      const order = Array.isArray(state.pendingTowerOrder) ? state.pendingTowerOrder : [];
      const ordered = order.map((index) => state.team[index]).filter(Boolean);
      const rest = state.team.filter((_, index) => !order.includes(index));
      state.team = [...ordered, ...rest];
      state.pendingTowerOrder = [];
      save();
      return towerNextStep();
    }
    if (button.dataset.towerOrderPick) {
      if (performance.now() < towerOrderSuppressClickUntil) return;
      return pickTowerOrderIndex(Number(button.dataset.towerOrderPick));
    }
    if (button.dataset.action === "tower-next") return towerNextStep();
    if (button.dataset.towerEvent) return await applyTowerEvent(button.dataset.towerEvent);
    if (button.dataset.towerCarousel) return scrollTowerCarousel(button.dataset.towerCarousel === "next" ? 1 : -1);
    if (button.dataset.action === "title") {
      show("title");
      renderTowerModes();
      updateContinueRunButton();
    }
    if (button.dataset.action === "next-evolution") {
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      if (showPendingEvolutionChoice()) return;
      if (state.tower?.active) return towerPrepareNextStep();
      renderMap();
      save();
    }
    if (button.dataset.cancelEvolutionChoice) {
      const p = state.team[Number(state.pendingEvolutionChoiceIndex)];
      state.pendingEvolutionChoices = (state.pendingEvolutionChoices || []).filter((entry) => entry.runId !== p?.runId);
      state.pendingEvolutionChoiceIndex = null;
      renderMap();
      save();
    }
    if (button.dataset.action === "move-tutor") showMoveTutor();
    if (button.dataset.action === "catch") return showCatch();
    if (button.dataset.catch) return addPokemon(state.offer[Number(button.dataset.catch)]);
    if (button.dataset.replaceRecruit) return replacePokemon(Number(button.dataset.replaceRecruit));
    if (button.dataset.item) {
      const item = { ...state.offer[Number(button.dataset.item)] };
      if (state.tower?.active) {
        state.items.push(item);
        state.offer = [];
        state.pendingItem = null;
        state.pendingTowerOrder = [];
        save();
        return towerPrepareNextStep();
      }
      showEquipItem(item);
    }
    if (button.dataset.bagItem) {
      const index = Number(button.dataset.bagItem);
      const item = state.items.splice(index, 1)[0];
      if (item) {
        showEquipItem({ ...item });
        save();
      }
    }
    if (button.dataset.equip) {
      equipPendingItem(Number(button.dataset.equip));
    }
    if (button.dataset.confirmEquip) {
      equipPendingItem(Number(state.pendingEquipIndex), true);
    }
    if (button.dataset.storeItem) {
      storePendingItem();
    }
    if (button.dataset.moveLearn) {
      showMoveLearner({ ...state.offer[Number(button.dataset.moveLearn)] });
    }
    if (button.dataset.learn) {
      return learnPendingMove(button.dataset.learn);
    }
    if (button.dataset.evolve) {
      const index = Number(button.dataset.evolve);
      const p = state.team[index];
      const options = p ? await dynamicEvolutionOptionsFor(p) : [];
      if (p && options.length > 1) return await showEvolutionChoice(index);
      if (p) evolvePokemon(p, 0, options);
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      renderMap();
      save();
    }
    if (button.dataset.evolutionOption) {
      const index = Number(state.pendingEvolutionChoiceIndex);
      const p = state.team[index];
      const options = p ? await dynamicEvolutionOptionsFor(p) : [];
      if (p) evolvePokemon(p, Number(button.dataset.evolutionOption), options);
      state.pendingEvolutionChoices = (state.pendingEvolutionChoices || []).filter((entry) => entry.runId !== p?.runId);
      state.pendingEvolutionChoiceIndex = null;
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      renderMap();
      save();
    }
    if (button.dataset.train) {
      const p = state.team[Number(button.dataset.train)];
      p.level += 1;
      applyLevelCap(p);
      p.maxHp = hpMax(p);
      p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.35));
      p.energy = Math.min(4, p.energy + 2);
      state.threat = Math.min(3, state.threat + 0.5);
      const evolved = maybeAutoEvolve(p);
      if (evolved === "choice") return showPendingEvolutionChoice();
      if (evolved) return showEvolutionPopup(state.pendingEvolutions?.shift());
      renderMap();
      save();
    }
    if (button.dataset.swap) {
      const idx = Number(button.dataset.swap);
      const playerTeam = state.battle?.playerTeam || state.team;
      const chosen = playerTeam[idx];
      if (!chosen || !state.battle) return;
      state.battle.playerIndex = idx;
      show("battle");
      renderBattle();
      $("battle-log").textContent = `${chosen.name} entrou em campo.`;
      window.setTimeout(() => animateBattleSendOut({ sides: ["player"] }), sendoutDelay(80));
      window.setTimeout(() => enemyTurn(`${chosen.name} entrou em campo.`), sendoutDelay(BATTLE_SENDOUT_DURATION));
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target?.id === "rogue-dex-detail-backdrop") hideDexDetail();
  });

  let towerOrderPointerStart = null;
  document.addEventListener("pointerdown", (event) => {
    if (!document.querySelector(".rogue-stage")?.classList.contains("has-tower-order-modal")) return;
    if (event.target.closest?.(".tower-held-slot, .tower-bag-dock, .tower-order-action")) return;
    const button = event.target.closest?.("[data-tower-order-pick]");
    if (!button || button.disabled) return;
    towerOrderPointerStart = {
      button,
      x: event.clientX,
      y: event.clientY
    };
  }, true);

  document.addEventListener("pointerup", (event) => {
    if (!towerOrderPointerStart) return;
    const { button, x, y } = towerOrderPointerStart;
    towerOrderPointerStart = null;
    if (!document.querySelector(".rogue-stage")?.classList.contains("has-tower-order-modal")) return;
    if (!button.isConnected || button.disabled) return;
    if (Math.hypot(event.clientX - x, event.clientY - y) > 10) return;
    event.preventDefault();
    event.stopPropagation();
    pickTowerOrderIndex(Number(button.dataset.towerOrderPick));
  }, true);

  document.addEventListener("pointerover", (event) => {
    const slot = event.target.closest?.("[data-held-tooltip]");
    if (slot) showHeldTooltip(slot);
  });
  document.addEventListener("pointermove", (event) => {
    const slot = event.target.closest?.("[data-held-tooltip]");
    if (slot) positionHeldTooltip(slot);
  });
  document.addEventListener("pointerout", (event) => {
    if (!event.target.closest?.("[data-held-tooltip]")) return;
    if (event.relatedTarget?.closest?.("[data-held-tooltip]")) return;
    hideHeldTooltip();
  });
  document.addEventListener("focusin", (event) => {
    const slot = event.target.closest?.("[data-held-tooltip]");
    if (slot) showHeldTooltip(slot);
  });
  document.addEventListener("focusout", (event) => {
    if (event.target.closest?.("[data-held-tooltip]")) hideHeldTooltip();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setRogueDexOpen(false);
  });

  document.addEventListener("change", (event) => {
    if (event.target?.name === "run-mode") updateContinueRunButton();
  });

  document.addEventListener("dragstart", (event) => {
    const row = event.target.closest(".route-team-mon");
    if (!row || state.screen !== "map") return;
    event.dataTransfer?.setData("text/plain", row.dataset.teamIndex);
    event.dataTransfer.effectAllowed = "move";
    row.classList.add("is-dragging");
  });

  document.addEventListener("dragend", (event) => {
    event.target.closest(".route-team-mon")?.classList.remove("is-dragging");
    document.querySelectorAll(".route-team-mon.is-drop-target").forEach((row) => row.classList.remove("is-drop-target"));
  });

  document.addEventListener("dragover", (event) => {
    const row = event.target.closest(".route-team-mon");
    if (!row || state.screen !== "map") return;
    event.preventDefault();
    row.classList.add("is-drop-target");
  });

  document.addEventListener("dragleave", (event) => {
    event.target.closest(".route-team-mon")?.classList.remove("is-drop-target");
  });

  document.addEventListener("drop", (event) => {
    const row = event.target.closest(".route-team-mon");
    if (!row || state.screen !== "map") return;
    event.preventDefault();
    row.classList.remove("is-drop-target");
    moveTeamMember(Number(event.dataTransfer?.getData("text/plain")), Number(row.dataset.teamIndex));
  });

  setupStarters();
  updateContinueRunButton();
  updateDraftAccountButton();
  renderTowerModes();
  void loadNationalDexIndex();
  renderDexBadge();
  renderHud();
  if (readSupabaseRecoveryToken()) showDraftAuth("reset");
})();
