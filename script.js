/* ===== Pengaturan tujuan halaman (sesuaikan dengan struktur folder kamu) ===== */
const HALAMAN = {
  pilihLokasi:     "pilih-lokasi.html",
  pilihToko:       "pilih-toko.html",
  berandaCustomer: "customer/beranda.html"
};

/* ===== Data contoh (ganti dengan data dari backend/database) ===== */
const DATA_LOKASI = ["Klaten", "Surakarta", "Yogyakarta", "Semarang", "Boyolali"];

const DATA_TOKO = {
  "Klaten":     ["Infinity Klaten Kota", "Infinity Delanggu", "Infinity Prambanan"],
  "Surakarta":  ["Infinity Solo Baru", "Infinity Laweyan", "Infinity Banjarsari"],
  "Yogyakarta": ["Infinity Malioboro", "Infinity Sleman"],
  "Semarang":   ["Infinity Simpang Lima"],
  "Boyolali":   []
};

/* Halaman dikenali dari id elemennya, jadi tidak bergantung pada atribut lain */
const formLogin   = document.getElementById("form");
const ulLokasi    = document.getElementById("daftarLokasi");
const ulToko      = document.getElementById("daftarToko");

/* ===== Halaman Login / Daftar ===== */
if (formLogin) {
  const tabs = document.querySelectorAll(".tab");
  const judul = document.getElementById("judul");
  const btnSubmit = document.getElementById("btnSubmit");

  let role = "customer";   // customer | toko | admin
  let mode = "login";      // login | daftar

  function render() {
    if (role === "admin") mode = "login"; // Admin hanya login
    const key = `${mode}-${role}`;

    tabs.forEach(t => t.classList.toggle("active", t.dataset.role === role));
    document.querySelectorAll("[data-show]").forEach(el => {
      el.classList.toggle("hidden", !el.dataset.show.split(" ").includes(key));
    });

    const teks = mode === "login" ? "Masuk" : "Daftar";
    judul.textContent = teks;
    btnSubmit.textContent = teks;
  }

  tabs.forEach(tab => tab.addEventListener("click", () => { role = tab.dataset.role; render(); }));
  document.getElementById("keDaftar").addEventListener("click", e => { e.preventDefault(); mode = "daftar"; render(); });
  document.getElementById("toggleMode").addEventListener("click", e => { e.preventDefault(); mode = "login"; render(); });

  formLogin.addEventListener("submit", e => {
    e.preventDefault();

    // Toko & Admin: belum dikerjakan, jadi tidak melakukan apa-apa
    if (role !== "customer") return;

    // TODO: validasi ke backend di sini

    if (mode === "daftar") {
      // Setelah daftar, kembali ke form Masuk (tanpa popup)
      formLogin.reset();
      mode = "login";
      render();
      return;
    }

    window.location.href = HALAMAN.pilihLokasi;
  });

  render();
}

/* ===== Halaman Pilih Lokasi ===== */
if (ulLokasi) {
  DATA_LOKASI.forEach(lokasi => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "item";
    btn.textContent = lokasi;
    btn.addEventListener("click", () => {
      sessionStorage.setItem("lokasiDipilih", lokasi);
      window.location.href = HALAMAN.pilihToko;
    });
    li.appendChild(btn);
    ulLokasi.appendChild(li);
  });
}

/* ===== Halaman Pilih Toko ===== */
if (ulToko) {
  const lokasi = sessionStorage.getItem("lokasiDipilih");

  if (!lokasi) {
    // Belum pilih lokasi -> kembali ke Pilih Lokasi
    window.location.replace(HALAMAN.pilihLokasi);
  } else {
    const daftar = DATA_TOKO[lokasi] || [];

    if (daftar.length === 0) {
      ulToko.innerHTML = '<li class="kosong">Belum ada toko di lokasi ini.</li>';
    }

    daftar.forEach(nama => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item";
      btn.innerHTML = `${nama}<small>${lokasi}</small>`;
      btn.addEventListener("click", () => {
        sessionStorage.setItem("tokoDipilih", nama);
        window.location.href = HALAMAN.berandaCustomer;
      });
      li.appendChild(btn);
      ulToko.appendChild(li);
    });
  }
}


/* ===================== BERANDA CUSTOMER ===================== */
const chatBox = document.getElementById("chatBox");

