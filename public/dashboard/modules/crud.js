// ============================================================
// 🔹 Input Nilai — versi interaktif
// ============================================================
import { authFetch } from "./utils.js";

export async function renderInputNilai() {
  const container = document.getElementById("nilai-container");
  if (!container) return;

  container.innerHTML = `<p class="text-gray-500 text-center py-4">Memuat tabel nilai...</p>`;

  try {
    // Ambil data alternatif dan kriteria
    const [altRes, kriRes] = await Promise.all([
      authFetch("/api/spk/alternatif"),
      authFetch("/api/spk/kriteria")
    ]);
    const [alternatif, kriteria] = await Promise.all([
      altRes.json(),
      kriRes.json()
    ]);

    if (!alternatif.length || !kriteria.length) {
      container.innerHTML = `<p class="text-red-500 text-center py-4">Data alternatif atau kriteria kosong!</p>`;
      return;
    }

    // Ambil data nilai
    const nilaiRes = await authFetch("/api/spk/nilai");
    //const nilaiList = await nilaiRes.json();
    //ganti dengan
    let nilaiList = [];

    try {
      const json = await nilaiRes.json();
      if (Array.isArray(json)) nilaiList = json;
      else {
        console.warn("⚠️ Response bukan array:", json);
        nilaiList = [];
      }
    } catch (e) {
      console.error("Gagal parse nilaiRes JSON:", e);
      nilaiList = [];
    }

    // Buat peta nilai {id_alternatif: {id_kriteria: nilai}}
    // const nilaiMap = {};
    // nilaiList.forEach(n => {
    //   if (!nilaiMap[n.id_alternatif]) nilaiMap[n.id_alternatif] = {};
    //   nilaiMap[n.id_alternatif][n.id_kriteria] = n.nilai;
    // });

    //ganti dengan

    const nilaiMap = {};
    for (const n of nilaiList) {
      if (!nilaiMap[n.id_alternatif]) nilaiMap[n.id_alternatif] = {};
      nilaiMap[n.id_alternatif][n.id_kriteria] = n.nilai;
}

    // Buat tabel interaktif
    const headerRow = kriteria.map(k => `<th class="px-3 py-2 border">${k.nama_kriteria}</th>`).join("");
    const bodyRows = alternatif.map(a => {
      const nilaiCells = kriteria.map(k => {
        const v = nilaiMap[a.id_alternatif]?.[k.id_kriteria] ?? "";
        return `<td class="px-3 py-2 border">
          <input type="number" step="0.01" min="0" 
                 class="w-full border rounded px-2 py-1 nilai-input"
                 data-alt="${a.id_alternatif}" data-kri="${k.id_kriteria}" value="${v}">
        </td>`;
      }).join("");

      return `<tr>
        <td class="px-3 py-2 border font-medium">${a.nama_obat}</td>
        ${nilaiCells}
      </tr>`;
    }).join("");

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 text-sm">
          <thead class="bg-purple-100">
            <tr>
              <th class="px-3 py-2 border">Alternatif</th>
              ${headerRow}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <div class="text-right mt-4">
        <button id="simpan-nilai" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Simpan Nilai
        </button>
      </div>
    `;

    // Simpan data ke server
    document.getElementById("simpan-nilai").addEventListener("click", async () => {
      const inputs = document.querySelectorAll(".nilai-input");
      const payload = [];

      inputs.forEach(inp => {
        const nilai = parseFloat(inp.value);
        if (isNaN(nilai)) return;
        payload.push({
          id_alternatif: inp.dataset.alt,
          id_kriteria: inp.dataset.kri,
          nilai
        });
      });

      if (payload.length === 0) {
        alert("Tidak ada nilai yang diisi!");
        return;
      }

      try {
        const res = await authFetch("/api/spk/nilai/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        alert(data.message || "✅ Nilai berhasil disimpan!");
      } catch (err) {
        console.error("Simpan nilai gagal:", err);
        alert("❌ Gagal menyimpan nilai!");
      }
    });

  } catch (err) {
    console.error("renderInputNilai error:", err);
    container.innerHTML = `<p class="text-red-500 text-center py-4">Gagal memuat form nilai.</p>`;
  }
}

// backward compatibility
window.renderInputNilai = window.renderInputNilai || renderInputNilai;



// ============================================================
// crud.js
// 🔹 Modal & CRUD handler untuk kriteria & alternatif
// ============================================================
// import { authFetch } from "./utils.js";

// // ---------- Modal ----------
// export function openModal(type, id = null) {
//   const modalBackdrop = document.getElementById("modal-backdrop");
//   const crudModal = document.getElementById("crud-modal");
//   const modalTitle = document.getElementById("modal-title");
//   const modalBody = document.getElementById("modal-body");

//   let title = "";
//   let formHtml = "";

//   if (type === "kriteria") {
//     title = id ? "Edit Kriteria" : "Tambah Kriteria";
//     formHtml = `
//       <form id="form-kriteria" class="space-y-3">
//         <input type="hidden" name="id" value="${id || ""}">
//         <div>
//           <label class="block text-sm font-medium">Nama Kriteria</label>
//           <input type="text" name="nama_kriteria" class="w-full border rounded-lg px-3 py-2" required>
//         </div>
//         <div>
//           <label class="block text-sm font-medium">Bobot</label>
//           <input type="number" name="bobot" step="0.01" class="w-full border rounded-lg px-3 py-2" required>
//         </div>
//         <div>
//           <label class="block text-sm font-medium">Tipe</label>
//           <select name="tipe" class="w-full border rounded-lg px-3 py-2" required>
//             <option value="benefit">Benefit</option>
//             <option value="cost">Cost</option>
//           </select>
//         </div>
//       </form>`;
//   } else if (type === "alternatif") {
//     title = id ? "Edit Obat" : "Tambah Obat";
//     formHtml = `
//       <form id="form-alternatif" class="space-y-3">
//         <input type="hidden" name="id" value="${id || ""}">
//         <div>
//           <label class="block text-sm font-medium">Nama Obat</label>
//           <input type="text" name="nama_obat" class="w-full border rounded-lg px-3 py-2" required>
//         </div>
//       </form>`;
//   }

//   modalTitle.textContent = title;
//   modalBody.innerHTML = formHtml;
//   modalBackdrop.classList.remove("hidden");
//   crudModal.classList.remove("hidden");
// }

// export function closeModal() {
//   document.getElementById("modal-backdrop").classList.add("hidden");
//   document.getElementById("crud-modal").classList.add("hidden");
// }

// // ---------- Kriteria CRUD ----------
// export async function loadKriteria() {
//   const tbody = document.getElementById("tbody-kriteria");
//   if (!tbody) return;
//   tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;

//   try {
//     const res = await authFetch("/api/spk/kriteria");
//     const data = await res.json();
//     tbody.innerHTML = data
//       .map(
//         (k) => `
//         <tr>
//           <td class="px-4 py-2">C${k.id_kriteria}</td>
//           <td class="px-4 py-2">${k.nama_kriteria}</td>
//           <td class="px-4 py-2">${k.bobot}</td>
//           <td class="px-4 py-2">${k.tipe}</td>
//           <td class="px-4 py-2 text-right space-x-2">
//             <button onclick="openModal('kriteria', ${k.id_kriteria})" class="text-purple-600 hover:underline">Edit</button>
//             <button onclick="hapusKriteria(${k.id_kriteria})" class="text-red-600 hover:underline">Hapus</button>
//           </td>
//         </tr>`
//       )
//       .join("");
//   } catch (err) {
//     console.error("loadKriteria error:", err);
//     tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
//   }
// }

// export async function handleFormSubmit() {
//   const form = document.querySelector("#crud-modal form");
//   if (!form) return;

//   const formData = new FormData(form);
//   const id = formData.get("id");
//   const body = Object.fromEntries(formData.entries());

//   const isKriteria = form.id === "form-kriteria" || form.getAttribute("id") === "form-kriteria";

//   try {
//     const endpoint = isKriteria ? "/api/spk/kriteria" : "/api/spk/alternatif";
//     const res = await authFetch(`${endpoint}${id ? `/${id}` : ""}`, {
//       method: id ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     alert(data.message || "Berhasil disimpan!");
//     closeModal();
//     if (isKriteria) loadKriteria(); else loadAlternatif();
//   } catch (err) {
//     console.error("handleFormSubmit error:", err);
//     alert("❌ Gagal menyimpan data!");
//   }
// }

// export async function hapusKriteria(id) {
//   if (!confirm("Yakin ingin menghapus kriteria ini?")) return;
//   try {
//     await authFetch(`/api/spk/kriteria/${id}`, { method: "DELETE" });
//     loadKriteria();
//   } catch (err) {
//     console.error("hapusKriteria error:", err);
//     alert("Gagal menghapus kriteria.");
//   }
// }

// // ---------- Alternatif CRUD ----------
// export async function loadAlternatif() {
//   const tbody = document.getElementById("tbody-alternatif");
//   if (!tbody) return;

//   tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;
//   try {
//     const res = await authFetch("/api/spk/alternatif");
//     const data = await res.json();
//     tbody.innerHTML = data
//       .map(
//         (a) => `
//         <tr>
//           <td class="px-4 py-2">A${a.id_alternatif}</td>
//           <td class="px-4 py-2">${a.nama_obat}</td>
//           <td class="px-4 py-2 text-right space-x-2">
//             <button onclick="openModal('alternatif', ${a.id_alternatif})" class="text-purple-600 hover:underline">Edit</button>
//             <button onclick="hapusAlternatif(${a.id_alternatif})" class="text-red-600 hover:underline">Hapus</button>
//           </td>
//         </tr>`
//       )
//       .join("");
//   } catch (err) {
//     console.error("loadAlternatif error:", err);
//     tbody.innerHTML = `<tr><td colspan="3" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
//   }
// }

// export async function hapusAlternatif(id) {
//   if (!confirm("Yakin ingin menghapus alternatif ini?")) return;
//   try {
//     await authFetch(`/api/spk/alternatif/${id}`, { method: "DELETE" });
//     loadAlternatif();
//   } catch (err) {
//     console.error("hapusAlternatif error:", err);
//     alert("Gagal menghapus alternatif.");
//   }
// }

// // ---------- Input nilai (placeholder) ----------
// export function renderInputNilai() {
//   const container = document.getElementById("nilai-container");
//   if (!container) return;
//   container.innerHTML = `
//     <p class="text-gray-500 text-center py-4">
//       Modul input nilai belum diaktifkan pada versi ini.
//     </p>`;
// }

// // backward compatibility (attach ke window)
// window.openModal = window.openModal || openModal;
// window.closeModal = window.closeModal || closeModal;
// window.loadKriteria = window.loadKriteria || loadKriteria;
// window.loadAlternatif = window.loadAlternatif || loadAlternatif;
// window.renderInputNilai = window.renderInputNilai || renderInputNilai;
// window.handleFormSubmit = window.handleFormSubmit || handleFormSubmit;
// window.hapusKriteria = window.hapusKriteria || hapusKriteria;
// window.hapusAlternatif = window.hapusAlternatif || hapusAlternatif;


// ============================================================
// 🔹 Modal & CRUD Handler (GLOBAL)
// ============================================================
// window.openModal = (type, id = null) => {
//   const modalBackdrop = document.getElementById("modal-backdrop");
//   const crudModal = document.getElementById("crud-modal");
//   const modalTitle = document.getElementById("modal-title");
//   const modalBody = document.getElementById("modal-body");

//   let title = "";
//   let formHtml = "";

//   if (type === "kriteria") {
//     title = id ? "Edit Kriteria" : "Tambah Kriteria";
//     formHtml = `
//       <form id="form-kriteria" class="space-y-3">
//         <input type="hidden" name="id" value="${id || ""}">
//         <div>
//           <label class="block text-sm font-medium">Nama Kriteria</label>
//           <input type="text" name="nama" class="w-full border rounded-lg px-3 py-2" required>
//         </div>
//         <div>
//           <label class="block text-sm font-medium">Bobot</label>
//           <input type="number" name="bobot" step="0.01" class="w-full border rounded-lg px-3 py-2" required>
//         </div>
//         <div>
//           <label class="block text-sm font-medium">Tipe</label>
//           <select name="tipe" class="w-full border rounded-lg px-3 py-2" required>
//             <option value="benefit">Benefit</option>
//             <option value="cost">Cost</option>
//           </select>
//         </div>
//       </form>`;
//   } else if (type === "alternatif") {
//     title = id ? "Edit Obat" : "Tambah Obat";
//     formHtml = `
//       <form id="form-alternatif" class="space-y-3">
//         <input type="hidden" name="id" value="${id || ""}">
//         <div>
//           <label class="block text-sm font-medium">Nama Obat</label>
//           <input type="text" name="nama_obat" class="w-full border rounded-lg px-3 py-2" required>
//         </div>
//       </form>`;
//   }

//   modalTitle.textContent = title;
//   modalBody.innerHTML = formHtml;
//   modalBackdrop.classList.remove("hidden");
//   crudModal.classList.remove("hidden");
// };

// window.closeModal = () => {
//   document.getElementById("modal-backdrop").classList.add("hidden");
//   document.getElementById("crud-modal").classList.add("hidden");
// };

// // ============================================================
// // 🔹 CRUD Kriteria
// // ============================================================
// window.loadKriteria = async () => {
//   const tbody = document.getElementById("tbody-kriteria");
//   if (!tbody) return;
//   tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;

//   try {
//     const res = await authFetch("/api/spk/kriteria");
//     const data = await res.json();
//     tbody.innerHTML = data
//       .map(
//         (k) => `
//         <tr>
//           <td class="px-4 py-2">C${k.id_kriteria}</td>
//           <td class="px-4 py-2">${k.nama_kriteria}</td>
//           <td class="px-4 py-2">${k.bobot}</td>
//           <td class="px-4 py-2">${k.tipe}</td>
//           <td class="px-4 py-2 text-right space-x-2">
//             <button onclick="openModal('kriteria', ${k.id_kriteria})" class="text-purple-600 hover:underline">Edit</button>
//             <button onclick="hapusKriteria(${k.id_kriteria})" class="text-red-600 hover:underline">Hapus</button>
//           </td>
//         </tr>`
//       )
//       .join("");
//   } catch (err) {
//     tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
//   }
// };

// window.handleFormSubmit = async () => {
//   const form = document.querySelector("#crud-modal form");
//   if (!form) return;

//   const formData = new FormData(form);
//   const id = formData.get("id");
//   const body = Object.fromEntries(formData.entries());
//   const isKriteria = form.id === "form-kriteria";

//   try {
//     const endpoint = isKriteria ? "/api/spk/kriteria" : "/api/spk/alternatif";
//     const res = await authFetch(`${endpoint}${id ? `/${id}` : ""}`, {
//       method: id ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     alert(data.message || "Berhasil disimpan!");
//     closeModal();
//     if (isKriteria) loadKriteria(); else loadAlternatif();
//   } catch {
//     alert("❌ Gagal menyimpan data!");
//   }
// };

// window.hapusKriteria = async (id) => {
//   if (!confirm("Yakin ingin menghapus kriteria ini?")) return;
//   await authFetch(`/api/spk/kriteria/${id}`, { method: "DELETE" });
//   loadKriteria();
// };

// window.loadAlternatif = async () => {
//   const tbody = document.getElementById("tbody-alternatif");
//   if (!tbody) return;

//   tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6 text-gray-500">Memuat...</td></tr>`;
//   try {
//     const res = await authFetch("/api/spk/alternatif");
//     const data = await res.json();
//     tbody.innerHTML = data
//       .map(
//         (a) => `
//         <tr>
//           <td class="px-4 py-2">A${a.id_alternatif}</td>
//           <td class="px-4 py-2">${a.nama_obat}</td>
//           <td class="px-4 py-2 text-right space-x-2">
//             <button onclick="openModal('alternatif', ${a.id_alternatif})" class="text-purple-600 hover:underline">Edit</button>
//             <button onclick="hapusAlternatif(${a.id_alternatif})" class="text-red-600 hover:underline">Hapus</button>
//           </td>
//         </tr>`
//       )
//       .join("");
//   } catch {
//     tbody.innerHTML = `<tr><td colspan="3" class="text-center text-red-500 py-6">Gagal memuat data.</td></tr>`;
//   }
// };

// window.hapusAlternatif = async (id) => {
//   if (!confirm("Yakin ingin menghapus alternatif ini?")) return;
//   await authFetch(`/api/spk/alternatif/${id}`, { method: "DELETE" });
//   loadAlternatif();
// };

// window.renderInputNilai = async () => {
//   const container = document.getElementById("nilai-container");
//   container.innerHTML = `
//     <p class="text-gray-500 text-center py-4">
//       Modul input nilai belum diaktifkan pada versi ini.
//     </p>`;
// };
