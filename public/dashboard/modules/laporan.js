import { authFetch } from "./utils.js"

// ============================================================
// 🔹 HASIL WP & LAPORAN
// ============================================================
window.loadHasilWP = async () => {
  const tbody = document.getElementById("tbody-hasil");
  tbody.innerHTML = "<tr><td colspan='2' class='text-center py-6 text-gray-500'>Menghitung...</td></tr>";

  try {
    const res = await authFetch("/api/spk/calculate");
    const data = await res.json();

    tbody.innerHTML = data
      .map(
        (h, i) => `
      <tr class="${i === 0 ? "bg-purple-50 font-semibold" : ""}">
        <td class="px-4 py-2">${h.nama_alternatif}</td>
        <td class="px-4 py-2">${h.nilai_preferensi.toFixed(4)}</td>
      </tr>`
      )
      .join("");

    const saranEl = document.getElementById("saran-obat");
    saranEl.textContent = data.length ? `💊 Saran Obat Terbaik: ${data[0].nama_alternatif}` : "";
  } catch {
    tbody.innerHTML = "<tr><td colspan='2' class='text-center text-red-500 py-6'>Gagal menghitung WP.</td></tr>";
  }
};

window.renderLaporan = async () => {
  const container = document.getElementById("laporan-container");
  container.innerHTML = `
    <div class="mb-4 flex space-x-2 items-center">
      <input type="date" id="start-date" class="border px-3 py-2 rounded">
      <span>s.d.</span>
      <input type="date" id="end-date" class="border px-3 py-2 rounded">
      <button id="filter-btn" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Filter</button>
    </div>
    <div class="flex space-x-2 mb-4">
      <button id="btn-excel" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Unduh Excel</button>
      <button id="btn-pdf" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Unduh PDF</button>
    </div>
    <div id="laporan-table"></div>
  `;

  const tableContainer = document.getElementById("laporan-table");

  async function loadLaporan(start, end) {
    tableContainer.innerHTML = "<p class='text-gray-500'>Memuat laporan...</p>";
    try {
      const url = start && end ? `/api/spk/laporan?start=${start}&end=${end}` : `/api/spk/laporan`;
      const res = await authFetch(url);
      const data = await res.json();

      if (data.length === 0) {
        tableContainer.innerHTML = "<p class='text-gray-500'>Tidak ada data untuk periode ini.</p>";
        return;
      }

      tableContainer.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2">Tanggal</th>
              <th class="px-4 py-2">Nama Obat</th>
              <th class="px-4 py-2">Nilai Preferensi</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (r) => `
              <tr>
                <td class="px-4 py-2">${r.tanggal}</td>
                <td class="px-4 py-2">${r.nama_alternatif}</td>
                <td class="px-4 py-2">${r.nilai_preferensi.toFixed(4)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>`;
    } catch {
      tableContainer.innerHTML = "<p class='text-red-500'>Gagal memuat laporan.</p>";
    }
  }

  loadLaporan();

  document.getElementById("filter-btn").addEventListener("click", () => {
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    if (!start || !end) return alert("Pilih rentang tanggal terlebih dahulu!");
    loadLaporan(start, end);
  });

  document.getElementById("btn-excel").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  window.open(`/api/spk/laporan/excel?token=${token}`, "_blank");
});
document.getElementById("btn-pdf").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  window.open(`/api/spk/laporan/pdf?token=${token}`, "_blank");
});
}