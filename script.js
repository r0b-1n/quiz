/* global quizData */
"use strict";

// ── State ────────────────────────────────────────────────────────
const state = {
  currentMode: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  totalAnswered: 0,
  hintsUsed: 0,
  speedTimer: null,
  speedTimeLeft: 60,
  isAnswered: false,
  revealedLetters: [],
  hintConverted: false,
};

// ── DOM references ───────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const screens = {
  start:  $("start-screen"),
  quiz:   $("quiz-screen"),
  result: $("result-screen"),
};

// ── Utilities ────────────────────────────────────────────────────
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function validateAnswer(input, answers) {
  const normInput = window.normalize(input);
  return answers.some(function (a) {
    const normA = window.normalize(a);
    if (normInput === normA) return true;
    const maxDist = normA.length >= 10 ? 2 : normA.length >= 5 ? 1 : 0;
    return maxDist > 0 && window.levenshtein(normInput, normA) <= maxDist;
  });
}

function calculateAccuracy() {
  if (state.totalAnswered === 0) return 0;
  return Math.round((state.correctCount / state.totalAnswered) * 100);
}

// ── Loading Overlay ──────────────────────────────────────────────
function showLoading(msg) {
  const overlay = $("loading-overlay");
  const text = $("loading-text");
  if (text) text.textContent = msg || "Fragen werden geladen…";
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoading() {
  const overlay = $("loading-overlay");
  if (overlay) overlay.classList.add("hidden");
}

// ── Screen Navigation ────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

// ── Category Selection (knowledge categories) ────────────────────
window.selectCategory = async function (categoryKey) {
  showLoading("Fragen werden geladen…");
  try {
    const data = window.quizData;
    let questions = [];

    switch (categoryKey) {
      case "countries": {
        showLoading("Länderdaten werden abgerufen…");
        const countriesData = await data.fetchCountriesData();
        questions = data.buildCapitalsQuestions(countriesData);
        break;
      }
      case "flags": {
        showLoading("Flaggendaten werden abgerufen…");
        const flagCountries = await data.fetchCountriesData();
        questions = data.buildFlagsQuestions(flagCountries);
        break;
      }
      case "us_states":
        questions = data.buildUsStatesQuestions();
        break;
      case "company_logos":
        questions = data.buildCompanyLogosQuestions();
        break;
      case "football":
        questions = data.buildFootballQuestions();
        break;
      case "nba":
        questions = data.buildNBAQuestions();
        break;
      default:
        throw new Error("Unbekannte Kategorie: " + categoryKey);
    }

    hideLoading();
    window.startQuiz(questions, categoryKey);
  } catch (err) {
    hideLoading();
    alert("Fehler beim Laden der Fragen: " + (err.message || err));
  }
};

// ── Classic Mode Selection ────────────────────────────────────────
window.selectMode = function (mode) {
  const data = window.quizData;
  let questions = [];
  switch (mode) {
    case "image":         questions = shuffle(data.imageGuessQuestions);      break;
    case "four_images":   questions = shuffle(data.fourImagesQuestions);      break;
    case "multiple_choice": questions = shuffle(data.multipleChoiceQuestions); break;
    case "speed":
      questions = shuffle(data.speedModeQuestions);
      break;
    default:
      questions = shuffle(data.multipleChoiceQuestions);
  }
  window.startQuiz(questions, mode);
};

// ── Start Quiz ───────────────────────────────────────────────────
window.startQuiz = function (questions, mode) {
  state.currentMode = mode;
  state.questions = questions;
  state.currentIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.maxStreak = 0;
  state.correctCount = 0;
  state.totalAnswered = 0;
  state.hintsUsed = 0;
  state.isAnswered = false;
  state.speedTimeLeft = 60;

  showScreen("quiz");
  renderQuestion();

  if (mode === "speed") {
    startSpeedMode();
  } else {
    stopSpeedTimer();
    $("timer-wrap").classList.add("hidden");
  }
};

// ── Speed Mode ────────────────────────────────────────────────────
function startSpeedMode() {
  $("timer-wrap").classList.remove("hidden");
  updateTimerRing(state.speedTimeLeft, 60);
  state.speedTimer = setInterval(() => {
    state.speedTimeLeft--;
    updateTimerRing(state.speedTimeLeft, 60);
    if (state.speedTimeLeft <= 0) {
      stopSpeedTimer();
      endQuiz();
    }
  }, 1000);
}

function stopSpeedTimer() {
  if (state.speedTimer) {
    clearInterval(state.speedTimer);
    state.speedTimer = null;
  }
}

function updateTimerRing(left, total) {
  const fill = $("timer-ring-fill");
  const num  = $("timer-number");
  const circ = 2 * Math.PI * 22;
  const pct  = left / total;
  fill.style.strokeDashoffset = circ - circ * pct;
  num.textContent = left;
  fill.classList.remove("warning", "danger");
  if (left <= 10) fill.classList.add("danger");
  else if (left <= 20) fill.classList.add("warning");
}

// ── Render Question ──────────────────────────────────────────────
function renderQuestion() {
  if (state.currentIndex >= state.questions.length) {
    endQuiz();
    return;
  }

  state.isAnswered = false;
  state.revealedLetters = [];
  state.hintConverted = false;

  const q = state.questions[state.currentIndex];
  const area = $("question-area");
  area.innerHTML = "";

  updateProgress();
  updateHeaderStats();

  switch (q.type) {
    case "image":
      renderImageGuess(q, area);
      break;
    case "four_images":
      renderFourImages(q, area);
      break;
    case "multiple_choice":
      renderMultipleChoice(q, area);
      break;
    case "image_mc":
      renderImageMC(q, area);
      break;
    default:
      renderMultipleChoice(q, area);
  }
}

// ── Image Guess ───────────────────────────────────────────────────
function renderImageGuess(q, area) {
  area.innerHTML = `
    <div class="question-image-wrap">
      <img src="${q.image}" alt="Quiz-Bild" loading="lazy" />
    </div>
    <div class="question-text">${q.question}</div>
    <div class="answer-area">
      <input id="text-input" class="answer-input" type="text"
        placeholder="Antwort eingeben…" autocomplete="off" />
      <button class="btn btn-primary" onclick="submitTextAnswer()">Antworten</button>
    </div>
    <div class="action-row">
      <button class="btn btn-outline" id="hint-btn" onclick="useHint()">💡 Hinweis</button>
      <span class="hint-cost">Hinweis kostet −5 Pkt.</span>
    </div>
    <div id="word-hint-display" class="word-hint" style="margin-top:16px;"></div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:16px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Weiter →</button>
    </div>
  `;
  const input = $("text-input");
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitTextAnswer(); });
  input.focus();
}

