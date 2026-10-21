const DEFAULT_QUESTION_BANK = [

  {
    type: "CONCEPT", category: "Loops", difficulty: 1,
    prompt: "Which loop is commonly used when you know exactly how many times you want to repeat something?",
    options: ["for loop", "while loop", "do...while loop", "if statement"],
    correctIndex: 0
  },
  {
    type: "TRUE / FALSE", category: "Syntax", difficulty: 1,
    prompt: "In most programming languages, array indexing starts at 0.",
    options: ["True", "False"],
    correctIndex: 0
  },
  {
    type: "CONCEPT", category: "Data Types", difficulty: 1,
    prompt: "Which of these is NOT a primitive data type in JavaScript?",
    options: ["Number", "String", "Array", "Boolean"],
    correctIndex: 2
  },
  {
    type: "CODE OUTPUT", category: "Operators", difficulty: 1,
    prompt: "What does this code output?",
    code: "console.log(2 + \"2\");",
    options: ["4", "\"22\"", "NaN", "Error"],
    correctIndex: 1
  },
  {
    type: "TRUE / FALSE", category: "Functions", difficulty: 1,
    prompt: "A function in programming can be called more than once.",
    options: ["True", "False"],
    correctIndex: 0
  },
  {
    type: "MULTIPLE CHOICE", category: "Comparison", difficulty: 1,
    prompt: "Which operator checks for equality without checking type in JavaScript?",
    options: ["===", "==", "=", "!=="],
    correctIndex: 1
  },
  {
    type: "DEBUGGING", category: "Syntax", difficulty: 1,
    prompt: "What is wrong with this code?",
    code: "function greet() {\n  console.log(\"Hello\")\n}\ngreet(",
    options: ["Missing closing parenthesis", "Missing semicolon after log", "Function name is invalid", "Nothing is wrong"],
    correctIndex: 0
  },

  {
    type: "CODE OUTPUT", category: "Scope", difficulty: 2,
    prompt: "What will this JavaScript code output?",
    code: "let x = 5;\nfunction test() {\n  let x = 10;\n  return x;\n}\nconsole.log(test());",
    options: ["5", "10", "undefined", "Error"],
    correctIndex: 1
  },
  {
    type: "LOGIC", category: "Loops", difficulty: 2,
    prompt: "How many times will this loop execute?",
    code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
    options: ["4", "5", "6", "Infinite"],
    correctIndex: 1
  },
  {
    type: "CODE OUTPUT", category: "Arrays", difficulty: 2,
    prompt: "What does this code output?",
    code: "let arr = [1, 2, 3];\nconsole.log(arr.length);",
    options: ["2", "3", "4", "undefined"],
    correctIndex: 1
  },
  {
    type: "CONCEPT", category: "Complexity", difficulty: 2,
    prompt: "What is the time complexity of searching an unsorted array for a value?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    correctIndex: 2
  },
  {
    type: "DEBUGGING", category: "Logic", difficulty: 2,
    prompt: "This function should return the sum of an array, but it has a bug. What's wrong?",
    code: "function sum(arr) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}",
    options: ["Should be i < arr.length", "total should start at 1", "Missing return statement", "Arrays can't be looped over"],
    correctIndex: 0
  },
  {
    type: "CODE OUTPUT", category: "Booleans", difficulty: 2,
    prompt: "What will this code output?",
    code: "console.log(Boolean(\"\"));\nconsole.log(Boolean(\"false\"));",
    options: ["false, false", "true, true", "false, true", "true, false"],
    correctIndex: 2
  },
  {
    type: "CONCEPT", category: "Recursion", difficulty: 2,
    prompt: "What does every recursive function need to avoid infinite recursion?",
    options: ["A loop", "A base case", "A return type", "A global variable"],
    correctIndex: 1
  },

  {
    type: "CODE OUTPUT", category: "Closures", difficulty: 3,
    prompt: "What does this code output?",
    code: "function makeCounter() {\n  let count = 0;\n  return function () {\n    count++;\n    return count;\n  };\n}\nconst counter = makeCounter();\ncounter();\nconsole.log(counter());",
    options: ["1", "2", "undefined", "Error"],
    correctIndex: 1
  },
  {
    type: "LOGIC", category: "Async", difficulty: 3,
    prompt: "In what order will these lines print?",
    code: "console.log(\"A\");\nsetTimeout(() => console.log(\"B\"), 0);\nconsole.log(\"C\");",
    options: ["A, B, C", "A, C, B", "B, A, C", "C, B, A"],
    correctIndex: 1
  },
  {
    type: "CODE OUTPUT", category: "Type Coercion", difficulty: 3,
    prompt: "What does this code output?",
    code: "console.log([] + []);\nconsole.log([] + {});",
    options: ["0, 0", "\"\", \"[object Object]\"", "Error, Error", "undefined, undefined"],
    correctIndex: 1
  },
  {
    type: "DEBUGGING", category: "Recursion", difficulty: 3,
    prompt: "Why does this function crash with a stack overflow?",
    code: "function factorial(n) {\n  return n * factorial(n - 1);\n}",
    options: ["It's missing a base case", "It uses the wrong operator", "n should be a string", "Nothing is wrong"],
    correctIndex: 0
  },
  {
    type: "CONCEPT", category: "Complexity", difficulty: 3,
    prompt: "What is the time complexity of binary search on a sorted array?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctIndex: 2
  },
  {
    type: "CODE OUTPUT", category: "Hoisting", difficulty: 3,
    prompt: "What does this code output?",
    code: "console.log(a);\nvar a = 5;",
    options: ["5", "undefined", "ReferenceError", "null"],
    correctIndex: 1
  }
];

const MAX_ROUNDS = 8;
const MIN_ROUND_SECONDS = 3;
const MAX_ROUND_SECONDS = 60;
const DEFAULT_ROUND_SECONDS = 10;

function freshPlayerStats() {
  return { answered: 0, correct: 0, wrong: 0, timeSumMs: 0 };
}

const state = {
  mode: "local",
  onlineRole: null,
  players: {
    p1: { name: "PLAYER 1", score: 0 },
    p2: { name: "PLAYER 2", score: 0 }
  },
  questionBank: cloneQuestionBank(DEFAULT_QUESTION_BANK),

  settings: { roundSeconds: DEFAULT_ROUND_SECONDS, selectedIds: {} },

  lobbySelectedIds: {},
  matchSelection: null,
  roundSeconds: DEFAULT_ROUND_SECONDS,
  totalRounds: MAX_ROUNDS,
  roundQuestions: [],
  roundIndex: 0,
  currentQuestion: null,
  roundActive: false,
  roundStartTime: 0,
  timerRemaining: DEFAULT_ROUND_SECONDS,
  timerHandle: null,
  locked: { p1: false, p2: false },
  answerTime: { p1: null, p2: null },
  stats: { p1: freshPlayerStats(), p2: freshPlayerStats() },
  matchRecorded: false
};

function createQuestionId() {
  return "q_" + Math.random().toString(36).slice(2, 9);
}

function cloneQuestionBank(bank) {

  return bank.map((q) => ({ ...q, id: q.id || createQuestionId(), options: [...q.options] }));
}

function cloneSelection(selection) {
  return { ...selection };
}

function selectionOfAll(bank) {
  const selection = {};
  bank.forEach((q) => { selection[q.id] = true; });
  return selection;
}

function activeQuestionCount(bank, selection) {
  if (!selection) return bank.length;
  return bank.filter((q) => selection[q.id]).length;
}

state.settings.selectedIds = selectionOfAll(state.questionBank);
state.matchSelection = state.settings.selectedIds;

const SETTINGS_KEY = "codeclash.settings.v1";

function persistSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      roundSeconds: state.settings.roundSeconds,
      selectedIds: state.settings.selectedIds,
      questionBank: state.questionBank
    }));
  } catch (e) {  }
}

function restoreSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return;

    if (Array.isArray(saved.questionBank)) {
      const valid = saved.questionBank.filter((q) =>
        q && typeof q.prompt === "string" && Array.isArray(q.options) &&
        q.options.length >= 2 && Number.isInteger(q.correctIndex) &&
        q.correctIndex >= 0 && q.correctIndex < q.options.length);
      if (valid.length || saved.questionBank.length === 0) {
        state.questionBank = cloneQuestionBank(valid);
      }
    }

    const ids = {};
    state.questionBank.forEach((q) => {
      if (saved.selectedIds && saved.selectedIds[q.id]) ids[q.id] = true;
    });
    state.settings.selectedIds = saved.selectedIds ? ids : selectionOfAll(state.questionBank);
    state.matchSelection = state.settings.selectedIds;

    const secs = parseInt(saved.roundSeconds, 10);
    if (!isNaN(secs)) {
      state.settings.roundSeconds = Math.min(MAX_ROUND_SECONDS, Math.max(MIN_ROUND_SECONDS, secs));
      state.roundSeconds = state.settings.roundSeconds;
    }
    state.lobbySelectedIds = cloneSelection(state.settings.selectedIds);
  } catch (e) {  }
}

