/* ============================================================================
   DIGITAL HERO — data.js
   ----------------------------------------------------------------------------
   SEMUA KONTEN GAME ADA DI SINI: teks cerita, soal per level, denah grid,
   pertanyaan kuis, dialog karakter, dsb.

   FILE INI SENGAJA DIPISAH DARI LOGIKA GAME (lihat engine.js, ui.js, game.js)
   supaya mahasiswa/KKN yang tidak familiar dengan logic game tetap bisa:
     - mengubah teks/cerita
     - mengubah denah level / posisi crystal
     - menambah level baru
     - mengganti soal kuis
   TANPA perlu menyentuh file logic sama sekali.

   Jika Anda TIDAK familiar dengan JavaScript, cukup ubah teks di dalam
   tanda kutip ' ... ' atau " ... " — jangan ubah nama properti (bagian
   sebelum tanda titik dua ":").
   ============================================================================ */


/* ----------------------------------------------------------------------------
   0) PETA ASET GAMBAR — ASSET_PATHS
   ----------------------------------------------------------------------------
   SATU-SATUNYA tempat yang menyimpan lokasi file gambar yang dipakai game.
   Setiap slot di bawah ini sudah "dikabelkan" (wired) ke tampilan game lewat
   fungsi assetSlot() di js/ui.js — begitu Anda menaruh file gambar dengan
   NAMA & LOKASI PERSIS seperti path di bawah, gambar itu otomatis muncul
   menggantikan emoji bawaan. Jika file belum ada, game tetap berjalan
   normal memakai emoji (tidak akan error/rusak).

   SEMUA FORMAT GAMBAR = PNG (disamakan supaya konsisten dengan aset yang
   sudah ditambahkan). Jika Anda menaruh file JPG, cukup ganti akhiran path
   di bawah ini dari ".png" menjadi ".jpg" — tidak ada pengaruh lain.

   Dipetakan mengikuti 9 kategori aset dari dokumen referensi, untuk Season 1
   (misi 1-10) DAN Season 2 (misi 11-20):
     1. Karakter utama      -> characters
     2. Peta Dunia DigiLand  -> world
     3. Latar belakang level -> levelBackgrounds
     4. Koleksi Item         -> items
     5. Musuh & rintangan    -> obstacles
     6. Elemen UI             -> blocks (ikon blok perintah coding)
     7. NPC pendukung         -> characters.byte (Byte = NPC mentor di game ini)
     8. Dialog Box            -> dialog
     9. Icon & badge          -> levelIcons, badges

   FORMAT & UKURAN YANG DISARANKAN ada di assets/README.txt.
   ---------------------------------------------------------------------------- */
const ASSET_PATHS = {
  // LOGO GAME — dipakai besar di layar utama (landing) & kecil di pojok atas.
  branding: {
    logo: "assets/images/items/logo.png"
  },

  // (1) KARAKTER UTAMA — potret tiap tokoh. Dipakai di: dialog cerita
  // pembuka, modal "Materi Singkat" sebelum misi, dan layar penutup/ending.
  // Disarankan: PNG transparan persegi, 256x256px, gaya kartun ramah anak.
  characters: {
    digi:  "assets/images/characters/digi.png",
    byte:  "assets/images/characters/byte.png",   // dipakai juga sbg NPC pendukung (kategori 7) di byte-tip & hint
    buggy: "assets/images/characters/buggy.png",
    core:  "assets/images/characters/core.png",
    glitch: "assets/images/characters/glitch.png" // tokoh baru Season 2 — dalang di balik gangguan Core
  },

  // (2) PETA DUNIA DIGILAND — gambar latar layar World Map. Boleh beda
  // gambar untuk tiap Season (mis. peta Season 2 menampilkan area baru);
  // jika mapBackgroundSeason2 belum diisi, otomatis memakai mapBackground.
  // Disarankan: PNG, ±1000x1600px (potret) atau lanskap lebar, penuh warna.
  world: {
    mapBackground: "assets/images/world/digiland-map-bg.png",
    mapBackgroundSeason2: "assets/images/world/digiland-map-bg-season2.png"
  },

  // (3) LATAR BELAKANG LEVEL — satu gambar latar per misi (1-9 + final utk
  // Season 1, 11-19 + final utk Season 2), tampil di belakang kartu soal &
  // area permainan saat misi dimainkan, JUGA sbg latar tipis di kartu misi
  // pada Peta DigiLand. Boleh diisi sebagian saja.
  // Disarankan: PNG, ±1200x800px.
  levelBackgrounds: {
    1: "assets/images/backgrounds/level-1.png",
    2: "assets/images/backgrounds/level-2.png",
    3: "assets/images/backgrounds/level-3.png",
    4: "assets/images/backgrounds/level-4.png",
    5: "assets/images/backgrounds/level-5.png",
    6: "assets/images/backgrounds/level-6.png",
    7: "assets/images/backgrounds/level-7.png",
    8: "assets/images/backgrounds/level-8.png",
    9: "assets/images/backgrounds/level-9.png",
    10: "assets/images/backgrounds/level-final.png",
    11: "assets/images/backgrounds/level-11.png",
    12: "assets/images/backgrounds/level-12.png",
    13: "assets/images/backgrounds/level-13.png",
    14: "assets/images/backgrounds/level-14.png",
    15: "assets/images/backgrounds/level-15.png",
    16: "assets/images/backgrounds/level-16.png",
    17: "assets/images/backgrounds/level-17.png",
    18: "assets/images/backgrounds/level-18.png",
    19: "assets/images/backgrounds/level-19.png",
    20: "assets/images/backgrounds/level-20-final.png"
  },

  // (4) KOLEKSI ITEM — item yang dikumpulkan pemain, tampil di kotak grid
  // permainan DAN di stat bar bagian atas. Disarankan: PNG transparan, 128x128px.
  items: {
    crystal: "assets/images/items/crystal.png",
    coin: "assets/images/items/coin.png"
  },

  // (5) MUSUH & RINTANGAN — ubin rintangan di dalam grid permainan.
  // Catatan: karakter "Buggy"/"Glitch" (musuh cerita) memakai characters.*
  // di atas — mereka tampil sbg potret dialog, bukan sprite di dalam grid.
  // Disarankan: PNG transparan, 128x128px.
  obstacles: {
    wall: "assets/images/obstacles/wall-tile.png",
    door: "assets/images/obstacles/door.png"
  },

  // (6) ELEMEN UI — ikon tiap blok perintah coding di palet blok. Disarankan:
  // PNG transparan, 64x64px, gaya ikon sederhana (bukan foto).
  blocks: {
    MOVE: "assets/images/ui/icon-move.png",
    LEFT: "assets/images/ui/icon-left.png",
    RIGHT: "assets/images/ui/icon-right.png",
    COLLECT: "assets/images/ui/icon-collect.png",
    REPEAT: "assets/images/ui/icon-repeat.png",
    IF: "assets/images/ui/icon-if.png"
  },

  // (8) DIALOG BOX — gambar dekoratif tipis di belakang kotak dialog cerita
  // (teks tetap di lapisan atas, jadi tetap kebaca walau gambarnya ramai).
  // Disarankan: PNG, ±800x400px.
  dialog: {
    boxBackground: "assets/images/dialog/dialogue-box-bg.png"
  },

  // (9) ICON & BADGE — ikon tiap misi (dipakai di Peta DigiLand & header
  // level) serta lencana pencapaian. Disarankan: PNG transparan, 128x128px.
  levelIcons: {
    1: "assets/images/icons/level-1.png",
    2: "assets/images/icons/level-2.png",
    3: "assets/images/icons/level-3.png",
    4: "assets/images/icons/level-4.png",
    5: "assets/images/icons/level-5.png",
    6: "assets/images/icons/level-6.png",
    7: "assets/images/icons/level-7.png",
    8: "assets/images/icons/level-8.png",
    9: "assets/images/icons/level-9.png",
    10: "assets/images/icons/level-final.png",
    11: "assets/images/icons/level-11.png",
    12: "assets/images/icons/level-12.png",
    13: "assets/images/icons/level-13.png",
    14: "assets/images/icons/level-14.png",
    15: "assets/images/icons/level-15.png",
    16: "assets/images/icons/level-16.png",
    17: "assets/images/icons/level-17.png",
    18: "assets/images/icons/level-18.png",
    19: "assets/images/icons/level-19.png",
    20: "assets/images/icons/level-20-final.png"
  },
  badges: {
    starFilled: "assets/images/icons/star-filled.png",
    starEmpty: "assets/images/icons/star-empty.png",
    trophy: "assets/images/icons/badge-trophy.png",
    trophySeason2: "assets/images/icons/badge-trophy-season2.png",
    lock: "assets/images/icons/lock.png"
  }
};