// ── Four Images ───────────────────────────────────────────────────
function renderFourImages(q, area) {
  const hintHtml = buildLetterBoxesHtml(q.word, []);
  area.innerHTML = `
    <div class="question-text">🖼️ Welches Wort verbindet diese vier Bilder?</div>
    <div class="four-images-grid">
      ${q.images.map((src) => `<img src="${src}" alt="" loading="lazy" />`).join("")}
    </div>
    <p style="color:var(--text2);font-size:.88rem;margin-bottom:16px;">💬 Hinweis: ${q.clue}</p>
    <div id="word-hint-display" class="word-hint">${hintHtml}</div>
    <div class="answer-area">
      <input id="text-input" class="answer-input" type="text"
        placeholder="Verbindendes Wort eingeben…" autocomplete="off" />
      <button class="btn btn-primary" onclick="submitTextAnswer()">Antworten</button>
    </div>
    <div class="action-row">
      <button class="btn btn-outline" id="hint-btn" onclick="useHint()">💡 Buchstabe aufdecken</button>
      <span class="hint-cost">Hinweis kostet −5 Pkt.</span>
    </div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:16px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Weiter →</button>
    </div>
  `;
  const input = $("text-input");
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitTextAnswer(); });
  input.focus();
}

// ── Multiple Choice ───────────────────────────────────────────────
function renderMultipleChoice(q, area) {
  const labels = ["A", "B", "C", "D"];
  const choicesHtml = q.answers
    .map((ans, i) => `
      <button class="choice-btn" id="choice-${i}" onclick="submitChoice(${i})">
        <span class="choice-label">${labels[i]}</span>
        <span>${ans}</span>
      </button>`)
    .join("");

  area.innerHTML = `
    <div class="question-text">${q.question}</div>
    <div class="choices-grid">${choicesHtml}</div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:4px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Weiter →</button>
    </div>
  `;
}

