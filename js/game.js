/* ============================================================================
   DIGITAL HERO — game.js
   ----------------------------------------------------------------------------
   Controller utama / "otak" aplikasi. File ini:
     - Menyimpan & memuat progress pemain (localStorage)
     - Mengatur perpindahan layar (landing -> story -> map -> level -> ending)
     - Mengatur alur DUA SEASON (Season 1: Level 1-10, Season 2: Level 11-20)
     - Menghitung XP/coin/crystal/stars
     - Menghubungkan semua tombol ke fungsi yang sesuai

   File ini TIDAK tahu cara menggambar DOM (itu tugas ui.js) dan TIDAK tahu
   cara menjalankan simulasi program (itu tugas engine.js) — murni mengatur
   ALUR & STATE permainan.

   CATATAN ARSITEKTUR SEASON:
   Level Season 1 memakai id 1-10 (10 = Final Challenge), Level Season 2
   memakai id 11-20 (20 = Final Challenge). "player.unlockedLevel" adalah
   SATU counter yang terus naik dari 1 sampai 21 (21 = kedua Season selesai)
   — begitu Level 10 selesai, unlockedLevel jadi 11 yang otomatis membuka
   Level 11 (misi pertama Season 2). Lihat SEASONS di js/data.js untuk
   daftar level tiap Season.
   ============================================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "digitalHeroProgress";

  /* ---------------------------- PLAYER STATE ---------------------------- */
  let player = null;
  let dom = null;

  function defaultPlayer() {
    return {
      name: "",
      xp: 0,
      coins: 0,
      crystals: 0,
      levelStars: {},      // { "1": 3, "2": 2, ..., "20": 3 }
      unlockedLevel: 1,    // level tertinggi yang boleh dimainkan (1-21)
      introSeen: false,    // prolog Season 1 sudah dilihat?
      story2Seen: false,   // prolog Season 2 sudah dilihat?
      tutorialSeen: false,
      completedAt: null,
      settings: { sound: true, theme: "light" }
    };
  }

  function loadPlayer() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultPlayer();
      const parsed = JSON.parse(raw);
      const base = defaultPlayer();
      return Object.assign(base, parsed, {
        levelStars: parsed.levelStars || {},
        settings: Object.assign({ sound: true, theme: "light" }, parsed.settings || {})
      });
    } catch (e) {
      return defaultPlayer();
    }
  }

  function savePlayer() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch (e) {
      DH_UI.showToast("⚠️ Progress tidak dapat disimpan di perangkat ini.");
    }
  }

  /* ---------------------------- SCORING ---------------------------- */
  // Aturan bintang (lihat MASTER BRIEF bab 4):
  //   3 bintang = berhasil, tanpa hint, tanpa banyak percobaan
  //   2 bintang = berhasil dengan hint ATAU beberapa kali percobaan
  //   1 bintang = berhasil setelah memakai hint DAN banyak percobaan
  function calcStars(attempts, hintsUsed) {
    let score = 3;
    if (hintsUsed > 0) score -= 1;
    if (attempts > 2) score -= 1;
    return Math.max(1, score);
  }

  /* ---------------------------- HELPER SEASON/LEVEL ---------------------------- */
  // Mengembalikan entri SEASONS (lihat data.js) berdasarkan nomor Season (1/2).
  function getSeasonMeta(seasonId) {
    return SEASONS[seasonId - 1];
  }
  // Season tempat sebuah id level berada (1-10 -> Season 1, 11-20 -> Season 2).
  function getSeasonForLevelId(levelId) {
    return levelId <= 10 ? 1 : 2;
  }
  // Mencari data level (bukan Final Challenge) berdasarkan id, di kedua Season.
  function findLevelConfig(levelId) {
    const seasonMeta = getSeasonMeta(getSeasonForLevelId(levelId));
    return seasonMeta.levels.filter(function (l) { return l.id === levelId; })[0] || null;
  }

  /* ---------------------------- NAVIGASI ---------------------------- */
  let currentLevelConfig = null; // level normal yang sedang dibuka lesson-nya
  let currentIsFinal = false;
  let currentFinalLevelConfig = null; // FINAL_LEVEL atau FINAL_LEVEL_S2 yang sedang aktif
  let pendingAfterResult = null;
  let currentMapSeason = null; // Season yang sedang ditampilkan di Peta DigiLand

  // State khusus Final Challenge (multi-tahap)
  let finalStageIndex = 0;
  let finalStageAttempts = [];
  let finalHintState = { used: 0 };

  function goToMap(seasonId) {
    if (seasonId) {
      currentMapSeason = seasonId;
    } else if (!currentMapSeason) {
      currentMapSeason = player.unlockedLevel > 10 ? 2 : 1;
    }
    DH_UI.updateStatbar(player);
    const season2Unlocked = player.unlockedLevel > 10;
    DH_UI.setSeasonTabs(currentMapSeason, season2Unlocked);
    DH_UI.renderMap(player, getSeasonMeta(currentMapSeason));
    DH_UI.showScreen("map");
  }

  function switchMapSeason(seasonId) {
    if (seasonId === 2 && player.unlockedLevel <= 10) {
      DH_UI.showToast("Selesaikan Season 1 dulu untuk membuka Season 2, ya!");
      return;
    }
    DH_AUDIO.play("click");
    goToMap(seasonId);
  }

  function goToSeason1Ending() {
    DH_UI.renderEndingStory(ENDING_STORY);
    let totalStars = 0;
    Object.keys(player.levelStars).forEach(function (k) { if (+k <= 10) totalStars += player.levelStars[k]; });
    DH_UI.renderCertificate(player, totalStars, CERTIFICATE_TEXT, 10, 30, ASSET_PATHS.badges.trophy);
    DH_UI.setEndingContinueButton(true);
    DH_UI.showScreen("ending");
    DH_UI.confettiBurst(3200);
  }

  function goToSeason2Ending() {
    DH_UI.renderEndingStory(ENDING_STORY_S2);
    let totalStars = 0;
    Object.keys(player.levelStars).forEach(function (k) { totalStars += player.levelStars[k]; });
    DH_UI.renderCertificate(player, totalStars, CERTIFICATE_TEXT_S2, 20, 60, ASSET_PATHS.badges.trophySeason2);
    DH_UI.setEndingContinueButton(false);
    DH_UI.showScreen("ending");
    DH_UI.confettiBurst(4000);
  }

  /* ---------------------------- LANDING & NAMA ---------------------------- */
  function handleStartGame() {
    if (!player.name) {
      DH_UI.openModal(dom.modalName);
      dom.inputPlayerName.value = "";
      dom.inputPlayerName.focus();
      return;
    }
    proceedAfterName();
  }

  function handleConfirmName() {
    const name = dom.inputPlayerName.value.trim();
    if (!name) {
      DH_UI.showToast("Isi namamu dulu, ya!");
      return;
    }
    player.name = name.slice(0, 18);
    savePlayer();
    DH_UI.closeAllModals();
    DH_AUDIO.play("success");
    proceedAfterName();
  }

  function proceedAfterName() {
    DH_UI.updateStatbar(player);
    if (!player.introSeen) {
      startStoryIntro(STORY_INTRO, function () {
        player.introSeen = true;
        savePlayer();
        goToMap(1);
      });
    } else {
      goToMap();
    }
  }

  /* ---------------------------- STORY INTRO (dipakai Season 1 & 2) ---------------------------- */
  let activeStoryArray = STORY_INTRO;
  let storyIndex = 0;
  let onStoryFinish = null;

  function startStoryIntro(storyArray, onFinish) {
    activeStoryArray = storyArray;
    onStoryFinish = onFinish;
    storyIndex = 0;
    DH_UI.showScreen("story");
    DH_UI.renderStoryLine(activeStoryArray[0], activeStoryArray.length === 1);
  }
  function handleStoryNext() {
    DH_AUDIO.play("click");
    storyIndex++;
    if (storyIndex >= activeStoryArray.length) { finishStoryIntro(); return; }
    DH_UI.renderStoryLine(activeStoryArray[storyIndex], storyIndex === activeStoryArray.length - 1);
  }
  function handleStorySkip() { finishStoryIntro(); }
  function finishStoryIntro() {
    const cb = onStoryFinish;
    onStoryFinish = null;
    if (cb) cb();
  }

  /* ---------------------------- LANJUT KE SEASON 2 ---------------------------- */
  function handleContinueToSeason2() {
    DH_AUDIO.play("click");
    if (!player.story2Seen) {
      startStoryIntro(STORY_INTRO_S2, function () {
        player.story2Seen = true;
        savePlayer();
        goToMap(2);
      });
    } else {
      goToMap(2);
    }
  }

  /* ---------------------------- MEMBUKA LEVEL ---------------------------- */
  function openLevel(levelId) {
    const seasonMeta = getSeasonMeta(getSeasonForLevelId(levelId));
    if (levelId === seasonMeta.finalLevel.id) {
      currentIsFinal = true;
      currentLevelConfig = null;
      currentFinalLevelConfig = seasonMeta.finalLevel;
      DH_UI.openLessonModal(seasonMeta.finalLevel);
    } else {
      currentIsFinal = false;
      currentLevelConfig = findLevelConfig(levelId);
      DH_UI.openLessonModal(currentLevelConfig);
    }
  }

  function handleStartLevelFromLesson() {
    DH_UI.closeAllModals();
    DH_UI.showScreen("level");
    if (currentIsFinal) {
      startFinalChallenge();
    } else {
      startNormalLevel(currentLevelConfig);
    }
  }

  function startNormalLevel(levelConfig) {
    DH_UI.mountLevel(levelConfig, {
      onSuccess: function (meta) { handleLevelSuccess(levelConfig, meta); },
      onFail: function () { /* tidak perlu aksi khusus, pemain otomatis bisa coba lagi */ }
    });
  }

  function handleLevelSuccess(levelConfig, meta) {
    const stars = calcStars(meta.attempts, meta.hintsUsed);
    const alreadyCompleted = !!player.levelStars[levelConfig.id];
    let gainedXP = 0, gainedCoin = 0, gainedCrystal = 0;

    if (!alreadyCompleted) {
      gainedXP = levelConfig.rewardXP;
      gainedCoin = levelConfig.rewardCoin;
      gainedCrystal = 1;
      player.xp += gainedXP;
      player.coins += gainedCoin;
      player.crystals += gainedCrystal;
      player.unlockedLevel = Math.max(player.unlockedLevel, levelConfig.id + 1);
    }
    player.levelStars[levelConfig.id] = Math.max(player.levelStars[levelConfig.id] || 0, stars);
    savePlayer();
    DH_UI.updateStatbar(player);

    pendingAfterResult = function () { goToMap(); };
    DH_UI.openResultModal(stars, gainedXP, gainedCoin, gainedCrystal, false);
  }

  /* ---------------------------- FINAL CHALLENGE (Level 10 & 20) ---------------------------- */
  function startFinalChallenge() {
    finalStageIndex = 0;
    finalStageAttempts = [];
    finalHintState = { used: 0 };
    mountCurrentFinalStage();
  }

  function mountCurrentFinalStage() {
    const stageConfig = currentFinalLevelConfig.stages[finalStageIndex];
    DH_UI.mountFinalStage(
      finalStageIndex,
      currentFinalLevelConfig.stages.length,
      stageConfig,
      currentFinalLevelConfig,
      {
        onSuccess: handleFinalStageSuccess,
        onFail: function () { /* tidak perlu aksi khusus */ }
      },
      finalHintState
    );
  }

  function handleFinalStageSuccess(meta) {
    finalStageAttempts.push(meta.attempts);
    finalStageIndex++;
    if (finalStageIndex < currentFinalLevelConfig.stages.length) {
      DH_UI.showToast("✅ Tahap selesai! Bersiap ke tahap berikutnya...");
      setTimeout(mountCurrentFinalStage, 1100);
    } else {
      completeFinalChallenge();
    }
  }

  function completeFinalChallenge() {
    const worstAttempts = Math.max.apply(null, finalStageAttempts.concat([1]));
    const stars = calcStars(worstAttempts, finalHintState.used);
    const levelId = currentFinalLevelConfig.id; // 10 (Season 1) atau 20 (Season 2)
    const alreadyCompleted = !!player.levelStars[levelId];
    let gainedXP = 0, gainedCoin = 0, gainedCrystal = 0;

    if (!alreadyCompleted) {
      gainedXP = currentFinalLevelConfig.rewardXP;
      gainedCoin = currentFinalLevelConfig.rewardCoin;
      gainedCrystal = 1;
      player.xp += gainedXP;
      player.coins += gainedCoin;
      player.crystals += gainedCrystal;
      player.unlockedLevel = Math.max(player.unlockedLevel, levelId + 1);
      if (levelId === 20) player.completedAt = Date.now();
    }
    player.levelStars[levelId] = Math.max(player.levelStars[levelId] || 0, stars);
    savePlayer();
    DH_UI.updateStatbar(player);

    pendingAfterResult = (levelId === 10) ? function () { goToSeason1Ending(); } : function () { goToSeason2Ending(); };
    DH_UI.openResultModal(stars, gainedXP, gainedCoin, gainedCrystal, true);
  }

  function handleResultContinue() {
    DH_UI.closeAllModals();
    const fn = pendingAfterResult;
    pendingAfterResult = null;
    if (fn) fn();
  }

  /* ---------------------------- RESET PROGRESS ---------------------------- */
  function doResetProgress() {
    player = defaultPlayer();
    currentMapSeason = null;
    savePlayer();
    DH_UI.updateStatbar(player);
    DH_UI.renderLanding(player, false);
    DH_UI.showScreen("landing");
    DH_UI.showToast("Progress berhasil direset. Sampai jumpa lagi, Digital Hero baru!");
  }

  /* ---------------------------- SOUND / TEMA / FULLSCREEN ---------------------------- */
  function toggleSound() {
    player.settings.sound = !player.settings.sound;
    DH_AUDIO.setEnabled(player.settings.sound);
    DH_UI.setSoundIcon(player.settings.sound);
    savePlayer();
    if (player.settings.sound) DH_AUDIO.play("click");
  }

  function toggleTheme() {
    player.settings.theme = player.settings.theme === "dark" ? "light" : "dark";
    DH_UI.applyTheme(player.settings.theme);
    savePlayer();
    DH_AUDIO.play("click");
  }

  function toggleFullscreen() {
    const appEl = document.getElementById("app");
    try {
      if (!document.fullscreenElement) {
        const req = appEl.requestFullscreen || appEl.webkitRequestFullscreen || appEl.msRequestFullscreen;
        if (req) req.call(appEl); else DH_UI.showToast("Mode layar penuh tidak didukung perangkat ini.");
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (exit) exit.call(document);
      }
    } catch (e) {
      DH_UI.showToast("Mode layar penuh tidak didukung perangkat ini.");
    }
  }

  /* ---------------------------- INISIALISASI ---------------------------- */
  function wireEvents() {
    dom.soundBtn.addEventListener("click", toggleSound);
    dom.themeBtn.addEventListener("click", toggleTheme);
    dom.fullscreenBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", function () {
      dom.fullscreenBtn.textContent = document.fullscreenElement ? "⤡" : "⛶";
    });

    DH_UI.setBackHandler(function () {
      DH_AUDIO.play("click");
      goToMap();
    });

    dom.btnStartGame.addEventListener("click", function () { DH_AUDIO.play("click"); handleStartGame(); });
    dom.btnHowToPlay.addEventListener("click", function () {
      DH_AUDIO.play("click");
      DH_UI.renderTutorialSteps();
      DH_UI.openModal(dom.modalTutorial);
    });
    dom.btnResetProgress.addEventListener("click", function () {
      DH_UI.showConfirm(
        "Reset Progress?",
        "Semua XP, coin, crystal, dan progress level (Season 1 & 2) akan dihapus permanen. Yakin ingin memulai dari awal?",
        doResetProgress
      );
    });

    dom.btnConfirmName.addEventListener("click", handleConfirmName);
    dom.inputPlayerName.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleConfirmName();
    });

    dom.btnCloseTutorial.addEventListener("click", function () {
      DH_AUDIO.play("click");
      player.tutorialSeen = true;
      savePlayer();
      DH_UI.closeAllModals();
    });

    dom.btnStoryNext.addEventListener("click", handleStoryNext);
    dom.btnStorySkip.addEventListener("click", handleStorySkip);

    dom.btnStartLevel.addEventListener("click", function () {
      DH_AUDIO.play("click");
      handleStartLevelFromLesson();
    });

    dom.btnResultContinue.addEventListener("click", function () {
      DH_AUDIO.play("click");
      handleResultContinue();
    });

    dom.btnPrintCertificate.addEventListener("click", function () { window.print(); });
    dom.btnPlayAgain.addEventListener("click", function () {
      DH_UI.showConfirm(
        "Main Lagi dari Awal?",
        "Progress saat ini akan dihapus dan permainan dimulai ulang dari Level 1.",
        doResetProgress
      );
    });
    dom.btnContinueSeason2.addEventListener("click", handleContinueToSeason2);

    dom.tabSeason1.addEventListener("click", function () { switchMapSeason(1); });
    dom.tabSeason2.addEventListener("click", function () { switchMapSeason(2); });

    DH_UI.renderMap.onSelectLevel = openLevel;
  }

  function init() {
    DH_UI.init();
    dom = DH_UI.dom();
    player = loadPlayer();

    DH_AUDIO.setEnabled(player.settings.sound);
    DH_UI.setSoundIcon(player.settings.sound);
    DH_UI.applyTheme(player.settings.theme);
    DH_UI.updateStatbar(player);

    wireEvents();

    const hasProgress = !!player.name;
    DH_UI.renderLanding(player, hasProgress);
    DH_UI.showScreen("landing");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