/* ----------------------------------------------------------------------------
   1) KARAKTER
   Emoji dipakai sebagai fallback visual — gambar aslinya diatur di
   ASSET_PATHS.characters di atas (otomatis dipakai begitu file ditambahkan).
   ---------------------------------------------------------------------------- */
const CHARACTERS = {
  digi: {
    name: "Digi",
    emoji: "🧑\u200d🚀",
    role: "Digital Hero pemula"
  },
  byte: {
    name: "Byte",
    emoji: "🤖",
    role: "Robot mentor"
  },
  buggy: {
    name: "Buggy",
    emoji: "🐛",
    role: "Suka mengacaukan kode"
  },
  core: {
    name: "Core",
    emoji: "🌐",
    role: "Sistem pusat DigiLand"
  },
  glitch: {
    name: "Glitch",
    emoji: "👾",
    role: "Dalang misterius di balik gangguan Core (muncul di Season 2)"
  }
};

/* ----------------------------------------------------------------------------
   2) CERITA PEMBUKA (ditampilkan sekali sebelum World Map pertama kali)
   ---------------------------------------------------------------------------- */
const STORY_INTRO = [
  {
    speaker: "core",
    text: "Selamat datang di DigiLand... sistem pusatku, Core, mengalami gangguan besar. Seluruh dunia digital menjadi kacau!"
  },
  {
    speaker: "byte",
    text: "Halo! Aku Byte, robot kecil yang akan menemanimu. Untung kamu datang — kita butuh Digital Hero baru!"
  },
  {
    speaker: "byte",
    text: "Untuk memperbaiki Core, kita harus mengumpulkan 10 Digital Crystal dengan menyelesaikan 10 misi di seluruh DigiLand."
  },
  {
    speaker: "buggy",
    text: "Hihihi... aku, Buggy, akan mengacaukan beberapa kodemu di sepanjang jalan! Coba saja kalau bisa~"
  },
  {
    speaker: "digi",
    text: "Tenang saja, Byte. Aku siap belajar dan menyelamatkan DigiLand, satu misi demi satu misi!"
  }
];

/* ----------------------------------------------------------------------------
   2b) CERITA PEMBUKA SEASON 2 (ditampilkan sekali sebelum Peta DigiLand
   Season 2 pertama kali, sesudah pemain menyelesaikan Season 1)
   ---------------------------------------------------------------------------- */
const STORY_INTRO_S2 = [
  {
    speaker: "core",
    text: "Energi utamaku sudah pulih... tapi aku mendeteksi sinyal aneh dari Network Node — stasiun-stasiun kecil yang menjaga keamanan jaringan DigiLand."
  },
  {
    speaker: "byte",
    text: "Network Node? Kalau sampai semuanya rusak, gangguan seperti kemarin bisa terjadi lagi — bahkan mungkin lebih parah!"
  },
  {
    speaker: "buggy",
    text: "Sebenarnya... ada yang perlu kuakui. Waktu itu, ada 'seseorang' yang mengirimiku instruksi aneh sebelum aku mengacaukan kode kalian."
  },
  {
    speaker: "buggy",
    text: "Aku takut, tapi aku tidak mau DigiLand rusak lagi. Kali ini aku mau bantu kalian, sungguh-sungguh."
  },
  {
    speaker: "glitch",
    text: "Hehehe... licik sekali, Buggy, berkhianat dari bayang-bayang. Tidak masalah — Node demi Node akan tetap jatuh ke tanganku!"
  },
  {
    speaker: "digi",
    text: "Siapa pun kamu, Glitch — kami akan menjaga setiap Network Node dan menghentikan rencanamu. Ayo, tim, kita mulai!"
  }
];

/* Tips singkat dari Byte, dipakai di layar "Cara Bermain" */
const TUTORIAL_STEPS = [
  {
    icon: "🗺️",
    title: "Peta DigiLand",
    text: "Pilih misi di peta. Misi terbuka satu per satu — selesaikan misi sebelumnya untuk membuka misi berikutnya."
  },
  {
    icon: "📘",
    title: "Materi Singkat",
    text: "Sebelum tantangan dimulai, Byte akan menjelaskan materi singkat. Baca dulu, ya!"
  },
  {
    icon: "🧩",
    title: "Susun Blok Perintah",
    text: "Ketuk blok perintah untuk menambahkannya ke Area Program. Susun agar Digi bisa menyelesaikan misi."
  },
  {
    icon: "▶️",
    title: "Tombol RUN",
    text: "Tekan RUN untuk menjalankan program. Jika salah, tidak apa-apa — kamu bisa mencoba lagi!"
  },
  {
    icon: "💡",
    title: "Butuh Bantuan?",
    text: "Tekan tombol HINT jika bingung. Kamu punya maksimal 3 hint di setiap misi."
  },
  {
    icon: "🤖",
    title: "Ingat Pesan Byte",
    text: "Walau AI itu pintar, jawabannya tetap perlu diperiksa lagi ya — jangan langsung percaya begitu saja!"
  }
];

/* ----------------------------------------------------------------------------
   3) DATA GRID (untuk level bertipe "runner")
   Legenda karakter grid:
     '.'  = jalan kosong
     '#'  = batu/penghalang (tidak bisa dilewati)
     'C'  = Digital Crystal (tujuan koleksi utama)
     'O'  = Coin (dipakai khusus Level 7 - Variable Vault)
     'D'  = Pintu (hanya bisa dilewati jika syarat variabel terpenuhi)
   Posisi start dihitung terpisah (row, col dimulai dari 0, dari kiri-atas).
   facing awal salah satu dari: 'up' | 'down' | 'left' | 'right'
   ---------------------------------------------------------------------------- */