if (chatBox) {
  const chatBody = document.getElementById("chatBody");
  const chatForm = document.getElementById("chatForm");
  const chatText = document.getElementById("chatText");
  const chatFile = document.getElementById("chatFile");

  // Nama toko dari halaman Pilih Toko
  const tokoDipilih = sessionStorage.getItem("tokoDipilih");
  const elNamaToko = document.getElementById("namaToko");
  if (tokoDipilih && elNamaToko) elNamaToko.textContent = tokoDipilih;

  /* Buka / tutup pop up */
  function bukaChat() {
    chatBox.classList.add("open");
    chatBox.setAttribute("aria-hidden", "false");
    if (!chatBody.children.length) {
      tambahPesan("bot", "Halo! Saya Chat Bot Infinity. Mau cari saran warna cat untuk ruangan apa?");
    }
    chatText.focus();
  }
  function tutupChat() {
    chatBox.classList.remove("open");
    chatBox.setAttribute("aria-hidden", "true");
  }
  document.querySelectorAll(".open-chat").forEach(el => {
    el.addEventListener("click", e => { e.preventDefault(); bukaChat(); });
  });
  document.getElementById("chatClose").addEventListener("click", tutupChat);

  /* Pesan */
  function tambahPesan(pengirim, teks, gambarSrc) {
    const div = document.createElement("div");
    div.className = `msg ${pengirim}`;
    if (gambarSrc) {
      const img = document.createElement("img");
      img.src = gambarSrc;
      div.appendChild(img);
    }
    if (teks) {
      const p = document.createElement("span");
      p.textContent = teks;
      div.appendChild(p);
    }
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  /* Balasan sederhana (sementara).
     TODO: ganti dengan panggilan ke backend/AI kamu. Jangan taruh API key di JS sisi klien. */
  function balasan(teks) {
    const t = teks.toLowerCase();
    if (t.includes("ruang tamu")) return "Untuk ruang tamu, coba biru muda, abu-abu lembut, atau krem. Warna-warna ini membuat ruangan terasa luas dan tenang.";
    if (t.includes("kamar")) return "Untuk kamar tidur, warna pastel seperti hijau sage, lavender, atau biru langit membantu suasana lebih rileks.";
    if (t.includes("luar") || t.includes("eksterior") || t.includes("pagar") || t.includes("fasad")) return "Untuk tembok luar, pilih cat eksterior tahan cuaca. Putih, abu-abu terang, atau terakota cocok dan tidak cepat terlihat kusam.";
    if (t.includes("dapur")) return "Untuk dapur, putih, kuning lembut, atau hijau mint terasa bersih dan segar. Pilih cat yang mudah dibersihkan.";
    return "Boleh ceritakan ruangan yang ingin dicat, suasana yang diinginkan, dan warna perabotnya? Saya bantu sarankan warna yang cocok.";
  }

  function kirim(teks) {
    teks = teks.trim();
    if (!teks) return;
    tambahPesan("user", teks);
    setTimeout(() => tambahPesan("bot", balasan(teks)), 500);
  }

  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    kirim(chatText.value);
    chatText.value = "";
  });

  document.querySelectorAll("#chatChips .chip").forEach(chip => {
    chip.addEventListener("click", () => kirim(chip.textContent));
  });

  /* Kirim gambar */
  chatFile.addEventListener("change", () => {
    const file = chatFile.files[0];
    if (!file) return;
    tambahPesan("user", "", URL.createObjectURL(file));
    setTimeout(() => tambahPesan("bot", "Gambar diterima. Ceritakan ruangan apa ini dan suasana yang diinginkan, nanti saya sarankan warnanya."), 600);
    chatFile.value = "";
  });
}


/* ===================== HALAMAN PRODUK ===================== */
const produkGrid = document.getElementById("produkGrid");

if (produkGrid) {
  const GAMBAR_PRODUK = "../produkcat.png";

  /* Data contoh (ganti dengan data dari backend/database) */
  const DATA_PRODUK = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    kategori: "Cat Marka Jalan",
    merk: "Nippon Paint",
    nama: "Nippon Paint Road Line",
    deskripsi: "Nippon Paint Road Line adalah cat khusus untuk marka jalan yang diranc...",
    gambar: GAMBAR_PRODUK
  }));

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const filterKategori = document.getElementById("filterKategori");
  const filterMerk = document.getElementById("filterMerk");
  const kosong = document.getElementById("produkKosong");

  const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Isi pilihan filter dari data
  [...new Set(DATA_PRODUK.map(p => p.kategori))].forEach(k => filterKategori.add(new Option(k, k)));
  [...new Set(DATA_PRODUK.map(p => p.merk))].forEach(m => filterMerk.add(new Option(m, m)));

  function tampilkan() {
    const q = searchInput.value.trim().toLowerCase();
    const hasil = DATA_PRODUK.filter(p =>
      (!filterKategori.value || p.kategori === filterKategori.value) &&
      (!filterMerk.value || p.merk === filterMerk.value) &&
      (!q || `${p.nama} ${p.kategori} ${p.merk} ${p.deskripsi}`.toLowerCase().includes(q))
    );

    produkGrid.innerHTML = hasil.map(p => `
      <article class="p-card">
        <div class="p-img">
          <span class="p-badge">${esc(p.kategori)}</span>
          <img src="${esc(p.gambar)}" alt="${esc(p.nama)}">
        </div>
        <div class="p-info">
          <div class="p-merk">${esc(p.merk)}</div>
          <h3 class="p-nama">${esc(p.nama)}</h3>
          <p class="p-desc">${esc(p.deskripsi)}</p>
        </div>
        <div class="p-aksi">
          <button type="button" class="btn-lihat" data-id="${p.id}">
            <svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
            Lihat
          </button>
          <button type="button" class="btn-beli" data-id="${p.id}">Beli</button>
        </div>
      </article>`).join("");

    kosong.classList.toggle("hidden", hasil.length > 0);
  }

  searchForm.addEventListener("submit", e => { e.preventDefault(); tampilkan(); });
  searchInput.addEventListener("input", tampilkan);
  filterKategori.addEventListener("change", tampilkan);
  filterMerk.addEventListener("change", tampilkan);

  // TODO: tombol Lihat (detail produk) dan Beli (keranjang) dihubungkan nanti
  tampilkan();
}