// ── Image MC ──────────────────────────────────────────────────────
function renderImageMC(q, area) {
  const labels = ["A", "B", "C", "D"];
  const choicesHtml = q.answers
    .map((ans, i) => `
      <button class="choice-btn" id="choice-${i}" onclick="submitChoice(${i})">
        <span class="choice-label">${labels[i]}</span>
        <span>${ans}</span>
      </button>`)
    .join("");

  const isLogo = q.imageStyle === "logo";
  const isFlag = q.imageStyle === "flag";
  const wrapClass = isLogo ? "logo-image-wrap" : isFlag ? "flag-image-wrap" : "question-image-wrap";
  const tagHtml = q.tag ? `<span class="q-tag">${q.tag}</span>` : "";

  area.innerHTML = `
    <div class="${wrapClass}">
      <img src="${q.image}" alt="Quiz-Bild" loading="lazy" />
    </div>
    <div class="question-text">${q.question}${tagHtml}</div>
    <div class="choices-grid">${choicesHtml}</div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:4px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Weiter →</button>
    </div>
  `;
}

// ── Letter Boxes ──────────────────────────────────────────────────
function buildLetterBoxesHtml(word, revealed) {
  return word
    .split("")
    .map((ch, i) => {
      if (ch === " ") return `<div class="letter-box space"></div>`;
      const show = revealed.includes(i);
      return `<div class="letter-box${show ? " revealed" : ""}" id="lb-${i}">${show ? ch : ""}</div>`;
    })
    .join("");
}

function refreshLetterBoxes(word, revealed) {
  const display = $("word-hint-display");
  if (!display) return;
  display.innerHTML = buildLetterBoxesHtml(word, revealed);
}

// ── Hint ──────────────────────────────────────────────────────────
window.useHint = function () {
  if (state.isAnswered) return;
  const q = state.questions[state.currentIndex];

  if (q.type === "multiple_choice" || q.type === "image_mc") {
    const wrongBtns = [];
    for (let i = 0; i < q.answers.length; i++) {
      if (i !== q.correct) {
        const btn = $(`choice-${i}`);
        if (btn && !btn.disabled) wrongBtns.push({ btn, i });
      }
    }
    if (wrongBtns.length === 0) return;
    const pick = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
    pick.btn.disabled = true;
    pick.btn.style.opacity = "0.3";
    applyScoreDelta(-5);
    state.hintsUsed++;
    return;
  }

  // image / four_images — reveal next unrevealed letter
  const word = (q.type === "four_images" ? q.word : q.answers[0]).toUpperCase();
  const nonSpace = word
    .split("")
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => c !== " ");
  const unrevealed = nonSpace.filter(({ i }) => !state.revealedLetters.includes(i));

  if (unrevealed.length === 0) return;

  const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
  state.revealedLetters.push(pick.i);
  applyScoreDelta(-5, "hint");
  state.hintsUsed++;
  refreshLetterBoxes(word, state.revealedLetters);

  const hintBtn = $("hint-btn");
  if (unrevealed.length === 1 && hintBtn) hintBtn.disabled = true;
};

