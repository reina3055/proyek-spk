import { authFetch } from "../modules/utils.js";
window.authFetch = authFetch;

export async function loadHasilWP() {
  const tbody = document.getElementById("tbody-hasil");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr><td colspan="2" class="text-center py-4 text-gray-500">Menghitung...</td></tr>
  `;

  try {
    const res = await authFetch("/api/spk/calculate");
    const data = await res.json();

    tbody.innerHTML = data.map((h, i) => {
      // fleksibel: cek nama field yang tersedia
      const nama = h.nama ?? h.nama_alternatif;
      const nilai = h.preferensi ?? h.nilai_preferensi;

      return `
        <tr class="${i === 0 ? "bg-purple-50 font-semibold" : ""}">
          <td class="px-4 py-2">${nama}</td>
          <td class="px-4 py-2">${Number(nilai).toFixed(4)}</td>
        </tr>
      `;
    }).join("");

    document.getElementById("saran-obat").textContent =
      `💊 Saran Obat Terbaik: ${data[0].nama ?? data[0].nama_alternatif}`;

  } catch (err) {
    console.error("loadHasilWP error:", err);
    tbody.innerHTML = `
      <tr><td colspan="2" class="text-center text-red-500 py-6">
        Gagal memuat hasil WP.
      </td></tr>`;
  }
}


// ============================================================
// 🟣 Render Laporan (Tetap sama, cuma tombolnya diganti eventnya)
// ============================================================
export async function renderLaporan() {
  const container = document.getElementById("laporan-container");
  if (!container) return;

  container.innerHTML = `
    <div class="mb-4 flex space-x-2 items-center">
      <input type="date" id="start-date" class="border px-3 py-2 rounded w-40">
      <span>s.d.</span>
      <input type="date" id="end-date" class="border px-3 py-2 rounded w-40">
      <button id="filter-btn" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Filter</button>
    </div>

    <div class="flex space-x-2 mb-4">
      <button id="btn-excel" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Unduh Excel</button>
      <button id="btn-pdf" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Unduh PDF</button>
    </div>

    <div id="laporan-container"></div>
  `;

  const tableContainer = document.getElementById("laporan-container");

async function loadLaporanData(start, end) {
    tableContainer.innerHTML = "<p class='text-gray-500'>Memuat laporan...</p>";

    try {
      const url = start && end ? `/api/spk/laporan?start=${start}&end=${end}` : `/api/spk/laporan`;
      const res = await authFetch(url);
      if (!res.ok) throw new Error(`status ${res.status}`);

      const data = await res.json();
      console.log("DATA LAPORAN RAW =", data);
console.log("TIPE =", Array.isArray(data) ? "ARRAY" : typeof data);

      if (!data || data.length === 0) {
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
                <td class="px-4 py-2">${Number(r.nilai_preferensi).toFixed(4)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      `;
    } catch (err) {
      console.error("loadLaporanData error:", err);
      tableContainer.innerHTML = "<p class='text-red-500'>Gagal memuat laporan.</p>";
    }
  }

  loadLaporanData();

// ============================================================
// 🟣 Fungsi Download Excel
// ============================================================
async function downloadExcel() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/spk/laporan/excel", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Gagal mengunduh Excel");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_spk.xlsx";
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("downloadExcel error:", err);
    alert("Gagal mengunduh file Excel");
  }
}

// ============================================================
// 🟣 Fungsi Download PDF
// ============================================================
async function downloadPDF() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/spk/laporan/pdf", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Gagal mengunduh PDF");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_spk.pdf";
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("downloadPDF error:", err);
    alert("Gagal mengunduh file PDF");
  }
}


  // Filter button
  document.getElementById("filter-btn").addEventListener("click", () => {
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    if (!start || !end) return alert("Pilih rentang tanggal terlebih dahulu!");
    loadLaporanData(start, end);
  });

  // >>>>> Replace old Excel/PDF events
  document.getElementById("btn-excel").addEventListener("click", downloadExcel);
  document.getElementById("btn-pdf").addEventListener("click", downloadPDF);
}

// backward compatibility
window.loadHasilWP = window.loadHasilWP || loadHasilWP;
window.renderLaporan = window.renderLaporan || renderLaporan;



// // ============================================================
// // laporan.js
// // 🔹 Hasil WP & Laporan
// // ============================================================
// import { authFetch } from "./utils.js";

