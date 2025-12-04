import { authFetch } from "../modules/utils.js";
window.authFetch = authFetch;

// ============================================================
// 1. Load Hasil WP (Untuk Tampilan di Menu Hasil Perhitungan)
// ============================================================
export async function loadHasilWP() {
  const tbody = document.getElementById("tbody-hasil");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr><td colspan="2" class="text-center py-4 text-gray-500">
      <i class="fa-solid fa-spinner fa-spin mr-2"></i>Menghitung...
    </td></tr>
  `;

  try {
    const res = await authFetch("/api/spk/calculate");
    const data = await res.json();

    if (!data || data.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="2" class="text-center text-red-500 py-6">
          Belum ada data. Silakan input nilai & hitung ulang.
        </td></tr>`;
      return;
    }

    tbody.innerHTML = data.map((h, i) => {
      const nama = h.nama ?? h.nama_alternatif;
      const nilai = h.preferensi ?? h.nilai_preferensi;
      
      // Highlight Juara 1
      const isTop = i === 0;
      const badge = isTop ? '<span class="ml-2 bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Terbaik</span>' : '';

      return `
        <tr class="${isTop ? "bg-green-50 font-semibold border-l-4 border-green-500" : "hover:bg-gray-50"} border-b transition">
          <td class="px-4 py-3">${nama} ${badge}</td>
          <td class="px-4 py-3">${Number(nilai).toFixed(4)}</td>
        </tr>
      `;
    }).join("");

    const saranEl = document.getElementById("saran-obat");
    if (saranEl && data[0]) {
       saranEl.innerHTML = `💊 Rekomendasi Terbaik: <span class="font-bold text-green-600">${data[0].nama ?? data[0].nama_alternatif}</span>`;
    }

  } catch (err) {
    console.error("loadHasilWP error:", err);
    tbody.innerHTML = `
      <tr><td colspan="2" class="text-center text-red-500 py-6">
        Gagal memuat hasil. Cek koneksi server.
      </td></tr>`;
  }
}