// Setiap level punya field "icon" (emoji, fallback) yang dipakai di World Map
// & header level — gambar aslinya diatur di ASSET_PATHS.levelIcons di atas.
const LEVELS = [
  /* ===================== LEVEL 1 — FIRST MISSION ===================== */
  {
    id: 1,
    key: "first-mission",
    title: "First Mission",
    subtitle: "Gerakkan Digi",
    icon: "🚀",
    type: "runner",
    concept: "Algoritma & Instruksi",
    story: "Digi baru saja tiba di DigiLand. Byte mengajaknya mengambil Digital Crystal pertama untuk memulai petualangan.",
    lesson: "Komputer menjalankan perintah secara berurutan, persis seperti resep masakan. Susun blok MOVE, LEFT, RIGHT, dan COLLECT agar Digi sampai ke Crystal.",
    byteTip: "Coba susun: MOVE, MOVE, RIGHT, lalu COLLECT untuk mengambil crystal di sebelah bawah!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
    maxBlocksHint: 6,
    grid: [
      "S..",
      "..C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Gunakan blok MOVE dua kali agar Digi berjalan ke ujung baris atas.",
      "Setelah itu, putar arah Digi dengan blok RIGHT supaya menghadap ke bawah.",
      "Terakhir, gunakan blok COLLECT untuk mengambil Digital Crystal di depan Digi."
    ],
    exampleSolution: ["MOVE", "MOVE", "RIGHT", "COLLECT"],
    rewardXP: 60,
    rewardCoin: 10
  },

  /* ===================== LEVEL 2 — SEQUENCE CITY ===================== */
  {
    id: 2,
    key: "sequence-city",
    title: "Sequence City",
    subtitle: "Urutan Instruksi",
    icon: "🏙️",
    type: "order",
    concept: "Sequence / Urutan",
    story: "Lampu Kota Digital mati total! Ternyata urutan perintah sistemnya tertukar.",
    lesson: "Urutan instruksi sangat penting. Jika urutannya salah, program tidak akan berjalan dengan benar meskipun bloknya benar.",
    byteTip: "Pikirkan: apa yang harus terjadi lebih dulu supaya langkah berikutnya masuk akal?",
    orderIcons: { "NYALAKAN GENERATOR": "🔋", "CEK ENERGI": "🔍", "AKTIFKAN JARINGAN": "📡", "JALANKAN SISTEM": "🖥️" },
    solutionOrder: ["NYALAKAN GENERATOR", "CEK ENERGI", "AKTIFKAN JARINGAN", "JALANKAN SISTEM"],
    hints: [
      "Sebelum sistem bisa berjalan, listrik harus dinyalakan terlebih dahulu.",
      "Setelah generator menyala, kita harus memastikan energinya cukup sebelum lanjut.",
      "Urutan yang benar adalah: NYALAKAN GENERATOR → CEK ENERGI → AKTIFKAN JARINGAN → JALANKAN SISTEM."
    ],
    rewardXP: 60,
    rewardCoin: 10
  },

  /* ===================== LEVEL 3 — MAZE OF LOGIC ===================== */
  {
    id: 3,
    key: "maze-of-logic",
    title: "Maze of Logic",
    subtitle: "Problem Solving",
    icon: "🌀",
    type: "runner",
    concept: "Algoritma & Perencanaan",
    story: "Digi harus melewati labirin rumit untuk mencapai Perpustakaan Digital DigiLand.",
    lesson: "Sebelum menekan RUN, rencanakan dulu seluruh rute di kepalamu. Program yang baik direncanakan sebelum dijalankan.",
    byteTip: "Perhatikan baik-baik jalan mana yang buntu sebelum menyusun blok!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
    maxBlocksHint: 10,
    grid: [
      "S.#.",
      "#.#.",
      "#...",
      "###C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Jalan lurus ke kanan langsung terhalang batu — Digi harus turun terlebih dahulu.",
      "Setelah turun dua kali, Digi perlu berbelok ke kanan untuk menyusuri jalan menuju crystal.",
      "Rute lengkap: MOVE, RIGHT, MOVE, MOVE, LEFT, MOVE, MOVE, RIGHT, MOVE, COLLECT."
    ],
    exampleSolution: ["MOVE", "RIGHT", "MOVE", "MOVE", "LEFT", "MOVE", "MOVE", "RIGHT", "MOVE", "COLLECT"],
    rewardXP: 70,
    rewardCoin: 15
  },

  /* ===================== LEVEL 4 — IF/ELSE FOREST ===================== */
  {
    id: 4,
    key: "if-else-forest",
    title: "IF/ELSE Forest",
    subtitle: "Percabangan Kondisi",
    icon: "🌲",
    type: "runner",
    concept: "Condition (IF / ELSE)",
    story: "Di Hutan Digital ada dua jalan: satu aman, satu lagi dipenuhi bebatuan.",
    lesson: "Program bisa mengambil keputusan berbeda tergantung kondisi. Contoh: JIKA ADA BATU DI DEPAN, maka belok. JIKA TIDAK, maka jalan terus.",
    byteTip: "Gunakan blok IF/ELSE dengan kondisi 'ADA BATU DI DEPAN' di awal jalur!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "IF"],
    conditions: ["WALL_AHEAD"],
    maxBlocksHint: 8,
    grid: [
      "S#.",
      "..C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Tambahkan blok IF dengan kondisi 'ADA BATU DI DEPAN' sejak langkah pertama.",
      "Jika kondisinya benar (ada batu), belokkan Digi ke kanan lalu MOVE ke bawah. Jika tidak, cukup MOVE maju.",
      "Setelah keluar dari blok IF, tambahkan LEFT, lalu MOVE dua kali dan COLLECT untuk mengambil crystal."
    ],
    exampleSolution: ["IF(WALL_AHEAD){RIGHT,MOVE}ELSE{MOVE}", "LEFT", "MOVE", "MOVE", "COLLECT"],
    rewardXP: 80,
    rewardCoin: 15
  },

  /* ===================== LEVEL 5 — LOOP FACTORY ===================== */
  {
    id: 5,
    key: "loop-factory",
    title: "Loop Factory",
    subtitle: "Perulangan (REPEAT)",
    icon: "🏭",
    type: "runner",
    concept: "Loop / Perulangan",
    story: "Robot-robot pabrik digital harus mengulang gerakan yang sama berkali-kali untuk sampai ke gudang Crystal.",
    lesson: "Daripada menulis MOVE berkali-kali satu per satu, kita bisa memakai blok REPEAT untuk mengulang perintah secara efisien.",
    byteTip: "Coba ganti lima blok MOVE dengan satu blok REPEAT 5x [MOVE] saja!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT"],
    maxBlocksHint: 4,
    grid: [
      "S.....C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Digi harus berjalan lurus sebanyak 6 langkah ke kanan.",
      "Gunakan blok REPEAT, atur jumlah ulangannya menjadi 6, lalu masukkan satu blok MOVE ke dalamnya.",
      "Setelah blok REPEAT selesai, tambahkan COLLECT di akhir program untuk mengambil crystal."
    ],
    exampleSolution: ["REPEAT6{MOVE}", "COLLECT"],
    rewardXP: 80,
    rewardCoin: 15
  },

  /* ===================== LEVEL 6 — BUG HUNTER ===================== */
  {
    id: 6,
    key: "bug-hunter",
    title: "Bug Hunter",
    subtitle: "Debugging",
    icon: "🔧",
    type: "runner",
    concept: "Debugging",
    story: "Buggy menyusup dan mengubah salah satu blok di programmu! Digi jadi tidak sampai ke tujuan.",
    lesson: "Debugging adalah proses menemukan dan memperbaiki kesalahan pada program. Jalankan dulu, amati di mana Digi 'tersesat', lalu perbaiki bloknya.",
    byteTip: "Coba tekan RUN dulu untuk melihat di mana letak kesalahannya!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
    maxBlocksHint: 4,
    grid: [
      "S.",
      "..",
      ".C"
    ],
    start: { row: 0, col: 0, facing: "down" },
    buggyProgram: ["MOVE", "MOVE", "RIGHT", "COLLECT"],
    hints: [
      "Jalankan dulu program bawaan ini dan perhatikan ke mana arah Digi menghadap setelah blok ketiga.",
      "Salah satu blok putar arah (LEFT/RIGHT) di program ini tertukar akibat ulah Buggy.",
      "Ganti blok RIGHT (yang ketiga) menjadi blok LEFT, supaya Digi berbelok menghadap crystal, bukan menjauh."
    ],
    exampleSolution: ["MOVE", "MOVE", "LEFT", "COLLECT"],
    rewardXP: 90,
    rewardCoin: 20
  },

  /* ===================== LEVEL 7 — VARIABLE VAULT ===================== */
  {
    id: 7,
    key: "variable-vault",
    title: "Variable Vault",
    subtitle: "Variabel Sederhana",
    icon: "🔐",
    type: "runner",
    concept: "Variable",
    story: "Ada pintu terkunci di Ruang Brankas Digital. Pintunya hanya terbuka jika Digi mengumpulkan cukup coin.",
    lesson: "Variabel adalah tempat menyimpan nilai/data, seperti kotak yang isinya bisa berubah. Di sini, variabel 'coin' bertambah setiap kali Digi mengambil koin.",
    byteTip: "Perhatikan nilai coin di layar — pintu butuh minimal 3 coin untuk terbuka!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT"],
    maxBlocksHint: 4,
    grid: [
      "SOOOD C".replace(" ", "")
    ],
    doorRequirement: 3,
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Gunakan REPEAT 3x yang berisi blok MOVE dan COLLECT untuk mengambil ketiga coin secara efisien.",
      "Variabel coin harus mencapai 3 sebelum Digi mencoba melewati pintu (blok D).",
      "Setelah coin = 3, tambahkan MOVE untuk membuka pintu, lalu MOVE dan COLLECT lagi untuk mengambil crystal."
    ],
    exampleSolution: ["REPEAT3{MOVE,COLLECT}", "MOVE", "MOVE", "COLLECT"],
    rewardXP: 90,
    rewardCoin: 20
  },

  /* ===================== LEVEL 8 — CYBER SAFE ===================== */
  {
    id: 8,
    key: "cyber-safe",
    title: "Cyber Safe",
    subtitle: "Keamanan Digital",
    icon: "🛡️",
    type: "decision",
    concept: "Cyber Safety / Phishing",
    story: "Kotak masuk digital Digi dipenuhi pesan-pesan mencurigakan. Bantu Digi memilih tindakan paling aman!",
    lesson: "Tidak semua pesan di internet itu jujur. Waspadai pesan yang meminta klik link, data pribadi, atau kata sandi secara mendadak.",
    byteTip: "Kalau ragu, jangan diklik dulu — tanyakan ke orang dewasa yang kamu percaya!",
    scenarios: [
      {
        id: "s1",
        icon: "🎁",
        prompt: "Pesan masuk: \"Selamat! Anda memenangkan HP terbaru. Klik link ini sekarang untuk klaim hadiah!\"",
        options: [
          { text: "Klik link secepatnya", correct: false, feedback: "Hati-hati! Link seperti ini biasanya penipuan (phishing) untuk mencuri data." },
          { text: "Abaikan dan laporkan pesannya", correct: true, feedback: "Betul! Mengabaikan dan melaporkan pesan mencurigakan adalah tindakan paling aman." },
          { text: "Balas pesan dengan data pribadi", correct: false, feedback: "Jangan pernah membagikan data pribadi ke pesan yang tidak dikenal." }
        ]
      },
      {
        id: "s2",
        icon: "🔑",
        prompt: "Seorang teman di chat game meminta password akun gamemu supaya bisa 'bantu naik level'.",
        options: [
          { text: "Berikan password itu ke teman", correct: false, feedback: "Password itu rahasia pribadi — jangan diberikan ke siapa pun, walau teman sendiri." },
          { text: "Tolak dengan sopan dan tidak memberikannya", correct: true, feedback: "Tepat sekali! Password tidak boleh dibagikan ke siapa pun." },
          { text: "Berikan setengah dari passwordnya saja", correct: false, feedback: "Sebagian password tetap berbahaya jika dibagikan. Sebaiknya jangan sama sekali." }
        ]
      },
      {
        id: "s3",
        icon: "📲",
        prompt: "Muncul pop-up: \"Update aplikasi gratis! Download sekarang dari link ini\" (bukan dari toko aplikasi resmi).",
        options: [
          { text: "Download langsung dari link tersebut", correct: false, feedback: "Aplikasi dari link tidak resmi bisa berbahaya untuk perangkatmu." },
          { text: "Cek dulu ke orang tua/guru sebelum mengunduh apa pun", correct: true, feedback: "Bagus! Selalu periksa ke orang dewasa yang kamu percaya sebelum memasang aplikasi baru." },
          { text: "Abaikan saja tanpa berpikir lagi", correct: false, feedback: "Boleh diabaikan, tapi lebih baik juga menceritakannya ke orang dewasa supaya tahu cara mengenalinya." }
        ]
      }
    ],
    hints: [
      "Pesan yang minta klik link secara mendadak biasanya berbahaya.",
      "Password dan data pribadi tidak boleh dibagikan ke siapa pun di internet.",
      "Jika ragu terhadap sebuah pesan atau link, tanyakan dulu ke orang dewasa yang kamu percaya."
    ],
    rewardXP: 80,
    rewardCoin: 15
  },

  /* ===================== LEVEL 9 — DIGITAL FOOTPRINT ===================== */
  {
    id: 9,
    key: "digital-footprint",
    title: "Digital Footprint",
    subtitle: "Privasi & Jejak Digital",
    icon: "👣",
    type: "decision",
    concept: "Digital Literacy / Privasi",
    story: "Digi ingin mengunggah foto liburannya ke internet. Bantu Digi memilah data mana yang aman dibagikan.",
    lesson: "Setiap aktivitas online meninggalkan jejak digital. Informasi pribadi seperti alamat rumah dan nomor telepon harus dijaga kerahasiaannya.",
    byteTip: "Tanyakan pada dirimu: kalau ini dibaca orang asing, apakah aku aman?",
    scenarios: [
      {
        id: "d1",
        icon: "🙂",
        prompt: "Nama depan dan hobi kesukaanmu.",
        options: [
          { text: "Aman dibagikan", correct: true, feedback: "Betul, nama depan dan hobi umumnya aman dibagikan secara wajar." },
          { text: "Harus dirahasiakan", correct: false, feedback: "Sebenarnya nama depan dan hobi termasuk info yang cukup aman untuk dibagikan secara wajar." }
        ]
      },
      {
        id: "d2",
        icon: "🏠",
        prompt: "Alamat rumah lengkap.",
        options: [
          { text: "Aman dibagikan", correct: false, feedback: "Alamat rumah lengkap bisa membuat orang tak dikenal menemukanmu. Sebaiknya dirahasiakan." },
          { text: "Harus dirahasiakan", correct: true, feedback: "Tepat! Alamat rumah lengkap termasuk data yang harus dijaga kerahasiaannya." }
        ]
      },
      {
        id: "d3",
        icon: "📞",
        prompt: "Nomor telepon orang tua.",
        options: [
          { text: "Aman dibagikan", correct: false, feedback: "Nomor telepon keluarga sebaiknya tidak disebarluaskan ke publik." },
          { text: "Harus dirahasiakan", correct: true, feedback: "Benar, nomor telepon keluarga termasuk data pribadi yang harus dijaga." }
        ]
      },
      {
        id: "d4",
        icon: "🏫",
        prompt: "Nama sekolah lengkap beserta kelasmu, diunggah bersama jadwal pulang sekolah.",
        options: [
          { text: "Aman dibagikan", correct: false, feedback: "Informasi ini bisa dipakai orang asing untuk mengetahui lokasi dan waktumu. Sebaiknya dirahasiakan." },
          { text: "Harus dirahasiakan", correct: true, feedback: "Tepat! Jadwal dan lokasi spesifik sebaiknya tidak dibagikan ke publik." }
        ]
      }
    ],
    hints: [
      "Tanyakan: apakah orang asing bisa menemukanku dari info ini?",
      "Nama depan dan hobi biasanya aman; alamat, nomor telepon, dan jadwal harian biasanya tidak.",
      "Jika info bisa dipakai untuk melacak lokasi/waktu spesifikmu, sebaiknya dirahasiakan."
    ],
    rewardXP: 80,
    rewardCoin: 15
  }
];

