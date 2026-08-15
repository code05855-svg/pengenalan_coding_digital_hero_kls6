/* ============================================================================
   DIGITAL HERO — audio.js
   ----------------------------------------------------------------------------
   Efek suara sederhana memakai Web Audio API (oscillator/"bunyi bip"),
   TANPA file audio eksternal — supaya game tetap ringan dan bisa langsung
   dijalankan tanpa internet / tanpa aset tambahan.

   Jika suatu saat ingin memakai file suara asli (mp3/wav), Anda bisa
   menambahkan <audio> tag di index.html dan memanggilnya di sini.
   TODO-ASET: ganti bunyi bip ini dengan file suara sungguhan jika tersedia.
   ============================================================================ */

const DH_AUDIO = (function () {
  let ctx = null;
  let enabled = true;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    // Beberapa browser mem-suspend AudioContext sampai ada interaksi user
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function setEnabled(value) {
    enabled = !!value;
  }

  function isEnabled() {
    return enabled;
  }

  // Membunyikan satu nada sederhana
  function tone(freq, duration, type, volume, delay) {
    if (!enabled) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    const startTime = audioCtx.currentTime + (delay || 0);
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume || 0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  const failSoundMp3 = new Audio('assets/sounds/spongebob-fail.mp3');
  failSoundMp3.volume = 0.8;

  const succesSoundMp3 = new Audio('assets/sounds/cihuy.mp3');
  succesSoundMp3.volume = 0.8;

  // Kumpulan efek suara bernama, dipakai oleh ui.js / game.js
  const SFX = {
    click: function () { tone(520, 0.08, "square", 0.08); },
    add: function () { tone(660, 0.09, "square", 0.09); },
    remove: function () { tone(300, 0.09, "square", 0.08); },
    run: function () { tone(440, 0.12, "triangle", 0.12); },
    move: function () { tone(500, 0.06, "square", 0.05, 0); },
    collect: function () {
      tone(700, 0.09, "triangle", 0.14, 0);
      tone(950, 0.12, "triangle", 0.14, 0.08);
    },
    // success: function () {
    //   tone(523.25, 0.12, "triangle", 0.15, 0);
    //   tone(659.25, 0.12, "triangle", 0.15, 0.11);
    //   tone(783.99, 0.22, "triangle", 0.16, 0.22);
    // },
    success: function (){
      if (!enabled) return;
      succesSoundMp3.currentTime = 0;

      succesSoundMp3.play().catch(function(error){
        console.log("Audio terpotong atau belum siap:", error);
      });
    },
    // fail: function () {
    //   tone(300, 0.18, "sawtooth", 0.12, 0);
    //   tone(220, 0.22, "sawtooth", 0.12, 0.12);
    // },
    fail: function () {
      if (!enabled) return;

      // 2. Reset audio ke detik 0 setiap kali fungsi ini dipanggil
      failSoundMp3.currentTime = 0; 
      
      // 3. Mainkan audio (tambahkan catch untuk mencegah error di console jika terpotong cepat)
      failSoundMp3.play().catch(function(error) {
        console.log("Audio terpotong atau belum siap:", error);
      });
    },
    star: function () { tone(880, 0.1, "sine", 0.12); },
    levelComplete: function () {
      tone(523.25, 0.1, "triangle", 0.15, 0);
      tone(659.25, 0.1, "triangle", 0.15, 0.1);
      tone(783.99, 0.1, "triangle", 0.15, 0.2);
      tone(1046.5, 0.25, "triangle", 0.17, 0.3);
    },
    hint: function () { tone(600, 0.1, "sine", 0.1); tone(750, 0.12, "sine", 0.1, 0.1); },
    open: function () { tone(400, 0.08, "sine", 0.1); },
    close: function () { tone(350, 0.08, "sine", 0.08); }
  };

  function play(name) {
    if (SFX[name]) SFX[name]();
  }

  return {
    setEnabled: setEnabled,
    isEnabled: isEnabled,
    play: play
  };
})();
