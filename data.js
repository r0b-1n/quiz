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

  // ── Pick n random items excluding one by key ──────────────────────
  // More efficient than filter-then-shuffle for repeated calls.
  function pickRandomExcluding(arr, excludeKey, keyFn, n) {
    const pool = arr.filter(function (item) { return keyFn(item) !== excludeKey; });
    const result = [];
    for (let i = 0; i < n && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return result;
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
      question: "Was für ein Tier ist das?",
      answers: ["katze", "cat"],
    },
    {
      id: "ig2", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/400px-Cute_dog.jpg",
      question: "Was für ein Tier ist das?",
      answers: ["hund", "dog"],
    },
    {
      id: "ig3", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/400px-Camponotus_flavomarginatus_ant.jpg",
      question: "Was für ein Insekt ist das?",
      answers: ["ameise", "ant"],
    },
    {
      id: "ig4", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      question: "Was für ein berühmtes Gemälde ist das?",
      answers: ["mona lisa", "monalisa", "la joconde"],
    },
    {
      id: "ig5", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/400px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
      question: "Was für ein Berg ist das?",
      answers: ["everest", "mount everest", "mt everest"],
    },
    {
      id: "ig6", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
      question: "Was für Gegenstände sind das?",
      answers: ["wurfel", "wurfelspiel", "dice", "die"],
    },
    {
      id: "ig7", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/400px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
      question: "Was ist auf diesem Bild zu sehen?",
      answers: ["essen", "obst", "gemuse", "lebensmittel", "food", "fruit"],
    },
    {
      id: "ig8", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
      question: "Was für ein berühmtes Gebäude ist das?",
      answers: ["empire state building", "empire state"],
    },
    {
      id: "ig9", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/400px-African_Bush_Elephant.jpg",
      question: "Was für ein Tier ist das?",
      answers: ["elefant", "elephant"],
    },
    {
      id: "ig10", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/400px-Lion_waiting_in_Namibia.jpg",
      question: "Was für ein Tier ist das?",
      answers: ["lowe", "lion"],
    },
    {
      id: "ig11", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/400px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
      question: "Was für ein berühmtes Bauwerk ist das?",
      answers: ["eiffelturm", "eiffel turm", "tour eiffel"],
    },
    {
      id: "ig12", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/400px-The_Earth_seen_from_Apollo_17.jpg",
      question: "Was ist auf diesem Bild zu sehen?",
      answers: ["erde", "earth"],
    },
    {
      id: "ig13", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GuitareClassique5.png/400px-GuitareClassique5.png",
      question: "Was für ein Instrument ist das?",
      answers: ["gitarre", "guitar"],
    },
    {
      id: "ig14", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/400px-Red_Apple.jpg",
      question: "Was für eine Frucht ist das?",
      answers: ["apfel", "apple"],
    },
    {
      id: "ig15", type: "image",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Fruits.jpg/400px-Banana-Fruits.jpg",
      question: "Was für eine Frucht ist das?",
      answers: ["banane", "banana"],
    },
  ];

  const fourImagesQuestions = [
    {
      id: "fi1", type: "four_images",
      images: ["https://picsum.photos/seed/himmel/200/200","https://picsum.photos/seed/ozean/200/200","https://picsum.photos/seed/blaubeere/200/200","https://picsum.photos/seed/jeans/200/200"],
      word: "BLAU", hint: "_ _ _ _", clue: "Himmel, Ozean, Beere, Jeans — welche Farbe verbindet sie?",
    },
    {
      id: "fi2", type: "four_images",
      images: ["https://picsum.photos/seed/lagerfeuer/200/200","https://picsum.photos/seed/flamme/200/200","https://picsum.photos/seed/fackel/200/200","https://picsum.photos/seed/kamin/200/200"],
      word: "FEUER", hint: "_ _ _ _ _", clue: "Lagerfeuer, Flamme, Fackel, Kamin — was verbindet diese Bilder?",
    },
    {
      id: "fi3", type: "four_images",
      images: ["https://picsum.photos/seed/eiche/200/200","https://picsum.photos/seed/kiefer/200/200","https://picsum.photos/seed/ahorn/200/200","https://picsum.photos/seed/wald/200/200"],
      word: "BAUM", hint: "_ _ _ _", clue: "Eiche, Kiefer, Ahorn, Wald — was verbindet diese Bilder?",
    },
    {
      id: "fi4", type: "four_images",
      images: ["https://picsum.photos/seed/goldbar/200/200","https://picsum.photos/seed/trophae/200/200","https://picsum.photos/seed/munze/200/200","https://picsum.photos/seed/sonnenaufgang/200/200"],
      word: "GOLD", hint: "_ _ _ _", clue: "Barren, Trophäe, Münze, Sonnenaufgang — was verbindet diese Bilder?",
    },
    {
      id: "fi5", type: "four_images",
      images: ["https://picsum.photos/seed/hochzeit/200/200","https://picsum.photos/seed/schmuck/200/200","https://picsum.photos/seed/saturn/200/200","https://picsum.photos/seed/boxen/200/200"],
      word: "RING", hint: "_ _ _ _", clue: "Hochzeit, Schmuck, Saturn, Boxen — was verbindet diese Bilder?",
    },
    {
      id: "fi6", type: "four_images",
      images: ["https://picsum.photos/seed/schnee/200/200","https://picsum.photos/seed/eisberg/200/200","https://picsum.photos/seed/wolke/200/200","https://picsum.photos/seed/polarbear/200/200"],
      word: "WEISS", hint: "_ _ _ _ _", clue: "Schnee, Eisberg, Wolke, Polarbär — welche Farbe verbindet sie?",
    },
    {
      id: "fi7", type: "four_images",
      images: ["https://picsum.photos/seed/bibliothek/200/200","https://picsum.photos/seed/roman/200/200","https://picsum.photos/seed/lesen/200/200","https://picsum.photos/seed/regal/200/200"],
      word: "BUCH", hint: "_ _ _ _", clue: "Bibliothek, Roman, Lesen, Regal — was verbindet diese Bilder?",
    },
    {
      id: "fi8", type: "four_images",
      images: ["https://picsum.photos/seed/welpe/200/200","https://picsum.photos/seed/bellen/200/200","https://picsum.photos/seed/leine/200/200","https://picsum.photos/seed/hundehutte/200/200"],
      word: "HUND", hint: "_ _ _ _", clue: "Welpe, Bellen, Leine, Hundehütte — woran denkst du?",
    },
    {
      id: "fi9", type: "four_images",
      images: ["https://picsum.photos/seed/regen/200/200","https://picsum.photos/seed/fluss/200/200","https://picsum.photos/seed/wasserozen/200/200","https://picsum.photos/seed/eis/200/200"],
      word: "WASSER", hint: "_ _ _ _ _ _", clue: "Regen, Fluss, Ozean, Eis — was verbindet diese Bilder?",
    },
    {
      id: "fi10", type: "four_images",
      images: ["https://picsum.photos/seed/nachthimmel/200/200","https://picsum.photos/seed/celebrity/200/200","https://picsum.photos/seed/seestern/200/200","https://picsum.photos/seed/weihnacht/200/200"],
      word: "STERN", hint: "_ _ _ _ _", clue: "Nachthimmel, Berühmtheit, Seestern, Weihnachten — welches Wort passt?",
    },
    {
      id: "fi11", type: "four_images",
      images: ["https://picsum.photos/seed/alpen/200/200","https://picsum.photos/seed/gipfel/200/200","https://picsum.photos/seed/wandern/200/200","https://picsum.photos/seed/skifahren/200/200"],
      word: "BERG", hint: "_ _ _ _", clue: "Alpen, Gipfel, Wandern, Skifahren — was verbindet sie?",
    },
    {
      id: "fi12", type: "four_images",
      images: ["https://picsum.photos/seed/sonne/200/200","https://picsum.photos/seed/kerze/200/200","https://picsum.photos/seed/leuchtturm/200/200","https://picsum.photos/seed/ampel/200/200"],
      word: "LICHT", hint: "_ _ _ _ _", clue: "Sonne, Kerze, Leuchtturm, Ampel — was verbindet diese Bilder?",
    },
    {
      id: "fi13", type: "four_images",
      images: ["https://picsum.photos/seed/apfelrot/200/200","https://picsum.photos/seed/rose/200/200","https://picsum.photos/seed/feuerwehr/200/200","https://picsum.photos/seed/tomaterot/200/200"],
      word: "ROT", hint: "_ _ _", clue: "Apfel, Rose, Feuerwehr, Tomate — welche Farbe verbindet sie?",
    },
    {
      id: "fi14", type: "four_images",
      images: ["https://picsum.photos/seed/mond/200/200","https://picsum.photos/seed/sterne/200/200","https://picsum.photos/seed/fledermaus/200/200","https://picsum.photos/seed/schlaf/200/200"],
      word: "NACHT", hint: "_ _ _ _ _", clue: "Mond, Sterne, Fledermaus, Schlaf — was verbindet diese Bilder?",
    },
  ];

  const multipleChoiceQuestions = [
    { id: "mc1",  type: "multiple_choice", question: "Was ist die Hauptstadt von Frankreich?",                         answers: ["London","Paris","Berlin","Madrid"],                       correct: 1 },
    { id: "mc2",  type: "multiple_choice", question: "Wie viele Seiten hat ein Hexagon?",                              answers: ["5","6","7","8"],                                          correct: 1 },
    { id: "mc3",  type: "multiple_choice", question: "Welcher Planet ist als der Rote Planet bekannt?",                answers: ["Venus","Jupiter","Mars","Saturn"],                        correct: 2 },
    { id: "mc4",  type: "multiple_choice", question: "Was ist das chemische Symbol für Wasser?",                       answers: ["CO₂","O₂","H₂O","NaCl"],                                 correct: 2 },
    { id: "mc5",  type: "multiple_choice", question: "Wer hat die Sixtinische Kapelle bemalt?",                        answers: ["Leonardo da Vinci","Raffael","Michelangelo","Donatello"],  correct: 2 },
    { id: "mc6",  type: "multiple_choice", question: "Was ist der größte Ozean der Erde?",                             answers: ["Atlantik","Indischer Ozean","Arktischer Ozean","Pazifik"], correct: 3 },
    { id: "mc7",  type: "multiple_choice", question: "In welchem Jahr endete der Zweite Weltkrieg?",                   answers: ["1943","1944","1945","1946"],                              correct: 2 },
    { id: "mc8",  type: "multiple_choice", question: "Wie viele Knochen hat der erwachsene menschliche Körper?",       answers: ["196","206","216","226"],                                  correct: 1 },
    { id: "mc9",  type: "multiple_choice", question: "Was ist die Lichtgeschwindigkeit (ungefähr) in km/s?",           answers: ["150.000","200.000","300.000","400.000"],                  correct: 2 },
    { id: "mc10", type: "multiple_choice", question: "Welches Element hat die Ordnungszahl 1?",                        answers: ["Helium","Sauerstoff","Kohlenstoff","Wasserstoff"],        correct: 3 },
    { id: "mc11", type: "multiple_choice", question: "Was ist der längste Fluss der Welt?",                            answers: ["Amazonas","Jangtsekiang","Nil","Mississippi"],            correct: 2 },
    { id: "mc12", type: "multiple_choice", question: "Welche Programmiersprache wurde von Guido van Rossum entwickelt?", answers: ["Java","Ruby","Python","Perl"],                         correct: 2 },
    { id: "mc13", type: "multiple_choice", question: "Welches ist das flächenmäßig größte Land der Welt?",             answers: ["USA","China","Russland","Kanada"],                        correct: 2 },
    { id: "mc14", type: "multiple_choice", question: "Was ist die Hauptstadt von Deutschland?",                        answers: ["Hamburg","München","Frankfurt","Berlin"],                 correct: 3 },
    { id: "mc15", type: "multiple_choice", question: "Welcher Kontinent ist der größte der Welt?",                     answers: ["Afrika","Amerika","Asien","Europa"],                      correct: 2 },
    { id: "mc16", type: "multiple_choice", question: "Wie viele Stunden hat ein Tag?",                                 answers: ["20","22","24","26"],                                      correct: 2 },
    { id: "mc17", type: "multiple_choice", question: "Was ist das härteste natürliche Mineral?",                       answers: ["Gold","Quarz","Diamant","Rubin"],                         correct: 2 },
    { id: "mc18", type: "multiple_choice", question: "Welche Sprache wird in Brasilien gesprochen?",                   answers: ["Spanisch","Portugiesisch","Englisch","Brasilianisch"],    correct: 1 },
    { id: "mc19", type: "multiple_choice", question: "Wer schrieb 'Romeo und Julia'?",                                 answers: ["Goethe","Shakespeare","Dante","Cervantes"],               correct: 1 },
    { id: "mc20", type: "multiple_choice", question: "In welchem Jahr begann der Erste Weltkrieg?",                    answers: ["1910","1912","1914","1916"],                              correct: 2 },
    { id: "mc21", type: "multiple_choice", question: "Welche Stadt ist die Hauptstadt von Australien?",                answers: ["Sydney","Melbourne","Brisbane","Canberra"],               correct: 3 },
    { id: "mc22", type: "multiple_choice", question: "Wie viele Planeten hat unser Sonnensystem?",                     answers: ["7","8","9","10"],                                         correct: 1 },
    { id: "mc23", type: "multiple_choice", question: "Was ist die Hauptstadt von Japan?",                              answers: ["Osaka","Kyoto","Tokio","Hiroshima"],                      correct: 2 },
    { id: "mc24", type: "multiple_choice", question: "Welches ist der größte Planet in unserem Sonnensystem?",         answers: ["Saturn","Jupiter","Uranus","Neptun"],                     correct: 1 },
    { id: "mc25", type: "multiple_choice", question: "In welchem Jahr wurde die Berliner Mauer gebaut?",               answers: ["1955","1958","1961","1965"],                              correct: 2 },
    { id: "mc26", type: "multiple_choice", question: "Was ist die Hauptstadt von Spanien?",                            answers: ["Barcelona","Madrid","Sevilla","Valencia"],                correct: 1 },
    { id: "mc27", type: "multiple_choice", question: "Wie viele Farben hat ein Regenbogen?",                           answers: ["5","6","7","8"],                                          correct: 2 },
    { id: "mc28", type: "multiple_choice", question: "Welches Tier ist das schnellste auf dem Land?",                  answers: ["Pferd","Strauß","Gepard","Wildhund"],                     correct: 2 },
    { id: "mc29", type: "multiple_choice", question: "Was ist die kleinste Primzahl?",                                 answers: ["0","1","2","3"],                                          correct: 2 },
    { id: "mc30", type: "multiple_choice", question: "Was ist die Hauptstadt von Ägypten?",                            answers: ["Alexandria","Luxor","Kairo","Assuan"],                    correct: 2 },
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
      // F-Typ 1: Abkürzung → Bundesstaatsname
      const wrongStates1 = pickRandomExcluding(US_STATES, state.abbr, function (s) { return s.abbr; }, 3);
      const ans1 = shuffle([state.name, wrongStates1[0].name, wrongStates1[1].name, wrongStates1[2].name]);
      questions.push({
        id: "us_abbr_" + idx,
        type: "multiple_choice",
        question: 'Welcher US-Bundesstaat hat das Kürzel "' + state.abbr + '"?',
        answers: ans1,
        correct: ans1.indexOf(state.name),
      });

      // F-Typ 2: Hauptstadt → Bundesstaatsname
      const wrongStates2 = pickRandomExcluding(US_STATES, state.name, function (s) { return s.name; }, 3);
      const ans2 = shuffle([state.name, wrongStates2[0].name, wrongStates2[1].name, wrongStates2[2].name]);
      questions.push({
        id: "us_cap_" + idx,
        type: "multiple_choice",
        question: '"' + state.capital + '" ist die Hauptstadt welches US-Bundesstaates?',
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
      const wrong = pickRandomExcluding(COMPANIES, company.name, function (c) { return c.name; }, 3);
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
      const wrong = pickRandomExcluding(FOOTBALL_CLUBS, club.name, function (c) { return c.name; }, 3);
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
      const wrong = pickRandomExcluding(NBA_TEAMS, team.abbr, function (t) { return t.abbr; }, 3);
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
    if (!response.ok) throw new Error("Failed to fetch countries: " + response.status + " " + response.statusText);
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
      var wrong = pickRandomExcluding(countries, country.name, function (c) { return c.name; }, 3);
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
      var wrong = pickRandomExcluding(countries, country.name, function (c) { return c.name; }, 3);
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