restoreSettings();

const net = {
  peer: null,
  conn: null,
  myAnswerBtnEls: {},
  myClickedIndex: undefined
};

function localPlayerKey() {
  if (state.mode !== "online") return null;
  return state.onlineRole === "host" ? "p1" : "p2";
}
function remotePlayerKey() {
  if (state.mode !== "online") return null;
  return state.onlineRole === "host" ? "p2" : "p1";
}

function el(id) {
  return document.getElementById(id);
}

const screens = {
  menu: el("screen-menu"),
  how: el("screen-how"),
  setup: el("screen-setup"),
  onlineMenu: el("screen-online-menu"),
  lobbyHost: el("screen-lobby-host"),
  lobbyJoin: el("screen-lobby-join"),
  vs: el("screen-vs"),
  game: el("screen-game"),
  roundResult: el("screen-round-result"),
  gameover: el("screen-gameover"),
  editor: el("screen-editor"),
  auth: el("screen-auth"),
  dashboard: el("screen-dashboard"),
  history: el("screen-history")
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
}

document.getElementById("btn-how").addEventListener("click", () => showScreen("how"));
document.getElementById("btn-how-back").addEventListener("click", () => showScreen("menu"));

document.getElementById("btn-local").addEventListener("click", () => {
  state.mode = "local";
  state.onlineRole = null;

  state.roundSeconds = state.settings.roundSeconds;
  state.matchSelection = state.settings.selectedIds;

  const signedIn = Store.currentUser();
  if (signedIn && !el("input-p1").value) el("input-p1").value = signedIn.name;
  updateSetupProfileHint();

  showScreen("setup");
});

document.getElementById("btn-setup-back").addEventListener("click", () => showScreen("menu"));

document.getElementById("btn-setup-continue").addEventListener("click", () => {
  const p1Input = document.getElementById("input-p1").value.trim();
  const p2Input = document.getElementById("input-p2").value.trim();

  state.players.p1.name = (p1Input || "PLAYER 1").toUpperCase().slice(0, 14);
  state.players.p2.name = (p2Input || "PLAYER 2").toUpperCase().slice(0, 14);

  document.getElementById("vs-name-p1").textContent = state.players.p1.name;
  document.getElementById("vs-name-p2").textContent = state.players.p2.name;
  document.getElementById("btn-vs-begin").hidden = false;
  document.getElementById("vs-waiting-text").hidden = true;
  renderVsRatings();

  showScreen("vs");
});

document.getElementById("btn-vs-begin").addEventListener("click", () => {
  if (state.mode === "local") {
    startMatch();
  } else if (state.mode === "online" && state.onlineRole === "host") {
    hostBeginBattle();
  }
});

document.getElementById("btn-online").addEventListener("click", () => {
  state.mode = "online";
  showScreen("onlineMenu");
});
document.getElementById("btn-online-back").addEventListener("click", () => {
  showScreen("menu");
});

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRoundQuestions(selection) {
  const bank = state.questionBank.length ? state.questionBank : DEFAULT_QUESTION_BANK;
  const selected = bank.filter((q) => !selection || selection[q.id]);

  const pool = selected.length ? selected : bank;

  const easy = shuffle(pool.filter((q) => q.difficulty === 1));
  const medium = shuffle(pool.filter((q) => q.difficulty === 2));
  const hard = shuffle(pool.filter((q) => q.difficulty === 3));
  const other = shuffle(pool.filter((q) => ![1, 2, 3].includes(q.difficulty)));
  let ordered = [...easy, ...medium, ...hard, ...other];
  if (ordered.length === 0) {
    ordered = shuffle(DEFAULT_QUESTION_BANK);
  }
  return ordered.slice(0, MAX_ROUNDS);
}

function resetMatchStats() {
  state.stats = { p1: freshPlayerStats(), p2: freshPlayerStats() };
  state.matchRecorded = false;
}

function startMatch() {
  state.players.p1.score = 0;
  state.players.p2.score = 0;
  state.roundIndex = 0;
  state.roundQuestions = buildRoundQuestions(state.matchSelection);
  state.totalRounds = Math.max(1, state.roundQuestions.length);
  resetMatchStats();

  document.getElementById("name-p1").textContent = state.players.p1.name;
  document.getElementById("name-p2").textContent = state.players.p2.name;
  tagLocalPlayerName();

  showScreen("game");
  startRound();
}

function tagLocalPlayerName() {

  document.querySelectorAll(".you-tag").forEach((el) => el.remove());
  if (state.mode !== "online") return;
  const key = localPlayerKey();
  const nameEl = document.getElementById(`name-${key}`);
  const tag = document.createElement("span");
  tag.className = "you-tag";
  tag.textContent = "YOU";
  nameEl.appendChild(tag);
}

function startRound() {
  const question = state.roundQuestions[state.roundIndex];
  state.currentQuestion = question;
  state.roundActive = true;
  state.locked.p1 = false;
  state.locked.p2 = false;
  state.answerTime.p1 = null;
  state.answerTime.p2 = null;
  state.timerRemaining = state.roundSeconds;
  state.roundStartTime = performance.now();
  net.myAnswerBtnEls = {};
  net.myClickedIndex = undefined;

  updateScoreboard();
  document.getElementById("hud-round").textContent = `${state.roundIndex + 1} / ${state.totalRounds}`;
  document.getElementById("hud-category").textContent = question.category.toUpperCase();

  renderQuestion(question);
  resetPlayerSideUI("p1");
  resetPlayerSideUI("p2");

  runTimer();

  if (state.mode === "online" && state.onlineRole === "host") {
    sendToGuest({
      type: "round_start",
      roundIndex: state.roundIndex,
      totalRounds: state.totalRounds,
      roundSeconds: state.roundSeconds,
      question,
      names: { p1: state.players.p1.name, p2: state.players.p2.name },
      scores: { p1: state.players.p1.score, p2: state.players.p2.score }
    });
  }
}

function renderQuestion(question) {
  const panel = document.querySelector(".question-panel");
  panel.classList.remove("q-transition");
  void panel.offsetWidth;
  panel.classList.add("q-transition");

  document.getElementById("question-type").textContent = question.type;
  document.getElementById("question-text").textContent = question.prompt;

  const codeEl = document.getElementById("question-code");
  if (question.code) {
    codeEl.textContent = question.code;
    codeEl.hidden = false;
  } else {
    codeEl.textContent = "";
    codeEl.hidden = true;
  }

  if (state.mode === "online") {
    const localKey = localPlayerKey();
    const remoteKey = remotePlayerKey();
    renderAnswerButtons(localKey, question, true);
    renderRemotePlaceholder(remoteKey);
  } else {
    renderAnswerButtons("p1", question, true);
    renderAnswerButtons("p2", question, true);
  }
}

function renderAnswerButtons(player, question, interactive) {
  const container = document.getElementById(`answers-${player}`);
  container.classList.remove("answer-area-remote");
  container.innerHTML = "";
  question.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.textContent = optionText;
    btn.dataset.index = String(index);
    if (interactive) {
      btn.addEventListener("click", () => handleLocalClick(player, index, btn));
    } else {
      btn.disabled = true;
    }
    container.appendChild(btn);
    if (state.mode === "online" && player === localPlayerKey()) {
      net.myAnswerBtnEls[index] = btn;
    }
  });
}

function renderRemotePlaceholder(player) {
  const container = document.getElementById(`answers-${player}`);
  container.innerHTML = "";
  container.classList.add("answer-area-remote");
  container.textContent = "Answering on their own device…";
}

function resetPlayerSideUI(player) {
  const side = document.getElementById(`side-${player}`);
  side.classList.remove("side-locked-good", "side-locked-bad");

  const status = document.getElementById(`status-${player}`);
  status.textContent = "WAITING...";
  status.classList.remove("status-good", "status-bad");

  document.getElementById(`time-${player}`).textContent = "";
}

function updateScoreboard() {
  document.getElementById("score-p1").textContent = state.players.p1.score;
  document.getElementById("score-p2").textContent = state.players.p2.score;
}

