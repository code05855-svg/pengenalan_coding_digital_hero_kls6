# DIGITAL HERO
### Bermain, Berpikir, dan Mengenal Dunia Digital

Game edukasi web (HTML5 + CSS3 + JavaScript vanilla, **tanpa backend, tanpa
database, tanpa dependency eksternal**) untuk mengenalkan coding dasar dan
literasi digital kepada siswa SD kelas 6, lewat **2 Season, total 20 misi +
2 Final Challenge**, di dunia digital bernama **DigiLand**.

- **Season 1 — Pemulihan Core** (Level 1-10): algoritma, sequence, problem
  solving, kondisi, loop, debugging, variabel, phishing, privasi digital.
- **Season 2 — Jaringan Node DigiLand** (Level 11-20): melanjutkan cerita
  Season 1 dengan konsep yang sama namun lebih bervariasi & menantang —
  kondisi berantai, loop bersarang, loop+kondisi gabungan, debugging 2
  kesalahan sekaligus, variabel lanjutan, netiket/anti-cyberbullying,
  mengenali hoax, dan keamanan password.

---

## 1. Struktur Folder

```
digital-hero/
├── index.html              ← buka file ini di browser untuk main
├── README.md                ← dokumen ini
├── css/
│   └── style.css            ← semua tampilan & tema warna
├── js/
│   ├── data.js               ← SEMUA konten: cerita, level, soal, dialog karakter (Season 1 & 2)
│   ├── engine.js              ← simulator program (MOVE/IF/REPEAT/dst) — dipakai kedua Season
│   ├── audio.js                ← efek suara (Web Audio API, tanpa file mp3)
│   ├── ui.js                    ← semua kode tampilan/render layar
│   └── game.js                   ← controller: state pemain, save/load, alur Season 1 & 2
└── assets/
    ├── README.txt             ← checklist LENGKAP semua gambar yang dikenali game (kedua Season)
    ├── images/
    │   ├── characters/        ← potret Digi, Byte, Buggy, Core, Glitch (Season 2)
    │   ├── world/             ← latar Peta Dunia DigiLand (Season 1 & 2)
    │   ├── backgrounds/       ← latar per-level (1-9+final, 11-19+final)
    │   ├── items/              ← crystal, coin, logo game
    │   ├── obstacles/          ← batu, pintu
    │   ├── ui/                  ← ikon blok perintah coding
    │   ├── dialog/               ← latar kotak dialog cerita
    │   └── icons/                 ← ikon tiap misi, bintang, badge, gembok
    └── sounds/                ← taruh file suara di sini (opsional)
```

**Kenapa dipisah begini?** `data.js` berisi SEMUA teks & soal (kedua Season),
terpisah dari `engine.js`/`ui.js`/`game.js` yang berisi logika. Jadi kalau
Anda cuma mau ubah soal atau teks cerita, Anda **hanya perlu membuka
`js/data.js`** — tidak perlu menyentuh kode logic sama sekali.

---

## 2. Cara Menjalankan

1. Ekstrak file zip ini ke folder mana saja di komputer/laptop/Chromebook.
2. Klik dua kali `index.html` — game langsung terbuka di browser default.
   - Tidak perlu internet.
   - Tidak perlu install apa pun.
   - Tidak perlu server (XAMPP, Node.js, dll).
3. Untuk membagikan ke banyak komputer, tinggal copy seluruh folder
   `digital-hero/` (via flashdisk, atau upload ke Google Drive lalu unduh).

> Browser yang direkomendasikan: Chrome, Edge, atau Firefox versi terbaru.

### Kode Akses Season 2 (jalan pintas untuk demo/fasilitator)

Season 2 normalnya terbuka setelah pemain menyelesaikan Final Challenge
Season 1 (Level 10). Jika Anda perlu langsung mendemokan Season 2 tanpa
bermain Season 1 dulu (mis. saat presentasi ke guru/panitia), klik tab
**"Season 2"** yang masih terkunci di Peta DigiLand, lalu masukkan kode:

```
codingcode
```

Progress Season 1 pemain TIDAK ikut terbuka oleh kode ini — hanya Season 2
yang jadi bisa diakses, dan levelnya tetap terbuka satu per satu seperti
biasa (Level 12 baru terbuka setelah Level 11 selesai, dst). Untuk
mengganti kode ini, buka `js/game.js` dan cari konstanta
`SEASON2_ACCESS_TOKEN` di bagian atas file.

---

## 3. Cara Mengubah Soal / Level

