// ============================================================
// laporan.js
// 🔹 Menampilkan laporan hasil Weighted Product
// ============================================================
import { authFetch, formatDate } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tableContainer = document.getElementById("laporan-table");
  const saranEl = document.getElementById("saran-terbaik");
  const btnPDF = document.getElementById("btn-pdf");
  const btnExcel = document.getElementById("btn-excel");

  if (!tableContainer) return;

  tableContainer.innerHTML = `<p class="loading-text">📄 Memuat laporan...</p>`;

  try {
    const res = await authFetch("/api/spk/laporan");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.length) {
      tableContainer.innerHTML = `<p class="error-text">⚠️ Belum ada laporan tersimpan.</p>`;
      return;
    }

    const grouped = data.reduce((acc, row) => {
      if (!acc[row.tanggal]) acc[row.tanggal] = [];
      acc[row.tanggal].push(row);
      return acc;
    }, {});

    tableContainer.innerHTML = Object.entries(grouped).map(([tanggal, records]) => `
      <div class="laporan-box">
        <h3 class="laporan-tanggal">🗓️ ${formatDate(tanggal)}</h3>
        <table class="result-table">
          <thead>
            <tr><th>Alternatif</th><th>Nilai Preferensi</th></tr>
          </thead>
          <tbody>
            ${records.map(r => `
              <tr class="${r.nama_alternatif === r.saran_terbaik ? "highlight" : ""}">
                <td>${r.nama_alternatif}</td>
                <td>${r.nilai_preferensi.toFixed(4)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <p class="saran-terbaik">💡 Saran Terbaik: <strong>${records[0].saran_terbaik}</strong></p>
      </div>
    `).join("");

    const latest = data[data.length - 1];
    if (latest && saranEl) saranEl.textContent = `💡 Saran Terbaik Terbaru: ${latest.saran_terbaik}`;

    // Tombol download
    const token = localStorage.getItem("token");
    btnPDF?.addEventListener("click", () => window.open(`/api/spk/laporan/pdf?token=${token}`, "_blank"));
    btnExcel?.addEventListener("click", () => window.open(`/api/spk/laporan/excel?token=${token}`, "_blank"));

  } catch (err) {
    console.error("❌ Gagal memuat laporan:", err);
    tableContainer.innerHTML = `<p class="error-text">❌ Gagal mengambil data laporan.</p>`;
  }
});