// export async function loadHasilWP() {
//   const tbody = document.getElementById("tbody-hasil");
//   if (!tbody) return;
//   tbody.innerHTML = "<tr><td colspan='2' class='text-center py-6 text-gray-500'>Menghitung...</td></tr>";

//   try {
//     const res = await authFetch("/api/spk/calculate");
//     if (!res.ok) throw new Error(`status ${res.status}`);
//     const data = await res.json();

//     tbody.innerHTML = data
//       .map(
//         (h, i) => `
//       <tr class="${i === 0 ? "bg-purple-50 font-semibold" : ""}">
//         <td class="px-4 py-2">${h.nama}</td>
//         <td class="px-4 py-2">${Number(h.nilai).toFixed(4)}</td>
//       </tr>`
//       )
//       .join("");

//     const saranEl = document.getElementById("saran-obat");
//     if (saranEl) saranEl.textContent = data.length ? `💊 Saran Obat Terbaik: ${data[0].nama}` : "";
//   } catch (err) {
//     console.error("loadHasilWP error:", err);
//     tbody.innerHTML = "<tr><td colspan='2' class='text-center text-red-500 py-6'>Gagal menghitung WP.</td></tr>";
//   }
// }

// export async function renderLaporan() {
//   const container = document.getElementById("laporan-container");
//   if (!container) return;
//   container.innerHTML = `
//     <div class="mb-4 flex space-x-2 items-center">
//       <input type="date" id="start-date" class="border px-3 py-2 rounded">
//       <span>s.d.</span>
//       <input type="date" id="end-date" class="border px-3 py-2 rounded">
//       <button id="filter-btn" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Filter</button>
//     </div>
//     <div class="flex space-x-2 mb-4">
//       <button id="btn-excel" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Unduh Excel</button>
//       <button id="btn-pdf" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Unduh PDF</button>
//     </div>
//     <div id="laporan-table"></div>
//   `;

//   const tableContainer = document.getElementById("laporan-table");

//   async function loadLaporanData(start, end) {
//     tableContainer.innerHTML = "<p class='text-gray-500'>Memuat laporan...</p>";
//     try {
//       const url = start && end ? `/api/spk/laporan?start=${start}&end=${end}` : `/api/spk/laporan`;
//       const res = await authFetch(url);
//       if (!res.ok) throw new Error(`status ${res.status}`);
//       const data = await res.json();

//       if (!data || data.length === 0) {
//         tableContainer.innerHTML = "<p class='text-gray-500'>Tidak ada data untuk periode ini.</p>";
//         return;
//       }

//       tableContainer.innerHTML = `
//         <table class="min-w-full divide-y divide-gray-200 border">
//           <thead class="bg-gray-100">
//             <tr>
//               <th class="px-4 py-2">Tanggal</th>
//               <th class="px-4 py-2">Nama Obat</th>
//               <th class="px-4 py-2">Nilai Preferensi</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${data
//               .map(
//                 (r) => `
//               <tr>
//                 <td class="px-4 py-2">${r.tanggal}</td>
//                 <td class="px-4 py-2">${r.nama_alternatif}</td>
//                 <td class="px-4 py-2">${Number(r.nilai_preferensi).toFixed(4)}</td>
//               </tr>`
//               )
//               .join("")}
//           </tbody>
//         </table>`;
//     } catch (err) {
//       console.error("loadLaporanData error:", err);
//       tableContainer.innerHTML = "<p class='text-red-500'>Gagal memuat laporan.</p>";
//     }
//   }

//   loadLaporanData();

//   document.getElementById("filter-btn").addEventListener("click", () => {
//     const start = document.getElementById("start-date").value;
//     const end = document.getElementById("end-date").value;
//     if (!start || !end) return alert("Pilih rentang tanggal terlebih dahulu!");
//     loadLaporanData(start, end);
//   });

//   // document.getElementById("btn-excel").addEventListener("click", () => {
//   //   const token = localStorage.getItem("token");
//   //   window.open(`/api/spk/laporan/excel?token=${token}`, "_blank");
//   // });
//   // document.getElementById("btn-pdf").addEventListener("click", () => {
//   //   const token = localStorage.getItem("token");
//   //   window.open(`/api/spk/laporan/pdf?token=${token}`, "_blank");
//   // });
//   document.getElementById("btn-excel").addEventListener("click", downloadExcel);
// document.getElementById("btn-pdf").addEventListener("click", downloadPDF);

// }