function updateTimerDisplay(remaining) {
  const ring = document.getElementById("timer-ring");
  const valueEl = document.getElementById("timer-value");
  valueEl.textContent = remaining.toFixed(1);
  ring.classList.remove("timer-warn", "timer-danger");
  if (remaining <= 3 && remaining > 1) {
    ring.classList.add("timer-warn");
  } else if (remaining <= 1) {
    ring.classList.add("timer-danger");
  }
}

function runTimer() {

  if (state.mode === "online" && state.onlineRole === "guest") return;

  updateTimerDisplay(state.timerRemaining);
  clearInterval(state.timerHandle);
  state.timerHandle = setInterval(() => {
    state.timerRemaining -= 0.1;
    if (state.timerRemaining < 0) state.timerRemaining = 0;

    updateTimerDisplay(state.timerRemaining);

    if (state.mode === "online" && state.onlineRole === "host") {
      sendToGuest({ type: "timer_tick", remaining: state.timerRemaining });
    }

    if (state.timerRemaining <= 0) {
      clearInterval(state.timerHandle);
      if (state.mode === "online") {
        endRoundHost("timeout", null);
      } else {
        endRoundLocal("timeout", null);
      }
    }
  }, 100);
}

function handleLocalClick(player, optionIndex, btnEl) {
  if (state.mode === "local") {
    resolveAnswerLocal(player, optionIndex, btnEl);
    return;
  }

  if (state.onlineRole === "host") {
    resolveAnswerHost(player, optionIndex, btnEl);
  } else {

    if (!state.roundActive || state.locked[player]) return;
    const elapsedMs = performance.now() - state.roundStartTime;
    state.answerTime[player] = elapsedMs;
    state.locked[player] = true;
    net.myClickedIndex = optionIndex;
    document.querySelectorAll(`#answers-${player} .answer-btn`).forEach((b) => (b.disabled = true));
    btnEl.classList.add("selected");
    setPlayerStatus(player, "SUBMITTED...", null);
    document.getElementById(`time-${player}`).textContent = `${(elapsedMs / 1000).toFixed(2)}s`;
    sendToHost({ type: "answer", optionIndex });
  }
}

function resolveAnswerLocal(player, optionIndex, btnEl) {
  if (!state.roundActive) return;
  if (state.locked[player]) return;

  const question = state.currentQuestion;
  const elapsedMs = performance.now() - state.roundStartTime;
  state.answerTime[player] = elapsedMs;

  const container = document.getElementById(`answers-${player}`);
  const buttons = container.querySelectorAll(".answer-btn");
  const isCorrect = optionIndex === question.correctIndex;
  document.getElementById(`time-${player}`).textContent = `${(elapsedMs / 1000).toFixed(2)}s`;
  addAnswerStat(player, isCorrect, elapsedMs);

  if (isCorrect) {
    btnEl.classList.add("correct-pick");
    buttons.forEach((b) => (b.disabled = true));
    setPlayerStatus(player, "CORRECT!", "status-good");
    document.getElementById(`side-${player}`).classList.add("side-locked-good");
    endRoundLocal("win", player);
    return;
  }

  btnEl.classList.add("wrong-pick");
  buttons.forEach((b) => (b.disabled = true));
  state.locked[player] = true;
  setPlayerStatus(player, "LOCKED OUT", "status-bad");
  document.getElementById(`side-${player}`).classList.add("side-locked-bad");

  const otherPlayer = player === "p1" ? "p2" : "p1";
  if (state.locked[otherPlayer]) {
    endRoundLocal("draw", null);
  }
}

function setPlayerStatus(player, text, cls) {
  const status = document.getElementById(`status-${player}`);
  status.textContent = text;
  status.classList.remove("status-good", "status-bad");
  if (cls) status.classList.add(cls);
}

function addAnswerStat(player, isCorrect, elapsedMs) {
  const stats = state.stats[player];
  if (!stats) return;
  stats.answered += 1;
  if (isCorrect) stats.correct += 1;
  else stats.wrong += 1;
  if (Number.isFinite(elapsedMs)) stats.timeSumMs += elapsedMs;
}

function endRoundLocal(reason, winner) {
  if (!state.roundActive) return;
  state.roundActive = false;
  clearInterval(state.timerHandle);

  revealCorrectAnswers();

  if (winner) state.players[winner].score += 1;

  ["p1", "p2"].forEach((player) => {
    if (state.answerTime[player] === null) {
      setPlayerStatus(player, reason === "timeout" ? "TIME UP" : "NO ANSWER", "status-bad");
    }
  });

  updateScoreboard();
  setTimeout(() => showRoundResult(reason, winner), 550);
}

function revealCorrectAnswers() {
  ["p1", "p2"].forEach((player) => {
    document.querySelectorAll(`#answers-${player} .answer-btn`).forEach((b) => (b.disabled = true));
    const correctBtn = document.querySelector(
      `#answers-${player} .answer-btn[data-index="${state.currentQuestion.correctIndex}"]`
    );
    if (correctBtn && !correctBtn.classList.contains("correct-pick")) {
      correctBtn.classList.add("reveal-correct");
    }
  });
}

function resolveAnswerHost(player, optionIndex, btnEl) {
  if (!state.roundActive || state.locked[player]) return;

  const question = state.currentQuestion;
  const elapsedMs = performance.now() - state.roundStartTime;
  state.answerTime[player] = elapsedMs;
  const isCorrect = optionIndex === question.correctIndex;

  document.getElementById(`time-${player}`).textContent = `${(elapsedMs / 1000).toFixed(2)}s`;
  addAnswerStat(player, isCorrect, elapsedMs);

  if (btnEl) {
    btnEl.classList.add(isCorrect ? "correct-pick" : "wrong-pick");
    document.querySelectorAll(`#answers-${player} .answer-btn`).forEach((b) => (b.disabled = true));
  }

  if (isCorrect) {
    setPlayerStatus(player, "CORRECT!", "status-good");
    document.getElementById(`side-${player}`).classList.add("side-locked-good");
    state.players[player].score += 1;
    sendToGuest({ type: "status_update", player, isCorrect: true, elapsedMs });
    endRoundHost("win", player);
    return;
  }

  setPlayerStatus(player, "LOCKED OUT", "status-bad");
  document.getElementById(`side-${player}`).classList.add("side-locked-bad");
  state.locked[player] = true;
  sendToGuest({ type: "status_update", player, isCorrect: false, elapsedMs });

  const otherPlayer = player === "p1" ? "p2" : "p1";
  if (state.locked[otherPlayer]) {
    endRoundHost("draw", null);
  }
}

function endRoundHost(reason, winner) {
  if (!state.roundActive) return;
  state.roundActive = false;
  clearInterval(state.timerHandle);

  revealCorrectAnswers();

  ["p1", "p2"].forEach((player) => {
    if (state.answerTime[player] === null) {
      setPlayerStatus(player, reason === "timeout" ? "TIME UP" : "NO ANSWER", "status-bad");
    }
  });

  updateScoreboard();

  sendToGuest({
    type: "round_end",
    reason,
    winner,
    correctIndex: state.currentQuestion.correctIndex,
    times: { p1: state.answerTime.p1, p2: state.answerTime.p2 },
    scores: { p1: state.players.p1.score, p2: state.players.p2.score },
    isFinalRound: state.roundIndex >= state.totalRounds - 1
  });

  setTimeout(() => showRoundResult(reason, winner), 550);
}

function showRoundResult(reason, winner) {
  const question = state.currentQuestion;
  const titleEl = document.getElementById("round-result-title");

  if (reason === "win") {
    titleEl.textContent = `${state.players[winner].name} WINS THE ROUND!`;
    titleEl.style.color = winner === "p1" ? "var(--p1)" : "var(--p2)";
  } else {
    titleEl.textContent = "DRAW!";
    titleEl.style.color = "var(--text-dim)";
  }

  document.getElementById("round-correct-answer").textContent =
    question.options[question.correctIndex];

  document.getElementById("result-name-p1").textContent = state.players.p1.name;
  document.getElementById("result-name-p2").textContent = state.players.p2.name;
  document.getElementById("result-time-p1").textContent = formatTime(state.answerTime.p1);
  document.getElementById("result-time-p2").textContent = formatTime(state.answerTime.p2);

  document.getElementById("result-score-p1").textContent = `${state.players.p1.name}: ${state.players.p1.score}`;
  document.getElementById("result-score-p2").textContent = `${state.players.p2.name}: ${state.players.p2.score}`;

  const nextBtn = document.getElementById("btn-next-round");
  const waitingText = document.getElementById("round-waiting-text");
  if (state.mode === "online" && state.onlineRole === "guest") {
    nextBtn.hidden = true;
    waitingText.hidden = false;
  } else {
    nextBtn.hidden = false;
    waitingText.hidden = true;
  }

  showScreen("roundResult");
}

