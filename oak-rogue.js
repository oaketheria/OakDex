(function () {
  "use strict";

  const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const MINI_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
  const ANIM_BASE = "https://play.pokemonshowdown.com/sprites/ani/";
  const ITEM_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/";
  const BADGE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/";
  const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers/";
  const API_BASE = "https://pokeapi.co/api/v2";
  const NATIONAL_DEX_LIMIT = 1025;

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
    { id: 7, name: "Squirtle", types: ["Water"], hp: 52, atk: 48, def: 65, spd: 43, trait: "Guarda", text: "Tanque sólido, combina com relíquias defensivas." }
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
        { id: 121, name: "Starmie Prisma", types: ["Water", "Psychic"], hp: 115, atk: 88, def: 76, spd: 118, trait: "Refracao" }
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
        { id: 110, name: "Weezing Toxico", types: ["Poison"], hp: 142, atk: 98, def: 112, spd: 66, trait: "Nevoa" }
      ]
    },
    {
      leader: "Sabrina", trainer: "sabrina", badge: 6, arena: "Pantano",
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
        { id: 130, name: "Gyarados", types: ["Water", "Flying"], hp: 172, atk: 154, def: 108, spd: 112, trait: "Furia" },
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
        { id: 9, name: "Blastoise Campeao", types: ["Water"], hp: 214, atk: 158, def: 150, spd: 104, trait: "Canhao" }
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
    { id: "mystic-water", sprite: "mystic-water", name: "Agua Mistica", text: "+14% de ataque.", kind: "atk" },
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
    { id: "power-weight", sprite: "power-weight", name: "Peso Poder", text: "+12% de HP maximo.", kind: "hp" },
    { id: "big-root", sprite: "big-root", name: "Raiz Grande", text: "+12% de HP maximo.", kind: "hp" },
    { id: "thick-club", sprite: "thick-club", name: "Osso Robusto", text: "+12% de HP maximo.", kind: "hp" },
    { id: "healthy-feather", sprite: "health-wing", name: "Pena Vigor", text: "+12% de HP maximo.", kind: "hp" },
    { id: "lucky-egg", sprite: "lucky-egg", name: "Lucky Egg", text: "Ajuda o time a escalar melhor.", kind: "synergy" },
    { id: "amulet-coin", sprite: "amulet-coin", name: "Moeda Amuleto", text: "Ajuda a run a escalar melhor.", kind: "synergy" },
    { id: "wide-lens", sprite: "wide-lens", name: "Wide Lens", text: "Melhora consistencia da equipe.", kind: "synergy" },
    { id: "zoom-lens", sprite: "zoom-lens", name: "Zoom Lens", text: "Melhora consistencia da equipe.", kind: "synergy" },
    { id: "metronome", sprite: "metronome", name: "Metronomo", text: "Melhora sinergias de ataques.", kind: "synergy" },
    { id: "king-s-rock", sprite: "king-s-rock", name: "King's Rock", text: "Melhora sinergias de ataques.", kind: "synergy" },
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
    ,{ id: "spark", name: "Centelha Dupla", type: "Electric", power: 1.08, cost: 1, extra: 0.35 }
    ,{ id: "shadow", name: "Sombra Final", type: "Ghost", power: 1.16, cost: 1, execute: 0.18 }
  ];

  const TYPE_MOVES = {
    Grass: [
      { id: "vine-whip", name: "Chicote de Vinha", type: "Grass", power: 0.95, cost: 0, level: 1 },
      { id: "mega-drain", name: "Mega Dreno", type: "Grass", power: 1.12, cost: 1, drain: 0.22, level: 12 },
      { id: "petal-storm", name: "Tempestade Floral", type: "Grass", power: 1.42, cost: 2, level: 28 }
    ],
    Poison: [
      { id: "poison-sting", name: "Agulha Venenosa", type: "Poison", power: 0.9, cost: 0, level: 1 },
      { id: "sludge", name: "Lodo", type: "Poison", power: 1.14, cost: 1, burn: true, level: 14 }
    ],
    Fire: [
      { id: "ember", name: "Brasas", type: "Fire", power: 0.98, cost: 0, level: 1, burn: true },
      { id: "flame-wheel", name: "Roda de Fogo", type: "Fire", power: 1.18, cost: 1, burn: true, level: 12 },
      { id: "flamethrower", name: "Lanca-Chamas", type: "Fire", power: 1.48, cost: 2, burn: true, level: 28 }
    ],
    Water: [
      { id: "bubble", name: "Bolha", type: "Water", power: 0.92, cost: 0, level: 1 },
      { id: "water-pulse", name: "Pulso d'Agua", type: "Water", power: 1.16, cost: 1, teamHeal: 0.05, level: 12 },
      { id: "surf", name: "Surfar", type: "Water", power: 1.44, cost: 2, teamHeal: 0.08, level: 30 }
    ],
    Electric: [
      { id: "thundershock", name: "Choque do Trovao", type: "Electric", power: 0.96, cost: 0, level: 1, extra: 0.2 },
      { id: "spark", name: "Centelha", type: "Electric", power: 1.18, cost: 1, extra: 0.32, level: 13 }
    ],
    Psychic: [
      { id: "confusion", name: "Confusao", type: "Psychic", power: 1.0, cost: 0, level: 1 },
      { id: "psybeam", name: "Raio Psiquico", type: "Psychic", power: 1.22, cost: 1, level: 16 }
    ],
    Rock: [{ id: "rock-throw", name: "Pedrada", type: "Rock", power: 1.0, cost: 0, level: 1 }],
    Ground: [{ id: "mud-slap", name: "Tapa de Lama", type: "Ground", power: 0.96, cost: 0, level: 1 }],
    Fighting: [{ id: "karate-chop", name: "Golpe Karate", type: "Fighting", power: 1.02, cost: 0, level: 1 }],
    Ghost: [{ id: "lick", name: "Lambida", type: "Ghost", power: 0.94, cost: 0, level: 1 }],
    Bug: [{ id: "fury-cutter", name: "Corte Furioso", type: "Bug", power: 1.0, cost: 0, level: 1 }],
    Flying: [{ id: "gust", name: "Lufada", type: "Flying", power: 0.98, cost: 0, level: 1 }],
    Ice: [{ id: "ice-shard", name: "Estilhaco de Gelo", type: "Ice", power: 1.0, cost: 0, level: 1 }],
    Dragon: [{ id: "twister", name: "Twister", type: "Dragon", power: 1.0, cost: 0, level: 1 }],
    Dark: [{ id: "bite", name: "Mordida", type: "Dark", power: 1.02, cost: 0, level: 1 }],
    Normal: [{ id: "tackle", name: "Investida", type: "Normal", power: 0.92, cost: 0, level: 1 }],
    Fairy: [{ id: "disarming-voice", name: "Voz Encantada", type: "Fairy", power: 0.98, cost: 0, level: 1 }]
  };

  const EVOLUTIONS = {
    1: { into: { id: 2, name: "Ivysaur", types: ["Grass", "Poison"], hp: 62, atk: 62, def: 63, spd: 60, trait: "Controle" }, level: 16 },
    2: { into: { id: 3, name: "Venusaur", types: ["Grass", "Poison"], hp: 82, atk: 82, def: 83, spd: 80, trait: "Florescer" }, level: 32 },
    4: { into: { id: 5, name: "Charmeleon", types: ["Fire"], hp: 58, atk: 72, def: 58, spd: 80, trait: "Pressão" }, level: 16 },
    5: { into: { id: 6, name: "Charizard", types: ["Fire", "Flying"], hp: 78, atk: 96, def: 78, spd: 100, trait: "Inferno" }, level: 36 },
    7: { into: { id: 8, name: "Wartortle", types: ["Water"], hp: 66, atk: 63, def: 80, spd: 58, trait: "Guarda" }, level: 16 },
    8: { into: { id: 9, name: "Blastoise", types: ["Water"], hp: 84, atk: 88, def: 105, spd: 78, trait: "Canhao" }, level: 36 },
    25: { into: { id: 26, name: "Raichu", types: ["Electric"], hp: 66, atk: 90, def: 55, spd: 110, trait: "Voltagem" }, stone: "thunder" },
    58: { into: { id: 59, name: "Arcanine", types: ["Fire"], hp: 90, atk: 110, def: 80, spd: 95, trait: "Brasa" }, stone: "fire" },
    63: { into: { id: 64, name: "Kadabra", types: ["Psychic"], hp: 40, atk: 105, def: 35, spd: 105, trait: "Foco" }, level: 16 },
    64: { into: { id: 65, name: "Alakazam", types: ["Psychic"], hp: 55, atk: 135, def: 45, spd: 120, trait: "Foco" }, level: 36 },
    66: { into: { id: 67, name: "Machoke", types: ["Fighting"], hp: 80, atk: 100, def: 70, spd: 45, trait: "Punho" }, level: 28 },
    74: { into: { id: 75, name: "Graveler", types: ["Rock", "Ground"], hp: 65, atk: 95, def: 115, spd: 35, trait: "Casca" }, level: 25 },
    92: { into: { id: 93, name: "Haunter", types: ["Ghost", "Poison"], hp: 45, atk: 105, def: 45, spd: 95, trait: "Assombro" }, level: 25 },
    147: { into: { id: 148, name: "Dragonair", types: ["Dragon"], hp: 61, atk: 84, def: 65, spd: 70, trait: "Escalar" }, level: 30 },
    148: { into: { id: 149, name: "Dragonite", types: ["Dragon", "Flying"], hp: 91, atk: 134, def: 95, spd: 80, trait: "Escalar" }, level: 55 },
    133: { into: { id: 134, name: "Vaporeon", types: ["Water"], hp: 130, atk: 80, def: 70, spd: 65, trait: "Adaptar" }, stone: "water" },
    215: { into: { id: 461, name: "Weavile", types: ["Dark", "Ice"], hp: 70, atk: 120, def: 65, spd: 125, trait: "Emboscada" }, stone: "dark" }
  };

  const NODE_TYPES = [
    { type: "battle", label: "Batalha", icon: "B", sprite: "trainer", copy: "Inimigo escalado pelo andar." },
    { type: "grass", label: "Mato", icon: "G", sprite: "grass", copy: "Batalha selvagem aleatória." },
    { type: "catch", label: "Recrutar", icon: "P", sprite: "pokeball", copy: "Escolha um novo aliado." },
    { type: "item", label: "Relíquia", icon: "I", sprite: "item", copy: "Escolha uma melhoria passiva." },
    { type: "question", label: "Evento", icon: "?", sprite: "question", copy: "Evento aleatório de risco/recompensa." },
    { type: "move_tutor", label: "Tutor", icon: "M", sprite: "tm", copy: "Desbloqueia habilidade ou move." },
    { type: "stone", label: "Pedra", icon: "E", sprite: "stone", copy: "Força evolução compatível." },
    { type: "camp", label: "Centro", icon: "+", sprite: "center", copy: "Cura o time e reduz risco." },
    { type: "train", label: "Treino", icon: "T", sprite: "npc", copy: "Fortalece um membro." }
  ];

  const ARENAS = [
    { id: "rock", name: "Ginasio Rocha Basalto", trainer: "brock", npc: "Brock", floorFrom: 0, floorTo: 8, badge: 1 },
    { id: "water", name: "Ginasio Aquario Prisma", trainer: "misty", npc: "Misty", floorFrom: 8, floorTo: 16, badge: 2 },
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
    fallenTeam: [],
    pendingItem: null,
    pendingEvolutions: [],
    routeVersion: ROUTE_VERSION,
    autoBattling: false,
    nuzlockeMode: false,
    levelCapEnabled: true
  };

  const $ = (id) => document.getElementById(id);
  const nationalPokemonCache = new Map();
  let nationalDexIndex = [];
  let nationalDexLoadStarted = false;
  const sprite = (p) => `${SPRITE_BASE}${p.id}.png`;
  const mini = (p) => `${MINI_BASE}${p.id}.png`;
  const slug = (name) => String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const animated = (p) => `${ANIM_BASE}${slug(p.name.replace(/\s+(Alfa|Prisma|Condutor|Jardim|Toxico|Vulcao|Sismico|Tenente)$/i, ""))}.gif`;
  const itemSprite = (item) => `${ITEM_BASE}${item.sprite || item.id}.png`;
  const badgeSprite = (badge) => `${BADGE_BASE}${badge}.png`;
  const trainerSprite = (name) => `${TRAINER_BASE}${name}.png`;
  const playerTrainerSprite = () => getArenaForFloor(state.floor || 1).trainer;
  const tmSprite = (move) => `${ITEM_BASE}tm-${String(move?.type || "normal").toLowerCase()}.png`;
  const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const DEX_KEY = "oak_rogue_dex_seen";
  const SHINY_DEX_KEY = "oak_rogue_dex_shiny_seen";
  const SHINY_RATE = 0.035;
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
      renderDexBadge();
      if ($("rogue-dex-modal")?.classList.contains("is-open")) renderRogueDex();
    } catch {
      nationalDexIndex = [];
    }
    return nationalDexIndex;
  }

  async function hydrateNationalPokemon(ref) {
    if (!ref?.id) return null;
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
      : [...STARTERS, ...POOL, ...Object.values(GYM_POOLS).flat(), ...ALL_BOSSES.flatMap((boss) => boss.team)];
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
    return `${ANIM_BASE}shiny/${slug(baseDexName(p))}.gif`;
  }

  function maybeMarkShiny(mon) {
    if (mon && Math.random() < SHINY_RATE) mon.shiny = true;
    return mon;
  }

  function renderRogueDex(tab = document.querySelector(".rogue-dex-tabs .is-active")?.dataset.dexTab || "normal") {
    const catalog = dexCatalog();
    const seen = loadDexSeen(tab);
    const genOne = catalog.filter((p) => dexGeneration(p.id) === 1);
    const genSeen = genOne.filter((p) => seen.has(p.id)).length;
    const genPct = genOne.length ? Math.round((genSeen / genOne.length) * 100) : 0;
    const pct = catalog.length ? Math.round((seen.size / catalog.length) * 100) : 0;
    if ($("rogue-dex-generation")) $("rogue-dex-generation").textContent = `Gen I - ${genPct}%`;
    if ($("rogue-dex-generation-bar")) $("rogue-dex-generation-bar").style.width = `${genPct}%`;
    if ($("rogue-dex-summary")) $("rogue-dex-summary").textContent = `Todas as gens - ${pct}%`;
    if ($("rogue-dex-seen-bar")) $("rogue-dex-seen-bar").style.width = `${pct}%`;
    if ($("rogue-dex-grid")) $("rogue-dex-grid").innerHTML = catalog.map((p) => {
      const unlocked = seen.has(p.id);
      const art = tab === "shiny" ? shinySprite(p) : animated(p);
      return `<button class="rogue-dex-card ${unlocked ? "seen" : "unknown"} ${tab === "shiny" ? "shiny-tab" : ""}" type="button" ${unlocked ? `data-dex-mon="${p.id}"` : "disabled"}>
        <span>#${String(p.id).padStart(3, "0")}</span>
        <img src="${art}" alt="${unlocked ? p.name : ""}" onerror="this.src='${mini(p)}'">
        <strong>${unlocked ? p.name : "???"}</strong>
        ${unlocked ? renderTypeChips(p.types || []) : "<small>Nao visto</small>"}
      </button>`;
    }).join("");
  }

  function dexEvolutionLine(p) {
    const chain = [p];
    let current = p;
    let guard = 0;
    while (EVOLUTIONS[current.id]?.into && guard < 4) {
      current = { ...EVOLUTIONS[current.id].into, level: EVOLUTIONS[chain[chain.length - 1].id].level };
      chain.push(current);
      guard += 1;
    }
    if (chain.length <= 1) return `<small>Sem evolucao registrada no Oak Rogue.</small>`;
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
    return places.length ? places.join(" · ") : "Aparece em eventos especiais da run";
  }

  async function showDexDetail(id) {
    let p = dexCatalog().find((entry) => entry.id === id);
    const detail = $("rogue-dex-detail");
    const backdrop = $("rogue-dex-detail-backdrop");
    if (!p || !detail) return;
    if (!p.types?.length || !Number.isFinite(p.hp)) {
      try {
        p = await hydrateNationalPokemon(p);
      } catch {}
    }
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
          <h4>Cadeia de evolucao</h4>
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

  function hasStatItem(p, kind) {
    return p?.heldItem?.kind === kind || hasItem(kind);
  }

  function countTypes() {
    const counts = {};
    state.team.forEach((p) => {
      if (p.currentHp <= 0) return;
      p.types.forEach((t) => counts[t] = (counts[t] || 0) + 1);
    });
    if (hasItem("synergy")) Object.keys(counts).forEach((t) => counts[t] += 1);
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
    return Math.round(scaledStat(p.hp || 1, p.level || 1, true) * (hasStatItem(p, "hp") ? 1.12 : 1));
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

  function applyLevelCap(p) {
    if (!p || !state.levelCapEnabled) return;
    p.level = Math.min(p.level, currentLevelCap());
  }

  function applyNuzlockeLosses() {
    if (!state.nuzlockeMode) return;
    state.fallenTeam ||= [];
    state.team
      .filter((p) => p.currentHp <= 0 && !state.fallenTeam.some((fallen) => fallen.runId === p.runId))
      .forEach((p) => state.fallenTeam.push({ ...p, currentHp: 0, runId: p.runId }));
    const aliveTeam = state.team.filter((p) => p.currentHp > 0);
    if (aliveTeam.length === state.team.length) return;
    state.team = aliveTeam;
    if (!state.battle) return;
    state.battle.playerTeam = aliveTeam;
    state.battle.playerIndex = Math.max(0, aliveTeam.findIndex((p) => p.currentHp > 0));
  }

  function xpToNext(p) {
    return 70 + p.level * 18;
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
    const kindMultiplier = boss ? 2.25 : state.battle?.npc ? 1.35 : 1;
    const base = 46 + enemy.level * (boss ? 14 : state.battle?.npc ? 9 : 7);
    const total = Math.round(base * kindMultiplier);
    const sharedXp = Math.round(total / Math.max(1, recipients.length));
    let levels = 0;
    recipients.forEach((p) => {
      if (p.currentHp <= 0) return;
      const activeBonus = p === activePlayer() ? Math.round(total * 0.22) : 0;
      const catchUpBonus = p.level < teamAverage ? Math.round(sharedXp * 0.35) : 0;
      levels += gainXp(p, sharedXp + activeBonus + catchUpBonus);
    });
    return { xp: total, levels };
  }

  function atkVal(p) {
    return Math.round(scaledStat(p.atk || 1, p.level || 1) * (1 + synergyTier(p.types) * 0.05) * (hasStatItem(p, "atk") ? 1.14 : 1));
  }

  function defVal(p) {
    return Math.round(scaledStat(p.def || 1, p.level || 1) * (hasStatItem(p, "def") ? 1.12 : 1));
  }

  function speedVal(p) {
    return Math.round(scaledStat(p.spd || 1, p.level || 1) * (hasStatItem(p, "spd") ? 1.15 : 1));
  }

  function legalMovesFor(p) {
    const typeMoves = p.types.flatMap((type) => TYPE_MOVES[type] || []);
    const normalMoves = TYPE_MOVES.Normal || [];
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
    if ((move.level || 1) > (p.level || 1)) return false;
    if ((p.moves || []).some((entry) => entry.id === move.id)) return false;
    return !move.type || p.types.includes(move.type) || move.type === "Normal";
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
    mon.heldItem = mon.heldItem || null;
    return mon;
  }

  function show(screen) {
    const previousScreen = state.screen;
    document.querySelectorAll(".rogue-screen").forEach((el) => el.classList.remove("is-active"));
    document.querySelector(".rogue-stage")?.classList.remove("has-choice-modal", "has-battle-modal", "has-victory-modal", "has-evolution-modal", "has-simple-modal", "has-center-modal");
    document.body.classList.toggle("is-rogue-battle-open", screen === "battle");
    if ((screen === "choice" && (previousScreen === "map" || previousScreen === "choice")) || (screen === "battle" && previousScreen === "map")) {
      $("screen-map").classList.add("is-active");
      document.querySelector(".rogue-stage")?.classList.add(screen === "choice" ? "has-choice-modal" : "has-battle-modal");
    }
    $(`screen-${screen}`).classList.add("is-active");
    state.screen = screen;
    renderHud();
  }

  function save() {
    try {
      localStorage.setItem("oak_rogue_run", JSON.stringify(state));
    } catch {}
  }

  function savedRunMode() {
    try {
      const saved = JSON.parse(localStorage.getItem("oak_rogue_run") || "null");
      if (!saved?.team?.length) return null;
      return saved.nuzlockeMode ? "nuzlocke" : "normal";
    } catch {
      return null;
    }
  }

  function selectedRunMode() {
    return $("run-nuzlocke")?.checked ? "nuzlocke" : "normal";
  }

  function updateContinueRunButton() {
    const button = $("continue-run");
    if (!button) return;
    const savedMode = savedRunMode();
    button.hidden = !savedMode || savedMode !== selectedRunMode();
  }

  function normalizeItem(item) {
    if (!item) return null;
    const fresh = ITEMS.find((entry) => entry.id === item.id || entry.name === item.name || entry.sprite === item.sprite);
    return fresh ? { ...fresh } : { ...item };
  }

  function load() {
    try {
      const raw = localStorage.getItem("oak_rogue_run");
      if (!raw) return false;
      Object.assign(state, JSON.parse(raw));
      if (!Array.isArray(state.badges)) state.badges = [];
      if (!Array.isArray(state.offer)) state.offer = [];
      if (!Array.isArray(state.items)) state.items = [];
      if (!Array.isArray(state.fallenTeam)) state.fallenTeam = [];
      if (!Array.isArray(state.pendingEvolutions)) state.pendingEvolutions = [];
      state.items = state.items.map(normalizeItem).filter(Boolean);
      state.pendingItem = normalizeItem(state.pendingItem);
      state.nuzlockeMode = !!state.nuzlockeMode;
      state.levelCapEnabled = state.levelCapEnabled !== false;
      state.autoBattling = false;
    if (!Array.isArray(state.map) || state.map.length !== RUN_FLOORS || state.routeVersion !== ROUTE_VERSION) buildMap();
      state.routeVersion = ROUTE_VERSION;
      state.team.forEach((p) => {
        p.runId ||= uid("mon");
        p.heldItem = normalizeItem(p.heldItem);
        const oldMax = p.maxHp || hpMax(p);
        const hpPct = oldMax ? Math.max(0, p.currentHp || oldMax) / oldMax : 1;
        p.maxHp = hpMax(p);
        p.currentHp = Math.max(p.currentHp <= 0 ? 0 : 1, Math.min(p.maxHp, Math.ceil(p.maxHp * hpPct)));
        syncMoves(p);
        p.xp = p.xp || 0;
        maybeAutoEvolve(p);
      });
      state.fallenTeam = state.fallenTeam.map((p) => ({ ...p, runId: p.runId || uid("mon"), currentHp: 0 }));
      state.battle?.enemyTeam?.forEach((p) => {
        const oldMax = p.maxHp || hpMax(p);
        const hpPct = oldMax ? Math.max(0, p.currentHp || oldMax) / oldMax : 1;
        p.maxHp = hpMax(p);
        p.currentHp = Math.max(p.currentHp <= 0 ? 0 : 1, Math.min(p.maxHp, Math.ceil(p.maxHp * hpPct)));
        syncMoves(p);
      });
      if (state.battle && !Array.isArray(state.battle.enemyTeam) && state.battle.enemy) {
        state.battle.enemyTeam = [state.battle.enemy];
        state.battle.enemyIndex = 0;
      }
      if (state.battle && !Number.isFinite(state.battle.playerIndex)) {
        state.battle.playerTeam = state.battle.playerTeam || state.team;
        state.battle.playerIndex = state.battle.playerTeam.findIndex((p) => p.currentHp > 0);
      }
      save();
      return state.team.length > 0;
    } catch {
      return false;
    }
  }

  function clearSave() {
    localStorage.removeItem("oak_rogue_run");
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
      const start = audio.currentTime + delay;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + Math.min(0.025, duration * 0.35));
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
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
    const effectiveBoost = detail.eff > 1 ? 1.22 : detail.eff < 1 ? 0.82 : 1;
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
    return defenderTypes.reduce((mult, t) => {
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
      <span>→</span>
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
      name: boss?.arena ? `Insígnia ${boss.arena}` : `Insígnia ${badge}`,
      leader: boss?.leader || arena?.npc || "Líder desconhecido"
    };
  }

  function renderHud() {
    $("rogue-floor").textContent = `${state.floor}/${RUN_FLOORS}`;
    const arena = getArena();
    $("rogue-biome").textContent = arena.name;
    const risk = state.threat <= 1 ? "Estável" : state.threat < 2.5 ? "Perigoso" : "Crítico";
    $("rogue-threat").textContent = `${risk} · Cap ${currentLevelCap()}${state.nuzlockeMode ? " · Nuzlocke" : ""}`;
    document.body.dataset.arena = arena.id;
    if ($("team-count")) $("team-count").textContent = `${state.team.length}/6`;
    if ($("item-count")) $("item-count").textContent = String(state.items.length);
    if ($("team-list")) $("team-list").innerHTML = state.team.map((p) => `
      <div class="team-row ${p.currentHp <= 0 ? "fainted" : ""}">
        <img src="${mini(p)}" alt="${p.name}">
        <div>
          <strong>${p.name}</strong>
          <small>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp} · ${p.heldItem ? p.heldItem.name : "sem item"}</small>
          ${renderTypeChips(p.types)}
        </div>
      </div>
    `).join("") || `<div class="item-pill"><small>Nenhum parceiro ainda.</small></div>`;
    if ($("item-list")) $("item-list").innerHTML = state.items.map((item) => `
      <div class="item-pill item-with-icon">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <span><strong>${item.name}</strong><small>${item.text}</small></span>
      </div>
    `).join("") || `<div class="item-pill"><small>Relíquias aparecem em nós especiais.</small></div>`;
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
    }).join("") || `<div class="synergy-pill"><small>Junte 2+ do mesmo tipo para ativar bonus.</small></div>`;
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
    return [...gymPool(floor), ...POOL].find((p) => p.name === name) || POOL[0];
  }

  function renderRouteSidebars() {
    const routeTeam = $("route-team");
    if (routeTeam) {
      routeTeam.innerHTML = state.team.map((p, index) => `
        <div class="route-team-mon ${p.currentHp <= 0 ? "fainted" : ""} ${index >= 3 ? "hover-up" : ""}" draggable="true" data-team-index="${index}">
          <b class="team-order">${index + 1}</b>
          <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
          ${p.heldItem ? `<img class="held-item-icon" src="${itemSprite(p.heldItem)}" alt="${p.heldItem.name}" title="${p.heldItem.name}">` : ""}
          <span>${p.name}</span>
          <small>Lv.${p.level} · HP ${Math.max(0, p.currentHp)}/${p.maxHp}</small>
          <i style="width:${Math.max(0, Math.round((p.currentHp / p.maxHp) * 100))}%"></i>
          <div class="team-hover-card" aria-label="Detalhes de ${p.name}">
            <div class="team-hover-hero is-hidden">
              <img src="${animated(p)}" alt="" onerror="this.src='${mini(p)}'">
              <div>
                <strong>${p.name}</strong>
            <small>Lv.${p.level} · ${p.heldItem ? p.heldItem.name : "sem item"}</small>
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
            ${p.heldItem ? `<div class="team-hover-item"><img src="${itemSprite(p.heldItem)}" alt=""><span><b>${p.heldItem.name}</b><small>${p.heldItem.text}</small></span></div>` : ""}
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

  function setupStarters() {
    $("starter-grid").innerHTML = STARTERS.map((p) => `
      <button class="starter-card" type="button" data-starter="${p.id}">
        <span class="rogue-kicker">${p.trait}</span>
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${sprite(p)}'">
        <strong>${p.name}</strong>
        ${renderTypeChips(p.types)}
        <p>${p.text}</p>
        <small>HP ${p.hp} · ATK ${p.atk} · DEF ${p.def} · VEL ${p.spd}</small>
      </button>
    `).join("");
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
    state.pendingEvolutions = [];
    state.routeVersion = ROUTE_VERSION;
    state.nuzlockeMode = !!$("run-nuzlocke")?.checked;
    state.levelCapEnabled = state.nuzlockeMode;
    setupStarters();
    show("starters");
  }

  function chooseStarter(id) {
    const starter = STARTERS.find((p) => p.id === id);
    state.team = [maybeMarkShiny(cloneMon(starter, 5))];
    state.team[0].runId ||= uid("mon");
    registerDexSeen(state.team[0]);
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
    if (node.type === "battle" || node.type === "grass" || node.type === "boss") await startBattle(node);
    if (node.type === "catch") await showCatch();
    if (node.type === "item") showItem();
    if (node.type === "question") showRandomEvent();
    if (node.type === "move_tutor") showMoveTutor();
    if (node.type === "stone") showEvolutionStone();
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
    const lines = {
      heal: ["Sustento: cura após atacar", "HP efetivo maior em lutas longas"],
      crit: ["Critico +18%", "Mais chance de dano explosivo"],
      atk: ["ATK +14%", "Aumenta o dano base"],
      spd: ["VEL +15%", "Ataca antes com mais frequencia"],
      def: ["DEF +12%", "Reduz dano recebido"],
      hp: ["HP +12%", "Mais margem para sobreviver"],
      damage: ["Dano final +16%", "Finaliza lutas mais rápido"],
      synergy: ["Sinergia +1", "Melhora consistencia do time"],
      sash: ["Sobrevive a golpe fatal 1x", "Seguro contra derrota inesperada"]
    };
    return lines[item?.kind] || ["Bonus especial da run"];
  }

  function itemBonusMarkup(item) {
    return `<div class="item-bonus-list">${itemBonusLines(item).map((line) => `<span>${line}</span>`).join("")}</div>`;
  }

  function statPreviewWithItem(p, item) {
    const before = displayStats(p);
    const after = {
      hp: Math.round(before.hp * (item?.kind === "hp" ? 1.12 : 1)),
      atk: Math.round(before.atk * (item?.kind === "atk" ? 1.14 : 1)),
      def: Math.round(before.def * (item?.kind === "def" ? 1.12 : 1)),
      spd: Math.round(before.spd * (item?.kind === "spd" ? 1.15 : 1))
    };
    return `<div class="stat-preview">
      ${[
        ["HP", before.hp, after.hp],
        ["ATK", before.atk, after.atk],
        ["DEF", before.def, after.def],
        ["VEL", before.spd, after.spd]
      ].map(([label, from, to]) => `<span class="${to > from ? "buffed" : ""}"><i>${label}</i><b>${from}</b><em>${to > from ? `→ ${to}` : "—"}</em></span>`).join("")}
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

  function enemyLevel(kind = "wild", index = 0) {
    const arena = getArenaForFloor(state.floor || 1);
    const local = Math.max(1, (state.floor || 1) - arena.floorFrom);
    const teamLevel = averageTeamLevel();
    const routePressure = Math.floor((local - 1) / 3);
    const kindBoost = kind === "boss" ? 2 : kind === "npc" ? 1 : kind === "grass" ? 0 : -1;
    const threatBoost = Math.max(0, Math.floor(state.threat - 1));
    const level = teamLevel + routePressure + kindBoost + threatBoost + index;
    const gymSoftCap = arena.id === "league" ? 100 : 7 + (arena.badge - 1) * 5 + (kind === "boss" ? 3 : 0);
    const capped = Math.min(level, gymSoftCap);
    return state.levelCapEnabled ? Math.min(capped, currentLevelCap() + (kind === "boss" ? 1 : 0)) : capped;
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

  function createLeaderTeam(node = {}) {
    const arenaIndex = ARENAS.findIndex((arena) => arena.floorTo === state.floor);
    const bossIndex = Number.isFinite(node.bossIndex) ? node.bossIndex : arenaIndex;
    const leader = ALL_BOSSES[Math.max(0, bossIndex)];
    return leader.team.map((mon, index) => {
      const enemy = maybeMarkShiny(cloneMon(mon, enemyLevel("boss", index)));
      const aceBoost = index === leader.team.length - 1 ? 1.65 : 1.22;
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
    const bossBattle = node.type === "boss" || ARENAS.some((arena) => arena.floorTo === state.floor);
    const npcBattle = node.type === "battle";
    const npcData = npcBattle ? await createNpcTeam(node) : null;
    const enemyTeam = bossBattle ? createLeaderTeam(node) : npcBattle ? npcData.team : [await createEnemy(false)];
    registerDexSeenMany(enemyTeam);
    state.battle = { playerTeam: state.team, enemyTeam, enemyIndex: 0, playerIndex: state.team.findIndex((p) => p.currentHp > 0), enemy: enemyTeam[0], boss: bossBattle, npc: npcBattle, trainerName: npcData?.trainerName || null, trainerSpriteId: npcData?.trainerSpriteId || enemyTeam[0]?.trainer || null };
    $("battle-title").textContent = node.type === "boss"
      ? `${state.battle.enemy.leader} enviou ${state.battle.enemy.name}`
      : node.type === "battle"
        ? `${state.battle.trainerName} desafiou você`
        : `${state.battle.enemy.name} apareceu no mato`;
    $("battle-log").textContent = "Batalha iniciada. O time usa automaticamente energia, moves e itens equipados.";
    renderBattle();
    playBattleSfx("start");
    show("battle");
    window.setTimeout(() => {
      if (state.screen === "battle" && state.battle) runAutoBattle();
    }, 450);
  }

  function renderBattle() {
    if (!state.battle) return;
    const playerTeam = state.battle.playerTeam || state.team;
    const player = activePlayer() || playerTeam[state.battle.playerIndex || 0] || playerTeam.find((p) => p.currentHp <= 0) || playerTeam[0];
    if (!player) return;
    renderBattleRoster("player-card", state.battle.playerTeam || state.team, player, "Seu time", playerTrainerSprite(), "player");
    renderBattleRoster("enemy-card", state.battle.enemyTeam, state.battle.enemy, state.battle.boss ? state.battle.enemy.leader : state.battle.npc ? state.battle.trainerName : "Inimigo", state.battle.trainerSpriteId || state.battle.enemy.trainer, "enemy");
    animateRenderedHpBars();
    $("move-grid").innerHTML = `
      <div class="battle-auto-status">
        <strong>Batalha automática</strong>
        <small>Moves, energia e itens equipados resolvem o combate em tempo real.</small>
      </div>
    `;
  }

  function renderBattleRoster(id, mons, active, label, trainer, side = "") {
    $(id).innerHTML = `
      <div class="battle-trainer-head ${side}">
        ${trainer ? `<img src="${trainerSprite(trainer)}" alt="${label}" onerror="this.style.display='none'">` : ""}
        <span class="rogue-kicker">${label}</span>
      </div>
      <div class="battle-stack">
        ${mons.map((p) => renderBattleSlot(p, p === active)).join("")}
      </div>
    `;
  }

  function renderBattleSlot(p, active) {
    const pct = Math.max(0, Math.round((p.currentHp / p.maxHp) * 100));
    const previousPct = Number.isFinite(p.renderedHpPct) ? p.renderedHpPct : pct;
    p.renderedHpPct = pct;
    const hpState = pct <= 25 ? "danger" : pct <= 50 ? "warn" : "ok";
    return `<div class="battle-slot ${active ? "active" : ""} ${p.currentHp <= 0 ? "fainted" : ""}" data-battle-mon="${p.name}">
      <strong>${p.name} <small>Lv.${p.level}</small></strong>
      <div class="hp-bar ${hpState}" aria-label="HP"><span data-hp-target="${pct}" style="width:${previousPct}%"></span></div>
      <small>${Math.max(0, p.currentHp)}/${p.maxHp}</small>
      <img class="pokemon-anim" src="${animated(p)}" alt="${p.name}" onerror="this.src='${sprite(p)}'">
    </div>`;
  }

  function animateRenderedHpBars() {
    requestAnimationFrame(() => {
      document.querySelectorAll(".battle-slot .hp-bar span[data-hp-target]").forEach((bar) => {
        bar.style.width = `${bar.dataset.hpTarget}%`;
      });
    });
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

  function calcDamage(attacker, defender, power, type) {
    const base = ((atkVal(attacker) * power) / Math.max(20, defVal(defender))) * (0.86 + Math.random() * 0.24) * 28;
    const stab = attacker.types.includes(type) ? 1.25 : 1;
    const eff = effectiveness(type, defender.types);
    const critChance = hasItem("crit") || attacker.heldItem?.kind === "crit" ? 0.24 : 0.08;
    const crit = Math.random() < critChance ? 1.65 : 1;
    const orb = hasStatItem(attacker, "damage") ? 1.16 : 1;
    return { amount: Math.max(1, Math.round(base * stab * eff * crit * orb)), eff, crit: crit > 1 };
  }

  function chooseAutoMove(attacker, defender) {
    const moves = attacker.moves?.length ? attacker.moves : legalMovesFor(attacker);
    const usable = moves.filter((move) => (move.cost || 0) <= attacker.energy);
    const pool = usable.length ? usable : [moves[0]];
    return pool
      .map((move) => ({ move, score: (move.power || 1) * effectiveness(move.type || attacker.types[0], defender.types) }))
      .sort((a, b) => b.score - a.score)[0].move;
  }

  async function runAutoBattle() {
    if (state.autoBattling) return;
    state.autoBattling = true;
    const button = document.querySelector("[data-auto-battle]");
    if (button) button.disabled = true;
    const actionDelay = 1350;
    const faintDelay = 1500;
    const hpDrainDelay = 920;
    let guard = 0;
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
          e.currentHp -= hit.amount;
          applyMoveEffect(pMove, p, e, hit.amount);
          p.energy = Math.min(4, p.energy + 1);
          if (p.heldItem?.kind === "heal" || hasItem("heal")) p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.08));
          const enemyStatus = tickStatus(e);
          $("battle-log").textContent = `${p.name} usou ${pMove.name}: ${hit.amount} dano${hit.crit ? " crítico" : ""}${hit.eff > 1 ? " super efetivo" : hit.eff < 1 ? " resistido" : ""}.${enemyStatus}`;
          renderBattle();
          animateBattleAction("player-card", p.name, "enemy-card", e.name, hit.amount, hit.crit, hit.eff, pType, pMove);
          await wait(actionDelay);
          if (e.currentHp <= 0) {
            handleEnemyFaint(`${p.name} derrubou ${e.name}.`);
            if (!state.battle) {
              state.autoBattling = false;
              return;
            }
            await wait(faintDelay);
          }
        } else {
          const eMove = chooseAutoMove(e, p);
          const eType = eMove.type || e.types[0];
          const eHit = calcDamage(e, p, state.battle.boss ? (eMove.power || 1) * 1.06 : eMove.power || 1, eType);
          p.currentHp -= eHit.amount;
          applyMoveEffect(eMove, e, p, eHit.amount);
          const playerStatus = tickStatus(p);
          $("battle-log").textContent = `${e.name} usou ${eMove.name || e.trait}: ${eHit.amount} dano${eHit.crit ? " crítico" : ""}${eHit.eff > 1 ? " super efetivo" : eHit.eff < 1 ? " resistido" : ""}.${playerStatus}`;
          if (p.currentHp <= 0 && (p.heldItem?.kind === "sash" || hasItem("sash")) && !state.sashUsed) {
            p.currentHp = 1;
            state.sashUsed = true;
          }
          renderBattle();
          animateBattleAction("enemy-card", e.name, "player-card", p.name, eHit.amount, eHit.crit, eHit.eff, eType, eMove);
          await wait(actionDelay);
          applyNuzlockeLosses();
          if (!activePlayer()) {
            state.autoBattling = false;
            await wait(hpDrainDelay);
            endRun(false);
            return;
          }
          renderBattle();
        }
      }
    }
    renderBattle();
    state.autoBattling = false;
    save();
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function moveEffectClass(type) {
    return `move-${String(type || "normal").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "normal"}`;
  }

  function moveIdClass(move) {
    return `move-id-${String(move?.id || "basic").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "basic"}`;
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
      window.setTimeout(() => attacker.classList.remove("is-attacking"), 680);
    }
    animateMoveEffect(attacker, target, type, move, crit);
    animateHit(targetId, targetName, amount, crit, eff);
  }

  function animateMoveEffect(attacker, target, type, move = null, crit = false) {
    const battleGrid = document.querySelector(".battle-grid");
    if (!battleGrid || !attacker || !target) return;
    const gridRect = battleGrid.getBoundingClientRect();
    const fromRect = attacker.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();
    const fromX = fromRect.left + fromRect.width / 2 - gridRect.left;
    const fromY = fromRect.top + fromRect.height * 0.62 - gridRect.top;
    const toX = toRect.left + toRect.width / 2 - gridRect.left;
    const toY = toRect.top + toRect.height * 0.58 - gridRect.top;
    const effect = document.createElement("span");
    effect.className = `move-effect ${moveEffectClass(type)} ${moveIdClass(move)} ${crit ? "is-critical" : ""}`;
    effect.style.setProperty("--from-x", `${fromX}px`);
    effect.style.setProperty("--from-y", `${fromY}px`);
    effect.style.setProperty("--to-x", `${toX}px`);
    effect.style.setProperty("--to-y", `${toY}px`);
    for (let i = 0; i < 3; i += 1) {
      const particle = document.createElement("i");
      particle.style.setProperty("--particle", i);
      effect.appendChild(particle);
    }
    battleGrid.appendChild(effect);
    window.setTimeout(() => effect.remove(), 760);
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
    if (el.classList.contains("fainted")) {
      el.classList.add("is-fainting");
      playBattleSfx("faint");
    }
    const damage = document.createElement("span");
    damage.className = `damage-pop ${crit ? "critical" : ""} ${eff > 1 ? "effective" : eff < 1 ? "resisted" : ""}`;
    damage.textContent = `${crit ? "Crit! " : ""}-${amount}`;
    el.appendChild(damage);
    window.setTimeout(() => damage.remove(), 1050);
    if (crit) window.setTimeout(() => el.classList.remove("is-critical-hit"), 620);
  }

  function applyMoveEffect(move, attacker, defender, damage) {
    if (move.drain) attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + Math.ceil(damage * move.drain));
    if (move.teamHeal) {
      state.team.forEach((p) => {
        if (p.currentHp > 0) p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * move.teamHeal));
      });
    }
    if (move.extra && Math.random() < move.extra) defender.currentHp -= Math.ceil(damage * 0.45);
    if (move.execute && defender.currentHp > 0 && defender.currentHp / defender.maxHp <= move.execute) defender.currentHp = 0;
    if (move.burn) defender.burn = 2;
  }

  function tickStatus(p) {
    if (!p?.burn) return "";
    const burnDamage = Math.ceil(p.maxHp * 0.06);
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
      log = `${p.name} atacou: ${hit.amount} dano${hit.eff > 1 ? " super efetivo" : hit.eff < 1 ? " resistido" : ""}.`;
    }
    if (hasItem("heal")) p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.08));
    if (e.currentHp <= 0) return handleEnemyFaint(log);
    enemyTurn(log);
  }

  function handleEnemyFaint(prefix) {
    const battle = state.battle;
    const reward = awardBattleXp(battle.enemy, battle.boss);
    const xpLog = ` +${reward.xp} XP${reward.levels ? `, ${reward.levels} nivel(is) ganho(s)` : ""}.`;
    if (!battle?.boss && !battle?.npc) return winBattle(`${prefix}${xpLog}`);
    battle.enemy.currentHp = 0;
    const nextIndex = battle.enemyTeam.findIndex((p, index) => index > battle.enemyIndex && p.currentHp > 0);
    if (nextIndex === -1) return winBattle(`${prefix} ${battle.enemy.name} caiu.${xpLog}`);
    battle.enemyIndex = nextIndex;
    battle.enemy = battle.enemyTeam[nextIndex];
    $("battle-title").textContent = `${battle.enemy.leader} enviou ${battle.enemy.name}`;
    $("battle-log").textContent = `${prefix}${xpLog} ${battle.enemy.leader} chamou ${battle.enemy.name}.`;
    renderBattle();
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
    if (p.currentHp <= 0 && hasItem("sash") && !state.sashUsed) {
      p.currentHp = 1;
      state.sashUsed = true;
      log += " A Faixa Foco segurou o golpe fatal.";
    }
    $("battle-log").textContent = `${log} ${e.name} respondeu com ${amount} dano.`;
    renderBattle();
    if (p.currentHp <= 0) {
      window.setTimeout(() => {
        applyNuzlockeLosses();
        if (!activePlayer()) return endRun(false);
        renderBattle();
        save();
      }, 1800);
      return;
    }
    if (e.currentHp <= 0) return handleEnemyFaint(log);
    save();
  }

  function winBattle(prefix) {
    const battleArena = ARENAS.find((arena) => arena.floorTo === state.floor);
    const boss = state.battle.boss || !!battleArena;
    const defeated = boss ? state.battle.enemyTeam[state.battle.enemyTeam.length - 1] : null;
    const earnedBadge = defeated?.badge && !state.badges.includes(defeated.badge) ? defeated.badge : null;
    let recoveryLog = "";
    state.team.forEach((p) => {
      if (p.currentHp > 0) {
        p.energy = Math.min(4, p.energy + 1);
        p.currentHp = boss ? p.maxHp : Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.18));
      } else if (boss && !state.nuzlockeMode) {
        p.currentHp = p.maxHp;
      }
    });
    recoveryLog = boss
      ? " O time foi totalmente recuperado."
      : " O time recuperou um pouco de HP.";
    state.threat = Math.min(3, state.threat + (boss ? 0 : 0.35));
    if (earnedBadge) state.badges.push(earnedBadge);
    if (boss && defeated?.badge) {
      const clearedArena = ARENAS.find((arena) => arena.badge === defeated.badge);
      const nextArena = ARENAS.find((arena) => arena.floorFrom === clearedArena?.floorTo);
      if (nextArena) {
        state.floor = nextArena.floorFrom;
      } else if (clearedArena) {
        state.floor = clearedArena.floorTo;
      }
    }
    state.battle = null;
    state.autoBattling = false;
    if (boss) state.branch = 0;
    if (state.floor >= RUN_FLOORS) return endRun(true);
    const evolution = state.pendingEvolutions?.shift();
    $("choice-kicker").textContent = boss ? (defeated?.badge ? "Líder derrotado" : "Liga vencida") : evolution ? "Evolução" : "Vitória";
    $("choice-title").textContent = boss ? `${defeated?.leader || "Líder"} derrotado` : evolution ? `${evolution.from.name} evoluiu` : "Rota liberada";
    $("choice-copy").textContent = boss && defeated
      ? defeated.badge
        ? `${prefix} ${defeated.leader} entregou a insígnia ${defeated.arena}. O mapa mudou para a próxima arena.${recoveryLog}`
        : `${prefix} ${defeated.leader} caiu na Liga ${defeated.arena}. A proxima sala foi aberta.${recoveryLog}`
      : evolution
        ? `${prefix} ${evolution.from.name} virou ${evolution.to.name}. O time ganhou experiência.${recoveryLog}`
        : `${prefix} O time ganhou experiência.${recoveryLog} Escolha quando avançar.`;
    $("choice-grid").innerHTML = `
      ${earnedBadge ? `<div class="badge-reward-card"><img src="${badgeSprite(earnedBadge)}" alt="Insignia ${earnedBadge}"><strong>Insignia ${defeated.arena}</strong><small>Conquistada de ${defeated.leader}</small></div>` : ""}
      ${renderEvolutionSummary(evolution)}
      <button class="choice-button" type="button" data-action="map"><strong>Continuar rota</strong><small>Voltar ao mapa e escolher o próximo andar.</small></button>
    `;
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

  async function showCatch() {
    const picks = (await recruitPoolExpanded(3)).map((p) => maybeMarkShiny(cloneMon(p, 4 + state.floor * 2)));
    registerDexSeenMany(picks);
    $("choice-kicker").textContent = "Recrutamento";
    $("choice-title").textContent = state.team.length >= 6 ? "Time completo" : "Um aliado pode entrar";
    $("choice-copy").textContent = state.team.length >= 6
      ? "Seu time já tem 6 Pokémon. Siga a rota sem recrutar agora."
      : "Tipos repetidos ativam sinergias, mas cobertura de tipo salva runs.";
    $("choice-grid").innerHTML = state.team.length >= 6
      ? `<button class="choice-button" type="button" data-action="map"><strong>Continuar rota</strong><small>Limite de 6 Pokémon atingido.</small></button>`
      : picks.map((p, i) => `
      <button class="choice-button pokemon-choice" type="button" data-catch="${i}">
        <img src="${animated(p)}" alt="" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>Lv.${p.level} · ${p.trait}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${p.trait}</span>
          ${statPreviewWithItem(p, null)}
          ${statBars(p)}
          <small>HP ${p.maxHp}/${p.maxHp} · Energia ${p.energy}</small>
        </span>
      </button>
    `).join("") || `<button class="choice-button" type="button" data-action="map"><strong>Continuar rota</strong><small>Nenhum Pokémon novo apareceu.</small></button>`;
    state.offer = picks;
    show("choice");
  }

  function showItem() {
    const picks = itemPool(3);
    $("choice-kicker").textContent = "Relíquia";
    $("choice-title").textContent = "Escolha uma melhoria";
    $("choice-copy").textContent = "Escolha um item e equipe em um Pokémon. Alguns efeitos também contam como relíquia da run.";
    $("choice-grid").innerHTML = picks.map((item, i) => `
      <button class="choice-button item-choice" type="button" data-item="${i}">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <strong>${item.name}</strong>
        <small>${item.text}</small>
        <span class="choice-hover-detail">
          <span>Relíquia</span>
          <small>${item.text}</small>
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
    $("choice-copy").textContent = "Escolha quem vai segurar o item ou guarde na bag para equipar depois.";
    $("choice-grid").innerHTML = state.team.map((p, i) => `
      <button class="choice-button pokemon-choice" type="button" data-equip="${i}">
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>${p.heldItem ? `Trocar ${p.heldItem.name}` : "Sem item equipado"}</small>
        ${renderTypeChips(p.types)}
        <span class="choice-hover-detail">
          <span>${p.heldItem ? `Atual: ${p.heldItem.name}` : "Livre"}</span>
          ${statBars(p)}
          <small>HP ${Math.max(0, p.currentHp)}/${p.maxHp} · Energia ${p.energy}</small>
        </span>
      </button>
    `).join("") + `
      <button class="choice-button item-choice" type="button" data-store-item="1">
        <img class="animated-item" src="${itemSprite(item)}" alt="${item.name}">
        <strong>Guardar na bag</strong>
        <small>Usar depois em outro Pokémon.</small>
      </button>
    `;
    show("choice");
  }

  function showReplaceItem(index) {
    const p = state.team[index];
    if (!p || !state.pendingItem) return renderMap();
    state.pendingEquipIndex = index;
    $("choice-kicker").textContent = "Item equipado";
    $("choice-title").textContent = p.name;
    $("choice-copy").textContent = `${p.name} já segura ${p.heldItem.name}. Trocar pelo item novo ou guardar na bag?`;
    $("choice-grid").innerHTML = `
      <button class="choice-button item-choice" type="button" data-confirm-equip="1">
        <img class="animated-item" src="${itemSprite(state.pendingItem)}" alt="${state.pendingItem.name}">
        <strong>Trocar item</strong>
        <small>${state.pendingItem.name} entra. ${p.heldItem.name} volta para a bag.</small>
      </button>
      <button class="choice-button item-choice" type="button" data-store-item="1">
        <img class="animated-item" src="${itemSprite(state.pendingItem)}" alt="${state.pendingItem.name}">
        <strong>Guardar novo</strong>
        <small>Mantem ${p.heldItem.name} em ${p.name}.</small>
      </button>
    `;
    show("choice");
  }

  function storePendingItem() {
    if (!state.pendingItem) return;
    state.items.push({ ...state.pendingItem });
    state.pendingItem = null;
    state.pendingEquipIndex = null;
    renderMap();
    save();
  }

  function equipPendingItem(index, replace = false) {
    const p = state.team[index];
    if (!p || !state.pendingItem) return;
    if (p.heldItem && !replace) return showReplaceItem(index);
    if (p.heldItem && replace) state.items.push({ ...p.heldItem });
    p.heldItem = { ...state.pendingItem };
    state.pendingItem = null;
    state.pendingEquipIndex = null;
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
    $("choice-copy").textContent = "Treino da nivel e energia, mas aumenta o risco das proximas batalhas.";
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
      { name: "Mercador estranho", text: "Recebe uma pedra de evolucao improvisada.", run: () => {
        const target = state.team.find((p) => EVOLUTIONS[p.id]);
        if (target) evolvePokemon(target);
      } },
      { name: "Chuva de faíscas", text: "Todos aprendem Ataque Rapido elemental.", run: () => {
        state.team.forEach((p) => {
          syncMoves(p);
        });
      } }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    event.run();
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
    const fallbackMoves = MOVES
      .filter((move) => !move.type || move.type === "Normal")
      .map((move) => ({ ...move, level: 1 }));
    const teamTypes = [...new Set(state.team.flatMap((p) => p.types || []))];
    const typedPool = teamTypes.flatMap((type) => [
      ...(TYPE_MOVES[type] || []),
      ...MOVES.filter((move) => move.type === type)
    ]);
    const uniqueTyped = [];
    typedPool.forEach((move) => {
      if (!uniqueTyped.some((entry) => entry.id === move.id)) uniqueTyped.push({ ...move });
    });
    let moves = uniqueTyped
      .filter((move) => state.team.some((p) => canLearnMove(p, move)))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    if (moves.length < 3) {
      const filler = fallbackMoves
        .filter((move) => state.team.some((p) => canLearnMove(p, move)) && !moves.some((entry) => entry.id === move.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - moves.length);
      moves = [...moves, ...filler];
    }
    state.offer = moves;
    $("choice-kicker").textContent = "Move Tutor";
    $("choice-title").textContent = "Desbloquear habilidade";
    $("choice-copy").textContent = "Escolha um move. Depois selecione um Pokémon para aprender. As batalhas automáticas passam a usar esse move.";
    $("choice-grid").innerHTML = moves.length ? moves.map((move, i) => `
      <button class="choice-button item-choice" type="button" data-move-learn="${i}">
        <img class="animated-item" src="${tmSprite(move)}" alt="${move.name}" onerror="this.src='${ITEM_BASE}tm-normal.png'">
        <strong>${move.name}</strong>
        <span class="move-cd-pill">CD ${moveCooldown(move)}</span>
        <small>${move.type || "Tipo do usuario"} · poder ${Math.round(move.power * 100)} · custo ${move.cost}</small>
      </button>
    `).join("") : `<button class="choice-button item-choice" type="button" data-action="map"><img class="animated-item" src="${ITEM_BASE}tm-normal.png" alt=""><strong>Continuar rota</strong><small>Nenhum move novo compatível agora.</small></button>`;
    show("choice");
  }

  function showMoveLearner(move) {
    state.pendingMove = move;
    const canAnyLearn = state.team.some((p) => canLearnMove(p, move));
    $("choice-kicker").textContent = "Aprender move";
    $("choice-title").textContent = move.name;
    $("choice-copy").textContent = canAnyLearn ? "Escolha quem aprende. Cada Pokémon pode carregar até 4 moves." : "Nenhum Pokémon do time pode aprender esse move agora.";
    $("choice-grid").innerHTML = state.team.map((p, i) => `
      <button class="choice-button" type="button" data-learn="${i}" ${canLearnMove(p, move) ? "" : "disabled"}>
        <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
        <strong>${p.name}</strong>
        <small>${canLearnMove(p, move) ? (p.moves || []).map((m) => m.name).join(", ") : "Tipo ou nivel incompativel"}</small>
      </button>
    `).join("") + (canAnyLearn ? "" : `
      <button class="choice-button" type="button" data-action="move-tutor"><strong>Escolher outro move</strong><small>Voltar para o tutor.</small></button>
      <button class="choice-button" type="button" data-action="map"><strong>Continuar rota</strong><small>Pular este tutor.</small></button>
    `);
    show("choice");
  }

  function showEvolutionStone() {
    const candidates = state.team.filter((p) => EVOLUTIONS[p.id]?.stone || EVOLUTIONS[p.id]);
    $("choice-kicker").textContent = "Pedra de evolucao";
    $("choice-title").textContent = "Forcar evolucao";
    $("choice-copy").textContent = candidates.length ? "Escolha um Pokémon compatível para evoluir agora." : "Nenhum Pokémon compatível no time. A pedra virou cura.";
    if (!candidates.length) {
      state.team.forEach((p) => p.currentHp = Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * 0.25)));
      $("choice-grid").innerHTML = `<button class="choice-button" type="button" data-action="map"><strong>Continuar</strong><small>Time curado parcialmente.</small></button>`;
    } else {
      $("choice-grid").innerHTML = state.team.map((p, i) => {
        const evo = EVOLUTIONS[p.id];
        return `<button class="choice-button" type="button" data-evolve="${i}" ${evo ? "" : "disabled"}>
          <img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'">
          <strong>${p.name}</strong>
          <small>${evo ? `Evoluir para ${evo.into.name}` : "Sem evolucao disponivel"}</small>
        </button>`;
      }).join("");
    }
    show("choice");
  }

  function evolvePokemon(p) {
    const evo = EVOLUTIONS[p.id];
    if (!evo) return false;
    const oldHpPct = p.maxHp ? p.currentHp / p.maxHp : 1;
    const from = JSON.parse(JSON.stringify(p));
    Object.assign(p, JSON.parse(JSON.stringify(evo.into)));
    p.level = p.level || 1;
    p.maxHp = hpMax(p);
    p.currentHp = Math.max(1, Math.ceil(p.maxHp * oldHpPct));
    p.energy = Math.min(4, (p.energy || 2) + 1);
    syncMoves(p);
    state.pendingEvolutions = state.pendingEvolutions || [];
    state.pendingEvolutions.push({ from, to: JSON.parse(JSON.stringify(p)) });
    return true;
  }

  function showEvolutionPopup(entry) {
    if (!entry) return renderMap();
    const hasNext = (state.pendingEvolutions?.length || 0) > 0;
    $("choice-kicker").textContent = "Evolução";
    $("choice-title").textContent = `${entry.from.name} evoluiu`;
    $("choice-copy").textContent = `${entry.from.name} virou ${entry.to.name}. Novos atributos e golpes foram atualizados pelo nivel.`;
    $("choice-grid").innerHTML = `
      ${renderEvolutionSummary(entry)}
      <button class="choice-button" type="button" data-action="next-evolution"><strong>${hasNext ? "Próxima evolução" : "Continuar rota"}</strong><small>${hasNext ? "Ver a próxima evolução pendente." : "Voltar ao mapa."}</small></button>
    `;
    playBattleSfx("evolution");
    show("choice");
    document.querySelector(".rogue-stage")?.classList.add("has-victory-modal", "has-evolution-modal");
    save();
  }

  function maybeAutoEvolve(p) {
    const evo = EVOLUTIONS[p.id];
    if (!evo?.level || p.level < evo.level) return false;
    return evolvePokemon(p);
  }

  function addPokemon(mon) {
    if (!mon || state.team.length >= 6 || state.team.some((p) => p.id === mon.id || p.name === mon.name)) return renderMap();
    registerDexSeen(mon);
    mon.runId ||= uid("mon");
    state.team.push(mon);
    const evolved = maybeAutoEvolve(mon);
    if (evolved) return showEvolutionPopup(state.pendingEvolutions?.shift());
    renderMap();
    save();
  }

  function endRun(won) {
    document.querySelector(".end-panel")?.classList.toggle("is-win", won);
    document.querySelector(".end-panel")?.classList.toggle("is-loss", !won);
    $("end-kicker").textContent = won ? "Campeao da torre" : "Expedicao encerrada";
    $("end-title").textContent = won ? "Você venceu" : "Run perdida";
    $("end-copy").textContent = won
      ? "Seu time atravessou os oito ginásios e derrotou Giovanni. A Liga agora pode virar a próxima camada."
      : "O time caiu. Ajuste sinergias, preserve energia e respeite matchups de tipo na próxima tentativa.";
    const finalTeam = won ? state.team : [...(state.fallenTeam || []), ...state.team];
    $("end-team").innerHTML = finalTeam.map((p) => `<div class="team-row ${p.currentHp <= 0 ? "fainted" : ""}"><img src="${animated(p)}" alt="${p.name}" onerror="this.src='${mini(p)}'"><div><strong>${p.name}</strong><small>Lv.${p.level}</small></div></div>`).join("");
    clearSave();
    show("end");
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.id === "start-run" || button.id === "restart-run") newRun();
    if (button.id === "route-dex-open") setRogueDexOpen(true);
    if (button.id === "rogue-dex-close") setRogueDexOpen(false);
    if (button.dataset.dexTab) setRogueDexTab(button.dataset.dexTab);
    if (button.dataset.dexMon) showDexDetail(Number(button.dataset.dexMon));
    if (button.dataset.dexDetailClose) hideDexDetail();
    if (button.id === "continue-run") {
      if (savedRunMode() !== selectedRunMode()) return updateContinueRunButton();
      if (!load()) return updateContinueRunButton();
      if (!state.map.length) buildMap();
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      state.battle ? (renderBattle(), show("battle")) : renderMap();
    }
    if (button.dataset.starter) chooseStarter(Number(button.dataset.starter));
    if (button.dataset.floor) enterNode(Number(button.dataset.floor), Number(button.dataset.branch));
    if (button.dataset.autoBattle) runAutoBattle();
    if (button.dataset.move) playerMove(button.dataset.move);
    if (button.dataset.action === "map") {
      if (state.screen === "battle" && state.battle && !state.battle.boss) state.battle = null;
      renderMap();
    }
    if (button.dataset.action === "next-evolution") {
      const evolution = state.pendingEvolutions?.shift();
      if (evolution) return showEvolutionPopup(evolution);
      renderMap();
      save();
    }
    if (button.dataset.action === "move-tutor") showMoveTutor();
    if (button.dataset.catch) addPokemon(state.offer[Number(button.dataset.catch)]);
    if (button.dataset.item) {
      showEquipItem({ ...state.offer[Number(button.dataset.item)] });
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
      const p = state.team[Number(button.dataset.learn)];
      if (p && state.pendingMove && canLearnMove(p, state.pendingMove)) {
        p.moves = p.moves || legalMovesFor(p);
        const move = { ...state.pendingMove, type: state.pendingMove.type || p.types[0] };
        if (p.moves.length >= 4) p.moves.shift();
        if (!p.moves.some((entry) => entry.id === move.id)) p.moves.push(move);
        state.pendingMove = null;
      }
      renderMap();
      save();
    }
    if (button.dataset.evolve) {
      const p = state.team[Number(button.dataset.evolve)];
      if (p) evolvePokemon(p);
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
      enemyTurn(`${chosen.name} entrou em campo.`);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target?.id === "rogue-dex-detail-backdrop") hideDexDetail();
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
  void loadNationalDexIndex();
  renderDexBadge();
  renderHud();
})();
