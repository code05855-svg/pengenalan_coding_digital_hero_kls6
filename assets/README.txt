DIGITAL HERO — PANDUAN ASET GAMBAR (SEASON 1 & SEASON 2)
============================================================================
Checklist LENGKAP semua gambar yang bisa ditambahkan ke game, untuk KEDUA
Season. Setiap slot di bawah ini SUDAH TERHUBUNG ke kode (lihat ASSET_PATHS
di js/data.js) — begitu Anda menaruh file dengan NAMA & LOKASI PERSIS
seperti tertulis, gambar itu OTOMATIS muncul di game menggantikan emoji
bawaan. Jika sebuah file belum ada, game tetap tampil normal memakai emoji.

FORMAT: semua path di bawah memakai .png — jika Anda punya file .jpg,
buka js/data.js bagian ASSET_PATHS dan ganti akhiran path terkait.

Cara pakai: simpan file gambar ke path yang tertulis, relatif dari folder
utama digital-hero/ (folder yang berisi index.html).


============================================================================
1) KARAKTER UTAMA
============================================================================
  assets/images/characters/digi.png      -> Digi (karakter utama/pemain)
  assets/images/characters/byte.png      -> Byte (robot mentor / NPC pendukung)
  assets/images/characters/buggy.png     -> Buggy (karakter jahil pembuat bug)
  assets/images/characters/core.png      -> Core (sistem pusat DigiLand)
  assets/images/characters/glitch.png    -> Glitch (dalang misterius, MUNCUL DI SEASON 2)

  Disarankan: PNG transparan persegi (mis. 256x256px), gaya kartun ramah
  anak SD. Ditampilkan bulat (dipotong lingkaran otomatis oleh CSS).

  Dipakai di: dialog cerita (Season 1 & 2), modal "Materi Singkat", stat
  bar (ikon nama pemain memakai digi.png), tip Byte di header level, dan
  layar penutup/sertifikat kedua Season.


============================================================================
2) PETA DUNIA DIGILAND
============================================================================
  assets/images/world/digiland-map-bg.png          -> peta Season 1
  assets/images/world/digiland-map-bg-season2.png  -> peta Season 2 (opsional;
                                                        jika belum diisi, otomatis
                                                        memakai peta Season 1)

  Tampil sebagai BANNER BESAR di bagian atas Peta DigiLand. Disarankan:
  PNG/JPG lanskap lebar, ilustrasi dunia digital penuh warna (seperti
  gambar peta yang sudah Anda buat — lengkap dengan label area/pulau).


============================================================================
3) LATAR BELAKANG LEVEL
============================================================================
Satu gambar latar per misi — tampil di belakang kartu soal & area
permainan saat misi dimainkan, JUGA sebagai latar tipis di kartu misi
pada Peta DigiLand. Boleh diisi sebagian saja.

  --- Season 1 (sudah Anda tambahkan sebagian besar) ---
  assets/images/backgrounds/level-1.png   -> First Mission
  assets/images/backgrounds/level-2.png   -> Sequence City
  assets/images/backgrounds/level-3.png   -> Maze of Logic
  assets/images/backgrounds/level-4.png   -> IF/ELSE Forest
  assets/images/backgrounds/level-5.png   -> Loop Factory
  assets/images/backgrounds/level-6.png   -> Bug Hunter
  assets/images/backgrounds/level-7.png   -> Variable Vault
  assets/images/backgrounds/level-8.png   -> Cyber Safe
  assets/images/backgrounds/level-9.png   -> Digital Footprint
  assets/images/backgrounds/level-final.png -> Final Challenge Season 1

  --- Season 2 (BARU — belum ada, silakan ditambahkan) ---
  assets/images/backgrounds/level-11.png  -> Secure Relay Station
  assets/images/backgrounds/level-12.png  -> Twin Paths Cavern
  assets/images/backgrounds/level-13.png  -> Nested Loop Lab
  assets/images/backgrounds/level-14.png  -> Loop & Logic Circuit
  assets/images/backgrounds/level-15.png  -> Bug Swarm
  assets/images/backgrounds/level-16.png  -> Data Locker
  assets/images/backgrounds/level-17.png  -> Netiquette Plaza
  assets/images/backgrounds/level-18.png  -> Fakta atau Hoax?
  assets/images/backgrounds/level-19.png  -> Password Fortress
  assets/images/backgrounds/level-20-final.png -> Final Challenge Season 2

  Disarankan: PNG/JPG, ±1200x800px (lanskap).