function formatTime(ms) {
  if (ms === null || ms === undefined) return "NO ANSWER";
  return `${(ms / 1000).toFixed(2)}s`;
}

document.getElementById("btn-next-round").addEventListener("click", () => {
  advanceRound();
});

function advanceRound() {
  state.roundIndex += 1;
  if (state.roundIndex >= state.totalRounds) {
    showGameOver();
    if (state.mode === "online" && state.onlineRole === "host") {
      sendToGuest({ type: "game_over" });
    }
  } else {
    showScreen("game");
    startRound();
  }
}

function showGameOver() {
  const p1 = state.players.p1;
  const p2 = state.players.p2;

  document.getElementById("gameover-name-p1").textContent = p1.name;
  document.getElementById("gameover-name-p2").textContent = p2.name;
  document.getElementById("gameover-score-p1").textContent = p1.score;
  document.getElementById("gameover-score-p2").textContent = p2.score;

  const winnerEl = document.getElementById("gameover-winner");
  if (p1.score === p2.score) {
    winnerEl.textContent = "IT'S A DRAW!";
  } else {
    const winner = p1.score > p2.score ? p1 : p2;
    winnerEl.textContent = `🏆 ${winner.name} WINS!`;
  }

  const playAgainBtn = document.getElementById("btn-play-again");
  const waitingText = document.getElementById("gameover-waiting-text");
  if (state.mode === "online" && state.onlineRole === "guest") {
    playAgainBtn.hidden = true;
    waitingText.hidden = false;
  } else {
    playAgainBtn.hidden = false;
    waitingText.hidden = true;
  }

  recordFinishedMatch();
  refreshAccountUI();

  showScreen("gameover");
}

document.getElementById("btn-play-again").addEventListener("click", () => {
  if (state.mode === "online" && state.onlineRole === "host") {
    startMatch();
    showScreen("game");
  } else {
    startMatch();
  }
});

document.getElementById("btn-main-menu").addEventListener("click", () => {
  returnToMenu();
});

function returnToMenu() {
  clearInterval(state.timerHandle);
  teardownConnection();
  document.getElementById("input-p1").value = "";
  document.getElementById("input-p2").value = "";
  state.mode = "local";
  state.onlineRole = null;
  refreshAccountUI();
  showScreen("menu");
}

function generateLobbyCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function sendToGuest(msg) {
  if (net.conn && net.conn.open) net.conn.send(msg);
}
function sendToHost(msg) {
  if (net.conn && net.conn.open) net.conn.send(msg);
}

function teardownConnection() {
  if (net.conn) {
    try { net.conn.close(); } catch (e) {  }
    net.conn = null;
  }
  if (net.peer) {
    try { net.peer.destroy(); } catch (e) {  }
    net.peer = null;
  }
}

document.getElementById("btn-create-lobby").addEventListener("click", () => {
  state.onlineRole = "host";
  document.getElementById("host-name-step").hidden = false;
  document.getElementById("host-waiting-step").hidden = true;

  state.roundSeconds = state.settings.roundSeconds;
  state.lobbySelectedIds = cloneSelection(state.settings.selectedIds);
  state.matchSelection = state.lobbySelectedIds;
  syncLobbySettingsUI();

  const signedIn = Store.currentUser();
  if (signedIn && !document.getElementById("input-host-name").value) {
    document.getElementById("input-host-name").value = signedIn.name;
  }

  showScreen("lobbyHost");
});

document.getElementById("btn-host-back").addEventListener("click", () => showScreen("onlineMenu"));

document.getElementById("btn-host-cancel").addEventListener("click", () => {
  teardownConnection();
  showScreen("onlineMenu");
});

document.getElementById("btn-host-generate").addEventListener("click", () => {
  const nameInput = document.getElementById("input-host-name").value.trim();
  state.players.p1.name = (nameInput || "PLAYER 1").toUpperCase().slice(0, 14);

  document.getElementById("host-name-step").hidden = true;
  document.getElementById("host-waiting-step").hidden = false;
  document.getElementById("host-status-text").textContent = "Connecting to relay…";
  document.getElementById("host-guest-row").hidden = true;
  document.getElementById("btn-host-start").disabled = true;

  document.getElementById("host-settings-summary").textContent =
    `${state.roundSeconds}s rounds · ${activeQuestionCount(state.questionBank, state.matchSelection)} questions`;

  const code = "clash-" + generateLobbyCode();
  document.getElementById("lobby-code-display").textContent = code.replace("clash-", "");

  teardownConnection();
  net.peer = new Peer(code);

  net.peer.on("open", () => {
    document.getElementById("host-status-text").textContent = "Waiting for a player to join…";
  });

  net.peer.on("connection", (conn) => {
    net.conn = conn;
    wireHostConnection(conn);
  });

  net.peer.on("error", (err) => {
    if (String(err.type) === "unavailable-id") {
      document.getElementById("host-status-text").textContent = "That code is taken, generating a new one…";
      setTimeout(() => document.getElementById("btn-host-generate").click(), 400);
    } else {
      document.getElementById("host-status-text").textContent = "Connection error — check your internet and try again.";
    }
  });
});

function wireHostConnection(conn) {
  conn.on("open", () => {
    document.getElementById("host-status-text").textContent = "Player connected!";
  });

  conn.on("data", (msg) => {
    if (msg.type === "join") {
      state.players.p2.name = (msg.name || "PLAYER 2").toUpperCase().slice(0, 14);
      document.getElementById("host-guest-name").textContent = state.players.p2.name;
      document.getElementById("host-guest-row").hidden = false;
      document.getElementById("host-status-text").textContent = "Ready when you are.";
      document.getElementById("btn-host-start").disabled = false;
      return;
    }
    if (msg.type === "answer") {
      const player = remotePlayerKey();
      resolveAnswerHost(player, msg.optionIndex, null);
      return;
    }
  });

  conn.on("close", () => {
    document.getElementById("host-status-text").textContent = "The other player disconnected.";
    document.getElementById("btn-host-start").disabled = true;
  });
}

document.getElementById("btn-host-start").addEventListener("click", () => {
  document.getElementById("vs-name-p1").textContent = state.players.p1.name;
  document.getElementById("vs-name-p2").textContent = state.players.p2.name;
  document.getElementById("btn-vs-begin").hidden = false;
  document.getElementById("vs-waiting-text").hidden = true;
  renderVsRatings();

  sendToGuest({
    type: "match_start",
    names: { p1: state.players.p1.name, p2: state.players.p2.name }
  });

  showScreen("vs");
});

function hostBeginBattle() {
  startMatch();
}

document.getElementById("btn-join-lobby").addEventListener("click", () => {
  state.onlineRole = "guest";
  document.getElementById("join-form-step").hidden = false;
  document.getElementById("join-waiting-step").hidden = true;
  document.getElementById("join-error").hidden = true;

  const signedIn = Store.currentUser();
  if (signedIn && !document.getElementById("input-join-name").value) {
    document.getElementById("input-join-name").value = signedIn.name;
  }

  showScreen("lobbyJoin");
});

document.getElementById("btn-join-back").addEventListener("click", () => showScreen("onlineMenu"));

document.getElementById("btn-join-cancel").addEventListener("click", () => {
  teardownConnection();
  document.getElementById("join-form-step").hidden = false;
  document.getElementById("join-waiting-step").hidden = true;
});

document.getElementById("btn-join-connect").addEventListener("click", () => {
  const nameInput = document.getElementById("input-join-name").value.trim();
  const codeInput = document.getElementById("input-join-code").value.trim();
  const errorEl = document.getElementById("join-error");
  errorEl.hidden = true;

  if (!codeInput) {
    errorEl.textContent = "Enter a lobby code first.";
    errorEl.hidden = false;
    return;
  }

  state.players.p2.name = (nameInput || "PLAYER 2").toUpperCase().slice(0, 14);
  const fullCode = "clash-" + codeInput.toUpperCase().replace(/^CLASH-/, "");

  document.getElementById("join-form-step").hidden = true;
  document.getElementById("join-waiting-step").hidden = false;
  document.getElementById("join-status-text").textContent = "Connecting…";

  teardownConnection();
  net.peer = new Peer();

  net.peer.on("open", () => {
    const conn = net.peer.connect(fullCode, { reliable: true });
    net.conn = conn;
    wireGuestConnection(conn);
  });

  net.peer.on("error", (err) => {
    document.getElementById("join-status-text").textContent = "";
    errorEl.textContent = "Couldn't reach that lobby. Check the code and try again.";
    errorEl.hidden = false;
    document.getElementById("join-form-step").hidden = false;
    document.getElementById("join-waiting-step").hidden = true;
  });
});