// ── Submit Text ───────────────────────────────────────────────────
window.submitTextAnswer = function () {
  if (state.isAnswered) return;
  const input = $("text-input");
  if (!input) return;
  const val = input.value.trim();
  if (!val) { input.focus(); return; }

  const q = state.questions[state.currentIndex];
  const answers = q.type === "four_images" ? [q.word] : q.answers;
  const correct = validateAnswer(val, answers);
  state.isAnswered = true;
  state.totalAnswered++;

  if (correct) {
    handleCorrect(input);
    if (q.type === "four_images" || q.type === "image") {
      const word = (q.type === "four_images" ? q.word : q.answers[0]).toUpperCase();
      const all = word.split("").map((_, i) => i).filter((i) => word[i] !== " ");
      state.revealedLetters = all;
      refreshLetterBoxes(word, all);
    }
  } else {
    handleIncorrect(input, answers[0]);
  }

  showNextRow();
  if (state.currentMode === "speed") {
    setTimeout(nextQuestion, 1200);
  }
};

// ── Submit Choice ─────────────────────────────────────────────────
window.submitChoice = function (index) {
  if (state.isAnswered) return;
  const q = state.questions[state.currentIndex];
  state.isAnswered = true;
  state.totalAnswered++;

  for (let i = 0; i < q.answers.length; i++) {
    const btn = $(`choice-${i}`);
    if (btn) btn.disabled = true;
  }

  const chosen = $(`choice-${index}`);
  if (index === q.correct) {
    chosen.classList.add("correct");
    handleCorrect(null);
  } else {
    chosen.classList.add("incorrect");
    const correctBtn = $(`choice-${q.correct}`);
    if (correctBtn) correctBtn.classList.add("reveal-correct");
    handleIncorrect(null, q.answers[q.correct]);
  }

  showNextRow();
  if (state.currentMode === "speed") {
    setTimeout(nextQuestion, 1200);
  }
};

// ── Correct / Incorrect Handlers ─────────────────────────────────
function handleCorrect(inputEl) {
  // Scoring formula: +10 base + (current streak × 2) bonus
  const bonus = state.streak * 2;
  const pts = 10 + bonus;
  state.score += pts;
  state.streak++;
  state.correctCount++;
  if (state.streak > state.maxStreak) state.maxStreak = state.streak;

  if (inputEl) inputEl.classList.add("correct");
  flashCard("correct-flash");

  const label = bonus > 0 ? `✅ Richtig! +${pts} (Serienbonus +${bonus}!)` : `✅ Richtig! +10`;
  showFeedback(true, label);
  updateHeaderStats();
  animateStreakFire();
}

function handleIncorrect(inputEl, correctAnswer) {
  state.score = Math.max(0, state.score - 3);
  state.streak = 0;

  if (inputEl) inputEl.classList.add("incorrect");
  flashCard("incorrect-flash");

  showFeedback(false, `❌ Falsch. Antwort: ${correctAnswer}`);
  updateHeaderStats();
}

function applyScoreDelta(delta) {
  state.score = Math.max(0, state.score + delta);
  updateHeaderStats();
}

// ── UI Helpers ────────────────────────────────────────────────────
function showFeedback(correct, msg) {
  const el = $("feedback");
  if (!el) return;
  el.className = `feedback ${correct ? "correct" : "incorrect"}`;
  el.textContent = msg;
  el.classList.remove("hidden");
}

function flashCard(cls) {
  const card = document.querySelector(".question-card");
  if (!card) return;
  card.classList.remove("correct-flash", "incorrect-flash");
  void card.offsetWidth;
  card.classList.add(cls);
  setTimeout(() => card.classList.remove(cls), 700);
}

function showNextRow() {
  const row = $("next-row");
  if (row) row.style.display = "flex";
  const hintBtn = $("hint-btn");
  if (hintBtn) hintBtn.disabled = true;
}

function animateStreakFire() {
  const fire = $("streak-fire");
  if (!fire) return;
  fire.classList.remove("pop");
  void fire.offsetWidth;
  fire.classList.add("pop");
}

function updateProgress() {
  const total = state.questions.length;
  const current = state.currentIndex + 1;
  const pct = (state.currentIndex / total) * 100;

  const fill = $("progress-fill");
  if (fill) fill.style.width = pct + "%";
  const label = $("progress-label");
  if (label) label.textContent = `Frage ${current} von ${total}`;
  const pctEl = $("progress-pct");
  if (pctEl) pctEl.textContent = Math.round(pct) + "%";
}

