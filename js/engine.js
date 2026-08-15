/* ============================================================================
   DIGITAL HERO — engine.js
   ----------------------------------------------------------------------------
   "Otak" dari puzzle coding bertipe grid (runner). File ini TIDAK tahu apa-apa
   soal tampilan (HTML/CSS) — tugasnya murni mensimulasikan program yang
   disusun pemain (MOVE, LEFT, RIGHT, COLLECT, REPEAT, IF/ELSE) di atas denah
   grid, lalu menghasilkan "trace" (jejak langkah demi langkah) yang nanti
   dipakai ui.js untuk menganimasikan karakter Digi.

   Kenapa dipisah begini? Supaya mudah ditest & dimodifikasi tanpa harus
   menyentuh kode tampilan sama sekali.
   ============================================================================ */

const DH_ENGINE = (function () {

  // Arah mata angin dalam bentuk delta baris/kolom
  const DIR_DELTA = {
    up:    { dr: -1, dc: 0 },
    down:  { dr: 1,  dc: 0 },
    left:  { dr: 0,  dc: -1 },
    right: { dr: 0,  dc: 1 }
  };

  // Putar searah jarum jam (blok RIGHT)
  const CLOCKWISE = { up: "right", right: "down", down: "left", left: "up" };
  // Putar berlawanan jarum jam (blok LEFT)
  const COUNTER_CLOCKWISE = { up: "left", left: "down", down: "right", right: "up" };

  // Batas pengaman supaya REPEAT bersarang tidak membuat browser hang
  const MAX_PRIMITIVE_STEPS = 400;

  /* ---------- Util grid ---------- */

  // Ubah array string ("S..", "..C") menjadi array-of-array karakter
  function parseGrid(gridStrings) {
    return gridStrings.map(function (row) { return row.split(""); });
  }

  function inBounds(cells, row, col) {
    return row >= 0 && row < cells.length && col >= 0 && col < cells[0].length;
  }

  function cellAt(cells, row, col) {
    if (!inBounds(cells, row, col)) return "#"; // di luar peta dianggap dinding
    return cells[row][col];
  }

  /* ---------- Menyiapkan state simulasi baru dari data level ---------- */
  function createRunState(levelConfig) {
    return {
      cells: parseGrid(levelConfig.grid),
      pos: { row: levelConfig.start.row, col: levelConfig.start.col },
      facing: levelConfig.start.facing,
      vars: { coin: 0 },
      doorRequirement: levelConfig.doorRequirement || null,
      collectedCount: 0,
      failed: false,
      failReason: null,
      stepCount: 0
    };
  }

  // Sel yang ada tepat di depan karakter (dipakai untuk IF & COLLECT "jangkauan")
  function cellAhead(state) {
    const d = DIR_DELTA[state.facing];
    const r = state.pos.row + d.dr;
    const c = state.pos.col + d.dc;
    return { row: r, col: c, value: cellAt(state.cells, r, c) };
  }

  function evaluateCondition(condition, state) {
    const ahead = cellAhead(state);
    if (condition === "WALL_AHEAD") {
      if (ahead.value === "#") return true;
      if (ahead.value === "D") {
        const need = state.doorRequirement || 0;
        return state.vars.coin < need; // pintu terkunci dihitung seperti dinding
      }
      return false;
    }
    if (condition === "CRYSTAL_AHEAD") {
      return ahead.value === "C";
    }
    return false;
  }

  /* ---------- Eksekusi satu node program ---------- */
  // trace: array yang akan diisi dengan aksi-aksi primitif untuk dianimasikan UI
  function execNode(node, state, trace) {
    if (state.failed) return;
    state.stepCount++;
    if (state.stepCount > MAX_PRIMITIVE_STEPS) {
      state.failed = true;
      state.failReason = "too_long";
      trace.push({ action: "fail", reason: "too_long" });
      return;
    }

    switch (node.type) {
      case "MOVE": {
        const d = DIR_DELTA[state.facing];
        const targetRow = state.pos.row + d.dr;
        const targetCol = state.pos.col + d.dc;
        const targetVal = cellAt(state.cells, targetRow, targetCol);

        if (targetVal === "#") {
          state.failed = true;
          state.failReason = "wall";
          trace.push({ action: "blocked", to: { row: targetRow, col: targetCol } });
          trace.push({ action: "fail", reason: "wall" });
          return;
        }
        if (targetVal === "D") {
          const need = state.doorRequirement || 0;
          if (state.vars.coin < need) {
            state.failed = true;
            state.failReason = "door_locked";
            trace.push({ action: "doorLocked", to: { row: targetRow, col: targetCol }, need: need, have: state.vars.coin });
            trace.push({ action: "fail", reason: "door_locked" });
            return;
          }
        }
        state.pos = { row: targetRow, col: targetCol };
        trace.push({ action: "move", to: { row: targetRow, col: targetCol } });
        return;
      }

      case "LEFT": {
        state.facing = COUNTER_CLOCKWISE[state.facing];
        trace.push({ action: "turn", facing: state.facing });
        return;
      }

      case "RIGHT": {
        state.facing = CLOCKWISE[state.facing];
        trace.push({ action: "turn", facing: state.facing });
        return;
      }

      case "COLLECT": {
        // Ambil item di sel saat ini ATAU di sel yang dihadapi (lebih ramah anak)
        const here = cellAt(state.cells, state.pos.row, state.pos.col);
        const ahead = cellAhead(state);

        if (here === "C" || here === "O") {
          state.cells[state.pos.row][state.pos.col] = ".";
          if (here === "C") state.collectedCount++;
          if (here === "O") state.vars.coin++;
          trace.push({ action: "collect", at: { row: state.pos.row, col: state.pos.col }, item: here });
        } else if (ahead.value === "C" || ahead.value === "O") {
          state.cells[ahead.row][ahead.col] = ".";
          if (ahead.value === "C") state.collectedCount++;
          if (ahead.value === "O") state.vars.coin++;
          trace.push({ action: "collect", at: { row: ahead.row, col: ahead.col }, item: ahead.value });
        } else {
          trace.push({ action: "collectEmpty" });
        }
        return;
      }

      case "REPEAT": {
        const count = node.count || 1;
        for (let i = 0; i < count; i++) {
          execList(node.children || [], state, trace);
          if (state.failed) return;
        }
        return;
      }

      case "IF": {
        const result = evaluateCondition(node.condition, state);
        trace.push({ action: "checkCondition", condition: node.condition, result: result });
        if (result) {
          execList(node.then || [], state, trace);
        } else {
          execList(node.elseBranch || [], state, trace);
        }
        return;
      }

      default:
        return; // node tidak dikenali -> abaikan (tidak seharusnya terjadi)
    }
  }

  function execList(list, state, trace) {
    for (let i = 0; i < list.length; i++) {
      if (state.failed) return;
      execNode(list[i], state, trace);
    }
  }

  /* ---------- Fungsi utama yang dipanggil UI ---------- */
  // programTree: array of node (lihat format di atas)
  // levelConfig: salah satu object dari LEVELS / stage runner di FINAL_LEVEL
  // requiredCrystals: berapa crystal yang wajib diambil supaya dianggap menang (default 1)
  function runProgram(programTree, levelConfig, requiredCrystals) {
    requiredCrystals = requiredCrystals || 1;
    const state = createRunState(levelConfig);
    const trace = [];

    execList(programTree, state, trace);

    let success = false;
    let reason = null;

    if (state.failed) {
      success = false;
      reason = state.failReason;
    } else if (state.collectedCount >= requiredCrystals) {
      success = true;
      trace.push({ action: "success" });
    } else {
      success = false;
      reason = "incomplete";
    }

    return {
      success: success,
      reason: reason,
      trace: trace,
      finalState: state
    };
  }

  /* ---------- Pengecekan untuk level bertipe "order" (Sequence City) ---------- */
  function checkOrder(userOrder, solutionOrder) {
    let firstWrongIndex = -1;
    const len = Math.min(userOrder.length, solutionOrder.length);
    for (let i = 0; i < len; i++) {
      if (userOrder[i] !== solutionOrder[i]) {
        firstWrongIndex = i;
        break;
      }
    }
    const success = firstWrongIndex === -1 && userOrder.length === solutionOrder.length;
    return { success: success, firstWrongIndex: firstWrongIndex };
  }

  // Hitung total blok primitif dalam sebuah program tree (dipakai utk cek "efisiensi")
  function countBlocks(list) {
    let n = 0;
    (list || []).forEach(function (node) {
      n++;
      if (node.type === "REPEAT") n += countBlocks(node.children);
      if (node.type === "IF") { n += countBlocks(node.then); n += countBlocks(node.elseBranch); }
    });
    return n;
  }

  return {
    DIR_DELTA: DIR_DELTA,
    CLOCKWISE: CLOCKWISE,
    COUNTER_CLOCKWISE: COUNTER_CLOCKWISE,
    parseGrid: parseGrid,
    createRunState: createRunState,
    runProgram: runProgram,
    checkOrder: checkOrder,
    countBlocks: countBlocks
  };
})();
