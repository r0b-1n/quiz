// Quiz Data
(function () {
  "use strict";

  // ── Shuffle utility ──────────────────────────────────────────────
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Normalize utility (exposed globally) ─────────────────────────
  window.normalize = function (str) {
    return String(str)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  // ── Levenshtein distance (exposed globally) ──────────────────────
  window.levenshtein = function (a, b) {
    const m = a.length, n = b.length;
    const dp = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
      for (let j = 1; j <= n; j++) {
        dp[i][j] = i === 0 ? j :
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  };

  // ════════════════════════════════════════════════════════════════
  // CLASSIC MODE DATA
  // ════════════════════════════════════════════════════════════════

  const imageGuessQuestions = [
    {
      id: "ig1", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/400px-Cat03.jpg",
      question: "What animal is this?",
      answers: ["cat"],
    },
    {
      id: "ig2", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/400px-Cute_dog.jpg",
      question: "What animal is this?",
      answers: ["dog"],
    },
    {
      id: "ig3", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/400px-Camponotus_flavomarginatus_ant.jpg",
      question: "What insect is this?",
      answers: ["ant"],
    },
    {
      id: "ig4", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      question: "What famous painting is this?",
      answers: ["mona lisa", "monalisa", "la joconde"],
    },
    {
      id: "ig5", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/400px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
      question: "What mountain is this?",
      answers: ["everest", "mount everest", "mt everest"],
    },
    {
      id: "ig6", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
      question: "What objects are shown?",
      answers: ["dice", "die"],
    },
    {
      id: "ig7", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/400px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
      question: "What category does this display represent?",
      answers: ["food", "fruit", "healthy food", "vegetables"],
    },
    {
      id: "ig8", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
      question: "What famous building is this?",
      answers: ["empire state building", "empire state"],
    },
  ];

  const fourImagesQuestions = [
    {
      id: "fi1", type: "four_images",
      images: ["https://picsum.photos/seed/sky/200/200","https://picsum.photos/seed/ocean/200/200","https://picsum.photos/seed/blueberry/200/200","https://picsum.photos/seed/jeans/200/200"],
      word: "BLUE", hint: "_ _ _ _", clue: "Sky, ocean, berry, denim — they all share this colour",
    },
    {
      id: "fi2", type: "four_images",
      images: ["https://picsum.photos/seed/campfire/200/200","https://picsum.photos/seed/flame/200/200","https://picsum.photos/seed/torch/200/200","https://picsum.photos/seed/fireplace/200/200"],
      word: "FIRE", hint: "_ _ _ _", clue: "Heat, light, and burning — what element connects these?",
    },
    {
      id: "fi3", type: "four_images",
      images: ["https://picsum.photos/seed/oak/200/200","https://picsum.photos/seed/pine/200/200","https://picsum.photos/seed/maple/200/200","https://picsum.photos/seed/forest/200/200"],
      word: "TREE", hint: "_ _ _ _", clue: "Oak, pine, maple, forest — what are they all types of?",
    },
    {
      id: "fi4", type: "four_images",
      images: ["https://picsum.photos/seed/goldbar/200/200","https://picsum.photos/seed/trophy/200/200","https://picsum.photos/seed/coin/200/200","https://picsum.photos/seed/sunrise/200/200"],
      word: "GOLD", hint: "_ _ _ _", clue: "Bars, trophies, coins, sunrise — this precious metal connects them",
    },
    {
      id: "fi5", type: "four_images",
      images: ["https://picsum.photos/seed/wedding/200/200","https://picsum.photos/seed/ringbox/200/200","https://picsum.photos/seed/saturn/200/200","https://picsum.photos/seed/boxing/200/200"],
      word: "RING", hint: "_ _ _ _", clue: "Wedding, jewellery, Saturn, boxing — what shape connects these?",
    },
    {
      id: "fi6", type: "four_images",
      images: ["https://picsum.photos/seed/snow/200/200","https://picsum.photos/seed/iceberg/200/200","https://picsum.photos/seed/cloud/200/200","https://picsum.photos/seed/polar/200/200"],
      word: "WHITE", hint: "_ _ _ _ _", clue: "Snow, iceberg, cloud, polar bear — what colour do they share?",
    },
    {
      id: "fi7", type: "four_images",
      images: ["https://picsum.photos/seed/library/200/200","https://picsum.photos/seed/novel/200/200","https://picsum.photos/seed/reading/200/200","https://picsum.photos/seed/bookshelf/200/200"],
      word: "BOOK", hint: "_ _ _ _", clue: "Library, novel, reading, shelf — what object links them?",
    },
  ];

  const multipleChoiceQuestions = [
    { id: "mc1",  type: "multiple_choice", question: "What is the capital of France?",                         answers: ["London","Paris","Berlin","Madrid"],         correct: 1 },
    { id: "mc2",  type: "multiple_choice", question: "How many sides does a hexagon have?",                    answers: ["5","6","7","8"],                            correct: 1 },
    { id: "mc3",  type: "multiple_choice", question: "Which planet is known as the Red Planet?",               answers: ["Venus","Jupiter","Mars","Saturn"],          correct: 2 },
    { id: "mc4",  type: "multiple_choice", question: "What is the chemical symbol for water?",                 answers: ["CO₂","O₂","H₂O","NaCl"],                   correct: 2 },
    { id: "mc5",  type: "multiple_choice", question: "Who painted the Sistine Chapel ceiling?",                answers: ["Leonardo da Vinci","Raphael","Michelangelo","Donatello"], correct: 2 },
    { id: "mc6",  type: "multiple_choice", question: "What is the largest ocean on Earth?",                    answers: ["Atlantic","Indian","Arctic","Pacific"],      correct: 3 },
    { id: "mc7",  type: "multiple_choice", question: "In what year did World War II end?",                     answers: ["1943","1944","1945","1946"],                 correct: 2 },
    { id: "mc8",  type: "multiple_choice", question: "How many bones are in the adult human body?",            answers: ["196","206","216","226"],                    correct: 1 },
    { id: "mc9",  type: "multiple_choice", question: "What is the speed of light (approx) in km/s?",          answers: ["150,000","200,000","300,000","400,000"],    correct: 2 },
    { id: "mc10", type: "multiple_choice", question: "Which element has the atomic number 1?",                 answers: ["Helium","Oxygen","Carbon","Hydrogen"],      correct: 3 },
    { id: "mc11", type: "multiple_choice", question: "What is the longest river in the world?",                answers: ["Amazon","Yangtze","Nile","Mississippi"],    correct: 2 },
    { id: "mc12", type: "multiple_choice", question: "Which programming language was created by Guido van Rossum?", answers: ["Java","Ruby","Python","Perl"],         correct: 2 },
  ];

  const speedModeQuestions = [
    ...multipleChoiceQuestions.slice(0, 5),
    ...imageGuessQuestions.slice(0, 4),
    ...fourImagesQuestions.slice(0, 3),
    ...multipleChoiceQuestions.slice(5, 10),
    ...imageGuessQuestions.slice(4),
    ...fourImagesQuestions.slice(3),
  ];

  // ════════════════════════════════════════════════════════════════
  // US STATES DATA
  // ════════════════════════════════════════════════════════════════

  const US_STATES = [
    { name: "Alabama",        abbr: "AL", capital: "Montgomery"   },
    { name: "Alaska",         abbr: "AK", capital: "Juneau"       },
    { name: "Arizona",        abbr: "AZ", capital: "Phoenix"      },
    { name: "Arkansas",       abbr: "AR", capital: "Little Rock"  },
    { name: "California",     abbr: "CA", capital: "Sacramento"   },
    { name: "Colorado",       abbr: "CO", capital: "Denver"       },
    { name: "Connecticut",    abbr: "CT", capital: "Hartford"     },
    { name: "Delaware",       abbr: "DE", capital: "Dover"        },
    { name: "Florida",        abbr: "FL", capital: "Tallahassee"  },
    { name: "Georgia",        abbr: "GA", capital: "Atlanta"      },
    { name: "Hawaii",         abbr: "HI", capital: "Honolulu"     },
    { name: "Idaho",          abbr: "ID", capital: "Boise"        },
    { name: "Illinois",       abbr: "IL", capital: "Springfield"  },
    { name: "Indiana",        abbr: "IN", capital: "Indianapolis" },
    { name: "Iowa",           abbr: "IA", capital: "Des Moines"   },
    { name: "Kansas",         abbr: "KS", capital: "Topeka"       },
    { name: "Kentucky",       abbr: "KY", capital: "Frankfort"    },
    { name: "Louisiana",      abbr: "LA", capital: "Baton Rouge"  },
    { name: "Maine",          abbr: "ME", capital: "Augusta"      },
    { name: "Maryland",       abbr: "MD", capital: "Annapolis"    },
    { name: "Massachusetts",  abbr: "MA", capital: "Boston"       },
    { name: "Michigan",       abbr: "MI", capital: "Lansing"      },
    { name: "Minnesota",      abbr: "MN", capital: "Saint Paul"   },
    { name: "Mississippi",    abbr: "MS", capital: "Jackson"      },
    { name: "Missouri",       abbr: "MO", capital: "Jefferson City"},
    { name: "Montana",        abbr: "MT", capital: "Helena"       },
    { name: "Nebraska",       abbr: "NE", capital: "Lincoln"      },
    { name: "Nevada",         abbr: "NV", capital: "Carson City"  },
    { name: "New Hampshire",  abbr: "NH", capital: "Concord"      },
    { name: "New Jersey",     abbr: "NJ", capital: "Trenton"      },
    { name: "New Mexico",     abbr: "NM", capital: "Santa Fe"     },
    { name: "New York",       abbr: "NY", capital: "Albany"       },
    { name: "North Carolina", abbr: "NC", capital: "Raleigh"      },
    { name: "North Dakota",   abbr: "ND", capital: "Bismarck"     },
    { name: "Ohio",           abbr: "OH", capital: "Columbus"     },
    { name: "Oklahoma",       abbr: "OK", capital: "Oklahoma City"},
    { name: "Oregon",         abbr: "OR", capital: "Salem"        },
    { name: "Pennsylvania",   abbr: "PA", capital: "Harrisburg"   },
    { name: "Rhode Island",   abbr: "RI", capital: "Providence"   },
    { name: "South Carolina", abbr: "SC", capital: "Columbia"     },
    { name: "South Dakota",   abbr: "SD", capital: "Pierre"       },
    { name: "Tennessee",      abbr: "TN", capital: "Nashville"    },
    { name: "Texas",          abbr: "TX", capital: "Austin"       },
    { name: "Utah",           abbr: "UT", capital: "Salt Lake City"},
    { name: "Vermont",        abbr: "VT", capital: "Montpelier"   },
    { name: "Virginia",       abbr: "VA", capital: "Richmond"     },
    { name: "Washington",     abbr: "WA", capital: "Olympia"      },
    { name: "West Virginia",  abbr: "WV", capital: "Charleston"   },
    { name: "Wisconsin",      abbr: "WI", capital: "Madison"      },
    { name: "Wyoming",        abbr: "WY", capital: "Cheyenne"     },
  ];

  function buildUsStatesQuestions() {
    const questions = [];

    US_STATES.forEach(function (state, idx) {
      // Q type 1: abbreviation -> state name
      const wrongStates1 = shuffle(US_STATES.filter(function (s) { return s.abbr !== state.abbr; })).slice(0, 3);
      const ans1 = shuffle([state.name, wrongStates1[0].name, wrongStates1[1].name, wrongStates1[2].name]);
      questions.push({
        id: "us_abbr_" + idx,
        type: "multiple_choice",
        question: 'Which US state has the abbreviation "' + state.abbr + '"?',
        answers: ans1,
        correct: ans1.indexOf(state.name),
      });

      // Q type 2: capital -> state name
      const wrongStates2 = shuffle(US_STATES.filter(function (s) { return s.name !== state.name; })).slice(0, 3);
      const ans2 = shuffle([state.name, wrongStates2[0].name, wrongStates2[1].name, wrongStates2[2].name]);
      questions.push({
        id: "us_cap_" + idx,
        type: "multiple_choice",
        question: "\"" + state.capital + "\" is the capital of which US state?",
        answers: ans2,
        correct: ans2.indexOf(state.name),
      });
    });

    return shuffle(questions);
  }

  // ════════════════════════════════════════════════════════════════
  // COMPANY LOGOS DATA
  // ════════════════════════════════════════════════════════════════

  const COMPANIES = [
    { name: "Apple",        domain: "apple.com"       },
    { name: "Google",       domain: "google.com"      },
    { name: "Nike",         domain: "nike.com"        },
    { name: "McDonald's",   domain: "mcdonalds.com"   },
    { name: "Microsoft",    domain: "microsoft.com"   },
    { name: "Amazon",       domain: "amazon.com"      },
    { name: "Tesla",        domain: "tesla.com"       },
    { name: "Coca-Cola",    domain: "coca-cola.com"   },
    { name: "Meta",         domain: "meta.com"        },
    { name: "Netflix",      domain: "netflix.com"     },
    { name: "Spotify",      domain: "spotify.com"     },
    { name: "Airbnb",       domain: "airbnb.com"      },
    { name: "Uber",         domain: "uber.com"        },
    { name: "YouTube",      domain: "youtube.com"     },
    { name: "LinkedIn",     domain: "linkedin.com"    },
    { name: "Snapchat",     domain: "snapchat.com"    },
    { name: "Samsung",      domain: "samsung.com"     },
    { name: "Toyota",       domain: "toyota.com"      },
    { name: "BMW",          domain: "bmw.com"         },
    { name: "Mercedes-Benz",domain: "mercedes-benz.com"},
    { name: "Adidas",       domain: "adidas.com"      },
    { name: "Pepsi",        domain: "pepsi.com"       },
    { name: "Starbucks",    domain: "starbucks.com"   },
    { name: "PayPal",       domain: "paypal.com"      },
    { name: "Visa",         domain: "visa.com"        },
    { name: "Intel",        domain: "intel.com"       },
    { name: "Adobe",        domain: "adobe.com"       },
    { name: "Twitter",      domain: "twitter.com"     },
    { name: "Mastercard",   domain: "mastercard.com"  },
    { name: "IKEA",         domain: "ikea.com"        },
  ];

  function buildCompanyLogosQuestions() {
    return shuffle(COMPANIES).map(function (company, idx) {
      const wrong = shuffle(COMPANIES.filter(function (c) { return c.name !== company.name; })).slice(0, 3);
      const answers = shuffle([company.name, wrong[0].name, wrong[1].name, wrong[2].name]);
      return {
        id: "logo_" + idx,
        type: "image_mc",
        imageStyle: "logo",
        image: "https://logo.clearbit.com/" + company.domain,
        question: "Which company does this logo belong to?",
        answers: answers,
        correct: answers.indexOf(company.name),
      };
    });
  }

  // ════════════════════════════════════════════════════════════════
  // EUROPEAN FOOTBALL CLUBS
  // ════════════════════════════════════════════════════════════════

  const FOOTBALL_CLUBS = [
    // Premier League
    { name: "Manchester United", league: "Premier League", image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/150px-Manchester_United_FC_crest.svg.png" },
    { name: "Manchester City",   league: "Premier League", image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/150px-Manchester_City_FC_badge.svg.png" },
    { name: "Liverpool",         league: "Premier League", image: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/150px-Liverpool_FC.svg.png" },
    { name: "Arsenal",           league: "Premier League", image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/150px-Arsenal_FC.svg.png" },
    { name: "Chelsea",           league: "Premier League", image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/150px-Chelsea_FC.svg.png" },
    { name: "Tottenham Hotspur", league: "Premier League", image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/150px-Tottenham_Hotspur.svg.png" },
    // La Liga
    { name: "Real Madrid",       league: "La Liga",        image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/150px-Real_Madrid_CF.svg.png" },
    { name: "FC Barcelona",      league: "La Liga",        image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/150px-FC_Barcelona_%28crest%29.svg.png" },
    { name: "Atletico Madrid",   league: "La Liga",        image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_2017_logo.svg/150px-Atletico_Madrid_2017_logo.svg.png" },
    { name: "Sevilla FC",        league: "La Liga",        image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Sevilla_FC_logo.svg/150px-Sevilla_FC_logo.svg.png" },
    // Bundesliga
    { name: "Bayern Munich",     league: "Bundesliga",     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg/150px-FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg.png" },
    { name: "Borussia Dortmund", league: "Bundesliga",     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/150px-Borussia_Dortmund_logo.svg.png" },
    { name: "RB Leipzig",        league: "Bundesliga",     image: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/150px-RB_Leipzig_2014_logo.svg.png" },
    { name: "Bayer Leverkusen",  league: "Bundesliga",     image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/150px-Bayer_04_Leverkusen_logo.svg.png" },
    // Serie A
    { name: "Juventus",          league: "Serie A",        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Juventus_FC_2017_icon_%28black%29.svg/150px-Juventus_FC_2017_icon_%28black%29.svg.png" },
    { name: "AC Milan",          league: "Serie A",        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/150px-Logo_of_AC_Milan.svg.png" },
    { name: "Inter Milan",       league: "Serie A",        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/150px-FC_Internazionale_Milano_2021.svg.png" },
    { name: "AS Roma",           league: "Serie A",        image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/150px-AS_Roma_logo_%282017%29.svg.png" },
    { name: "SSC Napoli",        league: "Serie A",        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SSC_Napoli_2007.svg/150px-SSC_Napoli_2007.svg.png" },
    // Ligue 1
    { name: "Paris Saint-Germain", league: "Ligue 1",      image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/150px-Paris_Saint-Germain_F.C..svg.png" },
    { name: "Olympique de Marseille", league: "Ligue 1",   image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Olympique_Marseille_logo.svg/150px-Olympique_Marseille_logo.svg.png" },
    { name: "Olympique Lyonnais", league: "Ligue 1",       image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Olympique_Lyonnais_%28emblem%29.svg/150px-Olympique_Lyonnais_%28emblem%29.svg.png" },
  ];

  function buildFootballQuestions() {
    return shuffle(FOOTBALL_CLUBS).map(function (club, idx) {
      const wrong = shuffle(FOOTBALL_CLUBS.filter(function (c) { return c.name !== club.name; })).slice(0, 3);
      const answers = shuffle([club.name, wrong[0].name, wrong[1].name, wrong[2].name]);
      return {
        id: "football_" + idx,
        type: "image_mc",
        imageStyle: "logo",
        image: club.image,
        question: "Which football club does this crest belong to?",
        tag: club.league,
        answers: answers,
        correct: answers.indexOf(club.name),
      };
    });
  }

  // ════════════════════════════════════════════════════════════════
  // NBA TEAMS
  // ════════════════════════════════════════════════════════════════

  const NBA_TEAMS = [
    { name: "Atlanta Hawks",          abbr: "atl" },
    { name: "Boston Celtics",         abbr: "bos" },
    { name: "Brooklyn Nets",          abbr: "bkn" },
    { name: "Charlotte Hornets",      abbr: "cha" },
    { name: "Chicago Bulls",          abbr: "chi" },
    { name: "Cleveland Cavaliers",    abbr: "cle" },
    { name: "Dallas Mavericks",       abbr: "dal" },
    { name: "Denver Nuggets",         abbr: "den" },
    { name: "Detroit Pistons",        abbr: "det" },
    { name: "Golden State Warriors",  abbr: "gs"  },
    { name: "Houston Rockets",        abbr: "hou" },
    { name: "Indiana Pacers",         abbr: "ind" },
    { name: "LA Clippers",            abbr: "lac" },
    { name: "Los Angeles Lakers",     abbr: "lal" },
    { name: "Memphis Grizzlies",      abbr: "mem" },
    { name: "Miami Heat",             abbr: "mia" },
    { name: "Milwaukee Bucks",        abbr: "mil" },
    { name: "Minnesota Timberwolves", abbr: "min" },
    { name: "New Orleans Pelicans",   abbr: "no"  },
    { name: "New York Knicks",        abbr: "ny"  },
    { name: "Oklahoma City Thunder",  abbr: "okc" },
    { name: "Orlando Magic",          abbr: "orl" },
    { name: "Philadelphia 76ers",     abbr: "phi" },
    { name: "Phoenix Suns",           abbr: "phx" },
    { name: "Portland Trail Blazers", abbr: "por" },
    { name: "Sacramento Kings",       abbr: "sac" },
    { name: "San Antonio Spurs",      abbr: "sa"  },
    { name: "Toronto Raptors",        abbr: "tor" },
    { name: "Utah Jazz",              abbr: "utah"},
    { name: "Washington Wizards",     abbr: "wsh" },
  ];

  function buildNBAQuestions() {
    return shuffle(NBA_TEAMS).map(function (team, idx) {
      const wrong = shuffle(NBA_TEAMS.filter(function (t) { return t.abbr !== team.abbr; })).slice(0, 3);
      const answers = shuffle([team.name, wrong[0].name, wrong[1].name, wrong[2].name]);
      return {
        id: "nba_" + idx,
        type: "image_mc",
        imageStyle: "logo",
        image: "https://a.espncdn.com/i/teamlogos/nba/500/" + team.abbr + ".png",
        question: "Which NBA team does this logo belong to?",
        answers: answers,
        correct: answers.indexOf(team.name),
      };
    });
  }

  // ════════════════════════════════════════════════════════════════
  // COUNTRIES API
  // ════════════════════════════════════════════════════════════════

  const COUNTRIES_API = "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,cca2";
  const COUNTRIES_CACHE_KEY = "quizmaster_countries_cache";

  async function fetchCountriesData() {
    try {
      const cached = sessionStorage.getItem(COUNTRIES_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) { /* ignore */ }

    var response = await fetch(COUNTRIES_API);
    if (!response.ok) throw new Error("Failed to fetch countries: " + response.status);
    var raw = await response.json();

    var countries = raw.filter(function (c) {
      return c.name && c.name.common &&
             c.flags && c.flags.png &&
             c.capital && c.capital.length > 0;
    }).map(function (c) {
      return {
        name: c.name.common,
        capital: c.capital[0],
        flag: c.flags.png,
        region: c.region,
        cca2: c.cca2,
      };
    });

    try {
      sessionStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(countries));
    } catch (e) { /* quota exceeded - ignore */ }

    return countries;
  }

  function buildCapitalsQuestions(countries) {
    var shuffled = shuffle(countries).slice(0, 60);
    return shuffled.map(function (country, idx) {
      var wrong = shuffle(countries.filter(function (c) { return c.name !== country.name; })).slice(0, 3);
      var answers = shuffle([country.capital, wrong[0].capital, wrong[1].capital, wrong[2].capital]);
      return {
        id: "cap_" + idx,
        type: "multiple_choice",
        question: "What is the capital of " + country.name + "?",
        answers: answers,
        correct: answers.indexOf(country.capital),
      };
    });
  }

  function buildFlagsQuestions(countries) {
    var shuffled = shuffle(countries).slice(0, 100);
    return shuffled.map(function (country, idx) {
      var wrong = shuffle(countries.filter(function (c) { return c.name !== country.name; })).slice(0, 3);
      var answers = shuffle([country.name, wrong[0].name, wrong[1].name, wrong[2].name]);
      return {
        id: "flag_" + idx,
        type: "image_mc",
        imageStyle: "flag",
        image: country.flag,
        question: "Which country does this flag belong to?",
        answers: answers,
        correct: answers.indexOf(country.name),
      };
    });
  }

  // ════════════════════════════════════════════════════════════════
  // EXPOSE
  // ════════════════════════════════════════════════════════════════

  window.quizData = {
    imageGuessQuestions,
    fourImagesQuestions,
    multipleChoiceQuestions,
    speedModeQuestions,
    buildUsStatesQuestions,
    buildCompanyLogosQuestions,
    buildFootballQuestions,
    buildNBAQuestions,
    fetchCountriesData,
    buildCapitalsQuestions,
    buildFlagsQuestions,
  };
})();