/* ----------------------------------------------------------------------------
   4) FINAL CHALLENGE (Level 10) — 3 tahap dalam satu misi besar
   ---------------------------------------------------------------------------- */
const FINAL_LEVEL = {
  id: 10,
  key: "final-challenge",
  title: "Final Challenge",
  subtitle: "Selamatkan DigiLand",
  icon: "💠",
  type: "final",
  concept: "Gabungan Semua Konsep",
  story: "Core hampir mati total. Semua yang telah Digi pelajari kini harus digunakan sekaligus untuk memulihkan DigiLand!",
  lesson: "Tantangan terakhir ini menggabungkan sequence, kondisi, loop, dan literasi digital. Selesaikan ketiga tahapnya untuk menjadi DIGITAL HERO sejati!",
  byteTip: "Tarik napas dulu — kerjakan satu tahap demi satu tahap, kamu pasti bisa!",
  rewardXP: 200,
  rewardCoin: 50,
  stages: [
    /* --- TAHAP 1: Sequence sederhana --- */
    {
      type: "runner",
      title: "Tahap 1 — Susun Sequence",
      instruction: "Susun blok perintah secara berurutan untuk mencapai Digital Crystal terakhir.",
      availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
      grid: ["S..", "..C"],
      start: { row: 0, col: 0, facing: "right" },
      exampleSolution: ["MOVE", "MOVE", "RIGHT", "COLLECT"]
    },
    /* --- TAHAP 2: Kondisi + Loop --- */
    {
      type: "runner",
      title: "Tahap 2 — Kondisi & Loop",
      instruction: "Gunakan IF/ELSE untuk menghindari batu, dan REPEAT agar programmu efisien.",
      availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT", "IF"],
      conditions: ["WALL_AHEAD"],
      grid: ["S#..", "...C"],
      start: { row: 0, col: 0, facing: "right" },
      exampleSolution: ["IF(WALL_AHEAD){RIGHT,MOVE}ELSE{MOVE}", "LEFT", "REPEAT3{MOVE}", "COLLECT"]
    },
    /* --- TAHAP 3: Kuis literasi digital --- */
    {
      type: "quiz",
      title: "Tahap 3 — Kuis Literasi Digital",
      instruction: "Jawab ketiga pertanyaan berikut untuk memulihkan Core sepenuhnya.",
      questions: [
        {
          prompt: "Apa yang sebaiknya dilakukan jika menerima pesan berisi link hadiah dari orang tak dikenal?",
          options: [
            "Klik link itu untuk memastikan isinya",
            "Abaikan dan laporkan, lalu ceritakan ke orang dewasa yang dipercaya",
            "Teruskan pesan itu ke semua teman"
          ],
          correctIndex: 1
        },
        {
          prompt: "Informasi apa yang sebaiknya TIDAK dibagikan sembarangan di internet?",
          options: [
            "Warna kesukaan",
            "Judul film favorit",
            "Alamat rumah dan nomor telepon"
          ],
          correctIndex: 2
        },
        {
          prompt: "Mengapa jawaban dari AI (kecerdasan buatan) tetap perlu diperiksa lagi?",
          options: [
            "Karena AI selalu berbohong",
            "Karena AI bisa saja salah atau kurang tepat, jadi perlu dicek ulang",
            "Karena AI tidak boleh dipakai sama sekali"
          ],
          correctIndex: 1
        }
      ]
    }
  ],
  hints: [
    "Kerjakan tahap satu per satu — kamu tidak perlu menyelesaikan semuanya sekaligus dalam satu waktu.",
    "Tahap 2 memakai konsep yang sama seperti Level 4 (IF/ELSE) dan Level 5 (REPEAT).",
    "Untuk tahap kuis, ingat kembali pelajaran dari Level 8 dan Level 9 tentang keamanan & privasi digital."
  ]
};