// // backward compatibility
// window.loadHasilWP = window.loadHasilWP || loadHasilWP;
// window.renderLaporan = window.renderLaporan || renderLaporan;


// // import { authFetch } from "./utils.js"

// // // ============================================================
// // // 🔹 HASIL WP & LAPORAN
// // // ============================================================
// // window.loadHasilWP = async () => {
// //   const tbody = document.getElementById("tbody-hasil");
// //   tbody.innerHTML = "<tr><td colspan='2' class='text-center py-6 text-gray-500'>Menghitung...</td></tr>";

// //   try {
// //     const res = await authFetch("/api/spk/calculate");
// //     const data = await res.json();

// //     tbody.innerHTML = data
// //       .map(
// //         (h, i) => `
// //       <tr class="${i === 0 ? "bg-purple-50 font-semibold" : ""}">
// //         <td class="px-4 py-2">${h.nama_alternatif}</td>
// //         <td class="px-4 py-2">${h.nilai_preferensi.toFixed(4)}</td>
// //       </tr>`
// //       )
// //       .join("");

// //     const saranEl = document.getElementById("saran-obat");
// //     saranEl.textContent = data.length ? `💊 Saran Obat Terbaik: ${data[0].nama_alternatif}` : "";
// //   } catch {
// //     tbody.innerHTML = "<tr><td colspan='2' class='text-center text-red-500 py-6'>Gagal menghitung WP.</td></tr>";
// //   }
// // };

// // window.renderLaporan = async () => {
// //   const container = document.getElementById("laporan-container");
// //   container.innerHTML = `
// //     <div class="mb-4 flex space-x-2 items-center">
// //       <input type="date" id="start-date" class="border px-3 py-2 rounded">
// //       <span>s.d.</span>
// //       <input type="date" id="end-date" class="border px-3 py-2 rounded">
// //       <button id="filter-btn" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Filter</button>
// //     </div>
// //     <div class="flex space-x-2 mb-4">
// //       <button id="btn-excel" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Unduh Excel</button>
// //       <button id="btn-pdf" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Unduh PDF</button>
// //     </div>
// //     <div id="laporan-table"></div>
// //   `;

// //   const tableContainer = document.getElementById("laporan-table");

// //   async function loadLaporan(start, end) {
// //     tableContainer.innerHTML = "<p class='text-gray-500'>Memuat laporan...</p>";
// //     try {
// //       const url = start && end ? `/api/spk/laporan?start=${start}&end=${end}` : `/api/spk/laporan`;
// //       const res = await authFetch(url);
// //       const data = await res.json();

// //       if (data.length === 0) {
// //         tableContainer.innerHTML = "<p class='text-gray-500'>Tidak ada data untuk periode ini.</p>";
// //         return;
// //       }

// //       tableContainer.innerHTML = `
// //         <table class="min-w-full divide-y divide-gray-200 border">
// //           <thead class="bg-gray-100">
// //             <tr>
// //               <th class="px-4 py-2">Tanggal</th>
// //               <th class="px-4 py-2">Nama Obat</th>
// //               <th class="px-4 py-2">Nilai Preferensi</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             ${data
// //               .map(
// //                 (r) => `
// //               <tr>
// //                 <td class="px-4 py-2">${r.tanggal}</td>
// //                 <td class="px-4 py-2">${r.nama_alternatif}</td>
// //                 <td class="px-4 py-2">${r.nilai_preferensi.toFixed(4)}</td>
// //               </tr>`
// //               )
// //               .join("")}
// //           </tbody>
// //         </table>`;
// //     } catch {
// //       tableContainer.innerHTML = "<p class='text-red-500'>Gagal memuat laporan.</p>";
// //     }
// //   }

// //   loadLaporan();

// //   document.getElementById("filter-btn").addEventListener("click", () => {
// //     const start = document.getElementById("start-date").value;
// //     const end = document.getElementById("end-date").value;
// //     if (!start || !end) return alert("Pilih rentang tanggal terlebih dahulu!");
// //     loadLaporan(start, end);
// //   });

// //   document.getElementById("btn-excel").addEventListener("click", () => {
// //   const token = localStorage.getItem("token");
// //   window.open(`/api/spk/laporan/excel?token=${token}`, "_blank");
// // });
// // document.getElementById("btn-pdf").addEventListener("click", () => {
// //   const token = localStorage.getItem("token");
// //   window.open(`/api/spk/laporan/pdf?token=${token}`, "_blank");
// // });
// // }