Buka **`js/data.js`**. Setiap level adalah satu object di dalam array:

| Season | Level biasa | Final Challenge |
|---|---|---|
| Season 1 | array `LEVELS` (id 1-9) | object `FINAL_LEVEL` (id 10) |
| Season 2 | array `LEVELS_S2` (id 11-19) | object `FINAL_LEVEL_S2` (id 20) |

Contoh Level 1 (struktur Level 11-19 di `LEVELS_S2` persis sama):

```js
{
  id: 1,
  title: "First Mission",
  story: "Digi baru saja tiba di DigiLand...",     // ← ubah teks cerita di sini
  lesson: "Komputer menjalankan perintah...",       // ← ubah materi singkat di sini
  grid: [
    "S..",
    "..C"
  ],                                                 // ← ubah denah/posisi crystal di sini
  hints: ["...", "...", "..."],                      // ← ubah 3 hint di sini
  rewardXP: 60,
  rewardCoin: 10
}
```

### Mengubah denah grid (level bertipe "runner")
Grid ditulis sebagai kumpulan baris teks. Setiap karakter = satu kotak:

| Karakter | Arti |
|---|---|
| `.` | jalan kosong |
| `#` | batu/penghalang |
| `C` | Digital Crystal (tujuan) |
| `O` | Coin / Security Key (Level 7 & 16) |
| `D` | Pintu terkunci (Level 7 & 16) |

Posisi awal Digi diatur terpisah lewat `start: { row, col, facing }`
(`facing` salah satu dari `"up"`, `"down"`, `"left"`, `"right"`).

⚠️ **Penting:** setelah mengubah grid, pastikan jalur dari posisi awal ke
crystal benar-benar bisa dilewati (tidak terhalang batu sepenuhnya). Uji
langsung dengan bermain di browser setelah mengubah — atau, untuk
perubahan besar, jalankan simulasi lewat `js/engine.js` (fungsi
`DH_ENGINE.runProgram`) di Node.js sebelum menguji manual, supaya
ketahuan lebih cepat kalau ada kesalahan denah.

### Level dengan blok bersarang (IF/REPEAT bertingkat)
Level 12 (Twin Paths Cavern), 13 (Nested Loop Lab), 14 (Loop & Logic
Circuit), dan Final Challenge Season 2 tahap 2 memakai IF/REPEAT yang
disusun berlapis. Ini didukung penuh oleh engine (nesting sedalam apa
pun), jadi bisa dipakai bebas untuk level buatan sendiri juga.

### Mengubah urutan Sequence City / Secure Relay Station (Level 2 & 11)
Ubah array `solutionOrder` dan `orderIcons` pada object level terkait.

### Mengubah soal skenario (Level 8, 9, 17, 18, 19)
Ubah array `scenarios` — masing-masing punya `prompt`, `icon`, dan `options`
(tiap opsi punya `text`, `correct: true/false`, dan `feedback`).

### Mengubah soal kuis Final Challenge (tahap 3)
Buka object `FINAL_LEVEL.stages[2].questions` (Season 1) atau
`FINAL_LEVEL_S2.stages[2].questions` (Season 2) — tiap soal punya `prompt`,
`options` (array teks), dan `correctIndex` (indeks jawaban benar, mulai 0).

---

## 4. Cara Menambahkan Gambar/Icon Asli (Mengganti Emoji)

Game ini sudah dilengkapi **sistem gambar otomatis dengan fallback** —
artinya Anda bisa menambahkan ilustrasi asli kapan saja tanpa mengubah
kode sama sekali, dan sebelum ditambahkan pun game tetap tampil normal
memakai emoji. Sistem yang sama berlaku untuk Season 1 MAUPUN Season 2.

**Langkah singkat:**
1. Buka **`assets/README.txt`** — di situ ada checklist lengkap SEMUA
   gambar yang dikenali game untuk KEDUA Season (karakter — termasuk
   Glitch di Season 2, peta dunia, latar level 1-20, item, rintangan,
   ikon blok coding, dialog box, ikon misi, dan badge), lengkap dengan
   nama file & lokasi foldernya masing-masing.
2. Simpan file gambar Anda dengan **nama & lokasi PERSIS** seperti yang
   tertulis di checklist tsb, misalnya `assets/images/characters/digi.png`.
3. Selesai — buka ulang `index.html`, gambar otomatis muncul menggantikan
   emoji di lokasi tersebut. Tidak perlu mengedit file kode apa pun.

