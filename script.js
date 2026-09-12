/* ==========================================================================
   CODE CLASH — game logic
   Two modes:
     - "local"  : hotseat, both players share one screen (original mode)
     - "online" : two browsers connected peer-to-peer via PeerJS. The lobby
                  HOST is always Player 1 and is the authoritative referee —
                  it deals questions, runs the timer, and judges answers.
                  The GUEST is always Player 2 and sends its answer clicks
                  to the host, then mirrors whatever the host broadcasts.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* QUESTION BANK                                                          */
/* ---------------------------------------------------------------------- */

const QUESTION_BANK = [
  // ---- EASY ----
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

  // ---- MEDIUM ----
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

  // ---- HARD ----
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

const TOTAL_ROUNDS = 8;
const ROUND_SECONDS = 10;

/* ---------------------------------------------------------------------- */
/* STATE                                                                  */
/* ---------------------------------------------------------------------- */

const state = {
  mode: "local",          // "local" | "online"
  onlineRole: null,       // "host" | "guest"
  players: {
    p1: { name: "PLAYER 1", score: 0 },
    p2: { name: "PLAYER 2", score: 0 }
  },
  roundQuestions: [],
  roundIndex: 0,
  currentQuestion: null,
  roundActive: false,
  roundStartTime: 0,
  timerRemaining: ROUND_SECONDS,
  timerHandle: null,
  locked: { p1: false, p2: false },
  answerTime: { p1: null, p2: null }
};

// Networking state, kept separate from game state.
const net = {
  peer: null,
  conn: null,
  myAnswerBtnEls: {},     // index -> button element, for the local interactive side, so we can style it once the host confirms the outcome
  myClickedIndex: undefined // guest only: which option this client clicked, awaiting host confirmation
};

function localPlayerKey() {
  if (state.mode !== "online") return null;
  return state.onlineRole === "host" ? "p1" : "p2";
}
function remotePlayerKey() {
  if (state.mode !== "online") return null;
  return state.onlineRole === "host" ? "p2" : "p1";
}

/* ---------------------------------------------------------------------- */
/* DOM REFS                                                               */
/* ---------------------------------------------------------------------- */

const screens = {
  menu: document.getElementById("screen-menu"),
  how: document.getElementById("screen-how"),
  setup: document.getElementById("screen-setup"),
  onlineMenu: document.getElementById("screen-online-menu"),
  lobbyHost: document.getElementById("screen-lobby-host"),
  lobbyJoin: document.getElementById("screen-lobby-join"),
  vs: document.getElementById("screen-vs"),
  game: document.getElementById("screen-game"),
  roundResult: document.getElementById("screen-round-result"),
  gameover: document.getElementById("screen-gameover")
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ---------------------------------------------------------------------- */
/* NAVIGATION: MENU / HOW TO PLAY                                        */
/* ---------------------------------------------------------------------- */

document.getElementById("btn-how").addEventListener("click", () => showScreen("how"));
document.getElementById("btn-how-back").addEventListener("click", () => showScreen("menu"));

/* ---- local mode setup ---- */

document.getElementById("btn-local").addEventListener("click", () => {
  state.mode = "local";
  state.onlineRole = null;
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

  showScreen("vs");
});

document.getElementById("btn-vs-begin").addEventListener("click", () => {
  if (state.mode === "local") {
    startMatch();
  } else if (state.mode === "online" && state.onlineRole === "host") {
    hostBeginBattle();
  }
});

/* ---- online mode: menu ---- */

document.getElementById("btn-online").addEventListener("click", () => {
  state.mode = "online";
  showScreen("onlineMenu");
});
document.getElementById("btn-online-back").addEventListener("click", () => {
  showScreen("menu");
});

/* ---------------------------------------------------------------------- */
/* MATCH SETUP (shared)                                                   */
/* ---------------------------------------------------------------------- */

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRoundQuestions() {
  const easy = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 1));
  const medium = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 2));
  const hard = shuffle(QUESTION_BANK.filter((q) => q.difficulty === 3));
  const ordered = [...easy, ...medium, ...hard];
  return ordered.slice(0, TOTAL_ROUNDS);
}