/* ============================================================================
   SEASON 2 — "JARINGAN NODE DIGILAND"
   ----------------------------------------------------------------------------
   Melanjutkan cerita Season 1: Core sudah pulih, namun stasiun-stasiun kecil
   bernama "Network Node" di seluruh DigiLand mulai terganggu oleh tokoh
   misterius bernama Glitch. Season 2 memakai konsep coding & literasi
   digital yang SAMA dengan Season 1, tapi dengan teka-teki yang lebih
   bervariasi & sedikit lebih menantang (kondisi berantai, loop bersarang,
   loop+kondisi digabung, debugging 2 bug sekaligus, dst).
   ============================================================================ */
const LEVELS_S2 = [
  /* ===================== LEVEL 11 — SECURE RELAY STATION ===================== */
  {
    id: 11,
    key: "secure-relay-station",
    title: "Secure Relay Station",
    subtitle: "Urutan Pesan Aman",
    icon: "📡",
    type: "order",
    concept: "Sequence Lanjutan (Keamanan Pesan)",
    story: "Menara relay pertama di jaringan DigiLand mati total — urutan protokol pengiriman pesan amannya tertukar akibat gangguan Glitch.",
    lesson: "Sama seperti instruksi coding, mengirim pesan digital yang aman juga perlu urutan yang benar: tulis dulu, periksa penerima, baru enkripsi & kirim.",
    byteTip: "Pikirkan: apa yang perlu dipastikan SEBELUM pesan benar-benar terkirim?",
    orderIcons: {
      "TULIS PESAN": "✍️",
      "PERIKSA PENERIMA": "🔍",
      "ENKRIPSI PESAN": "🔐",
      "KIRIM PESAN": "📤"
    },
    solutionOrder: ["TULIS PESAN", "PERIKSA PENERIMA", "ENKRIPSI PESAN", "KIRIM PESAN"],
    hints: [
      "Pesan harus ditulis dulu sebelum langkah apa pun yang lain.",
      "Sebelum dikirim, selalu pastikan dulu penerimanya benar dan pesannya sudah dienkripsi (diacak supaya aman).",
      "Urutan yang benar: TULIS PESAN → PERIKSA PENERIMA → ENKRIPSI PESAN → KIRIM PESAN."
    ],
    rewardXP: 70,
    rewardCoin: 15
  },

  /* ===================== LEVEL 12 — TWIN PATHS CAVERN ===================== */
  {
    id: 12,
    key: "twin-paths-cavern",
    title: "Twin Paths Cavern",
    subtitle: "Kondisi Berantai",
    icon: "🕳️",
    type: "runner",
    concept: "Kondisi Berantai (IF/ELSE 2x)",
    story: "Gua Node kedua punya DUA persimpangan berbatu berturut-turut — Digi harus mengambil keputusan dua kali dalam satu perjalanan.",
    lesson: "Program boleh memiliki lebih dari satu blok IF/ELSE secara berurutan — setiap kali ada persimpangan baru, programnya mengecek kondisi lagi.",
    byteTip: "Gunakan blok IF/ELSE di setiap kali Digi menghadapi kemungkinan ada batu di depan!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "IF"],
    conditions: ["WALL_AHEAD"],
    maxBlocksHint: 12,
    grid: [
      "S#..",
      "..#.",
      "...C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Persimpangan pertama ada tepat di depan Digi sejak awal — gunakan IF/ELSE untuk menghindarinya.",
      "Setelah melewati persimpangan pertama dan berjalan sedikit, Digi akan menghadapi batu kedua — gunakan IF/ELSE sekali lagi.",
      "Pola lengkap: IF ADA BATU (detour turun-lalu-kanan), lanjut, IF ADA BATU lagi (detour turun-lalu-kanan), lalu ambil crystal."
    ],
    exampleSolution: ["IF(WALL_AHEAD){RIGHT,MOVE}ELSE{MOVE}", "LEFT", "MOVE", "IF(WALL_AHEAD){RIGHT,MOVE}ELSE{MOVE}", "LEFT", "MOVE", "MOVE", "COLLECT"],
    rewardXP: 90,
    rewardCoin: 18
  },

  /* ===================== LEVEL 13 — NESTED LOOP LAB ===================== */
  {
    id: 13,
    key: "nested-loop-lab",
    title: "Nested Loop Lab",
    subtitle: "Perulangan Bersarang",
    icon: "🧬",
    type: "runner",
    concept: "Loop Bersarang (Nested Loop)",
    story: "Laboratorium robot Node ketiga berjalan dalam pola tangga berulang — Digi harus mengikuti pola yang sama untuk mencapai crystal.",
    lesson: "Kadang sebuah pola pengulangan punya pengulangan LEBIH KECIL di dalamnya — ini disebut nested loop (loop di dalam loop). Contoh: ulangi 3 kali [maju 2 langkah, lalu berbelok].",
    byteTip: "Coba taruh REPEAT di dalam REPEAT untuk pola tangga yang berulang!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT"],
    maxBlocksHint: 8,
    grid: [
      "S......",
      ".......",
      ".......",
      "......C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Perhatikan pola: belok bawah, maju 1 langkah, belok kanan lagi, lalu maju 2 langkah — pola ini berulang 3 kali membentuk tangga.",
      "Buat REPEAT 3x. Di dalamnya, tambahkan dulu PUTAR KANAN, MAJU, PUTAR KIRI — baru di bagian PALING AKHIR tambahkan satu REPEAT 2x [MAJU].",
      "Setelah pola tangga selesai (3 kali), kembali ke Program Utama lalu tambahkan AMBIL di akhir untuk mengambil crystal."
    ],
    exampleSolution: ["REPEAT3{RIGHT,MOVE,LEFT,REPEAT2{MOVE}}", "COLLECT"],
    rewardXP: 100,
    rewardCoin: 20
  },

  /* ===================== LEVEL 14 — LOOP & LOGIC CIRCUIT ===================== */
  {
    id: 14,
    key: "loop-logic-circuit",
    title: "Loop & Logic Circuit",
    subtitle: "Loop + Kondisi Gabungan",
    icon: "🔌",
    type: "runner",
    concept: "Loop + Kondisi (Gabungan)",
    story: "Sensor robot Node keempat harus berjalan otomatis di sepanjang sirkuit sampai mendeteksi crystal, lalu langsung mengambilnya.",
    lesson: "REPEAT dan IF/ELSE bisa digabung: robot terus berjalan (JIKA TIDAK ada crystal di depan → MAJU), tapi begitu crystal terdeteksi (JIKA ADA crystal di depan) ia langsung mengAMBILnya.",
    byteTip: "Taruh blok IF di dalam REPEAT: JIKA ADA CRYSTAL DI DEPAN → AMBIL, JIKA TIDAK → MAJU.",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT", "IF"],
    conditions: ["CRYSTAL_AHEAD"],
    maxBlocksHint: 3,
    grid: [
      "S....C"
    ],
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Digi perlu berjalan sampai 5 langkah sebelum crystal berada tepat di depannya.",
      "Buat REPEAT 5x yang di dalamnya berisi satu blok IF: JIKA ADA CRYSTAL DI DEPAN maka AMBIL, JIKA TIDAK maka MAJU.",
      "Program lengkap hanya butuh SATU blok REPEAT berisi SATU blok IF/ELSE — tidak perlu blok lain di luar itu."
    ],
    exampleSolution: ["REPEAT5{IF(CRYSTAL_AHEAD){COLLECT}ELSE{MOVE}}"],
    rewardXP: 100,
    rewardCoin: 20
  },

  /* ===================== LEVEL 15 — BUG SWARM ===================== */
  {
    id: 15,
    key: "bug-swarm",
    title: "Bug Swarm",
    subtitle: "Debugging Lanjutan",
    icon: "🐞",
    type: "runner",
    concept: "Debugging (2 Kesalahan Sekaligus)",
    story: "Pengaruh Glitch membuat Buggy mengacaukan DUA blok sekaligus kali ini — Digi harus lebih teliti mencari kedua kesalahannya.",
    lesson: "Kadang sebuah program punya lebih dari satu kesalahan. Debugging yang baik dilakukan satu per satu: perbaiki satu blok, coba lagi, amati, lalu cari kesalahan berikutnya jika masih gagal.",
    byteTip: "Jangan buru-buru — coba jalankan dulu, amati di mana Digi pertama kali salah arah.",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
    maxBlocksHint: 6,
    grid: [
      "S..",
      "...",
      "..C"
    ],
    start: { row: 0, col: 0, facing: "down" },
    buggyProgram: ["RIGHT", "MOVE", "RIGHT", "MOVE", "MOVE", "COLLECT"],
    hints: [
      "Blok pertama seharusnya membuat Digi MAJU, bukan berputar arah — periksa blok pertama.",
      "Setelah dua kali MAJU ke bawah, Digi perlu berbelok ke kanan (bukan ke kiri) untuk menghadap ke arah crystal.",
      "Perbaikannya: ganti blok pertama (RIGHT) menjadi MOVE, dan ganti blok ketiga (RIGHT) menjadi LEFT."
    ],
    exampleSolution: ["MOVE", "MOVE", "LEFT", "MOVE", "MOVE", "COLLECT"],
    rewardXP: 110,
    rewardCoin: 22
  },

  /* ===================== LEVEL 16 — DATA LOCKER ===================== */
  {
    id: 16,
    key: "data-locker",
    title: "Data Locker",
    subtitle: "Variabel Lanjutan",
    icon: "🗄️",
    type: "runner",
    concept: "Variabel (Nilai Lebih Besar)",
    story: "Brankas data Node kelima terkunci lebih kuat dari sebelumnya — kali ini butuh LEBIH BANYAK security key untuk membukanya.",
    lesson: "Variabel bisa menyimpan nilai berapa pun yang dibutuhkan — semakin banyak syarat yang diperlukan, semakin besar nilai variabel yang harus dikumpulkan sebelum lanjut.",
    byteTip: "Pintu brankas kali ini butuh 5 security key, bukan 3 — perhatikan nilai variabelnya!",
    availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT"],
    maxBlocksHint: 4,
    grid: [
      "SOOOOODC"
    ],
    doorRequirement: 5,
    start: { row: 0, col: 0, facing: "right" },
    hints: [
      "Gunakan REPEAT 5x berisi MOVE dan AMBIL untuk mengumpulkan seluruh security key secara efisien.",
      "Variabel security key harus mencapai 5 sebelum Digi mencoba melewati pintu brankas.",
      "Setelah 5 key terkumpul, tambahkan MOVE (buka pintu), MOVE, lalu AMBIL untuk mengambil crystal."
    ],
    exampleSolution: ["REPEAT5{MOVE,COLLECT}", "MOVE", "MOVE", "COLLECT"],
    rewardXP: 110,
    rewardCoin: 22
  },

  /* ===================== LEVEL 17 — NETIQUETTE PLAZA ===================== */
  {
    id: 17,
    key: "netiquette-plaza",
    title: "Netiquette Plaza",
    subtitle: "Netiket & Anti-Perundungan Siber",
    icon: "💬",
    type: "decision",
    concept: "Netiket & Cyberbullying",
    story: "Plaza komunikasi Node keenam ramai dengan berbagai pesan. Bantu Digi menanggapi situasi dengan sopan dan aman.",
    lesson: "Netiket adalah sopan santun saat berkomunikasi di internet. Jika mengalami atau melihat perundungan (bullying) online, jangan membalas dengan kasar — ceritakan ke orang dewasa yang dipercaya.",
    byteTip: "Ingat: jangan pernah membalas kekasaran dengan kekasaran lagi.",
    scenarios: [
      {
        id: "n1",
        icon: "😢",
        prompt: "Seorang teman mengejek hasil karyamu yang diunggah di grup kelas online.",
        options: [
          { text: "Membalas dengan ejekan yang lebih kasar", correct: false, feedback: "Membalas dengan kekasaran hanya akan memperburuk keadaan." },
          { text: "Tidak membalas kasar, dan menceritakannya ke orang dewasa yang dipercaya", correct: true, feedback: "Tepat! Jangan balas dengan kasar — ceritakan ke orang dewasa yang bisa membantu." },
          { text: "Menghapus semua akun media sosial selamanya", correct: false, feedback: "Tidak perlu seekstrem itu — cukup ceritakan ke orang dewasa yang dipercaya." }
        ]
      },
      {
        id: "n2",
        icon: "👀",
        prompt: "Kamu melihat teman lain sedang di-bully oleh beberapa orang di grup chat kelas.",
        options: [
          { text: "Ikut mengejek supaya tidak ikut jadi sasaran", correct: false, feedback: "Ikut mengejek hanya akan menambah sakit hati temanmu." },
          { text: "Diam saja dan tidak peduli", correct: false, feedback: "Diam saja bisa membuat perundungan terus berlanjut." },
          { text: "Membela dengan baik dan melaporkannya ke guru/orang tua", correct: true, feedback: "Bagus! Membela dengan baik dan melapor ke orang dewasa adalah tindakan paling tepat." }
        ]
      },
      {
        id: "n3",
        icon: "🎮",
        prompt: "Seseorang mengirim pesan kasar berulang kali kepadamu saat bermain game online.",
        options: [
          { text: "Membalas dengan kata-kata kasar juga", correct: false, feedback: "Membalas kekasaran hanya membuat situasi makin panas." },
          { text: "Memblokir & melaporkan orang itu, lalu bercerita ke orang dewasa", correct: true, feedback: "Tepat sekali! Blokir, laporkan, dan selalu ceritakan ke orang dewasa yang dipercaya." },
          { text: "Terus bermain sambil membaca semua pesan kasarnya", correct: false, feedback: "Lebih baik segera blokir & laporkan daripada terus membaca pesan yang menyakitkan." }
        ]
      }
    ],
    hints: [
      "Jangan pernah membalas kekasaran dengan kekasaran lagi.",
      "Membela teman yang di-bully dan melapor ke orang dewasa jauh lebih baik daripada diam atau ikut-ikutan.",
      "Blokir & laporkan adalah langkah aman jika ada yang mengirim pesan kasar berulang kali kepadamu."
    ],
    rewardXP: 90,
    rewardCoin: 18
  },

  /* ===================== LEVEL 18 — FAKTA ATAU HOAX? ===================== */
  {
    id: 18,
    key: "fakta-atau-hoax",
    title: "Fakta atau Hoax?",
    subtitle: "Mengenali Informasi Palsu",
    icon: "🔍",
    type: "decision",
    concept: "Literasi Digital (Hoax)",
    story: "Node ketujuh dipenuhi pesan dan berita yang tersebar cepat. Bantu Digi memilah mana yang fakta dan mana yang hoax (informasi palsu).",
    lesson: "Tidak semua informasi di internet itu benar. Sebelum percaya atau membagikan sesuatu, periksa dulu sumbernya — apakah jelas dan bisa dipercaya.",
    byteTip: "Kalau ragu, jangan langsung disebar — cek dulu ke sumber terpercaya atau tanya orang dewasa.",
    scenarios: [
      {
        id: "h1",
        icon: "📩",
        prompt: "Pesan berantai: \"Internet akan dimatikan total besok! Sebarkan ke 10 orang sekarang atau akunmu hilang!\"",
        options: [
          { text: "Langsung sebarkan supaya aman", correct: false, feedback: "Pesan berantai yang menakut-nakuti seperti ini biasanya hoax." },
          { text: "Cek dulu kebenarannya ke sumber terpercaya sebelum percaya atau membagikan", correct: true, feedback: "Tepat! Selalu periksa dulu sebelum percaya atau menyebarkan pesan semacam ini." },
          { text: "Percaya begitu saja tanpa mengecek", correct: false, feedback: "Mempercayai tanpa mengecek bisa membuatmu ikut menyebarkan informasi palsu." }
        ]
      },
      {
        id: "h2",
        icon: "📰",
        prompt: "Sebuah artikel berjudul heboh, tanpa nama penulis jelas dan tanpa sumber yang bisa dicek.",
        options: [
          { text: "Langsung percaya karena judulnya meyakinkan", correct: false, feedback: "Judul heboh tanpa sumber jelas patut dicurigai sebagai hoax." },
          { text: "Periksa penulis & sumbernya, lalu bandingkan dengan berita dari sumber terpercaya lain", correct: true, feedback: "Bagus! Memeriksa sumber adalah cara terbaik mengenali hoax." },
          { text: "Langsung sebarkan ke teman-teman", correct: false, feedback: "Menyebarkan tanpa memeriksa bisa ikut menyebarkan informasi yang salah." }
        ]
      },
      {
        id: "h3",
        icon: "🗣️",
        prompt: "Seorang teman bilang, \"Aku baca di internet katanya begini...\" tanpa menyebutkan sumbernya.",
        options: [
          { text: "Percaya begitu saja karena temanmu yang bilang", correct: false, feedback: "Sumber yang tidak jelas tetap perlu dicek ulang, walau dari teman sendiri." },
          { text: "Tanyakan sumbernya dan cek ulang sebelum ikut percaya", correct: true, feedback: "Tepat! Selalu tanyakan sumber dan cek ulang sebelum memercayai suatu informasi." },
          { text: "Langsung menyebarkannya lagi ke orang lain", correct: false, feedback: "Menyebarkan tanpa mengecek bisa memperluas informasi yang salah." }
        ]
      }
    ],
    hints: [
      "Pesan yang menakut-nakuti dan minta disebar cepat-cepat biasanya hoax.",
      "Artikel tanpa penulis atau sumber yang jelas patut dicurigai.",
      "Selalu bandingkan dengan sumber terpercaya lain sebelum percaya atau menyebarkan informasi."
    ],
    rewardXP: 90,
    rewardCoin: 18
  },

  /* ===================== LEVEL 19 — PASSWORD FORTRESS ===================== */
  {
    id: 19,
    key: "password-fortress",
    title: "Password Fortress",
    subtitle: "Keamanan Kata Sandi",
    icon: "🔑",
    type: "decision",
    concept: "Keamanan Password",
    story: "Benteng terakhir sebelum Node kedelapan hanya bisa dibuka dengan kata sandi yang benar-benar aman.",
    lesson: "Kata sandi (password) yang kuat sulit ditebak orang lain, dan sebaiknya berbeda-beda untuk setiap akun agar lebih aman.",
    byteTip: "Password yang aman itu unik, sulit ditebak, dan tidak pernah dibagikan ke siapa pun.",
    scenarios: [
      {
        id: "p1",
        icon: "🔐",
        prompt: "Kamu sedang membuat kata sandi baru untuk akun belajar onlinemu.",
        options: [
          { text: "Pakai nama dan tanggal lahirmu sendiri", correct: false, feedback: "Nama dan tanggal lahir terlalu mudah ditebak orang lain." },
          { text: "Pakai kombinasi huruf besar-kecil, angka, dan simbol yang unik", correct: true, feedback: "Tepat! Kombinasi yang unik jauh lebih sulit ditebak." },
          { text: "Pakai \"123456\" supaya mudah diingat", correct: false, feedback: "Kata sandi seperti ini sangat mudah ditebak dan tidak aman." }
        ]
      },
      {
        id: "p2",
        icon: "🤝",
        prompt: "Teman baikmu meminta password akun belajar onlinemu supaya bisa 'membantu' mengerjakan tugas.",
        options: [
          { text: "Memberikannya karena dia teman baikmu", correct: false, feedback: "Password tetap tidak boleh diberikan ke siapa pun, walau teman baik sekalipun." },
          { text: "Tetap tidak memberikan password ke siapa pun", correct: true, feedback: "Tepat sekali! Password adalah rahasia pribadi yang tidak boleh dibagikan." },
          { text: "Memberikannya tapi minta dirahasiakan", correct: false, feedback: "Begitu dibagikan, kamu sudah tidak bisa mengendalikan siapa yang tahu passwordmu." }
        ]
      },
      {
        id: "p3",
        icon: "🔁",
        prompt: "Kamu memakai kata sandi yang SAMA PERSIS untuk semua akun (game, email, belajar online).",
        options: [
          { text: "Itu praktik yang aman dan efisien", correct: false, feedback: "Jika satu akun bocor, semua akun lain jadi ikut berisiko." },
          { text: "Sebaiknya pakai kata sandi berbeda untuk tiap akun", correct: true, feedback: "Tepat! Kata sandi berbeda membuat akun lain tetap aman walau satu akun bocor." },
          { text: "Tidak masalah selama kata sandinya panjang", correct: false, feedback: "Sepanjang apa pun, memakai password yang sama tetap berisiko jika satu akun bocor." }
        ]
      }
    ],
    hints: [
      "Kata sandi yang kuat tidak memakai info pribadi yang mudah ditebak seperti nama atau tanggal lahir.",
      "Password tidak boleh dibagikan ke siapa pun, termasuk teman dekat.",
      "Gunakan kata sandi yang BERBEDA untuk setiap akun supaya lebih aman."
    ],
    rewardXP: 90,
    rewardCoin: 18
  }
];

