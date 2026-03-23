// Quiz Data
(function () {
  const imageGuessQuestions = [
    {
      id: "ig1",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/400px-Cat03.jpg",
      question: "What animal is this?",
      answers: ["cat"],
    },
    {
      id: "ig2",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/400px-Cute_dog.jpg",
      question: "What animal is this?",
      answers: ["dog"],
    },
    {
      id: "ig3",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/400px-Camponotus_flavomarginatus_ant.jpg",
      question: "What insect is this?",
      answers: ["ant"],
    },
    {
      id: "ig4",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      question: "What famous painting is this?",
      answers: ["mona lisa", "monalisa", "la joconde"],
    },
    {
      id: "ig5",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/400px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
      question: "What mountain is this?",
      answers: ["everest", "mount everest", "mt everest"],
    },
    {
      id: "ig6",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
      question: "What objects are shown?",
      answers: ["dice", "die"],
    },
    {
      id: "ig7",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/400px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
      question: "What category does this display represent?",
      answers: ["food", "fruit", "healthy food", "vegetables"],
    },
    {
      id: "ig8",
      type: "image",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
      question: "What famous building is this?",
      answers: ["empire state building", "empire state"],
    },
  ];

  const fourImagesQuestions = [
    {
      id: "fi1",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/sky/200/200",
        "https://picsum.photos/seed/ocean/200/200",
        "https://picsum.photos/seed/blueberry/200/200",
        "https://picsum.photos/seed/jeans/200/200",
      ],
      word: "BLUE",
      hint: "_ _ _ _",
      clue: "Sky, ocean, berry, denim — they all share this colour",
    },
    {
      id: "fi2",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/campfire/200/200",
        "https://picsum.photos/seed/flame/200/200",
        "https://picsum.photos/seed/torch/200/200",
        "https://picsum.photos/seed/fireplace/200/200",
      ],
      word: "FIRE",
      hint: "_ _ _ _",
      clue: "Heat, light, and burning — what element connects these?",
    },
    {
      id: "fi3",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/oak/200/200",
        "https://picsum.photos/seed/pine/200/200",
        "https://picsum.photos/seed/maple/200/200",
        "https://picsum.photos/seed/forest/200/200",
      ],
      word: "TREE",
      hint: "_ _ _ _",
      clue: "Oak, pine, maple, forest — what are they all types of?",
    },
    {
      id: "fi4",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/goldbar/200/200",
        "https://picsum.photos/seed/trophy/200/200",
        "https://picsum.photos/seed/coin/200/200",
        "https://picsum.photos/seed/sunrise/200/200",
      ],
      word: "GOLD",
      hint: "_ _ _ _",
      clue: "Bars, trophies, coins, sunrise — this precious metal connects them",
    },
    {
      id: "fi5",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/wedding/200/200",
        "https://picsum.photos/seed/ringbox/200/200",
        "https://picsum.photos/seed/saturn/200/200",
        "https://picsum.photos/seed/boxing/200/200",
      ],
      word: "RING",
      hint: "_ _ _ _",
      clue: "Wedding, jewellery, Saturn, boxing — what shape connects these?",
    },
    {
      id: "fi6",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/snow/200/200",
        "https://picsum.photos/seed/iceberg/200/200",
        "https://picsum.photos/seed/cloud/200/200",
        "https://picsum.photos/seed/polar/200/200",
      ],
      word: "WHITE",
      hint: "_ _ _ _ _",
      clue: "Snow, iceberg, cloud, polar bear — what colour do they share?",
    },
    {
      id: "fi7",
      type: "four_images",
      images: [
        "https://picsum.photos/seed/library/200/200",
        "https://picsum.photos/seed/novel/200/200",
        "https://picsum.photos/seed/reading/200/200",
        "https://picsum.photos/seed/bookshelf/200/200",
      ],
      word: "BOOK",
      hint: "_ _ _ _",
      clue: "Library, novel, reading, shelf — what object links them?",
    },
  ];

  const multipleChoiceQuestions = [
    {
      id: "mc1",
      type: "multiple_choice",
      question: "What is the capital of France?",
      answers: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
    },
    {
      id: "mc2",
      type: "multiple_choice",
      question: "How many sides does a hexagon have?",
      answers: ["5", "6", "7", "8"],
      correct: 1,
    },
    {
      id: "mc3",
      type: "multiple_choice",
      question: "Which planet is known as the Red Planet?",
      answers: ["Venus", "Jupiter", "Mars", "Saturn"],
      correct: 2,
    },
    {
      id: "mc4",
      type: "multiple_choice",
      question: "What is the chemical symbol for water?",
      answers: ["CO₂", "O₂", "H₂O", "NaCl"],
      correct: 2,
    },
    {
      id: "mc5",
      type: "multiple_choice",
      question: "Who painted the Sistine Chapel ceiling?",
      answers: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
      correct: 2,
    },
    {
      id: "mc6",
      type: "multiple_choice",
      question: "What is the largest ocean on Earth?",
      answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
    },
    {
      id: "mc7",
      type: "multiple_choice",
      question: "In what year did World War II end?",
      answers: ["1943", "1944", "1945", "1946"],
      correct: 2,
    },
    {
      id: "mc8",
      type: "multiple_choice",
      question: "How many bones are in the adult human body?",
      answers: ["196", "206", "216", "226"],
      correct: 1,
    },
    {
      id: "mc9",
      type: "multiple_choice",
      question: "What is the speed of light (approx) in km/s?",
      answers: ["150,000", "200,000", "300,000", "400,000"],
      correct: 2,
    },
    {
      id: "mc10",
      type: "multiple_choice",
      question: "Which element has the atomic number 1?",
      answers: ["Helium", "Oxygen", "Carbon", "Hydrogen"],
      correct: 3,
    },
    {
      id: "mc11",
      type: "multiple_choice",
      question: "What is the longest river in the world?",
      answers: ["Amazon", "Yangtze", "Nile", "Mississippi"],
      correct: 2,
    },
    {
      id: "mc12",
      type: "multiple_choice",
      question: "Which programming language was created by Guido van Rossum?",
      answers: ["Java", "Ruby", "Python", "Perl"],
      correct: 2,
    },
  ];

  // Speed mode mixes all types
  const speedModeQuestions = [
    ...multipleChoiceQuestions.slice(0, 5),
    ...imageGuessQuestions.slice(0, 4),
    ...fourImagesQuestions.slice(0, 3),
    ...multipleChoiceQuestions.slice(5, 10),
    ...imageGuessQuestions.slice(4),
    ...fourImagesQuestions.slice(3),
  ];

  window.quizData = {
    imageGuessQuestions,
    fourImagesQuestions,
    multipleChoiceQuestions,
    speedModeQuestions,
  };
})();