Anda boleh menambahkan gambar **sedikit demi sedikit** (tidak harus
sekaligus semua) — bagian yang belum ada gambarnya otomatis tetap
memakai emoji bawaan.

**Untuk yang ingin mengubah NAMA FILE atau STRUKTUR FOLDER** (bukan
sekadar mengisi file sesuai nama bawaan): buka `js/data.js`, cari object
`ASSET_PATHS` di bagian paling atas file — di situlah SATU-SATUNYA tempat
yang menyimpan path setiap gambar, dipetakan menjadi 9 kategori (ditandai
mana yang khusus Season 2):

```js
const ASSET_PATHS = {
  characters: { digi: "...", byte: "...", buggy: "...", core: "...", glitch: "..." }, // glitch = Season 2
  world: { mapBackground: "...", mapBackgroundSeason2: "..." },  // peta per-Season
  levelBackgrounds: { 1: "...", ..., 10: "...", 11: "...", ..., 20: "..." }, // id 1-20
  items: { crystal: "...", coin: "..." },
  obstacles: { wall: "...", door: "..." },
  blocks: { MOVE: "...", LEFT: "...", ... },     // ikon blok perintah coding (dipakai kedua Season)
  dialog: { boxBackground: "..." },
  levelIcons: { 1: "...", ..., 20: "..." },       // ikon tiap misi, id 1-20
  badges: { starFilled: "...", starEmpty: "...", trophy: "...", trophySeason2: "...", lock: "..." }
};
```

Ubah nilai path-nya saja sesuai kebutuhan — mekanisme fallback-nya (fungsi
`assetSlot()` di `js/ui.js`) tidak perlu disentuh.

- **Ganti nama/teks tokoh**: tetap di object `CHARACTERS` (di bawah
  `ASSET_PATHS`) — ubah `name` untuk nama tampilan, `emoji` untuk fallback
  jika gambar belum/tidak ada.

---

## 5. Cara Mengganti Warna / Theme

Buka **`css/style.css`**, bagian paling atas (`:root { ... }` untuk mode
terang, dan `[data-theme="dark"] { ... }` untuk mode gelap). Semua warna
didefinisikan sebagai variabel di satu tempat:

```css
:root{
  --primary: #6C5CE7;     /* warna utama (tombol, aksen) */
  --secondary: #00B8A9;   /* warna kedua (crystal, sukses) */
  --accent: #FFB627;      /* warna aksen (coin, bintang) */
  --danger: #F5544D;      /* warna gagal/salah */
  --success: #22B573;     /* warna berhasil/benar */
  ...
}
```

Ubah nilai hex-nya saja — seluruh tampilan game (tombol, kartu, ikon,
grid) otomatis mengikuti karena semua elemen memakai variabel ini,
bukan warna yang ditulis manual di banyak tempat. Berlaku sama untuk
tampilan Season 1 maupun Season 2 (satu stylesheet untuk semuanya).

---

## 6. Cara Menambahkan Level Baru (mis. Level 21 / Season 3)

Karena data level terpisah dari logic, menambah level baru bertipe
**runner** (grid) semudah menambah satu object baru ke array level yang
sesuai di `js/data.js` (`LEVELS` untuk Season 1, `LEVELS_S2` untuk
Season 2):

```js
{
  id: 21,
  key: "level-baru",
  title: "Nama Level Barumu",
  subtitle: "Subjudul",
  icon: "🆕",
  type: "runner",                    // atau "order" / "decision"
  concept: "Konsep yang diajarkan",
  story: "Cerita singkat...",
  lesson: "Materi singkat...",
  byteTip: "Tip dari Byte...",
  availableBlocks: ["MOVE", "LEFT", "RIGHT", "COLLECT"],
  grid: ["S..", "..C"],
  start: { row: 0, col: 0, facing: "right" },
  hints: ["hint 1", "hint 2", "hint 3"],
  rewardXP: 60,
  rewardCoin: 10
}
```

Level baru otomatis akan tampil di World Map (fungsi `renderMap` di
`ui.js` sudah membaca seluruh isi array level secara otomatis) —
**tidak perlu** ubah `ui.js` untuk level bertipe runner/order/decision
biasa yang ditambahkan DI DALAM Season yang sudah ada.

### Menambahkan Season 3 (opsional, untuk yang ingin memperluas lebih jauh)
Karena alur Season sudah dibuat generik lewat array `SEASONS` (di bagian
paling bawah `js/data.js`), menambah Season baru mengikuti pola yang
sama seperti Season 2:

1. Tambahkan `STORY_INTRO_S3` (prolog), `LEVELS_S3` (level id 21-29),
   `FINAL_LEVEL_S3` (id 30), dan `ENDING_STORY_S3` di `js/data.js`,
   meniru struktur Season 2 persis.
2. Tambahkan entri baru di array `SEASONS`:
   ```js
   { id: 3, title: "Season 3", subtitle: "...", levels: LEVELS_S3,
     finalLevel: FINAL_LEVEL_S3, storyIntro: STORY_INTRO_S3,
     mapBackgroundKey: "mapBackgroundSeason3" }
   ```
3. Di `js/game.js`, fungsi `getSeasonForLevelId` perlu tahu batas id
   Season 3 (mis. `levelId <= 20 ? ... : 3`), dan `goToSeason2Ending`
   perlu diarahkan ke prolog Season 3 alih-alih layar akhir (mengikuti
   pola `handleContinueToSeason2`).
4. Di `index.html`, tambahkan tab `#tab-season3` mengikuti pola
   `#tab-season2`, lalu wire klik-nya di `wireEvents()` (`js/game.js`).

Karena ini melibatkan beberapa file sekaligus, disarankan hanya
dilakukan oleh yang sudah nyaman membaca kode JavaScript.

---

## 7. Checklist Pengujian Sebelum Dipakai di SD (Kegiatan KKN)

Gunakan daftar ini untuk memastikan game siap dipakai:

- [ ] Buka `index.html` langsung (double-click), pastikan game terbuka
      tanpa perlu internet.
- [ ] Buka Developer Console browser (`F12` → tab *Console*) dan mainkan
      seluruh 20 level (Season 1 & 2) — pastikan **tidak ada tulisan
      merah/error** (baris "Failed to load resource" untuk gambar yang
      belum ditambahkan itu normal dan aman, lihat poin checklist
      terakhir di bawah).
- [ ] Isi nama pemain, pastikan muncul di seluruh layar (map, level,
      sertifikat kedua Season).
- [ ] Mainkan Level 1–9 satu per satu secara berurutan, pastikan level
      berikutnya otomatis terbuka setelah level sebelumnya selesai.
- [ ] Coba tombol **HINT** di salah satu level — pastikan muncul teks
      bantuan dan hitungan hint berkurang, dan berhenti di 0.
- [ ] Coba sengaja menjalankan program yang SALAH — pastikan muncul
      feedback yang ramah, panah/karakter kembali ke posisi semula, dan
      Digi bisa dicoba lagi (tidak macet).
- [ ] Mainkan Level 10 (Final Challenge Season 1) sampai selesai —
      pastikan ketiga tahap berjalan berurutan dan berakhir di layar
      Sertifikat Season 1, LENGKAP DENGAN tombol **"Lanjutkan ke
      Season 2"**.
- [ ] Tekan **"Lanjutkan ke Season 2"** — pastikan muncul prolog cerita
      Season 2, lalu masuk ke Peta DigiLand dengan tab **Season 2**
      otomatis aktif dan 9 misi barunya terlihat (misi ke-2 dst masih
      terkunci).
- [ ] Coba tab **Season 1** / **Season 2** di atas Peta DigiLand —
      pastikan bisa berpindah bebas antar Season yang SUDAH terbuka
      (Season 2 tidak bisa dibuka sebelum Level 10 selesai).
- [ ] Klik tab **Season 2** saat masih terkunci — pastikan muncul modal
      kode akses (bukan cuma pesan biasa). Coba masukkan kode SALAH dulu
      (pastikan muncul pesan error), lalu masukkan `codingcode` (pastikan
      berhasil masuk ke prolog Season 2, DAN Season 1 tetap terkunci
      seperti semula — cek tab Season 1, harus masih Level 1 saja yang
      terbuka).
- [ ] Mainkan Level 11–19 satu per satu, termasuk Level 13 (Nested Loop
      Lab, blok REPEAT di dalam REPEAT) dan Level 15 (Bug Swarm, ada 2
      blok yang salah sekaligus).