/* ============================================================================
   FINAL CHALLENGE SEASON 2 (Level 20) — 3 tahap
   ============================================================================ */
const FINAL_LEVEL_S2 = {
  id: 20,
  key: "final-challenge-season2",
  title: "Final Challenge: Node Terakhir",
  subtitle: "Hentikan Glitch",
  icon: "🛰️",
  type: "final",
  concept: "Gabungan Semua Konsep Season 2",
  story: "Glitch bersembunyi di Node Pusat terakhir. Semua yang telah Digi pelajari di sepanjang Season 2 kini harus digunakan sekaligus untuk menghentikannya.",
  lesson: "Tantangan terakhir ini menggabungkan sequence, kondisi berantai, loop, debugging, variabel, dan literasi digital tentang netiket, hoax, serta keamanan password.",
  byteTip: "Kita sudah sampai sejauh ini bersama — kerjakan satu tahap demi satu tahap, kita pasti bisa!",
  rewardXP: 250,
  rewardCoin: 60,
  stages: [
    /* --- TAHAP 1: Sequence sederhana --- */
    {
      type: "runner",
      title: "Tahap 1 — Amankan Node Pertama",
      instruction: "Susun blok perintah secara berurutan untuk mencapai Digital Crystal terakhir.",
      availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
      grid: ["S..", "..C"],
      start: { row: 0, col: 0, facing: "right" },
      exampleSolution: ["MOVE", "MOVE", "RIGHT", "COLLECT"]
    },
    /* --- TAHAP 2: Kondisi + Loop --- */
    {
      type: "runner",
      title: "Tahap 2 — Kondisi & Loop Gabungan",
      instruction: "Gunakan IF/ELSE untuk menghindari batu, lalu REPEAT agar programmu tetap efisien.",
      availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT", "REPEAT", "IF"],
      conditions: ["WALL_AHEAD"],
      grid: ["S#...", "....C"],
      start: { row: 0, col: 0, facing: "right" },
      exampleSolution: ["IF(WALL_AHEAD){RIGHT,MOVE}ELSE{MOVE}", "LEFT", "REPEAT4{MOVE}", "COLLECT"]
    },
    /* --- TAHAP 3: Kuis literasi digital Season 2 --- */
    {
      type: "quiz",
      title: "Tahap 3 — Kuis Literasi Digital",
      instruction: "Jawab ketiga pertanyaan berikut untuk mengalahkan Glitch sepenuhnya.",
      questions: [
        {
          prompt: "Jika kamu melihat temanmu di-bully di grup chat, sebaiknya kamu...",
          options: [
            "Ikut mengejek supaya tidak jadi sasaran",
            "Diam saja dan tidak peduli",
            "Membela dengan baik dan melaporkannya ke orang dewasa"
          ],
          correctIndex: 2
        },
        {
          prompt: "Sebelum membagikan berita yang heboh ke teman-teman, sebaiknya kamu...",
          options: [
            "Langsung sebarkan supaya cepat viral",
            "Periksa dulu kebenarannya dari sumber terpercaya",
            "Percaya begitu saja tanpa berpikir panjang"
          ],
          correctIndex: 1
        },
        {
          prompt: "Kata sandi yang paling aman adalah...",
          options: [
            "Nama dan tanggal lahirmu sendiri",
            "Kombinasi huruf besar-kecil, angka, dan simbol yang unik",
            "Sama persis dengan password akun lainnya supaya mudah diingat"
          ],
          correctIndex: 1
        }
      ]
    }
  ],
  hints: [
    "Kerjakan tahap satu per satu — tidak perlu menyelesaikan semuanya sekaligus dalam satu waktu.",
    "Tahap 2 memakai konsep yang sama seperti Level 12 (Kondisi Berantai) dan Level 13/14 (Loop).",
    "Untuk tahap kuis, ingat kembali pelajaran dari Level 17, 18, dan 19 tentang netiket, hoax, dan password."
  ]
};