function startMatch() {
  state.players.p1.score = 0;
  state.players.p2.score = 0;
  state.roundIndex = 0;
  state.roundQuestions = buildRoundQuestions();

  document.getElementById("name-p1").textContent = state.players.p1.name;
  document.getElementById("name-p2").textContent = state.players.p2.name;
  tagLocalPlayerName();

  showScreen("game");
  startRound();
}

function tagLocalPlayerName() {
  // Adds a "(YOU)" badge next to whichever side is this browser's player, online only.
  document.querySelectorAll(".you-tag").forEach((el) => el.remove());
  if (state.mode !== "online") return;
  const key = localPlayerKey();
  const nameEl = document.getElementById(`name-${key}`);
  const tag = document.createElement("span");
  tag.className = "you-tag";
  tag.textContent = "YOU";
  nameEl.appendChild(tag);
}

/* ---------------------------------------------------------------------- */
/* ROUND FLOW                                                             */
/* ---------------------------------------------------------------------- */

function startRound() {
  const question = state.roundQuestions[state.roundIndex];
  state.currentQuestion = question;
  state.roundActive = true;
  state.locked.p1 = false;
  state.locked.p2 = false;
  state.answerTime.p1 = null;
  state.answerTime.p2 = null;
  state.timerRemaining = ROUND_SECONDS;
  state.roundStartTime = performance.now();
  net.myAnswerBtnEls = {};
  net.myClickedIndex = undefined;

  updateScoreboard();
  document.getElementById("hud-round").textContent = `${state.roundIndex + 1} / ${TOTAL_ROUNDS}`;
  document.getElementById("hud-category").textContent = question.category.toUpperCase();

  renderQuestion(question);
  resetPlayerSideUI("p1");
  resetPlayerSideUI("p2");

  runTimer();

  if (state.mode === "online" && state.onlineRole === "host") {
    sendToGuest({
      type: "round_start",
      roundIndex: state.roundIndex,
      question,
      names: { p1: state.players.p1.name, p2: state.players.p2.name },
      scores: { p1: state.players.p1.score, p2: state.players.p2.score }
    });
  }
}

function renderQuestion(question) {
  const panel = document.querySelector(".question-panel");
  panel.classList.remove("q-transition");
  void panel.offsetWidth; // restart animation
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

/* ---------------------------------------------------------------------- */
/* TIMER                                                                  */
/* ---------------------------------------------------------------------- */

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
  // In online mode only the host runs the authoritative timer; the guest
  // just renders whatever "timer_tick" values the host sends it.
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

/* ---------------------------------------------------------------------- */
/* ANSWERING — LOCAL MODE (both sides resolved instantly on this device)  */
/* ---------------------------------------------------------------------- */

function handleLocalClick(player, optionIndex, btnEl) {
  if (state.mode === "local") {
    resolveAnswerLocal(player, optionIndex, btnEl);
    return;
  }

  // online mode
  if (state.onlineRole === "host") {
    resolveAnswerHost(player, optionIndex, btnEl);
  } else {
    // guest: send to host, disable own buttons optimistically, wait for confirmation
    if (!state.roundActive || state.locked[player]) return;
    const elapsedMs = performance.now() - state.roundStartTime;
    state.answerTime[player] = elapsedMs;
    state.locked[player] = true; // provisional lock until host says otherwise (host is source of truth anyway)
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

/* ---------------------------------------------------------------------- */
/* ANSWERING — ONLINE MODE (host is the referee)                          */
/* ---------------------------------------------------------------------- */

function resolveAnswerHost(player, optionIndex, btnEl) {
  if (!state.roundActive || state.locked[player]) return;

  const question = state.currentQuestion;
  const elapsedMs = performance.now() - state.roundStartTime;
  state.answerTime[player] = elapsedMs;
  const isCorrect = optionIndex === question.correctIndex;

  document.getElementById(`time-${player}`).textContent = `${(elapsedMs / 1000).toFixed(2)}s`;

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
    isFinalRound: state.roundIndex >= TOTAL_ROUNDS - 1
  });

  setTimeout(() => showRoundResult(reason, winner), 550);
}

/* ---------------------------------------------------------------------- */
/* ROUND RESULT SCREEN (shared)                                           */
/* ---------------------------------------------------------------------- */

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
  if (state.roundIndex >= TOTAL_ROUNDS) {
    showGameOver();
    if (state.mode === "online" && state.onlineRole === "host") {
      sendToGuest({ type: "game_over" });
    }
  } else {
    showScreen("game");
    startRound();
  }
}