- [ ] Mainkan Level 20 (Final Challenge Season 2) sampai selesai —
      pastikan berakhir di layar Sertifikat GRAND FINALE ("SERTIFIKAT
      DIGITAL HERO SEJATI"), dengan total 20/20 Crystal, dan tombol
      "Lanjutkan ke Season 2" TIDAK muncul lagi (karena sudah tamat).
- [ ] Tekan **Cetak Sertifikat** di kedua layar Sertifikat — pastikan
      hanya kartu sertifikat yang tampil di preview cetak (bukan
      seluruh halaman).
- [ ] Tutup browser lalu buka lagi `index.html` di tengah-tengah Season
      2 — pastikan progress **tetap tersimpan** dan langsung kembali ke
      Peta DigiLand Season 2 (tidak mengulang cerita pembuka).
- [ ] Tekan **Reset Progress**, konfirmasi, pastikan game kembali ke
      keadaan awal (Level 1 terkunci ulang, XP/coin/crystal jadi 0,
      Season 2 terkunci lagi).
- [ ] Coba di layar kecil (HP/tablet) dan besar (laptop/Chromebook) —
      pastikan semua tombol, tab Season, dan banner Peta DigiLand tetap
      rapi dan mudah diketuk.
- [ ] Coba tombol 🌙/☀️ (ganti tema terang/gelap) dan 🔊/🔇 (suara
      on/off) — pastikan berfungsi dan pilihan tersimpan setelah reload.
- [ ] Coba tombol layar penuh (⛶) di perangkat yang akan dipakai saat
      kegiatan (beberapa Chromebook sekolah membatasi fitur ini — jika
      tidak berfungsi, game tetap bisa dimainkan normal tanpa layar
      penuh).
- [ ] Jika sudah menambahkan gambar sendiri (lihat `assets/README.txt`):
      buka Developer Console (`F12`) dan pastikan tidak ada baris merah
      "Failed to load resource" untuk file yang SUDAH Anda tambahkan (jika
      masih muncul, biasanya berarti nama file atau lokasi foldernya belum
      persis sama dengan yang tertulis di checklist). Untuk gambar yang
      BELUM ditambahkan, baris seperti itu normal muncul dan aman
      diabaikan — game otomatis memakai emoji sebagai gantinya.

Jika seluruh poin di atas sudah dicek ✅, game siap digunakan untuk
kegiatan KKN di SD.

---

## Ringkasan Arsitektur (untuk yang ingin memodifikasi lebih jauh)

- **`data.js`** — satu-satunya file berisi konten (teks, soal, denah)
  UNTUK KEDUA SEASON, ditutup dengan array `SEASONS` yang mendaftarkan
  Season 1 & 2 secara generik (dipakai `game.js`/`ui.js` supaya tidak
  perlu hardcode per-Season di banyak tempat). Tidak ada logic di sini.
- **`engine.js`** — "otak simulasi": menerima program (susunan blok
  MOVE/LEFT/RIGHT/COLLECT/REPEAT/IF, boleh bersarang sedalam apa pun)
  dan denah grid, lalu menghitung apakah Digi berhasil sampai ke
  crystal — tanpa tahu apa pun soal tampilan HTML atau Season mana yang
  sedang dimainkan (levelnya diperlakukan sama).
- **`audio.js`** — efek suara bip sederhana lewat Web Audio API.
- **`ui.js`** — semua fungsi yang menggambar/mengubah DOM (HTML), dan
  menangani interaksi klik pada blok program. Memanggil `engine.js`
  untuk mensimulasikan program saat tombol RUN ditekan, lalu
  menganimasikan hasilnya. Fungsi `renderMap`/`mountLevel`/
  `mountFinalStage`/`renderCertificate` semuanya menerima data Season
  sebagai parameter (bukan hardcode), sehingga satu set fungsi melayani
  Season 1 maupun Season 2.
- **`game.js`** — pengatur alur & penyimpanan: layar mana yang aktif,
  kapan level terbuka, Season mana yang sedang ditampilkan di Peta
  DigiLand, kapan prolog Season 2 diputar, menghitung bintang/XP/reward,
  dan menyimpan/memuat progress dari `localStorage`. `player.unlockedLevel`
  adalah SATU angka yang terus naik dari 1 sampai 21 (bukan per-Season
  terpisah) — begitu Level 10 (Final Challenge Season 1) selesai,
  `unlockedLevel` otomatis jadi 11 yang membuka misi pertama Season 2.

Alur data satu arah: `data.js` (konten, termasuk `SEASONS`) → `game.js`
(memutuskan apa yang harus ditampilkan & Season mana yang aktif,
menyimpan hasil) → `ui.js` (menggambar & menangkap interaksi pemain) →
`engine.js` (dipanggil `ui.js` untuk mensimulasikan program) → hasil
dikembalikan ke `ui.js` untuk dianimasikan → `ui.js` memanggil callback
ke `game.js` saat pemain berhasil/gagal.

Selamat memodifikasi dan selamat menyelamatkan DigiLand — dua Season
sekaligus! 🚀💎🛰️