/* ----------------------------------------------------------------------------
   5) TEKS PENUTUP / SERTIFIKAT
   ---------------------------------------------------------------------------- */
const ENDING_STORY = [
  { speaker: "core", text: "Energiku... pulih kembali! Terima kasih, Digital Hero. DigiLand aman berkat dirimu." },
  { speaker: "byte", text: "Kamu berhasil! Dari algoritma, loop, kondisi, sampai menjaga keamanan digital — kamu sudah menguasai semuanya!" },
  { speaker: "buggy", text: "Baiklah baiklah... kali ini aku mengaku kalah. Tapi... rasanya masih ada yang mengendalikanku diam-diam sebelumnya." },
  { speaker: "core", text: "Tunggu — aku mendeteksi sinyal aneh dari Network Node di penjuru DigiLand. Sepertinya petualangan kita belum selesai..." }
];

const ENDING_STORY_S2 = [
  { speaker: "core", text: "Seluruh Network Node kembali aman! Sinyal aneh itu... akhirnya berhenti sepenuhnya." },
  { speaker: "glitch", text: "Baiklah, baiklah... untuk sekarang aku mengalah. Tapi ingat namaku: Glitch. Kita pasti bertemu lagi." },
  { speaker: "buggy", text: "Kali ini aku benar-benar lega bisa membantu, bukan mengacaukan. Terima kasih sudah percaya padaku, Digi." },
  { speaker: "byte", text: "Kamu luar biasa! Dari algoritma dasar sampai loop bersarang dan menjaga keamanan digital tingkat lanjut — kamu Digital Hero sejati!" },
  { speaker: "digi", text: "Ini semua berkat kerja sama kita. Sampai jumpa di petualangan DigiLand berikutnya!" }
];