function wireGuestConnection(conn) {
  conn.on("open", () => {
    document.getElementById("join-status-text").textContent = "Connected! Waiting for the host…";
    conn.send({ type: "join", name: state.players.p2.name });
  });

  conn.on("data", (msg) => {
    handleGuestMessage(msg);
  });

  conn.on("close", () => {
    document.getElementById("join-status-text").textContent = "The host disconnected.";
  });

  conn.on("error", () => {
    document.getElementById("join-status-text").textContent = "Connection lost.";
  });
}

function handleGuestMessage(msg) {
  switch (msg.type) {
    case "match_start": {
      state.players.p1.name = msg.names.p1;
      state.players.p2.name = msg.names.p2;
      document.getElementById("vs-name-p1").textContent = state.players.p1.name;
      document.getElementById("vs-name-p2").textContent = state.players.p2.name;
      document.getElementById("btn-vs-begin").hidden = true;
      document.getElementById("vs-waiting-text").hidden = false;
      renderVsRatings();
      resetMatchStats();
      showScreen("vs");
      break;
    }
    case "round_start": {
      state.roundIndex = msg.roundIndex;
      state.totalRounds = msg.totalRounds || state.totalRounds;
      state.roundSeconds = msg.roundSeconds || state.roundSeconds;
      state.currentQuestion = msg.question;
      state.roundActive = true;
      state.locked.p1 = false;
      state.locked.p2 = false;
      state.answerTime.p1 = null;
      state.answerTime.p2 = null;
      state.timerRemaining = state.roundSeconds;
      state.players.p1.score = msg.scores.p1;
      state.players.p2.score = msg.scores.p2;
      net.myAnswerBtnEls = {};
      net.myClickedIndex = undefined;

      document.getElementById("name-p1").textContent = state.players.p1.name;
      document.getElementById("name-p2").textContent = state.players.p2.name;
      tagLocalPlayerName();

      updateScoreboard();
      document.getElementById("hud-round").textContent = `${state.roundIndex + 1} / ${state.totalRounds}`;
      document.getElementById("hud-category").textContent = msg.question.category.toUpperCase();

      showScreen("game");
      renderQuestion(msg.question);
      resetPlayerSideUI("p1");
      resetPlayerSideUI("p2");
      updateTimerDisplay(state.roundSeconds);
      break;
    }
    case "timer_tick": {
      state.timerRemaining = msg.remaining;
      updateTimerDisplay(msg.remaining);
      break;
    }
    case "status_update": {
      const { player, isCorrect, elapsedMs } = msg;
      state.answerTime[player] = elapsedMs;
      document.getElementById(`time-${player}`).textContent = `${(elapsedMs / 1000).toFixed(2)}s`;
      setPlayerStatus(player, isCorrect ? "CORRECT!" : "LOCKED OUT", isCorrect ? "status-good" : "status-bad");
      document.getElementById(`side-${player}`).classList.add(isCorrect ? "side-locked-good" : "side-locked-bad");

      if (player === localPlayerKey()) addAnswerStat(player, isCorrect, elapsedMs);

      if (player === localPlayerKey() && net.myClickedIndex !== undefined) {
        const myBtn = net.myAnswerBtnEls[net.myClickedIndex];
        if (myBtn) {
          myBtn.classList.remove("selected");
          myBtn.classList.add(isCorrect ? "correct-pick" : "wrong-pick");
        }
      }
      if (isCorrect) state.locked[player] = true;
      break;
    }
    case "round_end": {
      state.roundActive = false;
      clearInterval(state.timerHandle);
      state.answerTime.p1 = msg.times.p1;
      state.answerTime.p2 = msg.times.p2;
      state.players.p1.score = msg.scores.p1;
      state.players.p2.score = msg.scores.p2;

      const myContainer = document.getElementById(`answers-${localPlayerKey()}`);
      myContainer.querySelectorAll(".answer-btn").forEach((b) => (b.disabled = true));
      const myCorrectBtn = myContainer.querySelector(`.answer-btn[data-index="${msg.correctIndex}"]`);
      if (myCorrectBtn && !myCorrectBtn.classList.contains("correct-pick") && !myCorrectBtn.classList.contains("wrong-pick")) {
        myCorrectBtn.classList.add("reveal-correct");
      }
      if (myCorrectBtn && myCorrectBtn.classList.contains("wrong-pick")) {

      }

      ["p1", "p2"].forEach((player) => {
        if (state.answerTime[player] === null) {
          setPlayerStatus(player, msg.reason === "timeout" ? "TIME UP" : "NO ANSWER", "status-bad");
        }
      });

      updateScoreboard();
      setTimeout(() => showRoundResult(msg.reason, msg.winner), 550);
      break;
    }
    case "game_over": {
      showGameOver();
      break;
    }
  }
}

const authState = { mode: null, busy: false };

function formatPercent(value) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

function formatSpeed(ms) {
  if (!Number.isFinite(ms)) return "—";
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function buildTag(text) {
  const span = document.createElement("span");
  span.className = "match-tag";
  span.textContent = text;
  return span;
}

function refreshAccountUI() {
  const user = Store.currentUser();
  const nameEl = el("menu-account-name");
  const tierEl = el("menu-account-tier");
  const ratingEl = el("menu-account-rating");

  if (!user) {
    nameEl.textContent = "—";
    ratingEl.textContent = "—";
    tierEl.textContent = "SIGNED OUT";
    tierEl.className = "account-chip-tier";
    return;
  }

  nameEl.textContent = user.name;
  ratingEl.textContent = user.rating;

  const tier = user.stats.tier;
  tierEl.textContent = tier.name;
  tierEl.className = `account-chip-tier ${tier.className}`;
}

function syncQuestionCounts() {
  const total = state.questionBank.length;

  el("dash-question-count").textContent = activeQuestionCount(state.questionBank, state.settings.selectedIds);
  el("dash-question-total").textContent = total;
  el("lobby-question-count").textContent = activeQuestionCount(state.questionBank, state.lobbySelectedIds);
  el("lobby-question-total").textContent = total;
  el("editor-question-count").textContent = editorActiveCount();
  el("editor-question-total").textContent = total;
}

function syncSettingsUI() {
  const timerInput = el("dash-round-seconds");
  if (timerInput) timerInput.value = state.settings.roundSeconds;
  syncQuestionCounts();
}

function syncLobbySettingsUI() {
  const timerInput = el("lobby-round-seconds");
  if (timerInput) timerInput.value = state.roundSeconds;
  syncQuestionCounts();
}

function clearAuthMessages() {
  const errorEl = el("auth-error");
  const infoEl = el("auth-info");
  errorEl.hidden = true;
  errorEl.textContent = "";
  infoEl.hidden = true;
  infoEl.textContent = "";
}

function showAuthError(message) {
  const errorEl = el("auth-error");
  errorEl.textContent = message;
  errorEl.hidden = false;
  el("auth-info").hidden = true;
}

function showAuthInfo(message) {
  const infoEl = el("auth-info");
  infoEl.textContent = message;
  infoEl.hidden = false;
  el("auth-error").hidden = true;
}

function authSubmitLabel() {
  return authState.mode === "register" ? "REGISTER" : "LOG IN";
}

function setAuthBusy(busy) {
  authState.busy = busy;
  const submit = el("btn-auth-submit");
  submit.disabled = busy;
  submit.textContent = busy
    ? (authState.mode === "register" ? "CREATING…" : "CHECKING…")
    : authSubmitLabel();
}

function setAuthMode(mode) {
  authState.mode = mode === "register" ? "register" : mode === "login" ? "login" : null;

  const isLogin = authState.mode === "login";
  const isRegister = authState.mode === "register";
  const chosen = isLogin || isRegister;

  const loginBtn = el("tab-login");
  const registerBtn = el("tab-register");
  loginBtn.classList.toggle("active", isLogin);
  registerBtn.classList.toggle("active", isRegister);
  loginBtn.setAttribute("aria-pressed", String(isLogin));
  registerBtn.setAttribute("aria-pressed", String(isRegister));

  el("auth-panel").hidden = !chosen;
  el("auth-form").hidden = !chosen;
  el("auth-confirm-row").hidden = !isRegister;

  const heading = el("auth-form-heading");
  heading.textContent = isRegister ? "CREATE YOUR PROFILE" : "WELCOME BACK";
  heading.hidden = !chosen;

  el("input-auth-password").setAttribute("autocomplete", isLogin ? "current-password" : "new-password");

  setAuthBusy(false);
  clearAuthMessages();

  if (chosen && screens.auth.classList.contains("active")) el("input-auth-name").focus();
}

function showLanding() {
  el("input-auth-name").value = "";
  el("input-auth-password").value = "";
  el("input-auth-confirm").value = "";

  // Someone already registered on this device: go straight to the LOG IN page.
  const hasAccounts = Store.hasUsers();
  setAuthMode(hasAccounts ? "login" : null);
  if (hasAccounts) el("input-auth-name").value = Store.lastCallsign();

  if (!Store.cryptoAvailable()) {
    showAuthError(
      "This browser blocked secure password hashing, so profiles are unavailable. Open the game over http://localhost or https:// (or use a current browser) and reload."
    );
  } else if (!Store.canPersist()) {
    showAuthInfo("Storage is blocked here, so a profile will only last until you close this tab.");
  }

  showScreen("auth");
  if (authState.mode) {
    (el("input-auth-name").value ? el("input-auth-password") : el("input-auth-name")).focus();
  } else {
    el("tab-login").focus();
  }
}

function signOutPlayer() {
  Store.signOut();
  refreshAccountUI();
  showLanding();
}

el("tab-login").addEventListener("click", () => setAuthMode("login"));
el("tab-register").addEventListener("click", () => setAuthMode("register"));
el("btn-sign-out").addEventListener("click", signOutPlayer);

el("auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (authState.busy) return;

  if (!authState.mode) {
    setAuthMode("login");
    return;
  }

  clearAuthMessages();

  const name = el("input-auth-name").value;
  const password = el("input-auth-password").value;

  if (!Store.cryptoAvailable()) {
    showAuthError("Secure password hashing isn't available here. Open the game over http://localhost or https://.");
    return;
  }

  if (authState.mode === "register") {
    const passwordCheck = Store.validatePassword(password);
    if (passwordCheck.ok && el("input-auth-confirm").value !== password) {
      showAuthError("Those passwords don't match.");
      return;
    }
  }

  const wasRegister = authState.mode === "register";
  setAuthBusy(true);
  const result = wasRegister
    ? await Store.signUp(name, password)
    : await Store.signIn(name, password);
  setAuthBusy(false);

  if (!result.ok) {
    showAuthError(result.error);
    return;
  }

  el("input-auth-password").value = "";
  el("input-auth-confirm").value = "";

  if (wasRegister) {
    // Registration done: send the player to the LOG IN page with their callsign filled in.
    setAuthMode("login");
    el("input-auth-name").value = result.user.name;
    showAuthInfo(
      result.persisted === false
        ? "Profile created — but storage is blocked, so it lasts only until you close this tab. Log in to continue."
        : "Profile created! Log in to continue."
    );
    el("input-auth-password").focus();
    return;
  }

  refreshAccountUI();
  openDashboard();
});