// ============================================================
// 2. Render Halaman Laporan (Filter, Tabel, PDF, Excel)
// ============================================================
export async function renderLaporan() {
  const container = document.getElementById("laporan-container");
  if (!container) return;

  // --- A. Render UI Baru (Input & Tombol) ---
  container.innerHTML = `
    <div class="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Dari Tanggal</label>
          <input type="date" id="new-start-date" class="border border-gray-300 p-2 rounded w-40 focus:ring-2 focus:ring-purple-500 outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Sampai Tanggal</label>
          <input type="date" id="new-end-date" class="border border-gray-300 p-2 rounded w-40 focus:ring-2 focus:ring-purple-500 outline-none">
        </div>
        
        <button id="new-filter-btn" class="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition shadow flex items-center h-10">
          <i class="fa-solid fa-filter mr-2"></i> Filter
        </button>
        <button id="new-reset-btn" class="text-gray-500 hover:text-gray-700 underline text-sm ml-2">Reset</button>
      </div>
    </div>

    <div class="flex gap-3 mb-4">
      <button id="new-btn-excel" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center shadow-sm">
        <i class="fa-solid fa-file-excel mr-2"></i> Unduh Excel
      </button>
      <button id="new-btn-pdf" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center shadow-sm">
        <i class="fa-solid fa-file-pdf mr-2"></i> Unduh PDF
      </button>
    </div>

    <div id="laporan-wrapper" class="overflow-x-auto border rounded-lg"></div>
  `;

  // --- B. Fungsi Load Data Tabel ---
  const wrapper = document.getElementById("laporan-wrapper");
  
  async function loadData(start = "", end = "") {
    wrapper.innerHTML = `
      <div class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-purple-500"></i>
        <p>Memuat data laporan...</p>
      </div>`;
    
    // Bangun URL Query (startDate & endDate sesuai backend)
    const params = new URLSearchParams();
    if(start) params.append("startDate", start);
    if(end) params.append("endDate", end);
    const url = `/api/spk/laporan?${params.toString()}`;

    try {
      const res = await authFetch(url);
      const data = await res.json();

      if (!data || data.length === 0) {
        wrapper.innerHTML = `
          <div class="p-8 text-center text-gray-500">
            <p class="text-lg font-medium">Tidak ada data laporan.</p>
            <p class="text-sm">Coba ubah filter tanggal atau lakukan "Hitung Ulang".</p>
          </div>`;
        return;
      }

      // Render Tabel HTML
      wrapper.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nama Obat</th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nilai Preferensi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${data.map((r, i) => `
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-gray-500">${i + 1}</td>
                <td class="px-6 py-4">
                  ${new Date(r.tanggal).toLocaleDateString("id-ID", {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900">${r.nama_alternatif}</td>
                <td class="px-6 py-4 text-purple-600 font-bold">${Number(r.nilai_preferensi).toFixed(4)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="bg-gray-50 px-6 py-3 text-xs text-gray-500 text-right">
          Total Data: ${data.length}
        </div>
      `;
    } catch (e) {
      console.error(e);
      wrapper.innerHTML = "<p class='text-red-500 p-6 text-center'>Gagal memuat data laporan.</p>";
    }
  }

  // Load awal (tanpa filter)
  loadData();

  // --- C. Event Listeners ---

  // 1. Filter Button
  const filterBtn = document.getElementById("new-filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      const s = document.getElementById("new-start-date").value;
      const e = document.getElementById("new-end-date").value;
      
      if (s && e && s > e) {
        alert("Tanggal Mulai tidak boleh lebih besar dari Tanggal Akhir!");
        return;
      }
      loadData(s, e);
    });
  }

  // 2. Reset Button
  const resetBtn = document.getElementById("new-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("new-start-date").value = "";
      document.getElementById("new-end-date").value = "";
      loadData(); // Load semua data lagi
    });
  }

  // 3. Fungsi Download Universal (PDF & Excel)
  // GANTI FUNGSI DOWNLOAD FILE DENGAN INI (DIRECT LINK MODE)
  function downloadFile(type) {
    const s = document.getElementById("new-start-date").value;
    const e = document.getElementById("new-end-date").value;
    const token = localStorage.getItem("token"); // Ambil token

    // Validasi Tanggal
    if (s && e && s > e) {
        alert("Tanggal mulai tidak boleh melebihi tanggal akhir");
        return;
    }

    // Bangun URL dengan Token di Query String
    // Kita kirim token lewat URL karena window.open gak bisa kirim Header 'Authorization'
    const params = new URLSearchParams();
    if(s) params.append("startDate", s);
    if(e) params.append("endDate", e);
    params.append("token", token); // <--- Token dikirim di sini

    const url = `/api/spk/laporan/${type}?${params.toString()}`;

    // Buka di Tab Baru (Browser yang akan handle downloadnya)
    window.open(url, '_blank');
  }

  // Attach Event Download
  document.getElementById("new-btn-excel").addEventListener("click", () => downloadFile('excel'));
  document.getElementById("new-btn-pdf").addEventListener("click", () => {
    const s = document.getElementById("new-start-date").value;
    const e = document.getElementById("new-end-date").value;

    // Validasi
    if (s && e && s > e) {
        alert("Tanggal Error!");
        return;
    }

    // Arahkan ke file HTML Cetak
    // Kita kirim tanggal lewat URL Parameter (?start=...&end=...)
    let url = `/dashboard/laporan_cetak.html`;
    const params = [];
    if(s) params.push(`start=${s}`);
    if(e) params.push(`end=${e}`);
    
    if (params.length > 0) {
        url += `?${params.join("&")}`;
    }

    // Buka di Tab Baru
    window.open(url, '_blank');
  });
}

// Backward Compatibility (Agar tidak error jika dipanggil di tempat lain)
window.loadHasilWP = window.loadHasilWP || loadHasilWP;
window.renderLaporan = window.renderLaporan || renderLaporan;