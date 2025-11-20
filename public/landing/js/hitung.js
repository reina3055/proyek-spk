// ============================================================
// hitung.js
// 🔹 Menjalankan perhitungan Weighted Product dan menampilkan hasil
// ============================================================
import { authFetch } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnHitung = document.getElementById("btn-hitung-wp");
  const hasilContainer = document.getElementById("hasil-wp");

  if (!btnHitung || !hasilContainer) {
    console.warn("⚠️ Elemen tombol atau hasil tidak ditemukan di halaman hitung.html");
    return;
  }

  btnHitung.addEventListener("click", async () => {
    hasilContainer.innerHTML = `
      <div class="loading-text">🔄 Sedang menghitung Weighted Product...</div>
    `;

    try {
      const res = await authFetch("/api/spk/calculate");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        hasilContainer.innerHTML = `
          <p class="error-text">⚠️ Tidak ada hasil yang bisa dihitung. Pastikan data nilai lengkap di dashboard.</p>
        `;
        return;
      }

      hasilContainer.innerHTML = `
        <table class="result-table">
          <thead>
            <tr>
              <th>Nama Alternatif</th>
              <th>Nilai Preferensi</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((a, i) => `
              <tr class="${i === 0 ? "highlight" : ""}">
                <td>${a.nama_alternatif}</td>
                <td>${a.nilai_preferensi.toFixed(4)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <p class="saran-terbaik">💡 Saran Terbaik: <strong>${data[0].nama_alternatif}</strong></p>
        <div class="action-buttons">
          <button id="btn-simpan-laporan" class="btn-secondary">Simpan ke Laporan</button>
        </div>
      `;

      // Event untuk simpan laporan
      const simpanBtn = document.getElementById("btn-simpan-laporan");
      simpanBtn.addEventListener("click", async () => {
        const tanggal = new Date().toISOString().slice(0, 10);
        const saran = data[0].nama_alternatif;

        try {
          for (const h of data) {
            await authFetch("/api/spk/laporan", {
              method: "POST",
              body: JSON.stringify({
                tanggal,
                nama_alternatif: h.nama,
                nilai_preferensi: h.nilai,
                saran_terbaik: saran
              })
            });
          }
          alert("✅ Laporan berhasil disimpan!");
        } catch (err) {
          console.error("❌ Gagal menyimpan laporan:", err);
          alert("❌ Terjadi kesalahan saat menyimpan laporan.");
        }
      });

    } catch (err) {
      console.error("❌ Error hitung WP:", err);
      hasilContainer.innerHTML = `
        <p class="error-text">Gagal menghitung Weighted Product. Periksa data di dashboard.</p>
      `;
    }
  });
});
