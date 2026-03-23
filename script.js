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
  // for image/four-images hint: revealed letters
  revealedLetters: [],
  hintConverted: false, // whether hint converted q to multiple choice
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
  const norm = input.trim().toLowerCase();
  return answers.some((a) => a.trim().toLowerCase() === norm);
}

function calculateAccuracy() {
  if (state.totalAnswered === 0) return 0;
  return Math.round((state.correctCount / state.totalAnswered) * 100);
}

// ── Screen Navigation ────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

// ── Mode Selection ───────────────────────────────────────────────
window.selectMode = function (mode) {
  state.currentMode = mode;
  state.score = 0;
  state.streak = 0;
  state.maxStreak = 0;
  state.correctCount = 0;
  state.totalAnswered = 0;
  state.hintsUsed = 0;
  state.currentIndex = 0;
  state.isAnswered = false;

  const data = window.quizData;
  switch (mode) {
    case "image":
      state.questions = shuffle(data.imageGuessQuestions);
      break;
    case "four_images":
      state.questions = shuffle(data.fourImagesQuestions);
      break;
    case "multiple_choice":
      state.questions = shuffle(data.multipleChoiceQuestions);
      break;
    case "speed":
      state.questions = shuffle(data.speedModeQuestions);
      state.speedTimeLeft = 60;
      break;
  }

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
  const circ = 2 * Math.PI * 22; /* matches SVG circle r=22 */
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

  // Render per type
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
    default:
      // fallback
      renderMultipleChoice(q, area);
  }
}

// ── Image Guess ───────────────────────────────────────────────────
function renderImageGuess(q, area) {
  area.innerHTML = `
    <div class="question-image-wrap">
      <img src="${q.image}" alt="Quiz image" loading="lazy" />
    </div>
    <div class="question-text">${q.question}</div>
    <div class="answer-area">
      <input id="text-input" class="answer-input" type="text"
        placeholder="Type your answer…" autocomplete="off" />
      <button class="btn btn-primary" onclick="submitTextAnswer()">Submit</button>
    </div>
    <div class="action-row">
      <button class="btn btn-outline" id="hint-btn" onclick="useHint()">💡 Hint</button>
      <span class="hint-cost">Hint costs −5 pts</span>
    </div>
    <div id="word-hint-display" class="word-hint" style="margin-top:16px;"></div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:16px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Next →</button>
    </div>
  `;

  const input = $("text-input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitTextAnswer();
  });
  input.focus();
}

// ── Four Images ───────────────────────────────────────────────────
function renderFourImages(q, area) {
  const hintHtml = buildLetterBoxesHtml(q.word, []);

  area.innerHTML = `
    <div class="question-text">🖼️ What one word connects these four images?</div>
    <div class="four-images-grid">
      ${q.images.map((src) => `<img src="${src}" alt="" loading="lazy" />`).join("")}
    </div>
    <p style="color:var(--text2);font-size:.88rem;margin-bottom:16px;">💬 Clue: ${q.clue}</p>
    <div id="word-hint-display" class="word-hint">${hintHtml}</div>
    <div class="answer-area">
      <input id="text-input" class="answer-input" type="text"
        placeholder="Type the connecting word…" autocomplete="off" />
      <button class="btn btn-primary" onclick="submitTextAnswer()">Submit</button>
    </div>
    <div class="action-row">
      <button class="btn btn-outline" id="hint-btn" onclick="useHint()">💡 Reveal letter</button>
      <span class="hint-cost">Hint costs −5 pts</span>
    </div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:16px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Next →</button>
    </div>
  `;

  const input = $("text-input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitTextAnswer();
  });
  input.focus();
}

// ── Multiple Choice ───────────────────────────────────────────────
function renderMultipleChoice(q, area) {
  const labels = ["A", "B", "C", "D"];
  const choicesHtml = q.answers
    .map(
      (ans, i) => `
      <button class="choice-btn" id="choice-${i}" onclick="submitChoice(${i})">
        <span class="choice-label">${labels[i]}</span>
        <span>${ans}</span>
      </button>`
    )
    .join("");

  area.innerHTML = `
    <div class="question-text">${q.question}</div>
    <div class="choices-grid">${choicesHtml}</div>
    <div id="feedback" class="feedback hidden"></div>
    <div class="action-row" id="next-row" style="margin-top:4px; display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">Next →</button>
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

  if (q.type === "multiple_choice") {
    // Eliminate one wrong answer
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

  // Reveal a random unrevealed letter
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
  if (!val) {
    input.focus();
    return;
  }

  const q = state.questions[state.currentIndex];
  const answers = q.type === "four_images" ? [q.word] : q.answers;
  const correct = validateAnswer(val, answers);
  state.isAnswered = true;
  state.totalAnswered++;

  if (correct) {
    handleCorrect(input);
    // Reveal all letters in word hint
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

  // Disable all buttons
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
  const bonus = state.streak >= 5 ? 10 : state.streak >= 3 ? 5 : 0;
  const pts = 10 + bonus;
  state.score += pts;
  state.streak++;
  state.correctCount++;
  if (state.streak > state.maxStreak) state.maxStreak = state.streak;

  if (inputEl) inputEl.classList.add("correct");
  flashCard("correct-flash");

  const label = bonus > 0 ? `✅ Correct! +${pts} (streak bonus!)` : `✅ Correct! +10`;
  showFeedback(true, label);
  updateHeaderStats();
  animateStreakFire();
}

function handleIncorrect(inputEl, correctAnswer) {
  state.score = Math.max(0, state.score - 3);
  state.streak = 0;

  if (inputEl) inputEl.classList.add("incorrect");
  flashCard("incorrect-flash");

  showFeedback(false, `❌ Incorrect. Answer: ${correctAnswer}`);
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
  void card.offsetWidth; // reflow
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
  if (label) label.textContent = `Question ${current} of ${total}`;
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

// ── End Quiz ──────────────────────────────────────────────────────
function endQuiz() {
  stopSpeedTimer();
  showScreen("result");

  const acc = calculateAccuracy();
  const emoji = acc >= 80 ? "🏆" : acc >= 50 ? "🎉" : "💪";
  const title = acc >= 80 ? "Excellent!" : acc >= 50 ? "Well done!" : "Keep practising!";

  $("result-emoji").textContent = emoji;
  $("result-title").textContent = title;
  $("result-subtitle").textContent =
    `You answered ${state.totalAnswered} question${state.totalAnswered !== 1 ? "s" : ""}`;

  $("res-score").textContent = state.score;
  $("res-accuracy").textContent = acc + "%";
  $("res-streak").textContent = state.maxStreak;
  $("res-hints").textContent = state.hintsUsed;
  $("res-correct").textContent = `${state.correctCount}/${state.totalAnswered}`;

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
  selectMode(state.currentMode);
};

// ── Init ──────────────────────────────────────────────────────────
(function init() {
  const saved = localStorage.getItem("quiz-theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  $("theme-toggle").textContent = saved === "dark" ? "☀️" : "🌙";
  showScreen("start");
})();
