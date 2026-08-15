/* ============================================================================
   DIGITAL HERO — ui.js
   ----------------------------------------------------------------------------
   Semua fungsi RENDER & INTERAKSI TAMPILAN ada di sini. File ini tidak
   menyimpan progress pemain secara permanen (itu tugas game.js) — ui.js
   hanya menggambar layar dan memberi tahu game.js lewat "callbacks" ketika
   pemain berhasil/gagal menyelesaikan sesuatu.

   Struktur:
     - Util kecil (dom, delay, label blok)
     - Navigasi layar & modal umum
     - Landing / Story / World Map / Tutorial
     - Lesson & Result modal
     - Stage: Runner (grid + block builder) — dipakai Level 1,3,4,5,6,7 & Final tahap 1-2
     - Stage: Order (Sequence City) — Level 2
     - Stage: Choice (decision & quiz) — Level 8,9 & Final tahap 3
     - Sertifikat & confetti
   ============================================================================ */

const DH_UI = (function () {

  /* ---------------------------- UTIL ---------------------------- */
  function $(id) { return document.getElementById(id); }
  function delay(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // ---- Sistem gambar aset dengan fallback otomatis ke emoji ----
  // Membuat elemen <span> yang mencoba menampilkan gambar dari `path` (lihat
  // ASSET_PATHS di data.js). Jika file belum ada / gagal dimuat, otomatis
  // menampilkan `fallbackEmoji` sebagai gantinya — jadi game selalu tampil
  // benar baik SEBELUM maupun SESUDAH gambar ditambahkan pengguna.
  function assetSlot(path, fallbackEmoji, altText, extraClass) {
    const wrap = el("span", "asset-slot" + (extraClass ? " " + extraClass : ""));
    if (!path) {
      wrap.appendChild(document.createTextNode(fallbackEmoji || ""));
      return wrap;
    }
    const img = document.createElement("img");
    img.src = path;
    img.alt = altText || "";
    img.className = "asset-slot-img";
    const fb = el("span", "asset-slot-fallback", null);
    fb.appendChild(document.createTextNode(fallbackEmoji || ""));
    fb.style.display = "none";
    img.onerror = function () {
      img.style.display = "none";
      fb.style.display = "";
    };
    wrap.appendChild(img);
    wrap.appendChild(fb);
    return wrap;
  }

  const BLOCK_META = {
    MOVE:    { icon: "⬆️", label: "MAJU" },
    LEFT:    { icon: "↺", label: "PUTAR KIRI" },
    RIGHT:   { icon: "↻", label: "PUTAR KANAN" },
    COLLECT: { icon: "✋", label: "AMBIL" },
    REPEAT:  { icon: "🔁", label: "ULANGI" },
    IF:      { icon: "🔀", label: "JIKA" }
  };
  const CONDITION_LABEL = {
    WALL_AHEAD: "ADA BATU DI DEPAN",
    CRYSTAL_AHEAD: "ADA CRYSTAL DI DEPAN"
  };
  const FACING_DEG = { right: 0, down: 90, left: 180, up: 270 };

  /* ---------------------------- DOM CACHE ---------------------------- */
  let dom = {};
  function cacheDom() {
    dom = {
      backBtn: $("btn-back"),
      soundBtn: $("btn-sound"),
      themeBtn: $("btn-theme"),
      fullscreenBtn: $("btn-fullscreen"),
      statbar: $("statbar"),
      statName: $("stat-player-name"),
      statXp: $("stat-xp"),
      statCoin: $("stat-coin"),
      statCrystal: $("stat-crystal"),

      screens: {
        landing: $("screen-landing"),
        story: $("screen-story"),
        map: $("screen-map"),
        level: $("screen-level"),
        ending: $("screen-ending")
      },

      landingSaveInfo: $("landing-save-info"),
      btnStartGame: $("btn-start-game"),
      btnHowToPlay: $("btn-how-to-play"),
      btnResetProgress: $("btn-reset-progress"),

      storyPortrait: $("story-portrait"),
      storySpeakerName: $("story-speaker-name"),
      storySpeakerText: $("story-speaker-text"),
      btnStorySkip: $("btn-story-skip"),
      btnStoryNext: $("btn-story-next"),

      mapPath: $("map-path"),
      mapHeroBanner: $("map-hero-banner"),
      mapHeadingTitle: $("map-heading-title"),
      tabSeason1: $("tab-season1"),
      tabSeason2: $("tab-season2"),

      levelIcon: $("level-icon"),
      levelTitle: $("level-title"),
      levelConceptBadge: $("level-concept-badge"),
      stageProgress: $("stage-progress"),
      levelByteTipIcon: $("level-byte-tip-icon"),
      levelByteTipText: $("level-byte-tip-text"),
      levelStage: $("level-stage"),

      endingStory: $("ending-story"),
      certBadgeSlot: $("cert-badge-slot"),
      certHeading: $("cert-heading"),
      certSubheading: $("cert-subheading"),
      certPlayerName: $("cert-player-name"),
      certBody: $("cert-body"),
      certXp: $("cert-xp"),
      certCrystal: $("cert-crystal"),
      certCrystalMax: $("cert-crystal-max"),
      certStars: $("cert-stars"),
      certStarsMax: $("cert-stars-max"),
      certFooter: $("cert-footer"),
      btnPrintCertificate: $("btn-print-certificate"),
      btnPlayAgain: $("btn-play-again"),
      btnContinueSeason2: $("btn-continue-season2"),

      modalOverlay: $("modal-overlay"),
      modalName: $("modal-name"),
      inputPlayerName: $("input-player-name"),
      btnConfirmName: $("btn-confirm-name"),

      modalTutorial: $("modal-tutorial"),
      tutorialSteps: $("tutorial-steps"),
      btnCloseTutorial: $("btn-close-tutorial"),

      modalLesson: $("modal-lesson"),
      lessonPortrait: $("lesson-portrait"),
      lessonConceptBadge: $("lesson-concept-badge"),
      lessonTitle: $("lesson-title"),
      lessonStory: $("lesson-story"),
      lessonText: $("lesson-text"),
      btnStartLevel: $("btn-start-level"),

      modalResult: $("modal-result"),
      resultStars: $("result-stars"),
      resultTitle: $("result-title"),
      resultSubtitle: $("result-subtitle"),
      resultXp: $("result-xp"),
      resultCoin: $("result-coin"),
      resultCrystal: $("result-crystal"),
      btnResultContinue: $("btn-result-continue"),

      modalConfirm: $("modal-confirm"),
      confirmTitle: $("confirm-title"),
      confirmText: $("confirm-text"),
      btnConfirmCancel: $("btn-confirm-cancel"),
      btnConfirmOk: $("btn-confirm-ok"),

      modalSeasonToken: $("modal-season-token"),
      inputSeasonToken: $("input-season-token"),
      seasonTokenError: $("season-token-error"),
      btnSeasonTokenCancel: $("btn-season-token-cancel"),
      btnSeasonTokenSubmit: $("btn-season-token-submit"),

      toast: $("toast"),
      confettiCanvas: $("confetti-canvas")
    };
  }

  /* ---------------------------- NAVIGASI LAYAR ---------------------------- */
  function showScreen(name) {
    Object.keys(dom.screens).forEach(function (key) {
      dom.screens[key].classList.toggle("hidden", key !== name);
    });
    dom.statbar.classList.toggle("hidden", !(name === "map" || name === "level"));
    dom.backBtn.classList.toggle("hidden", !(name === "level"));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function setBackHandler(handler) {
    dom.backBtn.onclick = handler;
  }

  /* ---------------------------- MODAL UMUM ---------------------------- */
  function openModal(modalEl) {
    dom.modalOverlay.classList.remove("hidden");
    [dom.modalName, dom.modalTutorial, dom.modalLesson, dom.modalResult, dom.modalConfirm, dom.modalSeasonToken].forEach(function (m) {
      m.classList.toggle("hidden", m !== modalEl);
    });
  }
  function closeAllModals() {
    dom.modalOverlay.classList.add("hidden");
    [dom.modalName, dom.modalTutorial, dom.modalLesson, dom.modalResult, dom.modalConfirm, dom.modalSeasonToken].forEach(function (m) {
      m.classList.add("hidden");
    });
  }

  function showConfirm(title, text, onConfirm) {
    dom.confirmTitle.textContent = title;
    dom.confirmText.textContent = text;
    openModal(dom.modalConfirm);
    dom.btnConfirmOk.onclick = function () {
      closeAllModals();
      onConfirm();
    };
    dom.btnConfirmCancel.onclick = function () { closeAllModals(); };
  }

  function openSeasonTokenModal() {
    dom.inputSeasonToken.value = "";
    dom.seasonTokenError.classList.add("hidden");
    openModal(dom.modalSeasonToken);
    dom.inputSeasonToken.focus();
  }
  function showSeasonTokenError() {
    dom.seasonTokenError.classList.remove("hidden");
    dom.inputSeasonToken.value = "";
    dom.inputSeasonToken.focus();
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { dom.toast.classList.add("hidden"); }, 2600);
  }

  /* ---------------------------- TOP BAR: SOUND / THEME / FULLSCREEN ---------------------------- */
  function setSoundIcon(enabled) {
    dom.soundBtn.textContent = enabled ? "🔊" : "🔇";
  }
  function setThemeIcon(theme) {
    dom.themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.getElementById("app").setAttribute("data-theme", theme);
    setThemeIcon(theme);
  }

  /* ---------------------------- STAT BAR ---------------------------- */
  function updateStatbar(player) {
    dom.statName.textContent = player.name || "Digi";
    dom.statXp.textContent = player.xp;
    dom.statCoin.textContent = player.coins;
    dom.statCrystal.textContent = player.crystals;
  }

  /* ---------------------------- LANDING ---------------------------- */
  function renderLanding(player, hasProgress) {
    if (hasProgress) {
      dom.landingSaveInfo.classList.remove("hidden");
      dom.landingSaveInfo.textContent =
        "Progress tersimpan — " + player.name + " · Level " + Math.min(player.unlockedLevel, 10) + " · " + player.xp + " XP";
      dom.btnStartGame.textContent = "Lanjutkan Petualangan";
    } else {
      dom.landingSaveInfo.classList.add("hidden");
      dom.btnStartGame.textContent = "Mulai Petualangan";
    }
  }

  /* ---------------------------- TUTORIAL MODAL ---------------------------- */
  function renderTutorialSteps() {
    dom.tutorialSteps.innerHTML = "";
    TUTORIAL_STEPS.forEach(function (step) {
      const row = el("div", "tutorial-step");
      row.innerHTML =
        '<div class="tutorial-step-icon">' + step.icon + '</div>' +
        '<div><h3>' + step.title + '</h3><p>' + step.text + '</p></div>';
      dom.tutorialSteps.appendChild(row);
    });
  }

  /* ---------------------------- STORY INTRO ---------------------------- */
  function renderStoryLine(line, isLast) {
    const c = CHARACTERS[line.speaker] || CHARACTERS.byte;
    dom.storyPortrait.innerHTML = "";
    dom.storyPortrait.appendChild(assetSlot(ASSET_PATHS.characters[line.speaker], c.emoji, c.name, "asset-portrait"));
    dom.storySpeakerName.textContent = c.name;
    dom.storySpeakerText.textContent = line.text;
    dom.btnStoryNext.textContent = isLast ? "Mulai! 🚀" : "Lanjut ▶";
  }

  /* ---------------------------- WORLD MAP ---------------------------- */
  // Helper: set a CSS custom property to `url("...")` (or "none" jika path kosong),
  // dipakai untuk latar belakang bertema yang otomatis "diam" jika file belum ada.
  function setBgVar(el, varName, path) {
    if (!path) { el.style.setProperty(varName, "none"); return; }
    // PENTING: url() di dalam custom property CSS di-resolve relatif terhadap
    // lokasi STYLESHEET (css/style.css), bukan index.html — jadi path relatif
    // diubah dulu jadi URL absolut di sini supaya selalu benar dari mana pun
    // custom property ini dipakai.
    const absoluteUrl = new URL(path, document.baseURI).href;
    el.style.setProperty(varName, 'url("' + absoluteUrl + '")');
  }

  /* ---------------------------- WORLD MAP ---------------------------- */
  // seasonMeta: salah satu entri dari SEASONS (lihat data.js) — berisi
  // .id, .levels, .finalLevel, dst. Supaya Peta DigiLand bisa menampilkan
  // Season 1 ATAU Season 2 secara generik tanpa hardcode.
  function renderMap(player, seasonMeta, effectiveUnlockedLevel) {
    dom.mapPath.innerHTML = "";
    if (effectiveUnlockedLevel === undefined || effectiveUnlockedLevel === null) {
      effectiveUnlockedLevel = player.unlockedLevel;
    }

    const mapBgPath = ASSET_PATHS.world[seasonMeta.mapBackgroundKey] || ASSET_PATHS.world.mapBackground;
    setBgVar(dom.mapHeroBanner, "--map-hero-image", mapBgPath);
    // Kelas has-image ditambahkan lewat cek onload manual: karena CSS background-image
    // tidak mempunyai event bawaan, kita coba muat gambar via Image() untuk tahu apakah
    // filenya benar-benar ada sebelum memberi tinggi pada banner (supaya tidak ada
    // kotak kosong jika gambar belum ditambahkan).
    dom.mapHeroBanner.classList.remove("has-image");
    if (mapBgPath) {
      const probe = new Image();
      probe.onload = function () { dom.mapHeroBanner.classList.add("has-image"); };
      probe.src = mapBgPath;
    }

    dom.mapHeadingTitle.textContent = "Peta DigiLand — " + seasonMeta.title + ": " + seasonMeta.subtitle;

    const allLevels = seasonMeta.levels.concat([seasonMeta.finalLevel]);
    allLevels.forEach(function (lv) {
      const unlocked = effectiveUnlockedLevel >= lv.id;
      const completed = !!(player.levelStars && player.levelStars[lv.id]);
      const btn = el("button", "map-node" + (unlocked ? " unlocked" : " locked") + (completed ? " completed" : "") + (lv.id === seasonMeta.finalLevel.id ? " node-final" : ""));
      btn.setAttribute("data-num", lv.id);
      btn.disabled = !unlocked;
      setBgVar(btn, "--card-bg-image", ASSET_PATHS.levelBackgrounds[lv.id]);
      const starsCount = completed ? player.levelStars[lv.id] : 0;
      const starsDisplay = unlocked ? "★".repeat(starsCount) + "☆".repeat(3 - starsCount) : "🔒";

      const iconSpan = el("span", "node-icon");
      iconSpan.appendChild(unlocked
        ? assetSlot(ASSET_PATHS.levelIcons[lv.id], lv.icon, lv.title, "asset-level-icon")
        : assetSlot(ASSET_PATHS.badges.lock, "🔒", "Terkunci", "asset-level-icon"));

      const infoSpan = el("span", "node-info");
      infoSpan.appendChild(el("span", "node-title", lv.title));
      infoSpan.appendChild(el("span", "node-concept", lv.concept));

      const starsSpan = el("span", "node-stars", starsDisplay);

      btn.appendChild(iconSpan);
      btn.appendChild(infoSpan);
      btn.appendChild(starsSpan);

      if (unlocked) {
        btn.addEventListener("click", function () {
          DH_AUDIO.play("click");
          if (typeof renderMap.onSelectLevel === "function") renderMap.onSelectLevel(lv.id);
        });
      }
      dom.mapPath.appendChild(btn);
    });
  }

  // Mengatur tampilan tab "Season 1" / "Season 2" di atas Peta DigiLand.
  function setSeasonTabs(activeSeasonId, season2Unlocked) {
    dom.tabSeason1.classList.toggle("active", activeSeasonId === 1);
    dom.tabSeason2.classList.toggle("active", activeSeasonId === 2);
    dom.tabSeason2.classList.toggle("locked", !season2Unlocked);
    dom.tabSeason2.querySelector(".season-tab-lock").classList.toggle("hidden", season2Unlocked);
  }



  /* ---------------------------- LESSON MODAL ---------------------------- */
  function openLessonModal(levelLikeConfig) {
    dom.lessonPortrait.innerHTML = "";
    dom.lessonPortrait.appendChild(assetSlot(ASSET_PATHS.characters.byte, CHARACTERS.byte.emoji, CHARACTERS.byte.name, "asset-portrait"));
    dom.lessonConceptBadge.textContent = levelLikeConfig.concept;
    dom.lessonTitle.textContent = levelLikeConfig.title;
    dom.lessonStory.textContent = levelLikeConfig.story;
    dom.lessonText.textContent = levelLikeConfig.lesson;
    openModal(dom.modalLesson);
  }

  /* ---------------------------- RESULT MODAL ---------------------------- */
  function openResultModal(stars, rewardXP, rewardCoin, rewardCrystal, isFinal) {
    dom.resultStars.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const filled = i < stars;
      const s = assetSlot(filled ? ASSET_PATHS.badges.starFilled : ASSET_PATHS.badges.starEmpty, filled ? "⭐" : "☆", "", "asset-star");
      dom.resultStars.appendChild(s);
    }
    dom.resultTitle.textContent = isFinal ? "DigiLand Terselamatkan! 🎉" : "Misi Selesai!";
    dom.resultSubtitle.textContent = isFinal
      ? "Core telah pulih sepenuhnya berkat dirimu!"
      : (stars === 3 ? "Sempurna! Kerja bagus, Digital Hero!" : stars === 2 ? "Bagus sekali, terus berlatih!" : "Berhasil! Sedikit lagi jadi sempurna.");
    dom.resultXp.textContent = rewardXP;
    dom.resultCoin.textContent = rewardCoin;
    dom.resultCrystal.textContent = rewardCrystal;
    openModal(dom.modalResult);
    DH_AUDIO.play("levelComplete");
    confettiBurst(isFinal ? 2600 : 1400);
  }

  /* ---------------------------- LEVEL HEADER ---------------------------- */
  function setLevelHeader(icon, title, concept, byteTip, stageLabel, levelId) {
    dom.levelIcon.innerHTML = "";
    dom.levelIcon.appendChild(assetSlot(levelId ? ASSET_PATHS.levelIcons[levelId] : null, icon, title, "asset-level-icon"));
    dom.levelTitle.textContent = title;
    dom.levelConceptBadge.textContent = concept;
    dom.levelByteTipIcon.innerHTML = "";
    dom.levelByteTipIcon.appendChild(assetSlot(ASSET_PATHS.characters.byte, CHARACTERS.byte.emoji, CHARACTERS.byte.name, "asset-inline-icon"));
    dom.levelByteTipText.textContent = byteTip || "";
    $("level-byte-tip").classList.toggle("hidden", !byteTip);
    if (stageLabel) {
      dom.stageProgress.textContent = stageLabel;
      dom.stageProgress.classList.remove("hidden");
    } else {
      dom.stageProgress.classList.add("hidden");
    }
  }

  /* ==========================================================================
     STAGE: RUNNER (grid + block builder)
     Dipakai oleh level bertipe "runner" (1,3,4,5,6,7) dan tahap 1 & 2 Final.
     ========================================================================== */
  function renderRunnerStage(container, cfg, hints, topText, callbacks, hintState) {
    container.innerHTML = "";
    hintState = hintState || { used: 0 }; // shared counter so Final Challenge's 3 hints persist across tahap

    let attempts = 0;
    let isAnimating = false;
    let programTree = [];

    // Level 6 (Bug Hunter) mulai dengan program yang sudah terisi (ada bug)
    if (cfg.buggyProgram) {
      programTree = cfg.buggyProgram.map(function (t) { return { type: t }; });
    }
    let focusPath = []; // array of {idx, branch:'children'|'then'|'elseBranch'}

    const rows = cfg.grid.length;
    const cols = cfg.grid[0].length;

    /* ---- markup ---- */
    const stageEl = el("div", "stage runner-stage");
    if (topText) stageEl.appendChild(el("p", "stage-lesson", topText));

    const layout = el("div", "runner-layout");
    const gridWrap = el("div", "grid-wrap");
    const gridEl = el("div", "game-grid");
    gridEl.style.setProperty("--cols", cols);
    gridEl.style.setProperty("--rows", rows);
    gridWrap.appendChild(gridEl);

    let varPanel = null;
    if (cfg.doorRequirement) {
      varPanel = el("div", "var-panel", '🪙 coin = <span id="var-coin-val">0</span> / ' + cfg.doorRequirement);
      gridWrap.appendChild(varPanel);
    }

    const feedbackEl = el("div", "run-feedback");
    feedbackEl.setAttribute("aria-live", "polite");
    gridWrap.appendChild(feedbackEl);

    const builderWrap = el("div", "builder-wrap");
    const paletteEl = el("div", "block-palette");
    (cfg.availableBlocks || []).forEach(function (type) {
      const meta = BLOCK_META[type];
      const b = el("button", "block-btn");
      b.appendChild(assetSlot(ASSET_PATHS.blocks[type], meta.icon, meta.label, "asset-block-icon"));
      b.appendChild(document.createTextNode(" " + meta.label));
      b.setAttribute("data-block", type);
      b.addEventListener("click", function () { if (!isAnimating) addBlock(type); });
      paletteEl.appendChild(b);
    });

    const focusBanner = el("div", "focus-banner hidden");
    const programAreaEl = el("div", "program-area");

    const actionsEl = el("div", "builder-actions");
    const clearBtn = el("button", "btn btn-ghost", "🗑️ Hapus Semua");
    const hintBtn = el("button", "btn btn-hint", "💡 Hint (" + (hints ? (hints.length - hintState.used) : 0) + ")");
    const runBtn = el("button", "btn btn-primary btn-run", "▶️ RUN");
    actionsEl.appendChild(clearBtn);
    actionsEl.appendChild(hintBtn);
    actionsEl.appendChild(runBtn);

    builderWrap.appendChild(paletteEl);
    builderWrap.appendChild(focusBanner);
    builderWrap.appendChild(programAreaEl);
    builderWrap.appendChild(actionsEl);

    layout.appendChild(gridWrap);
    layout.appendChild(builderWrap);
    stageEl.appendChild(layout);
    container.appendChild(stageEl);

    if (!hints || hints.length === 0) hintBtn.classList.add("hidden");
    if (hints && hintState.used >= hints.length) hintBtn.disabled = true;

    /* ---- render grid cells (selalu dari data asli / pristine) ---- */
    let cellEls = [];
    let charEl = null;
    function drawPristineGrid() {
      gridEl.innerHTML = "";
      cellEls = [];
      for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
          const ch = cfg.grid[r][c];
          const cell = el("div", "cell");
          if (ch === "#") { cell.classList.add("cell-wall"); cell.appendChild(assetSlot(ASSET_PATHS.obstacles.wall, "", "Batu", "asset-cell-icon")); }
          else if (ch === "C") { cell.classList.add("cell-crystal"); cell.appendChild(assetSlot(ASSET_PATHS.items.crystal, "💎", "Crystal", "asset-cell-icon")); }
          else if (ch === "O") { cell.classList.add("cell-coin"); cell.appendChild(assetSlot(ASSET_PATHS.items.coin, "🪙", "Coin", "asset-cell-icon")); }
          else if (ch === "D") { cell.classList.add("cell-door"); cell.appendChild(assetSlot(ASSET_PATHS.obstacles.door, "🚪", "Pintu", "asset-cell-icon")); }
          gridEl.appendChild(cell);
          rowArr.push(cell);
        }
        cellEls.push(rowArr);
      }
      charEl = el("div", "char-sprite");
      charEl.innerHTML = '<span class="char-arrow">➤</span>';
      gridEl.appendChild(charEl);
      positionChar(cfg.start.row, cfg.start.col, cfg.start.facing, false);
      if (varPanel) varPanel.querySelector("#var-coin-val").textContent = "0";
    }

    function positionChar(row, col, facing, animated) {
      const size = getCellSize();
      charEl.style.top = (row * (size + 4) + 8) + "px";
      charEl.style.left = (col * (size + 4) + 8) + "px";
      charEl.querySelector(".char-arrow").style.transform = "rotate(" + FACING_DEG[facing] + "deg)";
      if (!animated) charEl.style.transition = "none"; else charEl.style.transition = "";
      if (!animated) requestAnimationFrame(function () { charEl.style.transition = ""; });
    }

    function getCellSize() {
      const val = getComputedStyle(gridEl).getPropertyValue("--cell-size") || getComputedStyle(document.documentElement).getPropertyValue("--cell-size");
      const n = parseFloat(val);
      return isNaN(n) ? 58 : n;
    }

    drawPristineGrid();

    /* ---- program tree helpers ---- */
    function getContainer(path) {
      let list = programTree;
      for (let i = 0; i < path.length; i++) {
        const step = path[i];
        const node = list[step.idx];
        list = node[step.branch];
      }
      return list;
    }
    function pathsEqual(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i].idx !== b[i].idx || a[i].branch !== b[i].branch) return false;
      return true;
    }
    function pathStartsWith(path, prefix) {
      if (path.length < prefix.length) return false;
      for (let i = 0; i < prefix.length; i++) if (path[i].idx !== prefix[i].idx || path[i].branch !== prefix[i].branch) return false;
      return true;
    }

    function addBlock(type) {
      DH_AUDIO.play("add");
      const container = getContainer(focusPath);
      if (type === "MOVE" || type === "LEFT" || type === "RIGHT" || type === "COLLECT") {
        container.push({ type: type });
      } else if (type === "REPEAT") {
        container.push({ type: "REPEAT", count: 3, children: [] });
      } else if (type === "IF") {
        const cond = (cfg.conditions && cfg.conditions[0]) || "WALL_AHEAD";
        container.push({ type: "IF", condition: cond, then: [], elseBranch: [] });
      }
      renderProgram();
    }

    function removeAt(path, idx) {
      DH_AUDIO.play("remove");
      const container = getContainer(path);
      container.splice(idx, 1);
      // reset fokus jika sedang fokus di dalam blok yang dihapus
      if (pathStartsWith(focusPath, path) && focusPath.length > path.length && focusPath[path.length].idx === idx) {
        focusPath = [];
      }
      renderProgram();
    }

    // Menggeser satu blok naik/turun DI DALAM container yang sama — supaya
    // pemain bisa memperbaiki urutan blok tanpa harus menghapus semuanya
    // (penting untuk Level 6 - Bug Hunter, tempat bug bisa ada di tengah program).
    function moveBlock(path, idx, direction) {
      const container = getContainer(path);
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= container.length) return;
      const tmp = container[idx];
      container[idx] = container[newIdx];
      container[newIdx] = tmp;
      DH_AUDIO.play("click");
      renderProgram();
    }

    function renderNode(node, path, idx) {
      const wrap = el("div", "prog-block");
      wrap.setAttribute("data-type", node.type);
      const row = el("div", "prog-block-row");
      const meta = BLOCK_META[node.type];
      let labelText = meta.icon + " " + meta.label;
      if (node.type === "REPEAT") labelText += " × " + node.count;
      if (node.type === "IF") labelText += ": " + (CONDITION_LABEL[node.condition] || node.condition);
      row.appendChild(el("span", "prog-block-label", labelText));

      if (node.type === "REPEAT") {
        const stepper = el("div", "prog-stepper");
        const minus = el("button", null, "−");
        const plus = el("button", null, "+");
        minus.addEventListener("click", function (e) { e.stopPropagation(); node.count = Math.max(2, node.count - 1); renderProgram(); });
        plus.addEventListener("click", function (e) { e.stopPropagation(); node.count = Math.min(10, node.count + 1); renderProgram(); });
        stepper.appendChild(minus); stepper.appendChild(plus);
        row.appendChild(stepper);
      }

      const siblingCount = getContainer(path).length;
      const moveUpBtn = el("button", "prog-remove-btn", "▲");
      moveUpBtn.disabled = idx === 0;
      moveUpBtn.addEventListener("click", function (e) { e.stopPropagation(); moveBlock(path, idx, -1); });
      const moveDownBtn = el("button", "prog-remove-btn", "▼");
      moveDownBtn.disabled = idx === siblingCount - 1;
      moveDownBtn.addEventListener("click", function (e) { e.stopPropagation(); moveBlock(path, idx, 1); });
      row.appendChild(moveUpBtn);
      row.appendChild(moveDownBtn);

      const removeBtn = el("button", "prog-remove-btn", "✕");
      removeBtn.addEventListener("click", function (e) { e.stopPropagation(); removeAt(path, idx); });
      row.appendChild(removeBtn);
      wrap.appendChild(row);

      if (node.type === "REPEAT") {
        wrap.appendChild(renderNested(node.children, path.concat([{ idx: idx, branch: "children" }]), "Isi Perulangan"));
      }
      if (node.type === "IF") {
        wrap.appendChild(renderNested(node.then, path.concat([{ idx: idx, branch: "then" }]), "✅ JIKA YA"));
        wrap.appendChild(renderNested(node.elseBranch, path.concat([{ idx: idx, branch: "elseBranch" }]), "❌ JIKA TIDAK"));
      }
      return wrap;
    }

    function renderNested(list, path, labelText) {
      const nested = el("div", "prog-nested");
      const isFocused = pathsEqual(focusPath, path);
      nested.classList.toggle("focused", isFocused);
      nested.appendChild(el("div", "prog-nested-label", labelText));
      if (list.length === 0) {
        nested.appendChild(el("div", "prog-nested-empty", isFocused ? "Ketuk blok di atas untuk menambah di sini" : "Ketuk untuk memilih lokasi ini"));
      } else {
        list.forEach(function (child, i) { nested.appendChild(renderNode(child, path, i)); });
      }
      nested.addEventListener("click", function (e) {
        if (isAnimating) return;
        e.stopPropagation();
        focusPath = path;
        renderProgram();
      });
      return nested;
    }

    function renderProgram() {
      programAreaEl.innerHTML = "";
      programAreaEl.classList.toggle("focused-root", focusPath.length === 0);
      if (focusPath.length > 0) {
        focusBanner.classList.remove("hidden");
        focusBanner.innerHTML = '📍 Blok baru ditambahkan di dalam blok bersarang. <button type="button">Kembali ke Program Utama</button>';
        focusBanner.querySelector("button").addEventListener("click", function () { focusPath = []; renderProgram(); });
      } else {
        focusBanner.classList.add("hidden");
      }
      if (programTree.length === 0) {
        programAreaEl.appendChild(el("div", "program-empty-hint", "Ketuk blok perintah di atas untuk mulai menyusun program!"));
      } else {
        programAreaEl.addEventListener("click", function () { if (!isAnimating) { focusPath = []; renderProgram(); } }, { once: true });
        programTree.forEach(function (node, i) { programAreaEl.appendChild(renderNode(node, [], i)); });
      }
    }
    renderProgram();

    /* ---- HINT ---- */
    hintBtn.addEventListener("click", function () {
      if (!hints || hintState.used >= hints.length || isAnimating) return;
      showToast("💡 " + hints[hintState.used]);
      DH_AUDIO.play("hint");
      hintState.used++;
      hintBtn.textContent = "💡 Hint (" + (hints.length - hintState.used) + ")";
      if (hintState.used >= hints.length) hintBtn.disabled = true;
    });

    /* ---- CLEAR ---- */
    clearBtn.addEventListener("click", function () {
      if (isAnimating) return;
      programTree = [];
      focusPath = [];
      renderProgram();
      DH_AUDIO.play("click");
    });

    /* ---- RUN ---- */
    runBtn.addEventListener("click", function () {
      if (isAnimating) return;
      if (programTree.length === 0) { showToast("Susun dulu program-nya, ya!"); return; }
      runProgramNow();
    });

    async function runProgramNow() {
      isAnimating = true;
      attempts++;
      runBtn.disabled = true; clearBtn.disabled = true;
      feedbackEl.className = "run-feedback";
      feedbackEl.textContent = "";
      drawPristineGrid();
      DH_AUDIO.play("run");
      await delay(250);

      const result = DH_ENGINE.runProgram(programTree, cfg, 1);

      for (let i = 0; i < result.trace.length; i++) {
        const action = result.trace[i];
        if (action.action === "move") {
          positionChar(action.to.row, action.to.col, currentFacingFromTrace(result.trace, i), true);
          DH_AUDIO.play("move");
          await delay(320);
        } else if (action.action === "turn") {
          const cur = charPositionFromTrace(result.trace, i);
          positionChar(cur.row, cur.col, action.facing, true);
          await delay(220);
        } else if (action.action === "collect") {
          cellEls[action.at.row][action.at.col].textContent = "";
          cellEls[action.at.row][action.at.col].classList.remove("cell-crystal", "cell-coin");
          DH_AUDIO.play("collect");
          if (varPanel) varPanel.querySelector("#var-coin-val").textContent = String(result.finalState.vars.coin);
          await delay(260);
        } else if (action.action === "blocked") {
          charEl.classList.add("char-blocked");
          DH_AUDIO.play("fail");
          await delay(380);
          charEl.classList.remove("char-blocked");
        } else if (action.action === "doorLocked") {
          charEl.classList.add("char-blocked");
          DH_AUDIO.play("fail");
          await delay(380);
          charEl.classList.remove("char-blocked");
        }
      }

      if (result.success) {
        feedbackEl.classList.add("feedback-success");
        feedbackEl.textContent = "🎉 Berhasil! Digi menyelesaikan misi ini.";
        DH_AUDIO.play("success");
        await delay(700);
        isAnimating = false;
        callbacks.onSuccess({ attempts: attempts, hintsUsed: hintState.used });
      } else {
        feedbackEl.classList.add("feedback-fail");
        feedbackEl.textContent = failMessage(result.reason);
        DH_AUDIO.play("fail");
        // Beri jeda sebentar supaya pemain sempat melihat DI MANA Digi gagal,
        // lalu kembalikan panah & grid ke posisi/keadaan semula (bug lama:
        // panah tertinggal di posisi terakhir & tidak reset setelah gagal).
        await delay(650);
        drawPristineGrid();
        isAnimating = false;
        runBtn.disabled = false; clearBtn.disabled = false;
        if (hints && hintState.used < hints.length) hintBtn.disabled = false;
        if (callbacks.onFail) callbacks.onFail({ attempts: attempts, reason: result.reason });
      }
    }

    function currentFacingFromTrace(trace, uptoIndex) {
      let facing = cfg.start.facing;
      for (let i = 0; i <= uptoIndex; i++) if (trace[i].action === "turn") facing = trace[i].facing;
      return facing;
    }
    function charPositionFromTrace(trace, uptoIndex) {
      let pos = { row: cfg.start.row, col: cfg.start.col };
      for (let i = 0; i < uptoIndex; i++) if (trace[i].action === "move") pos = trace[i].to;
      return pos;
    }
    function failMessage(reason) {
      if (reason === "wall") return "😅 Ups, Digi menabrak batu! Periksa lagi arah dan jumlah langkahnya.";
      if (reason === "door_locked") return "🔒 Pintu masih terkunci. Kumpulkan coin lebih banyak dulu!";
      if (reason === "too_long") return "🌀 Programnya terlalu panjang. Coba sederhanakan lagi.";
      return "🤔 Belum berhasil — crystal belum diambil. Coba tambah/ubah langkahnya!";
    }
  }

  /* ==========================================================================
     STAGE: ORDER (Sequence City — Level 2)
     ========================================================================== */
  function renderOrderStage(container, levelConfig, callbacks) {
    container.innerHTML = "";
    let attempts = 0, hintsUsed = 0, isChecking = false;
    const solution = levelConfig.solutionOrder;
    const shuffled = solution.slice().sort(function () { return Math.random() - 0.5; });
    let userOrder = [];

    const stageEl = el("div", "stage order-stage");
    stageEl.appendChild(el("p", "stage-lesson", levelConfig.lesson));

    const visual = el("div", "order-visual");
    const iconEls = solution.map(function (step) {
      const ic = el("div", "order-icon", levelConfig.orderIcons[step] || "🔹");
      visual.appendChild(ic);
      return ic;
    });
    stageEl.appendChild(visual);

    const palette = el("div", "order-palette");
    const paletteBtns = {};
    shuffled.forEach(function (step) {
      const b = el("button", "order-block-btn", step);
      b.addEventListener("click", function () {
        if (isChecking) return;
        userOrder.push(step);
        b.disabled = true;
        DH_AUDIO.play("add");
        renderProgramPills();
      });
      paletteBtns[step] = b;
      palette.appendChild(b);
    });
    stageEl.appendChild(palette);

    const programArea = el("div", "order-program-area");
    stageEl.appendChild(programArea);

    const actionsEl = el("div", "builder-actions");
    const clearBtn = el("button", "btn btn-ghost", "🗑️ Hapus Semua");
    const hintBtn = el("button", "btn btn-hint", "💡 Hint (" + levelConfig.hints.length + ")");
    const runBtn = el("button", "btn btn-primary btn-run", "▶️ RUN");
    actionsEl.appendChild(clearBtn); actionsEl.appendChild(hintBtn); actionsEl.appendChild(runBtn);
    stageEl.appendChild(actionsEl);

    const feedbackEl = el("div", "run-feedback");
    stageEl.appendChild(feedbackEl);

    container.appendChild(stageEl);

    function renderProgramPills() {
      programArea.innerHTML = "";
      if (userOrder.length === 0) {
        programArea.appendChild(el("div", "program-empty-hint", "Ketuk blok di atas sesuai urutan yang menurutmu benar!"));
        return;
      }
      userOrder.forEach(function (step, i) {
        const pill = el("div", "order-pill");
        pill.appendChild(el("span", "order-pill-label", step));
        const up = el("button", null, "▲");
        const down = el("button", null, "▼");
        const del = el("button", null, "✕");
        up.addEventListener("click", function () { if (i > 0) { swap(i, i - 1); } });
        down.addEventListener("click", function () { if (i < userOrder.length - 1) { swap(i, i + 1); } });
        del.addEventListener("click", function () {
          paletteBtns[userOrder[i]].disabled = false;
          userOrder.splice(i, 1);
          DH_AUDIO.play("remove");
          renderProgramPills();
        });
        pill.appendChild(up); pill.appendChild(down); pill.appendChild(del);
        programArea.appendChild(pill);
      });
    }
    renderProgramPills();

    clearBtn.addEventListener("click", function () {
      if (isChecking) return;
      userOrder = [];
      Object.keys(paletteBtns).forEach(function (k) { paletteBtns[k].disabled = false; });
      renderProgramPills();
    });

    hintBtn.addEventListener("click", function () {
      if (hintsUsed >= levelConfig.hints.length) return;
      showToast("💡 " + levelConfig.hints[hintsUsed]);
      DH_AUDIO.play("hint");
      hintsUsed++;
      hintBtn.textContent = "💡 Hint (" + (levelConfig.hints.length - hintsUsed) + ")";
      if (hintsUsed >= levelConfig.hints.length) hintBtn.disabled = true;
    });

    runBtn.addEventListener("click", async function () {
      if (isChecking || userOrder.length === 0) return;
      isChecking = true;
      attempts++;
      runBtn.disabled = true; clearBtn.disabled = true;
      feedbackEl.className = "run-feedback";
      iconEls.forEach(function (ic) { ic.classList.remove("lit", "wrong"); });

      const check = DH_ENGINE.checkOrder(userOrder, solution);
      const litCount = check.success ? solution.length : check.firstWrongIndex;

      for (let i = 0; i < litCount; i++) {
        await delay(260);
        iconEls[i].classList.add("lit");
        DH_AUDIO.play("collect");
      }
      if (!check.success) {
        await delay(200);
        if (check.firstWrongIndex >= 0 && check.firstWrongIndex < iconEls.length) {
          iconEls[check.firstWrongIndex].classList.add("wrong");
        }
        DH_AUDIO.play("fail");
        feedbackEl.classList.add("feedback-fail");
        feedbackEl.textContent = "😅 Urutan langkah ke-" + (check.firstWrongIndex + 1) + " belum tepat. Coba atur ulang!";
        isChecking = false;
        runBtn.disabled = false; clearBtn.disabled = false;
        if (callbacks.onFail) callbacks.onFail({ attempts: attempts });
      } else {
        DH_AUDIO.play("success");
        feedbackEl.classList.add("feedback-success");
        feedbackEl.textContent = "🎉 Urutan benar! Kota Digital menyala kembali.";
        await delay(700);
        callbacks.onSuccess({ attempts: attempts, hintsUsed: hintsUsed });
      }
    });
  }

  /* ==========================================================================
     STAGE: CHOICE (dipakai Level 8, 9 & Final tahap 3 - kuis)
     items: [{icon, prompt, options:[{text, correct, feedback}]}]
     ========================================================================== */
  function renderChoiceStage(container, items, hints, callbacks, hintState) {
    container.innerHTML = "";
    hintState = hintState || { used: 0 }; // shared counter so Final Challenge's 3 hints persist across tahap
    let index = 0;
    let attempts = 1;

    const stageEl = el("div", "stage choice-stage");
    const progressEl = el("div", "choice-progress");
    items.forEach(function () { progressEl.appendChild(el("span", "choice-dot")); });
    stageEl.appendChild(progressEl);

    const cardHolder = el("div");
    stageEl.appendChild(cardHolder);

    const actionsEl = el("div", "builder-actions");
    const hintBtn = el("button", "btn btn-hint", "💡 Hint (" + (hints ? (hints.length - hintState.used) : 0) + ")");
    actionsEl.appendChild(hintBtn);
    stageEl.appendChild(actionsEl);
    if (!hints || hints.length === 0) hintBtn.classList.add("hidden");
    if (hints && hintState.used >= hints.length) hintBtn.disabled = true;

    container.appendChild(stageEl);

    function updateDots() {
      Array.prototype.forEach.call(progressEl.children, function (dot, i) {
        dot.classList.toggle("done", i < index);
        dot.classList.toggle("active", i === index);
      });
    }

    function renderCard() {
      updateDots();
      cardHolder.innerHTML = "";
      const item = items[index];
      const card = el("div", "choice-card");
      card.appendChild(el("div", "choice-icon", item.icon || "❓"));
      card.appendChild(el("p", "choice-prompt", item.prompt));
      const optWrap = el("div", "choice-options");
      item.options.forEach(function (opt) {
        const b = el("button", "choice-option-btn", opt.text);
        b.addEventListener("click", function () { selectOption(item, opt, b, optWrap); });
        optWrap.appendChild(b);
      });
      card.appendChild(optWrap);
      const fb = el("div", "choice-feedback hidden");
      card.appendChild(fb);
      cardHolder.appendChild(card);
    }

    function selectOption(item, opt, btnEl, optWrap) {
      const fb = optWrap.parentElement.querySelector(".choice-feedback");
      if (opt.correct) {
        btnEl.classList.add("correct");
        Array.prototype.forEach.call(optWrap.children, function (b) { b.disabled = true; });
        fb.classList.remove("hidden", "bad");
        fb.classList.add("ok");
        fb.textContent = opt.feedback;
        DH_AUDIO.play("success");
        setTimeout(function () {
          index++;
          if (index >= items.length) {
            callbacks.onSuccess({ attempts: attempts, hintsUsed: hintState.used });
          } else {
            renderCard();
          }
        }, 900);
      } else {
        attempts++;
        btnEl.classList.add("wrong");
        btnEl.disabled = true;
        fb.classList.remove("hidden", "ok");
        fb.classList.add("bad");
        fb.textContent = opt.feedback;
        DH_AUDIO.play("fail");
        if (callbacks.onFail) callbacks.onFail({ attempts: attempts });
      }
    }

    hintBtn.addEventListener("click", function () {
      if (!hints || hintState.used >= hints.length) return;
      showToast("💡 " + hints[hintState.used]);
      DH_AUDIO.play("hint");
      hintState.used++;
      hintBtn.textContent = "💡 Hint (" + (hints.length - hintState.used) + ")";
      if (hintState.used >= hints.length) hintBtn.disabled = true;
    });

    renderCard();
  }

  /* ---------------------------- MOUNT DISPATCHER ---------------------------- */
  function mountLevel(levelConfig, callbacks) {
    setLevelHeader(levelConfig.icon, levelConfig.title, levelConfig.concept, levelConfig.byteTip, null, levelConfig.id);
    setBgVar(dom.screens.level, "--level-bg-image", ASSET_PATHS.levelBackgrounds[levelConfig.id]);
    if (levelConfig.type === "runner") {
      renderRunnerStage(dom.levelStage, levelConfig, levelConfig.hints, levelConfig.lesson, callbacks);
    } else if (levelConfig.type === "order") {
      renderOrderStage(dom.levelStage, levelConfig, callbacks);
    } else if (levelConfig.type === "decision") {
      dom.levelStage.innerHTML = "";
      const top = el("p", "stage-lesson", levelConfig.lesson);
      dom.levelStage.appendChild(top);
      const holder = el("div");
      dom.levelStage.appendChild(holder);
      renderChoiceStage(holder, levelConfig.scenarios, levelConfig.hints, callbacks);
    }
  }

  // finalLevelConfig: FINAL_LEVEL (Season 1) atau FINAL_LEVEL_S2 (Season 2) —
  // di-passing dari game.js supaya fungsi ini tidak hardcode ke satu Season saja.
  function mountFinalStage(stageIndex, totalStages, stageConfig, finalLevelConfig, callbacks, hintState) {
    setLevelHeader(finalLevelConfig.icon, stageConfig.title, finalLevelConfig.concept, finalLevelConfig.byteTip, "Tahap " + (stageIndex + 1) + "/" + totalStages, finalLevelConfig.id);
    setBgVar(dom.screens.level, "--level-bg-image", ASSET_PATHS.levelBackgrounds[finalLevelConfig.id]);
    // hintState dibagikan (di-passing dari game.js) supaya kuota "3 hint" berlaku untuk
    // SELURUH Final Challenge (3 tahap), bukan 3 hint per tahap.
    if (stageConfig.type === "runner") {
      renderRunnerStage(dom.levelStage, stageConfig, finalLevelConfig.hints, stageConfig.instruction, callbacks, hintState);
    } else if (stageConfig.type === "quiz") {
      dom.levelStage.innerHTML = "";
      const top = el("p", "stage-lesson", stageConfig.instruction);
      dom.levelStage.appendChild(top);
      const holder = el("div");
      dom.levelStage.appendChild(holder);
      const items = stageConfig.questions.map(function (q, i) {
        return {
          icon: "❓",
          prompt: (i + 1) + ". " + q.prompt,
          options: q.options.map(function (text, oi) {
            return { text: text, correct: oi === q.correctIndex, feedback: oi === q.correctIndex ? "Benar sekali! 🎉" : "Belum tepat, coba pikirkan lagi." };
          })
        };
      });
      renderChoiceStage(holder, items, finalLevelConfig.hints, callbacks, hintState);
    }
  }

  /* ==========================================================================
     SERTIFIKAT & ENDING
     ========================================================================== */
  // storyArray: ENDING_STORY (Season 1) atau ENDING_STORY_S2 (grand finale)
  function renderEndingStory(storyArray) {
    dom.endingStory.innerHTML = "";
    storyArray.forEach(function (line) {
      const c = CHARACTERS[line.speaker] || CHARACTERS.core;
      const row = el("div", "ending-line");
      row.appendChild(assetSlot(ASSET_PATHS.characters[line.speaker], c.emoji, c.name, "asset-inline-icon"));
      const textWrap = el("span", "ending-line-text");
      const nameEl = el("b", null, c.name + ": ");
      textWrap.appendChild(nameEl);
      textWrap.appendChild(document.createTextNode(line.text));
      row.appendChild(textWrap);
      dom.endingStory.appendChild(row);
    });
  }

  // certText: CERTIFICATE_TEXT (Season 1) atau CERTIFICATE_TEXT_S2 (grand finale)
  // crystalMax/starsMax: total yang bisa dicapai pada titik ini (10/30 di akhir
  // Season 1, 20/60 di akhir Season 2) — dipakai sbg penyebut "X / Y".
  // badgePath: ASSET_PATHS.badges.trophy atau .trophySeason2
  function renderCertificate(player, totalStars, certText, crystalMax, starsMax, badgePath) {
    dom.certBadgeSlot.innerHTML = "";
    dom.certBadgeSlot.appendChild(assetSlot(badgePath, "🏆", "Lencana", null));
    dom.certHeading.textContent = certText.heading;
    dom.certSubheading.textContent = certText.subheading;
    dom.certPlayerName.textContent = player.name;
    dom.certBody.textContent = certText.body;
    dom.certXp.textContent = player.xp;
    dom.certCrystal.textContent = player.crystals;
    dom.certCrystalMax.textContent = crystalMax;
    dom.certStars.textContent = totalStars;
    dom.certStarsMax.textContent = starsMax;
    dom.certFooter.textContent = certText.footer;
  }

  // Menampilkan/menyembunyikan tombol "Lanjutkan ke Season 2" di layar ending
  // (hanya relevan sesudah menyelesaikan Season 1 — di akhir Season 2 disembunyikan).
  function setEndingContinueButton(show) {
    dom.btnContinueSeason2.classList.toggle("hidden", !show);
  }

  /* ==========================================================================
     CONFETTI (canvas 2D sederhana, tanpa library eksternal)
     ========================================================================== */
  let confettiCtx = null;
  function initConfettiCanvas() {
    const canvas = dom.confettiCanvas;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    confettiCtx = canvas.getContext("2d");
  }

  function confettiBurst(durationMs) {
    if (!confettiCtx) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = dom.confettiCanvas;
    const colors = ["#6C5CE7", "#00B8A9", "#FFB627", "#F5544D", "#22B573"];
    const particles = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.3,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10
      });
    }
    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.rotation += p.vr;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        confettiCtx.restore();
      });
      if (elapsed < durationMs) {
        requestAnimationFrame(frame);
      } else {
        confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------- PUBLIC API ---------------------------- */
  return {
    init: function () { cacheDom(); initConfettiCanvas(); },
    dom: function () { return dom; },
    showScreen: showScreen,
    setBackHandler: setBackHandler,
    openModal: openModal,
    closeAllModals: closeAllModals,
    showConfirm: showConfirm,
    openSeasonTokenModal: openSeasonTokenModal,
    showSeasonTokenError: showSeasonTokenError,
    showToast: showToast,
    setSoundIcon: setSoundIcon,
    applyTheme: applyTheme,
    updateStatbar: updateStatbar,
    renderLanding: renderLanding,
    renderTutorialSteps: renderTutorialSteps,
    renderStoryLine: renderStoryLine,
    renderMap: renderMap,
    setSeasonTabs: setSeasonTabs,
    openLessonModal: openLessonModal,
    openResultModal: openResultModal,
    setLevelHeader: setLevelHeader,
    mountLevel: mountLevel,
    mountFinalStage: mountFinalStage,
    renderEndingStory: renderEndingStory,
    renderCertificate: renderCertificate,
    setEndingContinueButton: setEndingContinueButton,
    confettiBurst: confettiBurst
  };
})();