function openDashboard() {
  const user = Store.currentUser();
  if (!user) {
    showLanding();
    return;
  }
  renderDashboard(user);
  refreshAccountUI();
  showScreen("dashboard");
}

function renderDashboard(user) {
  const stats = user.stats;

  el("dash-name").textContent = user.name;
  el("dash-since").textContent = `MEMBER SINCE ${formatDate(user.createdAt).toUpperCase()}`;
  el("dash-rating").textContent = user.rating;
  el("dash-peak").textContent = `PEAK ${user.peakRating}`;

  const tierEl = el("dash-tier");
  tierEl.textContent = stats.tier.name;
  tierEl.className = `dash-tier ${stats.tier.className}`;

  el("stat-matches").textContent = stats.matches;
  el("stat-wins").textContent = stats.wins;
  el("stat-losses").textContent = stats.losses;
  el("stat-draws").textContent = stats.draws;
  el("stat-winrate").textContent = formatPercent(stats.winRate);
  el("stat-streak").textContent = stats.streak;
  el("stat-best").textContent = stats.bestStreak;
  el("stat-accuracy").textContent = formatPercent(stats.accuracy);
  el("stat-speed").textContent = formatSpeed(stats.avgAnswerMs);

  renderMatchList(el("dash-recent"), Store.historyFor(user.id, 3), {
    emptyText: "No rated matches yet. Play with a registered callsign to start your record."
  });
  renderLeaderboard(user.id);
  syncSettingsUI();
}

function renderLeaderboard(currentUserId) {
  const container = el("dash-leaderboard");
  const rows = Store.leaderboard();
  container.innerHTML = "";

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No profiles on this device yet.";
    container.appendChild(empty);
    return;
  }

  rows.forEach((row, index) => {
    const line = document.createElement("div");
    line.className = "leader-row" + (row.id === currentUserId ? " is-me" : "");

    const rank = document.createElement("span");
    rank.className = "leader-rank";
    rank.textContent = `#${index + 1}`;

    const name = document.createElement("span");
    name.className = "leader-name";
    name.textContent = row.id === currentUserId ? `${row.name} (YOU)` : row.name;

    const record = document.createElement("span");
    record.className = "leader-record";
    record.textContent = row.matches ? `${row.wins}W · ${row.losses}L` : "NO MATCHES";

    const rating = document.createElement("span");
    rating.className = "leader-rating";
    rating.textContent = row.rating;

    line.append(rank, name, record, rating);
    container.appendChild(line);
  });
}

function openHistory() {
  const user = Store.currentUser();
  if (!user) {
    showLanding();
    return;
  }
  renderHistory(user);
  showScreen("history");
}

function renderHistory(user) {
  const matches = Store.historyFor(user.id);
  const wins = matches.filter((m) => m.outcome === "win").length;
  const losses = matches.filter((m) => m.outcome === "loss").length;
  const draws = matches.filter((m) => m.outcome === "draw").length;

  el("history-count").textContent = `${matches.length} MATCH${matches.length === 1 ? "" : "ES"}`;
  el("history-record").textContent = `${wins}W · ${losses}L · ${draws}D`;
  el("btn-history-clear").disabled = matches.length === 0;

  renderMatchList(el("history-list"), matches, {
    emptyText: "Nothing here yet — finish a match while signed in and it shows up."
  });
}

function renderMatchList(container, matches, options) {
  const opts = options || {};
  container.innerHTML = "";

  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = opts.emptyText || "No matches yet.";
    container.appendChild(empty);
    return;
  }

  matches.forEach((match) => container.appendChild(buildMatchCard(match)));
}

function buildMatchCard(match) {
  const card = document.createElement("div");
  card.className = `match-card result-${match.outcome}`;

  const main = document.createElement("div");
  main.className = "match-main";

  const opponent = document.createElement("div");
  opponent.className = "match-opponent";
  opponent.textContent = `vs ${match.opponentName}`;

  const meta = document.createElement("div");
  meta.className = "match-meta";
  meta.appendChild(buildTag(match.mode === "online" ? "ONLINE" : "LOCAL"));
  meta.appendChild(buildTag(formatDateTime(match.playedAt)));
  if (Number.isFinite(match.accuracy)) meta.appendChild(buildTag(`${Math.round(match.accuracy * 100)}% ACC`));
  if (Number.isFinite(match.avgAnswerMs)) meta.appendChild(buildTag(`${formatSpeed(match.avgAnswerMs)} AVG`));
  if (!match.opponentRated) meta.appendChild(buildTag("UNRATED OPPONENT"));

  main.append(opponent, meta);

  const score = document.createElement("div");
  score.className = "match-score";
  score.textContent = `${match.myScore}–${match.oppScore}`;

  const delta = document.createElement("div");
  const trend = match.delta > 0 ? "delta-up" : match.delta < 0 ? "delta-down" : "delta-flat";
  delta.className = `match-delta ${trend}`;
  delta.textContent = match.delta > 0 ? `+${match.delta}` : String(match.delta);
  delta.title = `${match.ratingBefore} → ${match.ratingAfter}`;

  const outcome = document.createElement("div");
  outcome.className = `match-outcome outcome-${match.outcome}`;
  outcome.textContent = match.outcome.toUpperCase();

  card.append(main, score, delta, outcome);
  return card;
}