function updateHeaderStats() {
  const scoreEl = $("header-score");
  if (scoreEl) scoreEl.textContent = `⭐ ${state.score}`;
  const streakEl = $("header-streak");
  if (streakEl) {
    const icon = state.streak >= 3 ? "🔥" : "✨";
    streakEl.innerHTML = `<span id="streak-fire" class="streak-fire">${icon}</span> ${state.streak}`;
  }
}

// ── Next Question ─────────────────────────────────────────────────
window.nextQuestion = function () {
  state.currentIndex++;
  if (state.currentIndex >= state.questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
};

// ── High Score helpers ────────────────────────────────────────────
function getHighScore(category) {
  try {
    return parseInt(localStorage.getItem("quiz_hs_" + category) || "0", 10);
  } catch (e) { return 0; }
}

function saveHighScore(category, score) {
  try {
    const prev = getHighScore(category);
    if (score > prev) {
      localStorage.setItem("quiz_hs_" + category, String(score));
      return true;
    }
  } catch (e) { /* ignore */ }
  return false;
}

// ── End Quiz ──────────────────────────────────────────────────────
function endQuiz() {
  stopSpeedTimer();
  showScreen("result");

  const acc = calculateAccuracy();
  const emoji = acc >= 80 ? "🏆" : acc >= 50 ? "🎉" : "💪";
  const title = acc >= 80 ? "Ausgezeichnet!" : acc >= 50 ? "Gut gemacht!" : "Weiter üben!";

  $("result-emoji").textContent = emoji;
  $("result-title").textContent = title;
  $("result-subtitle").textContent =
    `Du hast ${state.totalAnswered} Frage${state.totalAnswered !== 1 ? "n" : ""} beantwortet`;

  $("res-score").textContent = state.score;
  $("res-accuracy").textContent = acc + "%";
  $("res-streak").textContent = state.maxStreak;
  $("res-hints").textContent = state.hintsUsed;
  $("res-correct").textContent = `${state.correctCount}/${state.totalAnswered}`;

  // High score
  const isNew = saveHighScore(state.currentMode, state.score);
  const hs = getHighScore(state.currentMode);
  const hsBanner = $("highscore-banner");
  if (hsBanner) {
    hsBanner.textContent = isNew
      ? `🏅 Neuer Highscore: ${state.score}!`
      : `🏅 Bester Score: ${hs}`;
    hsBanner.classList.remove("hidden");
  }

  if (acc >= 60) spawnConfetti();
}

// ── Confetti ──────────────────────────────────────────────────────
function spawnConfetti() {
  const colors = ["#6C63FF", "#FF6584", "#4CAF50", "#FF9800", "#00BCD4", "#FFEB3B"];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.cssText = `
        left:${Math.random() * 100}vw;
        top:-10px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        width:${6 + Math.random() * 10}px;
        height:${6 + Math.random() * 10}px;
        border-radius:${Math.random() > .5 ? "50%" : "2px"};
        animation-duration:${2.5 + Math.random() * 2}s;
        animation-delay:${Math.random() * .8}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, i * 20);
  }
}

// ── Dark Mode ─────────────────────────────────────────────────────
window.toggleTheme = function () {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  $("theme-toggle").textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("quiz-theme", isDark ? "light" : "dark");
};

// ── Back to Menu ──────────────────────────────────────────────────
window.goHome = function () {
  stopSpeedTimer();
  showScreen("start");
};

// ── Restart (same mode) ───────────────────────────────────────────
window.restartQuiz = function () {
  const classicModes = ["image", "four_images", "multiple_choice", "speed"];
  if (classicModes.includes(state.currentMode)) {
    window.selectMode(state.currentMode);
  } else {
    window.selectCategory(state.currentMode);
  }
};

// ── Init ──────────────────────────────────────────────────────────
(function init() {
  const saved = localStorage.getItem("quiz-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  $("theme-toggle").textContent = saved === "dark" ? "☀️" : "🌙";
  showScreen("start");
})();
