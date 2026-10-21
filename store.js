const Store = (function () {
  "use strict";

  const STORAGE_KEY = "codeclash.store.v1";
  const SESSION_KEY = "codeclash.session.v1";
  const BACKUP_KEY = "codeclash.store.v1.backup";
  const LAST_NAME_KEY = "codeclash.lastCallsign.v1";
  const IDB_NAME = "codeclash.db";
  const IDB_STORE = "kv";
  const IDB_KEY = "store";
  const IDB_TIMEOUT_MS = 1500;

  // false: accounts are always saved, but after the browser/tab is closed the
  //        player lands on the LOG IN page again.
  // true:  stay signed in even after the browser is closed.
  const REMEMBER_LOGIN = false;
  const SCHEMA_VERSION = 1;

  const DEFAULT_RATING = 1200;
  const MIN_RATING = 100;
  const K_FACTOR = 32;
  const PBKDF2_ITERATIONS = 150000;

  const NAME_MIN = 3;
  const NAME_MAX = 14;
  const PASSWORD_MIN = 6;
  const PASSWORD_MAX = 64;

  const TIERS = [
    { name: "ROOKIE", className: "tier-rookie", min: 0 },
    { name: "BRONZE", className: "tier-bronze", min: 1100 },
    { name: "SILVER", className: "tier-silver", min: 1250 },
    { name: "GOLD", className: "tier-gold", min: 1400 },
    { name: "PLATINUM", className: "tier-platinum", min: 1550 },
    { name: "DIAMOND", className: "tier-diamond", min: 1700 }
  ];

  let storageOk = null;
  let memoryDb = null;
  let idbConn = null;
  let idbOk = false;

  function localStorageRef() {
    try {
      return globalThis.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  function lsWorks() {
    if (storageOk !== null) return storageOk;
    const ls = localStorageRef();
    if (!ls) {
      storageOk = false;
      return storageOk;
    }
    try {
      const probe = "__codeclash_probe__";
      ls.setItem(probe, "1");
      ls.removeItem(probe);
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
    return storageOk;
  }

  // Data survives if either localStorage or IndexedDB works.
  function canPersist() {
    return lsWorks() || idbOk;
  }

  function emptyDb() {
    return { version: SCHEMA_VERSION, users: {}, matches: [] };
  }

  function hasData(db) {
    return !!(db && db.users && Object.keys(db.users).length > 0);
  }

  function normalizeDb(parsed) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    if (!parsed.users || typeof parsed.users !== "object" || Array.isArray(parsed.users)) parsed.users = {};
    if (!Array.isArray(parsed.matches)) parsed.matches = [];
    parsed.version = SCHEMA_VERSION;
    return parsed;
  }

  function parseDb(raw) {
    if (!raw) return null;
    try {
      return normalizeDb(JSON.parse(raw));
    } catch (e) {
      return null;
    }
  }

  // Reads the saved accounts. If the main copy is missing or corrupt it is
  // rebuilt from the backup copy instead of starting from an empty database.
  function readDb() {
    if (!lsWorks()) return memoryDb || (memoryDb = emptyDb());

    let db = null;
    let healed = false;
    try {
      const ls = localStorageRef();
      db = parseDb(ls.getItem(STORAGE_KEY));
      if (!hasData(db)) {
        const backup = parseDb(ls.getItem(BACKUP_KEY));
        if (hasData(backup)) {
          db = backup;
          healed = true;
        } else if (hasData(memoryDb)) {
          db = memoryDb;
          healed = true;
        }
      }
      if (healed) ls.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {

    }
    if (!db) db = emptyDb();
    memoryDb = db;
    return db;
  }

  function writeDb(db) {
    db.savedAt = Date.now();
    memoryDb = db;

    let json;
    try {
      json = JSON.stringify(db);
    } catch (e) {
      return false;
    }
    idbWrite(json);

    if (!lsWorks()) return idbOk;
    try {
      const ls = localStorageRef();
      ls.setItem(STORAGE_KEY, json);
      try { ls.setItem(BACKUP_KEY, json); } catch (e) {  }
      return true;
    } catch (e) {
      storageOk = false;
      return idbOk;
    }
  }

  function idbOpen() {
    return new Promise((resolve) => {
      let settled = false;
      const done = (conn) => {
        if (settled) return;
        settled = true;
        resolve(conn);
      };
      try {
        if (typeof indexedDB === "undefined" || !indexedDB) {
          done(null);
          return;
        }
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = () => {
          try { req.result.createObjectStore(IDB_STORE); } catch (e) {  }
        };
        req.onsuccess = () => done(req.result);
        req.onerror = () => done(null);
        req.onblocked = () => done(null);
      } catch (e) {
        done(null);
      }
      setTimeout(() => done(null), IDB_TIMEOUT_MS);
    });
  }

  function idbRead() {
    return new Promise((resolve) => {
      if (!idbConn) {
        resolve(null);
        return;
      }
      try {
        const req = idbConn.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(IDB_KEY);
        req.onsuccess = () => resolve(parseDb(req.result));
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  function idbWrite(json) {
    if (!idbConn) return;
    try {
      idbConn.transaction(IDB_STORE, "readwrite").objectStore(IDB_STORE).put(json, IDB_KEY);
    } catch (e) {

    }
  }

  // Combine two copies of the database. The newer copy wins, and any account
  // that only exists in the other copy is restored into it.
  function mergeDbs(local, remote) {
    if (!hasData(remote)) return local;
    if (!hasData(local)) return remote;

    const remoteNewer = (remote.savedAt || 0) > (local.savedAt || 0);
    const base = remoteNewer ? remote : local;
    const other = remoteNewer ? local : remote;

    const knownMatches = {};
    base.matches.forEach((m) => { knownMatches[m.id] = true; });

    Object.keys(other.users).forEach((key) => {
      if (base.users[key]) return;
      const user = other.users[key];
      base.users[key] = user;
      other.matches.forEach((m) => {
        if (m.userId === user.id && !knownMatches[m.id]) {
          base.matches.push(m);
          knownMatches[m.id] = true;
        }
      });
    });
    return base;
  }

  async function init() {
    try {
      if (!REMEMBER_LOGIN && lsWorks()) localStorageRef().removeItem(SESSION_KEY);
    } catch (e) {  }

    idbConn = await idbOpen();
    idbOk = !!idbConn;

    const remote = await idbRead();
    const local = readDb();
    const merged = mergeDbs(local, remote);

    // Saving the merged copy refills whichever store was empty.
    if (hasData(merged)) writeDb(merged);

    try {
      if (navigator.storage && navigator.storage.persist) {
        const request = navigator.storage.persist();
        if (request && request.catch) request.catch(() => {});
      }
    } catch (e) {  }
  }

  let readyPromise = null;

  // Resolves once saved accounts have been restored from every storage layer.
  function ready() {
    if (!readyPromise) {
      readyPromise = Promise.race([
        init(),
        new Promise((resolve) => setTimeout(resolve, IDB_TIMEOUT_MS * 2))
      ]).catch(() => {});
    }
    return readyPromise;
  }

  function subtleCrypto() {
    const c = globalThis.crypto;
    return c && c.subtle && typeof c.getRandomValues === "function" ? c.subtle : null;
  }

  function cryptoAvailable() {
    return subtleCrypto() !== null && typeof TextEncoder === "function";
  }

  function bytesToBase64(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function randomSalt() {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return bytesToBase64(bytes);
  }

  async function deriveHash(password, saltBase64, iterations) {
    const subtle = subtleCrypto();
    if (!subtle) throw new Error("crypto-unavailable");
    const keyMaterial = await subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const bits = await subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: base64ToBytes(saltBase64),
        iterations,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    return bytesToBase64(new Uint8Array(bits));
  }

  function normalizeName(name) {
    return String(name == null ? "" : name).trim().toUpperCase().slice(0, NAME_MAX);
  }

  function makeId(prefix) {
    const random = Math.random().toString(36).slice(2, 10);
    return `${prefix}_${Date.now().toString(36)}${random}`;
  }

  function tierFor(rating) {
    const value = Number.isFinite(rating) ? rating : DEFAULT_RATING;
    let match = TIERS[0];
    for (let i = 0; i < TIERS.length; i += 1) {
      if (value >= TIERS[i].min) match = TIERS[i];
    }
    return match;
  }

  function expectedScore(rating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - rating) / 400));
  }

  function outcomeValue(outcome) {
    if (outcome === "win") return 1;
    if (outcome === "loss") return 0;
    return 0.5;
  }

  function ratingDelta(rating, opponentRating, outcome) {
    const score = typeof outcome === "number" ? outcome : outcomeValue(outcome);
    const expected = expectedScore(rating, opponentRating);
    return Math.round(K_FACTOR * (score - expected));
  }

  function outcomeFromScores(myScore, oppScore) {
    if (myScore === oppScore) return "draw";
    return myScore > oppScore ? "win" : "loss";
  }

  function derivedStats(user) {
    const played = user.matches || 0;
    const wins = user.wins || 0;
    const losses = user.losses || 0;
    const draws = user.draws || 0;
    const answered = user.answered || 0;
    const graded = (user.correct || 0) + (user.wrong || 0);
    return {
      matches: played,
      wins,
      losses,
      draws,
      winRate: played ? wins / played : 0,
      accuracy: graded ? (user.correct || 0) / graded : 0,
      avgAnswerMs: answered ? (user.timeSumMs || 0) / answered : null,
      streak: user.streak || 0,
      bestStreak: user.bestStreak || 0,
      tier: tierFor(user.rating)
    };
  }

  function publicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      rating: user.rating,
      peakRating: user.peakRating || user.rating,
      createdAt: user.createdAt,
      lastPlayedAt: user.lastPlayedAt || null,
      stats: derivedStats(user)
    };
  }

  let memorySessionId = null;

  function sessionRef() {
    try {
      return REMEMBER_LOGIN ? globalThis.localStorage : globalThis.sessionStorage;
    } catch (e) {
      return null;
    }
  }

  function readSessionId() {
    const ref = sessionRef();
    if (ref) {
      try {
        const raw = ref.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.userId) return parsed.userId;
        }
      } catch (e) {

      }
    }
    return memorySessionId;
  }

  function writeSessionId(userId) {
    memorySessionId = userId;
    const ref = sessionRef();
    if (!ref) return;
    try {
      if (userId) ref.setItem(SESSION_KEY, JSON.stringify({ userId }));
      else ref.removeItem(SESSION_KEY);
    } catch (e) {

    }
  }

  function rememberCallsign(name) {
    try {
      if (lsWorks()) localStorageRef().setItem(LAST_NAME_KEY, name);
    } catch (e) {  }
  }

  function lastCallsign() {
    try {
      if (lsWorks()) return localStorageRef().getItem(LAST_NAME_KEY) || "";
    } catch (e) {  }
    return "";
  }

  function hasUsers() {
    return hasData(readDb());
  }

  function findUserById(db, userId) {
    if (!userId) return null;
    const keys = Object.keys(db.users);
    for (let i = 0; i < keys.length; i += 1) {
      if (db.users[keys[i]].id === userId) return db.users[keys[i]];
    }
    return null;
  }

  function validateCallsign(name) {
    const normalized = normalizeName(name);
    if (!normalized) return { ok: false, code: "name-required", error: "Enter a callsign." };
    if (normalized.length < NAME_MIN) {
      return { ok: false, code: "name-short", error: `Callsigns need at least ${NAME_MIN} characters.` };
    }
    if (!/^[A-Z0-9_.-]+$/.test(normalized)) {
      return { ok: false, code: "name-chars", error: "Use letters, numbers, _ . or - only." };
    }
    return { ok: true, name: normalized, nameKey: normalized };
  }

  function validatePassword(password) {
    const value = String(password == null ? "" : password);
    if (!value) return { ok: false, code: "password-required", error: "Enter a password." };
    if (value.length < PASSWORD_MIN) {
      return { ok: false, code: "password-short", error: `Passwords need at least ${PASSWORD_MIN} characters.` };
    }
    if (value.length > PASSWORD_MAX) {
      return { ok: false, code: "password-long", error: `Keep passwords under ${PASSWORD_MAX} characters.` };
    }
    return { ok: true, password: value };
  }

  async function signUp(name, password) {
    await ready();
    const nameCheck = validateCallsign(name);
    if (!nameCheck.ok) return nameCheck;

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.ok) return passwordCheck;

    if (!cryptoAvailable()) {
      return {
        ok: false,
        code: "crypto-unavailable",
        error:
          "This browser blocked secure password hashing. Open the game over http://localhost or https:// and try again."
      };
    }

    const db = readDb();
    if (db.users[nameCheck.nameKey]) {
      return { ok: false, code: "name-taken", error: "That callsign is taken on this device. Log in instead." };
    }

    const salt = randomSalt();
    const hash = await deriveHash(passwordCheck.password, salt, PBKDF2_ITERATIONS);
    const now = Date.now();

    const user = {
      id: makeId("player"),
      name: nameCheck.name,
      nameKey: nameCheck.nameKey,
      algo: "PBKDF2-SHA256",
      iterations: PBKDF2_ITERATIONS,
      salt,
      hash,
      createdAt: now,
      lastPlayedAt: null,
      rating: DEFAULT_RATING,
      peakRating: DEFAULT_RATING,
      matches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      streak: 0,
      bestStreak: 0,
      correct: 0,
      wrong: 0,
      answered: 0,
      timeSumMs: 0
    };

    db.users[nameCheck.nameKey] = user;
    const persisted = writeDb(db);
    rememberCallsign(user.name);

    // Registering does not sign the player in: they are sent to the LOG IN page.
    return { ok: true, user: publicUser(user), persisted };
  }

  async function signIn(name, password) {
    await ready();
    const nameCheck = validateCallsign(name);
    if (!nameCheck.ok) return nameCheck;

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.ok) return passwordCheck;

    if (!cryptoAvailable()) {
      return {
        ok: false,
        code: "crypto-unavailable",
        error:
          "This browser blocked secure password hashing. Open the game over http://localhost or https:// and try again."
      };
    }

    const db = readDb();
    const user = db.users[nameCheck.nameKey];
    if (!user) {
      return { ok: false, code: "no-such-user", error: "No profile with that callsign on this device." };
    }

    let hash;
    try {
      hash = await deriveHash(passwordCheck.password, user.salt, user.iterations || PBKDF2_ITERATIONS);
    } catch (e) {
      return { ok: false, code: "crypto-failed", error: "Could not verify that password. Try again." };
    }

    if (hash !== user.hash) {
      return { ok: false, code: "bad-password", error: "That password doesn't match this callsign." };
    }

    writeSessionId(user.id);
    rememberCallsign(user.name);
    return { ok: true, user: publicUser(user) };
  }

  function signOut() {
    writeSessionId(null);
    return true;
  }

  function currentUser() {
    const db = readDb();
    const id = readSessionId();
    if (!id) return null;
    const user = findUserById(db, id);
    if (!user) {
      writeSessionId(null);
      return null;
    }
    return publicUser(user);
  }

  function profileForName(name) {
    const key = normalizeName(name);
    if (!key) return null;
    const user = readDb().users[key];
    return user ? publicUser(user) : null;
  }

  function leaderboard() {
    const db = readDb();
    return Object.keys(db.users)
      .map((key) => {
        const user = db.users[key];
        const stats = derivedStats(user);
        return {
          id: user.id,
          name: user.name,
          rating: user.rating,
          matches: stats.matches,
          wins: stats.wins,
          losses: stats.losses,
          draws: stats.draws,
          winRate: stats.winRate,
          tier: stats.tier
        };
      })
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.name.localeCompare(b.name);
      });
  }

  function readPlayerStats(entry) {
    const correct = Number(entry.correct) || 0;
    const wrong = Number(entry.wrong) || 0;
    return {
      correct,
      wrong,
      answered: Number(entry.answered) || correct + wrong,
      timeSumMs: Number(entry.timeSumMs) || 0
    };
  }

  function applyResult(user, outcome, delta, stats, now) {
    user.rating = Math.max(MIN_RATING, user.rating + delta);
    user.peakRating = Math.max(user.peakRating || DEFAULT_RATING, user.rating);
    user.matches = (user.matches || 0) + 1;

    if (outcome === "win") {
      user.wins = (user.wins || 0) + 1;
      user.streak = (user.streak || 0) + 1;
      user.bestStreak = Math.max(user.bestStreak || 0, user.streak);
    } else if (outcome === "loss") {
      user.losses = (user.losses || 0) + 1;
      user.streak = 0;
    } else {
      user.draws = (user.draws || 0) + 1;
    }

    user.correct = (user.correct || 0) + stats.correct;
    user.wrong = (user.wrong || 0) + stats.wrong;
    user.answered = (user.answered || 0) + stats.answered;
    user.timeSumMs = (user.timeSumMs || 0) + stats.timeSumMs;
    user.lastPlayedAt = now;
  }

  function recordMatch(options) {
    const opts = options || {};
    const mode = opts.mode === "online" ? "online" : "local";
    const entries = Array.isArray(opts.players) ? opts.players.slice(0, 2) : [];
    const onlyIndex = Number.isInteger(opts.onlyIndex) ? opts.onlyIndex : -1;

    const db = readDb();
    const now = Date.now();

    const ratingAtStart = {};
    Object.keys(db.users).forEach((key) => {
      ratingAtStart[db.users[key].id] = db.users[key].rating;
    });

    const planned = [];
    const seenUserIds = {};

    entries.forEach((entry, index) => {
      if (onlyIndex >= 0 && index !== onlyIndex) return;

      const user = db.users[normalizeName(entry && entry.name)];
      if (!user) return;
      if (seenUserIds[user.id]) return;
      seenUserIds[user.id] = true;

      const opponentEntry = entries[index === 0 ? 1 : 0];
      const opponentUser = opponentEntry ? db.users[normalizeName(opponentEntry.name)] : null;
      const opponentIsSelf = !!(opponentUser && opponentUser.id === user.id);
      const opponentRated = !!(opponentUser && !opponentIsSelf);

      const myScore = Number(entry.score) || 0;
      const oppScore = opponentEntry ? Number(opponentEntry.score) || 0 : 0;

      planned.push({
        user,
        entry,
        opponentName: opponentEntry && opponentEntry.name ? opponentEntry.name : "OPPONENT",
        opponentRated,
        opponentRating: opponentRated ? ratingAtStart[opponentUser.id] : DEFAULT_RATING,
        opponentIsSelf,
        myScore,
        oppScore,
        outcome: outcomeFromScores(myScore, oppScore)
      });
    });

    const recorded = planned.map((item) => {
      const before = item.user.rating;
      const rawDelta = item.opponentIsSelf
        ? 0
        : ratingDelta(before, item.opponentRating, item.outcome);
      const stats = readPlayerStats(item.entry);
      applyResult(item.user, item.outcome, rawDelta, stats, now);
      const graded = stats.correct + stats.wrong;

      const record = {
        id: makeId("match"),
        userId: item.user.id,
        name: item.user.name,
        mode,
        opponentName: item.opponentName,
        opponentRated: item.opponentRated,
        myScore: item.myScore,
        oppScore: item.oppScore,
        outcome: item.outcome,
        correct: stats.correct,
        wrong: stats.wrong,
        accuracy: graded ? stats.correct / graded : null,
        avgAnswerMs: stats.answered ? stats.timeSumMs / stats.answered : null,
        ratingBefore: before,
        ratingAfter: item.user.rating,
        delta: item.user.rating - before,
        playedAt: now
      };

      db.matches.push(record);
      return { ...record, tier: tierFor(record.ratingAfter) };
    });

    const persisted = recorded.length ? writeDb(db) : true;
    return { recorded, persisted };
  }

  // Deletes every profile (and its match history) except the given one.
  function removeOtherUsers(keepUserId) {
    if (!keepUserId) return { removed: 0, persisted: true };
    const db = readDb();
    let removed = 0;
    Object.keys(db.users).forEach((key) => {
      if (db.users[key].id !== keepUserId) {
        delete db.users[key];
        removed += 1;
      }
    });
    if (!removed) return { removed: 0, persisted: true };
    db.matches = db.matches.filter((match) => match.userId === keepUserId);
    return { removed, persisted: writeDb(db) };
  }

  function historyFor(userId, limit) {
    if (!userId) return [];
    const db = readDb();
    const rows = db.matches.filter((match) => match.userId === userId);
    rows.sort((a, b) => b.playedAt - a.playedAt);
    const sliced = Number.isFinite(limit) && limit > 0 ? rows.slice(0, limit) : rows;
    return sliced.map((match) => ({ ...match, tier: tierFor(match.ratingAfter) }));
  }

  function clearHistory(userId) {
    if (!userId) return { removed: 0, persisted: true };
    const db = readDb();
    const before = db.matches.length;
    db.matches = db.matches.filter((match) => match.userId !== userId);
    const removed = before - db.matches.length;
    const persisted = removed ? writeDb(db) : true;
    return { removed, persisted };
  }

  ready();

  return {
    DEFAULT_RATING,
    MIN_RATING,
    K_FACTOR,
    NAME_MIN,
    NAME_MAX,
    PASSWORD_MIN,
    TIERS,

    canPersist,
    ready,
    hasUsers,
    lastCallsign,
    cryptoAvailable,
    normalizeName,
    validateCallsign,
    validatePassword,
    tierFor,
    expectedScore,
    ratingDelta,

    signUp,
    signIn,
    signOut,
    currentUser,
    profileForName,
    leaderboard,
    recordMatch,
    historyFor,
    clearHistory,
    removeOtherUsers
  };
})();