el("btn-menu-dashboard").addEventListener("click", openDashboard);
el("btn-menu-history").addEventListener("click", openHistory);
el("btn-dash-settings").addEventListener("click", () => openEditor("dashboard"));
el("btn-dash-sign-out").addEventListener("click", signOutPlayer);
el("btn-remove-others").addEventListener("click", () => {
  const user = Store.currentUser();
  if (!user) return;
  const others = Store.leaderboard().filter((row) => row.id !== user.id).length;
  if (!others) {
    alert("There are no other profiles to remove.");
    return;
  }
  if (!confirm(`Permanently delete ${others} other profile${others === 1 ? "" : "s"} and their match history? Only ${user.name} will be kept. This can't be undone.`)) return;
  Store.removeOtherUsers(user.id);
  renderDashboard(user);
});
el("btn-dash-menu").addEventListener("click", () => {
  refreshAccountUI();
  showScreen("menu");
});
el("btn-history-back").addEventListener("click", () => {
  refreshAccountUI();
  showScreen("menu");
});
function clampRoundSeconds(raw) {
  let value = parseInt(raw, 10);
  if (isNaN(value)) value = DEFAULT_ROUND_SECONDS;
  return Math.min(MAX_ROUND_SECONDS, Math.max(MIN_ROUND_SECONDS, value));
}

el("dash-round-seconds").addEventListener("change", (event) => {
  state.settings.roundSeconds = clampRoundSeconds(event.target.value);
  event.target.value = state.settings.roundSeconds;
  persistSettings();
});

el("lobby-round-seconds").addEventListener("change", (event) => {
  state.roundSeconds = clampRoundSeconds(event.target.value);
  event.target.value = state.roundSeconds;
});

el("btn-lobby-questions").addEventListener("click", () => openEditor("lobbyHost"));

el("btn-history-clear").addEventListener("click", () => {
  const user = Store.currentUser();
  if (!user) return;
  const matches = Store.historyFor(user.id);
  if (!matches.length) return;
  if (!confirm(`Delete all ${matches.length} matches from your history? Your rating and stats stay as they are.`)) return;
  Store.clearHistory(user.id);
  renderHistory(user);
});

function recordFinishedMatch() {
  if (state.matchRecorded) return;
  state.matchRecorded = true;

  const signedIn = Store.currentUser();

  const players = ["p1", "p2"].map((key) => ({
    name: state.players[key].name,
    score: state.players[key].score,
    correct: state.stats[key].correct,
    wrong: state.stats[key].wrong,
    answered: state.stats[key].answered,
    timeSumMs: state.stats[key].timeSumMs
  }));

  let onlyIndex = -1;
  if (state.mode === "online") {
    if (!signedIn) {
      renderRatingOutcome(false, []);
      return;
    }

    onlyIndex = localPlayerKey() === "p2" ? 1 : 0;
    players[onlyIndex].name = signedIn.name;
  }

  const result = Store.recordMatch({ mode: state.mode, players, onlyIndex });
  renderRatingOutcome(!!signedIn, result.recorded, result.persisted);
}

function renderRatingOutcome(signedIn, recorded, persisted) {
  const wrap = el("gameover-rating");
  const rows = el("gameover-rating-rows");
  const note = el("gameover-guest-note");
  rows.innerHTML = "";

  if (!recorded.length) {
    wrap.hidden = true;
    note.hidden = false;
    note.textContent = signedIn
      ? "This match wasn't rated: in a local match a callsign has to match a profile registered on this device."
      : "Sign in to have your matches rated and saved to your dashboard.";
    return;
  }

  note.hidden = true;
  wrap.hidden = false;

  recorded.forEach((record) => {
    const row = document.createElement("div");
    row.className = "rating-row";

    const name = document.createElement("span");
    name.className = "rating-row-name";
    name.textContent = record.name;

    const values = document.createElement("span");
    values.className = "rating-row-values";

    const delta = document.createElement("span");
    const trend = record.delta > 0 ? "delta-up" : record.delta < 0 ? "delta-down" : "delta-flat";
    delta.className = `match-delta ${trend}`;
    delta.textContent = record.delta > 0 ? `+${record.delta}` : String(record.delta);

    const after = document.createElement("span");
    after.className = "rating-row-new";
    after.textContent = `${record.ratingBefore} → ${record.ratingAfter}`;

    values.append(delta, after);
    row.append(name, values);
    rows.appendChild(row);
  });

  if (persisted === false) {
    const warn = document.createElement("div");
    warn.className = "match-meta";
    warn.textContent = "Storage is blocked — this result is kept for this tab only.";
    rows.appendChild(warn);
  }
}

function renderVsRatings() {
  ["p1", "p2"].forEach((key) => {
    const chip = el(`vs-rating-${key}`);
    const profile = Store.profileForName(state.players[key].name);
    if (!chip) return;
    chip.textContent = profile ? `${profile.rating} · ${profile.stats.tier.name}` : "UNRATED";
    chip.hidden = false;
  });
}

function updateSetupProfileHint() {
  const hint = el("setup-profile-hint");
  if (!hint) return;

  const found = [el("input-p1").value, el("input-p2").value]
    .map((name) => Store.profileForName(name))
    .filter((profile, index, list) => profile && list.indexOf(profile) === index);

  if (!found.length) {
    hint.hidden = true;
    hint.textContent = "";
    return;
  }

  hint.hidden = false;
  hint.textContent = `Rated profile${found.length > 1 ? "s" : ""} matched: ${found
    .map((profile) => `${profile.name} (${profile.rating})`)
    .join(", ")}.`;
}

el("input-p1").addEventListener("input", updateSetupProfileHint);
el("input-p2").addEventListener("input", updateSetupProfileHint);

function bootProfileLayer() {
  const user = Store.currentUser();
  refreshAccountUI();
  setAuthMode(null);

  if (user) {
    renderDashboard(user);
    showScreen("dashboard");
  } else {
    showLanding();
  }
}


const DIFFICULTY_LABELS = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };

const editorState = {
  editingIndex: null,
  returnScreen: "dashboard"
};

function editorSelection() {
  return editorState.returnScreen === "lobbyHost" ? state.lobbySelectedIds : state.settings.selectedIds;
}

function editorActiveCount() {
  return activeQuestionCount(state.questionBank, editorSelection());
}

document.getElementById("btn-editor-done").addEventListener("click", () => {

  if (editorState.returnScreen === "lobbyHost") {
    syncLobbySettingsUI();
    showScreen("lobbyHost");
  } else {
    openDashboard();
  }
});

document.getElementById("btn-editor-reset").addEventListener("click", () => {
  if (!confirm("Reset all questions, the timer and both question sets back to the built-in defaults? This can't be undone.")) return;
  state.questionBank = cloneQuestionBank(DEFAULT_QUESTION_BANK);
  state.settings.roundSeconds = DEFAULT_ROUND_SECONDS;
  state.settings.selectedIds = selectionOfAll(state.questionBank);
  state.lobbySelectedIds = cloneSelection(state.settings.selectedIds);
  state.matchSelection = state.settings.selectedIds;
  state.roundSeconds = DEFAULT_ROUND_SECONDS;
  renderEditorQuestionList();
  syncSettingsUI();
  syncLobbySettingsUI();
  persistSettings();
});

document.getElementById("btn-editor-add").addEventListener("click", () => openQuestionForm(null));

function openEditor(returnScreen) {
  editorState.returnScreen = returnScreen || "dashboard";

  el("editor-target-hint").textContent = editorState.returnScreen === "lobbyHost"
    ? "Choosing the questions for the lobby you're about to host. Pause one to leave it out of this match only — your guest plays exactly the active set."
    : "Your default question set. It is used by local matches and by every new lobby you create.";

  showEditorListView();
  renderEditorQuestionList();
  syncQuestionCounts();
  showScreen("editor");
}

function showEditorListView() {
  document.getElementById("editor-list-view").hidden = false;
  document.getElementById("editor-form-view").hidden = true;
}

function showEditorFormView() {
  document.getElementById("editor-list-view").hidden = true;
  document.getElementById("editor-form-view").hidden = false;
}