const CERTIFICATE_TEXT = {
  heading: "SERTIFIKAT DIGITAL HERO",
  subheading: "Diberikan kepada",
  body: "atas keberhasilannya menyelesaikan seluruh misi Season 1 di DigiLand: menguasai algoritma, sequence, kondisi, perulangan, variabel, debugging, dan literasi digital.",
  footer: "DIGITAL HERO — Season 1: Pemulihan Core"
};

const CERTIFICATE_TEXT_S2 = {
  heading: "SERTIFIKAT DIGITAL HERO SEJATI",
  subheading: "Diberikan kepada",
  body: "atas keberhasilannya menyelesaikan SELURUH misi Season 1 & Season 2 di DigiLand, mulai dari algoritma dasar hingga loop bersarang, debugging lanjutan, dan literasi digital tingkat lanjut.",
  footer: "DIGITAL HERO — Season 1 & 2 Selesai"
};

/* ----------------------------------------------------------------------------
   6) DAFTAR SEASON — dipakai game.js/ui.js supaya alur Season 1 & 2 bisa
   ditangani secara generik (tidak hardcode di banyak tempat).
   ---------------------------------------------------------------------------- */
const SEASONS = [
  {
    id: 1,
    title: "Season 1",
    subtitle: "Pemulihan Core",
    levels: LEVELS,
    finalLevel: FINAL_LEVEL,
    storyIntro: STORY_INTRO,
    mapBackgroundKey: "mapBackground"
  },
  {
    id: 2,
    title: "Season 2",
    subtitle: "Jaringan Node DigiLand",
    levels: LEVELS_S2,
    finalLevel: FINAL_LEVEL_S2,
    storyIntro: STORY_INTRO_S2,
    mapBackgroundKey: "mapBackgroundSeason2"
  }
];