============================================================================
4) KOLEKSI ITEM
============================================================================
  assets/images/items/crystal.png   -> Digital Crystal (tujuan tiap misi, kedua Season)
  assets/images/items/coin.png      -> Coin/Security Key (Level 7 & Level 16)
  assets/images/items/logo.png      -> Logo game (SUDAH ADA — dipakai besar
                                        di layar utama & kecil di pojok atas)

  Disarankan: PNG transparan, 128x128px (kecuali logo, bebas ukuran asal rasio persegi).


============================================================================
5) MUSUH DAN RINTANGAN
============================================================================
  assets/images/obstacles/wall-tile.png   -> batu/penghalang di grid
  assets/images/obstacles/door.png        -> pintu terkunci (Level 7 & 16)

  Catatan: "Buggy" & "Glitch" (musuh cerita) memakai gambar di kategori 1
  di atas — mereka tampil sebagai potret dialog, bukan sprite di grid.


============================================================================
6) ELEMEN UI
============================================================================
  assets/images/ui/icon-move.png     -> blok MAJU
  assets/images/ui/icon-left.png     -> blok PUTAR KIRI
  assets/images/ui/icon-right.png    -> blok PUTAR KANAN
  assets/images/ui/icon-collect.png  -> blok AMBIL
  assets/images/ui/icon-repeat.png   -> blok ULANGI
  assets/images/ui/icon-if.png       -> blok JIKA (kondisi)

  Disarankan: PNG transparan, 64x64px, gaya ikon sederhana (dipakai di
  KEDUA Season karena blok perintahnya sama).


============================================================================
7) NPC PENDUKUNG
============================================================================
Byte adalah NPC pendukung utama di kedua Season — memakai gambar yang sama
dengan kategori 1: assets/images/characters/byte.png (otomatis dipakai di
kotak "Tip Byte" pada header setiap level).


============================================================================
8) DIALOG BOX
============================================================================
  assets/images/dialog/dialogue-box-bg.png

  Gambar dekoratif TIPIS di belakang kotak dialog cerita (opacity rendah,
  teks & potret karakter tetap di lapisan atas sehingga selalu terbaca).
  Dipakai untuk dialog Season 1 MAUPUN Season 2 (kotak dialognya sama).


============================================================================
9) ICON DAN BADGE
============================================================================
  --- Ikon per misi ---
  assets/images/icons/level-1.png  s/d  level-9.png, level-final.png    (Season 1)
  assets/images/icons/level-11.png s/d  level-19.png, level-20-final.png (Season 2, BARU)

  --- Badge & elemen skor ---
  assets/images/icons/star-filled.png        -> bintang terisi (skor & stat XP)
  assets/images/icons/star-empty.png         -> bintang kosong
  assets/images/icons/badge-trophy.png       -> lencana sertifikat Season 1 (SUDAH ADA)
  assets/images/icons/badge-trophy-season2.png -> lencana sertifikat GRAND FINALE (Season 1+2, BARU)
  assets/images/icons/lock.png               -> ikon gembok (misi belum terbuka)

  Disarankan: PNG transparan, 128x128px.


============================================================================
RINGKASAN LOKASI DI DALAM KODE (untuk referensi teknis)
============================================================================
- Semua path di atas didaftarkan di SATU tempat: object ASSET_PATHS di
  bagian paling atas js/data.js.
- Sistem pemuatan gambar (dengan fallback otomatis ke emoji) ada di fungsi
  assetSlot() di js/ui.js.
- Latar Peta Dunia, latar per-level, & latar kartu misi memakai CSS custom
  property yang diisi otomatis oleh ui.js (fungsi setBgVar) — berlaku utk
  Season 1 maupun 2 tanpa perlu menambah baris CSS baru.

Selamat mempercantik DigiLand — Season 1 & Season 2! 🎨💎🛰️