/* ---------------------------------------------------------------------- */
/* GAME OVER (shared)                                                     */
/* ---------------------------------------------------------------------- */

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
  showScreen("menu");
}

/* ==========================================================================
   ONLINE MULTIPLAYER — PeerJS lobby + networking
   ========================================================================== */

function generateLobbyCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid confusion
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
    try { net.conn.close(); } catch (e) { /* ignore */ }
    net.conn = null;
  }
  if (net.peer) {
    try { net.peer.destroy(); } catch (e) { /* ignore */ }
    net.peer = null;
  }
}

/* ---- CREATE LOBBY (host) ---- */

document.getElementById("btn-create-lobby").addEventListener("click", () => {
  state.onlineRole = "host";
  document.getElementById("host-name-step").hidden = false;
  document.getElementById("host-waiting-step").hidden = true;
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
      const player = remotePlayerKey(); // guest's key, "p2" for a host
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

  sendToGuest({
    type: "match_start",
    names: { p1: state.players.p1.name, p2: state.players.p2.name }
  });

  showScreen("vs");
});

function hostBeginBattle() {
  startMatch();
}

/* ---- JOIN LOBBY (guest) ---- */

document.getElementById("btn-join-lobby").addEventListener("click", () => {
  state.onlineRole = "guest";
  document.getElementById("join-form-step").hidden = false;
  document.getElementById("join-waiting-step").hidden = true;
  document.getElementById("join-error").hidden = true;
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
      showScreen("vs");
      break;
    }
    case "round_start": {
      state.roundIndex = msg.roundIndex;
      state.currentQuestion = msg.question;
      state.roundActive = true;
      state.locked.p1 = false;
      state.locked.p2 = false;
      state.answerTime.p1 = null;
      state.answerTime.p2 = null;
      state.timerRemaining = ROUND_SECONDS;
      state.players.p1.score = msg.scores.p1;
      state.players.p2.score = msg.scores.p2;
      net.myAnswerBtnEls = {};
      net.myClickedIndex = undefined;

      document.getElementById("name-p1").textContent = state.players.p1.name;
      document.getElementById("name-p2").textContent = state.players.p2.name;
      tagLocalPlayerName();

      updateScoreboard();
      document.getElementById("hud-round").textContent = `${state.roundIndex + 1} / ${TOTAL_ROUNDS}`;
      document.getElementById("hud-category").textContent = msg.question.category.toUpperCase();

      showScreen("game");
      renderQuestion(msg.question);
      resetPlayerSideUI("p1");
      resetPlayerSideUI("p2");
      updateTimerDisplay(ROUND_SECONDS);
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

      // if this update is about my own submitted answer, style the button I actually clicked
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

      // reveal correct answer on my own buttons
      const myContainer = document.getElementById(`answers-${localPlayerKey()}`);
      myContainer.querySelectorAll(".answer-btn").forEach((b) => (b.disabled = true));
      const myCorrectBtn = myContainer.querySelector(`.answer-btn[data-index="${msg.correctIndex}"]`);
      if (myCorrectBtn && !myCorrectBtn.classList.contains("correct-pick") && !myCorrectBtn.classList.contains("wrong-pick")) {
        myCorrectBtn.classList.add("reveal-correct");
      }
      if (myCorrectBtn && myCorrectBtn.classList.contains("wrong-pick")) {
        // leave wrong-pick styling as is; also mark true correct one
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