function renderEditorQuestionList() {
  const listEl = document.getElementById("editor-question-list");
  syncQuestionCounts();
  listEl.innerHTML = "";

  if (state.questionBank.length === 0) {
    const empty = document.createElement("div");
    empty.className = "editor-empty-state";
    empty.textContent = "No questions yet — add one, or reset to defaults.";
    listEl.appendChild(empty);
    return;
  }

  if (editorActiveCount() === 0) {
    const warning = document.createElement("div");
    warning.className = "editor-warning";
    warning.textContent = "Every question is paused. Until you activate one, matches fall back to the whole bank.";
    listEl.appendChild(warning);
  }

  state.questionBank.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "editor-question-card";

    const meta = document.createElement("div");
    meta.className = "editor-question-meta";

    const tags = document.createElement("div");
    tags.className = "editor-question-tags";

    const typeTag = document.createElement("span");
    typeTag.className = "editor-tag";
    typeTag.textContent = q.type || "QUESTION";

    const diffTag = document.createElement("span");
    diffTag.className = `editor-tag editor-tag-diff-${q.difficulty || 1}`;
    diffTag.textContent = DIFFICULTY_LABELS[q.difficulty] || "EASY";

    const catTag = document.createElement("span");
    catTag.className = "editor-tag";
    catTag.textContent = q.category || "General";

    tags.append(typeTag, diffTag, catTag);

    const promptEl = document.createElement("div");
    promptEl.className = "editor-question-prompt";
    promptEl.textContent = q.prompt;

    meta.append(tags, promptEl);

    const isActive = !!editorSelection()[q.id];
    if (!isActive) card.classList.add("is-paused");

    const actions = document.createElement("div");
    actions.className = "editor-question-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "editor-icon-btn editor-toggle-btn" + (isActive ? " is-active" : "");
    toggleBtn.textContent = isActive ? "ACTIVE" : "PAUSED";
    toggleBtn.setAttribute("aria-pressed", String(isActive));
    toggleBtn.title = isActive
      ? "Pause: leave this question out of the set"
      : "Activate: include this question in the set";
    toggleBtn.addEventListener("click", () => toggleQuestionSelection(index));

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "editor-icon-btn";
    editBtn.textContent = "EDIT";
    editBtn.addEventListener("click", () => openQuestionForm(index));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "editor-icon-btn editor-icon-btn-danger";
    delBtn.textContent = "DELETE";
    delBtn.addEventListener("click", () => deleteQuestionFromList(index));

    actions.append(toggleBtn, editBtn, delBtn);
    card.append(meta, actions);
    listEl.appendChild(card);
  });
}

function toggleQuestionSelection(index) {
  const question = state.questionBank[index];
  if (!question) return;

  const selection = editorSelection();
  if (selection[question.id]) delete selection[question.id];
  else selection[question.id] = true;

  persistSettings();
  renderEditorQuestionList();
  syncQuestionCounts();
}

function forgetQuestion(question) {
  if (!question || !question.id) return;
  delete state.settings.selectedIds[question.id];
  delete state.lobbySelectedIds[question.id];
  if (state.matchSelection) delete state.matchSelection[question.id];
}

function deleteQuestionFromList(index) {
  const q = state.questionBank[index];
  if (!confirm(`Delete this question?\n\n"${q.prompt}"`)) return;
  forgetQuestion(q);
  state.questionBank.splice(index, 1);
  persistSettings();
  renderEditorQuestionList();
}

function openQuestionForm(index) {
  editorState.editingIndex = index;
  const isEdit = index !== null;

  document.getElementById("editor-form-title").textContent = isEdit ? "EDIT QUESTION" : "ADD QUESTION";
  document.getElementById("btn-editor-delete").hidden = !isEdit;
  document.getElementById("editor-form-error").hidden = true;

  const q = isEdit ? state.questionBank[index] : null;

  document.getElementById("input-q-type").value = q ? q.type : "";
  document.getElementById("input-q-category").value = q ? q.category : "";
  document.getElementById("input-q-difficulty").value = q ? String(q.difficulty || 1) : "1";
  document.getElementById("input-q-prompt").value = q ? q.prompt : "";
  document.getElementById("input-q-code").value = q && q.code ? q.code : "";

  const options = q ? q.options.slice() : ["", ""];
  const correctIndex = q ? q.correctIndex : 0;
  renderOptionRows(options, correctIndex);

  showEditorFormView();
}

function renderOptionRows(options, correctIndex) {
  const listEl = document.getElementById("editor-options-list");
  listEl.innerHTML = "";
  options.forEach((text, index) => {
    listEl.appendChild(buildOptionRow(text, index === correctIndex));
  });
  updateOptionRowControls();
}

function buildOptionRow(text, isCorrect) {
  const row = document.createElement("div");
  row.className = "editor-option-row" + (isCorrect ? " is-correct" : "");

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "correct-option";
  radio.className = "editor-option-radio";
  radio.checked = isCorrect;
  radio.addEventListener("change", () => {
    document.querySelectorAll(".editor-option-row").forEach((r) => r.classList.remove("is-correct"));
    row.classList.add("is-correct");
  });

  const input = document.createElement("input");
  input.type = "text";
  input.className = "setup-input editor-option-input";
  input.maxLength = 120;
  input.placeholder = "Answer option";
  input.value = text || "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "editor-option-remove";
  removeBtn.setAttribute("aria-label", "Remove option");
  removeBtn.textContent = "✕";
  removeBtn.addEventListener("click", () => {
    const wasChecked = radio.checked;
    row.remove();
    updateOptionRowControls();

    if (wasChecked) {
      const firstRadio = document.querySelector(".editor-option-radio");
      if (firstRadio) {
        firstRadio.checked = true;
        firstRadio.closest(".editor-option-row").classList.add("is-correct");
      }
    }
  });

  row.append(radio, input, removeBtn);
  return row;
}

function updateOptionRowControls() {
  const rows = document.querySelectorAll(".editor-option-row");
  const disableRemove = rows.length <= 2;
  rows.forEach((row) => {
    row.querySelector(".editor-option-remove").disabled = disableRemove;
  });
  document.getElementById("btn-editor-add-option").disabled = rows.length >= 6;
}

document.getElementById("btn-editor-add-option").addEventListener("click", () => {
  const listEl = document.getElementById("editor-options-list");
  if (listEl.children.length >= 6) return;
  listEl.appendChild(buildOptionRow("", false));
  updateOptionRowControls();
});

document.getElementById("btn-editor-cancel").addEventListener("click", () => showEditorListView());

document.getElementById("btn-editor-delete").addEventListener("click", () => {
  if (editorState.editingIndex === null) return;
  const q = state.questionBank[editorState.editingIndex];
  if (!confirm(`Delete this question?\n\n"${q.prompt}"`)) return;
  forgetQuestion(q);
  state.questionBank.splice(editorState.editingIndex, 1);
  persistSettings();
  renderEditorQuestionList();
  showEditorListView();
});

document.getElementById("btn-editor-save").addEventListener("click", () => {
  const errorEl = document.getElementById("editor-form-error");
  errorEl.hidden = true;

  const type = document.getElementById("input-q-type").value.trim().toUpperCase() || "QUESTION";
  const category = document.getElementById("input-q-category").value.trim() || "General";
  const difficulty = parseInt(document.getElementById("input-q-difficulty").value, 10) || 1;
  const prompt = document.getElementById("input-q-prompt").value.trim();
  const code = document.getElementById("input-q-code").value.trim();

  const optionRows = Array.from(document.querySelectorAll(".editor-option-row"));
  const options = optionRows.map((row) => row.querySelector(".editor-option-input").value.trim());
  const correctRowIndex = optionRows.findIndex((row) => row.querySelector(".editor-option-radio").checked);

  if (!prompt) {
    errorEl.textContent = "Enter a question prompt.";
    errorEl.hidden = false;
    return;
  }
  if (options.some((o) => o.length === 0)) {
    errorEl.textContent = "Fill in every option, or remove the empty one.";
    errorEl.hidden = false;
    return;
  }
  if (options.length < 2) {
    errorEl.textContent = "Enter at least two answer options.";
    errorEl.hidden = false;
    return;
  }
  if (correctRowIndex === -1) {
    errorEl.textContent = "Pick which option is the correct answer.";
    errorEl.hidden = false;
    return;
  }

  const existing = editorState.editingIndex !== null ? state.questionBank[editorState.editingIndex] : null;
  const question = {
    id: existing ? existing.id : createQuestionId(),
    type,
    category,
    difficulty,
    prompt,
    options,
    correctIndex: correctRowIndex
  };
  if (code) question.code = code;

  if (existing) {
    state.questionBank[editorState.editingIndex] = question;
  } else {
    state.questionBank.push(question);
    editorSelection()[question.id] = true;
  }

  persistSettings();
  renderEditorQuestionList();
  syncQuestionCounts();
  showEditorListView();
});

// Start only after the whole script has loaded and saved accounts have been restored.
Store.ready().then(bootProfileLayer);